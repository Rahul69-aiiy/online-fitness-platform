import { initializeApp, cert } from 'firebase-admin/app';
import serviceAccount from '../firebase.json' with { type: 'json' };

initializeApp({
  credential: cert(serviceAccount)
});