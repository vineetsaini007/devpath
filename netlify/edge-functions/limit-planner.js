// Netlify enforces this limit before forwarding to the Next.js API route.
export default async function limitPlanner(_request, context) {
  return context.next();
}

export const config = {
  path: "/api/plan",
  rateLimit: {
    windowLimit: 5,
    windowSize: 60,
    aggregateBy: ["ip", "domain"],
  },
};
