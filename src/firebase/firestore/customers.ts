
'use client';
import {
  Firestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

type CustomerData = {
  name: string;
  email: string;
  password?: string;
  totalOrders?: number;
  totalSpent?: number;
  joinedDate?: any;
};

const getCustomersCollection = (db: Firestore, storeId: string) =>
  collection(db, 'stores', storeId, 'customers');

export const addCustomer = async (
  db: Firestore,
  storeId: string,
  customerData: CustomerData
) => {
    // 1. Ensure a user exists in Firebase Auth
    if (customerData.password) {
        const auth = getAuth();
        try {
            await createUserWithEmailAndPassword(auth, customerData.email, customerData.password);
        } catch (authError: any) {
            if (authError.code !== 'auth/email-already-in-use') {
                console.error("Error creating customer in Firebase Auth:", authError);
                throw new Error("فشل إنشاء حساب المصادقة للعميل.");
            }
        }
    }

    // 2. Create or update the user in the global /users collection
    const userDocRef = doc(db, 'users', customerData.email);
    const userDocSnap = await getDoc(userDocRef);
    if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
            name: customerData.name,
            email: customerData.email,
            role: 'Customer',
            status: 'Active',
            createdAt: serverTimestamp(),
        });
    }

    // 3. Create the customer record in the store's subcollection
    const customerDocRef = doc(db, 'stores', storeId, 'customers', customerData.email);
    const { password, ...firestoreData } = customerData;
    
    await setDoc(customerDocRef, {
        ...firestoreData,
        totalOrders: 0,
        totalSpent: 0,
        joinedDate: serverTimestamp(),
    });
};

export const updateCustomer = async (
  db: Firestore,
  storeId: string,
  customerId: string, // customerId is the email
  customerData: Partial<CustomerData>
) => {
  const customerDoc = doc(db, 'stores', storeId, 'customers', customerId);
  const { password, ...firestoreData } = customerData; // Ensure password is not updated
  await updateDoc(customerDoc, firestoreData);

  // Also update the global user record if it exists
  const userDoc = doc(db, 'users', customerId);
  if ((await getDoc(userDoc)).exists()) {
      await updateDoc(userDoc, { name: customerData.name });
  }
};

export const deleteCustomer = async (
  db: Firestore,
  storeId: string,
  customerId: string // customerId is the email
) => {
  const customerDoc = doc(db, 'stores', storeId, 'customers', customerId);
  // This only deletes the customer from the store's list.
  // It does NOT delete them from the global /users collection or Auth,
  // as they might be customers of other stores.
  await deleteDoc(customerDoc);
};
