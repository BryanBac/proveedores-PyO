import * as bcrypt from "bcryptjs"
import obtener from "../firebase/get-data";
import hashPassword from "./hash";

const autenticar= async (usuario, password) =>{
    let usuarios = await obtener("usuarios")
    let passwordA=""
    for (let i = 0; i<usuarios.length; i++){
        if(usuarios[i].usuario===usuario){
            passwordA=usuarios[i].password
            sessionStorage.setItem("tipo", usuarios[i].tipo)
        }
    }
    return(bcrypt.compareSync(password, passwordA))
}

export default autenticar;