export type Review = {
  /** Reviewer name exactly as published on the source platform. */
  name: string;
  role: string;
  location: string;
  /** 1–5. */
  rating: number;
  text: string;
  /** Where the review was left. */
  source: "G2" | "Product Hunt" | "Trustpilot" | "Email" | "Placeholder";
  /** ISO date (YYYY-MM-DD). */
  date: string;
  /** Absolute URL or imported asset. Falls back to initials when omitted. */
  avatar?: string;
  /** Link to the original review, when one exists publicly. */
  url?: string;
  /**
   * TRUE only for reviews genuinely submitted by a real person on a real
   * platform. Aggregate rating schema counts verified reviews only.
   */
  verified: boolean;
};

/**
 * ============================================================================
 * PASTE REAL REVIEWS HERE
 * ============================================================================
 * 1. Add each real review as an object in REVIEWS below, with `verified: true`
 *    and the true `source`, `date` and (where public) `url`.
 * 2. Delete the placeholder entries (source: "Placeholder") as real ones land.
 * 3. Flip ENABLE_AGGREGATE_RATING_SCHEMA to true ONLY once every entry with
 *    `verified: true` is a genuine, attributable review. Emitting
 *    AggregateRating markup for invented reviews is a Google spam violation
 *    and can get the domain penalised.
 * ============================================================================
 */
export const ENABLE_AGGREGATE_RATING_SCHEMA = false;

export const REVIEWS: Review[] = [
  {
    name: "Placeholder — early access user",
    role: "Software engineer",
    location: "Bengaluru, India",
    rating: 5,
    text: "Illustrative placeholder copy: the home loan engine and the stamp-duty breakdown replaced a spreadsheet I had maintained for two years.",
    source: "Placeholder",
    date: "2026-01-15",
    verified: false,
  },
  {
    name: "Placeholder — early access user",
    role: "Financial planner",
    location: "Austin, United States",
    rating: 5,
    text: "Illustrative placeholder copy: the refinance comparison view lays out break-even months clearly enough to show a client on a call.",
    source: "Placeholder",
    date: "2026-02-02",
    verified: false,
  },
  {
    name: "Placeholder — early access user",
    role: "Expat consultant",
    location: "Dubai, UAE",
    rating: 5,
    text: "Illustrative placeholder copy: live AED conversion plus a retirement corpus model in one workspace is exactly what NRI planning needs.",
    source: "Placeholder",
    date: "2026-02-20",
    verified: false,
  },
];

/** Reviews eligible for schema and for a public rating claim. */
export function verifiedReviews(): Review[] {
  return REVIEWS.filter((r) => r.verified && r.source !== "Placeholder");
}

/** Returns AggregateRating JSON-LD, or null when the flag or data says no. */
export function aggregateRatingSchema() {
  if (!ENABLE_AGGREGATE_RATING_SCHEMA) return null;
  const list = verifiedReviews();
  if (list.length === 0) return null;
  const avg = list.reduce((s, r) => s + r.rating, 0) / list.length;
  return {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    itemReviewed: {
      "@type": "SoftwareApplication",
      name: "Calculyx AI",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
    },
    ratingValue: avg.toFixed(1),
    bestRating: "5",
    worstRating: "1",
    ratingCount: list.length,
    reviewCount: list.length,
  };
}

/** Where the "Leave a review" button points. */
export const LEAVE_REVIEW_URL = "https://www.producthunt.com/products/calculyx-ai/reviews/new";
