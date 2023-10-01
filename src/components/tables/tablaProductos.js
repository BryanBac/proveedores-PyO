import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import styles from '@/styles/Financiera.module.css'
import { useState, useEffect } from "react";



export default function TablaProductos({ data, fecha2 }) {
    const [listaProductos, setListaProductos] = useState([])
    useEffect(() => {
        if (data.length > 0) {
            let listPedidos = listaProductos
            const noFecha = listPedidos.find((item) => item.fecha !== data[0].fecha)
            if (noFecha) {
                listPedidos = []
            }
            for (let i = 0; i < data.length; i++) {
                let fecha = data[i].fecha
                for (let j = 0; j < data[i].pedido.length; j++) {
                    const existing = listPedidos.find((item) => item.nombre === data[i].pedido[j].nombre)
                    if (existing) {
                        existing.cantidad = existing.cantidad + data[i].pedido[j].cantidadLocal
                    } else {
                        let nuevoObjeto = {
                            nombre: data[i].pedido[j].nombre,
                            cantidad: data[i].pedido[j].cantidadLocal,
                            fecha: fecha
                        }
                        listPedidos.push(nuevoObjeto)
                    }

                }
            }
            setListaProductos(listPedidos)
        }
    }, [data])
    return (
        <>
            <div className="scroller">
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 480 }} aria-label="caption table">
                        <TableHead className={styles.colorOne}>
                            <TableRow>
                                <TableCell align="right">
                                    <div className={styles.celdaHead}>
                                        Producto
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className={styles.celdaHead}>
                                        Fecha
                                    </div>
                                </TableCell>
                                <TableCell align="right">
                                    <div className={styles.celdaHead}>
                                        Cantidad Vendida
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {listaProductos.map((row) => (
                                <TableRow key={row.id} onClick={() => {
                                }}>
                                    <TableCell align="right">
                                        <div className={styles.celdaRow}>
                                            {row.nombre}
                                        </div>
                                    </TableCell>
                                    <TableCell align="right">
                                        <div className={styles.celdaRow}>
                                            {row.fecha}
                                        </div>
                                    </TableCell>
                                    <TableCell align="right">
                                        <div className={styles.celdaRow}>
                                            {row.cantidad}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    )
}