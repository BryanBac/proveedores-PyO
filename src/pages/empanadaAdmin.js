import styles from '@/styles/Empanadas.module.css'
import Head from 'next/head'
import HomeBar from '@/components/home_bar'
import { useEffect, useState } from 'react'
import { useRouter } from "next/router";
import obtener from './api/firebase/get-data'
import modificarDocumento from './api/firebase/update-data'
import ModalPopUp from '@/components/popup/popup'
import Guardar from '@/components/popup/modalGuardado'
import InactivityAlert from "@/components/Inactivity";

export default function EmpanadaAdmin() {
    const [numEmpanadas, setNumEmpanadas] = useState([])
    const [fabricar, setFabricar] = useState(0)
    const [open, setOpen] = useState(false)
    const [gramos, setGramos] = useState()
    const [masaAyer, setMasaAyer] = useState()
    const [empanadasAyer, setEmpanadasAyer] = useState()
    const router = useRouter()
    const fetchData = async () => {
        try {
            const result = await obtener("empanadas");
            setNumEmpanadas(result);
        } catch (error) {
            // Handle the error if needed
            console.error("Error fetching data:", error);
        }
    };

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

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (numEmpanadas.length > 0) {
            setGramos(numEmpanadas[0].peso);
            setFabricar(Math.floor(numEmpanadas[0].cantidad))
            setMasaAyer(numEmpanadas[0].masaAyer)
            setEmpanadasAyer(numEmpanadas[0].empanadasAyer)
        }
    }, [numEmpanadas]);

    useEffect(() => {
        if (typeof gramos != "undefined") {
            if (gramos >= 45) {
                const cantidad = Math.floor(gramos / 45);
                setFabricar(cantidad)
            }
            else {
                setFabricar(0)
            }
        }
    }, [gramos])

    const setear = () => {
        numEmpanadas[0].cantidad = fabricar;
        numEmpanadas[0].peso = gramos;
        numEmpanadas[0].masaAyer = masaAyer;
        numEmpanadas[0].empanadasAyer = empanadasAyer;
        modificarDocumento(numEmpanadas[0].id, "empanadas", numEmpanadas[0])
    }
    return (
        <>
            <Head>
                <title>SupplyPro</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div>
                <HomeBar enlace="/inicio"></HomeBar>
                <InactivityAlert />
                <ModalPopUp
                    openPopUp={open}
                    setOpenPopUp={setOpen}
                >
                    <Guardar></Guardar>
                </ModalPopUp>
                <div className={styles.inicio}>
                    <div className={styles.block}>
                        <div>
                            <div className={styles.titulos}>Peso de la masa (Gramos)</div>
                            <div className={styles.flex}>
                                <input
                                    type="number"
                                    value={gramos}
                                    onChange={(event) => {
                                        let num = Number(event.target.value)
                                        if (num > 0) {
                                            setGramos(num)
                                        } else {
                                            setGramos()
                                        }
                                    }}></input>
                                <button className={styles.boton} onClick={() => {
                                    setear()
                                    setOpen(true)
                                }}>Guardar</button>
                            </div>
                            <div>
                                <div className={styles.titulos}>Masas Para Hoy: {fabricar}</div>
                            </div>
                        </div>
                        <div>
                            <div className={styles.titulos2}>Sobrante Ayer</div>
                            <div className={styles.flex}>
                                <input
                                    type="number"
                                    value={masaAyer}
                                    onChange={(event) => {
                                        let num = Number(event.target.value)
                                        if (num > 0) {
                                            setMasaAyer(num)
                                        } else {
                                            setMasaAyer()
                                        }
                                    }}></input>
                                <button className={styles.boton} onClick={() => {
                                    setear()
                                    setOpen(true)
                                }}>Guardar</button>
                            </div>
                            <div>
                                <div className={styles.titulos2}>Masas: {masaAyer}</div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.num2}>Total: {fabricar+masaAyer}</div>
                </div>
            </div>
        </>
    )
}