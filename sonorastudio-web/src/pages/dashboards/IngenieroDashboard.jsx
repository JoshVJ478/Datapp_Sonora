import { LogOut, Sliders, FileText } from "lucide-react";

export default function IngenieroDashboard({ navigate }) {
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
          <p className="text-gray-500 text-sm uppercase">Procesamiento de Tracks y Plugins (FX)</p>
        </header>
        <div className="bg-white/[0.01] border border-white/[0.05] rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6 bg-white/[0.02] border-b border-white/[0.05]"><h3 className="font-semibold text-lg">Cola de Tracks Asignados</h3></div>
          <table className="w-full text-left">
            <thead className="bg-white/[0.01] text-xs text-gray-400 uppercase"><tr><th className="py-4 px-6">ID Track</th><th className="py-4 px-6">Archivo de Audio</th><th className="py-4 px-6">Duración</th><th className="py-4 px-6">Formato Técnico</th><th className="py-4 px-6">Plugin Activo (FX)</th><th className="py-4 px-6 text-right">Acción</th></tr></thead>
            <tbody className="divide-y divide-white/[0.03]">
              {misTracks.map(track => (
                <tr key={track.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="py-4 px-6 font-mono text-xs text-gray-400">{track.id}</td><td className="py-4 px-6 font-medium text-white/90">{track.archivo}</td><td className="py-4 px-6 text-gray-400 font-light">{track.duracion}</td><td className="py-4 px-6 text-xs text-gray-300 font-mono">{track.formato}</td><td className="py-4 px-6 text-sm text-gray-400"><span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded">{track.plugin}</span></td>
                  <td className="py-4 px-6 text-right"><button className="text-xs bg-gradient-to-br from-[#6D001A] to-[#8E0B2B] px-3 py-1.5 rounded-lg font-semibold shadow-md">Registrar Ficha</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}