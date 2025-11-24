'use client';
import {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  FC,
  Context,
} from 'react';

import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

interface FirebaseContextValue {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

export const FirebaseProvider: FC<{
  value: FirebaseContextValue;
  children: ReactNode;
}> = ({ value, children }) => {
  return (
    <FirebaseContext.Provider value={value}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

function createFirebaseHook<T>(
  context: Context<FirebaseContextValue | null>,
  service: keyof FirebaseContextValue
): () => T | null {
  return () => {
    const firebaseContext = useContext(context);
    if (firebaseContext === null) {
      throw new Error(
        'useFirebase hook must be used within a FirebaseProvider'
      );
    }
    return useMemo(
      () => firebaseContext[service] as T,
      [firebaseContext, service]
    );
  };
}

export const useFirebase = () => useContext(FirebaseContext);
export const useFirebaseApp = createFirebaseHook<FirebaseApp>(
  FirebaseContext,
  'app'
);
export const useAuth = createFirebaseHook<Auth>(FirebaseContext, 'auth');
export const useFirestore = createFirebaseHook<Firestore>(
  FirebaseContext,
  'firestore'
);
