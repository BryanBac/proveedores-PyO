import { getFirestore, collection, addDoc } from "firebase/firestore";
import app from "../../../../firebase";

const firestore = getFirestore(app);

const enviar = async(nombre, data)=>{
  const docRef = await addDoc(collection(firestore, nombre), data);
}

export default enviar;