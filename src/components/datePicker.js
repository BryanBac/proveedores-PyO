import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

function convertirFecha(fecha) {
  const fechaObjeto = new Date(fecha);
  const dia = fechaObjeto.getDate();
  const mes = fechaObjeto.getMonth() + 1;
  const año = fechaObjeto.getFullYear();

  // Añadir ceros iniciales si es necesario
  const diaFormateado = dia < 10 ? '0' + dia : dia;
  const mesFormateado = mes < 10 ? '0' + mes : mes;

  return `${diaFormateado}/${mesFormateado}/${año}`;
}

export default function DateCalendarValue({ value, setValue, name }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker className="drop"  label={name} onChange={(newValue) => {
        setValue(convertirFecha(newValue));
      }} />
    </LocalizationProvider>
  )
}