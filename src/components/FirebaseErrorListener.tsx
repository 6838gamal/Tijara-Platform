'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';

export function FirebaseErrorListener() {
  useEffect(() => {
    const handler = (error: Error) => {
      // Throw the error so Next.js can handle it and show the overlay.
      // This is for development purposes only.
      if (process.env.NODE_ENV === 'development') {
        setTimeout(() => {
          throw error;
        }, 0);
      }
    };

    errorEmitter.on('permission-error', handler);

    return () => {
      errorEmitter.removeListener('permission-error', handler);
    };
  }, []);

  return null;
}
