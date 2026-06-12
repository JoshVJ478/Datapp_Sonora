import { useState, useEffect } from "react";
import { LogOut, Mic2, Download, CheckCircle, Clock, Filter, Search, AlertTriangle, Sparkles, LayoutDashboard, MoreVertical, User, Calendar, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ClienteDashboard({ navigate }) {
  const rucSesion = localStorage.getItem("sonora_ruc");
  const nombreSesion = localStorage.getItem("sonora_nombre");

  const [entregas, setEntregas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  const [mostrarProximamente, setMostrarProximamente] = useState(false);
  const handleProximamente = () => {
    setMostrarProximamente(true);
    setTimeout(() => setMostrarProximamente(false), 3000);
  };

  const generarIniciales = (nombre) => {
    if (!nombre) return "CL";
    const palabras = nombre.trim().split(" ");
    if (palabras.length >= 2) return (palabras[0][0] + palabras[1][0]).toUpperCase();
    return nombre.substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    if (!rucSesion) {
      navigate("/login");
      return;
    }

    setCargando(true);
    setError(null);

    fetch(`http://127.0.0.1:8000/api/dashboard/cliente/${rucSesion}`)
      .then((res) => {
        if (!res.ok) throw new Error('No hay proyectos registrados para tu cuenta en este momento.');
        return res.json();
      })
      .then((data) => {
        setEntregas(data);
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setCargando(false);
      });
  }, [rucSesion, navigate]);

  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/login");
  };

  const filtrados = entregas.filter(item => {
    const coincideBusqueda = 
      (item.nombre_proyecto && item.nombre_proyecto.toLowerCase().includes(busqueda.toLowerCase())) || 
      (item.titulo_episodio && item.titulo_episodio.toLowerCase().includes(busqueda.toLowerCase())) ||
      (item.nombre_ingeniero && item.nombre_ingeniero.toLowerCase().includes(busqueda.toLowerCase()));
    
    let coincideFiltro = true;
    const estadoActual = item.estado_episodio || "En Bruto";

    if (filtroEstado === "En Estudio") {
      coincideFiltro = estadoActual === "En Bruto";
    } else if (filtroEstado === "En Post-Producción") {
      coincideFiltro = estadoActual === "Mezclando" || estadoActual === "Revisión" || estadoActual === "En Proceso";
    } else if (filtroEstado === "Listos para Descarga") {
      coincideFiltro = estadoActual === "Aprobado";
    }

    return coincideBusqueda && coincideFiltro;
  });

  const contadores = {
    "Todos": entregas.length,
    "En Estudio": entregas.filter(e => (e.estado_episodio || "En Bruto") === "En Bruto").length,
    "En Post-Producción": entregas.filter(e => ["Mezclando", "Revisión", "En Proceso"].includes(e.estado_episodio)).length,
    "Listos para Descarga": entregas.filter(e => e.estado_episodio === "Aprobado").length
  };

  const pestañasFiltro = ["Todos", "En Estudio", "En Post-Producción", "Listos para Descarga"];

  const renderEstado = (estado) => {
    const estilos = {
      "En Bruto": "bg-gray-500/10 text-gray-400 border-gray-500/20",
      "Mezclando": "bg-blue-500/10 text-blue-400 border-blue-500/20",
      "Revisión": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      "Aprobado": "bg-green-500/10 text-green-400 border-green-500/20"
    };
    
    const nombreVisual = estado === "En Bruto" ? "En Estudio" : 
                         estado === "Aprobado" ? "Finalizado" : estado;

    const Icono = estado === "Aprobado" ? CheckCircle : estado === "En Bruto" ? Clock : LayoutDashboard;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${estilos[estado] || estilos["En Proceso"]}`}>
        <Icono size={12} /> {nombreVisual || "En Proceso"}
      </span>
    );
  };

  const elegantTransition = { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] };
  const staggerContainer = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } } };
  const cardVariant = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: elegantTransition } };

  if (!rucSesion) return null;

  return (
    <div className="min-h-screen bg-black flex text-white font-sans antialiased relative">
      
      <aside className="w-64 bg-white/[0.01] backdrop-blur-3xl border-r border-white/[0.05] p-6 flex flex-col z-20">
        <div className="mb-10">
          <h2 className="text-xl font-bold tracking-tighter">
            <span className="bg-gradient-to-b from-[#6D001A] via-[#8E0B2B] to-[#6D001A] bg-clip-text text-transparent">Sonora</span>
            <span className="font-light ml-0.5">Studio</span>
          </h2>
          <span className="text-[10px] uppercase text-gray-500 tracking-widest mt-1 block font-semibold">Portal de Clientes</span>
        </div>

        <div className="mb-8">
          <div className="w-full flex items-center gap-4 bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 shadow-inner">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8E0B2B] to-[#4A0011] flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-lg">
              {generarIniciales(nombreSesion)}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold text-sm truncate text-white/90">{nombreSesion}</span>
              <span className="text-[10px] text-gray-500 font-mono tracking-wider">RUC: {rucSesion}</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium bg-[#6D001A]/10 text-white border border-[#6D001A]/20">
            <LayoutDashboard size={18} /> Panel de Control
          </button>
        </nav>
        
        <button onClick={cerrarSesion} className="flex items-center gap-3 text-gray-400 hover:text-red-400 mt-auto px-4 py-2 transition-colors">
          <LogOut size={18} /> Cerrar Sesión
        </button>
      </aside>

      <main className="flex-1 p-10 bg-gradient-to-tr from-black via-black to-[#6D001A]/5 overflow-y-auto relative z-10">
        <motion.div className="max-w-6xl mx-auto relative z-10" initial="hidden" animate="show" variants={staggerContainer}>
          
          <motion.header variants={cardVariant} className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Estado de mis Proyectos</h1>
              <p className="text-gray-500 text-sm uppercase mt-1">Seguimiento de entregas y auditoría comercial</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleProximamente}
                className="flex items-center gap-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.05] px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors duration-300"
              >
                <Download size={16} /> Exportar Estado de Cuenta
              </button>
            </div>
          </motion.header>

          <motion.div variants={cardVariant} className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6">
            <div className="flex flex-wrap bg-white/[0.02] border border-white/[0.05] rounded-xl p-1 relative">
              {pestañasFiltro.map(filtro => (
                <button 
                  key={filtro}
                  onClick={() => setFiltroEstado(filtro)}
                  className="relative px-4 py-1.5 rounded-lg text-sm font-medium z-10 outline-none flex items-center gap-1.5"
                >
                  {filtroEstado === filtro && (
                    <motion.div 
                      layoutId="filtroActivoCliente" 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={elegantTransition}
                      className="absolute inset-0 bg-white/10 rounded-lg -z-10" 
                    />
                  )}
                  <motion.span
                    initial={false}
                    animate={{ color: filtroEstado === filtro ? "#ffffff" : "#6b7280" }}
                    transition={elegantTransition}
                    className="relative z-10 whitespace-nowrap"
                  >
                    {filtro} <span className="opacity-50 text-[10px] ml-0.5">({contadores[filtro]})</span>
                  </motion.span>
                </button>
              ))}
            </div>
            
            <div className="relative w-full xl:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="Buscar por proyecto, track o ingeniero..." 
                className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#8E0B2B]/50 transition-colors duration-300"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </motion.div>

          <div className="min-h-[400px]">
            {cargando ? (
              <div className="py-20 flex flex-col justify-center items-center h-full">
                <div className="w-8 h-8 border-4 border-[#6D001A] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400">Sincronizando registros con la base de datos de Sonora...</p>
              </div>
            ) : error ? (
              <div className="py-20 flex flex-col justify-center items-center bg-red-900/10 border border-red-500/20 rounded-2xl h-full">
                <AlertTriangle className="text-red-500 mb-2" size={32} />
                <p className="text-red-400 font-medium">{error}</p>
              </div>
            ) : (
              <motion.div variants={cardVariant} className="bg-white/[0.01] border border-white/[0.05] rounded-2xl overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                  <thead className="bg-white/[0.02] border-b border-white/[0.05]">
                    <tr className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">
                      <th className="py-4 px-6">ID Código</th>
                      <th className="py-4 px-6">Proyecto / Episodio</th>
                      <th className="py-4 px-6">Ingeniero Asignado</th>
                      <th className="py-4 px-6">Fecha Registro</th>
                      <th className="py-4 px-6">Estado Proyecto</th>
                      <th className="py-4 px-6">Facturación</th>
                      <th className="py-4 px-6 text-right">Acción</th>
                    </tr>
                  </thead>
                  
                  <AnimatePresence mode="wait">
                    {filtrados.length > 0 ? (
                      <motion.tbody 
                        key={filtroEstado}
                        initial={{ opacity: 0, x: 20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        exit={{ opacity: 0, x: -20 }} 
                        transition={elegantTransition}
                        className="divide-y divide-white/[0.03]"
                      >
                        {filtrados.map((item) => {
                          const estaAprobado = item.estado_episodio === "Aprobado";
                          const idMostrado = item.id_episodio ? `EP-${item.id_episodio}` : `PRY-${item.id_proyecto || '00'}`;

                          return (
                            <tr key={idMostrado} className="hover:bg-white/[0.02] transition-colors duration-300">
                              <td className="py-4 px-6 font-mono text-xs text-gray-500">{idMostrado}</td>
                              
                              <td className="py-4 px-6">
                                <p className="font-medium text-white/90">{item.nombre_proyecto}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{item.titulo_episodio || "Episodio sin título"}</p>
                              </td>

                              <td className="py-4 px-6">
                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                  <User size={14} className="text-[#8E0B2B]" />
                                  <span>{item.nombre_ingeniero || "Por Asignar"}</span>
                                </div>
                              </td>

                              <td className="py-4 px-6">
                                <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                                  <Calendar size={14} className="text-gray-600" />
                                  <span>{item.fecha_grabacion || "Reciente"}</span>
                                </div>
                              </td>
                              
                              <td className="py-4 px-6">
                                {renderEstado(item.estado_episodio)}
                              </td>
                              
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-1 font-medium text-sm text-gray-200">
                                  <DollarSign size={14} className="text-green-500" />
                                  <span>{item.monto_factura ? Number(item.monto_factura).toLocaleString('en-US', {minimumFractionDigits: 2}) : "Verificado"}</span>
                                </div>
                              </td>
                              
                              <td className="py-4 px-6 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {estaAprobado ? (
                                    <button 
                                      onClick={handleProximamente}
                                      className="flex items-center gap-1.5 bg-gradient-to-br from-[#6D001A] to-[#8E0B2B] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:from-[#8E0B2B] transition-all"
                                    >
                                      <Download size={12} /> Descargar
                                    </button>
                                  ) : (
                                    <span className="text-[11px] bg-white/5 border border-white/5 px-2 py-1 rounded text-gray-500 font-medium">
                                      Bloqueado
                                    </span>
                                  )}
                                  <button onClick={handleProximamente} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                                    <MoreVertical size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </motion.tbody>
                    ) : (
                      <motion.tbody
                        key="empty" 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                      >
                        <tr>
                          <td colSpan="7" className="py-16 text-center">
                            <div className="flex flex-col items-center">
                              <Filter className="text-gray-600 mb-3" size={32} />
                              <p className="text-gray-400 font-medium">No se encontraron entregables activos con estos filtros.</p>
                            </div>
                          </td>
                        </tr>
                      </motion.tbody>
                    )}
                  </AnimatePresence>
                </table>
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>

      <AnimatePresence>
        {mostrarProximamente && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-8 right-8 bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 px-5 py-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex items-center gap-4 z-50 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#8E0B2B]/10 to-transparent pointer-events-none"></div>

            <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#8E0B2B] to-[#4A0011] shadow-[0_0_15px_rgba(142,11,43,0.4)]">
               <Sparkles size={18} className="text-white animate-pulse" />
            </div>

            <div className="relative z-10 pr-2">
              <h4 className="font-semibold text-white/90 text-sm tracking-wide">Descargas Premium</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">El servidor de archivos estará listo en la V2.0</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}