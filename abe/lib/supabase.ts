// abe/lib/supabase.ts
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const extras = Constants.expoConfig?.extra as { EXPO_PUBLIC_SUPABASE_URL?: string; EXPO_PUBLIC_SUPABASE_ANON_KEY?: string } | undefined;
const URL = extras?.EXPO_PUBLIC_SUPABASE_URL ?? '';
const KEY = extras?.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(URL ?? '', KEY ?? '', {
  auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
});
