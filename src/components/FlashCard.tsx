// src/components/FlashCard.tsx
'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

type FlashCard = {
  question: string;
  answer: string;
};

type Props = {
  initialCards: FlashCard[];
};

// Fisher-Yatesアルゴリズムによる配列のシャッフル
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function FlashCardComponent({ initialCards }: Props) {
  const shuffleCards = useCallback(() => shuffleArray(initialCards), [initialCards]);
  const [cards, setCards] = useState(() => shuffleCards());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [charIndex, setCharIndex] = useState(-1);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // 現在表示すべきテキストを計算
  const displayedText = showAnswer 
    ? cards[currentIndex].answer
    : cards[currentIndex].question.slice(0, charIndex + 1);

  // 問題文を1文字ずつ表示する
  useEffect(() => {
    if (showAnswer || completed) {
      setCharIndex(-1);
      return;
    }

    const questionLength = cards[currentIndex].question.length;
    setCharIndex(-1); // リセット

    intervalRef.current = setInterval(() => {
      setCharIndex(prev => {
        if (prev + 1 >= questionLength) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return prev;
        }
        return prev + 1;
      });
    }, 150); // 早押しクイズに適した間隔

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentIndex, showAnswer, completed, cards]);

  const handleClick = () => {
    // アニメーション中のクリックで答えを表示
    const isAnimating = charIndex >= 0 && charIndex < cards[currentIndex].question.length - 1;
    if (isAnimating) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setCharIndex(-1);
      setShowAnswer(true);
      return;
    }

    if (completed) {
      setCards(shuffleCards()); // 最初からやり直す時に再シャッフル
      setCurrentIndex(0);
      setShowAnswer(false);
      setCompleted(false);
      return;
    }

    if (showAnswer && currentIndex === cards.length - 1) {
      setCompleted(true);
      return;
    }

    if (showAnswer) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      setShowAnswer(true);
    }
  };

  return (
    <div 
      className="h-full flex items-center justify-center bg-gray-100 p-2 sm:p-4"
      onClick={handleClick}
    >
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 max-w-md w-full cursor-pointer">
        {completed ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600">
              おめでとうございます！
            </h2>
            <p className="mt-4 text-gray-600">
              すべてのカードを完了しました。
              タップして最初からやり直せます。
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              {currentIndex + 1} / {cards.length}
            </p>
            <div className="min-h-[180px] sm:min-h-[240px] flex">
              <p className={`text-xl w-full ${
                showAnswer 
                  ? 'text-blue-600 text-center flex items-center justify-center' 
                  : 'text-black pt-4'
              }`}>
                {displayedText}
              </p>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              {(charIndex >= 0 && charIndex < cards[currentIndex].question.length - 1)
                ? 'タップして答えを表示'
                : `タップして${showAnswer ? '次の問題' : '答え'}を表示`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
