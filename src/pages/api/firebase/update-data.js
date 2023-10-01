import { getFirestore, doc, setDoc } from "firebase/firestore";
import app from "../../../../firebase"; 

const modificarDocumento = async (id, coleccion, nuevosDatos) => {
    try {
      const firestore = getFirestore(app);
      const documentoRef = doc(firestore, coleccion, id);
      await setDoc(documentoRef, nuevosDatos, { merge: true });
    } catch (error) {
      console.error("Error al modificar el documento:", error);
    }
};

export default modificarDocumento;