// components/InactivityAlert.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const InactivityAlert = () => {
    const [showAlert, setShowAlert] = useState(false);
    const router = useRouter();

    useEffect(() => {
        let timer;

        const resetTimer = () => {
            clearTimeout(timer);
            // Configura el tiempo de inactividad en milisegundos (1 hora en este caso)
            timer = setTimeout(() => {
                setShowAlert(true);
                cerrarSesion();
            }, 30 * 60 * 1000); // 1/2 hora
        };

        // Reinicia el temporizador cuando ocurra una actividad en la pestaña
        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('keydown', resetTimer);

        // Limpia el temporizador y los event listeners cuando el componente se desmonta
        return () => {
            clearTimeout(timer);
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('keydown', resetTimer);
        };
    }, []);

    const cerrarSesion = () => {
        sessionStorage.setItem("acceso", false)
        router.push('/');
    }
    return (
        showAlert && (
            <div className="inactivity-alert"></div>
        )
    );
};

export default InactivityAlert;
