import { Dialog, DialogContent } from "@mui/material"
import React from "react";

export default function ModalPopUp(props) {
    const { children, openPopUp, setOpenPopUp } = props;
    return (
        <>
            <Dialog open={openPopUp}>
                <button type="" className="cerrar" onClick={() => setOpenPopUp(false)}>X</button>
                <DialogContent>
                    {React.cloneElement(children, {setOpenPopUp: setOpenPopUp})}
                </DialogContent>
            </Dialog>
        </>
    );
}