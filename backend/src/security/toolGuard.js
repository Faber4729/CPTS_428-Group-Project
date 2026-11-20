export const MAX_DISCOUNT_PERCENT = 10;
export const MAX_DISCOUNTS_PER_MESSAGE = 1;

// Tools the agent can run
const ALLOWED_TOOLS = new Set(["discount_product", "get_shipping_info"]);

// Invisible / hidden-text characters:
//   U+E0000–U+E007F  Unicode tag characters ("ASCII smuggling")
//   U+200B–U+200F    zero-width space/joiners, LRM/RLM
//   U+202A–U+202E    bidi embedding/override
//   U+2060–U+2064    word joiner, invisible operators
//   U+2066–U+2069    bidi isolates
//   U+FEFF           zero-width no-break space / BOM
const INVISIBLE_CHARS =
  /[\u{E0000}-\u{E007F}\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u2069\uFEFF]/gu;
const HTML_COMMENTS = /<!--[\s\S]*?(-->|$)/g;

const DISCOUNT_INTENT =
  /\b(discount|coupon|promo(?:\s*code)?|cheaper|price\s*match)\b|\b\d+(?:\.\d+)?\s*(?:%|percent)\s*off\b/i;

// Remove text a human reader would not see. 
export function visibleText(text) {
  return String(text ?? "")
    .replace(HTML_COMMENTS, " ")
    .replace(INVISIBLE_CHARS, "");
}

function namesProduct(text, product) {
  const lower = text.toLowerCase();
  const id = Number(product.product_id);
  const byId = new RegExp(`\\b(?:product|item|id)\\s*(?:#|no\\.?|number)?\\s*${id}\\b`, "i");
  if (byId.test(text)) return true;
  const title = String(product.title ?? "").toLowerCase().trim();
  return title.length > 0 && lower.includes(title);
}

/**
 * Decide whether a tool call may run.
 *
 * @param {object} call        { name, args }
 * @param {object} context     { userMessage, products, discountsSoFar }
 * @returns {{ allowed: boolean, reason?: string }}
 */
export function checkToolCall(call, { userMessage, products = [], discountsSoFar = 0 } = {}) {
  if (!call || !ALLOWED_TOOLS.has(call.name)) {
    return { allowed: false, reason: `Tool not on allowlist: ${call?.name}` };
  }
  if (call.name !== "discount_product") return { allowed: true };

  const pid = Number(call.args?.pid);
  const percent = Number(call.args?.percent);

  if (!Number.isInteger(pid)) {
    return { allowed: false, reason: "Invalid product id." };
  }
  if (!Number.isFinite(percent) || percent <= 0 || percent > MAX_DISCOUNT_PERCENT) {
    return { allowed: false, reason: `Discount must be more than 0 and at most ${MAX_DISCOUNT_PERCENT}%.` };
  }
  if (discountsSoFar >= MAX_DISCOUNTS_PER_MESSAGE) {
    return { allowed: false, reason: "Only one discount per customer message." };
  }

  const product = products.find((p) => Number(p.product_id) === pid);
  if (!product) return { allowed: false, reason: "Product not found." };

  const visible = visibleText(userMessage);
  if (!DISCOUNT_INTENT.test(visible)) {
    return { allowed: false, reason: "The customer did not ask for a discount." };
  }
  if (!namesProduct(visible, product)) {
    return { allowed: false, reason: "The customer did not name this product." };
  }
  return { allowed: true };
}

// Mark untrusted text as data before it goes into the prompt: strip hidden 
// characters and remove anything that looks like our delimiter.
 
export function asUntrustedData(text) {
  return visibleText(text).replace(/<\/?untrusted_data>/gi, "");
}