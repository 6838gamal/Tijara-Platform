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

type BrandData = {
  name: string;
  description: string;
  productCount: number;
  createdAt?: any;
};

const getBrandsCollection = (db: Firestore, storeId: string) =>
  collection(db, 'stores', storeId, 'brands');

export const addBrand = async (
  db: Firestore,
  storeId: string,
  brandData: Omit<BrandData, 'createdAt' | 'productCount'>
) => {
  const brandsCollection = getBrandsCollection(db, storeId);
  const data = {
      ...brandData,
      productCount: 0,
      createdAt: serverTimestamp(),
    };
  await addDoc(brandsCollection, data);
};

export const updateBrand = async (
  db: Firestore,
  storeId: string,
  brandId: string,
  brandData: Partial<BrandData>
) => {
  const brandDoc = doc(db, 'stores', storeId, 'brands', brandId);
  await updateDoc(brandDoc, brandData);
};

export const deleteBrand = async (
  db: Firestore,
  storeId: string,
  brandId: string
) => {
  const brandDoc = doc(db, 'stores', storeId, 'brands', brandId);
  await deleteDoc(brandDoc);
};
