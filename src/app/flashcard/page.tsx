'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import FlashCardComponent from '../../components/FlashCard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FlashCardSet {
  title: string;
  cards: { question: string; answer: string }[];
}

export default function FlashCardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [cardSets, setCardSets] = useState<FlashCardSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/spreadsheet');
      const data = await response.json();
      setCardSets(data);
      setIsLoading(false);
      
      const setParam = searchParams.get('set');
      const setIndex = parseInt(
        Array.isArray(setParam) ? setParam[0] : setParam ?? ''
      );
      
      if (isNaN(setIndex) || setIndex < 0 || setIndex >= data.length) {
        router.push('/');
      }
    };

    fetchData();
  }, [searchParams, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const setParam = searchParams.get('set');
  const setIndex = parseInt(
    Array.isArray(setParam) ? setParam[0] : setParam ?? ''
  );
  
  // セットが指定されていないか、無効な場合はトップページにリダイレクト
  if (isNaN(setIndex) || setIndex < 0 || setIndex >= cardSets.length) {
    router.push('/');
  }

  const selectedSet = cardSets[setIndex];
  
  return (
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
  );
}
