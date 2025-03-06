import { getActiveSubscribers } from "../../lib/woocommerce";

export default async function handler(req, res) {
  try {
    // Handle pagination via query parameters
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 100;

    const activeSubscribers = await getActiveSubscribers({ page, perPage });

    res.status(200).json({
      total: activeSubscribers.length,
      page,
      subscribers: activeSubscribers,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch active subscribers",
      details: error.message,
    });
  }
}
