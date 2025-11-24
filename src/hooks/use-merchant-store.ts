
"use client";

import { useState, useEffect } from 'react';
import { useFirestore, useUser } from "@/firebase";
import { collection, query, where, limit, getDocs, FirestoreError } from "firebase/firestore";

type Store = {
  id: string;
  ownerId: string;
};

/**
 * A hook to get the store ID for the currently logged-in merchant.
 * It reliably queries the 'stores' collection based on the user's email only after authentication is confirmed.
 * This version uses a one-time `getDocs` fetch to ensure the storeId remains stable throughout the session
 * and is not affected by other database write operations, which was causing UI state resets.
 * @returns The store ID, loading state, any potential error, and a boolean indicating if no store was found for the user.
 */
export function useMerchantStore(): { storeId: string | null; loading: boolean; error: FirestoreError | null; noStore: boolean; } {
  const firestore = useFirestore();
  const { user, loading: userLoading } = useUser();
  const [storeId, setStoreId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);
  const [noStore, setNoStore] = useState(false);

  useEffect(() => {
    // Define an async function inside the effect to perform the fetch
    const fetchStoreId = async () => {
      // Don't proceed if the user is loading, not logged in, or firestore is not ready
      if (userLoading || !user?.email || !firestore) {
        // If user is not loading but not logged in, we can stop loading.
        if (!userLoading) {
            setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(null);
      setNoStore(false);

      try {
        const storeQuery = query(
          collection(firestore, 'stores'),
          where('ownerId', '==', user.email),
          limit(1)
        );

        const querySnapshot = await getDocs(storeQuery);

        if (!querySnapshot.empty) {
          // We found a store
          const storeDoc = querySnapshot.docs[0];
          setStoreId(storeDoc.id);
          setNoStore(false);
        } else {
          // No store found for this user
          setStoreId(null);
          setNoStore(true);
        }
      } catch (err: any) {
        console.error("Error fetching merchant store:", err);
        setError(err);
        setStoreId(null);
        setNoStore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreId();
  // Dependency array ensures this runs when user/auth state changes
  }, [user, userLoading, firestore]);

  return { storeId, loading, error, noStore };
}
