'use client';

import { useState, useEffect } from 'react';
import { getCollection, getCollectionUnordered } from '@/lib/firestore';
import { COLLECTIONS } from '@/lib/firestore-types';
import type {
  HeroSlide,
  IntroPoint,
  Testimonial,
  Partner,
  FeaturedProject,
  AboutStat,
  WhatSetsApart,
  Leadership,
  ServiceItem,
  ScopeOfWorkItem,
  ExecutionProcessItem,
} from '@/lib/firestore-types';

function useFirestoreCollection<T>(collectionName: string | null) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!collectionName) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getCollection<T>(collectionName)
      .then((list) => {
        if (!cancelled) setData(list);
      })
      .catch((e) => {
        if (!cancelled) setError(e);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [collectionName]);

  return { data, loading, error };
}

export function useHeroSlides() {
  return useFirestoreCollection<HeroSlide>(COLLECTIONS.HERO_SLIDES);
}

export function useIntroPoints() {
  return useFirestoreCollection<IntroPoint>(COLLECTIONS.INTRO_POINTS);
}

export function useTestimonials() {
  return useFirestoreCollection<Testimonial>(COLLECTIONS.TESTIMONIALS);
}

export function usePartners() {
  return useFirestoreCollection<Partner>(COLLECTIONS.PARTNERS);
}

export function useFeaturedProjects() {
  return useFirestoreCollection<FeaturedProject>(COLLECTIONS.FEATURED_PROJECTS);
}

export function useAboutStats() {
  return useFirestoreCollection<AboutStat>(COLLECTIONS.ABOUT_STATS);
}

export function useWhatSetsApart() {
  return useFirestoreCollection<WhatSetsApart>(COLLECTIONS.WHAT_SETS_APART);
}

export function useLeadership() {
  return useFirestoreCollection<Leadership>(COLLECTIONS.LEADERSHIP);
}

export function useServices() {
  return useFirestoreCollection<ServiceItem>(COLLECTIONS.SERVICES);
}

export function useScopeOfWork() {
  return useFirestoreCollection<ScopeOfWorkItem>(COLLECTIONS.SCOPE_OF_WORK);
}

export function useExecutionProcess() {
  return useFirestoreCollection<ExecutionProcessItem>(COLLECTIONS.EXECUTION_PROCESS);
}

// Contact submissions: fetch unordered and sort by createdAt desc in component
export function useContactSubmissions() {
  const [data, setData] = useState<import('@/lib/firestore-types').ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getCollectionUnordered<import('@/lib/firestore-types').ContactSubmission>(COLLECTIONS.CONTACT_SUBMISSIONS)
      .then((list) => {
        if (!cancelled) {
          const sorted = list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
          setData(sorted);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return { data, loading, error };
}
