"use client";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeFirebase } from ".";

const { storage } = initializeFirebase();

export const uploadImage = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};
