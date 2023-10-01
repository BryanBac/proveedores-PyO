import styles from '@/styles/Flechas.module.css'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export default function ArrowBack(props) {
    const { currentPage, setCurrentPage } = props;
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    return (
        <div className={styles.flechas}>
            <button className={styles.boton} onClick={() => prevPage()} disabled={currentPage === 1}>
                <div className={styles.colorFlechita}><ArrowBackIosIcon sx={{ fontSize: 40 }}></ArrowBackIosIcon></div>
            </button>
        </div>
    )
}