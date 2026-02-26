// src/components/ShirtDiv.jsx
import { useState } from "react";
import "./ShirtDiv.css";
import ShirtBl from "../ShirtBlock.jsx";
import ShirtModel from "../ShirtModel.jsx";
import Button from "../Button/Button.jsx";
import Plus from "../../assets/Plus.svg";
import Minus from "../../assets/Minus.svg";
import Cancel from "../../assets/Cancel.svg";

const DEFAULT_SCALE = 2.5;
const SCALE_STEP = 0.5;
const MIN_SCALE = 1;
const MAX_SCALE = 5;
export default function ShirtDiv({ onCaptureRef }) {
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(DEFAULT_SCALE);

  const handleRotationChange = (e) => {
    setRotation(Number(e.target.value));
  };

  const handlePlus = () => {
    setScale((prev) => Math.min(prev + SCALE_STEP, MAX_SCALE));
  };

  const handleMinus = () => {
    setScale((prev) => Math.max(prev - SCALE_STEP, MIN_SCALE));
  };

  const handleCancel = () => {
    setScale(DEFAULT_SCALE);
  };

  return (
    <div className="shirt-div">
      <div className="shirt-div__wrapper">
        <div className="shirt-div__svg">
          <ShirtBl />
        </div>
        
        <div className="shirt-div__3d">
          <ShirtModel 
            rotation={rotation} 
            scale={scale} 
            onCaptureRef={onCaptureRef} 
          />
        </div>

        <div className="shirt-div__slider-wrapper">
          <input
            type="range"
            min="0"
            max="360"
            step="1"
            value={rotation}
            onChange={handleRotationChange}
            className="shirt-div__slider"
            aria-label="Вращение модели"
          />
        </div>

        <div className="shirt-div__buttons">
          <Button 
            onClick={handlePlus}
            style={{ borderRadius: '10px', padding: '11px 11px 9px 11px' }}
            aria-label="Увеличить"
            title="Увеличить"
          >
            <img src={Plus} alt="+" />
          </Button>
          <Button 
            onClick={handleMinus}
            style={{ borderRadius: '10px', padding: '11px 11px 9px 11px' }}
            aria-label="Уменьшить"
            title="Уменьшить"
          >
            <img src={Minus} alt="-" />
          </Button>
          <Button 
            onClick={handleCancel}
            style={{ borderRadius: '10px', padding: '11px 11px 9px 11px' }}
            aria-label="Сбросить размер"
            title="Сбросить"
          >
            <img src={Cancel} alt="×" />
          </Button>
        </div>
      </div>
    </div>
  );
}