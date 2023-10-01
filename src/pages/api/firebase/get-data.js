import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "../../../../firebase";

const firestore = getFirestore(app);

const obtener = async (nombre) => {
  try {
    const snapshot = await getDocs(collection(firestore, nombre));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // or you can return an empty array [] if you prefer
  }
};
export default obtener;
