import styles from '@/styles/Home_Bar.module.css'
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import WidgetsIcon from '@mui/icons-material/Widgets';
import InputIcon from '@mui/icons-material/Input';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HomeBar(props) {
    const { enlace } = props;
    const [acceso, setAcceso] = useState(false)
    const [mostrar, setMostrar] = useState(false)
    const [profile, setProfile] = useState(false)
    const [textoBoton, setTextoBoton] = useState(false)
    const [nombre, setNombre] = useState("")

    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const acceso = sessionStorage.getItem("acceso");
                const pr = sessionStorage.getItem("tipo");
                if (acceso === "true") {
                    setAcceso(true)
                    setTextoBoton(true)
                    if (pr === "1") {
                        setProfile(true)
                        setMostrar(true)
                        setNombre(sessionStorage.getItem("usuario"))
                    }
                }
            } catch (error) {
                // Manejo de error si es necesario
            }
        }
    }, []);

    return (
        <div className={styles.inicio}>
            <Link className={styles.boton} href={enlace}>
                <ArrowBackIosIcon></ArrowBackIosIcon>
                <div className={styles.letras}>Regresar</div>
            </Link>
            <Link className={styles.boton} href="/inicio">
                <HomeIcon></HomeIcon>
                <div className={styles.letras}>Inicio</div>
            </Link>
            <div className={styles.flex}>
                {profile === true &&
                    <Link className={styles.boton2} href="profile">
                        <div className={styles.derecha}>
                            <AccountCircleIcon></AccountCircleIcon>
                            <div className={styles.letras}>{nombre}</div>
                        </div>
                    </Link>
                }
                {mostrar === true &&
                    <Link className={styles.boton2} href="menu">
                        <div className={styles.derecha}>
                            <WidgetsIcon></WidgetsIcon>
                            <div className={styles.letras}>Menu</div>
                        </div>
                    </Link>
                }
                <Link className={styles.boton2} href="/">
                    <div className={styles.derecha} onClick={() => {
                        setAcceso(false)
                        sessionStorage.setItem("acceso", false)
                        setTextoBoton(false) // Cambia el valor del textoBoton al cerrar sesión
                    }}>
                        <InputIcon></InputIcon>
                        <div className={styles.letras}>{textoBoton === true ? "Cerrar Sesión" : "Iniciar Sesión"}</div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
