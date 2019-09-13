export enum EndPoint {
  login = "/auth/loginjwt",
  //Resgristro
  getTipoCategoriaEmpresa = "/registro/app/categoriaTipoEmpresa",
  registerUser = "/registro/app/crearRegistro",
  changePass = "/apij/registro/v1/cambioPass",
  datosUser = "/apij/registro/v1/adicionalEmpresa",
  tranUser = "/apij/registro/v1/ventaMes",
  bancoUser = "/apij/registro/v1/infoBanco",
  dpiUser = "/apij/registro/v1/subirDPI",
  rtuUser = "/apij/registro/v1/subirRTU",

  //Ajustes
  updateInfoPublic = "/apij/registro/v1/ajustes/updateinfopublic",
  logoEmpresa = "/apij/registro/v1/ajustes/subirLogo",
  portadaEmpresa = "/apij/registro/v1/ajustes/subirPortada",



  //Funcionalidades, Ventas,Transacciones,Productos...
  renovarToken = "/apij/renovartoken",
  getUser = "/apij/user",
  sendSale = "/apij/v1/enviarventa/",
  sendSalePos = "/apij/v1/enviarventapgbanda/",
  sendLink = "/apij/v1/solicitud/solicitudLink/",
  sendEmail = "/apij/v1/solicitud/solicitudEmail/",
  getTran = "/apij/mistransacciones",
  getTranDia = "/apij/v1/transacciones/dia",
  getTranMes = "/apij/v1/transacciones/mes",
  getTranFecha = "/apij/v1/transacciones/perso/",
  getTotalTran = "/apij/v1/totaltransacciones",
  getTotalTranDia = "/apij/v1/ttransacciones/dia",
  getTotalTranMes = "/apij/v1/ttransacciones/mes",
  getTotalTranFecha = "/apij/v1/ttransacciones/perso/",
  getQrEmpresa = "/apij/v1/qrMontoVariable",
  sendQR = "/apij/v1/solicitud/solicitudQR/",
  getProductos = "/apij/tienda/api/v1/productos/",
  getCategorias = "/apij/tienda/api/v1/categoriapro/",
  getProductosCategoria = "/apij/tienda/api/v1/productos/buscate/",
  getProductosNombre = "/apij/tienda/api/v1/producto/buscar/",
  getCliente = "/apij/v1/clientes/busqueda/",
  crearCliente = "/apij/v1/clientes/nuevo"
}
