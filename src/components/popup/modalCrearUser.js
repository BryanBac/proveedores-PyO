import styles from '@/styles/ModalCC.module.css'
import { useState } from 'react';
import hashPassword from '@/pages/api/auth/hash';
import modificarDocumento from '@/pages/api/firebase/update-data';
import enviar from '@/pages/api/firebase/post-data';
import { useRouter } from 'next/router';

export default function ModalCrearUser(props) {
    const { openPopUp, setOpenPopUp, actualizar, setActualizar, usuariosList, setUsuariosList } = props
    const [nombre, setNombre] = useState("")
    const [contraseña, setContra] = useState("")
    const [error, setError] = useState(false)
    const [nombreNo, setNombreNo] = useState("")
    const [tipo, setTipo] = useState(2)
    const router = useRouter()
    return (<>
        <div>
            <div>Nombre: </div>
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
        <div>
            <div>Tipo: </div>
            <input
                className={styles.input}
                type="number"
                onChange={(e) => setTipo(Number(e.target.value))}
                value={tipo}
            ></input>
        </div>
        {error && <div className={styles.error}>El usuario {nombreNo} ya existe</div>}
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
                    const existing = usuariosList.find((item) => item.usuario == nombre)
                    if (existing) {
                        setNombreNo(nombre)
                        setNombre("")
                        setContra("")
                        setError(true)
                    } else {
                        enviar("usuarios", {
                            usuario: nombre,
                            tipo: tipo,
                            password: hashPassword(contraseña)
                        })
                        setError(false)
                        setNombreNo(true)
                        setActualizar(!actualizar)
                        setOpenPopUp(false);
                    }

                }}
            >
                Aceptar
            </button>
        </div>
    </>)
}