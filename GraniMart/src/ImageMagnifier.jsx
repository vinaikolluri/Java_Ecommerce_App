import React, { useState } from 'react';

const ImageMagnifier = ({ src, alt, magnifierSize = 150, zoomLevel = 2 }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e) => {
    const elem = e.currentTarget;
    const { width, height } = elem.getBoundingClientRect();
    setPosition({ x: 0, y: 0 });
    setCursorPosition({ x: 0, y: 0 });
    setShowMagnifier(true);
  };

  const handleMouseMove = (e) => {
    const elem = e.currentTarget;
    const { top, left, width, height } = elem.getBoundingClientRect();
    const x = e.pageX - left - window.pageXOffset;
    const y = e.pageY - top - window.pageYOffset;
    setPosition({ x, y });
    setCursorPosition({ x: x / width, y: y / height });
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  return (
    <div
      style={{
        position: 'relative',
        height: '100%',
        width: '100%',
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{ height: '100%', width: '100%', objectFit: 'contain' }}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      {showMagnifier && (
        <div
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            height: `${magnifierSize}px`,
            width: `${magnifierSize}px`,
            top: `${position.y - magnifierSize / 2}px`,
            left: `${position.x - magnifierSize / 2}px`,
            opacity: 1,
            border: '1px solid lightgray',
            backgroundColor: 'white',
            backgroundImage: `url('${src}')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${100 * zoomLevel}% ${100 * zoomLevel}%`,
            backgroundPosition: `${-cursorPosition.x * 100 * (zoomLevel - 1)}% ${
              -cursorPosition.y * 100 * (zoomLevel - 1)
            }%`,
            borderRadius: '50%',
            boxShadow: '0 0 10px rgba(0,0,0,0.3)',
          }}
        />
      )}
    </div>
  );
};

export default ImageMagnifier;