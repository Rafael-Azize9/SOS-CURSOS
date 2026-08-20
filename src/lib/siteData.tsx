import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { COURSES, PROMOS, type Course, type Promo } from '../data';
import { SUPABASE_CONFIGURED, supabase } from './supabase';

interface DbCourseRow {
  id: string;
  name: string;
  category: string;
  hours: number;
  price: number;
  kids: boolean;
}

interface DbPromoRow {
  id: string;
  name: string;
  hours: number;
  from_price: number;
  price: number;
  icon: string;
}

interface SiteDataValue {
  courses: Course[];
  promos: Promo[];
  ready: boolean;
  configured: boolean;
  reload: () => Promise<void>;
}

const SiteDataContext = createContext<SiteDataValue | null>(null);

async function loadFromDb(): Promise<{ courses: Course[]; promos: Promo[] } | null> {
  if (!supabase) return null;
  const [coursesResult, promosResult] = await Promise.all([
    supabase.from('courses').select('id,name,category,hours,price,kids').order('name'),
    supabase.from('promos').select('id,name,hours,from_price,price,icon').order('name'),
  ]);
  if (coursesResult.error || promosResult.error) return null;

  const courses: Course[] = (coursesResult.data as DbCourseRow[] | null)?.map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    hours: Number(row.hours),
    price: Number(row.price),
    kids: Boolean(row.kids),
  })) ?? [];

  const promos: Promo[] = (promosResult.data as DbPromoRow[] | null)?.map((row) => ({
    id: row.id,
    name: row.name,
    hours: Number(row.hours),
    from: Number(row.from_price),
    price: Number(row.price),
    icon: row.icon,
  })) ?? [];

  if (courses.length === 0) return null;
  return { courses, promos };
}

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [promos, setPromos] = useState<Promo[]>(PROMOS);
  const [ready, setReady] = useState(false);

  const reload = useCallback(async () => {
    const db = await loadFromDb();
    if (db) {
      setCourses(db.courses);
      setPromos(db.promos);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const value = useMemo<SiteDataValue>(
    () => ({ courses, promos, ready, configured: SUPABASE_CONFIGURED, reload }),
    [courses, promos, ready, reload]
  );

  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export function useSiteData(): SiteDataValue {
  const value = useContext(SiteDataContext);
  if (!value) throw new Error('useSiteData deve ser usado dentro de <SiteDataProvider>');
  return value;
}