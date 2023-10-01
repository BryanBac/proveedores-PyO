import styles from '@/styles/ColorIdentifier.module.css'

export default function ColorIdentifier() {
    return (
        <div className={styles.barraColor}>
            <div className={styles.grillaColores}>
                <div className={styles.rojo}></div>
                <div>Primer Pedido</div>
            </div>
            <div className={styles.grillaColores}>
                <div className={styles.azul}></div>
                <div>Ultimo Pedido</div>
            </div>
        </div>
    )
}