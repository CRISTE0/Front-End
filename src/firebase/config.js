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


// sirve para el admin(aunque se debe cambiar la otra func)
export async function subirImageDesign(fileDesign)  {

  const idImagenDisenio = v4();

  const storageRef= ref(storage,`Disenios/${idImagenDisenio}`)
  // const blob = await fetch(fileD).then((res) => res.blob());
  await uploadBytes(storageRef,fileDesign)
  const url = await getDownloadURL(storageRef)

  console.log(`id del diseño: ${idImagenDisenio}`);
  console.log(`url del diseño: ${url}`);

  return [idImagenDisenio,url] ;
}

export async function subirImageReference(fileReference)  {
  const idImagenReferencia = v4();

  const storageRef= ref(storage,`Referencias/${idImagenReferencia}`)

  // const blob = await fetch(fileReference).then((res) => res.blob());
  await uploadBytes(storageRef,fileReference)
  const url = await getDownloadURL(storageRef)
  console.log(url);
  return [url,idImagenReferencia];

}

export async function subirImageReferenceDiseniador(fileReference)  {
  const idImagenReferencia = v4();

  const storageRef= ref(storage,`Referencias/${idImagenReferencia}`)

  const blob = await fetch(fileReference).then((res) => res.blob());
  
  await uploadBytes(storageRef,blob)
  const url = await getDownloadURL(storageRef)
  console.log(url);
  return [url,idImagenReferencia];

}

// Funciones para editar las imagenes de diseño y referencia 
export async function editImageDesign(idFileD,newFileD)  {

  const storageRef= ref(storage,`Disenios/${idFileD}`)
  const blob = await fetch(newFileD).then((res) => res.blob());
  // console.log(blob);

  await uploadBytes(storageRef,newFileD)
  const url = await getDownloadURL(storageRef)
  console.log(url);
  // return url;
}


export async function editImageReference(idFileR,newFileReference)  {
  
  console.log(idFileR);
  console.log(newFileReference);


  const storageRef= ref(storage,`Referencias/${idFileR}`)
  // const blob = await fetch(newFileR).then((res) => res.blob());
  await uploadBytes(storageRef,newFileReference)
  const url = await getDownloadURL(storageRef)
  console.log(url);
  // return url;
}


export async function subirImageComprobante(fileComprobante)  {

  const idImagenComprobante = v4();
 
  const storageRef= ref(storage,`Comprobantes/${idImagenComprobante}`)
  await uploadBytes(storageRef,fileComprobante)
  const imagenComprobante = await getDownloadURL(storageRef)
  console.log(imagenComprobante); 

  return [idImagenComprobante,imagenComprobante];
}



export async function editImageComprobante(idFileComprobante,newFileComprobante)  {
  
  console.log(idFileComprobante);
  console.log(newFileComprobante);


  const storageRef= ref(storage,`Comprobantes/${idFileComprobante}`)
  // const blob = await fetch(newFileR).then((res) => res.blob());

  await uploadBytes(storageRef,newFileComprobante)
  const url = await getDownloadURL(storageRef)
  console.log(url);
  return url;

}