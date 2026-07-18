import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Sparkles, Scissors, Palette, Crown, Droplet, Edit, Wind, Check, 
  Loader2, RefreshCw, ArrowRight, Download, Share2, Maximize2, Minimize2, 
  ZoomIn, ZoomOut, Info, AlertTriangle, X
} from 'lucide-react';
import { 
  TRANSFORMATION_LOOKS, 
  analyzeUploadedImage, 
  saveTryOn, 
  type TransformationLook 
} from '../services/tryon';

interface Toast {
  type: 'success' | 'error';
  message: string;
}

export default function VirtualTryOn() {
  // Try-On State Machine
  // 'upload' -> 'analysis' -> 'select_look' -> 'generate' -> 'result'
  const [step, setStep] = useState<'upload' | 'analysis' | 'select_look' | 'generate' | 'result'>('upload');
  
  // Image States
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedPreview, setGeneratedPreview] = useState<string | null>(null);
  const [selectedLook, setSelectedLook] = useState<TransformationLook>(TRANSFORMATION_LOOKS[0]);
  
  // Validation / Analysis States
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [faceShape, setFaceShape] = useState<string>('Oval');
  const [skinTone, setSkinTone] = useState<string>('Warm Sand');
  
  // Analysis Step Progression
  const [analysisStep, setAnalysisStep] = useState(0);
  const analysisLabels = [
    'Analyzing Face Symmetry...',
    'Detecting Hair Boundaries...',
    'Analyzing Skin Tone Profile...',
    'Determining Facial Structure...',
    'Configuring Neural Aesthetics...'
  ];

  // Generation Step Progression
  const [genProgress, setGenProgress] = useState(0);
  const [genStepLabel, setGenStepLabel] = useState('Initializing AI Model...');

  // Result Options
  const [sliderPos, setSliderPos] = useState(50);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Booking Dialog State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Demo Simulation Toggles
  const [demoSimState, setDemoSimState] = useState<'perfect' | 'no_face' | 'multiple_faces' | 'blurry' | 'dark'>('perfect');

  // Toasts
  const [toast, setToast] = useState<Toast | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Run AI Analysis sequence
  useEffect(() => {
    if (step === 'analysis') {
      setAnalysisStep(0);
      const interval = setInterval(() => {
        setAnalysisStep(prev => {
          if (prev >= analysisLabels.length - 1) {
            clearInterval(interval);
            setTimeout(() => {
              setStep('select_look');
            }, 800);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Run AI Generation sequence
  useEffect(() => {
    if (step === 'generate') {
      setGenProgress(0);
      setGenStepLabel('Preparing Canvas Elements...');
      
      const timer1 = setTimeout(() => {
        setGenProgress(25);
        setGenStepLabel('Mapping Facial Coordinates...');
      }, 1000);

      const timer2 = setTimeout(() => {
        setGenProgress(55);
        setGenStepLabel('Applying Neural Transformation Mask...');
      }, 2200);

      const timer3 = setTimeout(() => {
        setGenProgress(85);
        setGenStepLabel('Rendering Photorealistic Texture Layer...');
      }, 3500);

      const timer4 = setTimeout(() => {
        setGenProgress(100);
        setGenStepLabel('Finalizing Transformation Output...');
        setTimeout(() => {
          // Pre-load the chosen look's preview URL
          setGeneratedPreview(selectedLook.previewUrl);
          setStep('result');
        }, 800);
      }, 4800);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    }
  }, [step, selectedLook]);

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setValidationError('Image size exceeds 10 MB. Please upload a smaller photo.');
      return;
    }

    setValidationError(null);
    setUploading(true);
    setUploadProgress(10);

    // Simulate upload progress
    const timer = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(timer);
          return 90;
        }
        return prev + 15;
      });
    }, 150);

    const reader = new FileReader();
    reader.onload = async (event) => {
      clearInterval(timer);
      setUploadProgress(100);

      const base64 = event.target?.result as string;

      // Real Canvas analysis
      const analysis = await analyzeUploadedImage(base64);
      
      setUploading(false);

      // Apply Demo Simulations overrides
      if (demoSimState === 'no_face') {
        setValidationError('No human face detected. Please ensure you are looking straight at the camera.');
        return;
      }
      if (demoSimState === 'multiple_faces') {
        setValidationError('Multiple faces detected. Please upload a portrait with exactly one person.');
        return;
      }
      if (demoSimState === 'blurry') {
        setValidationError('Image appears blurry. Please upload a clear, high-resolution portrait.');
        return;
      }
      if (demoSimState === 'dark') {
        setValidationError('Image too dark. Please take a photo in a brighter, well-lit environment.');
        return;
      }

      // Check real canvas analysis errors
      if (!analysis.success) {
        setValidationError(analysis.error || 'Failed to validate face.');
        return;
      }

      setFaceShape(analysis.faceShape || 'Oval');
      setSkinTone(analysis.skinTone || 'Warm Sand');
      setUploadedImage(base64);
      setStep('analysis');
    };
    reader.onerror = () => {
      clearInterval(timer);
      setUploading(false);
      setValidationError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  // Reset try-on
  const handleReset = () => {
    setUploadedImage(null);
    setGeneratedPreview(null);
    setValidationError(null);
    setStep('upload');
    setSliderPos(50);
    setZoomLevel(1);
    setBookingSuccess(false);
  };

  // Save Booking
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedImage || !generatedPreview) return;

    setBookingLoading(true);
    try {
      await saveTryOn({
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        uploaded_image_url: uploadedImage,
        generated_preview_url: generatedPreview,
        selected_transformation_id: selectedLook.id,
        selected_transformation_name: selectedLook.name,
        booking_status: 'Pending Review',
        appointment_date: bookingDate,
        appointment_time: bookingTime
      });

      setBookingSuccess(true);
      showToast('Transformation booking saved successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to save booking. Please try again.', 'error');
    } finally {
      setBookingLoading(false);
    }
  };

  // Download Output
  const handleDownload = () => {
    if (!generatedPreview) return;
    const link = document.createElement('a');
    link.href = generatedPreview;
    link.download = `zha_tryon_${selectedLook.id}.jpg`;
    link.click();
    showToast('Download started!');
  };

  // Share link
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Link copied to clipboard!');
  };

  // Category Icon Resolver
  const getLookIcon = (look: TransformationLook) => {
    switch (look.id) {
      case 'haircut': return <Scissors size={18} />;
      case 'haircolor': return <Palette size={18} />;
      case 'bridal': return <Crown size={18} />;
      case 'facial': return <Droplet size={18} />;
      case 'eyebrow': return <Edit size={18} />;
      case 'hairspa': return <Wind size={18} />;
      default: return <Sparkles size={18} />;
    }
  };

  return (
    <div className="tryon-container" ref={containerRef} id="virtual-tryon">
      <div className="container">
        {/* Section Header */}
        <div className="tryon-header text-center">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="tryon-badge"
          >
            <Sparkles size={14} className="emerald-pulse" />
            <span>Virtual Consultation</span>
          </motion.div>
          <h2 className="tryon-title">✨ Experience Your New Look</h2>
          <p className="tryon-subtitle">
            Upload your photo and preview your transformation before visiting our salon.
          </p>
        </div>

        {/* Demo Simulation bar (highly helpful tool for user testing) */}
        {step === 'upload' && (
          <div className="demo-sim-bar">
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Info size={12} />
              Simulate Upload Scenarios:
            </span>
            <div className="demo-sim-buttons">
              {[
                { id: 'perfect', label: 'Perfect Image' },
                { id: 'no_face', label: 'No Face Error' },
                { id: 'multiple_faces', label: 'Multiple Faces' },
                { id: 'blurry', label: 'Blurry Photo' },
                { id: 'dark', label: 'Too Dark' }
              ].map(sim => (
                <button
                  key={sim.id}
                  type="button"
                  className={`demo-sim-btn ${demoSimState === sim.id ? 'active' : ''}`}
                  onClick={() => setDemoSimState(sim.id as any)}
                >
                  {sim.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Work Area */}
        <div className="tryon-main-card">
          <AnimatePresence mode="wait">
            
            {/* Step 1 & 2: Upload and Validation */}
            {step === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="upload-step-view"
              >
                <div 
                  className={`upload-zone ${isDragOver ? 'dragover' : ''} ${uploading ? 'uploading' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/png, image/jpeg, image/jpg" 
                    style={{ display: 'none' }} 
                  />

                  {uploading ? (
                    <div className="upload-progress-wrap">
                      <Loader2 size={40} className="animate-spin text-emerald" />
                      <h4 className="upload-progress-title">Uploading Portrait...</h4>
                      <div className="upload-progress-bar">
                        <div className="upload-progress-fill" style={{ width: `${uploadProgress}%` }} />
                      </div>
                      <span className="upload-progress-num">{uploadProgress}%</span>
                    </div>
                  ) : (
                    <div className="upload-prompt-wrap">
                      <div className="upload-icon-circle">
                        <Upload size={24} className="text-emerald" />
                      </div>
                      <h4 className="upload-zone-title">Drag & Drop Portrait Here</h4>
                      <p className="upload-zone-subtitle">or click to browse your files</p>
                      
                      <div className="upload-formats-bar">
                        <span>PNG, JPG, JPEG</span>
                        <span className="dot">•</span>
                        <span>Max 10MB</span>
                      </div>
                    </div>
                  )}
                </div>

                {validationError && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="validation-error-card"
                  >
                    <AlertTriangle className="error-icon" />
                    <div>
                      <h4 className="error-title">Analysis Validation Failed</h4>
                      <p className="error-desc">{validationError}</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 3: AI Analysis */}
            {step === 'analysis' && (
              <motion.div
                key="analysis"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="analysis-step-view"
              >
                <div className="analysis-grid">
                  <div className="analysis-preview-card">
                    <img src={uploadedImage || ''} alt="Analysis Preview" className="analysis-portrait" />
                    <div className="scanner-line" />
                  </div>
                  
                  <div className="analysis-progress-panel">
                    <h3 className="panel-title">AI Diagnostics Engine</h3>
                    <p className="panel-desc">Conducting face alignment & structure mapping using luxury neural assets.</p>
                    
                    <div className="analysis-steps-list">
                      {analysisLabels.map((lbl, idx) => (
                        <div 
                          key={lbl} 
                          className={`analysis-step-item ${analysisStep === idx ? 'active' : ''} ${analysisStep > idx ? 'completed' : ''}`}
                        >
                          <div className="step-bullet">
                            {analysisStep > idx ? <Check size={12} /> : idx + 1}
                          </div>
                          <span className="step-label">{lbl}</span>
                          {analysisStep === idx && <Loader2 size={14} className="animate-spin text-emerald ml-auto" />}
                        </div>
                      ))}
                    </div>

                    <div className="overall-bar-wrap">
                      <div className="overall-bar-fill" style={{ width: `${((analysisStep + 1) / analysisLabels.length) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Select Transformation */}
            {step === 'select_look' && (
              <motion.div
                key="select_look"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="select-look-view"
              >
                <div className="step-header-panel">
                  <div>
                    <h3 className="section-title-sm">Choose Your Transformation</h3>
                    <p className="section-desc-sm">
                      Face Shape: <span className="highlight-text">{faceShape}</span> | Skin Tone: <span className="highlight-text">{skinTone}</span>
                    </p>
                  </div>
                  <button className="btn btn-outline reset-btn-top" onClick={handleReset}>
                    <RefreshCw size={12} />
                    <span>Upload New</span>
                  </button>
                </div>

                <div className="looks-grid">
                  {TRANSFORMATION_LOOKS.map(look => (
                    <div 
                      key={look.id}
                      className={`look-selection-card ${selectedLook.id === look.id ? 'active' : ''}`}
                      onClick={() => setSelectedLook(look)}
                    >
                      <div className="look-card-header">
                        <div className="look-icon-box">
                          {getLookIcon(look)}
                        </div>
                        <div className="look-badge">{look.category.toUpperCase()}</div>
                      </div>
                      <h4 className="look-card-name">{look.name}</h4>
                      <p className="look-card-desc">{look.desc}</p>
                      
                      <div className="look-card-footer">
                        <span className="look-stat">⏱ {look.duration}</span>
                        <span className="look-price">{look.price}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="select-look-actions">
                  <button 
                    className="btn btn-primary generate-btn-trigger" 
                    onClick={() => setStep('generate')}
                  >
                    <span>Generate AI Preview</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Generating AI Preview */}
            {step === 'generate' && (
              <motion.div
                key="generate"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="generate-step-view"
              >
                <div className="generation-progress-box">
                  <div className="ai-core-spinner">
                    <div className="spinner-glow" />
                    <Sparkles size={36} className="text-emerald animate-pulse" />
                  </div>
                  
                  <h3 className="gen-title">{genStepLabel}</h3>
                  <p className="gen-subtitle">Estimated wait time: 5–15 seconds</p>
                  
                  <div className="gen-progress-track">
                    <div className="gen-progress-bar" style={{ width: `${genProgress}%` }} />
                  </div>
                  <span className="gen-progress-num">{genProgress}%</span>
                </div>
              </motion.div>
            )}

            {/* Step 6, 7 & 8: Result Page */}
            {step === 'result' && (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="result-step-view"
              >
                <div className="result-split-grid">
                  
                  {/* Left Column: Visual Slider */}
                  <div className="result-slider-container">
                    <div className={`slider-viewport ${isFullscreen ? 'fullscreen' : ''}`} style={{ transform: `scale(${zoomLevel})` }}>
                      {/* Base Image (Original) */}
                      <img src={uploadedImage || ''} alt="Original Portrait" className="slider-img original" />
                      
                      {/* Transformed Preview */}
                      <img 
                        src={generatedPreview || ''} 
                        alt="AI Transformed Look" 
                        className="slider-img preview"
                        style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
                      />
                      
                      {/* Split Line Controller */}
                      <div className="slider-divider" style={{ left: `${sliderPos}%` }}>
                        <div className="slider-divider-line" />
                        <div className="slider-divider-button">
                          <ArrowRight size={12} className="rotate-180" />
                          <ArrowRight size={12} />
                        </div>
                      </div>

                      {/* Transparent Input overlay for mouse/touch slider control */}
                      <input 
                        type="range"
                        min="0"
                        max="100"
                        value={sliderPos}
                        onChange={e => setSliderPos(Number(e.target.value))}
                        className="slider-input-range"
                      />

                      {/* Top floating labels */}
                      <div className="floating-badge before">Before</div>
                      <div className="floating-badge after">AI After</div>
                    </div>

                    {/* Slider Toolbar Controls */}
                    <div className="slider-toolbar">
                      <button className="toolbar-btn" onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2))} title="Zoom In">
                        <ZoomIn size={16} />
                      </button>
                      <button className="toolbar-btn" onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))} title="Zoom Out">
                        <ZoomOut size={16} />
                      </button>
                      <button className="toolbar-btn" onClick={() => setIsFullscreen(!isFullscreen)} title="Toggle Fullscreen">
                        {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                      </button>
                      <button className="toolbar-btn" onClick={handleDownload} title="Download Preview">
                        <Download size={16} />
                      </button>
                      <button className="toolbar-btn" onClick={handleShare} title="Share Link">
                        <Share2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Recommendations & Action */}
                  <div className="result-details-panel">
                    <div className="result-panel-header">
                      <span className="look-badge">{selectedLook.category.toUpperCase()}</span>
                      <h3 className="look-title">{selectedLook.name}</h3>
                      <p className="look-desc">{selectedLook.desc}</p>
                    </div>

                    <div className="recommendations-box">
                      <h4 className="rec-title">Consultant Analysis Summary</h4>
                      <div className="rec-specs-grid">
                        <div className="spec-item">
                          <span className="spec-label">Detected Face Shape</span>
                          <span className="spec-val">{faceShape}</span>
                        </div>
                        <div className="spec-item">
                          <span className="spec-label">Detected Skin Tone</span>
                          <span className="spec-val">{skinTone}</span>
                        </div>
                        {selectedLook.colorRecommendation && (
                          <div className="spec-item">
                            <span className="spec-label">Recommended Shade</span>
                            <span className="spec-val text-gold">{selectedLook.colorRecommendation}</span>
                          </div>
                        )}
                        {selectedLook.makeupPackage && (
                          <div className="spec-item">
                            <span className="spec-label">Recommended Pack</span>
                            <span className="spec-val text-gold">{selectedLook.makeupPackage}</span>
                          </div>
                        )}
                        <div className="spec-item">
                          <span className="spec-label">Assigned Stylist</span>
                          <span className="spec-val">{selectedLook.stylist}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pricing-summary-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span className="pricing-label">Consultation & Transformation</span>
                        <span className="pricing-val">{selectedLook.price}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                        <span>Estimated Duration</span>
                        <span>{selectedLook.duration}</span>
                      </div>
                    </div>

                    <div className="result-actions-row">
                      <button className="btn btn-outline" onClick={handleReset}>
                        <RefreshCw size={14} />
                        <span>Try Another Look</span>
                      </button>
                      <button className="btn btn-primary" onClick={() => setShowBookingModal(true)}>
                        <span>Book This Look</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* Booking Form Dialog Modal */}
      {showBookingModal && (
        <div className="admin-modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
          <div className="admin-card admin-modal-card tryon-booking-card" style={{ width: '100%', maxWidth: '460px', padding: 'var(--space-2xl)', border: '1px solid var(--color-border)', animation: 'zoomIn 0.25s ease', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} className="text-emerald" />
                Book Your Transformation
              </h3>
              <button type="button" onClick={() => setShowBookingModal(false)} style={{ color: 'var(--color-text-muted)', border: 'none', background: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {bookingSuccess ? (
              <div style={{ textAlign: 'center', padding: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                  <Check size={28} />
                </div>
                <div>
                  <h4 style={{ color: 'white', margin: '0 0 6px 0', fontSize: '1.15rem' }}>Appointment Requested!</h4>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                    We have received your transformation profile and AI preview. Our staff will contact you shortly to confirm your booking.
                  </p>
                </div>
                <button className="btn btn-outline" style={{ marginTop: '12px' }} onClick={() => { setShowBookingModal(false); setStep('upload'); }}>
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="tryon-cust-name">Full Name *</label>
                  <input 
                    id="tryon-cust-name"
                    type="text" 
                    required 
                    className="form-input" 
                    placeholder="Enter your name"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="tryon-cust-phone">WhatsApp Number *</label>
                  <input 
                    id="tryon-cust-phone"
                    type="tel" 
                    required 
                    className="form-input" 
                    placeholder="e.g. +91 98765 43210"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="tryon-cust-email">Email Address *</label>
                  <input 
                    id="tryon-cust-email"
                    type="email" 
                    required 
                    className="form-input" 
                    placeholder="e.g. yourname@example.com"
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="tryon-date">Preferred Date *</label>
                    <input 
                      id="tryon-date"
                      type="date" 
                      required 
                      className="form-input"
                      value={bookingDate}
                      onChange={e => setBookingDate(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="tryon-time">Preferred Time *</label>
                    <input 
                      id="tryon-time"
                      type="time" 
                      required 
                      className="form-input"
                      value={bookingTime}
                      onChange={e => setBookingTime(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '16px', marginTop: '8px' }}>
                  <button className="btn btn-outline" type="button" onClick={() => setShowBookingModal(false)}>Cancel</button>
                  <button className="btn btn-primary" type="submit" disabled={bookingLoading} style={{ background: '#10b981', borderColor: '#10b981' }}>
                    {bookingLoading ? 'Submitting...' : 'Request Booking'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Toast Alert */}
      {toast && (
        <div className={`toast toast-${toast.type}`} style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 4000 }}>
          <span>{toast.message}</span>
        </div>
      )}

      <style>{`
        /* ── Virtual Try-On Styles ── */
        .tryon-container {
          padding: 80px 0;
          background: #060c09;
          color: white;
          border-top: 1px solid rgba(16, 185, 129, 0.1);
        }
        .tryon-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          color: #10b981;
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          padding: 6px 14px;
          border-radius: 100px;
          margin-bottom: var(--space-md);
        }
        .tryon-title {
          font-family: var(--font-serif);
          font-size: 2.2rem;
          font-weight: 600;
          color: white;
          margin-bottom: 12px;
          letter-spacing: -0.01em;
        }
        .tryon-subtitle {
          font-size: 0.95rem;
          color: var(--color-text-muted);
          max-width: 580px;
          margin: 0 auto 40px auto;
          line-height: 1.6;
        }
        
        .demo-sim-bar {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--color-border);
          padding: 8px 16px;
          border-radius: 8px;
          max-width: 900px;
          margin: 0 auto 20px auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: var(--space-sm);
        }
        .demo-sim-buttons {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .demo-sim-btn {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          color: var(--color-text-muted);
          font-size: 0.68rem;
          padding: 4px 10px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .demo-sim-btn.active {
          background: rgba(16, 185, 129, 0.1);
          border-color: #10b981;
          color: #10b981;
          font-weight: 600;
        }

        .tryon-main-card {
          max-width: 900px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: var(--space-3xl);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05);
          position: relative;
          overflow: hidden;
        }
        .tryon-main-card::before {
          content: '';
          position: absolute;
          top: -10%;
          left: -10%;
          width: 120%;
          height: 120%;
          background: radial-gradient(circle at top right, rgba(16, 185, 129, 0.05), transparent 60%);
          pointer-events: none;
        }

        /* ── Upload Step ── */
        .upload-zone {
          border: 2px dashed rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.01);
          border-radius: 12px;
          padding: 50px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 250px;
        }
        .upload-zone:hover {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.02);
        }
        .upload-icon-circle {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--space-md);
          transition: all 0.3s ease;
        }
        .upload-zone:hover .upload-icon-circle {
          background: rgba(16, 185, 129, 0.08);
          border-color: rgba(16, 185, 129, 0.25);
          transform: translateY(-2px);
        }
        .upload-zone-title {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          color: white;
          margin: 0 0 6px 0;
        }
        .upload-zone-subtitle {
          font-size: 0.82rem;
          color: var(--color-text-muted);
          margin: 0 0 16px 0;
        }
        .upload-formats-bar {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-size: 0.72rem;
          color: rgba(255, 255, 255, 0.3);
        }
        .upload-formats-bar .dot { font-size: 0.5rem; }

        .upload-progress-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 320px;
        }
        .upload-progress-title {
          font-size: 0.95rem;
          color: white;
          margin: 12px 0 8px 0;
          font-weight: 500;
        }
        .upload-progress-bar {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 6px;
        }
        .upload-progress-fill {
          height: 100%;
          background: #10b981;
          transition: width 0.2s ease;
        }
        .upload-progress-num {
          font-size: 0.75rem;
          color: #10b981;
          font-weight: 600;
        }

        .validation-error-card {
          margin-top: var(--space-xl);
          background: rgba(239, 68, 68, 0.05);
          border: 1px solid rgba(239, 68, 68, 0.15);
          border-radius: 10px;
          padding: 14px 18px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .validation-error-card .error-icon {
          color: #ef4444;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .error-title {
          font-weight: 600;
          font-size: 0.85rem;
          color: white;
          margin: 0 0 3px 0;
        }
        .error-desc {
          font-size: 0.78rem;
          color: var(--color-text-light);
          margin: 0;
          line-height: 1.4;
        }

        /* ── Analysis Step ── */
        .analysis-grid {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 32px;
          align-items: center;
        }
        .analysis-preview-card {
          position: relative;
          aspect-ratio: 4/5;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--color-border);
          background: #080f0c;
        }
        .analysis-portrait {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.7;
        }
        .scanner-line {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #10b981, transparent);
          box-shadow: 0 0 10px #10b981;
          animation: scan 2s infinite ease-in-out;
        }
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }

        .analysis-progress-panel .panel-title {
          font-family: var(--font-serif);
          font-size: 1.35rem;
          color: white;
          margin: 0 0 6px 0;
        }
        .analysis-progress-panel .panel-desc {
          font-size: 0.82rem;
          color: var(--color-text-muted);
          margin: 0 0 20px 0;
        }
        .analysis-steps-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }
        .analysis-step-item {
          display: flex;
          align-items: center;
          gap: 12px;
          opacity: 0.3;
          transition: all 0.3s ease;
        }
        .analysis-step-item.active { opacity: 1; }
        .analysis-step-item.completed { opacity: 0.7; color: #10b981; }
        .step-bullet {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 600;
          color: white;
        }
        .analysis-step-item.active .step-bullet {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }
        .analysis-step-item.completed .step-bullet {
          border-color: #10b981;
          background: #10b981;
          color: black;
        }
        .step-label {
          font-size: 0.82rem;
        }
        .overall-bar-wrap {
          width: 100%;
          height: 3px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          overflow: hidden;
        }
        .overall-bar-fill {
          height: 100%;
          background: #10b981;
          transition: width 0.5s ease;
        }

        /* ── Select Look Step ── */
        .step-header-panel {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 16px;
          margin-bottom: 24px;
        }
        .section-title-sm {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          margin: 0 0 4px 0;
          color: white;
        }
        .section-desc-sm {
          font-size: 0.78rem;
          color: var(--color-text-muted);
          margin: 0;
        }
        .highlight-text {
          color: #10b981;
          font-weight: 600;
        }
        .looks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
          max-height: 400px;
          overflow-y: auto;
          padding-right: 6px;
          margin-bottom: 24px;
        }
        .looks-grid::-webkit-scrollbar { width: 4px; }
        .looks-grid::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        
        .look-selection-card {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        .look-selection-card:hover {
          border-color: rgba(16, 185, 129, 0.3);
          background: rgba(255, 255, 255, 0.02);
          transform: translateY(-2px);
        }
        .look-selection-card.active {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.05);
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.1);
        }
        .look-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .look-icon-box {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-muted);
          transition: all 0.3s ease;
        }
        .look-selection-card.active .look-icon-box {
          background: #10b981;
          color: black;
          border-color: #10b981;
        }
        .look-badge {
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.04);
          padding: 3px 8px;
          border-radius: 4px;
        }
        .look-selection-card.active .look-badge {
          color: #10b981;
          background: rgba(16,185,129,0.15);
        }
        .look-card-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: white;
          margin: 0 0 4px 0;
        }
        .look-card-desc {
          font-size: 0.72rem;
          color: var(--color-text-muted);
          line-height: 1.45;
          margin: 0 0 16px 0;
          flex: 1;
        }
        .look-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          padding-top: 10px;
        }
        .look-stat {
          font-size: 0.7rem;
          color: var(--color-text-light);
        }
        .look-price {
          font-size: 0.85rem;
          font-weight: 700;
          color: #10b981;
        }
        
        .select-look-actions {
          display: flex;
          justify-content: flex-end;
        }

        /* ── Generate Step ── */
        .generation-progress-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 0;
          min-height: 300px;
        }
        .ai-core-spinner {
          position: relative;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }
        .spinner-glow {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid transparent;
          border-top-color: #10b981;
          border-bottom-color: #10b981;
          animation: spin 1.5s infinite linear;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .gen-title {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          color: white;
          margin: 0 0 6px 0;
        }
        .gen-subtitle {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          margin: 0 0 20px 0;
        }
        .gen-progress-track {
          width: 100%;
          max-width: 360px;
          height: 4px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        .gen-progress-bar {
          height: 100%;
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
          transition: width 0.4s ease;
        }
        .gen-progress-num {
          font-size: 0.8rem;
          color: #10b981;
          font-weight: 600;
        }

        /* ── Result Step ── */
        .result-split-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 32px;
          align-items: stretch;
        }
        .result-slider-container {
          background: #080f0c;
          border: 1px solid var(--color-border);
          border-radius: 12px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .slider-viewport {
          position: relative;
          width: 100%;
          aspect-ratio: 4/5;
          max-height: 460px;
          overflow: hidden;
          cursor: col-resize;
          transition: transform 0.25s ease;
        }
        .slider-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
        }
        .slider-divider {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--color-champagne, #D4AF37);
          pointer-events: none;
          z-index: 10;
        }
        .slider-divider-line {
          height: 100%;
          width: 100%;
          box-shadow: 0 0 10px var(--color-champagne);
        }
        .slider-divider-button {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #080f0c;
          border: 1.5px solid var(--color-champagne);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-champagne);
          z-index: 12;
          box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        }
        
        .slider-input-range {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: col-resize;
          z-index: 15;
        }

        .floating-badge {
          position: absolute;
          top: 16px;
          background: rgba(8, 15, 12, 0.7);
          border: 1px solid rgba(255,255,255,0.08);
          color: white;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 4px 10px;
          border-radius: 4px;
          z-index: 5;
        }
        .floating-badge.before { left: 16px; }
        .floating-badge.after { right: 16px; border-color: rgba(16, 185, 129, 0.2); color: #10b981; }

        .slider-toolbar {
          display: flex;
          justify-content: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.02);
          border-top: 1px solid var(--color-border);
          width: 100%;
          padding: 12px;
        }
        .toolbar-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          color: var(--color-text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .toolbar-btn:hover {
          background: rgba(16, 185, 129, 0.1);
          border-color: #10b981;
          color: #10b981;
          transform: translateY(-1px);
        }

        .result-details-panel {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .result-panel-header .look-title {
          font-family: var(--font-serif);
          font-size: 1.35rem;
          color: white;
          margin: 6px 0;
        }
        .result-panel-header .look-desc {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          line-height: 1.5;
          margin: 0;
        }

        .recommendations-box {
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--color-border);
          border-radius: 10px;
          padding: 16px;
          margin: 20px 0;
        }
        .rec-title {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.4);
          margin: 0 0 12px 0;
        }
        .rec-specs-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .spec-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.78rem;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          padding-bottom: 6px;
        }
        .spec-label { color: var(--color-text-muted); }
        .spec-val { color: white; font-weight: 500; }
        .text-gold { color: var(--color-champagne, #D4AF37) !important; }

        .pricing-summary-card {
          border: 1.5px solid rgba(16, 185, 129, 0.15);
          background: rgba(16, 185, 129, 0.02);
          border-radius: 10px;
          padding: 16px;
          margin-bottom: 20px;
        }
        .pricing-label { font-size: 0.82rem; color: white; }
        .pricing-val { font-size: 1.1rem; font-weight: 700; color: #10b981; }

        .result-actions-row {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 12px;
        }

        /* Fullscreen Slide state override */
        .slider-viewport.fullscreen {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          max-height: none;
          z-index: 2500;
          cursor: col-resize;
          background: black;
          transform: none !important;
        }
        .slider-viewport.fullscreen .slider-input-range {
          z-index: 2515;
        }

        /* ── Responsiveness ── */
        @media (max-width: 768px) {
          .tryon-main-card { padding: var(--space-xl); }
          .analysis-grid { grid-template-columns: 1fr; }
          .result-split-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
