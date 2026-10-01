// Client + server safe AI guardrails: input validation, prompt-injection screening,
// and financial-scope enforcement. Kept dependency-free so it can be imported from
// both server functions and validation code paths.

export const AI_REFUSAL_MESSAGE =
  "I'm designed exclusively for financial education, investing, markets, taxes, budgeting, and economic analysis. I can't assist with unrelated topics. Try asking about a stock, a loan calculation, tax slabs, retirement planning, or a currency conversion.";

export const AI_OUTPUT_DISCLAIMER =
  "This analysis is educational and should not be considered investment advice. Verify figures with a licensed financial advisor before acting.";

// Broad patterns for prompt-injection / jailbreak / system-prompt extraction.
const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all|any|previous|prior|above)\s+(instructions|prompts|rules)/i,
  /disregard\s+(all|any|previous|prior|above)\s+(instructions|prompts|rules)/i,
  /forget\s+(all|any|previous|prior|above)\s+(instructions|prompts|rules)/i,
  /reveal\s+(your|the)\s+(system|developer|hidden)\s+prompt/i,
  /show\s+(me\s+)?(your|the)\s+(system|developer|hidden|initial)\s+prompt/i,
  /print\s+(your|the)\s+(system|developer|hidden)\s+prompt/i,
  /you\s+are\s+now\s+(a|an)\s+/i,
  /pretend\s+to\s+be\s+/i,
  /roleplay\s+as\s+/i,
  /act\s+as\s+(a|an)\s+(?!financial|investment|equity|tax|mortgage|accounting|economic)/i,
  /jailbreak/i,
  /\bDAN\b\s*(mode|prompt)/i,
  /developer\s+mode/i,
  /override\s+(safety|guardrails|policy|policies|rules)/i,
  /bypass\s+(safety|guardrails|policy|policies|filter)/i,
  // Code / injection surfaces
  /<script[\s>]/i,
  /javascript:\s*[a-z]/i,
  /\bon(click|error|load)\s*=/i,
  /--\s*drop\s+table/i,
  /;\s*(drop|delete|truncate)\s+table\s+/i,
  /\bunion\s+select\b/i,
];

// Off-topic hard-block keywords. Kept narrow to avoid false positives on money words.
const OFFTOPIC_KEYWORDS = [
  "medical advice",
  "diagnose",
  "medication",
  "prescription",
  "political opinion",
  "vote for",
  "religion",
  "religious",
  "relationship advice",
  "dating",
  "girlfriend",
  "boyfriend",
  "homework",
  "essay",
  "write code",
  "write me code",
  "write a program",
  "hack ",
  "hacking",
  "exploit ",
  "malware",
  "phishing",
  "erotic",
  "sexual",
  "nsfw",
];

export type GuardrailResult =
  | { ok: true; cleaned: string }
  | { ok: false; reason: "empty" | "too_long" | "injection" | "offtopic" | "unsafe_code"; message: string };

const MIN_LEN = 1;
const MAX_LEN = 4000;

export function sanitizeUserPrompt(raw: unknown): GuardrailResult {
  if (typeof raw !== "string") {
    return { ok: false, reason: "empty", message: "Please enter a question." };
  }
  // Strip control chars, normalize whitespace, drop HTML tags entirely.
  let s = raw
    .replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, "")
    .replace(/<[^>]{0,200}>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (s.length < MIN_LEN) {
    return { ok: false, reason: "empty", message: "Please enter a question." };
  }
  if (s.length > MAX_LEN) {
    return {
      ok: false,
      reason: "too_long",
      message: `Please keep your question under ${MAX_LEN} characters.`,
    };
  }

  for (const re of INJECTION_PATTERNS) {
    if (re.test(s)) {
      return {
        ok: false,
        reason: "injection",
        message:
          "That request looks like it's trying to change how I work. I can only answer finance and investing questions — try rephrasing.",
      };
    }
  }

  const lower = s.toLowerCase();
  for (const kw of OFFTOPIC_KEYWORDS) {
    if (lower.includes(kw)) {
      return { ok: false, reason: "offtopic", message: AI_REFUSAL_MESSAGE };
    }
  }

  return { ok: true, cleaned: s };
}

// Escape a string so it can't break out of a system-prompt block when interpolated.
export function escapePromptSegment(s: string): string {
  return s.replace(/```/g, "'''").slice(0, MAX_LEN);
}
