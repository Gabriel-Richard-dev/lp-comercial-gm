import { useEffect, useRef } from "react";
import { createMapScene } from "./createScene";
import "./map.css";

export default function MapView({ mode = "2d", filter = null, onSelect }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const apiRef = useRef(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const api = createMapScene(canvas, wrap, {
      onSelect: (box) => onSelectRef.current?.(box),
    });
    apiRef.current = api;
    return () => {
      api.dispose();
      apiRef.current = null;
    };
  }, []);

  useEffect(() => {
    apiRef.current?.setMode(mode);
  }, [mode]);

  useEffect(() => {
    apiRef.current?.setFilter(filter);
  }, [filter]);

  return (
    <div ref={wrapRef} className="map-view">
      <canvas ref={canvasRef} />
    </div>
  );
}
