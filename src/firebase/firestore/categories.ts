
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

type CategoryData = {
  name: string;
  description: string;
  parentId?: string;
  productCount: number;
  createdAt?: any;
};

const getCategoriesCollection = (db: Firestore, storeId: string) =>
  collection(db, 'stores', storeId, 'categories');

export const addCategory = async (
  db: Firestore,
  storeId: string,
  categoryData: Partial<Omit<CategoryData, 'createdAt' | 'productCount'>> & {productCount?: number}
) => {
  const categoriesCollection = getCategoriesCollection(db, storeId);
  const data = {
      ...categoryData,
      productCount: categoryData.productCount || 0,
      createdAt: serverTimestamp(),
    };
  // Ensure parentId is not added if it's undefined
  if (data.parentId === undefined) {
    delete data.parentId;
  }
  await addDoc(categoriesCollection, data);
};

export const updateCategory = async (
  db: Firestore,
  storeId: string,
  categoryId: string,
  categoryData: Partial<CategoryData>
) => {
  const categoryDoc = doc(db, 'stores', storeId, 'categories', categoryId);
  const data = { ...categoryData };
  // Ensure parentId is not added if it's undefined
  if (data.parentId === undefined) {
    delete data.parentId;
  }
  await updateDoc(categoryDoc, data);
};

export const deleteCategory = async (
  db: Firestore,
  storeId: string,
  categoryId: string
) => {
  const categoryDoc = doc(db, 'stores', storeId, 'categories', categoryId);
  await deleteDoc(categoryDoc);
};
