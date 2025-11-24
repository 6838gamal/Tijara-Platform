import { 
    Firestore, 
    collection, 
    addDoc, 
    doc, 
    updateDoc, 
    deleteDoc, 
    setDoc,
    serverTimestamp
} from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { initializeFirebase } from "..";

type UserData = {
    name: string;
    email: string;
    role: "Admin" | "Merchant" | "Customer";
    status: "Active" | "Inactive" | "Suspended";
    createdAt?: any;
    password?: string;
};

// Function to add a user, using email as the document ID
export const addUser = async (db: Firestore, userData: UserData) => {
    // The user's email is now the document ID
    const userDoc = doc(db, "users", userData.email);
    const { auth } = initializeFirebase();

    // Create user in Firebase Auth if password is provided
    if (userData.password && auth) {
        try {
            await createUserWithEmailAndPassword(auth, userData.email, userData.password);
        } catch (authError: any) {
            // Avoid creating duplicate users in Auth
            if (authError.code !== 'auth/email-already-in-use') {
                console.error("Error creating user in Firebase Auth:", authError);
                throw authError; // Re-throw auth error
            }
        }
    }
    
    // Create user document in Firestore
    const { password, ...firestoreData } = userData; // Don't store password in Firestore
    await setDoc(userDoc, { ...firestoreData, createdAt: serverTimestamp() });
};

// Function to update a user
export const updateUser = async (db: Firestore, userId: string, userData: Partial<UserData>) => {
    const userDoc = doc(db, "users", userId);
    await updateDoc(userDoc, userData);
};

// Function to delete a user
export const deleteUser = async (db: Firestore, userId: string) => {
    const userDoc = doc(db, "users", userId);
    // Note: This does not delete the user from Firebase Auth.
    // That would require a backend function.
    await deleteDoc(userDoc);
};
