'use client';
import {
  Firestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';

type CouponData = {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  expiryDate: string;
  createdAt?: any;
};

const getCouponsCollection = (db: Firestore, storeId: string) =>
  collection(db, 'stores', storeId, 'coupons');

export const addMerchantCoupon = async (
  db: Firestore,
  storeId: string,
  couponData: Omit<CouponData, 'createdAt'>
) => {
  const couponsCollection = getCouponsCollection(db, storeId);
  const data = {
      ...couponData,
      createdAt: serverTimestamp(),
    };
  await addDoc(couponsCollection, data);
};

export const updateMerchantCoupon = async (
  db: Firestore,
  storeId: string,
  couponId: string,
  couponData: Partial<CouponData>
) => {
  const couponDoc = doc(db, 'stores', storeId, 'coupons', couponId);
  await updateDoc(couponDoc, couponData);
};

export const deleteMerchantCoupon = async (
  db: Firestore,
  storeId: string,
  couponId: string
) => {
  const couponDoc = doc(db, 'stores', storeId, 'coupons', couponId);
  await deleteDoc(couponDoc);
};
