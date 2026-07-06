import React, { useState, useEffect, useRef } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  ArrowLeft,
  ArrowRight,
  Compass,
  MapPin
} from 'lucide-react';
import { SparklesText } from './SparklesText';
import './VirtualTour.css';

interface Hotspot {
  id: string;
  name: string;
  desc: string;
  x: number; // percentage from left
  y: number; // percentage from top
  targetRoomId: string;
  previewImg: string;
}

interface Room {
  id: string;
  name: string;
  desc: string;
  img: string;
  hotspots: Hotspot[];
}

const ROOMS: Room[] = [
  {
    id: 'waiting',
    name: 'Reception & Waiting Area',
    desc: 'Unwind on our luxury plush velvet chairs, enjoy custom refreshments, and browse our portfolio in our modern emerald-green waiting lobby.',
    img: '/salon_green_theme_1.jpg',
    hotspots: [
      {
        id: 'w-styling',
        name: 'Styling Stations',
        desc: 'Step into our main styling hall with premium LED mirrors and gold accents.',
        x: 40,
        y: 52,
        targetRoomId: 'styling',
        previewImg: '/salon_green_theme_2.jpg'
      },
      {
        id: 'w-makeup',
        name: 'Makeup Suite',
        desc: 'Explore our private vanity lighting room for makeup and saree draping.',
        x: 75,
        y: 48,
        targetRoomId: 'makeup',
        previewImg: '/salon_green_theme_3.jpg'
      }
    ]
  },
  {
    id: 'styling',
    name: 'Luxury Styling Stations',
    desc: 'Equipped with custom ergonomic seating, high-clarity illuminated halo mirrors, and premium styling tools managed by our master artists.',
    img: '/salon_green_theme_2.jpg',
    hotspots: [
      {
        id: 's-waiting',
        name: 'Reception Desk',
        desc: 'Head back to our cozy reception and booking lobby area.',
        x: 18,
        y: 54,
        targetRoomId: 'waiting',
        previewImg: '/salon_green_theme_1.jpg'
      },
      {
        id: 's-spa',
        name: 'Spa & Wellness Room',
        desc: 'Enter our quiet sanctuary for facials, nail extensions, and hair spas.',
        x: 82,
        y: 46,
        targetRoomId: 'spa',
        previewImg: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&q=80'
      }
    ]
  },
  {
    id: 'makeup',
    name: 'Bridal & Makeup Room',
    desc: 'Featuring specialized shadowless daylight vanity bulbs, private dressing cabins, and professional cosmetics for our brides.',
    img: '/salon_green_theme_3.jpg',
    hotspots: [
      {
        id: 'm-waiting',
        name: 'Waiting Lobby',
        desc: 'Return to our welcoming front lobby desk.',
        x: 25,
        y: 52,
        targetRoomId: 'waiting',
        previewImg: '/salon_green_theme_1.jpg'
      },
      {
        id: 'm-styling',
        name: 'Styling Arena',
        desc: 'Go to the hair cutting, coloring, and treatment chairs.',
        x: 62,
        y: 48,
        targetRoomId: 'styling',
        previewImg: '/salon_green_theme_2.jpg'
      }
    ]
  },
  {
    id: 'spa',
    name: 'Tranquil Spa & Nails Suite',
    desc: 'A calming zen environment with soft music, heated massage therapy beds, custom pedicure sinks, and premium organic nail treatment stations.',
    img: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=1600&q=80',
    hotspots: [
      {
        id: 'sp-styling',
        name: 'Styling Hub',
        desc: 'Return to our main hair styling and coloring area.',
        x: 15,
        y: 50,
        targetRoomId: 'styling',
        previewImg: '/salon_green_theme_2.jpg'
      },
      {
        id: 'sp-waiting',
        name: 'Front Lobby',
        desc: 'Return to our welcoming front lobby desk.',
        x: 48,
        y: 52,
        targetRoomId: 'waiting',
        previewImg: '/salon_green_theme_1.jpg'
      }
    ]
  }
];

export default function VirtualTour() {
  const [activeRoomId, setActiveRoomId] = useState('waiting');
  const [isAutoPan, setIsAutoPan] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1.1); // 1.0 to 1.3
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);

  const activeRoom = ROOMS.find(r => r.id === activeRoomId) || ROOMS[0];

  const viewportRef = useRef<HTMLDivElement>(null);
  const panoramaRef = useRef<HTMLDivElement>(null);

  // Dragging and translation states
  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    currentX: -200, // Initial panning translation (offset)
    targetX: -200,
    panDirection: -0.2, // Auto-pan speed & direction
    lastTime: 0
  });

  const [panOffset, setPanOffset] = useState(-200);

  // Handle Dragging
  const handleStart = (clientX: number) => {
    dragRef.current.isDragging = true;
    dragRef.current.startX = clientX - dragRef.current.currentX;
    setIsAutoPan(false);
  };

  const handleMove = (clientX: number) => {
    if (!dragRef.current.isDragging) return;

    const viewport = viewportRef.current;
    const panorama = panoramaRef.current;
    if (!viewport || !panorama) return;

    const maxScroll = panorama.offsetWidth - viewport.offsetWidth;
    let newX = clientX - dragRef.current.startX;

    // Boundary constraints
    if (newX > 0) newX = 0;
    if (newX < -maxScroll) newX = -maxScroll;

    dragRef.current.targetX = newX;
  };

  const handleEnd = () => {
    dragRef.current.isDragging = false;
  };

  // Mouse & Touch events
  const onMouseDown = (e: React.MouseEvent) => handleStart(e.clientX);
  const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const onMouseUp = () => handleEnd();

  const onTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);
  const onTouchEnd = () => handleEnd();

  // Animation Loop (Lerp translation & Auto-panning)
  useEffect(() => {
    let animId: number;

    const animate = () => {
      const viewport = viewportRef.current;
      const panorama = panoramaRef.current;
      if (!viewport || !panorama) {
        animId = requestAnimationFrame(animate);
        return;
      }

      const maxScroll = panorama.offsetWidth - viewport.offsetWidth;

      // Auto Pan logic
      if (isAutoPan && !dragRef.current.isDragging) {
        let nextX = dragRef.current.targetX + dragRef.current.panDirection;

        // Bounce back at boundaries
        if (nextX > 0) {
          nextX = 0;
          dragRef.current.panDirection = -0.25;
        } else if (nextX < -maxScroll) {
          nextX = -maxScroll;
          dragRef.current.panDirection = 0.25;
        }

        dragRef.current.targetX = nextX;
      }

      // Lerp smoothing (linear interpolation)
      const diff = dragRef.current.targetX - dragRef.current.currentX;
      dragRef.current.currentX += diff * 0.1; // damping factor

      // Update offsets
      setPanOffset(dragRef.current.currentX);

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isAutoPan]);

  // Adjust bounds on window resize
  useEffect(() => {
    const handleResize = () => {
      const viewport = viewportRef.current;
      const panorama = panoramaRef.current;
      if (!viewport || !panorama) return;

      const maxScroll = panorama.offsetWidth - viewport.offsetWidth;
      if (dragRef.current.targetX < -maxScroll) {
        dragRef.current.targetX = -maxScroll;
        dragRef.current.currentX = -maxScroll;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Zoom helpers
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 1.3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 1.0));

  // Manual panning arrows
  const handlePanManual = (direction: 'left' | 'right') => {
    setIsAutoPan(false);
    const step = 200;
    const viewport = viewportRef.current;
    const panorama = panoramaRef.current;
    if (!viewport || !panorama) return;

    const maxScroll = panorama.offsetWidth - viewport.offsetWidth;
    let nextX = dragRef.current.targetX + (direction === 'left' ? step : -step);

    if (nextX > 0) nextX = 0;
    if (nextX < -maxScroll) nextX = -maxScroll;

    dragRef.current.targetX = nextX;
  };

  // Switch Active Room
  const handleExploreRoom = (roomId: string) => {
    setActiveRoomId(roomId);
    setActiveHotspotId(null);
    // Center the view on room load
    setTimeout(() => {
      const viewport = viewportRef.current;
      const panorama = panoramaRef.current;
      if (!viewport || !panorama) return;
      const centerOffset = -(panorama.offsetWidth - viewport.offsetWidth) / 2;
      dragRef.current.targetX = centerOffset;
      dragRef.current.currentX = centerOffset;
    }, 100);
  };

  return (
    <section className="virtual-tour-section" aria-label="360 Virtual Tour">
      <div className="container">
        <div className="section__header section__header--center reveal">
          <div className="section-label" style={{ color: 'var(--color-champagne)' }}>Immersive Experience</div>
          <h2 className="section-title">
            <SparklesText>360° Virtual Tour</SparklesText>
          </h2>
          <p className="section-subtitle mx-auto">
            Step inside ZHA Hair Saloon. Click-and-drag or swipe to explore our bespoke waiting lobby, styling hall, makeup rooms, and spa suite.
          </p>
        </div>

        {/* Room Tab Selector */}
        <div className="tour-tabs">
          {ROOMS.map(room => (
            <button
              key={room.id}
              className={`tour-tab-btn ${activeRoomId === room.id ? 'tour-tab-btn--active' : ''}`}
              onClick={() => handleExploreRoom(room.id)}
            >
              {room.name}
            </button>
          ))}
        </div>

        {/* Interactive Viewport */}
        <div className="tour-card">
          <div
            ref={viewportRef}
            className="tour-viewport"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{ cursor: dragRef.current.isDragging ? 'grabbing' : 'grab' }}
          >
            {/* Wide Panorama Wrapper */}
            <div
              ref={panoramaRef}
              className="tour-panorama"
              style={{
                transform: `translateX(${panOffset}px) scale(${zoomLevel})`,
                backgroundImage: `url('${activeRoom.img}')`
              }}
            >
              {/* Hotspot Markers */}
              {activeRoom.hotspots.map(hotspot => (
                <div
                  key={hotspot.id}
                  className="tour-hotspot"
                  style={{
                    left: `${hotspot.x}%`,
                    top: `${hotspot.y}%`,
                    transform: `translate(-50%, -50%) scale(${1 / zoomLevel})` // maintain scale
                  }}
                  onMouseEnter={() => {
                    setIsAutoPan(false);
                    setActiveHotspotId(hotspot.id);
                  }}
                  onMouseLeave={() => setActiveHotspotId(null)}
                >
                  {/* Pulse indicator */}
                  <div className="tour-hotspot__pin">
                    <Compass size={18} />
                    <span className="tour-hotspot__pulse" />
                  </div>

                  {/* Hover tooltip card */}
                  <div className={`tour-hotspot-card ${activeHotspotId === hotspot.id ? 'tour-hotspot-card--active' : ''}`}>
                    <img className="tour-hotspot-card__img" src={hotspot.previewImg} alt={hotspot.name} />
                    <div className="tour-hotspot-card__body">
                      <h4 className="tour-hotspot-card__title">{hotspot.name}</h4>
                      <p className="tour-hotspot-card__desc">{hotspot.desc}</p>
                      <button
                        type="button"
                        className="tour-hotspot-card__btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExploreRoom(hotspot.targetRoomId);
                        }}
                      >
                        Enter Area
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Panning Instruction Overlay */}
            <div className="tour-overlay-hint">
              <Compass className="tour-overlay-hint__icon" />
              <span>Drag to Rotate 360°</span>
            </div>

            {/* Controls HUD */}
            <div className="tour-controls">
              <div className="tour-controls__group">
                <button
                  type="button"
                  className="tour-control-btn"
                  onClick={() => handlePanManual('left')}
                  title="Pan Left"
                  aria-label="Pan Left"
                >
                  <ArrowLeft size={16} />
                </button>
                <button
                  type="button"
                  className="tour-control-btn"
                  onClick={() => setIsAutoPan(!isAutoPan)}
                  title={isAutoPan ? 'Pause Auto-Pan' : 'Play Auto-Pan'}
                  aria-label={isAutoPan ? 'Pause Auto-Pan' : 'Play Auto-Pan'}
                >
                  {isAutoPan ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <button
                  type="button"
                  className="tour-control-btn"
                  onClick={() => handlePanManual('right')}
                  title="Pan Right"
                  aria-label="Pan Right"
                >
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="tour-controls__group">
                <button
                  type="button"
                  className="tour-control-btn"
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 1.0}
                  title="Zoom Out"
                  aria-label="Zoom Out"
                >
                  <ZoomOut size={16} />
                </button>
                <span className="tour-zoom-indicator">{zoomLevel.toFixed(1)}x</span>
                <button
                  type="button"
                  className="tour-control-btn"
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 1.3}
                  title="Zoom In"
                  aria-label="Zoom In"
                >
                  <ZoomIn size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Description HUD */}
          <div className="tour-info-panel">
            <h3 className="tour-info-panel__title">
              <MapPin size={18} /> {activeRoom.name}
            </h3>
            <p className="tour-info-panel__desc">{activeRoom.desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
