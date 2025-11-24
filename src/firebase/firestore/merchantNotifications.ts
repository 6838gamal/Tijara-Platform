'use client';
import {
  Firestore,
  collection,
  addDoc,
  doc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';

type NotificationData = {
  title: string;
  message: string;
  sentAt?: any;
};

const getNotificationsCollection = (db: Firestore, storeId: string) =>
  collection(db, 'stores', storeId, 'notifications');

export const addMerchantNotification = async (
  db: Firestore,
  storeId: string,
  notificationData: Omit<NotificationData, 'sentAt'>
) => {
  const notificationsCollection = getNotificationsCollection(db, storeId);
  const data = {
      ...notificationData,
      sentAt: serverTimestamp(),
    };
  await addDoc(notificationsCollection, data);
};

export const deleteMerchantNotification = async (
  db: Firestore,
  storeId: string,
  notificationId: string
) => {
  const notificationDoc = doc(
    db,
    'stores',
    storeId,
    'notifications',
    notificationId
  );
  await deleteDoc(notificationDoc);
};
