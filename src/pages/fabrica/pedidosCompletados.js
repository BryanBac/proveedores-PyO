import Head from 'next/head'
import styles from '@/styles/Pedidos.module.css'
import HomeBar from '@/components/home_bar'
import { dataPedidos } from '@/components/mock_tarjetas'
import Pedido from '@/components/tarjeta_orden'
import { useEffect, useState } from 'react'
import ArrowBack from '@/components/arrow_back'
import ArrowForward from '@/components/arrow_forward'
import obtener from '../api/firebase/get-data'
import ModalPopUp from '@/components/popup/popup'
import ModalPedido from '@/components/popup/modalPedidoFabrica'
import { useRouter } from "next/router";
import ColorIdentifier from '@/components/colorIndentifier'
import MiniDrawer from "../menuV2";

const PedidosRestaurar = () => {
    const router = useRouter()
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                if (sessionStorage.getItem("acceso") !== "true") {
                    router.push('/');
                }
                if (sessionStorage.getItem("tipo") == "2") {
                    router.replace('/mayorista/mayorista-inicio');
                } else if (sessionStorage.getItem("tipo") == "3") {
                    router.replace('/minoristas/minorista-inicio');
                }else{
                }
            } catch (error) {
                console.error(error)
            }
        }
    }, [])
    const itemsPerPage = 6; // Number of items to display per page
    const [list, setList] = useState(dataPedidos); // Your list of objects
    const [currentPage, setCurrentPage] = useState(1); // Current page number
    const [openPopUp, setOpenPopUp] = useState(false);
    const [dataPresionada, setDataPresionada] = useState([])
    const [presionado, setPresionado] = useState(false)
    // con timer
    const [contador, setContador] = useState(0)
    const [seconds, setSeconds] = useState(0);

    // obtener pedidos
    const [dt, setData] = useState([])
    // Así es como obtendo data
    const fetchData = async () => {
        try {
            const result = await obtener("completadosFabrica");
            let listaOrdenada = result.sort((a, b) => b.contador - a.contador);
            setData(listaOrdenada);
        } catch (error) {
            // Handle the error if needed
            console.error("Error fetching data:", error);
        }
    };
    useEffect(() => {
        fetchData();
    }, [presionado]);


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
                            <ModalPedido data={dataPresionada} presionado={presionado} setPresionado={setPresionado}></ModalPedido>
                        </ModalPopUp>
                        <div className={styles.tarjetas}>
                            {currentItems.map((item) => {
                                if (dt.length > 0) {
                                    if (dt[dt.length - 1]['id'] == item.id) {
                                        return (<Pedido data={item} key={item.id} setOpenPopUp={setOpenPopUp} setDataPresionada={setDataPresionada} setColor={'rojo'} ></Pedido>)
                                    }
                                    else if (dt[0]['id'] == item.id) {
                                        return (<Pedido data={item} key={item.id} setOpenPopUp={setOpenPopUp} setDataPresionada={setDataPresionada} setColor={'azul'} ></Pedido>)
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
export default PedidosRestaurar