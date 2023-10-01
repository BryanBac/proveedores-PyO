import styles from '@/styles/ModalCC.module.css'
import { useState } from 'react';
import hashPassword from '@/pages/api/auth/hash';
import modificarDocumento from '@/pages/api/firebase/update-data';

export default function ModalCC(props) {
    const { id, nombre, tipo, setNombre, openPopUp, setOpenPopUp, actualizar, setActualizar } = props
    const [contraseña, setContra] = useState("")
    return (<>
        <div>
            <div className={styles.titulos}>Nombre</div>
            <input
                className={styles.input}
                type="text"
                onChange={(e) => setNombre(e.target.value)}
                value={nombre}
            ></input>
        </div>
        <div>
            <div>Contraseña: </div>
            <input
                className={styles.input}
                type="password"
                onChange={(e) => setContra(e.target.value)}
                value={contraseña}
            ></input>
        </div>
        <div className={styles.centrar}>
            <button
                className={styles.boton}
                type=""
                onClick={() => {
                    setOpenPopUp(false);
                }}
            >
                Cancelar
            </button>
            <button
                className={styles.boton2}
                type=""
                onClick={() => {
                    modificarDocumento(id, "usuarios", {
                        usuario: nombre,
                        password: hashPassword(contraseña),
                        tipo: tipo
                    })
                    setActualizar(!actualizar)
                    setOpenPopUp(false);
                }}
            >
                Aceptar
            </button>
        </div>
    </>)
}