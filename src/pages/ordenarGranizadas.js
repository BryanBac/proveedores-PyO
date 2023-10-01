import Head from 'next/head'
import styles from '@/styles/Ordenar.module.css'
import HomeBar from '@/components/home_bar'
import { useEffect, useState } from 'react'
import ArrowBack from '@/components/arrow_back'
import ArrowForward from '@/components/arrow_forward'
import Platillo from '@/components/platillo'
import Link from 'next/link'
import InactivityAlert2 from '@/components/InactivityEmployee'
import { useRouter } from 'next/router'

function eliminarDuplicados(lista) {
    const listaSinDuplicados = [];
  
    for (let i = 0; i < lista.length; i++) {
      let duplicado = false;
  
      for (let j = 0; j < listaSinDuplicados.length; j++) {
        if (lista[i].nombre === listaSinDuplicados[j].nombre) {
          duplicado = true;
          break;
        }
      }
  
      if (!duplicado) {
        listaSinDuplicados.push(lista[i]);
      }
    }
  
    return listaSinDuplicados;
  }

export default function PedidosGranizadas() {
    const router = useRouter()
    const [total, setTotal] = useState(0)
    const [tamL, setTamL] = useState(0)
    const [actualizar, setActualizar] = useState(false)
    const itemsPerPage = 4; // Number of items to display per page

    const nombresAAgregar = [
        "Granizada 1 Ingrediente",
        "Granizada 2 Ingredientes",
        "Granizada 3 Ingredientes",
        "Granizada 4 Ingredientes",
        "Granizada Mango Limon",
        "Extra"
    ];

    const [list, setList] = useState(() => {
        if (typeof window !== 'undefined' && window.sessionStorage) {
            const storedList = sessionStorage.getItem('platilloListGranizadas');
            let listaPreOrden = JSON.parse(storedList)
            const listaFiltrada = listaPreOrden.filter((objeto) => nombresAAgregar.includes(objeto.nombre));
            // console.log("Así entra list", listaFiltrada)
            return listaFiltrada
        } else {
            return []
        }
    });

    const [listOrden, setListOrden] = useState(() => {
        if (typeof window !== 'undefined' && window.sessionStorage) {
            const storedList = sessionStorage.getItem('ordenList');
            console.log("Granizadas")
            console.log("STDL",typeof storedList)
            let listaPreOrden = JSON.parse(storedList)
            return eliminarDuplicados(listaPreOrden)
        } else {
            return []
        }
    });
    const [currentPage, setCurrentPage] = useState(1);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const [currentItems, setCurrentItems] = useState([]);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                if (sessionStorage.getItem("acceso") !== "true") {
                    router.push('/');
                }
            } catch (error) {
                router.push('/');
            }
        }
    }, [router]);
    useEffect(() => {
        if (actualizar) {
            let valor = 0;
            for (let i = 0; i < list.length; i++) {
                valor = valor + (list[i].precio * list[i].cantidadLocal);
            }
            setTotal(valor)
            setActualizar(false)
        }
    }, [actualizar, list])
    useEffect(() => {
        if (list) {
            if (list.length > 0) {
                setCurrentItems(list.slice(startIndex, endIndex))
            }
        }
    }, [list, startIndex, endIndex])
    function modificarCantidadLocal(lista, nombreObjeto, valorSumar) {
        const objetoEncontrado = lista.find((objeto) => objeto.nombre === nombreObjeto);

        if (objetoEncontrado) {
            objetoEncontrado.cantidadLocal = valorSumar;
            return true; // Indica que se encontró y modificó el objeto
        }

        return false; // Indica que no se encontró el objeto
    }
    const setear = () => {
        let orden = listOrden
        let contador = 1;
        for (let i = 0; i < list.length; i++) {
            if (list[i].cantidadLocal != 0) {
                const objeto = {
                    id: contador,
                    imagen: list[i].imagen,
                    precio: list[i].precio,
                    cantidadLocal: list[i].cantidadLocal,
                    nombre: list[i].nombre,
                    ingredientes: list[i].ingredientes,
                    contador: list[i].contador
                }
                if (!modificarCantidadLocal(orden, list[i].nombre, list[i].cantidadLocal)) {
                    orden.push(objeto)
                }
                contador += 1
            }else{
                const objeto = {
                    id: contador,
                    imagen: list[i].imagen,
                    precio: list[i].precio,
                    cantidadLocal: list[i].cantidadLocal,
                    nombre: list[i].nombre,
                    ingredientes: list[i].ingredientes,
                    contador: list[i].contador
                }
                orden.push(objeto)
                contador += 1
            }
        }
        sessionStorage.setItem('ordenList', JSON.stringify(orden));
        if (orden.length == 0) {
            alert('No se han ingresado productos')
        }
        else {
            router.push("/verificarOrden")
        }
    }
    const setear2 = () => {
        let orden = listOrden;
        let contador = 1;
        let nuevaO= []
        for (let i = 0; i < list.length; i++) {
            if (list[i].cantidadLocal != 0) {
                const objeto = {
                    id: contador,
                    imagen: list[i].imagen,
                    precio: list[i].precio,
                    cantidadLocal: list[i].cantidadLocal,
                    nombre: list[i].nombre,
                    ingredientes: list[i].ingredientes,
                    contador: list[i].contador
                }
                if (!modificarCantidadLocal(orden, list[i].nombre, list[i].cantidadLocal)) {
                    orden.push(objeto)
                }
            }else{
                const objeto = {
                    id: contador,
                    imagen: list[i].imagen,
                    precio: list[i].precio,
                    cantidadLocal: list[i].cantidadLocal,
                    nombre: list[i].nombre,
                    ingredientes: list[i].ingredientes,
                    contador: list[i].contador
                }
                orden.push(objeto)
                contador += 1
            }
        }
        for(let j=0; j<orden.length;j++){
            if(orden[j].cantidadLocal!=0){
                nuevaO.push(orden[j])
            }
        }
        console.log("LOrden", typeof nuevaO)
        sessionStorage.setItem('ordenList', JSON.stringify(nuevaO));
        router.push("/ordenar")
    }
    useEffect(() => {
        if (list) {
            if (list.length > 0) {
                setTamL(list.length)
            }
        }
    }, [list])
    return (
        <>
            <Head>
                <title>Comedor App</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.inicio}>
                <HomeBar enlace="/inicio"></HomeBar>
                <InactivityAlert2 />
                <div className={styles.contenido}>
                    <ArrowBack currentPage={currentPage} setCurrentPage={setCurrentPage}></ArrowBack>
                    <div className={styles.contenidoContainer}>
                        <div className={styles.totales}>
                            <div className={styles.elementoTotales}>
                                <div> Total: </div>
                                <div className={styles.cajaTotales}>{total}</div>
                            </div>
                        </div>
                        <div className={styles.centrarHorizontal}><button className={styles.boton2} onClick={() => {
                            setear2()
                        }}>Menu</button></div>
                        <div className={styles.tarjetas}>
                            {currentItems.map((item) => {
                                return (<Platillo setListOrden={setListOrden} listO={listOrden} data={item} key={item.id} list={list} setList={setList} setActualizar={setActualizar}></Platillo>)
                            })}
                        </div>
                        <div className={styles.centrarHorizontal}><button className={styles.boton} onClick={() => {
                            setear()
                        }}>Siguiente</button></div>
                    </div>
                    <ArrowForward endIndex={endIndex} tamañoLista={tamL} currentPage={currentPage} setCurrentPage={setCurrentPage}></ArrowForward>
                </div>
            </div>
        </>
    )
}
