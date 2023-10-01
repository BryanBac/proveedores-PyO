import styles from '@/styles/Flechas.module.css'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function ArrowForward(props) {
    const { endIndex, tamañoLista, currentPage, setCurrentPage } = props;
    const nextPage = () => {
        if (endIndex < tamañoLista) {
            setCurrentPage(currentPage + 1);
        }
    };
    return (
        <div className={styles.flechas}>
            <button className={styles.boton} onClick={() => nextPage()} disabled={endIndex >= tamañoLista}>
                <div className={styles.colorFlechita}><ArrowForwardIosIcon sx={{ fontSize: 40 }}></ArrowForwardIosIcon></div>
            </button>
        </div>
    )
}