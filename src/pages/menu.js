import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import HomeBar from "@/components/home_bar";
import { Inter } from 'next/font/google'
import styles from "../styles/menu.module.css";
import { useRouter } from "next/router";
const InterFont = Inter({ subsets: ['latin'] });
import { useEffect } from 'react'
import InactivityAlert from "@/components/Inactivity";

export default function Home() {
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
        } else if (sessionStorage.getItem("tipo") == "3") {
          router.replace('/minorista/minorista-inicio');
        } else {
        }
      } catch (error) {
        router.push('/');
      }
    }
  }, [router]);
  return (
    <div className={InterFont.className}>
      <Head>
        <title>Menu</title>
      </Head>
      <HomeBar enlace="/inicio"></HomeBar>
      <InactivityAlert />
      <div className={styles.menu}>
        <Link href="/financiera">
          <button className={styles.boton}>
            <Image
              src="/../public/dinero.png"
              width={512}
              height={512}
              className={styles.imagen}
              alt="/imagen no encontrada"
            />
            <span className={styles.texto}>Finanzas</span>
          </button>
        </Link>
        <Link href="/pedidosMenu">
          <button className={styles.boton}>
            <Image
              src="/../public/lista.png"
              width={512}
              height={512}
              className={styles.imagen}
              alt="/imagen no encontrada"
            />
            <span className={styles.texto}>Orden y Empanada</span>
          </button>
        </Link>
        <Link href="/productos">
          <button className={styles.boton}>
            <Image
              src="/../public/plato.png"
              width={512}
              height={512}
              className={styles.imagen}
              alt="/imagen no encontrada"
            />
            <span className={styles.texto}>Productos (para el menú)</span>
          </button>
        </Link>
        <Link href="/inventario">
          <button className={styles.boton}>
            <Image
              src="/../public/caja.png"
              width={512}
              height={512}
              className={styles.imagen}
              alt="/imagen no encontrada"
            />
            <span className={styles.texto}>Inventario (para ingredientes)</span>
          </button>
        </Link>
      </div>
    </div>
  );
}