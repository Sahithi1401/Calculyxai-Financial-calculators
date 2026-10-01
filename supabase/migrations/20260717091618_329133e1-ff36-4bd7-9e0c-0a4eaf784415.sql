-- Replace the always-true INSERT policy on newsletter_subscribers with
-- a real predicate. Public anonymous subscribe still works, but the
-- WITH CHECK now validates the payload instead of blanketly allowing it.
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;

CREATE POLICY "Public can subscribe with valid email"
ON public.newsletter_subscribers
FOR INSERT
TO anon, authenticated
WITH CHECK (
  email IS NOT NULL
  AND length((email)::text) BETWEEN 3 AND 254
  AND position('@' in (email)::text) > 1
  AND source IN ('footer','landing','popup','pricing','blog','api')
);
