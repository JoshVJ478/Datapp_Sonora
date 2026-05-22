import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, Receipt, Users, LogOut, Plus, 
  DollarSign, TrendingUp, AlertCircle, Mic2, 
  Sliders, FileText, Download, CheckCircle, Play 
} from "lucide-react";

// ==========================================
// 1. INTERFAZ DEL PRODUCTOR / ADMINISTRADOR
// ==========================================
function ProductorDashboard({ navigate }) {
  const [tab, setTab] = useState("cola");
  const episodios = [
    { id: 1, proyecto: "Podcast Cibertec", episodio: "Ep. 04 - Redes", estado: "En Bruto", ingeniero: "Pendiente" },
    { id: 2, proyecto: "Audiolibro SciFi", episodio: "Capítulo 1", estado: "Mezclando", ingeniero: "Ana Torres" },
    { id: 3, proyecto: "Comercial Banco", episodio: "Spot 30s", estado: "Revisión", ingeniero: "Luis Gómez" },
  ];
  const facturas = [
    { id: "F001-0099", cliente: "Frecuencia Urbana FM", fecha: "28 Mar 2026", monto: "$230.00", estado: "Pagado" },
    { id: "F001-0100", cliente: "TechMedia Network", fecha: "01 Abr 2026", monto: "$450.00", estado: "Pendiente" },
  ];

  return (
    <div className="min-h-screen bg-black flex text-white font-sans antialiased">
      <aside className="w-64 bg-white/[0.01] backdrop-blur-3xl border-r border-white/[0.05] p-6 flex flex-col">
        <div className="mb-10"><h2 className="text-xl font-bold tracking-tighter"><span className="bg-gradient-to-b from-[#6D001A] via-[#8E0B2B] to-[#6D001A] bg-clip-text text-transparent">Sonora</span><span className="font-light ml-0.5">Studio</span></h2><span className="text-[10px] uppercase text-gray-500 tracking-widest">Rol: Administrador</span></div>
        <nav className="flex-1 space-y-1.5">
          <button onClick={() => setTab("cola")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${tab === "cola" ? "bg-[#6D001A]/10 text-white border border-[#6D001A]/20" : "text-gray-400"}`}><LayoutDashboard size={18} /> Cola de Trabajo</button>
          <button onClick={() => setTab("finanzas")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${tab === "finanzas" ? "bg-[#6D001A]/10 text-white border border-[#6D001A]/20" : "text-gray-400"}`}><Receipt size={18} /> Facturación</button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400"><Users size={18} /> Equipo Técnico</button>
        </nav>
        <button onClick={() => navigate('/')} className="flex items-center gap-3 text-gray-400 hover:text-red-400 mt-auto"><LogOut size={18} /> Cerrar Sesión</button>
      </aside>

      <main className="flex-1 p-10 bg-gradient-to-tr from-black via-black to-[#6D001A]/5">
        {tab === "cola" ? (
          <div>
            <header className="mb-12 flex justify-between items-center">
              <div><h1 className="text-3xl font-bold tracking-tight">Panel de Producción</h1><p className="text-gray-500 text-sm uppercase">Vista General Operativa</p></div>
              <button className="flex items-center gap-2 bg-gradient-to-br from-[#6D001A] via-[#8E0B2B] to-[#6D001A] px-5 py-2.5 rounded-xl font-semibold text-sm"><Plus size={16} /> Nuevo Proyecto</button>
            </header>
            <div className="bg-white/[0.01] border border-white/[0.05] rounded-2xl overflow-hidden shadow-2xl">
              <table className="w-full text-left"><thead className="bg-white/[0.02] border-b border-white/[0.05]"><tr className="text-xs text-gray-400 uppercase"><th className="py-4 px-6">Proyecto</th><th className="py-4 px-6">Episodio</th><th className="py-4 px-6">Estado</th><th className="py-4 px-6">Ingeniero</th></tr></thead>
                <tbody className="divide-y divide-white/[0.03]">{episodios.map(ep => (<tr key={ep.id} className="hover:bg-white/[0.01]"><td className="py-4 px-6 font-medium">{ep.proyecto}</td><td className="py-4 px-6 text-gray-400">{ep.episodio}</td><td className="py-4 px-6"><span className="px-3 py-1 bg-[#6D001A]/10 border border-[#6D001A]/30 rounded-full text-xs">{ep.estado}</span></td><td className="py-4 px-6 text-gray-400">{ep.ingeniero}</td></tr>))}</tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            <header className="mb-10"><h1 className="text-3xl font-bold tracking-tight">Facturación y Finanzas</h1><p className="text-gray-500 text-sm uppercase">Indicadores Comerciales</p></header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl">
                <h3 className="text-gray-400 text-sm mb-1">Ingresos del Mes</h3><p className="text-3xl font-bold text-white">$4,250.00</p>
                <p className="text-[#8E0B2B] text-xs mt-2 flex items-center gap-1"><TrendingUp size={12}/> +12% vs mes anterior</p>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl">
                <h3 className="text-gray-400 text-sm mb-1">Cuentas por Cobrar</h3><p className="text-3xl font-bold text-white">$1,180.00</p>
                <p className="text-yellow-500 text-xs mt-2">3 facturas pendientes</p>
              </div>
            </div>
            <div className="bg-white/[0.01] border border-white/[0.05] rounded-2xl overflow-hidden">
              <table className="w-full text-left"><thead className="bg-white/[0.02] border-b border-white/[0.05]"><tr className="text-xs text-gray-400 uppercase"><th className="py-4 px-6">Nº Factura</th><th className="py-4 px-6">Cliente</th><th className="py-4 px-6">Fecha</th><th className="py-4 px-6">Monto</th><th className="py-4 px-6">Estado</th></tr></thead>
                <tbody className="divide-y divide-white/[0.03]">{facturas.map(f => (<tr key={f.id} className="hover:bg-white/[0.01]"><td className="py-4 px-6 font-medium">{f.id}</td><td className="py-4 px-6 text-gray-400">{f.cliente}</td><td className="py-4 px-6 text-gray-400">{f.fecha}</td><td className="py-4 px-6 font-medium">{f.monto}</td><td className="py-4 px-6"><span className={`px-3 py-1 rounded-full text-xs border ${f.estado === "Pagado" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"}`}>{f.estado}</span></td></tr>))}</tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ==========================================
// 2. INTERFAZ ENFOCADA EN EL INGENIERO DE AUDIO
// ==========================================
function IngenieroDashboard({ navigate }) {
  // El ingeniero necesita ver parámetros de audio, plugins aplicados y especificaciones técnicas
  const misTracks = [
    { id: "TRK-10", archivo: "VOCAL_RockLatino_Ep45.wav", duracion: "00:45:30", formato: "WAV 24-bit", plugin: "iZotope RX 10", estado: "Procesado" },
    { id: "TRK-11", archivo: "HOST_SciFi_Cap1.wav", duracion: "00:52:15", formato: "WAV 24-bit", plugin: "FabFilter Pro-Q 3", estado: "Mezclando" },
  ];

  return (
    <div className="min-h-screen bg-black flex text-white font-sans antialiased">
      <aside className="w-64 bg-white/[0.01] backdrop-blur-3xl border-r border-white/[0.05] p-6 flex flex-col">
        <div className="mb-10"><h2 className="text-xl font-bold tracking-tighter"><span className="bg-gradient-to-b from-[#6D001A] via-[#8E0B2B] to-[#6D001A] bg-clip-text text-transparent">Sonora</span><span className="font-light ml-0.5">Studio</span></h2><span className="text-[10px] uppercase text-gray-500 tracking-widest">Rol: Ingeniero de Sonido</span></div>
        <nav className="flex-1 space-y-1.5">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium bg-[#6D001A]/10 text-white border border-[#6D001A]/20"><Sliders size={18} /> Consola Técnica</button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400"><FileText size={18} /> Fichas de Procesamiento</button>
        </nav>
        <button onClick={() => navigate('/')} className="flex items-center gap-3 text-gray-400 hover:text-red-400 mt-auto"><LogOut size={18} /> Cerrar Sesión</button>
      </aside>

      <main className="flex-1 p-10 bg-gradient-to-tr from-black via-black to-[#6D001A]/5">
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight">Estación Técnica de Audio</h1>
          <p className="text-gray-500 text-sm uppercase">Procesamiento de Tracks, Plugins (FX) e Integridad de Audio</p>
        </header>

        <div className="bg-white/[0.01] border border-white/[0.05] rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6 bg-white/[0.02] border-b border-white/[0.05] flex justify-between items-center">
            <h3 className="font-semibold text-lg tracking-tight">Cola de Tracks Asignados</h3>
          </div>
          <table className="w-full text-left">
            <thead className="bg-white/[0.01] text-xs text-gray-400 uppercase">
              <tr>
                <th className="py-4 px-6">ID Track</th>
                <th className="py-4 px-6">Archivo de Audio</th>
                <th className="py-4 px-6">Duración</th>
                <th className="py-4 px-6">Formato Técnico</th>
                <th className="py-4 px-6">Plugin Activo (FX)</th>
                <th className="py-4 px-6 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {misTracks.map(track => (
                <tr key={track.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="py-4 px-6 font-mono text-xs text-gray-400">{track.id}</td>
                  <td className="py-4 px-6 font-medium text-white/90">{track.archivo}</td>
                  <td className="py-4 px-6 text-gray-400 font-light">{track.duracion}</td>
                  <td className="py-4 px-6 text-xs text-gray-300 font-mono">{track.formato}</td>
                  <td className="py-4 px-6 text-sm text-gray-400"><span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded">{track.plugin}</span></td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-xs bg-gradient-to-br from-[#6D001A] to-[#8E0B2B] px-3 py-1.5 rounded-lg font-semibold shadow-md">Registrar Ficha</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

// ==========================================
// 3. INTERFAZ ENFOCADA EN EL CLIENTE FINAL
// ==========================================
function ClienteDashboard({ navigate }) {
  // El cliente solo necesita descargar sus masters finales listos y ver que se cumplan las métricas de calidad (LUFS / True Peak)
  const misEntregas = [
    { id: 1, episodio: "Ep. 45 - Evolución del Rock Latino", formato: "MP3 320kbps", lufs: "-14.00 LUFS", truePeak: "-1.00 dBTP", fecha: "28/03/2026" }
  ];

  return (
    <div className="min-h-screen bg-black flex text-white font-sans antialiased">
      <aside className="w-64 bg-white/[0.01] backdrop-blur-3xl border-r border-white/[0.05] p-6 flex flex-col">
        <div className="mb-10"><h2 className="text-xl font-bold tracking-tighter"><span className="bg-gradient-to-b from-[#6D001A] via-[#8E0B2B] to-[#6D001A] bg-clip-text text-transparent">Sonora</span><span className="font-light ml-0.5">Studio</span></h2><span className="text-[10px] uppercase text-gray-500 tracking-widest">Portal de Clientes</span></div>
        <nav className="flex-1 space-y-1.5">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium bg-[#6D001A]/10 text-white border border-[#6D001A]/20"><Mic2 size={18} /> Mis Masters Finales</button>
        </nav>
        <button onClick={() => navigate('/')} className="flex items-center gap-3 text-gray-400 hover:text-red-400 mt-auto"><LogOut size={18} /> Cerrar Sesión</button>
      </aside>

      <main className="flex-1 p-10 bg-gradient-to-tr from-black via-black to-[#6D001A]/5">
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">Panel de Descarga de Contenido</h1>
          <p className="text-gray-500 text-sm uppercase">Tus episodios masterizados listos para distribución en plataformas</p>
        </header>

        <div className="space-y-6">
          {misEntregas.map(item => (
            <div key={item.id} className="bg-white/[0.01] border border-white/[0.05] rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl relative">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent"></div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={16} className="text-green-500" />
                  <h3 className="font-bold text-lg text-white/95">{item.episodio}</h3>
                </div>
                <div className="flex flex-wrap gap-3 text-xs font-mono text-gray-400">
                  <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-gray-300">{item.formato}</span>
                  <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[#8E0B2B]">{item.lufs}</span>
                  <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-yellow-500/80">{item.truePeak}</span>
                  <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded">Exportado: {item.fecha}</span>
                </div>
              </div>
              <button className="w-full md:w-auto flex items-center justify-center gap-2 border border-white/10 hover:border-white/30 bg-white/[0.02] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all">
                <Download size={16} /> Descargar Master Final
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// ==========================================
// 4. COMPONENTE CONTROLADOR (GATEKEEPER)
// ==========================================
export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // Aquí capturamos el rol que pasa el Login.
  // IMPORTANTE: Si pruebas el Dashboard de forma directa o recargas, tomará "productor" por defecto.
  const rol = location.state?.rol || "productor";

  // Retornamos de forma limpia la interfaz correspondiente sin mezclar código
  if (rol === "ingeniero") {
    return <IngenieroDashboard navigate={navigate} />;
  }
  if (rol === "cliente") {
    return <ClienteDashboard navigate={navigate} />;
  }
  return <ProductorDashboard navigate={navigate} />;
}