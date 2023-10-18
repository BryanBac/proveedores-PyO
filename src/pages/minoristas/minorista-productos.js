import { Inter } from "next/font/google";
import Head from "next/head";
import styles from "src/styles/VistaProductos.module.css";
import HomeBar from "@/components/home_bar";
import { useEffect, useState } from "react";
import modificarDocumento from "../api/firebase/update-data";
import obtener from "../api/firebase/get-data";
import eliminarDocumento from "../api/firebase/delete-data";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
const InterFont = Inter({ subsets: ["latin"] });
import { useRouter } from "next/router";
import Link from "next/link";
import { storage } from "../../../firebase";
import { v4 } from "uuid";

export default function Home() {
    const router = useRouter()
    useEffect(() => {
        if (typeof window !== 'undefined') {
          try {
            if (sessionStorage.getItem("acceso") !== "true") {
              router.push('/');
            }
            if (sessionStorage.getItem("tipo") !== "1") {
              router.push('/');
            }
          } catch (error) {
            router.push('/');
          }
        }
      }, [router]);
    const [tabla, setTabla] = useState({
        tableContent: [],
    });

    const [materiales, setMateriales] = useState([]);

    const fetchData = async () => {
        try {
            const result = await obtener("productos");
            setMateriales(result);
            setTabla({
                tableContent: result,
            });
        } catch (error) {
            // Handle the error if needed
            console.error("Error fetching data:", error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);


    const cambioPrecio = (e, itemId) => {
        let nuevaCantidad = e.target.value;
        let nuevaTab = tabla.tableContent;
        let ref = 0;
        for (var i = 0; i < tabla.tableContent.length; i++) {
            if (tabla.tableContent[i]["id"] == itemId) {
                if (parseInt(nuevaCantidad) < 1) {
                    nuevaCantidad = 1;
                }
                ref = i
                nuevaTab[i]["precio"] = parseInt(nuevaCantidad);
            }
        }
        setTabla({
            tableContent: nuevaTab,
        });
        modificarDocumento(itemId, "productos", {
            precio: tabla.tableContent[ref]["precio"]
        })
    };

    const eliminarProducto = async (e, nombre) => {
        let eliminar = confirm("Eliminar: " + nombre)
        if (eliminar) {
            for (var i = 0; i < tabla.tableContent.length; i++) {
                if (tabla.tableContent[i]["id"] == e.target.value) {
                    const imagenBorra = ref(storage, tabla.tableContent[i]["imagen"])
                    deleteObject(imagenBorra).then(() => {
                        console.log('Imagen borrada exitosamente')
                    }).catch((error) => {
                        console.log(error)
                    });
                }
            }
            await eliminarDocumento("productos", e.target.value)
            fetchData();
        }
    }

    const cambioImagen = (e, imagenURL, itemId) => {
        let file = e.target.files[0]
        let nuevaTab = tabla.tableContent;
        const imagenBorra = ref(storage, imagenURL)
        deleteObject(imagenBorra).then(() => {
            console.log('Imagen borrada exitosamente')
        }).catch((error) => {
            console.log(error)
        });

        const refImagen = ref(storage, `/${file.name + v4()}`);
        uploadBytes(refImagen, file).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                modificarDocumento(itemId, "productos", {
                    imagen: url
                })
                for (var i = 0; i < tabla.tableContent.length; i++) {
                    if (tabla.tableContent[i]["id"] == itemId) {
                        nuevaTab[i]["imagen"] = url;
                        setTabla({
                            tableContent: nuevaTab,
                        })
                    }
                }
            });
        });
    }

    return (
        <div className={InterFont.className}>
            <HomeBar enlace="/minoristas/minorista-menu"></HomeBar>
            <div class={styles.body}>
                <div>

                    <table class={styles.tabla}>
                        <thead>
                            <tr>
                                <th class={styles.encabezado}>nombre</th>
                                <th class={styles.encabezado}>precio unidad</th>
                                <th class={styles.encabezado}>imagen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tabla.tableContent.map((item) => (
                                <tr key={item.id}>
                                    <td class={styles.celda}>{item.nombre}</td>
                                    <td class={styles.celda}>
                                        <input class={styles.celdaEditable}
                                            value={item.precio}
                                            type="number"
                                            onChange={(e) => cambioPrecio(e, item.id)}
                                        >
                                        </input>
                                    </td>
                                    <td class={styles.celda}>
                                        <label for="imagen">
                                            <div style={{ cursor: "pointer" }}>
                                                <img
                                                    src={item.imagen}
                                                    height={70}
                                                    alt="imagen"
                                                    className={styles.imagen}
                                                ></img>
                                            </div>
                                        </label>
                                        <input
                                            id="imagen"
                                            accept="image/png, image/jpeg"
                                            type="file"
                                            onChange={(e) => cambioImagen(e, item.imagen, item.id)}
                                            hidden
                                        />


                                        {/* <img
                                            src={item.imagen}
                                            height={75}
                                            alt="imagen"
                                        ></img> */}

                                        {/* <label for="imagen" style={{ fontSize: "32px" }}>
                                            <div class={styles.agregarImagen} style={{ cursor: "pointer" }}>
                                                <Image
                                                    src={preview}
                                                    width={512}
                                                    height={512}
                                                    alt="imagen"
                                                    className={styles.imagen}
                                                ></Image>
                                                {prompt}
                                            </div>
                                        </label>
                                        <input
                                            id="imagen"
                                            accept="image/png, image/jpeg"
                                            type="file"
                                            onChange={handleChange}
                                            hidden
                                        /> */}


                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}