import enviar from "@/pages/api/firebase/post-data";
import eliminarDocumento from "@/pages/api/firebase/delete-data";
import PlatilloConfirmar from "../platilloConfirmar";
import styles from '@/styles/ModalPedido.module.css'
import { useEffect, useState } from "react";
import obtener from "@/pages/api/firebase/get-data";
import modificarDocumento from "@/pages/api/firebase/update-data";

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

function addQuantities(list1, list2) {
    const resultList = [];

    for (let i = 0; i < list1.length; i++) {
        const newItem = { ...list1[i] };
        const matchingItem = list2.find(item => item.id === newItem.id);

        if (matchingItem) {
            newItem.cantidadLocal += matchingItem.cantidad;
        }

        resultList.push(newItem);
    }

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

export default function ModalPedidoRegresar(props) {
    const { openPopUp, setOpenPopUp, data, setPresionado, presionado, tipo, materiales } = props;
    const [list, setList] = useState(data.pedido)
    const [ya, setYa] = useState(false) // esto es para que ya lo devuelva
    const [platillos, setPlatillos] = useState([])
    const [currentIngredientes, serCurrentIngredientes] = useState([])
    const [nuevaSet, setNuevaSet] = useState([]); // esta es la lista de materiales
    const [matActualizar, setMatActualizar] = useState([]) // esta es la que se deberá actualizar
    const [matActualizar2, setMatActualizar2] = useState([])
    const [nuevoPedido, setNuevoPedido] = useState([])
    const [newData, setNewData] = useState({
        contador: data.contador,
        estado: data.estado,
        fecha: data.fecha,
        pedido: nuevoPedido,
        total: data.total,
        hora: data.hora,
        matActualizar: matActualizar2
    })
    const fetchData = async () => {
        try {
            const result = await obtener("productos");
            setPlatillos(result);
        } catch (error) {
            // Handle the error if needed
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        console.log("Id", data.id)
        console.log("pedido", data.pedido)
        fetchData();
    }, [])

    const preparar = () => {
        let listaActualizar = []
        // list = data.pedido
        for (let i = 0; i < list.length; i++) {
            let existe = platillos.find((item) => item.nombre == list[i].nombre)
            if (existe) {
                existe.cantidadLocal = list[i].cantidadLocal
                listaActualizar.push(existe)
            }
        }
        if (listaActualizar.length > 0) {
            const updatedNuevaSet = [];
            const updateIngredientes = []
            for (let i = 0; i < listaActualizar.length; i++) {
                listaActualizar[i].ingredientes.forEach((ltItem) => {
                    const material = materiales.find((mat) => mat.id === ltItem.id);
                    if (material) {
                        updatedNuevaSet.push(material);
                        ltItem.cantidad = ltItem.cantidad * listaActualizar[i].cantidadLocal
                        updateIngredientes.push(ltItem)
                    }
                });
            }
            setNuevoPedido(listaActualizar)
            serCurrentIngredientes(sumAndMergeDuplicates(updateIngredientes));
            setNuevaSet(removeDuplicatesById(updatedNuevaSet));
        }
    }

    useEffect(() => {
        if (platillos.length > 0) {
            preparar()
        }
    }, [platillos])

    useEffect(() => {
        setMatActualizar2(subtractQuantities(nuevaSet, currentIngredientes))
        setMatActualizar(addQuantities(nuevaSet, currentIngredientes))
    }, [nuevaSet, currentIngredientes])

    const actualizar = () => {
        if (ya) {
            for (let i = 0; i < matActualizar.length; i++) {
                modificarDocumento(matActualizar[i].id, "materiales", matActualizar[i])
            }
            let dtN = {
                contador: data.contador,
                estado: data.estado,
                fecha: data.fecha,
                pedido: data.pedido,
                total: data.total,
                hora: data.hora,
                matActualizar: matActualizar2
            }
            
            enviar("pedidos", dtN)
            eliminarDocumento("finanza", data.id)
            setPresionado(!presionado)
            setOpenPopUp(false);
        }
    }
    const eliminarDefinitivo = () => {
        if (ya) {
            for (let i = 0; i < matActualizar.length; i++) {
                modificarDocumento(matActualizar[i].id, "materiales", matActualizar[i])
            }
            eliminarDocumento("finanza", data.id)
            setPresionado(!presionado)
            setOpenPopUp(false);
        }
    }
    useEffect(() => {
        if (matActualizar.length > 0) {
            console.log("Estos se van a agregar:", matActualizar)
            console.log("Estos se van a preparar para quitarlos", matActualizar2)
            setYa(true)
        }
    }, [matActualizar, matActualizar2])

    return (
        <div>
            <div className={styles.tarjetas}>
                <div className={styles.numeroPedido}>Pedido #{newData.contador}</div>
                <div className={styles.items}>
                    {data.pedido.map((item) => {
                        return (<PlatilloConfirmar data={item} key={item.nombre} list={list} setList={setList}></PlatilloConfirmar>)
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
                {/*<button
                    className={styles.boton2}
                    type=""
                    onClick={() => {
                        actualizar()
                    }}
                >
                    {tipo ? "Eliminar" : "Restaurar"}
                </button>*/}
                <button
                    className={styles.boton3}
                    type=""
                    onClick={() => {
                        eliminarDefinitivo()
                    }}
                >
                    Eliminar
                </button>
            </div>
        </div>
    )
}