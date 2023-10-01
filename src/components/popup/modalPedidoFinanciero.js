import enviar from "@/pages/api/firebase/post-data";
import eliminarDocumento from "@/pages/api/firebase/delete-data";
import PlatilloConfirmar from "../platilloConfirmar";
import styles from '@/styles/ModalPedido.module.css'
import { useEffect, useState } from "react";

export default function ModalPedidoFinanciero(props) {
    const { openPopUp, setOpenPopUp, data, setPresionado, presionado, tipo } = props;
    const [list, setList] = useState(data.pedido)
    const [newData, setNewData] = useState({
        contador: data.contador,
        pedido: data.pedido,
        total: data.total,
        fecha: data.fecha
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
            </div>
        </div>
    )
}