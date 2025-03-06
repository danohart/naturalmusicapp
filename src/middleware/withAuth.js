// middleware/withAuth.js
import { getUserFromToken } from "../lib/auth";
import { checkUserSubscription } from "../lib/woocommerce";

// Middleware for protected routes (authentication only)
export function withAuth(getServerSidePropsFunc) {
  return async (context) => {
    const { req, res } = context;

    // Get token from cookie
    const token = req.cookies.wp_auth_token;

    if (!token) {
      return {
        redirect: {
          destination: `/login?redirect=${encodeURIComponent(req.url)}`,
          permanent: false,
        },
      };
    }

    // Validate token and get user
    const user = await getUserFromToken(token);

    if (!user) {
      // Clear invalid cookies
      res.setHeader("Set-Cookie", [
        "wp_auth_token=; Path=/; Max-Age=0",
        "wp_user_info=; Path=/; Max-Age=0",
      ]);

      return {
        redirect: {
          destination: `/login?redirect=${encodeURIComponent(req.url)}`,
          permanent: false,
        },
      };
    }

    // Add user to context
    context.user = user;

    // Call the original getServerSideProps if it exists
    return getServerSidePropsFunc
      ? await getServerSidePropsFunc(context)
      : { props: { user } };
  };
}

// Middleware for subscriber-only routes (authentication + subscription)
export function withSubscription(getServerSidePropsFunc) {
  return async (context) => {
    // First, handle authentication
    const authResult = await withAuth(() => null)(context);

    // If there's a redirect, follow it
    if (authResult.redirect) {
      return authResult;
    }

    // Now check for active subscription
    const hasSubscription = await checkUserSubscription(context.user.id);

    if (!hasSubscription) {
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
      : { props: { user: context.user } };
  };
}
