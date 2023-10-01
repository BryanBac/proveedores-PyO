import { getFirestore, collection, doc, deleteDoc } from "firebase/firestore";
import app from "../../../../firebase";

const eliminarDocumento = async (nombreColeccion, idDocumento) => {
    try {
      const firestore = getFirestore(app);
      const documentoRef = doc(firestore, nombreColeccion, idDocumento);
  
      await deleteDoc(documentoRef);
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
    }
  };
  
export default eliminarDocumento;
