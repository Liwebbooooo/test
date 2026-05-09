// App.jsx
function TusFotosYaEditor() {
  const fileInputRef = React.useRef(null);
  const [photos, setPhotos] = React.useState(Array(9).fill(null));
  const [selected, setSelected] = React.useState(null);

  const uploadImage = (e) => {
    const file = e.target.files?.[0];
    if (!file || selected === null) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const updated = [...photos];
      updated[selected] = event.target.result;
      setPhotos(updated);
    };
    reader.readAsDataURL(file);
  };

  const openUpload = (index) => {
    setSelected(index);
    fileInputRef.current.click();
  };

  const removePhoto = () => {
    if (selected === null) return;
    const updated = [...photos];
    updated[selected] = null;
    setPhotos(updated);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm z-20">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            T
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              TusFotosYa
            </h1>
            <p className="text-xs text-slate-500">
              Editor Profesional Online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 transition text-slate-700 text-sm">
            Guardar Proyecto
          </button>
          <button className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg transition-all hover:scale-105">
            Descargar PDF
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 bg-[#08213D] text-white p-6 overflow-y-auto flex flex-col">
          <div className="mb-8">
            <h2 className="text-lg font-semibold">Configuración</h2>
            <p className="text-sm text-slate-300 mt-1">Personaliza tu impresión</p>
          </div>

          {/* Paper */}
          <div className="mb-6">
            <label className="text-xs uppercase tracking-widest text-slate-400 block mb-2">Papel</label>
            <select className="w-full rounded-2xl bg-white/10 border border-white/10 px-4 py-3 backdrop-blur text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option className="text-black">A4</option>
              <option className="text-black">Carta</option>
              <option className="text-black">A6</option>
            </select>
          </div>

          {/* Photo Size */}
          <div className="mb-6">
            <label className="text-xs uppercase tracking-widest text-slate-400 block mb-2">Tamaño Foto</label>
            <div className="grid grid-cols-2 gap-3">
              {['4x6', '5x7', 'Passport', 'Polaroid'].map((item) => (
                <button key={item} className="rounded-2xl bg-white/10 hover:bg-orange-500 transition-all py-3 border border-white/10 text-sm">
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Templates */}
          <div className="mb-8">
            <label className="text-xs uppercase tracking-widest text-slate-400 block mb-2">Plantillas</label>
            <div className="space-y-3">
              {['Cumpleaños', 'Navidad', 'Mamá', 'XV años'].map((item) => (
                <button key={item} className="w-full rounded-2xl bg-white/10 hover:bg-white/20 transition py-3 px-4 text-left border border-white/10">
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button 
              onClick={() => { setSelected(0); fileInputRef.current.click(); }}
              className="w-full rounded-2xl bg-orange-500 hover:bg-orange-600 py-3 font-semibold shadow-lg transition-all hover:scale-[1.02]"
            >
              Subir Fotos
            </button>
            <button className="w-full rounded-2xl bg-white/10 hover:bg-white/20 py-3 transition font-medium">Auto Fill</button>
            <button 
              onClick={() => setPhotos(Array(9).fill(null))}
              className="w-full rounded-2xl border border-red-400/30 text-red-300 hover:bg-red-500/10 py-3 transition font-medium"
            >
              Limpiar Todo
            </button>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-8 text-xs text-slate-400 leading-relaxed">
            <p className="font-semibold text-white mb-2">WWW.TUSFOTOSYA.COM</p>
            <p>Imprime recuerdos familiares desde casa con calidad profesional.</p>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 bg-slate-200 overflow-auto relative flex items-center justify-center p-10">
          {/* Top Toolbar */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl border border-slate-200 px-5 py-3 flex gap-5 z-10">
            {['Zoom', 'Rotate', 'Crop', 'Filters', 'Text'].map((item) => (
              <button key={item} className="text-sm font-medium text-slate-600 hover:text-orange-500 transition">{item}</button>
            ))}
          </div>

          {/* Printable Paper */}
          <div className="bg-white w-[760px] h-[1050px] rounded-md shadow-2xl border border-slate-300 relative overflow-hidden">
            <div className="grid grid-cols-3 gap-5 p-10">
              {photos.map((photo, index) => (
                <div
                  key={index}
                  onClick={() => setSelected(index)}
                  className={`aspect-[4/6] rounded-3xl overflow-hidden relative cursor-pointer transition-all border-2 ${
                    selected === index ? 'border-orange-500 shadow-xl scale-[1.02]' : 'border-slate-200 hover:border-orange-300'
                  }`}
                >
                  {photo ? (
                    <>
                      <img src={photo} alt="foto" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition flex items-center justify-center opacity-0 hover:opacity-100">
                        <button
                          onClick={(e) => { e.stopPropagation(); openUpload(index); }}
                          className="bg-white text-slate-700 px-4 py-2 rounded-xl shadow-lg text-sm font-medium"
                        >
                          Cambiar
                        </button>
                      </div>
                    </>
                  ) : (
                    <div
                      onClick={() => openUpload(index)}
                      className="w-full h-full flex flex-col items-center justify-center bg-slate-50 hover:bg-orange-50 transition-all border-dashed border-2 border-slate-300 hover:border-orange-500"
                    >
                      <div className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-3xl text-slate-400 hover:text-orange-500 transition">+</div>
                      <p className="mt-4 text-sm text-slate-500 font-medium">Agregar Foto</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Branding */}
            <div className="absolute bottom-6 left-0 right-0 text-center text-sm tracking-wide text-slate-400">
              WWW.TUSFOTOSYA.COM
            </div>
          </div>
        </main>

        {/* Right Edit Panel */}
        <aside className="w-96 bg-white border-l border-slate-200 p-6 overflow-y-auto shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Editor</h2>
              <p className="text-sm text-slate-500">Ajustes de fotografía</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              #{selected !== null ? selected + 1 : '-'}
            </div>
          </div>

          {/* Preview */}
          <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 mb-8 flex items-center justify-center">
            {selected !== null && photos[selected] ? (
              <img src={photos[selected]} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-slate-400 text-sm">Selecciona una foto</div>
            )}
          </div>

          {/* Sliders */}
          <div className="space-y-6">
            {['Zoom', 'Rotación', 'Brightness', 'Contrast', 'Saturation'].map((item) => (
              <div key={item}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">{item}</span>
                  <span className="text-sm text-slate-400">100%</span>
                </div>
                <input type="range" className="w-full accent-orange-500" />
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="mt-10">
            <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-4">Filtros</h3>
            <div className="grid grid-cols-2 gap-4">
              {['Natural', 'Warm', 'Cold', 'Vintage', 'Cinema', 'B&W'].map((item) => (
                <button key={item} className="aspect-video rounded-2xl bg-slate-100 hover:bg-orange-50 border border-slate-200 hover:border-orange-500 transition text-sm font-medium text-slate-700">
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="mt-10 space-y-3">
            <button onClick={removePhoto} className="w-full rounded-2xl border border-red-300 text-red-500 hover:bg-red-50 py-3 font-medium transition">
              Eliminar Foto
            </button>
            <button className="w-full rounded-2xl bg-orange-500 hover:bg-orange-600 text-white py-3 font-semibold shadow-lg transition-all hover:scale-[1.02]">
              Aplicar Cambios
            </button>
          </div>
        </aside>
      </div>
      
      {/* 隐藏的文件输入框 */}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={uploadImage} />
    </div>
  );
}

// 渲染到页面
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<TusFotosYaEditor />);