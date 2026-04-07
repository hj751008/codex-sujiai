import AsyncStorage from "@react-native-async-storage/async-storage";
import type { LearnerProfileRecord } from "@/lib/supabase/schema";

const LEARNER_CACHE_KEY = "sujimathai.parentLearners";

export async function loadCachedLearners() {
  const raw = await AsyncStorage.getItem(LEARNER_CACHE_KEY);

  if (!raw) {
    return [] as LearnerProfileRecord[];
  }

  return JSON.parse(raw) as LearnerProfileRecord[];
}

export async function saveCachedLearners(learners: LearnerProfileRecord[]) {
  await AsyncStorage.setItem(LEARNER_CACHE_KEY, JSON.stringify(learners));
}
