// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {getDownloadURL, getStorage,ref,uploadBytes} from "firebase/storage";
import { v4 } from "uuid";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUmu3PnVNFfoF5VhZdH8-KP7yBSEKmvzc",
  authDomain: "react-images-7e942.firebaseapp.com",
  projectId: "react-images-7e942",
  storageBucket: "react-images-7e942.appspot.com",
  messagingSenderId: "109212014317",
  appId: "1:109212014317:web:7ba529684adf5556ef5ee4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage=getStorage(app)

export async function subirImageDesign(fileD)  {
  if (!fileD) {
    return ("No aplica");
  }
  const storageRef= ref(storage,`Disenios/${v4()}`)
  await uploadBytes(storageRef,fileD)
  const url = await getDownloadURL(storageRef)
  console.log(url);
  return url;
}

export async function subirImageReference(fileR)  {
  const storageRef= ref(storage,`Referencias/${v4()}`)
  const blob = await fetch(fileR).then((res) => res.blob());
  await uploadBytes(storageRef,blob)
  const url = await getDownloadURL(storageRef)
  console.log(url);
  return url;

}