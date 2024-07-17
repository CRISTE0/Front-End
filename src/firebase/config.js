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


function generateIdImageDesign() {
  return v4();
}

function generateIdImageReference  () { 
  return v4();
}


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


// sirve para el admin(aunque se debe cambiar la otra func)
export async function subirImageDesignAdmin(fileD)  {
  if (!fileD) {
    return ("No aplica");
  }

  const idImagenDisenio = generateIdImageDesign();

  const storageRef= ref(storage,`Disenios/${idImagenDisenio}`)
  const blob = await fetch(fileD).then((res) => res.blob());
  await uploadBytes(storageRef,blob)
  const url = await getDownloadURL(storageRef)

  console.log(`id del diseño: ${idImagenDisenio}`);
  console.log(`url del diseño: ${url}`);

  return [idImagenDisenio,url] ;
}

export async function subirImageReference(fileR)  {
  const idImagenReferencia = await generateIdImageReference();

  const storageRef= ref(storage,`Referencias/${idImagenReferencia}`)
  const blob = await fetch(fileR).then((res) => res.blob());
  await uploadBytes(storageRef,blob)
  const url = await getDownloadURL(storageRef)
  console.log(url);
  return [url,idImagenReferencia];

}

export async function editImageDesign(idFileD,newFileD)  {

  const storageRef= ref(storage,`Disenios/${idFileD}`)
  const blob = await fetch(newFileD).then((res) => res.blob());
  console.log(blob);
  await uploadBytes(storageRef,blob)
  const url = await getDownloadURL(storageRef)
  console.log(url);
  // return url;
}


export async function editImageReference(idFileR,newFileR)  {
  
  console.log(idFileR);
  console.log(newFileR);


  const storageRef= ref(storage,`Referencias/${idFileR}`)
  const blob = await fetch(newFileR).then((res) => res.blob());
  await uploadBytes(storageRef,blob)
  const url = await getDownloadURL(storageRef)
  console.log(url);
  // return url;

}