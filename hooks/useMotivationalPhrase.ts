import { useEffect, useState } from "react";
import { PHRASES } from "@/constants/phrases";
import { pickRandom } from "@/utils/dates";

export function useMotivationalPhrase(isOverLimit: boolean, trigger?: unknown): string {
  const [phrase, setPhrase] = useState(() => pickRandom(PHRASES.motivation));

  useEffect(() => {
    const pool = isOverLimit ? PHRASES.support_after_failure : PHRASES.motivation;
    setPhrase(pickRandom(pool));
  }, [isOverLimit, trigger]);

  return phrase;
}
