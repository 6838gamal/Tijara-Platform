
'use client';
import {
  Firestore,
  collection,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';

export type Order = {
  id: string;
  customerName: string;
  total: number;
  status: OrderStatus;
  createdAt: any;
};

export const updateOrderStatus = async (
  db: Firestore,
  storeId: string,
  orderId: string,
  status: OrderStatus
) => {
  const orderDoc = doc(db, 'stores', storeId, 'orders', orderId);
  const data = { status };
  await updateDoc(orderDoc, data);
};

export const addOrder = async (
  db: Firestore,
  storeId: string,
  orderData: Omit<Order, 'id' | 'createdAt'>
) => {
    const ordersCollection = collection(db, 'stores', storeId, 'orders');
    const data = {
        ...orderData,
        createdAt: serverTimestamp()
    };
    await addDoc(ordersCollection, data);
}
