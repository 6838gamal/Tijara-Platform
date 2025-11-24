
'use client';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import {
  onSnapshot,
  Query,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

// Extend the return type to include a setter for the data
interface UseCollectionReturn<T> {
  data: T[];
  loading: boolean;
  error: FirestoreError | null;
  setData: Dispatch<SetStateAction<T[]>>;
}


export function useCollection<T>(
  collectionQuery: Query<DocumentData> | null
): UseCollectionReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!collectionQuery) {
        setLoading(false);
        setData([]); // Ensure data is cleared when query is null
        return;
    }
    
    // Reset state when the query changes to prevent showing stale data
    setLoading(true);
    setData([]);
    setError(null);

    const unsubscribe = onSnapshot(collectionQuery, 
      (snapshot: QuerySnapshot<DocumentData>) => {
        const result: T[] = [];
        snapshot.forEach((doc) => {
          result.push({ id: doc.id, ...doc.data() } as T);
        });
        setData(result);
        setLoading(false);
        setError(null);
      }, 
      (err: FirestoreError) => {
        // This is a permission error. Instead of throwing,
        // we'll treat it as if there is no data.
        // This provides a better UX than showing a scary error.
        setData([]);
        setLoading(false);
        setError(err); // We still want to know there was an error to show a message

        // We still want to see the error in the dev console for debugging.
        if (process.env.NODE_ENV === 'development') {
            const permissionError = new FirestorePermissionError({
                path: (collectionQuery as any)._query.path.segments.join('/'),
                operation: 'list',
            });
            errorEmitter.emit('permission-error', permissionError);
        }
      }
    );

    return () => unsubscribe();
  // We stringify the query to use it as a dependency. This is a common pattern for complex objects.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionQuery ? JSON.stringify((collectionQuery as any)._query) : null]);

  return { data, loading, error, setData };
}

    
