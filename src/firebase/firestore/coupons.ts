import { 
    Firestore, 
    collection, 
    addDoc, 
    doc, 
    updateDoc, 
    deleteDoc,
    serverTimestamp
} from "firebase/firestore";

type CouponData = {
    code: string;
    type: "percentage" | "fixed";
    value: number;
    status: "Active" | "Inactive" | "Expired";
    expiryDate: string;
    createdAt?: any;
};

// Function to add a coupon
export const addCoupon = async (db: Firestore, couponData: Omit<CouponData, 'createdAt'>) => {
    const couponsCollection = collection(db, "coupons");
    return await addDoc(couponsCollection, { ...couponData, createdAt: serverTimestamp() });
};

// Function to update a coupon
export const updateCoupon = async (db: Firestore, couponId: string, couponData: Partial<Omit<CouponData, 'createdAt'>>) => {
    const couponDoc = doc(db, "coupons", couponId);
    return await updateDoc(couponDoc, couponData);
};

// Function to delete a coupon
export const deleteCoupon = async (db: Firestore, couponId: string) => {
    const couponDoc = doc(db, "coupons", couponId);
    return await deleteDoc(couponDoc);
};
