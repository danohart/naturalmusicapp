import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { checkUserSubscription } from "../lib/woocommerce";

const SubscriptionContext = createContext({
  isLoading: true,
  isSubscribed: false,
});

export function SubscriptionProvider({ children }) {
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    isLoading: true,
    isSubscribed: false,
  });

  const { user, isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    async function checkStatus() {
      if (!isAuthenticated || authLoading) {
        return;
      }

      try {
        const hasSubscription = await checkUserSubscription(user.id);
        console.log("hasSubscription", hasSubscription);

        setSubscriptionStatus({
          isLoading: false,
          isSubscribed: hasSubscription,
        });
      } catch (error) {
        console.error("Error checking subscription1:", error);
        setSubscriptionStatus({
          isLoading: false,
          isSubscribed: false,
        });
      }
    }

    if (isAuthenticated && !authLoading) {
      checkStatus();
    } else {
      setSubscriptionStatus({
        isLoading: authLoading,
        isSubscribed: false,
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
