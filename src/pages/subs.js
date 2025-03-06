import { useState, useEffect } from "react";
import Head from "next/head";

export default function ActiveSubscribersPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSubscribers() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/woo");

        if (!response.ok) {
          throw new Error("Failed to fetch subscribers");
        }

        const data = await response.json();
        setSubscribers(data.subscribers);
      } catch (err) {
        console.error("Error fetching subscribers:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSubscribers();
  }, []);

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-xl'>Loading subscribers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-red-50'>
        <p className='text-red-600 text-xl'>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <Head>
        <title>Active Subscribers</title>
      </Head>

      <h1 className='text-3xl font-bold mb-6'>Active Subscribers</h1>

      {subscribers.length === 0 ? (
        <p className='text-gray-600'>No active subscribers found.</p>
      ) : (
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse border border-gray-200'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='border p-3 text-left'>ID</th>
                <th className='border p-3 text-left'>Name</th>
                <th className='border p-3 text-left'>Email</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id} className='hover:bg-gray-50'>
                  <td className='border p-3'>{subscriber.id}</td>
                  <td className='border p-3'>
                    {subscriber.firstName} {subscriber.lastName}
                  </td>
                  <td className='border p-3'>{subscriber.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className='mt-4 text-gray-600'>
            Total Subscribers: {subscribers.length}
          </p>
        </div>
      )}
    </div>
  );
}
