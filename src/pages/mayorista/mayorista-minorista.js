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
import InactivityAlert2 from '@/components/InactivityEmployee'
import { useRouter } from 'next/router'

export default function Home() {
    const [platillos, setPlatillos] = useState([]);
    const [orden, setOrden] = useState([]);
    const [fechaFirebase, setFechaFirebase] = useState([])
    const [pedidos, setPedidos] = useState([])
    const [contador, setContador] = useState([])
    const [loading, setLoading] = useState(true);
    const [restaurar, setRestaurar] = useState([])
    const [eliminarRestaurar, setEliminarRestaurar] = useState(false)
    const [eliminarPedidos, setEliminarPedidos] = useState(false)
    const router = useRouter()
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
    const fetchData = async () => {
        try {
            const result = await obtener("productos");
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
            } else {
                setOrden(JSON.parse(sessionStorage.getItem("platos")))
            }
        }
        fetchData();
    }, []);
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
                    eliminarDocumento("restaurar", restaurar[i].id)
                }
                setEliminarRestaurar(false)
            }
        }
        if (eliminarPedidos) {
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
                    if(pedidos[i].matActualizar.length>0){
                        for (let i = 0; i < matA.length; i++) {
                            modificarDocumento(matA[i].id, "materiales", matA[i])
                        }
                    }
                    enviar("finanza", data)
                    eliminarDocumento("pedidos", pedidos[i].id)
                    contador[0].actual = 0;
                    modificarDocumento(contador[0].id, "contador", contador[0])
                }
                // setEliminarPedidos(false)
            }
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
    return (
        <>
            <Head>
                <title>Comedor App</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {loading == true && <Loader></Loader>}
            <div>
                <InactivityAlert2 />
                <HomeBar enlace="mayorista-inicio"></HomeBar>
                <div className={styles.container}>
                    <Link className={styles.panel} href="mayorista-minorista-ordenar" onClick={() => setear()}>
                        <div className={styles.primero}><img src="../list.png" className={styles.imagen} alt="/imagen no encontrada"></img></div>
                        <div className={styles.segundo}> <div className={styles.sin}>Vender</div> </div>
                    </Link>
                    <Link className={styles.panel} href="mayorista-minorista-pedidosEmpleados">
                        <div className={styles.primero}><img src="../clock.png" className={styles.imagen} alt="/imagen no encontrada"></img></div>
                        <div className={styles.segundo}><div className={styles.sin}>Pedidos de minorista</div> </div>
                    </Link>
                </div>
            </div>
        </>
    )
}