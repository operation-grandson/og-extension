import React, { useRef, useCallback } from 'react';

const Slider = ({ value, onChange, min = -50, max = 50, label, leftLabel, rightLabel }) => {
  const sliderRef = useRef(null);
  const isDragging = useRef(false);

  const updateValue = useCallback((clientX) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const clampedX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const percentage = clampedX / rect.width;
    const newValue = Math.round(min + (percentage * (max - min)));
    onChange(newValue);
  }, [min, max, onChange]);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    updateValue(e.clientX);
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    updateValue(e.clientX);
  }, [updateValue]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleTouchStart = (e) => {
    isDragging.current = true;
    const touch = e.touches[0];
    updateValue(touch.clientX);
    e.preventDefault();
  };

  const handleTouchMove = useCallback((e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const touch = e.touches[0];
    updateValue(touch.clientX);
  }, [updateValue]);

  const handleTouchEnd = useCallback((e) => {
    isDragging.current = false;
    e.preventDefault();
  }, []);

  React.useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="slider-container">
      <div className="slider-label">{label}</div>
      <div className="slider-track">
        <div className="slider-end">{leftLabel}</div>
        <div
          className="slider"
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div
            className="slider-thumb"
            style={{ left: `${percentage}%` }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          />
        </div>
        <div className="slider-end">{rightLabel}</div>
      </div>
    </div>
  );
};

export default Slider;