import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, Center, useProgress } from "@react-three/drei";
import { useEffect, useState, useRef, Suspense, useCallback } from "react";
import * as THREE from 'three';
import { getColor, subscribe } from "../utils/shirtColorStore";
import { useShirtStore } from "../utils/shirtStore";
import shirtModel from "../assets/shirt.glb?url";

function ShirtScene({ color, textureUrl, rotationY, scale, onCaptureRef }) {
  const groupRef = useRef();
  const { scene } = useGLTF(shirtModel);
  const [decalTexture, setDecalTexture] = useState(null);
  
  const { decalTransform } = useShirtStore();
  const { gl, camera } = useThree();
  
  const colorRef = useRef(color);
  const decalTextureRef = useRef(decalTexture);
  const sceneRef = useRef(scene);
  const decalTransformRef = useRef(decalTransform);

  useEffect(() => { colorRef.current = color; }, [color]);
  useEffect(() => { decalTextureRef.current = decalTexture; }, [decalTexture]);
  useEffect(() => { sceneRef.current = scene; }, [scene]);
  useEffect(() => { decalTransformRef.current = decalTransform; }, [decalTransform]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        rotationY * (Math.PI / 180),
        delta * 5
      );
      groupRef.current.scale.lerp({ x: scale, y: scale, z: scale }, 0.1);
    }
  });

  useEffect(() => {
    if (!textureUrl) { setDecalTexture(null); return; }
    const loader = new THREE.TextureLoader();
    let cancelled = false;
    loader.load(
      textureUrl,
      (texture) => {
        if (cancelled) return;
        if (THREE.SRGBColorSpace) texture.colorSpace = THREE.SRGBColorSpace;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        texture.flipY = false;
        texture.needsUpdate = true;
        setDecalTexture(texture);
      },
      undefined,
      (error) => {
        if (cancelled) return;
        setDecalTexture(null);
      }
    );
    return () => { cancelled = true; };
  }, [textureUrl]);

  const createCompositeTexture = useCallback((currentColor, currentDecalTexture, config) => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = currentColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (currentDecalTexture?.image) {
      const { x: uvX, y: uvY, scale: uvScale, rotation: uvRotation } = config;
      const img = currentDecalTexture.image;
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      const scaledWidth = canvasWidth * uvScale;
      const scaledHeight = (img.height / img.width) * scaledWidth;
      const centerX = canvasWidth * uvX;
      const centerY = canvasHeight * uvY;
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(uvRotation);
      ctx.scale(1, 1);
      
      ctx.drawImage(img, -scaledWidth/2, -scaledHeight/2, scaledWidth, scaledHeight);
      ctx.restore();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    if (THREE.SRGBColorSpace) texture.colorSpace = THREE.SRGBColorSpace;
    texture.flipY = true;
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    
    return texture;
  }, []);

  useEffect(() => {
    if (!scene) return;
    const config = decalTransform || { scale: 0.3, rotation: 0, x: 0.3, y: 0.55 };
    const compositeTexture = createCompositeTexture(color, decalTexture, config);
    
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((mat) => {
          if (mat.color) mat.color.set(0xffffff);
          mat.map = compositeTexture;
          mat.envMap = null;
          mat.envMapIntensity = 0;
          mat.metalness = 0;
          mat.roughness = 1;
          mat.transparent = false;
          mat.opacity = 1;
          mat.needsUpdate = true;
        });
      }
    });
  }, [scene, color, decalTexture, decalTransform, createCompositeTexture]);

  const captureScreenshot = useCallback(() => {
    return new Promise((resolve) => {
      const currentColor = colorRef.current;
      const currentDecalTexture = decalTextureRef.current;
      const currentScene = sceneRef.current;
      const currentConfig = decalTransformRef.current || { scale: 0.3, rotation: 0, x: 0.3, y: 0.55 };
      
      if (!currentScene) {
        resolve(null);
        return;
      }
      
      const originalRotation = groupRef.current?.rotation.y || 0;
      const originalScale = groupRef.current?.scale.clone() || new THREE.Vector3(1, 1, 1);
      const originalCamPos = camera.position.clone();
      
      const freshTexture = createCompositeTexture(currentColor, currentDecalTexture, currentConfig);
      
      currentScene.traverse((child) => {
        if (child.isMesh && child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((mat) => {
            if (mat.color) mat.color.set(0xffffff);
            mat.map = freshTexture;
            mat.envMap = null;
            mat.envMapIntensity = 0;
            mat.metalness = 0;
            mat.roughness = 1;
            mat.transparent = false;
            mat.opacity = 1;
            mat.needsUpdate = true;
          });
        }
      });
      
      if (groupRef.current) {
        groupRef.current.rotation.y = 0;
        groupRef.current.scale.set(scale, scale, scale);
      }
      camera.position.set(0, 0, 4);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      
      requestAnimationFrame(() => {
        gl.render(currentScene, camera);
        
        setTimeout(() => {
          try {
            const dataURL = gl.domElement.toDataURL('image/png');
            resolve(dataURL);
          } catch (e) {
            resolve(null);
          }
          
          requestAnimationFrame(() => {
            if (groupRef.current) {
              groupRef.current.rotation.y = originalRotation;
              groupRef.current.scale.copy(originalScale);
            }
            camera.position.copy(originalCamPos);
            camera.lookAt(0, 0, 0);
            camera.updateProjectionMatrix();
          });
        }, 200);
      });
    });
  }, [gl, camera, scale, createCompositeTexture]);

  useEffect(() => {
    if (onCaptureRef) {
      onCaptureRef.current = captureScreenshot;
    }
    return () => { 
      if (onCaptureRef) onCaptureRef.current = null;
    };
  }, [onCaptureRef, captureScreenshot]);

  if (!scene) return null;

  return (
    <group ref={groupRef}>
      <primitive object={scene} position={[0, -1.3, 0]} />
    </group>
  );
}

function Model3D({ color, rotationY, scale, onCaptureRef }) {
  const { customImage } = useShirtStore();
  const textureUrl = customImage?.url || null;

  return (
    <ShirtScene 
      color={color} 
      textureUrl={textureUrl}
      rotationY={rotationY}
      scale={scale}
      onCaptureRef={onCaptureRef}
    />
  );
}

useGLTF.preload(shirtModel);

function LoaderWithProgress() {
  const { progress, active } = useProgress();
  if (!active) return null;
  return (
    <div className="shirt-model__loader">
      <div className="shirt-model__loader-spinner"></div>
      <p className="shirt-model__loader-text">Загрузка: {Math.round(progress)}%</p>
    </div>
  );
}

function Fallback3D({ error, resetErrorBoundary }) {
  return (
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#dc2626', padding: '16px', textAlign: 'center', background: '#fef2f2', borderRadius: '8px', zIndex: 10, maxWidth: '300px' }}>
      <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>⚠️ Ошибка 3D</p>
      <p style={{ fontSize: '12px', opacity: 0.8, margin: '0 0 12px 0' }}>{error?.message || 'Неизвестная ошибка'}</p>
      <button onClick={resetErrorBoundary} style={{ padding: '6px 12px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>Повторить</button>
    </div>
  );
}

export default function ShirtModel({ rotation = 0, scale = 2.5, onCaptureRef }) {
  const [color, setColor] = useState(getColor());
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const unsubscribe = subscribe(setColor);
    return () => unsubscribe();
  }, []);

  const handleCanvasError = (error) => {
    setHasError(true);
    setErrorMessage(error?.message || 'Ошибка загрузки 3D');
  };

  const handleResetError = () => {
    setHasError(false);
    setErrorMessage('');
  };

  return (
    <div style={{ width: "100%", height: "90.275%", position: "relative" }}>
      {hasError && <Fallback3D error={{ message: errorMessage }} resetErrorBoundary={handleResetError} />}
      
      <Canvas 
        camera={{ position: [0, 0, 4], fov: 45 }}
        onCreated={({ gl }) => {
          gl.setPixelRatio(window.devicePixelRatio);
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
          });
        }}
        onError={handleCanvasError}
        dpr={[1, 2]}
        gl={{ preserveDrawingBuffer: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <Environment preset="city" />
        <Center>
          <Suspense fallback={null}>
            <Model3D 
              color={color} 
              rotationY={rotation} 
              scale={scale} 
              onCaptureRef={onCaptureRef}
            />
          </Suspense>
        </Center>
      </Canvas>
      <LoaderWithProgress />
    </div>
  );
}