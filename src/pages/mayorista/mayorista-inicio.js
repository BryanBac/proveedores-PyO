import styles from '@/styles/Inicio.module.css'
import Head from 'next/head'
import HomeBar from '@/components/home_bar'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import InactivityAlert2 from '@/components/InactivityEmployee'
import { useRouter } from 'next/router'
import MiniDrawer from '../menuV2'

const MayoristaInicio = () => {
    const router = useRouter()
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                if (sessionStorage.getItem("acceso") !== "true") {
                    router.push('/');
                }
                console.log(sessionStorage.getItem("tipo"))
                if (sessionStorage.getItem("tipo") == "1") {
                    router.replace('/fabrica/inicio');
                } else if (sessionStorage.getItem("tipo") == "3") {
                    router.replace('/minoristas/minorista-inicio');
                }else{
                }
            } catch (error) {
                console.error(error)
            }
        }
    }, [])
    return (
        <>
            <Head>
                <title>Comedor App</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MiniDrawer>
                <div>
                    <InactivityAlert2 />
                    <div className={styles.container}>
                        <Link className={styles.panel} href="mayorista-fabrica">
                            <div className={styles.primero}><img src="../fabrica.png" className={styles.imagen} alt="/imagen no encontrada"></img></div>
                            <div className={styles.segundo}> <div className={styles.sin}>Fabrica</div> </div>
                        </Link>
                        <Link className={styles.panel} href="mayorista-minorista">
                            <div className={styles.primero}><img src="../minorista.png" className={styles.imagen} alt="/imagen no encontrada"></img></div>
                            <div className={styles.segundo}><div className={styles.sin}>Minoristas</div> </div>
                        </Link>
                    </div>
                </div>
            </MiniDrawer>
        </>
    )
}
export default MayoristaInicio;