import { z } from "zod";

export const MAX_TURNS = 10;
export const MAX_USER_CHARS = 600;
const MAX_ASSISTANT_CHARS = 4000;

/** What the browser may send: a short, alternating-free list of user/assistant turns. Roles and sizes are enforced here, never trusted from the client. */
export const chatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(MAX_ASSISTANT_CHARS),
      }),
    )
    .min(1)
    .max(MAX_TURNS),
});

export type ChatMessage = z.infer<typeof chatRequestSchema>["messages"][number];

/** Returns cleaned messages ready for the model, or an error code. The conversation must end with a user message of reasonable length. */
export function validateChat(input: unknown): { ok: true; messages: ChatMessage[] } | { ok: false; error: "invalid" | "too_long" } {
  const parsed = chatRequestSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const messages = parsed.data.messages.map((m) => ({ role: m.role, content: m.content.replace(/\u0000/g, "").trim() })).filter((m) => m.content);
  const last = messages[messages.length - 1];
  if (!last || last.role !== "user" || messages[0].role !== "user") return { ok: false, error: "invalid" };
  if (messages.some((m) => m.role === "user" && m.content.length > MAX_USER_CHARS)) return { ok: false, error: "too_long" };
  return { ok: true, messages };
}
