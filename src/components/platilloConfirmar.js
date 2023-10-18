import { useEffect, useState } from "react"
import styles from '@/styles/TarjetaConfirmar.module.css'

export default function PlatilloConfirmar(props) {
  const { data, list, setList } = props;
  const [cantidad, setCantidad] = useState(0);
  const [subTotal, setSubtotal] = useState(0);
  useEffect(() => {
    let objetoPrimera = list.find((objeto) => objeto.nombre === data.nombre);
    let primeraCarga = objetoPrimera.cantidadLocal
    setCantidad(primeraCarga)
  }, [])
  useEffect(() => {
    setSubtotal(cantidad * data.precio)
  }, [cantidad, data])

  const calcularSubTotal = () => {
    return cantidad * data.precio;
  }
  return (
    <div className={styles.alinear}>
      <div className={styles.superContainer}>
        <div className={styles.tarjeta}>
          <div className={styles.primero}><img className={styles.imagen} src={data.imagen} alt="/imagen no encontrada"></img></div>
          <div className={styles.segundo}>
            <div>{data.nombre}:</div>
            <div>Q{data.precio}</div>
          </div>
        </div>
        <div className={styles.barra}>
          <div className={styles.subTotal}>
            <div >Cantidad: {data.cantidadLocal}</div>
            <div >SubTotal: Q{calcularSubTotal()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}