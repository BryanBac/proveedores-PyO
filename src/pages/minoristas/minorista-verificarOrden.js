import Head from 'next/head'
import styles from '@/styles/Confirmar.module.css'
import HomeBar from '@/components/home_bar'
import { useEffect, useState } from 'react'
import ArrowBack from '@/components/arrow_back'
import ArrowForward from '@/components/arrow_forward'
import PlatilloConfirmar from '@/components/platilloConfirmar'
import Link from 'next/link'
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore'
import app from '../../../firebase'
import enviar from '../api/firebase/post-data'
import obtener from '../api/firebase/get-data'
import modificarDocumento from '../api/firebase/update-data'
import Loader from '@/components/loader'
import { useRouter } from 'next/router'
import InactivityAlert2 from '@/components/InactivityEmployee'
import MiniDrawer from '../menuV2'

const firestore = getFirestore(app);

function sumAndMergeDuplicates(inputList) {
    const idMap = new Map();

    inputList.forEach((item) => {
        if (idMap.has(item.id)) {
            const existingItem = idMap.get(item.id);
            existingItem.cantidad += item.cantidad;
        } else {
            idMap.set(item.id, { ...item });
        }
    });

    return Array.from(idMap.values());
}

function removeDuplicatesById(inputList) {
    const idSet = new Set();
    const resultList = [];

    inputList.forEach((item) => {
        if (!idSet.has(item.id)) {
            idSet.add(item.id);
            resultList.push(item);
        }
    });

    return resultList;
}

function subtractQuantities(list1, list2) {
    const resultList = [];

    for (let i = 0; i < list1.length; i++) {
        const newItem = { ...list1[i] };
        const matchingItem = list2.find(item => item.id === newItem.id);

        if (matchingItem) {
            newItem.cantidadLocal -= matchingItem.cantidad;
        }

        resultList.push(newItem);
    }

    return resultList;
}

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
function filtrarPorCantidadLocal(objetos) {
    return objetos.filter(objeto => objeto.cantidadLocal > 0);
}

const VerificarOrden = () => {
    const itemsPerPage = 4; // Number of items to display per page
    const [total, setTotal] = useState(0);
    const [efectivo, setEfectivo] = useState()
    const [vuelto, setVuelto] = useState(0)
    const [currentDateTime, setCurrentDateTime] = useState('');
    const [loading, setLoading] = useState(true);
    const [materiales, setMateriales] = useState([])
    const [mod, setMod] = useState(false)
    const [nuevaSet, setNuevaSet] = useState([]); // esta es la lista de materiales
    const [currentIngredientes, serCurrentIngredientes] = useState([])
    const [matActualizar, setMatActualizar] = useState([]) // esta es la que se deberá actualizar
    const [estado, setEstado] = useState("Preparandose")
    const router = useRouter()
    const [list, setList] = useState(() => {
        if (typeof window !== 'undefined' && window.sessionStorage) {
            const storedList = JSON.parse(sessionStorage.getItem('ordenList'));
            const sinD = eliminarDuplicados(storedList)
            return filtrarPorCantidadLocal(sinD)
        } else {
            return []
        }
    });
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
    const redireccionar = () => {
        router.push('/');
    };
    const obtenerHoraActual = () => {
        const fechaActual = new Date();
        const horas = fechaActual.getHours().toString().padStart(2, '0');
        const minutos = fechaActual.getMinutes().toString().padStart(2, '0');
        const segundos = fechaActual.getSeconds().toString().padStart(2, '0');
        const horaFormateada = `${horas}:${minutos}:${segundos}`;
        return horaFormateada;
    };
    const [currentPage, setCurrentPage] = useState(1);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage - 1;
    const [currentItems, setCurrentItems] = useState([]);
    const [contador, setContador] = useState([])
    const [denominador, setDenominador] = useState(1)
    const [numerador, setNumerador] = useState(1)


    const obtenerMateriales = async (lista) => {
        let mat = await obtener("materiales")
        setMateriales(mat)
    }


    // Así es como obtendo data
    const fetchData = async () => {
        try {
            const result = await obtener("contador");
            setContador(result);
        } catch (error) {
            // Handle the error if needed
            console.error("Error fetching data:", error);
        }
    };
    useEffect(() => {
        obtenerMateriales();
    }, []);

    useEffect(() => {
        if (materiales.length > 0) {
            if (list.length > 0) {
                const updatedNuevaSet = [];
                const updateIngredientes = []
                for (let i = 0; i < list.length; i++) {
                    if (list[i].ingredientes > 0) {
                        list[i].ingredientes.forEach((ltItem) => {
                            const material = materiales.find((mat) => mat.id === ltItem.id);
                            if (material) {
                                updatedNuevaSet.push(material);
                                ltItem.cantidad = ltItem.cantidad * list[i].cantidadLocal
                                updateIngredientes.push(ltItem)
                            }
                        });
                    }
                }
                setLoading(false)
                serCurrentIngredientes(sumAndMergeDuplicates(updateIngredientes));
                setNuevaSet(removeDuplicatesById(updatedNuevaSet));
            }
        }
    }, [materiales])

    useEffect(() => {
        setMatActualizar(subtractQuantities(nuevaSet, currentIngredientes))
    }, [nuevaSet, currentIngredientes])

    useEffect(() => {
        let x = []
        for (let i = startIndex; i <= endIndex; i++) {
            console.log(i)
            if (i < list.length) {
                if (x.length < 4) {
                    x.push(list[i])
                    console.log(list[i])
                }
            }
        }
        console.log(x)
        setCurrentItems(x)
        x = []
        setDenominador(Math.ceil(list.length / 4))
    }, [list, startIndex, endIndex])

    useEffect(() => {
        let valor = 0;
        for (let i = 0; i < list.length; i++) {
            valor = valor + (list[i].precio * list[i].cantidadLocal);
        }
        setTotal(valor)
    }, [list])

    useEffect(() => {
        // Función para obtener la fecha y hora actual en formato "dd/mm/yyyy"
        const getCurrentDateTime = () => {
            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });

            setCurrentDateTime(formattedDate);
        };

        getCurrentDateTime();

        // Actualiza la fecha cada segundo (opcional, solo si quieres que se actualice en tiempo real)
        const intervalId = setInterval(getCurrentDateTime, 1000);

        // Limpia el intervalo cuando el componente se desmonta
        return () => clearInterval(intervalId);
    }, []);

    const pedir = () => {
        if (currentItems.length > 0) {
            let pedidos = {
                contador: contador[0].actual + 1,
                pedido: list,
                total: total,
                fecha: currentDateTime,
                estado: estado,
                hora: obtenerHoraActual(),
                matActualizar: matActualizar
            }
            enviar("pedidos", pedidos)
            modificarDocumento(contador[0].id, "contador", {
                actual: contador[0].actual + 1,
            })
            sessionStorage.setItem('ordenList', JSON.stringify([]));
            redireccionar()
        }
    }

    const modificarMateriales = () => {
        console.log("Materiales Actualizar", matActualizar)
        for (let i = 0; i < matActualizar.length; i++) {
            // modificarDocumento(matActualizar[i].id, "materiales", matActualizar[i])
        }
        setMod(true)
    }

    useEffect(() => {
        if (mod) {
            pedir()
        }
    }, [mod])


    useEffect(() => {
        if (contador.length > 0) {
            modificarMateriales();
        }
    }, [contador])

    return (
        <>
            <Head>
                <title>Comedor App</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {loading == true && <Loader></Loader>}
            <InactivityAlert2 />
            <MiniDrawer>
                <div className={styles.inicio}>
                    <div className={styles.contenido}>
                        <ArrowBack currentPage={currentPage} setCurrentPage={setCurrentPage}></ArrowBack>
                        <div className={styles.contenidoContainer}>
                            <div className={styles.totales}>
                                <div className={styles.elementoTotales}>
                                    Total: <div className={styles.cajaTotales}>{total}</div>
                                </div>
                                <div className={styles.elementoTotales}>
                                    Efectivo: <input className={styles.cajaTotales} type="number" value={efectivo} onChange={(event) => {
                                        let efec = Number(event.target.value);
                                        if (efec != 0) {
                                            setEfectivo(Number(event.target.value))
                                            let v = Number(event.target.value) - total
                                            setVuelto(v)
                                        }
                                        else {
                                            setEfectivo()
                                            setVuelto(0)
                                        }

                                    }}></input>
                                </div>
                                <div className={styles.elementoTotales}>
                                    Vuelto: <div className={styles.cajaTotales}>{vuelto}</div>
                                </div>
                            </div>
                            <div className={styles.grilla}>
                                <div className={styles.tarjetas}>
                                    {currentItems.map((item) => {
                                        return (<PlatilloConfirmar data={item} key={item.id} list={list} setList={setList}></PlatilloConfirmar>)
                                    })}
                                </div>
                                <div className={styles.fraccion}>
                                    <div className={styles.letras}>{currentPage} / {denominador}</div>
                                </div>
                            </div>
                            <div className={styles.centrarHorizontal}>
                                <Link className={styles.boton} href={"/minoristas/minorista-ordenar"}>
                                    Regresar
                                </Link>
                                <button className={styles.boton} onClick={() => {
                                    fetchData()
                                }}>Confirmar</button>
                            </div>
                        </div>
                        <ArrowForward endIndex={endIndex} tamañoLista={list.length} currentPage={currentPage} setCurrentPage={setCurrentPage}></ArrowForward>
                    </div>
                </div>
            </MiniDrawer>
        </>
    )
}
export default VerificarOrden;