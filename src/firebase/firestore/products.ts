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

export type ProductData = {
  name: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  description?: string;
  status: 'Published' | 'Draft';
  createdAt?: any;
  cost?: number;
  discountPrice?: number;
  discountEndDate?: string;
  sku?: string;
  productLink?: string;
  weight?: number;
  requiresShipping?: boolean;
  maxQuantityPerCustomer?: number;
  options?: string;
};

const getProductsCollection = (db: Firestore, storeId: string) =>
  collection(db, 'stores', storeId, 'products');

export const addProduct = async (
  db: Firestore,
  storeId: string,
  productData: Omit<ProductData, 'createdAt'>
) => {
  const productsCollection = getProductsCollection(db, storeId);
  const data = {
      ...productData,
      createdAt: serverTimestamp(),
    };
  await addDoc(productsCollection, data);
};

export const updateProduct = async (
  db: Firestore,
  storeId: string,
  productId: string,
  productData: Partial<ProductData>
) => {
  const productDoc = doc(db, 'stores', storeId, 'products', productId);
  await updateDoc(productDoc, productData);
};

export const deleteProduct = async (
  db: Firestore,
  storeId: string,
  productId: string
) => {
  const productDoc = doc(db, 'stores', storeId, 'products', productId);
  await deleteDoc(productDoc);
};

    