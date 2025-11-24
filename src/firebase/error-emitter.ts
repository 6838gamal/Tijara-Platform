import { EventEmitter } from 'events';
import { type FirestorePermissionError } from './errors';

type AppEvents = {
  'permission-error': (error: FirestorePermissionError) => void;
};

// We have to declare the event emitter and its types for our app.
// We can't use the generic EventEmitter type because it doesn't know about our custom events.
declare interface AppEventEmitter {
  on<E extends keyof AppEvents>(event: E, listener: AppEvents[E]): this;
  emit<E extends keyof AppEvents>(
    event: E,
    ...args: Parameters<AppEvents[E]>
  ): boolean;
}

class AppEventEmitter extends EventEmitter {}

export const errorEmitter = new AppEventEmitter();
