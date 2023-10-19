import Head from 'next/head'
import styles from '@/styles/Pedidos.module.css'
import HomeBar from '@/components/home_bar'
import { useRouter } from 'next/router'
import Pedido from '@/components/tarjeta_orden'
import { useEffect, useState } from 'react'
import ArrowBack from '@/components/arrow_back'
import ArrowForward from '@/components/arrow_forward'
import obtener from '../api/firebase/get-data'
import ModalPopUp from '@/components/popup/popup'
import ModalPedidoEmpleado from '@/components/popup/modalPedidoEmpleado'
import ColorIdentifier from '@/components/colorIndentifier'
import InactivityAlert2 from '@/components/InactivityEmployee'
import MiniDrawer from '../menuV2'

const Pedidos = () => {
    const itemsPerPage = 6; // Number of items to display per page
    const [list, setList] = useState([]); // Your list of objects
    const [currentPage, setCurrentPage] = useState(1); // Current page number
    const [openPopUp, setOpenPopUp] = useState(false);
    const [dataPresionada, setDataPresionada] = useState([])
    // con timer
    const [contador, setContador] = useState(0)
    const [seconds, setSeconds] = useState(0);
    const [presionado, setPresionado] = useState(false)
    const [recargar, setRecargar] = useState(false)
    const router = useRouter()
    // obtener pedidos
    const [dt, setData] = useState([])
    // Así es como obtendo data
    const fetchData = async () => {
        try {
            const result = await obtener("pedidosMayorista");
            let listaOrdenada = result.sort((a, b) => a.contador - b.contador);
            setData(listaOrdenada);
        } catch (error) {
            // Handle the error if needed
            console.error("Error fetching data:", error);
        }
    };
    useEffect(() => {
        fetchData();
    }, [presionado]);

    useEffect(() => {
        if (recargar) {
            // router.reload()
        }
    }, [recargar])

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

    // Calculate the range of items to display based on the current page
    let startIndex = (currentPage - 1) * itemsPerPage;
    let endIndex = startIndex + itemsPerPage;
    const [currentItems, setCurrentItems] = useState(() => {
        return dt.slice(startIndex, endIndex);

    })

    useEffect(() => {
        let startIndex = (currentPage - 1) * itemsPerPage;
        let endIndex = startIndex + itemsPerPage;
        setCurrentItems(() => {
            return dt.slice(startIndex, endIndex)
        })
    }, [dt, currentPage])

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds((prevSeconds) => prevSeconds + 1);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <Head>
                <title>Comedor App</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MiniDrawer>
                <div className={styles.inicio}>
                    <ColorIdentifier></ColorIdentifier>
                    <div className={styles.contenido}>
                        <ArrowBack currentPage={currentPage} setCurrentPage={setCurrentPage}></ArrowBack>
                        <ModalPopUp
                            openPopUp={openPopUp}
                            setOpenPopUp={setOpenPopUp}
                        >
                            <ModalPedidoEmpleado estamosEn={"mayorista-minorista"} recargar={recargar} setRecargar={setRecargar} data={dataPresionada} data2={dataPresionada} tipo={true} presionado={presionado} setPresionado={setPresionado} aceptar={false}></ModalPedidoEmpleado>
                        </ModalPopUp>
                        <InactivityAlert2 />
                        <div className={styles.tarjetas}>
                            {currentItems.map((item) => {
                                if (dt.length > 0) {
                                    if (dt[dt.length - 1]['id'] == item.id) {
                                        return (<Pedido data={item} key={item.id} setOpenPopUp={setOpenPopUp} setDataPresionada={setDataPresionada} setColor={'azul'} ></Pedido>)
                                    }
                                    else if (dt[0]['id'] == item.id) {
                                        return (<Pedido data={item} key={item.id} setOpenPopUp={setOpenPopUp} setDataPresionada={setDataPresionada} setColor={'rojo'} ></Pedido>)
                                    }
                                    else {
                                        return (<Pedido data={item} key={item.id} setOpenPopUp={setOpenPopUp} setDataPresionada={setDataPresionada}></Pedido>)
                                    }
                                }
                            })}
                        </div>
                        <ArrowForward endIndex={endIndex} tamañoLista={dt.length} currentPage={currentPage} setCurrentPage={setCurrentPage}></ArrowForward>
                    </div>
                </div>
            </MiniDrawer>
        </>
    )
}
export default Pedidos;