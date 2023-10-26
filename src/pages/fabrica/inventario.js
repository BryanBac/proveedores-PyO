import { Inter } from "next/font/google";
import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/inventario.module.css";
import HomeBar from "@/components/home_bar";
import { useEffect, useState } from "react";
import Modal from "@/components/modal";
import modificarDocumento from "../api/firebase/update-data";
import obtener from "../api/firebase/get-data";
import eliminarDocumento from "../api/firebase/delete-data";
const InterFont = Inter({ subsets: ["latin"] });
import { useRouter } from "next/router";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "@/../firebase";
import MiniDrawer from "../menuV2";

const Home = () => {
    const router = useRouter()
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                if (sessionStorage.getItem("acceso") !== "true") {
                    router.push('/');
                }
                if (sessionStorage.getItem("tipo") == "2") {
                    router.replace('/mayorista/mayorista-inicio');
                } else if (sessionStorage.getItem("tipo") == "3") {
                    router.replace('/minoristas/minorista-inicio');
                }else{
                }
            } catch (error) {
                console.error(error)
            }
        }
    }, [])
    const [tabla, setTabla] = useState({
        tableContent: [],
    });
    const [state, setState] = useState(false);
    const [indice, setIndice] = useState("");
    const [existencia, setExistencia] = useState("");

    const [materiales, setMateriales] = useState([]);

    const fetchData = async () => {
        try {
            const result = await obtener("productosFabrica");
            setMateriales(result);
            setTabla({
                tableContent: result,
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const abrirModal = (e) => {
        setState(true);
        for (var i = 0; i < tabla.tableContent.length; i++) {
            if (tabla.tableContent[i]["id"] == e.target.value) {
                setIndice(i);
            }
        }
    };

    const cerrarModal = (e) => {
        setState(false);
    };

    const cambioCosto = (e, itemId) => {
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
        modificarDocumento(itemId, "productosFabrica", {
            precio: tabla.tableContent[ref]["precio"]
        })
    };


    const cambioCaducidad = (e, itemId) => {
        let nuevaCad = e.target.value;
        let nuevaTab = tabla.tableContent;
        let ref = 0;
        for (var i = 0; i < tabla.tableContent.length; i++) {
            if (tabla.tableContent[i]["id"] == itemId) {
                ref = i
                nuevaTab[i]["caducidad"] = nuevaCad;
            }
        }
        setTabla({
            tableContent: nuevaTab,
        })
        modificarDocumento(itemId, "productosFabrica", {
            caducidad: tabla.tableContent[ref]["caducidad"]
        })
    }

    const cambioFecha = (e, itemId) => {
        let nuevaFecha = e.target.value;
        let nuevaTab = tabla.tableContent;
        let ref = 0;
        for (var i = 0; i < tabla.tableContent.length; i++) {
            if (tabla.tableContent[i]["id"] == itemId) {
                ref = i
                nuevaTab[i]["fecha"] = nuevaFecha;
            }
        }
        setTabla({
            tableContent: nuevaTab,
        })
        modificarDocumento(itemId, "productosFabrica", {
            fecha: tabla.tableContent[ref]["fecha"]
        })
    }

    const eliminarMaterial = async (e, nombre) => {
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
            await eliminarDocumento("materiales", e.target.value)
            fetchData();
        }
    }



    const enviarCambios = (e) => {
        e.preventDefault();
        let nuevaTabla = tabla.tableContent;
        if (existencia != "") {
            nuevaTabla[indice]["existencia"] =
                parseInt(nuevaTabla[indice]["existencia"]) + parseInt(existencia);

            setTabla({
                tableContent: nuevaTabla,
            });

            modificarDocumento(tabla.tableContent[indice]["id"], "productosFabrica", {
                existencia: nuevaTabla[indice]["existencia"],
            });
        }
        setExistencia("");

        cerrarModal();
    };

    return (
        <div className={InterFont.className}>
            <Head>
                <title>SupplyPro</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MiniDrawer>
                <div class={styles.body}>
                    <div className={styles.aux}>
                        <br />
                        <br />
                        <Modal show={state}>
                            <form onSubmit={enviarCambios} class={styles.modal}>
                                <div style={{ display: "flex", columnGap: "20px" }}>
                                    <label>Cantidad a ingresar</label>
                                    <input
                                        title="Ingrese un número válido"
                                        style={{ fontSize: "20px", width: "100px" }}
                                        onChange={(e) => setExistencia(e.target.value)}
                                    ></input>
                                </div>
                                <div style={{ display: "flex", columnGap: "20px" }}>
                                    <button type="submit" class={styles.boton}>
                                        Aceptar
                                    </button>
                                    <button class={styles.boton} onClick={cerrarModal}>
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </Modal>
                        <table class={styles.tabla}>
                            <thead>
                                <tr>
                                    <th class={styles.encabezado}>fecha</th>
                                    <th class={styles.encabezado}>nombre</th>
                                    <th class={styles.encabezado}>existencia</th>
                                    <th class={styles.encabezado}>precio</th>
                                    <th class={styles.encabezado}>caducidad</th>
                                    <th class={styles.encabezado}>Agregar/Reducir</th>
                                    <th class={styles.encabezado}>Eliminar Producto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tabla.tableContent.map((item) => (
                                    <tr key={item.id}>
                                        <td class={styles.celda}>
                                            <input class={styles.celdaEditable}
                                                value={item.fecha}
                                                type="date"
                                                onChange={(e) => cambioFecha(e, item.id)}
                                            >
                                            </input>
                                        </td>
                                        <td class={styles.celda}>{item.nombre}</td>
                                        <td class={styles.celda}>{item.existencia}</td>
                                        <td class={styles.celda}>
                                            <input class={styles.celdaEditable}
                                                value={item.precio}
                                                type="number"
                                                onChange={(e) => cambioCosto(e, item.id)}
                                            >
                                            </input>
                                        </td>


                                        <td class={styles.celda}>
                                            <input class={styles.celdaEditable}
                                                value={item.caducidad}
                                                type="date"
                                                onChange={(e) => cambioCaducidad(e, item.id)}
                                            >
                                            </input>
                                        </td>

                                        <td class={styles.celda}>
                                            <button
                                                class={styles.boton}
                                                type="button"
                                                value={item.id}
                                                onClick={abrirModal}
                                            >
                                                +
                                            </button>
                                        </td>

                                        <td class={styles.celda}>
                                            <button
                                                class={styles.boton}
                                                type="button"
                                                value={item.id}
                                                onClick={(e) => eliminarMaterial(e, item.nombre)}
                                            >
                                                -
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </MiniDrawer>
        </div>
    );
}
export default Home