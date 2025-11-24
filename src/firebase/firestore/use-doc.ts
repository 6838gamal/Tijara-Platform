
'use client';
import { useState, useEffect } from 'react';
import {
  doc,
  onSnapshot,
  DocumentReference,
  DocumentData,
  FirestoreError,
  DocumentSnapshot,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase';

export function useDoc<T>(
  docRef: DocumentReference<DocumentData> | null
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!docRef) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const unsubscribe = onSnapshot(docRef, 
      (snapshot: DocumentSnapshot<DocumentData>) => {
        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
      }, 
      (err: FirestoreError) => {
        console.error(`Error fetching doc:`, err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [docRef]);

  return { data, loading, error };
}
