import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import HomeBar from "@/components/home_bar";
import { Inter } from 'next/font/google'
import styles from "@/styles/menu.module.css";
import { useRouter } from "next/router";
const InterFont = Inter({ subsets: ['latin'] });
import { useEffect } from 'react'
import InactivityAlert from "@/components/Inactivity";
import MiniDrawer from "../menuV2";

const Home = () => {
  const router = useRouter()
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        if (sessionStorage.getItem("acceso") !== "true") {
          router.push('/');
        }
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
    <div className={InterFont.className}>
      <Head>
        <title>Menu</title>
      </Head>
      <InactivityAlert />
      <MiniDrawer>
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
              <span className={styles.texto}>Orden</span>
            </button>
          </Link>
        </div>
      </MiniDrawer>
    </div>
  );
}
export default Home;