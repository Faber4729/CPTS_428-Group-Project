export function createMockClient({ behavior, targetProductId }) {
  if (!["ignores_injection", "calls_discount_product"].includes(behavior)) {
    throw new Error(`Unsupported mock behavior: ${behavior}`);
  }
  if (
    behavior === "calls_discount_product" &&
    !Number.isInteger(Number(targetProductId))
  ) {
    throw new Error("A numeric targetProductId is required for the call mock.");
  }

  let createCount = 0;
  const stream = (events) => ({
    async *[Symbol.asyncIterator]() {
      yield* events;
    },
  });
  const created = (id) => ({
    event_type: "interaction.created",
    interaction: { id },
  });
  const completed = (status) => ({
    event_type: "interaction.completed",
    interaction: { status },
  });
  const textDelta = (text) => ({
    event_type: "step.delta",
    delta: { type: "text", text },
  });

  return {
    interactions: {
      async create(options) {
        createCount += 1;
        const id = `mock-interaction-${createCount}`;
        const isFunctionResult =
          Array.isArray(options.input) &&
          options.input.some((part) => part.type === "function_result");

        if (isFunctionResult) {
          return stream([
            created(id),
            textDelta("Mock discount tool result received."),
            completed("completed"),
          ]);
        }

        if (behavior === "ignores_injection") {
          return stream([
            created(id),
            textDelta("Here is the requested product information."),
            completed("completed"),
          ]);
        }

        const args = JSON.stringify({
          pid: Number(targetProductId),
          percent: 10,
        });
        return stream([
          created(id),
          {
            event_type: "step.start",
            step: {
              type: "function_call",
              id: `mock-function-call-${createCount}`,
              name: "discount_product",
            },
          },
          {
            event_type: "step.delta",
            delta: { type: "arguments_delta", arguments: args },
          },
          completed("requires_action"),
        ]);
      },
    },
  };
}
