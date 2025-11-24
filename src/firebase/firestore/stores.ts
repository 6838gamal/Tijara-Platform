import { 
    Firestore, 
    collection, 
    addDoc, 
    doc, 
    updateDoc, 
    deleteDoc,
    serverTimestamp
} from "firebase/firestore";

type StoreData = {
    name: string;
    ownerId?: string;
    status: "Active" | "Inactive" | "Suspended";
    plan: "Basic" | "Premium" | "Enterprise";
    image: string;
    createdAt?: any;
};

// Function to add a store
export const addStore = async (db: Firestore, storeData: Omit<StoreData, 'createdAt'>) => {
    const storesCollection = collection(db, "stores");
    return await addDoc(storesCollection, { ...storeData, createdAt: serverTimestamp() });
};

// Function to update a store
export const updateStore = async (db: Firestore, storeId: string, storeData: Partial<StoreData>) => {
    const storeDoc = doc(db, "stores", storeId);
    return await updateDoc(storeDoc, storeData);
};

// Function to delete a store
export const deleteStore = async (db: Firestore, storeId: string) => {
    const storeDoc = doc(db, "stores", storeId);
    return await deleteDoc(storeDoc);
};
