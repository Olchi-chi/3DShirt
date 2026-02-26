import { create } from 'zustand';

export const useShirtStore = create((set) => ({
  customImage: null,
  
  decalTransform: {
    scale: 0.3,
    rotation: 0,
    x: 0.3,
    y: 0.55,
  },
  
  setCustomImage: (image) => set({ customImage: image }),
  resetCustomImage: () => set({ customImage: null }),
  
  setDecalTransform: (transform) => set((state) => {
    const newTransform = { ...state.decalTransform, ...transform };
    return {
      decalTransform: {
        scale: Math.min(1.0, Math.max(0.1, newTransform.scale)),
        rotation: newTransform.rotation,
        x: Math.min(0.95, Math.max(0.05, newTransform.x)),
        y: Math.min(0.95, Math.max(0.05, newTransform.y)),
      },
    };
  }),
  
  resetDecalTransform: () => set({ 
    decalTransform: { scale: 0.3, rotation: 0, x: 0.3, y: 0.55 } 
  }),
}));