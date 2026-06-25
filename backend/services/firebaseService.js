import { getAuth } from "firebase-admin/auth";

export const verifyFirebaseToken = async (firebaseToken) => {
  return await getAuth().verifyIdToken(firebaseToken);
};
