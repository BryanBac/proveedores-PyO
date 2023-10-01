import styles from '@/styles/TarjetaPedido.module.css'

import { useState } from 'react';

export default function Pedido(props) {
    const { data, setOpenPopUp, setDataPresionada, setColor } = props;
    const [isHovered, setIsHovered] = useState(false);
    const handleMouseEnter = () => {
        setIsHovered(true);
    };
    var estilo = styles.primero

    if(setColor == 'rojo') {
        estilo = styles.primeroRojo
    }

    if(setColor == 'azul') {
        estilo = styles.primeroAzul
    }

    const handleMouseLeave = () => {
        setIsHovered(false);
    };
    return (
        <div
            className={styles.inicio}
            key={data.id}
            onClick={()=>{
                setDataPresionada(data)
                setOpenPopUp(true)
            }}
        >
            <div className={estilo}></div>
            <div
                className={`${styles.segundo} ${isHovered ? styles.shadow : ''}`}
                onMouseOver={handleMouseEnter}
                onMouseOut={handleMouseLeave}
            >
                <h1>{data.contador}</h1>
            </div>
        </div>
    );
}