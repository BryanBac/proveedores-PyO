import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import Head from "next/head";
import HomeBar from "@/components/home_bar";
import styles from "../styles/login.module.css";
const InterFont = Inter({ subsets: ["latin"] });
import autenticar from "./api/auth/auth";
import { useRouter } from "next/router";
import ErrorModal from "@/components/popup/modalError";
import ModalPopUp from "@/components/popup/popup";

export default function Home() {
    const [usuario, setUsuario] = useState("");
    const [contra, setContra] = useState("");
    const [paso, setPaso] = useState(false);
    const [paraVer, setParaVer] = useState("1")
    const [errorModal, setErrorModal] = useState(false);
    const router = useRouter()
    const enviarInfo = async (e) => {
        e.preventDefault();
        let x = await autenticar(usuario, contra);
        if(x){
            setParaVer("2")
        }else{
            setParaVer("3") // si es tres que si muestre que hubo error
            setUsuario("")
            setContra("")
        }
        setPaso(x)
    };
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                if (sessionStorage.getItem("acceso") === "true") {
                    if (sessionStorage.getItem("tipo") === "1") {
                        router.push('/menu');
                    }else{
                        router.push('/inicio');
                    }
                }
            } catch (error) {
                router.push('/');
            }
        }
    }, [router]);

    useEffect(() => {
        if (paso === true) {
            sessionStorage.setItem("acceso", true);
            sessionStorage.setItem("usuario", usuario);
            router.push("/menu")
        }
    }, [paso])

    return (
        <div className={InterFont.className}>
            <Head>
                <title>Iniciar Sesión</title>
            </Head>
            <HomeBar enlace="menu"></HomeBar>
            <ModalPopUp
                openPopUp={errorModal}
                setOpenPopUp={setErrorModal}
            >
                <ErrorModal></ErrorModal>
            </ModalPopUp>
            <div className={styles.body}>
                <form className={styles.container} onSubmit={enviarInfo}>
                    <div className={styles.ingreso}>
                        <span>Usuario:</span>
                        <input
                            className={styles.input}
                            onChange={(e) => setUsuario(e.target.value)}
                            value={usuario}
                        ></input>
                    </div>
                    <div className={styles.ingreso}>
                        <span>Contraseña:</span>
                        <input
                            className={styles.input}
                            type="password"
                            onChange={(e) => setContra(e.target.value)}
                            value={contra}
                        ></input>
                    </div>
                    <button className={styles.boton} type="submit">
                        Iniciar Sesión
                    </button>
                    {paraVer == "3" && <div className={styles.error}>Usuario o Contraseña Incorrecta</div>}
                </form>
            </div>
        </div>
    );
}
