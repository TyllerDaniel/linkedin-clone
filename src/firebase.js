
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'
import {getAuth, GoogleAuthProvider} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAkJ10VapR2NvOMhcjQhFOKbmDurcl-wIQ",
  authDomain: "linkedin-clone-f7fb5.firebaseapp.com",
  projectId: "linkedin-clone-f7fb5",
  storageBucket: "linkedin-clone-f7fb5.appspot.com",
  messagingSenderId: "169139073060",
  appId: "1:169139073060:web:c85dbf178e6ef7e189a8b1"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore();

const auth = getAuth();

const provider = new GoogleAuthProvider();

const storage = getStorage(app)

export {auth,provider,storage};

export default db;
