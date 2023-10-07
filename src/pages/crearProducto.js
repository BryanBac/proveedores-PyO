import { Inter } from "next/font/google";
import { register } from "swiper/element/bundle";
import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/ProductoInventario.module.css";
import styleDatos from "../styles/inventario.module.css";
const InterFont = Inter({ subsets: ["latin"] });
import enviar from "./api/firebase/post-data";
import obtener from "./api/firebase/get-data";
import { useRouter } from "next/router";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import InactivityAlert from "@/components/Inactivity";

register();

const CrearProducto = () => {
    const router = useRouter();
    const [cont, setCont] = useState(0);
    const [momentaneo, setMomentaneo] = useState()
    useEffect(() => {
        if (typeof window !== "undefined") {
            try {
                if (sessionStorage.getItem("acceso") !== "true") {
                    router.push('/');
                }
                if (sessionStorage.getItem("tipo") !== "1") {
                    router.push('/');
                }
            } catch (error) {
                router.push("/");
            }
        }
    }, [router]);
    const swiperRef = useRef(null);

    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState(0);
    const [materiales, setMateriales] = useState([]);
    const [preview, setPreview] = useState("/../public/camara.png");
    const [file, setFile] = useState(null);
    const [prompt, setPrompt] = useState("Añadir Imagen");
    const [tabla, setTabla] = useState({
        tableContent: [],
    });
    const [platList, setPlatList] = useState(() => {
        if (typeof window !== 'undefined' && window.sessionStorage) {
            const storedList = sessionStorage.getItem('platilloList');
            return JSON.parse(storedList)
        } else {
            return []
        }
    });
    const fetchData = async () => {
        try {
            const result = await obtener("materiales");
            setMateriales(result);
        } catch (error) {
            // Handle the error if needed
            console.error("Error fetching data:", error);
        }
    };
    useEffect(() => {
        fetchData();
        if (typeof window !== "undefined") {
            if (sessionStorage.getItem("productoMomentaneo") !== "undefined") {
                const listaMomentanea = JSON.parse(sessionStorage.getItem('productoMomentaneo'));
            }
        }
    }, []);
    useEffect(() => {
        if (platList) {
            setCont(platList.length)
        }
    }, [platList])
    useEffect(() => {
        const swiperContainer = swiperRef.current;
        const params = {
            navigation: true,
            slidesPerView: 5,
            spaceBetween: 20,
            injectStyles: [
                `
          .swiper-button-next,
          .swiper-button-prev {
            color: black;
          }
      `,
            ],
        };

        Object.assign(swiperContainer, params);
        swiperContainer.initialize();
    }, []);

    useEffect(()=>{
        setMomentaneo({
            nombre: nombre,
            contador: cont,
            cantidadLocal: 0,
            precio: parseFloat(precio, 10),
            ingredientes: tabla.tableContent,
            imagen: "",
        })
    }, [nombre, cont, precio, tabla])

    useEffect(()=>{
        sessionStorage.setItem("productoMomentaneo", JSON.stringify(momentaneo))
    }, [momentaneo])

    const enviarInfo = (e) => {
        e.preventDefault();

        if (file == null) {
            let producto = {
                nombre: nombre,
                contador: cont,
                cantidadLocal: 0,
                precio: parseFloat(precio, 10),
                ingredientes: tabla.tableContent,
                imagen: '',
            };
            enviar("productos", producto);
            alert("Agregado exitósamente");
        }
        else {
            const refImagen = ref(storage, `/${file.name + v4()}`);
            uploadBytes(refImagen, file).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((url) => {
                    let producto = {
                        nombre: nombre,
                        contador: cont,
                        cantidadLocal: 0,
                        precio: parseFloat(precio, 10),
                        ingredientes: tabla.tableContent,
                        imagen: url,
                    };
                    enviar("productos", producto);
                    alert("Agregado exitósamente");
                });
            });
        }
        setNombre("");
        setPrecio("");
        setPreview("/../public/camara.png");
        setPrompt("Añadir Imagen");
        setTabla({
            tableContent: [],
        });
    };

    function handleChange(e) {
        setFile(e.target.files[0]);
        setPreview(URL.createObjectURL(e.target.files[0]));
        setPrompt("");
    }

    function agregarItem(e, itemId) {
        let nuevaTab = tabla.tableContent;
        var cambio = false;
        for (var i = 0; i < tabla.tableContent.length; i++) {
            if (tabla.tableContent[i]["nombre"] == e.target.name) {
                nuevaTab[i]["cantidad"] += 1;
                cambio = true;
            }
        }
        if (!cambio && e.target.name != undefined) {
            nuevaTab.push({
                id: itemId,
                nombre: e.target.name,
                cantidad: 1,
            });
        }
        setTabla({
            tableContent: nuevaTab,
        });
    }

    function eliminarItem(e) {
        let nuevaTab = tabla.tableContent;

        for (var i = 0; i < nuevaTab.length; i++) {
            if (nuevaTab[i]["nombre"] == e.target.value) {
                nuevaTab = nuevaTab.filter(
                    (producto) => producto.nombre != e.target.value
                );
            }
        }
        if (nuevaTab == undefined) {
            setTabla({
                tableContent: [],
            });
        } else {
            setTabla({
                tableContent: nuevaTab,
            });
        }
    }

    const cambioCantidad = (e, itemId) => {
        let nuevaCantidad = e.target.value;
        let nuevaTab = tabla.tableContent;
        for (var i = 0; i < tabla.tableContent.length; i++) {
            if (tabla.tableContent[i]["id"] == itemId) {
                if (parseInt(nuevaCantidad) < 1) {
                    nuevaCantidad = 1;
                }
                nuevaTab[i]["cantidad"] = parseInt(nuevaCantidad);
            }
        }
        setTabla({
            tableContent: nuevaTab,
        });
    };

    return (
        <div className={InterFont.className}>
            <Head>
                <title>Crear Producto</title>
            </Head>
            <InactivityAlert />
            <div class={styles.body}>
                <swiper-container ref={swiperRef} init="false">
                    {materiales.map((material, i) => {
                        return (
                            <swiper-slide class={styles.slide} key={i}>
                                <button
                                    class={styles.boton}
                                    onClick={(e) => agregarItem(e, material.id)}
                                    name={material.nombre}
                                    value={material.id}
                                >
                                    <img
                                        src={material.imagen}
                                        alt="imagen"
                                        name={material.nombre}
                                        className={styles.icono}
                                        value={material.id}
                                    ></img>
                                    <span class={styles.texto}>{material.nombre}</span>
                                </button>
                            </swiper-slide>
                        );
                    })}
                </swiper-container>
                <form class={styles.container} onSubmit={enviarInfo}>
                    <div>
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
                        <input
                            id="imagen"
                            accept="image/png, image/jpeg"
                            type="file"
                            onChange={handleChange}
                            hidden
                        />
                        <button class={styles.boton} type="submit">
                            Crear Producto
                        </button>
                    </div>

                    <div>
                        <div class={styles.ingreso}>
                            <span>Nombre</span>
                            <input
                                class={styles.input}
                                onChange={(e) => setNombre(e.target.value)}
                                value={nombre}
                            ></input>
                        </div>

                        <div class={styles.ingreso}>
                            <span onClick={obtener}>Precio</span>
                            <input
                                class={styles.input}
                                pattern="^[0-9]+(?:\.[0-9]{2})?$"
                                title="Ingrese un precio válido (sin símbolos)"
                                onChange={(e) => setPrecio(e.target.value)}
                                value={precio}
                            ></input>
                        </div>

                        <table id="itemTable" class={styles.tabla}>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Cantidad</th>
                                    <th>Eliminar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tabla.tableContent.map((item) => (
                                    <tr key={item.id}>
                                        <td class={styleDatos.celda}>{item.nombre}</td>

                                        <td class={styles.celda}>
                                            <input
                                                class={styles.celdaEditable}
                                                value={item.cantidad}
                                                type="number"
                                                onChange={(e) => cambioCantidad(e, item.id)}
                                            ></input>
                                        </td>
                                        <td class={styleDatos.celda}>
                                            <button
                                                class={styleDatos.boton}
                                                type="button"
                                                value={item.nombre}
                                                onClick={eliminarItem}
                                            >
                                                -
                                            </button>
                                        </td>
                                        <td></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CrearProducto
