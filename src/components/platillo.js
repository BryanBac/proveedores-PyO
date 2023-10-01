import { useEffect, useState } from "react"
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import styles from '@/styles/TarjetaPlatillo.module.css'

export default function Platillo(props) {
  const { data, list, setList, setActualizar, setOpenPopUp, listO, setListOrden } = props;
  const [cantidad, setCantidad] = useState(0);
  const [subTotal, setSubtotal] = useState(0);
  const [mostrarC, setMostrarC] = useState("")
  useEffect(() => {
    let objetoPrimera = listO.find((objeto) => objeto.nombre === data.nombre);
    let primeraCarga = 0
    if (objetoPrimera) {
      primeraCarga = objetoPrimera.cantidadLocal
    } else {
      objetoPrimera = list.find((objeto) => objeto.nombre === data.nombre);
      if (objetoPrimera) {
        primeraCarga = objetoPrimera.cantidadLocal
      }
    }
    if (primeraCarga != 0) {
      setCantidad(primeraCarga)
      setMostrarC(primeraCarga.toString())
    } else {
      setCantidad(0)
      setMostrarC("")
    }
  }, [])
  const restar = () => {
    if (cantidad > 1) {
      const listaN = list;
      for (let i = 0; i < listaN.length; i++) {
        if (listaN[i].id == data.id) {
          listaN[i].cantidadLocal = cantidad - 1;
        }
      }
      setList(listaN)
      if (cantidad > 1) {
        setCantidad(cantidad - 1)
        setMostrarC((cantidad - 1).toString())
      } else {
        setCantidad(0)
        setMostrarC("")
      }
      setActualizar(true)
    } else if(cantidad==1) {
      console.log("llego a cero")
      const listaNO = listO;
      for (let i = 0; i < listaNO.length; i++) {
        if (listaNO[i].nombre == data.nombre) {
          listaNO[i].cantidadLocal = 0;
          console.log("Se cambió")
        }
      }
      setListOrden(listaNO)
      const listaN = list;
      for (let i = 0; i < listaN.length; i++) {
        if (listaN[i].id == data.id) {
          listaN[i].cantidadLocal = 0;
        }
      }
      setList(listaN)
      setCantidad(0)
      setMostrarC("")
    }else{
      setCantidad(0)
      setMostrarC("")
    }
    setActualizar(true)
  }
  const sumar = () => {
    const listaN = list;
    for (let i = 0; i < listaN.length; i++) {
      if (listaN[i].id == data.id) {
        if (cantidad >= 0) {
          listaN[i].cantidadLocal = cantidad + 1;
        } else {
          listaN[i].cantidadLocal = 1;
        }

      }
    }
    setList(listaN)
    if (cantidad >= 0) {
      setCantidad(cantidad + 1)
      setMostrarC((cantidad+1),toString())
    } else {
      setCantidad(1)
      setMostrarC("1")
    }
    setActualizar(true)
  };
  const cambioEscrito = (valor) => {
    const listaN = list;
    for (let i = 0; i < listaN.length; i++) {
      if (listaN[i].id == data.id) {
        listaN[i].cantidadLocal = valor;
      }
    }
    setList(listaN)
    if (valor != 0) {
      setCantidad(valor)
      setMostrarC(valor.toString())
    } else {
      const listaNO = listO;
      for (let i = 0; i < listaNO.length; i++) {
        if (listaNO[i].nombre == data.nombre) {
          listaNO[i].cantidadLocal = 0;
          console.log("Se cambió")
        }
      }
      setListOrden(listaNO)
      const listaN = list;
      for (let i = 0; i < listaN.length; i++) {
        if (listaN[i].id == data.id) {
          listaN[i].cantidadLocal = 0;
        }
      }
      setList(listaN)
      setCantidad(0)
      setMostrarC("")
    }
    setActualizar(true)

  }
  useEffect(() => {
    console.log(cantidad)
    setSubtotal(cantidad * data.precio)
  }, [cantidad, data])
  return (
    <div className={styles.alinear}>
      <div className={styles.superContainer}>
        <div >
          <div className={styles.primero}><img className={styles.imagen} src={data.imagen} alt="/imagen no encontrada"></img></div>
          <div className={styles.segundo}>
            <div>{data.nombre}</div>
            <div>Q.{data.precio}</div>
          </div>
        </div>
        <div className={styles.barra}>
          <div className={styles.botonContainer}><button onClick={() => restar()}><RemoveIcon></RemoveIcon></button></div>
          <input className={styles.centrado} type="number" value={mostrarC} onChange={(event) => {
            cambioEscrito(Number(event.target.value))
          }}></input>
          <div className={styles.botonContainer}><button onClick={() => sumar()}><AddIcon></AddIcon></button></div>
        </div>
      </div>
    </div>
  )
}