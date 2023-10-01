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
    const { openPopUp, setOpenPopUp, data, setPresionado, presionado, tipo, setRecargar } = props;
    const [list, setList] = useState(data.pedido)
    const [list2, setList2] = useState(data.pedido)
    const [materiales, setMateriales] = useState([])
    const [nuevaSet, setNuevaSet] = useState([]); // esta es la lista de materiales
    const [currentIngredientes, serCurrentIngredientes] = useState([])
    const [loading, setLoading] = useState(true);
    const [matActualizar, setMatActualizar] = useState([]) // esta es la que se deberá actualizar
    const [mod, setMod] = useState(false)
    const [numEmpanadas, setNumEmpanadas] = useState([])
    const [finanza, setFinanza] = useState([])
    const [dtF, setDtF] = useState([])
    const [fecha, setFecha] = useState(() => obtenerFechaFormateada())
    const [existe, setExiste] = useState(true)
    const [mensaje, setMensaje] = useState(false)
    const [mensaje2, setMensaje2] = useState(false)
    const [dtfB, setDTFB] = useState(false)
    const router = useRouter()

    const [newData, setNewData] = useState({
        contador: data.contador,
        pedido: data.pedido,
        total: data.total,
        fecha: data.fecha,
        hora: data.hora
    })
    // aquí vamos a restar empanadas
    const fetchData = async () => {
        try {
            const result = await obtener("empanadas");
            setNumEmpanadas(result);
        } catch (error) {
            // Handle the error if needed
            console.error("Error fetching data:", error);
        }
    };

    const fetchFinanza = async () => {
        try {
            const result = await obtener("finanza");
            setFinanza(result);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    const filtrarPedidosPorFecha = () => {
        const pedidosFiltrados = finanza.filter(pedido => pedido.fecha === fecha);
        let listaOrdenada = pedidosFiltrados.sort((a, b) => b.contador - a.contador);
        setDtF(listaOrdenada);
        setDTFB(true)
    };

    // logica para restar de ingredientes
    const obtenerMateriales = async (lista) => {
        let mat = await obtener("materiales")
        setMateriales(mat)
    }
    useEffect(() => {
        obtenerMateriales();
        fetchData();
        fetchFinanza();
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
            }
        } else if (dtfB) {
            setExiste(false)
            setDTFB(false)
        }
    }, [dtF])

    const restarEmpanadas = (cantidad) => {
        let restar = cantidad;
        if (numEmpanadas[0].masaAyer > 0) {
            if ((numEmpanadas[0].masaAyer >= cantidad)) {
                // aquí solo se la voy a quitar a numEmpanadas[0].masaAyer
                numEmpanadas[0].masaAyer = numEmpanadas[0].masaAyer - cantidad
                modificarDocumento(numEmpanadas[0].id, "empanadas", numEmpanadas[0])
                // luego de quitarle
                restar = 0
            } else {
                restar = cantidad - numEmpanadas[0].masaAyer // Aquí le quito a empanada ayer y me preparo para quitarle a empanada hoy
                numEmpanadas[0].masaAyer = 0
                // luego de quitarle continuo
            }
        }
        if (restar != 0) {
            // aquí debo quitarle a empanadaHoy
            numEmpanadas[0].cantidad = numEmpanadas[0].cantidad - restar
            modificarDocumento(numEmpanadas[0].id, "empanadas", numEmpanadas[0])
        }

    }

    useEffect(() => {
        if (materiales.length > 0) {
            if (list.length > 0) {
                const updatedNuevaSet = [];
                const updateIngredientes = []
                for (let i = 0; i < list.length; i++) {
                    list[i].ingredientes.forEach((ltItem) => {
                        const material = materiales.find((mat) => mat.id === ltItem.id);
                        if (material) {
                            updatedNuevaSet.push(material);
                            ltItem.cantidad = ltItem.cantidad * list[i].cantidadLocal
                            updateIngredientes.push(ltItem)
                        }
                    });
                }
                setLoading(false)
                serCurrentIngredientes(sumAndMergeDuplicates(updateIngredientes));
                setNuevaSet(removeDuplicatesById(updatedNuevaSet));
            }
        }
    }, [materiales])

    useEffect(() => {
        setMatActualizar(subtractQuantities(nuevaSet, currentIngredientes))
    }, [nuevaSet, currentIngredientes])

    const pedir = () => {
        if (list.length > 0) {
            const pedidos = {
                contador: data.contador,
                estado: data.estado,
                fecha: data.fecha,
                pedido: list,
                total: data.total,
                hora: data.hora,
                matActualizar: data.matActualizar,
            }
            console.log("Pedir despues", list, list2)
            enviar("finanza", pedidos)
            sessionStorage.setItem('ordenList', JSON.stringify([]));
            // esto ya funcionaba para cerrar el modal
            eliminarDocumento("pedidos", data.id)
            setPresionado(!presionado)
            setRecargar(true)
            setOpenPopUp(false);
        }
    }

    const modificarMateriales = () => {
        if (data.nombre != "empanada") {
            for (let i = 0; i < data.matActualizar.length; i++) {
                modificarDocumento(data.matActualizar[i].id, "materiales", data.matActualizar[i])
            }
        }
        let emp = list.find((item) => item.nombre == "empanada")
        if (emp) {
            restarEmpanadas(emp.cantidadLocal)
        }
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
                <div className={styles.numeroPedido}>Pedido #{newData.contador}</div>
                {mensaje && <div className={styles.error}>Este pedido ya ha sido enviado, recargue la página o revise los pedidos enviados</div>}
                {mensaje2 && <div className={styles.error}>No se puede enviar un pedido que ya se ha enviado</div>}
                <div className={styles.items}>
                    {data.pedido.map((item) => {
                        return (<PlatilloConfirmar key={item.nombre} data={item} list={list} setList={setList}></PlatilloConfirmar>)
                    })}
                </div>
                <div className={styles.totalPedido}>Total: {newData.total}</div>
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
                <button
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
                </button>
            </div>
        </div>
    )
}