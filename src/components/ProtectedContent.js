import { useAuth } from "../contexts/AuthContext";
import { useSubscription } from "../contexts/SubscriptionContext";
import Link from "next/link";

export default function ProtectedContent({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const {
    isLoading: subscriptionLoading,
    hasAccess,
    isAdmin,
    isSubscribed,
  } = useSubscription();

  // Show loading state while checking auth or subscription
  if (authLoading || subscriptionLoading) {
    return <div className='p-4 text-center'>Loading...</div>;
  }

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className='p-6 bg-gray-100 rounded-lg shadow-md'>
        <h2 className='text-xl font-bold mb-4'>Login Required</h2>
        <p className='mb-4'>Please log in to view this content.</p>
        <Link href='/login'>Log In</Link>
      </div>
    );
  }

  // If authenticated but no subscription, show subscription prompt
  if (!isSubscribed) {
    return (
      <div className='p-6 bg-gray-100 rounded-lg shadow-md'>
        <h2 className='text-xl font-bold mb-4'>Subscription Required</h2>
        <p className='mb-4'>
          This content is only available to paid subscribers.
        </p>
        <Link href='/subscribe'>Get Access Now</Link>
      </div>
    );
  }

  // If both authenticated and subscribed, show content
  return (
    <>
      {isAdmin && <div className='admin-notice'>Admin view</div>}
      {children}
    </>
  );
}
