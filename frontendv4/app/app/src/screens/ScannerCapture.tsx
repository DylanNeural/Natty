import React, { useEffect, useRef, useState } from 'react';
import { Platform, View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CameraView, useCameraPermissions, FlashMode, CameraType } from 'expo-camera';
import Svg, { Path } from 'react-native-svg';
import { C, F } from '../tokens';
import { useScanStore, type ScanCandidate } from '../store/useScanStore';
import { apiClient, type ScanResponse } from '../api/api';
import { hapticMedium, hapticSuccess, hapticSelection } from '../shared/haptics';
import type { ScannerStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<ScannerStackParamList, 'ScannerCapture'>;

const MODES = ['Plat', 'Étiquette', 'Frigo'];

function mapScanResponseToCandidate(response: ScanResponse): ScanCandidate {
  const data = response.data || {};
  const nutrition = data.valeurs_nutritionnelles || {};
  const nameParts = [data.nom, data.marque].filter(Boolean);
  const food = nameParts.length ? nameParts.join(' - ') : data.description || 'Produit scanne';

  return {
    food,
    kcal: Math.round(Number(nutrition.energie_kcal || 0)),
    prot: Math.round(Number(nutrition.proteines_g || 0)),
    glu: Math.round(Number(nutrition.glucides_g || 0)),
    lip: Math.round(Number(nutrition.lipides_g || 0)),
    nutritionDetails: {
      sucres: Math.round(Number(nutrition.dont_sucres_g || 0)),
      satures: Math.round(Number(nutrition.dont_satures_g || 0)),
      fibres: Math.round(Number(nutrition.fibres_g || 0)),
      sel: Math.round(Number(nutrition.sel_g || 0)),
    },
    brand: data.marque || undefined,
    description: data.description || undefined,
    ingredients: data.ingredients || [],
    allergens: data.allergenes || [],
    comments: data.commentaires || undefined,
    confidence: response.source === 'barcode' ? 0.98 : 0.86,
    emoji: response.source === 'barcode' ? '???' : '???',
  };
}
export default function ScannerCapture() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const topY = insets.top + 8;
  const setCandidates = useScanStore((s) => s.setCandidates);
  const cameraRef = useRef<CameraView | null>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [cameraGranted, setCameraGranted] = useState(false);
  const [requestingCamera, setRequestingCamera] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [flash, setFlash] = useState<FlashMode>('off');
  const [cameraFacing, setCameraFacing] = useState<CameraType>(
    Platform.OS === 'web' ? 'front' : 'back'
  );

  useEffect(() => {
    setCameraGranted(Boolean(permission?.granted));
  }, [permission?.granted]);

  useEffect(() => {
    if (!scanning) return;
    let p = 0;
    const iv = setInterval(() => {
      p = Math.min(p + 4, 95);
      setProgress(p);
    }, 40);
    return () => clearInterval(iv);
  }, [scanning]);

  const frameTop = 180;
  const frameBottom = 844 - 260;
  const frameHeight = frameBottom - frameTop;

  const close = () => navigation.getParent()?.goBack();

  const handleRequestPermission = async () => {
    if (requestingCamera) return;

    setRequestingCamera(true);
    setPermissionError(null);

    try {
      const result = await requestPermission();
      setCameraGranted(Boolean(result.granted));

      if (!result.granted) {
        const isWeb = Platform.OS === 'web';
        const isInsecureWeb =
          Platform.OS === 'web' &&
          typeof window !== 'undefined' &&
          window.location.protocol !== 'https:' &&
          window.location.hostname !== 'localhost';

        setPermissionError(
          isInsecureWeb
            ? "La camera est bloquee par le navigateur sur mobile car l'app est ouverte en HTTP. Ouvre-la via Expo Go, HTTPS, ou un tunnel."
            : isWeb
            ? "La camera est refusee par le navigateur. Clique sur le cadenas dans la barre d'adresse, autorise la camera, puis recharge la page."
            : result.canAskAgain === false
            ? "La camera est bloquee. Autorise-la dans les reglages du navigateur ou de l'appareil."
            : "Autorisation refusee. Tu peux reessayer pour activer le scanner."
        );
      }
    } catch {
      setPermissionError("Impossible de demander l'autorisation camera pour le moment.");
    } finally {
      setRequestingCamera(false);
    }
  };

  const triggerScan = async () => {
    if (scanning) return;
    hapticMedium();
    setScanError(null);
    setScanning(true);
    setProgress(8);

    try {
      if (!cameraRef.current) {
        throw new Error("La camera n'est pas prete.");
      }

      const picture = await cameraRef.current.takePictureAsync({
        quality: 0.35,
        base64: true,
        skipProcessing: true,
      });

      if (!picture.base64) {
        throw new Error("Impossible de lire l'image capturee.");
      }

      const response = await apiClient.scanImage(picture.base64, 'image/jpeg');
      setCandidates([mapScanResponseToCandidate(response)]);
      setProgress(100);
      hapticSuccess();
      navigation.navigate('ScannerResult');
    } catch (err: any) {
      setScanError(err?.message || "Impossible d'analyser l'image.");
      setProgress(0);
      setScanning(false);
    }
  };

  // ─── Permission gate ────────────────────────────────────────────────
  if (!permission) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f1511', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={C.lime} />
      </View>
    );
  }

  if (!cameraGranted) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f1511', padding: 28, justifyContent: 'center' }}>
        <Pressable
          onPress={close}
          accessibilityLabel="Fermer"
          style={{
            position: 'absolute',
            left: 20,
            top: topY,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(0,0,0,0.4)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Svg width={18} height={18} viewBox="0 0 24 24">
            <Path d="M15 6l-6 6 6 6" stroke={C.beige} strokeWidth={2.2} strokeLinecap="round" fill="none" strokeLinejoin="round" />
          </Svg>
        </Pressable>
        <Text style={{ fontFamily: F.display, fontSize: 32, fontWeight: '900', color: C.beige, lineHeight: 36 }}>
          Autorise l'appareil photo
        </Text>
        <Text style={{ fontSize: 14, color: C.lime, marginTop: 14, lineHeight: 20, opacity: 0.85 }}>
          Le Scanner IA a besoin de ta caméra pour analyser tes repas. Aucune photo n'est envoyée tant que tu ne scannes pas.
        </Text>
        {permissionError ? (
          <Text style={{ fontSize: 13, color: C.orange, marginTop: 14, lineHeight: 19 }}>
            {permissionError}
          </Text>
        ) : null}
        <Pressable
          onPress={handleRequestPermission}
          disabled={requestingCamera}
          style={{
            marginTop: 28,
            height: 56,
            borderRadius: 28,
            backgroundColor: requestingCamera ? 'rgba(237,126,0,0.55)' : C.orange,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: C.orange,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 20,
            elevation: 6,
          }}
        >
          <Text style={{ color: C.beige, fontWeight: '700', fontSize: 16 }}>
            {requestingCamera ? 'Autorisation...' : 'Autoriser la caméra'}
          </Text>
        </Pressable>
      </View>
    );
  }

  // ─── Camera view ────────────────────────────────────────────────────
  return (
    <View style={{ flex: 1, backgroundColor: '#0f1511', overflow: 'hidden' }}>
      <CameraView
        ref={cameraRef}
        style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
        facing={cameraFacing}
        flash={flash}
        onCameraReady={() => setCameraError(null)}
        onMountError={(event) => {
          const message = event?.message || "La camera n'a pas pu demarrer.";
          setCameraError(message);
          if (Platform.OS === 'web' && cameraFacing === 'back') {
            setCameraFacing('front');
          }
        }}
      />

      {cameraError ? (
        <View
          style={{
            position: 'absolute',
            left: 24,
            right: 24,
            top: topY + 58,
            padding: 12,
            borderRadius: 14,
            backgroundColor: 'rgba(15,21,17,0.82)',
            zIndex: 6,
          }}
        >
          <Text style={{ color: C.orange, fontSize: 13, lineHeight: 18, textAlign: 'center' }}>
            {cameraError}
          </Text>
        </View>
      ) : null}

      {scanError ? (
        <View
          style={{
            position: 'absolute',
            left: 24,
            right: 24,
            bottom: 32,
            padding: 12,
            borderRadius: 14,
            backgroundColor: 'rgba(15,21,17,0.88)',
            zIndex: 6,
          }}
        >
          <Text style={{ color: C.orange, fontSize: 13, lineHeight: 18, textAlign: 'center' }}>
            {scanError}
          </Text>
        </View>
      ) : null}

      {/* vignette around scan frame */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: frameTop, backgroundColor: 'rgba(0,0,0,0.55)' }} />
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, top: frameBottom, backgroundColor: 'rgba(0,0,0,0.55)' }} />
      <View style={{ position: 'absolute', top: frameTop, bottom: 844 - frameBottom, left: 0, width: 40, backgroundColor: 'rgba(0,0,0,0.55)' }} />
      <View style={{ position: 'absolute', top: frameTop, bottom: 844 - frameBottom, right: 0, width: 40, backgroundColor: 'rgba(0,0,0,0.55)' }} />

      <Pressable
        onPress={close}
        accessibilityLabel="Fermer le scanner"
        style={{
          position: 'absolute',
          left: 20,
          top: topY,
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: 'rgba(0,0,0,0.4)',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5,
        }}
      >
        <Svg width={18} height={18} viewBox="0 0 24 24">
          <Path d="M15 6l-6 6 6 6" stroke={C.beige} strokeWidth={2.2} strokeLinecap="round" fill="none" strokeLinejoin="round" />
        </Svg>
      </Pressable>

      <Text style={{ position: 'absolute', left: 0, right: 0, top: topY + 14, textAlign: 'center', fontSize: 15, fontWeight: '700', color: C.beige }}>
        Scanner IA
      </Text>

      <Pressable
        onPress={() => {
          hapticSelection();
          setFlash((f) => (f === 'on' ? 'off' : 'on'));
        }}
        accessibilityLabel="Torche"
        style={{
          position: 'absolute',
          right: 20,
          top: topY,
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: flash === 'on' ? C.lime : 'rgba(0,0,0,0.4)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 16 }}>⚡</Text>
      </Pressable>

      {/* scan frame with corner brackets */}
      <View
        style={{
          position: 'absolute',
          left: 40,
          right: 40,
          top: frameTop,
          height: frameHeight,
          borderWidth: 2,
          borderColor: C.lime,
          borderRadius: 24,
        }}
      >
        {(
          [
            ['tl', { top: -2, left: -2, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 12 }],
            ['tr', { top: -2, right: -2, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 12 }],
            ['bl', { bottom: -2, left: -2, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 12 }],
            ['br', { bottom: -2, right: -2, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 12 }],
          ] as const
        ).map(([k, s]) => (
          <View key={k} style={{ position: 'absolute', width: 28, height: 28, borderColor: C.orange, ...s }} />
        ))}
        {scanning ? (
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${progress}%`,
              height: 3,
              backgroundColor: C.lime,
              shadowColor: C.lime,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 1,
              shadowRadius: 20,
              elevation: 6,
            }}
          />
        ) : null}
      </View>

      <Text
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 156,
          textAlign: 'center',
          fontSize: 12,
          color: C.lime,
          fontWeight: '500',
          opacity: 0.85,
        }}
      >
        Centre le plat dans le cadre
      </Text>

      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 220, flexDirection: 'row', justifyContent: 'center', gap: 20 }}>
        {MODES.map((t, i) => (
          <View key={t} style={{ alignItems: 'center', paddingBottom: 6 }}>
            <Text style={{ fontSize: 12, fontWeight: i === 0 ? '700' : '500', color: i === 0 ? C.orange : 'rgba(252,233,218,0.6)' }}>{t}</Text>
            {i === 0 ? <View style={{ marginTop: 2, width: 4, height: 4, borderRadius: 2, backgroundColor: C.orange }} /> : null}
          </View>
        ))}
      </View>

      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 120, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 40 }}>
        <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(252,233,218,0.12)', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 18 }}>🖼️</Text>
        </View>
        <Pressable
          onPress={triggerScan}
          disabled={scanning}
          accessibilityLabel="Déclencher le scan"
          style={{ width: 88, height: 88, borderRadius: 44, borderWidth: 4, borderColor: C.beige, alignItems: 'center', justifyContent: 'center' }}
        >
          <View
            style={{
              width: 70,
              height: 70,
              borderRadius: 35,
              backgroundColor: scanning ? C.orange : C.beige,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {scanning ? (
              <Text style={{ color: C.beige, fontSize: 16, fontWeight: '700' }}>{progress}%</Text>
            ) : (
              <Text style={{ fontFamily: F.display, fontWeight: '900', color: C.green, fontSize: 26 }}>N</Text>
            )}
          </View>
        </Pressable>
        <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(252,233,218,0.12)', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 18 }}>⚡</Text>
        </View>
      </View>

      <Text style={{ position: 'absolute', left: 0, right: 0, bottom: 74, textAlign: 'center', fontSize: 11, color: 'rgba(252,233,218,0.65)' }}>
        {scanning ? 'Analyse IA en cours...' : 'Appuie pour analyser'}
      </Text>
    </View>
  );
}
