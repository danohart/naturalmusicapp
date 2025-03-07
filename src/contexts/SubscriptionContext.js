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
        // Check if user has admin role
        const isAdmin =
          user?.roles?.includes("administrator") ||
          user?.role === "administrator" ||
          user?.capabilities?.administrator === true;
        console.log("User is admin:", user);
        // Only check subscription if not an admin
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
          hasAccess: hasSubscription || isAdmin, // Access granted if either condition is true
        });
      } catch (error) {
        console.error("Error checking subscription:", error);

        // Check if user has admin role even if subscription check fails
        const isAdmin =
          user?.roles?.includes("administrator") ||
          user?.role === "administrator" ||
          user?.capabilities?.administrator === true;

        setSubscriptionStatus({
          isLoading: false,
          isSubscribed: false,
          isAdmin: isAdmin,
          hasAccess: isAdmin, // Admin still has access even if subscription check fails
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
