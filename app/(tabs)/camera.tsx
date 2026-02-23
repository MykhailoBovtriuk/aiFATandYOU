import { View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { useCameraScan } from '../../hooks/useCameraScan';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Colors } from '../../constants/colors';
import { Asset } from 'expo-asset';
import { analyzeImage } from '../../services/gemini';
import { useFoodStore } from '../../store/useFoodStore';
import { getMealPeriodFromHour } from '../../utils/dates';

export default function CameraTab() {
  const { scan, loading } = useCameraScan();
  const router = useRouter();
  const { setTempEntry } = useFoodStore();
  const isFirstMount = useRef(true);
  const [testing, setTesting] = useState(false);

  const handleTest = async () => {
    setTesting(true);
    try {
      const [asset] = await Asset.loadAsync(require('../../assets/images/ex.jpg'));
      const data = await analyzeImage(asset.localUri!);
      const mealType = getMealPeriodFromHour(new Date().getHours());
      setTempEntry({ ...data, mealType });
      router.push({ pathname: '/review', params: { imageUri: asset.localUri! } });
    } catch (e: any) {
      router.push({
        pathname: '/error' as any,
        params: {
          message: 'Could not connect to Gemini.',
          response: e?.message ?? String(e),
        },
      });
    } finally {
      setTesting(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      // Skip the very first mount (when the app loads all tabs)
      if (isFirstMount.current) {
        isFirstMount.current = false;
        return;
      }
      scan();
    }, [scan])
  );

  return (
    <View className="flex-1 bg-dark-bg items-center justify-center">
      {(loading || testing) ? (
        <>
          <ActivityIndicator size="large" color={Colors.accentGreen} />
          <Text className="text-text-primary mt-3 font-semibold">
            {testing ? 'Testing connection...' : 'Analyzing food...'}
          </Text>
        </>
      ) : (
        <>
          <Text className="text-text-muted text-base">Tap to scan food</Text>
          <TouchableOpacity
            onPress={handleTest}
            disabled={testing}
            className="mt-4 px-5 py-2 rounded-full border border-dark-border"
          >
            <Text className="text-text-muted text-sm">Test Gemini connection</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
