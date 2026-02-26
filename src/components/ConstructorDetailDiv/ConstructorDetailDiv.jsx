import { useState, useRef, useEffect, useCallback } from "react";
import "./ConstructorDetailDiv.css";
import Button from "../Button/Button";
import { useShirtStore } from "../../utils/shirtStore";
import { getColor } from "../../utils/shirtColorStore";

export default function ConstructorDetailDiv({ onCaptureRef }) {
  const [image, setImage] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [previewTransform, setPreviewTransform] = useState({
    scale: 1, rotation: 0, x: 0.3, y: 0.55
  });
  
  const [resetBtnState, setResetBtnState] = useState('normal');
  
  const fileInputRef = useRef(null);
  const previewRef = useRef(null);
  const dragRef = useRef({ active: false, startX: 0, startY: 0, origX: 0, origY: 0 });
  
  const { setCustomImage, decalTransform, setDecalTransform, resetDecalTransform } = useShirtStore();

  useEffect(() => {
    setPreviewTransform({
      scale: decalTransform.scale / 0.3,
      rotation: decalTransform.rotation,
      x: decalTransform.x,
      y: decalTransform.y,
    });
  }, [decalTransform]);

  useEffect(() => {
    return () => {
      if (image?.url && image.url.startsWith('blob:')) {
        URL.revokeObjectURL(image.url);
      }
    };
  }, [image]);

  const handleAddImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Пожалуйста, выберите изображение (PNG, JPG, SVG, WEBP)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Файл слишком большой (макс. 10 МБ)");
      return;
    }

    if (image?.url && image.url.startsWith('blob:')) {
      URL.revokeObjectURL(image.url);
    }

    const reader = new FileReader();
    
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (!dataUrl || typeof dataUrl !== 'string') return;
      
      const imageData = { 
        file, url: dataUrl, name: file.name, size: file.size,
        type: file.type, uploadedAt: Date.now()
      };
      
      setImage(imageData);
      setCustomImage(imageData);
      resetDecalTransform();
    };
    
    reader.onerror = (err) => {
      alert('Не удалось прочитать файл. Попробуйте ещё раз.');
    };
    
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleRemoveImage = () => {
    if (image?.url && image.url.startsWith('blob:')) {
      URL.revokeObjectURL(image.url);
    }
    setImage(null);
    setCustomImage(null);
    resetDecalTransform();
    setIsEditMode(false);
  };

  const handleEditImage = () => {
    if (!image) { handleAddImage(); return; }
    setIsEditMode(prev => !prev);
  };

  const handlePreviewMouseDown = useCallback((e) => {
    if (!isEditMode || !previewRef.current || e.button !== 0) return;
    e.preventDefault();
    
    dragRef.current = {
      active: true,
      startX: e.clientX, startY: e.clientY,
      origX: previewTransform.x, origY: previewTransform.y,
    };
    previewRef.current.style.cursor = 'grabbing';
    
    const onMove = (ev) => {
      if (!dragRef.current.active) return;
      const dx = (ev.clientX - dragRef.current.startX) / 150;
      const dy = (ev.clientY - dragRef.current.startY) / 150;
      const newX = Math.min(0.95, Math.max(0.05, dragRef.current.origX + dx));
      const newY = Math.min(0.95, Math.max(0.05, dragRef.current.origY + dy));
      setPreviewTransform(p => ({ ...p, x: newX, y: newY }));
    };
    
    const onUp = () => {
      if (!dragRef.current.active) return;
      dragRef.current.active = false;
      if (previewRef.current) previewRef.current.style.cursor = 'grab';
      setDecalTransform({ x: previewTransform.x, y: previewTransform.y });
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [isEditMode, previewTransform, setDecalTransform]);

  const handlePreviewWheel = useCallback((e) => {
    if (!isEditMode) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    const newScale = Math.min(2.5, Math.max(0.3, previewTransform.scale + delta));
    setPreviewTransform(p => ({ ...p, scale: newScale }));
    setDecalTransform({ scale: newScale * 0.3 });
  }, [isEditMode, previewTransform.scale, setDecalTransform]);

  const handlePreviewKeyDown = useCallback((e) => {
    if (!isEditMode) return;
    const step = 0.087;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const delta = e.key === 'ArrowRight' ? step : -step;
      const newRot = previewTransform.rotation + delta;
      setPreviewTransform(p => ({ ...p, rotation: newRot }));
      setDecalTransform({ rotation: newRot });
    }
  }, [isEditMode, previewTransform.rotation, setDecalTransform]);

  const handleSaveImage = async () => {
    if (!image) { 
      alert('Сначала добавьте изображение'); 
      return; 
    }

    try {
      let attempts = 0;
      while (!onCaptureRef?.current && attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        attempts++;
      }
      
      if (onCaptureRef?.current) {
        const dataURL = await onCaptureRef.current();
        
        if (dataURL && dataURL.length > 1000) {
          const link = document.createElement('a');
          link.href = dataURL;
          link.download = `shirt-design-${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          throw new Error('Скриншот пустой или слишком маленький');
        }
      } else {
        throw new Error('Не удалось подключиться к 3D-модели');
      }
    } catch (error) {
      alert('Не удалось сохранить: ' + error.message);
    }
  };

  const getResetBtnBackground = () => {
    if (resetBtnState === 'active') return '#C20E4F';
    if (resetBtnState === 'hover') return '#F84479';
    return '#FF0040';
  };

  const getPreviewStyle = () => ({
    transform: `
      translate(${(previewTransform.x - 0.5) * 200}%, ${(previewTransform.y - 0.5) * 200}%)
      rotate(${previewTransform.rotation}rad)
      scale(${previewTransform.scale})
    `,
    transition: isEditMode ? 'none' : 'transform 0.2s ease',
    cursor: isEditMode ? 'grab' : 'default',
    transformOrigin: 'center center',
    maxWidth: '100%', maxHeight: '100%', objectFit: 'contain',
    userSelect: 'none', pointerEvents: isEditMode ? 'auto' : 'none',
  });

  return (
    <div className="constructor-detail-div">
      <input
        type="file" ref={fileInputRef} onChange={handleFileChange}
        accept="image/png,image/jpeg,image/svg+xml,image/webp"
        style={{ display: "none" }} aria-hidden="true"
      />

      <h2>Конструктор</h2>
      
      <Button onClick={handleAddImage} disabled={!!image}>
        <span>Добавить изображение</span>
      </Button>
      
      <h3>Изображение</h3>
      
      <div className="constructor-detail-div__main-button">
        <Button 
          style={{ width: '210px', marginLeft: '0' }}
          onClick={handleEditImage} disabled={!image}
        >
          <span>{isEditMode ? 'Готово' : 'Редактировать'}</span>
        </Button>
        <Button 
          style={{ width: '210px', marginRight: '0' }}
          onClick={handleRemoveImage} disabled={!image}
        >
          <span>Удалить</span>
        </Button>
      </div>
      
      <div 
        className="constructor-detail-div__window"
        ref={previewRef}
        onMouseDown={handlePreviewMouseDown}
        onWheel={handlePreviewWheel}
        onKeyDown={handlePreviewKeyDown}
        tabIndex={isEditMode ? 0 : -1}
        style={{ 
          position: 'relative', overflow: 'hidden',
          borderRadius: '8px', background: '#f9fafb',
        }}
      >
        {image?.url && (
          <img 
            src={image.url} alt={image.name || "Предпросмотр"} 
            className="constructor-detail-div__preview"
            draggable={false} style={getPreviewStyle()}
          />
        )}
      </div>
      
      {isEditMode && image && (
        <div style={{ display: 'flex', position: 'absolute', gap: '8px', marginTop: '-50px',marginLeft: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button onClick={() => {
            const s = Math.min(2.5, previewTransform.scale + 0.1);
            setPreviewTransform(p => ({ ...p, scale: s }));
            setDecalTransform({ scale: s * 0.3 });
          }} style={{ width: '70px', fontSize: '11px', padding: '6px 4px' }}>+ Масштаб</Button>
          <Button onClick={() => {
            const s = Math.max(0.3, previewTransform.scale - 0.1);
            setPreviewTransform(p => ({ ...p, scale: s }));
            setDecalTransform({ scale: s * 0.3 });
          }} style={{ width: '70px', fontSize: '11px', padding: '6px 4px' }}>- Масштаб</Button>
          <Button onClick={() => {
            const r = previewTransform.rotation + 0.087;
            setPreviewTransform(p => ({ ...p, rotation: r }));
            setDecalTransform({ rotation: r });
          }} style={{ width: '70px', fontSize: '11px', padding: '6px 4px' }}>↻ +5°</Button>
          <Button onClick={() => {
            const r = previewTransform.rotation - 0.087;
            setPreviewTransform(p => ({ ...p, rotation: r }));
            setDecalTransform({ rotation: r });
          }} style={{ width: '70px', fontSize: '11px', padding: '6px 4px' }}>↺ -5°</Button>
          <Button 
            onClick={resetDecalTransform} 
            onMouseEnter={() => setResetBtnState('hover')}
            onMouseLeave={() => setResetBtnState('normal')}
            onMouseDown={() => setResetBtnState('active')}
            onMouseUp={() => setResetBtnState('hover')}
            style={{ width: '70px', fontSize: '11px', padding: '6px 4px', background: getResetBtnBackground() }}
          >Сброс
          </Button>
        </div>
      )}
      
      <Button style={{ width: '154px', marginTop: '16px' }} disabled={!image} onClick={handleSaveImage}>
        <span>Сохранить</span>
      </Button>
    </div>
  );
}