import { 
    Firestore, 
    collection, 
    addDoc, 
    doc, 
    updateDoc, 
    deleteDoc,
    serverTimestamp
} from "firebase/firestore";

type PlanData = {
    name: string;
    price: number;
    features: string;
    status: "Active" | "Archived";
    createdAt?: any;
};

// Function to add a plan
export const addPlan = async (db: Firestore, planData: PlanData) => {
    const plansCollection = collection(db, "plans");
    return await addDoc(plansCollection, { ...planData, createdAt: serverTimestamp() });
};

// Function to update a plan
export const updatePlan = async (db: Firestore, planId: string, planData: Partial<Omit<PlanData, 'createdAt'>>) => {
    const planDoc = doc(db, "plans", planId);
    return await updateDoc(planDoc, planData);
};

// Function to delete a plan
export const deletePlan = async (db: Firestore, planId: string) => {
    const planDoc = doc(db, "plans", planId);
    return await deleteDoc(planDoc);
};
