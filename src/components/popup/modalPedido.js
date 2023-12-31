import enviar from "@/pages/api/firebase/post-data";
import eliminarDocumento from "@/pages/api/firebase/delete-data";
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
        matActualizar: data.matActualizar
    })

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
                <button
                    className={styles.boton2}
                    type=""
                    onClick={() => {
                        if (tipo) {
                            enviar("restaurar", newData)
                            eliminarDocumento("pedidos", data.id)
                        } else {
                            enviar("pedidos", newData)
                            eliminarDocumento("restaurar", data.id)
                        }
                        setPresionado(!presionado)
                        setOpenPopUp(false);
                    }}
                >
                    {tipo ? "Eliminar" : "Restaurar"}
                </button>
            </div>
        </div>
    )
}