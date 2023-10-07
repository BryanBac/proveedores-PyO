import { useState, useEffect } from "react"
import { useRouter } from "next/router";
import obtener from "./api/firebase/get-data"
import styles from '@/styles/Financiera.module.css'
import Head from "next/head";
import DateCalendarValue from "@/components/datePicker";
import ModalPopUp from '@/components/popup/popup'
import ModalPedidoFinanciero from "@/components/popup/modalPedidoFinanciero";
import TablaEmpanada from "@/components/tables/tablaEmpanadas";
import TablaProductos from "@/components/tables/tablaProductos";
import eliminarDocumento from "./api/firebase/delete-data";
import TablaOriginal from "@/components/tables/tablaOriginal";
import InactivityAlert from "@/components/Inactivity";

const Financiera = () => {
    const [pedidos, setPedidos] = useState([])
    const [mesPedidos, setMesPedidos] = useState([])
    const [numEmpanadas, setNumEmpanadas] = useState([])
    const [empanadasProducidas, setEmpanadasProducidas] = useState(0)
    const [data, setData] = useState([])
    const [empanada, setEmpanada] = useState(0)
    const [fecha, setFecha] = useState("")
    const [total, setTotal] = useState(0)
    const [primeraCarga, setPrimeraCarga] = useState(true)
    const [presionado, setPresionado] = useState(false)
    const [openPopUp, setOpenPopUp] = useState(false);
    const [dataPresionada, setDataPresionada] = useState([])
    const [eliminado, setEliminado] = useState(false)
    const [pestaña, setPestaña] = useState("Productos")
    const [cambiada, setCambiada] = useState(false) // esto es para cuando se cambia la 
    const [fechaAnterior, setFechaAnterior] = useState()
    const [masaAyer, setMasaAyer] = useState(0)
    const [empanadasAyer, setEmpanadasAyer] = useState(0)
    const router = useRouter()

    const fetchEmpanada = async () => {
        try {
            const result = await obtener("empanadas");
            setNumEmpanadas(result);
            setEmpanadasAyer(result[0].empanadasAyer)
            setMasaAyer(result[0].masaAyer)
        } catch (error) {
            // Handle the error if needed
            console.error("Error fetching data:", error);
        }
    };

    const filtrarPedidosPorFecha = () => {
        const pedidosFiltrados = pedidos.filter(pedido => pedido.fecha === fecha);
        let listaOrdenada = pedidosFiltrados.sort((a, b) => b.contador - a.contador);
        setData(listaOrdenada);
    };

    const eliminarDiario = () => {
        for (let i = 0; i < data.length; i++) {
            eliminarDocumento("finanza", data[i].id)
        }
        setEliminado(!eliminado)
    }

    function eliminarMes(listaObjetos, date) {
        const idsPorMes = [];
        const [diaC, mesC, anioC] = date.split("/");
        for (const objeto of listaObjetos) {
            const [dia, mes, anio] = objeto.fecha.split("/");
            if (mes === mesC) {
                eliminarDocumento("finanza", objeto.id)
            }
        }
        setEliminado(!eliminado)
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                if (sessionStorage.getItem("acceso") !== "true") {
                    router.push('/');
                }
                if (sessionStorage.getItem("tipo") !== "1") {
                    router.push('/');
                }
            } catch (error) {
                router.push('/');
            }
        }
    }, [router]);

    const fetchData = async () => {
        try {
            const result = await obtener("finanza");
            setPedidos(result);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    useEffect(() => {
        fetchData();
    }, [eliminado]);

    useEffect(() => {
        filtrarPedidosPorFecha()
    }, [fecha, pedidos, pestaña])

    useEffect(() => {
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
        setFecha(formattedDate);
        fetchEmpanada();
    }, []);

    useEffect(() => {
        if (data.length > 0) {
            let st = 0
            for (let i = 0; i < data.length; i++) {
                st = st + data[i].total;
            }
            setTotal(st)
        } else {
            setTotal(0)
        }
    }, [data, eliminado])

    useEffect(() => {
        if (data.length > 0) {
            if (primeraCarga) {
                let valor = 0;
                for (let i = 0; i < data.length; i++) {
                    let listPedidos = data[i].pedido
                    for (let j = 0; j < listPedidos.length; j++) {
                        if (listPedidos[j].nombre == "empanada") {
                            valor = valor + listPedidos[j].cantidadLocal;
                        }
                    }
                }
                setEmpanada(valor)
                setPrimeraCarga(false)
            }
        }
    }, [data, primeraCarga])

    useEffect(() => {
        if (numEmpanadas.length > 0) {
            setEmpanadasProducidas(numEmpanadas[0].cantidad)
        }
    }, [numEmpanadas]);


    return (
        <>
            <Head>
                <title>Financiero</title>
            </Head>
            <div className={styles.inicio}>
                <InactivityAlert />
                <ModalPopUp
                    openPopUp={openPopUp}
                    setOpenPopUp={setOpenPopUp}
                >
                    <ModalPedidoFinanciero data={dataPresionada} tipo={true} presionado={presionado} setPresionado={setPresionado}></ModalPedidoFinanciero>
                </ModalPopUp>
                <div className={styles.superCentrar}>
                    <div className={styles.contenido}>
                        <div className={styles.date}>
                            <DateCalendarValue value={fecha} setValue={setFecha} name={"Fecha"}></DateCalendarValue>
                            <button onClick={()=>{
                                setPestaña("Productos")
                            }} className={styles.boton2}>Productos</button>
                            <button onClick={()=>{
                                setPestaña("Pedidos")
                            }} className={styles.boton2}>Pedidos</button>
                        </div>
                        <div className={styles.grid}>
                            {pestaña == "Pedidos" && <TablaOriginal data={data} total={total} setDataPresionada={setDataPresionada} setOpenPopUp={setOpenPopUp}></TablaOriginal>}
                            {pestaña == "Productos" && <TablaProductos fecha2={fecha} data={data}></TablaProductos>}
                            <div className={styles.botones}>
                                <button onClick={() => {
                                    eliminarDiario()
                                }} className={styles.boton}> Eliminar Diario</button>
                                <button onClick={() => {
                                    eliminarMes(pedidos, fecha)
                                }} className={styles.boton}> Eliminar Mensual</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.empanadaContainer}>
                    <div className={styles.empanada}>
                        <TablaEmpanada masaAyer={masaAyer} empanadasAyer={empanadasAyer} empanada={empanada} empanadasProducidas={empanadasProducidas}></TablaEmpanada>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Financiera
