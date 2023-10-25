import { useState, useEffect } from "react"
import { useRouter } from "next/router";
import obtener from "./api/firebase/get-data"
import HomeBar from '@/components/home_bar'
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
import MiniDrawer from "./menuV2";

const Financiera = () => {
    const [pedidos, setPedidos] = useState([])
    const [data, setData] = useState([])
    const [fecha, setFecha] = useState("")
    const [total, setTotal] = useState(0)
    const [presionado, setPresionado] = useState(false)
    const [openPopUp, setOpenPopUp] = useState(false);
    const [dataPresionada, setDataPresionada] = useState([])
    const [eliminado, setEliminado] = useState(false)
    const [pestaña, setPestaña] = useState("Productos")
    const [cambiada, setCambiada] = useState(false) // esto es para cuando se cambia la 
    const router = useRouter()
    const [productos, setProductos] = useState([])
    const [sinProductosAlerta, setSinProductosAlerta] = useState(false);
    

    const fetchProductos = async () => {
        try {
            let pr = ""
            if (sessionStorage.getItem("tipo") == "1") {
                pr="productosFabrica";
            } else if (sessionStorage.getItem("tipo") == "2") {
                pr="productosMayorista";
            }else{
                pr="productosMinorista";
            }
            const result = await obtener(pr);
            setProductos(result)
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
            let pr = ""
            if (sessionStorage.getItem("tipo") == "1") {
                pr="finanzaFabrica";
            } else if (sessionStorage.getItem("tipo") == "2") {
                pr="finanzaMayorista";
            }else{
                pr="finanzaMinorista";
            }
            const result = await obtener(pr);
            setPedidos(result);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(()=>{
        console.log("Productos", productos)
        if (productos.length === 0) {
            setSinProductosAlerta(true);
        } else {
            setSinProductosAlerta(false);
        }
    },[productos])
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
        fetchProductos()
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


    return (
        <>
            <Head>
                <title>Financiero</title>
            </Head>
            <MiniDrawer>
                <div className={styles.inicio}>
                    {/* Alerta para productos no disponibles */}
                    {sinProductosAlerta && (
                        <div className="alerta">
                            No hay productos disponibles en este momento.
                        </div>
                    )}

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
                                <button onClick={() => {
                                    setPestaña("Productos")
                                }} className={styles.boton2}>Productos</button>
                                <button onClick={() => {
                                    setPestaña("Pedidos")
                                }} className={styles.boton2}>Pedidos</button>
                            </div>
                            <div className={styles.grid}>
                                {pestaña == "Pedidos" && <TablaOriginal data={data} total={total} setDataPresionada={setDataPresionada} setOpenPopUp={setOpenPopUp}></TablaOriginal>}
                                {pestaña == "Productos" && <TablaProductos fecha2={fecha} data={productos}></TablaProductos>}

                            </div>
                        </div>
                    </div>

                </div>
            </MiniDrawer>
        </>
    )
}
export default Financiera;