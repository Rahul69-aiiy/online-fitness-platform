import { getAuth } from "firebase-admin/auth";

export const verifyFirebaseToken = (firebaseToken) => {
  return getAuth().verifyIdToken(firebaseToken);
};
