import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import styles from '@/styles/Financiera.module.css'

export default function TablaEmpanada({ empanada, empanadasProducidas, masaAyer, empanadasAyer }) {
    return (
        <>
            <div className="scroller">
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 480 }} aria-label="caption table">
                        <TableHead className={styles.colorOne}>
                            <TableRow>
                                <TableCell align="right">
                                    <div className={styles.celdaHead}>
                                        Empanadas Del día
                                    </div>
                                </TableCell>
                                <TableCell>
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
                                        Producidas
                                    </div>
                                </TableCell>
                                <TableCell align="right">
                                    <div className={styles.celdaRow}>
                                        {empanadasProducidas}
                                    </div>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="right">
                                    <div className={styles.celdaRow}>
                                        Vendidas
                                    </div>
                                </TableCell>
                                <TableCell align="right">
                                    <div className={styles.celdaRow}>
                                        {empanada}
                                    </div>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="right">
                                    <div className={styles.celdaRow}>
                                        Sobrantes Hoy
                                    </div>
                                </TableCell>
                                <TableCell align="right">
                                    <div className={styles.celdaRow}>
                                        {empanadasProducidas - empanada}
                                    </div>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="right">
                                    <div className={styles.celdaRow2}>
                                        Empanadas Sobrantes Ayer
                                    </div>
                                </TableCell>
                                <TableCell align="right">
                                    <div className={styles.celdaRow}>
                                        {masaAyer}
                                    </div>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="right">
                                    <div className={styles.celdaRow2}>
                                        Total de Empanadas
                                    </div>
                                </TableCell>
                                <TableCell align="right">
                                    <div className={styles.celdaRow}>
                                        {masaAyer+empanadasProducidas}
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