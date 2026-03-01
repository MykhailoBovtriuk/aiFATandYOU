import { useRouter } from "expo-router";
import { useFoodStore } from "../store/useFoodStore";
import type { FoodEntry } from "../types/food";

export function useEditEntry() {
  const router = useRouter();
  const { setTempEntry } = useFoodStore();
  return (entry: FoodEntry) => {
    setTempEntry(entry);
    router.push({ pathname: "/review", params: { entryId: entry.id } });
  };
}
