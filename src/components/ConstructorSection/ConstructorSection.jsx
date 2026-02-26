// src/components/ConstructorSection/ConstructorSection.jsx
import { useRef } from "react";
import ColorChooseDiv from "../ColorChooseDiv/ColorChooseDiv";
import ShirtDiv from "../ShirtDiv/ShirtDiv";
import ConstructorDetailDiv from "../ConstructorDetailDiv/ConstructorDetailDiv";
import "./ConstructorSection.css";

export default function ConstructorSection() {
  const captureRef = useRef(null);

  return (
    <section className="constructor" id="constructor">
      <ColorChooseDiv />
      <ShirtDiv onCaptureRef={captureRef} />
      <ConstructorDetailDiv onCaptureRef={captureRef} />
    </section>
  );
}