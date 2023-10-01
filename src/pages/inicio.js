import styles from '@/styles/Inicio.module.css'
import Head from 'next/head'
import HomeBar from '@/components/home_bar'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import obtener from './api/firebase/get-data'
import enviar from './api/firebase/post-data'
import modificarDocumento from './api/firebase/update-data'
import eliminarDocumento from './api/firebase/delete-data'
import Loader from '@/components/loader'
import TablaProductos from '@/components/tables/tablaProductos'
import InactivityAlert2 from '@/components/InactivityEmployee'
import TablaOriginal from '@/components/tables/tablaOriginal'
import ModalPopUp from '@/components/popup/popup'
import ModalPedidoFinanciero from '@/components/popup/modalPedidoFinanciero'
import { useRouter } from 'next/router'

export default function Home() {
    const [platillos, setPlatillos] = useState([]);
    const [orden, setOrden] = useState([]);
    const [fechaFirebase, setFechaFirebase] = useState([])
    const [pedidos, setPedidos] = useState([])
    const [contador, setContador] = useState([])
    const [openPopUp, setOpenPopUp] = useState(false);
    const [dataPresionada, setDataPresionada] = useState([])
    const [loading, setLoading] = useState(true);
    const [dataProductos, setDataProductos] = useState([])
    const [finanza, setFinanza] = useState([])
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
    const fetchEmpanada = async () => {
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
            const result = await obtener("contador");
            setContador(result);
        } catch (error) {
            // Handle the error if needed
            console.error("Error fetching data:", error);
        }
    };
    const fetchPedidos = async () => {
        try {
            const result = await obtener("pedidos");
            setPedidos(result);
        } catch (error) {
            // Handle the error if needed
            console.error("Error fetching data:", error);
        }
    };
    const fetchRestaurar = async () => {
        try {
            const result = await obtener("restaurar");
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
        fetchFinanza();
    }, []);
    const filtrarPedidosPorFecha = () => {
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
        setFechaHoy(formattedDate)
        const pedidosFiltrados = finanza.filter(pedido => pedido.fecha === formattedDate);
        let listaOrdenada = pedidosFiltrados.sort((a, b) => b.contador - a.contador);
        setDataProductos(listaOrdenada);
    };

    useEffect(() => {
        if (finanza.length > 0) {
            filtrarPedidosPorFecha()
        }
    }, [finanza])

    const restarEmpanadas = (cantidad) =>{
        let restar = cantidad;
        if(numEmpanadas[0].masaAyer>0){
            if((numEmpanadas[0].masaAyer>=cantidad)){
                // aquí solo se la voy a quitar a numEmpanadas[0].masaAyer
                numEmpanadas[0].masaAyer = numEmpanadas[0].masaAyer - cantidad
                modificarDocumento(numEmpanadas[0].id, "empanadas", numEmpanadas[0])
                // luego de quitarle
                restar = 0
            }else{
                restar = cantidad - numEmpanadas[0].masaAyer // Aquí le quito a empanada ayer y me preparo para quitarle a empanada hoy
                numEmpanadas[0].masaAyer = 0
                // luego de quitarle continuo
            }
        }
        if(restar!=0){
            // aquí debo quitarle a empanadaHoy
            numEmpanadas[0].cantidad = numEmpanadas[0].cantidad - restar
            modificarDocumento(numEmpanadas[0].id, "empanadas", numEmpanadas[0])
        }
        
    }

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
                    eliminarDocumento("restaurar", restaurar[i].id)
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
                    if(pedidos[i].matActualizar.length>0){
                        for (let i = 0; i < matA.length; i++) {
                            modificarDocumento(matA[i].id, "materiales", matA[i])
                        }
                    }
                    enviar("finanza", data)
                    eliminarDocumento("pedidos", pedidos[i].id)
                    contador[0].actual = 0;
                    modificarDocumento(contador[0].id, "contador", contador[0])
                    let emp = pedidos[i].pedido.find((item) => item.nombre == "empanada")
                    if(emp){
                        empanadasCantidad = empanadasCantidad + emp.cantidadLocal
                    }
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
    useEffect(()=>{
        if(empCant>0 && numEmpanadas.length>0){
            restarEmpanadas(empCant)
        }
    }, [empCant, numEmpanadas])
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
                <ModalPopUp
                    openPopUp={openPopUp}
                    setOpenPopUp={setOpenPopUp}
                >
                    <ModalPedidoFinanciero data={dataPresionada} tipo={true} presionado={presionado} setPresionado={setPresionado}></ModalPedidoFinanciero>
                </ModalPopUp>
                <InactivityAlert2 />
                <HomeBar enlace="/inicio"></HomeBar>
                <div className={styles.container}>
                    <Link className={styles.panel} href="ordenar" onClick={() => setear()}>
                        <div className={styles.primero}><img src="list.png" className={styles.imagen} alt="/imagen no encontrada"></img></div>
                        <div className={styles.segundo}> <div className={styles.sin}>Ordenar</div> </div>
                    </Link>
                    <Link className={styles.panel} href="pedidosEmpleados">
                        <div className={styles.primero}><img src="clock.png" className={styles.imagen} alt="/imagen no encontrada"></img></div>
                        <div className={styles.segundo}><div className={styles.sin}>Pedidos</div> </div>
                    </Link>
                </div>
                <div className={styles.containerSegundo}>
                    <Link className={styles.panel2} href="empanada">
                        <div className={styles.primero}><img src="empanada.png" className={styles.imagen} alt="/imagen no encontrada"></img></div>
                        <div className={styles.segundo}><div className={styles.sin}>Empanadas</div> </div>
                    </Link>
                    <div className={styles.tabla}><TablaOriginal data={dataProductos} total={total} setDataPresionada={setDataPresionada} setOpenPopUp={setOpenPopUp}></TablaOriginal></div>
                </div>
            </div>
        </>
    )
}