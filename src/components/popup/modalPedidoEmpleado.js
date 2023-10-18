import enviar from "@/pages/api/firebase/post-data";
import eliminarDocumento from "@/pages/api/firebase/delete-data";
import PlatilloConfirmar from "../platilloConfirmar";
import styles from '@/styles/ModalPedido.module.css'
import { useState, useEffect } from "react";
import obtener from "@/pages/api/firebase/get-data";
import modificarDocumento from "@/pages/api/firebase/update-data";
import { useRouter } from "next/router";

function sumAndMergeDuplicates(inputList) {
    const idMap = new Map();

    inputList.forEach((item) => {
        if (idMap.has(item.id)) {
            const existingItem = idMap.get(item.id);
            existingItem.cantidad += item.cantidad;
        } else {
            idMap.set(item.id, { ...item });
        }
    });

    return Array.from(idMap.values());
}

function removeDuplicatesById(inputList) {
    const idSet = new Set();
    const resultList = [];

    inputList.forEach((item) => {
        if (!idSet.has(item.id)) {
            idSet.add(item.id);
            resultList.push(item);
        }
    });

    return resultList;
}

function subtractQuantities(list1, list2) {
    const resultList = [];

    for (let i = 0; i < list1.length; i++) {
        const newItem = { ...list1[i] };
        const matchingItem = list2.find(item => item.id === newItem.id);

        if (matchingItem) {
            newItem.cantidadLocal -= matchingItem.cantidad;
        }

        resultList.push(newItem);
    }

    return resultList;
}

const obtenerFechaFormateada = () => {
    const fechaActual = new Date();
    const dia = String(fechaActual.getDate()).padStart(2, '0');
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); // +1 porque los meses comienzan desde 0
    const anio = fechaActual.getFullYear();
    return `${dia}/${mes}/${anio}`;
};

export default function ModalPedidoEmpleado(props) {
    const { openPopUp, setOpenPopUp, data, data2, setPresionado, presionado, tipo, setRecargar, estamosEn, aceptar } = props;
    const [list, setList] = useState(data.pedido)
    const [mod, setMod] = useState(false)
    const [finanza, setFinanza] = useState([])
    const [dtF, setDtF] = useState([])
    const [fecha, setFecha] = useState(() => obtenerFechaFormateada())
    const [existe, setExiste] = useState(false)
    const [mensaje, setMensaje] = useState(false)
    const [mensaje2, setMensaje2] = useState(false)
    const [dtfB, setDTFB] = useState(false)
    const [productos, setProductos] = useState([])
    const [productosA, setProductosA] = useState([])
    const [nuevosProductos, setNuevosProductos] = useState([])
    const [loadingA, setLoadingA] = useState(false)
    const router = useRouter()

    const fetchFinanza = async () => {
        try {
            const result = await obtener("finanza");
            setFinanza(result);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    const fetchProductosDescontar = async () => {
        try {
            let deDonde = ""
            if (estamosEn == "mayorista-fabrica") {
                deDonde = "productosFabrica";
            } else if (estamosEn == "mayorista-minorista") {
                deDonde = "productosMayorista"
            }
            const result = await obtener(deDonde);
            setProductos(result);
        } catch (error) {
            // Handle the error if needed
            console.error("Error fetching data:", error);
        }
    };
    const fetchProductosAcreditar = async () => {
        try {
            let deDonde = ""
            if (estamosEn == "mayorista-fabrica") {
                deDonde = "productosMayorista";
            } else if (estamosEn == "mayorista-minorista") {
                deDonde = "productosMinorista"
            }
            const result = await obtener(deDonde);
            setProductosA(result);
            setLoadingA(true)
        } catch (error) {
            // Handle the error if needed
            console.error("Error fetching data:", error);
        }
    };
    const filtrarPedidosPorFecha = () => {
        const pedidosFiltrados = finanza.filter(pedido => pedido.fecha === fecha);
        let listaOrdenada = pedidosFiltrados.sort((a, b) => b.contador - a.contador);
        setDtF(listaOrdenada);
        setDTFB(true)
    };

    useEffect(() => {
        fetchFinanza();
        fetchProductosDescontar()
        fetchProductosAcreditar()
        console.log("Data", data)
    }, []);
    useEffect(() => {
        if (finanza.length) {
            filtrarPedidosPorFecha()
        }
    }, [finanza])
    useEffect(() => {
        if (dtF.length > 0) {
            const existing = dtF.find((item) => item.contador == data.contador)
            if (existing) {
                setExiste(true)
                setMensaje(true)
            } else {
                setExiste(false)
                setMensaje2(false)
            }
        } else if (dtfB) {
            setExiste(false)
            setDTFB(false)
        }
    }, [dtF])

    useEffect(() => { // aquí hago el descuento de las existencias
        if (productos.length > 0 && data2.pedido.length > 0 && loadingA) {
            let acreditar = []
            for (let i = 0; i < productos.length; i++) {
                for (let j = 0; j < data2.pedido.length; j++) {
                    if (productos[i].id == data2.pedido[j].id) {
                        productos[i].existencia -= data2.pedido[j].cantidadLocal;
                        console.log("Acreditar: ", data2.pedido[j].nombre)
                        acreditar.push(data2.pedido[j])
                    }
                }
            }
            // esto de aquí son los productos que voy a comprar
            for (let i = 0; i < acreditar.length; i++) {
                let existing = productosA.find((item)=>item.nombre == acreditar[i].nombre)
                if(existing){
                    existing.existencia += acreditar[i].cantidadLocal;
                }else{
                    let prod = {
                        caducidad:acreditar[i].caducidad,
                        cantidadLocal:0,
                        existencia:acreditar[i].cantidadLocal,
                        fecha:acreditar[i].fecha,
                        imagen:acreditar[i].imagen,
                        medida:acreditar[i].medida,
                        nombre:acreditar[i].nombre,
                        precio:acreditar[i].precio,
                        unidades:acreditar[i].unidades
                    }
                    nuevosProductos.push(prod)
                }
            }
            console.log("Productos A", productosA, "Nuevos productos", nuevosProductos)
        }
    }, [productos, data2, productosA, loadingA])

    const pedir = () => {
        if (list.length > 0) {
            let pedidos = {
            }
            if (estamosEn == "mayorista-fabrica") {
                pedidos = {
                    contador: data.contador,
                    estado: data.estado,
                    fecha: data.fecha,
                    pedido: list,
                    total: data.total,
                    hora: data.hora,
                    minorista: data.minorista
                }
                console.log(typeof pedidos, typeof productos, typeof productosA)
                sessionStorage.setItem('ordenList', JSON.stringify([]));
                // actualizo las existencias
                for(let i = 0; i<productos.length; i++){
                    modificarDocumento(productos[i].id, "productosFabrica", productos[i])
                }
                for(let i = 0; i<productosA.length; i++){
                    modificarDocumento(productosA[i].id, "productosMayorista", productosA[i])
                }
                // envio los nuevos productos comprados
                for(let i=0; i<nuevosProductos.length; i++){
                    enviar("productosMayorista", nuevosProductos[i])
                }
                // envio el registro del pedido a finanza
                enviar("finanzaFabrica", pedidos)
                eliminarDocumento("pedidosFabrica", data.id)
                // me falta agregar los productos que compré a los produtos del mayorista
            } else if (estamosEn == "mayorista-minorista") {
                pedidos = {
                    contador: data.contador,
                    estado: data.estado,
                    fecha: data.fecha,
                    pedido: list,
                    total: data.total,
                    hora: data.hora,
                    minorista: data.minorista
                }
                console.log(typeof pedidos, typeof productos, typeof productosA)
                sessionStorage.setItem('ordenList', JSON.stringify([]));
                // actualizo las existencias
                for(let i = 0; i<productos.length; i++){
                    modificarDocumento(productos[i].id, "productosMayorista", productos[i])
                }
                for(let i = 0; i<productosA.length; i++){
                    modificarDocumento(productosA[i].id, "productosMinorista", productosA[i])
                }
                // envio los nuevos productos comprados
                for(let i=0; i<nuevosProductos.length; i++){
                    enviar("productosMinorista", nuevosProductos[i])
                }
                // envio el registro del pedido a finanza
                enviar("finanzaMayorista", pedidos)
                eliminarDocumento("pedidosMayorista", data.id)
                // me falta agregar los productos que compré a los produtos del mayorista
            } else {

            }
            setPresionado(!presionado)
            setRecargar(true)
            setOpenPopUp(false);
        }
    }

    const modificarMateriales = () => {
        setMod(true)
    }

    useEffect(() => {
        if (mod) {
            pedir()
        }
    }, [mod])

    return (
        <div>
            <div className={styles.tarjetas}>
                <div className={styles.numeroPedido}>Pedido #{data.contador}</div>
                {mensaje && <div className={styles.error}>Este pedido ya ha sido enviado, recargue la página o revise los pedidos enviados</div>}
                {mensaje2 && <div className={styles.error}>No se puede enviar un pedido que ya se ha enviado</div>}
                <div className={styles.items}>
                    {data.pedido.map((item) => {
                        return (<PlatilloConfirmar key={item.nombre} data={item} list={list} setList={setList}></PlatilloConfirmar>)
                    })}
                </div>
                <div className={styles.totalPedido}>Total: {data.total}</div>
            </div>
            <div className={styles.centrar}>
                <button
                    className={styles.boton}
                    type=""
                    onClick={() => {
                        setOpenPopUp(false);
                    }}
                >
                    Cancelar
                </button>
                {aceptar && <button
                    className={styles.boton2}
                    type=""
                    onClick={() => {
                        console.log(existe)
                        if (!existe) {
                            modificarMateriales();
                        } else {
                            setMensaje2(true)
                        }
                    }}
                >
                    Enviar Orden
                </button>}
            </div>
        </div>
    )
}