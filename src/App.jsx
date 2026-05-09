import { useState, useRef } from 'react';
import Moveable from 'react-moveable';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// 预设尺寸（初始宽高像素值，实际可自由缩放）
const SIZE_OPTIONS = {
  '4x6':   { w: 120, h: 180 },
  '5x7':   { w: 150, h: 210 },
  'Polaroid': { w: 140, h: 170 },
  'Passport': { w: 100, h: 140 },
};

let nextId = 0;

export default function App() {
  const [boxes, setBoxes] = useState([]);          // 画布上的所有相框
  const [selectedId, setSelectedId] = useState(null);
  const moveableRef = useRef(null);
  const canvasRef = useRef(null);

  // 添加一个新相框
  const addBox = (sizeKey) => {
    const { w, h } = SIZE_OPTIONS[sizeKey];
    const newBox = {
      id: ++nextId,
      src: null,
      x: 150 + Math.random() * 200,   // 随机初始位置，避免重叠
      y: 100 + Math.random() * 150,
      width: w,
      height: h,
      rotation: 0,
    };
    setBoxes(prev => [...prev, newBox]);
    setSelectedId(newBox.id);
  };

  // 双击上传图片
  const handleDoubleClick = (id) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setBoxes(prev => prev.map(b => b.id === id ? { ...b, src: url } : b));
      }
    };
    input.click();
  };

  const selectedBox = boxes.find(b => b.id === selectedId);

  // ---- Moveable 回调（拖拽、缩放、旋转时同步 state） ----
  const handleDrag = ({ target, beforeTranslate }) => {
    const [x, y] = beforeTranslate;
    target.style.transform = target.style.transform.replace(
      /translate\([^)]+\)/,
      `translate(${x}px, ${y}px)`
    );
    setBoxes(prev => prev.map(b =>
      b.id === selectedId ? { ...b, x, y } : b
    ));
  };

  const handleResize = ({ target, width, height, drag }) => {
    target.style.width = `${width}px`;
    target.style.height = `${height}px`;
    if (drag.beforeTranslate) {
      target.style.transform = target.style.transform.replace(
        /translate\([^)]+\)/,
        `translate(${drag.beforeTranslate[0]}px, ${drag.beforeTranslate[1]}px)`
      );
    }
    setBoxes(prev => prev.map(b =>
      b.id === selectedId ? {
        ...b,
        width,
        height,
        x: drag.beforeTranslate ? drag.beforeTranslate[0] : b.x,
        y: drag.beforeTranslate ? drag.beforeTranslate[1] : b.y,
      } : b
    ));
  };

  const handleRotate = ({ target, beforeRotate }) => {
    target.style.transform = target.style.transform.replace(
      /rotate\([^)]+\)/,
      `rotate(${beforeRotate}deg)`
    );
    setBoxes(prev => prev.map(b =>
      b.id === selectedId ? { ...b, rotation: beforeRotate } : b
    ));
  };

  // 导出 PDF
  const downloadPDF = async () => {
    if (!canvasRef.current) return;
    const canvas = await html2canvas(canvasRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('tus-fotos-ya.pdf');
  };

  // 滑块旋转
  const updateRotation = (deg) => {
    if (!selectedId) return;
    setBoxes(prev => prev.map(b =>
      b.id === selectedId ? { ...b, rotation: Number(deg) } : b
    ));
    const el = document.querySelector(`[data-box-id="${selectedId}"]`);
    if (el) {
      el.style.transform = el.style.transform.replace(
        /rotate\([^)]+\)/,
        `rotate(${deg}deg)`
      );
    }
  };

  return (
    <div className="h-screen bg-slate-100 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-md">T</div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">TusFotosYa</h1>
            <p className="text-xs text-slate-500">Editor Profesional de Impresión</p>
          </div>
        </div>
        <button
          onClick={downloadPDF}
          className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg transition-all hover:scale-105"
        >
          Descargar PDF
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Panel izquierdo */}
        <aside className="w-80 bg-[#08213D] text-white flex flex-col p-5 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-6">Agregar Fotograma</h2>
          <div className="grid grid-cols-2 gap-3 mb-8">
            {Object.keys(SIZE_OPTIONS).map(size => (
              <button
                key={size}
                onClick={() => addBox(size)}
                className="rounded-xl bg-white/10 hover:bg-orange-500 transition-all py-3 text-sm font-medium border border-white/10 hover:border-orange-400"
              >
                {size}
              </button>
            ))}
          </div>
          <button
            onClick={() => setBoxes([])}
            className="w-full rounded-2xl border border-red-400/30 text-red-300 hover:bg-red-500/10 py-3 font-medium transition"
          >
            Limpiar Todo
          </button>
          <div className="mt-auto pt-8 text-xs text-slate-400 leading-relaxed">
            <p className="mb-2 font-semibold text-white">TusFotosYa.com</p>
            <p>Imprime tus recuerdos en casa de forma rápida, fácil y profesional.</p>
          </div>
        </aside>

        {/* Área de lienzo */}
        <main className="flex-1 bg-slate-200 overflow-auto relative flex items-center justify-center p-10">
          <div
            ref={canvasRef}
            className="bg-white w-[800px] h-[1000px] rounded-md shadow-2xl relative border border-slate-300"
            style={{ background: 'white' }}
          >
            {boxes.map(box => (
              <div
                key={box.id}
                data-box-id={box.id}
                onDoubleClick={() => handleDoubleClick(box.id)}
                onClick={() => setSelectedId(box.id)}
                className={`absolute cursor-move border-2 border-dashed ${
                  selectedId === box.id ? 'border-orange-500' : 'border-slate-300'
                }`}
                style={{
                  width: box.width,
                  height: box.height,
                  transform: `translate(${box.x}px, ${box.y}px) rotate(${box.rotation}deg)`,
                  transformOrigin: '0 0',
                  overflow: 'hidden',
                }}
              >
                {box.src ? (
                  <img
                    src={box.src}
                    alt="foto"
                    className="w-full h-full object-cover pointer-events-none"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-xs text-center select-none">
                    Doble clic<br />para añadir foto
                  </div>
                )}
              </div>
            ))}

            {selectedId && (
              <Moveable
                ref={moveableRef}
                target={document.querySelector(`[data-box-id="${selectedId}"]`)}
                draggable={true}
                resizable={true}
                rotatable={true}
                keepRatio={true}
                throttleDrag={1}
                throttleResize={1}
                throttleRotate={1}
                onDrag={handleDrag}
                onResize={handleResize}
                onRotate={handleRotate}
              />
            )}
          </div>
        </main>

        {/* Panel derecho */}
        <aside className="w-96 bg-white border-l border-slate-200 p-6 overflow-y-auto shadow-2xl">
          {selectedBox ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-slate-800">Editar Fotograma</h2>
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  #{selectedBox.id}
                </div>
              </div>

              <div className="aspect-[4/5] rounded-3xl bg-slate-100 mb-8 overflow-hidden border border-slate-200 flex items-center justify-center">
                {selectedBox.src ? (
                  <img
                    src={selectedBox.src}
                    className="w-full h-full object-cover"
                    style={{ transform: `rotate(${selectedBox.rotation}deg)` }}
                    alt="preview"
                  />
                ) : (
                  <span className="text-slate-400">Sin imagen</span>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Rotación</span>
                    <span className="text-sm text-slate-400">{Math.round(selectedBox.rotation)}°</span>
                  </div>
                  <input
                    type="range"
                    min={-180}
                    max={180}
                    value={selectedBox.rotation}
                    onChange={(e) => updateRotation(e.target.value)}
                    className="w-full accent-orange-500"
                  />
                </div>
              </div>

              <div className="mt-10">
                <button
                  onClick={() => setSelectedId(null)}
                  className="w-full rounded-2xl border border-slate-300 py-3 font-medium hover:bg-slate-100 transition"
                >
                  Cerrar
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <p className="text-lg">Selecciona un fotograma</p>
              <p className="text-sm">en el lienzo para editarlo</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}