import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import Head from "next/head";
import styles from "../styles/login.module.css";
const InterFont = Inter({ subsets: ["latin"] });
import autenticar from "./api/auth/auth";
import { useRouter } from "next/router";
import ErrorModal from "@/components/popup/modalError";
import ModalPopUp from "@/components/popup/popup";
import VisibilityIcon from "@/components/icons/VisibilityIcon";
import InvisibilityIcon from "@/components/icons/InvisibilityIcon";
import Image from "next/image";
import welcome from "public/welcome.png"
import PersonIcon from '@mui/icons-material/Person';

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
                        router.push('/menuV2');
                    }else{
                        router.push('/menuV2');
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
            router.push("/menuV2")
        }
    }, [paso])
    let [show, setShow] = useState(false)
    let [state, setState] = useState(false)
    const handleClick = () =>{
        setState(!state)
        setShow(!show)
      }
    return (
        <div className={InterFont.className}>
            <Head>
                <title>Iniciar Sesión</title>
            </Head>
            <ModalPopUp
                openPopUp={errorModal}
                setOpenPopUp={setErrorModal}
            >
                <ErrorModal></ErrorModal>
            </ModalPopUp>
            <div className={styles.body}>
                <form className={styles.layout} onSubmit={enviarInfo}>
                    <div className={styles.seccion1}>
                        <Image src ={welcome} width={250} height={400} alt="welcome"/>
                    </div>
                    <div className={styles.seccion2}>
                        <div className={styles.presentacion}>
                            <div className={styles.saludo}>
                                Bienvenido<span>&#160;</span>
                            </div>
                        </div>
                        <div className={styles.ingreso}>
                            <label>Usuario</label>
                            <input
                                className={styles.input}
                                onChange={(e) => setUsuario(e.target.value)}
                                value={usuario}
                            ></input>
                            <div>
                                <div className={styles.icono}><PersonIcon/></div>
                            </div>
                        </div>
                        <div className={styles.ingreso}>
                            <label>Contraseña</label>
                            <input 
                            className={styles.input}
                            type={show ? "text" : "password"}
                            onChange={(e) => setContra(e.target.value)}
                            value={contra}
                            />
                            <div onClick={handleClick}>
                                { 
                                state ? <div className={styles.icono}><VisibilityIcon/></div> 
                                : 
                                <div className={styles.icono}><InvisibilityIcon/></div>
                                }
                            </div>
                        </div>
                        <div>
                            <button className={styles.boton} type="submit">
                                Iniciar Sesión
                            </button>
                            <div>
                                {paraVer === "3" && <p className={styles.error}>Usuario o Contraseña Incorrecta</p>}
                                {paraVer !== "3" && <p className={styles.aux}>Texto</p>}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}