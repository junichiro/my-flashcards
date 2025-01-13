'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import FlashCardComponent from '../../components/FlashCard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FlashCardSet {
  title: string;
  cards: { question: string; answer: string }[];
}

function FlashCardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedSet, setSelectedSet] = useState<FlashCardSet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const setParam = searchParams.get('set');
      const setIndex = parseInt(
        Array.isArray(setParam) ? setParam[0] : setParam ?? ''
      );

      if (isNaN(setIndex)) {
        router.push('/');
        return;
      }

      try {
        const response = await fetch(`/api/spreadsheet?set=${setIndex}`, {
          cache: 'no-store'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setSelectedSet(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchParams, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!selectedSet) {
    router.push('/');
    return null;
  }
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container mx-auto p-4">
        <div className="mb-4">
          <Link
            href="/"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded inline-flex items-center"
          >
            ← 戻る
          </Link>
        </div>
        <h1 className="text-2xl font-bold mb-4">{selectedSet.title}</h1>
        <FlashCardComponent initialCards={selectedSet.cards} />
      </div>
    </Suspense>
  );
}

export default function FlashCardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FlashCardContent />
    </Suspense>
  );
}
