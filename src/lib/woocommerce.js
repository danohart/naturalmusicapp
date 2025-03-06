import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const createWooCommerceClient = () => {
  return new WooCommerceRestApi({
    url:
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_PROD_URL
        : process.env.NEXT_PUBLIC_DEV_URL,
    consumerKey: process.env.WOO_CONSUMER_KEY,
    consumerSecret: process.env.WOO_SECRET_KEY,
    version: "wc/v3",
  });
};

export async function getActiveSubscribers({ page = 1, perPage = 100 } = {}) {
  const api = createWooCommerceClient();
  console.log("API:", api);

  try {
    // Fetch active subscriptions
    const subscriptionsResponse = await api.get("subscriptions", {
      status: "active",
      page,
      per_page: perPage,
    });

    // Extract unique customer IDs
    const customerIds = [
      ...new Set(subscriptionsResponse.data.map((sub) => sub.customer_id)),
    ];

    // Fetch customer details for these IDs
    const customerPromises = customerIds.map(async (customerId) => {
      try {
        const customerResponse = await api.get(`customers/${customerId}`);
        return {
          id: customerResponse.data.id,
          email: customerResponse.data.email,
          firstName: customerResponse.data.first_name,
          lastName: customerResponse.data.last_name,
          fullName:
            `${customerResponse.data.first_name} ${customerResponse.data.last_name}`.trim(),
        };
      } catch (customerError) {
        console.error(`Error fetching customer ${customerId}:`, customerError);
        return null;
      }
    });

    // Wait for all customer details and filter out any failures
    const customers = (await Promise.all(customerPromises)).filter(
      (customer) => customer !== null
    );

    return customers;
  } catch (error) {
    console.error("Error fetching active subscribers:", error);
    return [];
  }
}

// Utility function to check if a user has an active paid subscription
export async function checkUserSubscription(userId) {
  const api = createWooCommerceClient();

  try {
    // Fetch user's subscriptions
    const response = await api.get("subscriptions", {
      customer: userId,
      status: "active", // Only check for active subscriptions
    });

    console.log("User subscriptions:", response);

    // Filter for paid subscriptions (you might need to adjust based on your specific subscription setup)
    const paidSubscriptions = response.data.filter(
      (subscription) =>
        subscription.status === "active" && subscription.total > 0
    );

    // Return true if user has any active paid subscriptions
    return paidSubscriptions.length > 0;
  } catch (error) {
    console.error("Error checking subscription:", error);
    return false;
  }
}

// Example middleware for protecting routes
export function withSubscriptionCheck(getServerSidePropsFunc) {
  return async (context) => {
    // Assume you have user authentication middleware that sets user ID
    const userId = context.req.user?.id;

    if (!userId) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const hasActiveSubscription = await checkUserSubscription(userId);

    if (!hasActiveSubscription) {
      return {
        redirect: {
          destination: "/subscribe",
          permanent: false,
        },
      };
    }

    // If user has a subscription, proceed with original getServerSideProps
    return getServerSidePropsFunc
      ? await getServerSidePropsFunc(context)
      : { props: {} };
  };
}
