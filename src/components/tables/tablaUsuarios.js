import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import styles from '@/styles/Financiera.module.css'
import { useState, useEffect } from "react";
import ModalPopUp from "../popup/popup";
import ModalCC from "../popup/modalCambioContraseña";
import obtener from "@/pages/api/firebase/get-data";
import DeleteIcon from '@mui/icons-material/Delete';
import ModalEliminar from "../popup/modalEliminar";

export default function TablaUsuarios(props) {
    const { actualizado, setActualizado, usuariosList, setUsuariosList } = props
    const [usuarios, setUsuarios] = useState([])
    const [openPopUp, setOpenPopUp] = useState(false)
    const [openPopUpE, setOpenPopUpE] = useState(false)
    const [id, setId] = useState("")
    const [tipo, setTipo] = useState(2)
    const [nombre, setNombre] = useState("")
    const [actualizar, setActualizar] = useState(false)

    const listado = async () => {
        let users = await obtener("usuarios")
        setUsuarios(users)
        setUsuariosList(users)
    }
    useEffect(() => {
        listado()
    }, [actualizar, actualizado])

    useEffect(() => {
        console.log(actualizar)
    }, [actualizar])
    return (
        <>
            <ModalPopUp
                openPopUp={openPopUp}
                setOpenPopUp={setOpenPopUp}
            >
                <ModalCC tipo={tipo} setNombre={setNombre} nombre={nombre} id={id} actualizar={actualizar} setActualizar={setActualizar}></ModalCC>
            </ModalPopUp>
            <ModalPopUp
                openPopUp={openPopUpE}
                setOpenPopUp={setOpenPopUpE}
            >
                <ModalEliminar id={id} actualizar={actualizar} setActualizar={setActualizar}></ModalEliminar>
            </ModalPopUp>
            <div className="scroller">
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 480 }} aria-label="caption table">
                        <TableHead className={styles.colorOne}>
                            <TableRow>
                                <TableCell align="right">
                                    <div className={styles.celdaHead}>
                                        Nombre
                                    </div>
                                </TableCell>
                                <TableCell align="right">
                                    <div className={styles.celdaHead}>
                                        Tipo
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className={styles.celdaHead}>
                                        Cambiar Contraseña
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className={styles.celdaHead}>
                                        Eliminar Usuario
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {usuarios.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell align="right">
                                        <div className={styles.celdaRow}>
                                            {row.usuario}
                                        </div>
                                    </TableCell>
                                    <TableCell align="right">
                                        <div className={styles.celdaRow}>
                                            {row.tipo}
                                        </div>
                                    </TableCell>
                                    <TableCell align="right">
                                        <div className={styles.celdaRow} onClick={() => {
                                            setNombre(row.usuario)
                                            setId(row.id)
                                            setTipo(row.tipo)
                                            setOpenPopUp(true)
                                        }}>
                                            Editar
                                        </div>
                                    </TableCell>
                                    <TableCell align="right">
                                        <div className={styles.celdaRow} onClick={() => {
                                            setId(row.id)
                                            setOpenPopUpE(true)
                                        }}>
                                            <DeleteIcon />
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