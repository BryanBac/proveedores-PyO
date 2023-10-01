import styles from '@/styles/ModalCC.module.css'
import eliminarDocumento from '@/pages/api/firebase/delete-data';
import { useRouter } from 'next/router';

export default function ModalEliminar(props){
    const { id, openPopUp, setOpenPopUp, actualizar, setActualizar } = props
    const router = useRouter()
    return (<>
        <div className={styles.titulos}>¿Seguro que desea eliminar?</div>
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
                    eliminarDocumento("usuarios", id)
                    setActualizar(!actualizar)
                    setOpenPopUp(false);
                }}
            >
                Aceptar
            </button>
        </div>
    </>)
}