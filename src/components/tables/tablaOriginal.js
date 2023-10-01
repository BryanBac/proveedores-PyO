import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import styles from '@/styles/Financiera.module.css'

export default function TablaOriginal({ data, total, setDataPresionada, setOpenPopUp }) {
    return (
        <>
            <div className="scroller">
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 480 }} aria-label="caption table">
                        <TableHead className={styles.colorOne}>
                            <TableRow>
                                <TableCell align="right">
                                    <div className={styles.celdaHead}>
                                        Numero de Pedido
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className={styles.celdaHead}>
                                        Fecha
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className={styles.celdaHead}>
                                        Hora
                                    </div>
                                </TableCell>
                                <TableCell align="right">
                                    <div className={styles.celdaHead}>
                                        Total
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell align="right">
                                    <div className={styles.celdaRow}>

                                    </div>
                                </TableCell>
                                <TableCell align="right">
                                    <div className={styles.celdaRow}>

                                    </div>
                                </TableCell>
                                <TableCell align="right" className={styles.bg}>
                                    <div className={styles.celdaRow}>
                                        Total (Q)
                                    </div>
                                </TableCell>
                                <TableCell align="right">
                                    <div className={styles.celdaRow2}>
                                        {total}
                                    </div>
                                </TableCell>
                            </TableRow>
                            {data.map((row) => (
                                <TableRow key={row.id} onClick={() => {
                                    setDataPresionada(row)
                                    setOpenPopUp(true)
                                }}>
                                    <TableCell align="right">
                                        <div className={styles.celdaRow}>
                                            {row.contador}
                                        </div>
                                    </TableCell>
                                    <TableCell align="right">
                                        <div className={styles.celdaRow}>
                                            {row.fecha}
                                        </div>
                                    </TableCell>
                                    <TableCell align="right">
                                        <div className={styles.celdaRow}>
                                            {row.hora}
                                        </div>
                                    </TableCell>
                                    <TableCell align="right">
                                        <div className={styles.celdaRow}>
                                            {row.total}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell align="right">
                                    <div className={styles.celdaRow}>

                                    </div>
                                </TableCell>
                                <TableCell align="right">
                                    <div className={styles.celdaRow}>

                                    </div>
                                </TableCell>
                                <TableCell align="right" className={styles.bg}>
                                    <div className={styles.celdaRow}>
                                        Total (Q)
                                    </div>
                                </TableCell>
                                <TableCell align="right">
                                    <div className={styles.celdaRow2}>
                                        {total}
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    )
}