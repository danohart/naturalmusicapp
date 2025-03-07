import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { checkUserSubscription } from "../lib/woocommerce";

const SubscriptionContext = createContext({
  isLoading: true,
  isSubscribed: false,
  isAdmin: false,
  hasAccess: false,
});

export function SubscriptionProvider({ children }) {
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    isLoading: true,
    isSubscribed: false,
    isAdmin: false,
    hasAccess: false,
  });

  const { user, isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    async function checkStatus() {
      if (!isAuthenticated || authLoading) {
        return;
      }

      try {
        const isAdmin =
          user?.roles?.includes("administrator") ||
          user?.role === "administrator" ||
          user?.capabilities?.administrator === true;

        let hasSubscription = false;
        if (!isAdmin) {
          hasSubscription = await checkUserSubscription(user.id);
          console.log("hasSubscription", hasSubscription);
        } else {
          console.log("User is admin, skipping subscription check");
        }

        setSubscriptionStatus({
          isLoading: false,
          isSubscribed: hasSubscription,
          isAdmin: isAdmin,
          hasAccess: hasSubscription || isAdmin,
        });
      } catch (error) {
        console.error("Error checking subscription:", error);

        const isAdmin =
          user?.roles?.includes("administrator") ||
          user?.role === "administrator" ||
          user?.capabilities?.administrator === true;

        setSubscriptionStatus({
          isLoading: false,
          isSubscribed: false,
          isAdmin: isAdmin,
          hasAccess: isAdmin,
        });
      }
    }

    if (isAuthenticated && !authLoading) {
      checkStatus();
    } else {
      setSubscriptionStatus({
        isLoading: authLoading,
        isSubscribed: false,
        isAdmin: false,
        hasAccess: false,
      });
    }
  }, [isAuthenticated, authLoading, user]);

  return (
    <SubscriptionContext.Provider value={subscriptionStatus}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
}
