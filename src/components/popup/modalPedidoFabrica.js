import enviar from "@/pages/api/firebase/post-data";
import eliminarDocumento from "@/pages/api/firebase/delete-data";
import modificarDocumento from "@/pages/api/firebase/update-data";
import obtener from "@/pages/api/firebase/get-data";
import PlatilloConfirmar from "../platilloConfirmar";
import styles from '@/styles/ModalPedido.module.css'
import { useEffect, useState } from "react";

export default function ModalPedido(props) {
    const { openPopUp, setOpenPopUp, data, setPresionado, presionado, tipo } = props;
    const [list, setList] = useState(data.pedido)
    const [newData, setNewData] = useState({
        contador: data.contador,
        estado: data.estado,
        fecha: data.fecha,
        pedido: data.pedido,
        total: data.total,
        hora: data.hora,
        matActualizar: data.matActualizar,
        mayorista: data.mayorista
    })

    const reducirInventario = async (productos) => {
        let nuevaExistencia = 0
        let mensaje = ''
        let permitido = true
        let inventario = await obtener('productosFabrica')
        let productoInventario

        // Verifica que se cuente con el inventario suficiente para completar el pedido
        productos.map((producto) => {
            for (let i = 0; i < inventario.length; i++) {
                // Busca el producto en inventario
                if (producto.id === inventario[i].id) {
                    productoInventario = inventario[i]
                }
            }
            if (productoInventario.existencia < producto.cantidadLocal) {
                mensaje = mensaje + '\n' + producto.nombre
                permitido = false
            }
        })

        if (permitido) {
            // Si se permite, se actualizan los productos en inventario
            enviar("completadosFabrica", newData)
            eliminarDocumento("pedidosFabrica", data.id)
            productos.map((producto) => {
                for (let i = 0; i < inventario.length; i++) {
                    if (producto.id === inventario[i].id) {
                        productoInventario = inventario[i]
                    }
                }
                nuevaExistencia = productoInventario.existencia - producto.cantidadLocal
                modificarDocumento(producto.id, 'productosFabrica', {
                    existencia: nuevaExistencia
                })
            })
        }
        else {
            alert('No se cuentan con productos suficientes para completar el pedido' + mensaje)
        }
    }

    const ingresarInventario = async (productos) => {
        let nuevaExistencia = 0
        let mensaje = ''
        let permitido = true
        let inventario = await obtener('productosFabrica')
        let productoInventario

        enviar("pedidosFabrica", newData)
        eliminarDocumento("completadosFabrica", data.id)
        productos.map((producto) => {
            for (let i = 0; i < inventario.length; i++) {
                if (producto.id === inventario[i].id) {
                    productoInventario = inventario[i]
                }
            }
            nuevaExistencia = productoInventario.existencia + producto.cantidadLocal
            modificarDocumento(producto.id, 'productosFabrica', {
                existencia: nuevaExistencia
            })
        })
    }

    return (
        <div>
            <div className={styles.tarjetas}>
                <div className={styles.numeroPedido}>Pedido #{newData.contador} - {newData.mayorista}</div>
                <div className={styles.items}>
                    {data.pedido.map((item) => {
                        return (<PlatilloConfirmar data={item} key={item.nombre} list={list} setList={setList}></PlatilloConfirmar>)
                    })}
                </div>
                <div className={styles.totalPedido}>Total: Q{newData.total}</div>
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
                        if (tipo) {
                            reducirInventario(newData.pedido)
                        } else {
                            ingresarInventario(newData.pedido)
                        }
                        setPresionado(!presionado)
                        setOpenPopUp(false);
                    }}
                >
                    {tipo ? "Completar" : "Restaurar"}
                </button>
            </div>
        </div>
    )
}