import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { X, Zap, Camera, RotateCcw } from 'lucide-react';
import Button from '../ui/Button';

interface ScanScreenProps {
  onBack: () => void;
  onScanComplete: () => void;
}

const ScanScreen = ({ onBack, onScanComplete }: ScanScreenProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorTimerRef = useRef<number | null>(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string>('');
  const [torchOn, setTorchOn] = useState(false);
  const [isScanning, setIsScanning] = useState(true);

  const stopStream = () => {
    if (detectorTimerRef.current) {
      window.clearInterval(detectorTimerRef.current);
      detectorTimerRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startCamera = async () => {
    try {
      setCameraError('');
      setCameraReady(false);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraReady(true);
      setIsScanning(true);
    } catch (error: any) {
      const message = error?.name === 'NotAllowedError'
        ? 'Permission caméra refusée. Autorise la caméra dans le navigateur.'
        : 'Impossible d\'ouvrir la caméra. Vérifie que ton appareil en a une.';
      setCameraError(message);
      setCameraReady(false);
    }
  };

  const completeAndClose = () => {
    stopStream();
    onScanComplete();
  };

  const tryDetectQr = async () => {
    if (!isScanning || !cameraReady || !videoRef.current) return;

    const BarcodeDetectorApi = (window as any).BarcodeDetector;
    if (!BarcodeDetectorApi) return;

    try {
      const detector = new BarcodeDetectorApi({ formats: ['qr_code'] });
      const barcodes = await detector.detect(videoRef.current);
      if (barcodes?.length) {
        completeAndClose();
      }
    } catch {
      // Keep silent: fallback capture still works.
    }
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    completeAndClose();
  };

  const toggleTorch = async () => {
    const track = streamRef.current?.getVideoTracks?.()[0];
    if (!track) return;

    try {
      const capabilities: any = track.getCapabilities?.();
      if (!capabilities?.torch) return;
      await track.applyConstraints({ advanced: [{ torch: !torchOn } as any] });
      setTorchOn((v) => !v);
    } catch {
      // Some browsers expose torch but still reject constraints.
    }
  };

  useEffect(() => {
    startCamera();

    return () => {
      stopStream();
    };
  }, []);

  useEffect(() => {
    if (!cameraReady) return;

    detectorTimerRef.current = window.setInterval(() => {
      void tryDetectQr();
    }, 700);

    return () => {
      if (detectorTimerRef.current) {
        window.clearInterval(detectorTimerRef.current);
        detectorTimerRef.current = null;
      }
    };
  }, [cameraReady, isScanning]);

  return (
    <div className="h-[100svh] bg-black relative flex flex-col items-center justify-center p-6 pt-safe pb-safe overflow-hidden">
      <button
        onClick={() => {
          stopStream();
          onBack();
        }}
        className="absolute top-12 left-6 w-10 h-10 bg-white/10 text-white rounded-xl flex items-center justify-center backdrop-blur-md z-20"
      >
        <X />
      </button>

      <div className="absolute inset-0">
        <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
      </div>

      <div className="absolute inset-0 bg-black/35" />

      <div className="w-72 h-72 border-2 border-natty-lime rounded-[40px] relative z-10">
        <div className="absolute inset-0 border-4 border-natty-lime/20 rounded-[40px] animate-pulse" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-natty-lime/20" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-1 bg-natty-lime/20" />
        <motion.div
          animate={{ y: [0, 288, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="absolute top-0 left-0 w-full h-1 bg-natty-lime shadow-[0_0_15px_rgba(197,217,55,0.8)]"
        />
      </div>

      <div className="mt-10 text-center space-y-3 z-10 max-w-sm">
        <h2 className="text-2xl font-bold text-white">Scanne le QR Code</h2>
        <p className="text-white/70 text-sm">
          Place le code dans le cadre. Détection auto activée, ou prends une photo.
        </p>
        {cameraError ? (
          <p className="text-red-300 text-xs font-medium">{cameraError}</p>
        ) : (
          <p className="text-white/50 text-xs font-medium">
            {cameraReady ? 'Caméra active' : 'Initialisation de la caméra...'}
          </p>
        )}
      </div>

      <div className="absolute bottom-12 flex gap-4 z-10">
        <button
          onClick={toggleTorch}
          className={`w-16 h-16 rounded-full flex items-center justify-center text-white ${torchOn ? 'bg-natty-lime/80' : 'bg-white/10'}`}
          aria-label="Activer lampe"
        >
          <Zap size={24} />
        </button>
        <button
          onClick={captureFrame}
          disabled={!cameraReady}
          className="w-16 h-16 bg-white/15 rounded-full flex items-center justify-center text-white disabled:opacity-50"
          aria-label="Capturer"
        >
          <Camera size={24} />
        </button>
        <button
          onClick={startCamera}
          className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-white"
          aria-label="Relancer caméra"
        >
          <RotateCcw size={24} />
        </button>
      </div>

      {cameraError && (
        <div className="absolute bottom-32 z-10">
          <Button onClick={startCamera} variant="lime">Réessayer caméra</Button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ScanScreen;
