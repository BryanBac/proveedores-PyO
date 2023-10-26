import styles from '@/styles/Inicio.module.css'
import Head from 'next/head'
import HomeBar from '@/components/home_bar'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import obtener from '../api/firebase/get-data'
import enviar from '../api/firebase/post-data'
import modificarDocumento from '../api/firebase/update-data'
import eliminarDocumento from '../api/firebase/delete-data'
import Loader from '@/components/loader'
import TablaProductos from '@/components/tables/tablaProductos'
import InactivityAlert2 from '@/components/InactivityEmployee'
import ModalPopUp from '@/components/popup/popup'
import ModalPedidoFinanciero from '@/components/popup/modalPedidoFinanciero'
import { useRouter } from 'next/router'
import MiniDrawer from '../menuV2'


const Home = () => {
    const [platillos, setPlatillos] = useState([]);
    const [orden, setOrden] = useState([]);
    const [fechaFirebase, setFechaFirebase] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [contador, setContador] = useState([])
    const [openPopUp, setOpenPopUp] = useState(false);
    const [dataPresionada, setDataPresionada] = useState([])
    const [loading, setLoading] = useState(true);
    const [dataProductos, setDataProductos] = useState([])
    const [finanza, setFinanza] = useState([]);
    const [total, setTotal] = useState(0)
    const [presionado, setPresionado] = useState(false)
    const [restaurar, setRestaurar] = useState([])
    const [eliminarRestaurar, setEliminarRestaurar] = useState(false)
    const [eliminarPedidos, setEliminarPedidos] = useState(false)
    const [fechaHoy, setFechaHoy] = useState("")
    const [numEmpanadas, setNumEmpanadas] = useState([])
    const [empCant, setEmpCant] = useState(0)
    const router = useRouter()

    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                if (sessionStorage.getItem("acceso") !== "true") {
                    router.push('/');
                }
                if (sessionStorage.getItem("tipo") == "1") {
                    router.replace('/fabrica/inicio');
                } else if (sessionStorage.getItem("tipo") == "2") {
                    router.replace('/mayorista/mayorista-inicio');
                }else{
                }
            } catch (error) {
                console.error(error)
            }
        }
    }, [])
    const fetchData = async () => {
        try {
            const result = await obtener("productosMayorista");
            setPlatillos(result);
        } catch (error) {
            // Handle the error if needed
            console.error("Error fetching data:", error);
        }
    };
    const fetchFecha = async () => {
        try {
            const result = await obtener("fecha");
            setFechaFirebase(result);
        } catch (error) {
            // Handle the error if needed
            console.error("Error fetching data:", error);
        }
    };
    const fetchContador = async () => {
        try {
            const result = await obtener("contadorMayorista");
            setContador(result);
        } catch (error) {
            // Handle the error if needed
            console.error("Error fetching data:", error);
        }
    };
    const fetchPedidos = async () => {
        try {
            const result = await obtener("pedidosMayorista");
            setPedidos(result);
        } catch (error) {
            // Handle the error if needed
            console.error("Error fetching data:", error);
        }
    };
    const fetchRestaurar = async () => {
        try {
            const result = await obtener("restaurarMayorista");
            setRestaurar(result);
        } catch (error) {
            // Handle the error if needed
            console.error("Error fetching data:", error);
        }
    };
    useEffect(() => {
        if (typeof window !== 'undefined' && window.sessionStorage) {
            sessionStorage.setItem('ordenList', JSON.stringify([]));
            if (sessionStorage.getItem('fc') == null) {
                const currentDate = new Date();
                const formattedDate = currentDate.toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                });
                sessionStorage.setItem('fc', formattedDate)
                fetchFecha();
                fetchPedidos();
                fetchRestaurar();
                fetchContador();
                fetchEmpanada()
            } else {
                setOrden(JSON.parse(sessionStorage.getItem("platos")))
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (dataProductos.length > 0) {
            let st = 0
            for (let i = 0; i < dataProductos.length; i++) {
                st = st + dataProductos[i].total;
            }
            setTotal(st)
        } else {
            setTotal(0)
        }
    }, [dataProductos])
    useEffect(() => {
        if (fechaFirebase.length > 0) {
            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
            if (formattedDate != fechaFirebase[0].fecha) {
                fechaFirebase[0].fecha = formattedDate;
                modificarDocumento(fechaFirebase[0].id, "fecha", fechaFirebase[0])
                setEliminarPedidos(true)
                setEliminarRestaurar(true)
            }
        }
    }, [fechaFirebase])
    useEffect(() => {
        if (eliminarRestaurar) {
            if (restaurar.length > 0) {
                for (let i = 0; i < restaurar.length; i++) {
                    eliminarDocumento("restaurarMayorista", restaurar[i].id)
                }
                setEliminarRestaurar(false)
            }
        }
        if (eliminarPedidos) {
            let empanadasCantidad = 0;
            if (pedidos.length > 0) {
                for (let i = 0; i < pedidos.length; i++) {
                    const data = {
                        contador: pedidos[i].contador,
                        estado: pedidos[i].estado,
                        fecha: pedidos[i].fecha,
                        pedido: pedidos[i].pedido,
                        total: pedidos[i].total,
                        hora: pedidos[i].hora
                    }
                    let matA = []
                    matA = pedidos[i].matActualizar
                    if (pedidos[i].matActualizar.length > 0) {
                        for (let i = 0; i < matA.length; i++) {
                            modificarDocumento(matA[i].id, "materiales", matA[i])
                        }
                    }
                    enviar("finanza", data)
                    eliminarDocumento("pedidosMayorista", pedidos[i].id)
                    contador[0].actual = 0;
                    modificarDocumento(contador[0].id, "contadorMayorista", contador[0])
                    
                }
                // setEliminarPedidos(false)
            }
            setEmpCant(empanadasCantidad)
        }
    }, [eliminarRestaurar, eliminarPedidos, restaurar, pedidos])

    const setear = () => {
        sessionStorage.setItem("platilloList", JSON.stringify(orden));
        sessionStorage.setItem("ordenList", JSON.stringify(orden));
        sessionStorage.setItem("platilloListGranizadas", JSON.stringify(orden));
        sessionStorage.setItem("platos", JSON.stringify(orden));
    }
    useEffect(() => {
        if (platillos.length > 0) {
            const sortedList = [...platillos].sort((a, b) => a.contador - b.contador);
            setOrden(sortedList)
            setLoading(false)
        }
    }, [platillos])
    useEffect(() => {
        if (empCant > 0 && numEmpanadas.length > 0) {
            restarEmpanadas(empCant)
        }
    }, [empCant, numEmpanadas])

    return (
        <>
            <Head>
                <title>SupplyPro</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {loading == true && <Loader></Loader>}
            <MiniDrawer>
                <div>
                    <ModalPopUp
                        openPopUp={openPopUp}
                        setOpenPopUp={setOpenPopUp}
                    >
                        <ModalPedidoFinanciero data={dataPresionada} tipo={true} presionado={presionado} setPresionado={setPresionado}></ModalPedidoFinanciero>
                    </ModalPopUp>
                    <InactivityAlert2 />
                    <div className={styles.container}>
                        <Link className={styles.panel} href="minorista-ordenar" onClick={() => setear()}>
                            <div className={styles.primero}><img src="../list.png" className={styles.imagen} alt="/imagen no encontrada"></img></div>
                            <div className={styles.segundo}> <div className={styles.sin}>Realizar Pedido</div> </div>
                        </Link>
                        <Link className={styles.panel} href="minorista-pedidosEmpleados">
                            <div className={styles.primero}><img src="../clock.png" className={styles.imagen} alt="/imagen no encontrada"></img></div>
                            <div className={styles.segundo}><div className={styles.sin}>Ver Pedidos</div> </div>
                        </Link>
                    </div>
                </div>
            </MiniDrawer>
        </>
    )
}
export default Home;