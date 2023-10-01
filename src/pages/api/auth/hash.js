import * as bcrypt from "bcryptjs"

const saltRounds = bcrypt.genSaltSync(10);


const hashPassword = (password) => {
  try {
    const hash = bcrypt.hashSync(password, saltRounds);
    return hash;
  } catch (error) {
    throw error;
  }
};


export default hashPassword;