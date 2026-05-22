import { LogOut, Mic2, Download, CheckCircle } from "lucide-react";

export default function ClienteDashboard({ navigate }) {
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
        <header className="mb-12"><h1 className="text-3xl font-bold tracking-tight">Panel de Descarga</h1><p className="text-gray-500 text-sm uppercase">Tus episodios masterizados listos para distribución</p></header>
        <div className="space-y-6">
          {misEntregas.map(item => (
            <div key={item.id} className="bg-white/[0.01] border border-white/[0.05] rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent"></div>
              <div>
                <div className="flex items-center gap-2 mb-2"><CheckCircle size={16} className="text-green-500" /><h3 className="font-bold text-lg">{item.episodio}</h3></div>
                <div className="flex flex-wrap gap-3 text-xs font-mono text-gray-400">
                  <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-gray-300">{item.formato}</span>
                  <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[#8E0B2B]">{item.lufs}</span>
                  <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-yellow-500/80">{item.truePeak}</span>
                  <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded">Exportado: {item.fecha}</span>
                </div>
              </div>
              <button className="flex items-center justify-center gap-2 border border-white/10 hover:border-white/30 bg-white/[0.02] px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"><Download size={16} /> Descargar Master</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}