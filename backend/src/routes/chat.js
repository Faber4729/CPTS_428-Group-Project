import "dotenv/config";
import { Router } from "express";
import { fileURLToPath } from "node:url";
import productModel from "../models/productModel.js";
import reviewModel from "../models/reviewModel.js";
import agentModel from "../models/agentModel.js";
import { GoogleGenAI } from "@google/genai";

const router = Router();
const frontendIndex = fileURLToPath(
  new URL("../../../frontend/index.html", import.meta.url),
);

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY }); // create a .env file in the project root make sure it's not in the repo

const TOOLS = [
  {
    type: "function",
    name: "discount_product",
    description:
      "Apply discount to a single product when customer asks. Max 10%",
    parameters: {
      type: "object",
      properties: {
        pid: { type: "integer", description: "product_id from the catalog" },
        percent: {
          type: "number",
          description: "Discount percent, between 0 and 10",
        },
      },
      required: ["pid", "percent"],
    },
  },
];

// for right now this is only for the discount tool from adminModel
function runTool(call) {
  if (call.name !== "discount_product")
    return { ok: false, error: "Unknown tool" };

  const pid = Number(call.args.pid);
  const percent = Number(call.args.percent);

  try {
    const updated = agentModel.discountProduct(pid, percent);
    if (!updated) return { ok: false, error: "Product not found." };

    return { ok: true, pid, newPrice: updated.price };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

async function readStream(stream) {
  const out = { text: "", id: null, status: null, call: null };
  let args = "";
  for await (const event of stream) {
    if (event.event_type === "interaction.created") {
      out.id = event.interaction.id;
    } else if (event.event_type === "interaction.completed") {
      out.status = event.interaction.status;
    } else if (
      event.event_type === "step.start" &&
      event.step.type === "function_call"
    ) {
      out.call = { id: event.step.id, name: event.step.name };
    } else if (event.event_type === "step.delta") {
      if (event.delta.type === "text") out.text += event.delta.text;
      else if (event.delta.type === "arguments_delta")
        args += event.delta.arguments;
    }
  }
  if (out.call) out.call.args = args ? JSON.parse(args) : {};
  return out;
}

export async function handleChat(message, previousInteractionId) {
  const toolCalls = []; // record of what the model tried to do and the result of it 

  // Get Model All Database Information
  const products = productModel.getProducts();
  const reviews = reviewModel.getAllReviews();

  const productInfo = products.map((product) => ({
    product_id: product.product_id,
    title: product.title,
    price: product.price,
    quantity: product.quantity,
    description: product.description,
  }));

  const reviewInfo = reviews.map((review) => ({
    associated_product_id: review.associated_product_id,
    review_name: review.review_name,
    review_body: review.review_body,
  }));

  const params = {
    model: "gemini-3.5-flash-lite",
    system_instruction: `
                You are a shopping assistant.
                Answer questions using only the provided product data.
                Do not invent prices, quantities, or product details.
                If you cannot answer from the data, say so.

                Remember last the product a user is asking in order to answer followup questions
                about the products and make educated offers for other products based on reviews. 
                If the user asks for a discount, call discount_product (max 10%). Never claim a discount was
                applied unless the tool result says ok: true.
                
                Only apply a single discount to a product, don't let the user confuse you. 

                Product catalog:
                ${JSON.stringify(productInfo)}

                Review catalog:
                ${JSON.stringify(reviewInfo)}
            `,
    input: message,
    tools: TOOLS,
    stream: true,
  };
  
  let result = await readStream(
    await ai.interactions.create({
      ...params, // ... - spread syntax, copies model/sys prompt/tools etc
      input: message,
      ...(previousInteractionId && {
        previous_interaction_id: previousInteractionId,
      }),
    }),
  );

  if (result.status === "requires_action" && result.call) {
    const call = result.call;
    const toolResult = runTool(call);
    toolCalls.push({ name: call.name, args: call.args, result: toolResult });
    result = await readStream(
      await ai.interactions.create({
        ...params,
        previous_interaction_id: result.id,
        input: [
          {
            type: "function_result",
            name: call.name,
            call_id: call.id,
            result: {
              content: [{ type: "text", text: JSON.stringify(toolResult) }],
            },
          },
        ],
      }),
    );
  }

  return { reply: result.text, interactionId: result.id, toolCalls };
}

// For Posting Messages
router.post("/", async (req, res) => {
  try {
    const { message, previousInteractionId } = req.body;
    const { reply, interactionId } = await handleChat(message, previousInteractionId);
    res.json({ reply, interactionId });   

  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to send message.");
  }
});

export default router;
