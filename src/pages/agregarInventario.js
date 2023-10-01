import { Inter } from "next/font/google";
import { register } from "swiper/element/bundle";
import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import HomeBar from "@/components/home_bar";
import styles from "../styles/ProductoInventario.module.css";
import enviar from "./api/firebase/post-data";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import InactivityAlert from "@/components/Inactivity";
import { useRouter } from "next/router";

const InterFont = Inter({ subsets: ["latin"] });
register();

export default function Home() {
    const [preview, setPreview] = useState("/../public/camara.png");
    const [file, setFile] = useState(null);
    const [prompt, setPrompt] = useState("Añadir Imagen");
    const [nombre, setNombre] = useState("");
    const [cantidad, setCantidad] = useState(0);
    const [unidad, setUnidad] = useState("");
    const [costo, setCosto] = useState(0);
    const [caducidad, setCaducidad] = useState("");

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
                console.error(error)
            }
        }
    }, [])

    function handleChange(e) {
        setFile(e.target.files[0]);
        setPreview(URL.createObjectURL(e.target.files[0]));
        setPrompt("");
    }

    const enviarInfo = (e) => {
        e.preventDefault();

        const fecha = new Date();

        let currentDay = String(fecha.getDate()).padStart(2, "0");

        let currentMonth = String(fecha.getMonth() + 1).padStart(2, "0");

        let currentYear = fecha.getFullYear();

        if (file == null) {
            let producto = {
                nombre: nombre,
                cantidadLocal: parseInt(cantidad),
                unidad: unidad,
                costo: parseFloat(costo),
                caducidad: caducidad,
                imagen: "",
                fecha: `${currentYear}-${currentMonth}-${currentDay}`,
            };
            enviar("materiales", producto);
            alert("Agregado exitósamente");
        } else {
            const refImagen = ref(storage, `/${file.name + v4()}`);
            uploadBytes(refImagen, file).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((url) => {
                    let producto = {
                        nombre: nombre,
                        cantidadLocal: parseInt(cantidad),
                        unidad: unidad,
                        costo: parseFloat(costo),
                        caducidad: caducidad,
                        imagen: url,
                        fecha: `${currentYear}-${currentMonth}-${currentDay}`,
                    };
                    enviar("materiales", producto);
                    alert("Agregado exitósamente");
                });
            });
            setPreview("/../public/camara.png");
            setPrompt("Añadir Imagen");
            setNombre("");
            setCantidad("");
            setUnidad("");
            setCosto("");
            setCaducidad("");
        }
    };

    return (
        <div className={InterFont.className}>
            <Head>
                <title>Crear Producto</title>
            </Head>
            <HomeBar enlace="inventario"></HomeBar>
            <InactivityAlert />
            <form class={styles.body} onSubmit={enviarInfo}>
                <div class={styles.container}>
                    <div>
                        <input
                            id="imagen"
                            accept="image/png, image/jpeg"
                            type="file"
                            onChange={handleChange}
                            hidden
                        />
                        <label for="imagen" style={{ fontSize: "32px" }}>
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
                    </div>

                    <div>
                        <div class={styles.ingreso}>
                            <span>Nombre</span>
                            <input
                                class={styles.input}
                                type="text"
                                onChange={(e) => setNombre(e.target.value)}
                                value={nombre}
                            ></input>
                        </div>

                        <div class={styles.ingreso}>
                            <span>Cantidad</span>
                            <input
                                class={styles.input}
                                pattern="^[0-9]+(?:\.[0-9]+)?$"
                                title="Ingrese un número válido"
                                onChange={(e) => setCantidad(e.target.value)}
                                value={cantidad}
                            ></input>
                        </div>

                        <div class={styles.ingreso}>
                            <span>Unidad de Medida</span>
                            <input
                                class={styles.input}
                                type="text"
                                onChange={(e) => setUnidad(e.target.value)}
                                value={unidad}
                            ></input>
                        </div>

                        <div class={styles.ingreso}>
                            <span>Costo</span>
                            <input
                                class={styles.input}
                                pattern="^[0-9]+(?:\.[0-9]+)?$"
                                title="Ingrese un precio válido (sin símbolos)"
                                onChange={(e) => setCosto(e.target.value)}
                                value={costo}
                            ></input>
                        </div>

                        <div class={styles.ingreso}>
                            <span>Caducidad</span>
                            <input
                                type="date"
                                class={styles.input}
                                onChange={(e) => setCaducidad(e.target.value)}
                                value={caducidad}
                            ></input>
                        </div>
                        <button type="submit" class={styles.boton}>
                            Añadir Ingrediente
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}