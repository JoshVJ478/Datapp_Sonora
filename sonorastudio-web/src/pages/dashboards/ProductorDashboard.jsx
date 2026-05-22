import { useState } from "react";
import { LayoutDashboard, TrendingUp, Receipt, Users, LogOut, Plus, Search, Filter, AlertTriangle, CheckCircle, Clock, MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductorDashboard({ navigate }) {
  const [tab, setTab] = useState("cola");
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  const episodios = [
    { id: "EP-045", proyecto: "Podcast Cibertec", episodio: "Ep. 04 - Redes", estado: "En Bruto", ingeniero: "Sin Asignar", qcAlerta: null },
    { id: "EP-046", proyecto: "Audiolibro SciFi", episodio: "Capítulo 1", estado: "Mezclando", ingeniero: "Ana Torres", qcAlerta: null },
    { id: "EP-047", proyecto: "Comercial Banco", episodio: "Spot 30s", estado: "Revisión", ingeniero: "Luis Gómez", qcAlerta: "LUFS > -14" },
    { id: "EP-048", proyecto: "Indie Sessions", episodio: "Bandas 2026", estado: "Aprobado", ingeniero: "Carlos Mendoza", qcAlerta: null },
    { id: "EP-049", proyecto: "Voces del Metal", episodio: "Orígenes", estado: "En Bruto", ingeniero: "Sin Asignar", qcAlerta: null },
  ];

  const episodiosFiltrados = episodios.filter(ep => {
    if (filtroEstado === "Todos") return true;
    if (filtroEstado === "Pendientes") return ep.estado === "En Bruto";
    if (filtroEstado === "En Proceso") return ep.estado === "Mezclando" || ep.estado === "Revisión";
    if (filtroEstado === "Completados") return ep.estado === "Aprobado";
    return true;
  });

  const renderEstado = (estado) => {
    const estilos = {
      "En Bruto": "bg-gray-500/10 text-gray-400 border-gray-500/20",
      "Mezclando": "bg-blue-500/10 text-blue-400 border-blue-500/20",
      "Revisión": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      "Aprobado": "bg-green-500/10 text-green-400 border-green-500/20"
    };
    const Icono = estado === "Aprobado" ? CheckCircle : estado === "En Bruto" ? Clock : LayoutDashboard;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${estilos[estado]}`}>
        <Icono size={12} /> {estado}
      </span>
    );
  };


  const elegantTransition = { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] };

  return (
    <div className="min-h-screen bg-black flex text-white font-sans antialiased">

      <aside className="w-64 bg-white/[0.01] backdrop-blur-3xl border-r border-white/[0.05] p-6 flex flex-col">
        <div className="mb-10">
          <h2 className="text-xl font-bold tracking-tighter">
            <span className="bg-gradient-to-b from-[#6D001A] via-[#8E0B2B] to-[#6D001A] bg-clip-text text-transparent">Sonora</span>
            <span className="font-light ml-0.5">Studio</span>
          </h2>
          <span className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold mt-1 block">Rol: Administrador</span>
        </div>
        <nav className="flex-1 space-y-2">
          <button onClick={() => setTab("cola")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors duration-300 ${tab === "cola" ? "bg-[#6D001A]/10 text-white border border-[#6D001A]/20" : "text-gray-400 hover:bg-white/[0.02] border border-transparent"}`}><LayoutDashboard size={18} /> Cola de Trabajo</button>
          <button onClick={() => setTab("finanzas")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors duration-300 ${tab === "finanzas" ? "bg-[#6D001A]/10 text-white border border-[#6D001A]/20" : "text-gray-400 hover:bg-white/[0.02] border border-transparent"}`}><Receipt size={18} /> Facturación</button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/[0.02] border border-transparent rounded-xl transition-colors duration-300"><Users size={18} /> Equipo Técnico</button>
        </nav>
        <button onClick={() => navigate('/')} className="flex items-center gap-3 text-gray-400 hover:text-red-400 mt-auto px-4 py-2 transition-colors duration-300"><LogOut size={18} /> Cerrar Sesión</button>
      </aside>

      <main className="flex-1 p-10 bg-gradient-to-tr from-black via-black to-[#6D001A]/5 overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="wait">
          
          {tab === "cola" && (
            <motion.div 
              key="cola" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }} 
              transition={elegantTransition}
            >
              <header className="mb-8 flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Control de Producción</h1>
                  <p className="text-gray-500 text-sm uppercase mt-1">Supervisión de Episodios y Asignaciones</p>
                </div>
                <button className="flex items-center gap-2 bg-gradient-to-br from-[#6D001A] via-[#8E0B2B] to-[#6D001A] hover:from-[#8E0B2B] hover:to-[#8E0B2B] px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-500 shadow-[0_0_20px_rgba(109,0,26,0.15)]">
                  <Plus size={16} /> Nuevo Proyecto
                </button>
              </header>

              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div className="flex bg-white/[0.02] border border-white/[0.05] rounded-xl p-1 relative">
                  {["Todos", "Pendientes", "En Proceso", "Completados"].map(filtro => (
                    <button 
                      key={filtro}
                      onClick={() => setFiltroEstado(filtro)}
                      className="relative px-4 py-1.5 rounded-lg text-sm font-medium z-10 outline-none"
                    >
                      {filtroEstado === filtro && (
                        <motion.div 
                          layoutId="filtroActivo" 
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
                        className="relative z-10"
                      >
                        {filtro}
                      </motion.span>
                    </button>
                  ))}
                </div>
                
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input type="text" placeholder="Buscar proyecto..." className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#8E0B2B]/50 transition-colors duration-300" />
                </div>
              </div>

              <div className="bg-white/[0.01] border border-white/[0.05] rounded-2xl overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                  <thead className="bg-white/[0.02] border-b border-white/[0.05]">
                    <tr className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">
                      <th className="py-4 px-6">ID</th>
                      <th className="py-4 px-6">Proyecto / Episodio</th>
                      <th className="py-4 px-6">Estado</th>
                      <th className="py-4 px-6">Ingeniero Asignado</th>
                      <th className="py-4 px-6">Control Calidad</th>
                      <th className="py-4 px-6 text-right">Acción</th>
                    </tr>
                  </thead>
                  
                  <AnimatePresence mode="wait">
                    {episodiosFiltrados.length > 0 ? (
                      <motion.tbody 
                        key={filtroEstado}
                        initial={{ opacity: 0, x: 20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        exit={{ opacity: 0, x: -20 }} 
                        transition={elegantTransition}
                        className="divide-y divide-white/[0.03]"
                      >
                        {episodiosFiltrados.map((ep) => (
                          <tr key={ep.id} className="hover:bg-white/[0.02] transition-colors duration-300">
                            <td className="py-4 px-6 font-mono text-xs text-gray-500">{ep.id}</td>
                            <td className="py-4 px-6">
                              <p className="font-medium text-white/90">{ep.proyecto}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{ep.episodio}</p>
                            </td>
                            <td className="py-4 px-6">{renderEstado(ep.estado)}</td>
                            <td className="py-4 px-6">
                              <span className={`text-sm ${ep.ingeniero === "Sin Asignar" ? "text-red-400/80 font-medium italic" : "text-gray-300"}`}>
                                {ep.ingeniero}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              {ep.qcAlerta ? (
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-400 bg-red-400/10 px-2.5 py-1 rounded-md border border-red-400/20">
                                  <AlertTriangle size={12} /> {ep.qcAlerta}
                                </span>
                              ) : (
                                <span className="text-gray-600 text-xs">-</span>
                              )}
                            </td>
                            <td className="py-4 px-6 text-right">
                              <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                                <MoreVertical size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </motion.tbody>
                    ) : (

                      <motion.tbody 
                        key="empty" 
                        initial={{ opacity: 0, x: 20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        exit={{ opacity: 0, x: -20 }} 
                        transition={elegantTransition}
                      >
                        <tr>
                          <td colSpan="6" className="py-16 text-center">
                            <div className="flex flex-col items-center">
                              <Filter className="text-gray-600 mb-3" size={32} />
                              <p className="text-gray-400 font-medium">No hay episodios que coincidan con este filtro.</p>
                            </div>
                          </td>
                        </tr>
                      </motion.tbody>
                    )}
                  </AnimatePresence>
                </table>
              </div>
            </motion.div>
          )}

          {tab === "finanzas" && (
            <motion.div 
              key="finanzas" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }} 
              transition={elegantTransition}
            >
              <header className="mb-10">
                <h1 className="text-3xl font-bold tracking-tight">Facturación y Finanzas</h1>
                <p className="text-gray-500 text-sm uppercase mt-1">Indicadores Comerciales</p>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl">
                  <h3 className="text-gray-400 text-sm mb-1">Ingresos del Mes</h3>
                  <p className="text-3xl font-bold text-white">$4,250.00</p>
                  <p className="text-[#8E0B2B] text-xs mt-2 flex items-center gap-1"><TrendingUp size={12}/> +12% vs mes anterior</p>
                </div>
                <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl">
                  <h3 className="text-gray-400 text-sm mb-1">Cuentas por Cobrar</h3>
                  <p className="text-3xl font-bold text-white">$1,180.00</p>
                  <p className="text-yellow-500 text-xs mt-2">3 facturas pendientes</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}