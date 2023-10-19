import * as React from 'react';
import { useEffect } from 'react'
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ShoppingCartCheckoutRoundedIcon from '@mui/icons-material/ShoppingCartCheckoutRounded';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import { Divider } from '@mui/material';
import styles from "../styles/MenuV2.module.css";
import { useRouter } from "next/router";
import { AddShoppingCartOutlined } from '@mui/icons-material';
import Link from 'next/link';
import obtener from './api/firebase/get-data'
import enviar from './api/firebase/post-data'
import modificarDocumento from './api/firebase/update-data'
import eliminarDocumento from './api/firebase/delete-data'

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function MiniDrawer(props) {
  const router = useRouter()
  let optionMenu = 0;
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [orden, setOrden] = React.useState([]);
  const [platillos, setPlatillos] = React.useState([]);
  const [fechaFirebase, setFechaFirebase] = React.useState([])
  const [pedidos, setPedidos] = React.useState([])
  const [contador, setContador] = React.useState([])
  const [loading, setLoading] = React.useState(true);
  const [dataProductos, setDataProductos] = React.useState([])
  const [finanza, setFinanza] = React.useState([])
  const [total, setTotal] = React.useState(0)
  const [restaurar, setRestaurar] = React.useState([])
  const [eliminarRestaurar, setEliminarRestaurar] = React.useState(false)
  const [eliminarPedidos, setEliminarPedidos] = React.useState(false)
  const [fechaHoy, setFechaHoy] = React.useState("")
  const [numEmpanadas, setNumEmpanadas] = React.useState([])
  const [empCant, setEmpCant] = React.useState(0)
  const [usuario, setUsuario] = React.useState(() => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return sessionStorage.getItem('tipo');
    } else {
      return ""
    }
  })

  const ChangeOptionMenu = (id) => {
    optionMenu = id;
    if (id === 0) {
      setOption1(true)
      setOption2(false)
      setOption3(false)
      setOption4(false)
      setOption5(false)
      setOption6(false)
      setOption7(false)
    } else if (id === 1) {
      setOption1(false)
      setOption2(true)
      setOption3(false)
      setOption4(false)
      setOption5(false)
      setOption6(false)
      setOption7(false)
    } else if (id === 2) {
      setOption1(false)
      setOption2(false)
      setOption3(true)
      setOption4(false)
      setOption5(false)
      setOption6(false)
      setOption7(false)
    } else if (id === 3) {
      setOption1(false)
      setOption2(false)
      setOption3(false)
      setOption4(true)
      setOption5(false)
      setOption6(false)
      setOption7(false)
      sessionStorage.setItem("platilloList", JSON.stringify(orden));
      sessionStorage.setItem("ordenList", JSON.stringify(orden));
      sessionStorage.setItem("platilloListGranizadas", JSON.stringify(orden));
      sessionStorage.setItem("platos", JSON.stringify(orden));
    } else if (id === 4) {
      setOption1(false)
      setOption2(false)
      setOption3(false)
      setOption4(false)
      setOption5(true)
      setOption6(false)
      setOption7(false)
    } else if (id === 5) {
      setOption1(false)
      setOption2(false)
      setOption3(false)
      setOption4(false)
      setOption5(false)
      setOption6(true)
      setOption7(false)
    } else if (id === 6) {
      setOption1(false)
      setOption2(false)
      setOption3(false)
      setOption4(false)
      setOption5(false)
      setOption6(false)
      setOption7(true)
    } else if (id === 7) {
      setOption1(false)
      setOption2(false)
      setOption3(false)
      setOption4(false)
      setOption5(false)
      setOption6(false)
      setOption7(false)
      sessionStorage.setItem("acceso", false)
    }
  }
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fetchData = async () => {
    try {
      const result = await obtener("productos");
      setPlatillos(result);
    } catch (error) {
      // Handle the error if needed
      console.error("Error fetching data:", error);
    }
  };
  const fetchEmpanada = async () => {
    try {
      const result = await obtener("empanadas");
      setNumEmpanadas(result);
    } catch (error) {
      // Handle the error if needed
      console.error("Error fetching data:", error);
    }
  };
  const fetchFinanza = async () => {
    try {
      const result = await obtener("finanza");
      setFinanza(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchFecha = async () => {
    try {
      const result = await obtener("fecha");
      setFechaFirebase(result);
    } catch (error) {
      // Handle the error if needed
      console.error("Error fetching data:", error);
    }
  };
  const fetchContador = async () => {
    try {
      const result = await obtener("contador");
      setContador(result);
    } catch (error) {
      // Handle the error if needed
      console.error("Error fetching data:", error);
    }
  };
  const fetchPedidos = async () => {
    try {
      const result = await obtener("pedidos");
      setPedidos(result);
    } catch (error) {
      // Handle the error if needed
      console.error("Error fetching data:", error);
    }
  };
  const fetchRestaurar = async () => {
    try {
      const result = await obtener("restaurar");
      setRestaurar(result);
    } catch (error) {
      // Handle the error if needed
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.setItem('ordenList', JSON.stringify([]));
      if (sessionStorage.getItem('fc') == null) {
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
        sessionStorage.setItem('fc', formattedDate)
        fetchFecha();
        fetchPedidos();
        fetchRestaurar();
        fetchContador();
        fetchEmpanada()
      } else {
        setOrden(JSON.parse(sessionStorage.getItem("platos")))
      }
    }
    fetchData();
    fetchFinanza();
  }, []);
  const filtrarPedidosPorFecha = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    setFechaHoy(formattedDate)
    const pedidosFiltrados = finanza.filter(pedido => pedido.fecha === formattedDate);
    let listaOrdenada = pedidosFiltrados.sort((a, b) => b.contador - a.contador);
    setDataProductos(listaOrdenada);
  };

  useEffect(() => {
    if (finanza.length > 0) {
      filtrarPedidosPorFecha()
    }
  }, [finanza])

  const restarEmpanadas = (cantidad) => {
    let restar = cantidad;
    if (numEmpanadas[0].masaAyer > 0) {
      if ((numEmpanadas[0].masaAyer >= cantidad)) {
        // aquí solo se la voy a quitar a numEmpanadas[0].masaAyer
        numEmpanadas[0].masaAyer = numEmpanadas[0].masaAyer - cantidad
        modificarDocumento(numEmpanadas[0].id, "empanadas", numEmpanadas[0])
        // luego de quitarle
        restar = 0
      } else {
        restar = cantidad - numEmpanadas[0].masaAyer // Aquí le quito a empanada ayer y me preparo para quitarle a empanada hoy
        numEmpanadas[0].masaAyer = 0
        // luego de quitarle continuo
      }
    }
    if (restar != 0) {
      // aquí debo quitarle a empanadaHoy
      numEmpanadas[0].cantidad = numEmpanadas[0].cantidad - restar
      modificarDocumento(numEmpanadas[0].id, "empanadas", numEmpanadas[0])
    }

  }

  useEffect(() => {
    if (dataProductos.length > 0) {
      let st = 0
      for (let i = 0; i < dataProductos.length; i++) {
        st = st + dataProductos[i].total;
      }
      setTotal(st)
    } else {
      setTotal(0)
    }
  }, [dataProductos])
  useEffect(() => {
    if (fechaFirebase.length > 0) {
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      if (formattedDate != fechaFirebase[0].fecha) {
        fechaFirebase[0].fecha = formattedDate;
        modificarDocumento(fechaFirebase[0].id, "fecha", fechaFirebase[0])
        setEliminarPedidos(true)
        setEliminarRestaurar(true)
      }
    }
  }, [fechaFirebase])
  useEffect(() => {
    if (eliminarRestaurar) {
      if (restaurar.length > 0) {
        for (let i = 0; i < restaurar.length; i++) {
          eliminarDocumento("restaurar", restaurar[i].id)
        }
        setEliminarRestaurar(false)
      }
    }
    if (eliminarPedidos) {
      let empanadasCantidad = 0;
      if (pedidos.length > 0) {
        for (let i = 0; i < pedidos.length; i++) {
          const data = {
            contador: pedidos[i].contador,
            estado: pedidos[i].estado,
            fecha: pedidos[i].fecha,
            pedido: pedidos[i].pedido,
            total: pedidos[i].total,
            hora: pedidos[i].hora
          }
          let matA = []
          matA = pedidos[i].matActualizar
          if (pedidos[i].matActualizar.length > 0) {
            for (let i = 0; i < matA.length; i++) {
              modificarDocumento(matA[i].id, "materiales", matA[i])
            }
          }
          enviar("finanza", data)
          eliminarDocumento("pedidos", pedidos[i].id)
          contador[0].actual = 0;
          modificarDocumento(contador[0].id, "contador", contador[0])
          let emp = pedidos[i].pedido.find((item) => item.nombre == "empanada")
          if (emp) {
            empanadasCantidad = empanadasCantidad + emp.cantidadLocal
          }
        }
        // setEliminarPedidos(false)
      }
      setEmpCant(empanadasCantidad)
    }
  }, [eliminarRestaurar, eliminarPedidos, restaurar, pedidos])
  useEffect(() => {
    if (platillos.length > 0) {
      const sortedList = [...platillos].sort((a, b) => a.contador - b.contador);
      setOrden(sortedList)
      setLoading(false)
    }
  }, [platillos])
  useEffect(() => {
    if (empCant > 0 && numEmpanadas.length > 0) {
      restarEmpanadas(empCant)
    }
  }, [empCant, numEmpanadas])

  useEffect(()=>{
    console.log(usuario, typeof usuario)
  },[usuario])
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar className={styles.bar} position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            SupplyPro
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        {usuario == "0" && 
          <>
            <List>
            <ListItem key="Fabrica" disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <button className={styles.icon} onClick={() => {
                    router.replace("/fabrica/inicio")
                  }} ><AccountBoxOutlinedIcon /></button>
                </ListItemIcon>
                <ListItemText primary="Fabrica" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem key="Mayorista" disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <button className={styles.icon} onClick={() => {
                    router.replace("/mayorista/mayorista-inicio")
                  }} ><AccountBoxOutlinedIcon /></button>
                </ListItemIcon>
                <ListItemText primary="Mayorista" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem key="Minorista" disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <button className={styles.icon} onClick={() => {
                    router.replace("/minoristas/minorista-inicio")
                  }} ><AccountBoxOutlinedIcon /></button>
                </ListItemIcon>
                <ListItemText primary="Minorista" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          </List>
          </>
        }
        {usuario == "1" &&
          <List>
            <ListItem key="Fabrica" disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <button className={styles.icon} onClick={() => {
                    router.replace("/fabrica/inicio")
                  }} ><AccountBoxOutlinedIcon /></button>
                </ListItemIcon>
                <ListItemText primary="Fabrica" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          </List>
        }
        {usuario == "2" &&
          <List>
            <ListItem key="Mayorista" disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <button className={styles.icon} onClick={() => {
                    router.replace("/mayorista/mayorista-inicio")
                  }} ><AccountBoxOutlinedIcon /></button>
                </ListItemIcon>
                <ListItemText primary="Mayorista" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          </List>
        }
        {usuario == "3" &&
          <List>
            <ListItem key="Minorista" disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <button className={styles.icon} onClick={() => {
                    router.replace("/minoristas/minorista-inicio")
                  }} ><AccountBoxOutlinedIcon /></button>
                </ListItemIcon>
                <ListItemText primary="Minorista" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          </List>
        }
        <Divider />
        <List>
          {['Finanzas'].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {index === 0 && <button className={styles.icon} onClick={() => ChangeOptionMenu(index + 6)}><AttachMoneyIcon /></button>}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['Cerrar sesión'].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {
                    index === 0 &&
                    <button className={styles.icon} onClick={() => sessionStorage.setItem("acceso", false)}>
                      <Link className={styles.close} href="/"><ExitToAppOutlinedIcon /></Link>
                    </button>
                  }
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {props.children}
      </Box>
    </Box>
  );
}