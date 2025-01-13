// src/components/FlashCard.tsx
'use client';

import { useState, useCallback } from 'react';

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

  const handleClick = () => {
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
      className="min-h-screen flex items-center justify-center bg-gray-100 p-4"
      onClick={handleClick}
    >
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full cursor-pointer">
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
            <div className="min-h-[200px] flex items-center justify-center">
              <p className="text-xl">
                {showAnswer 
                  ? cards[currentIndex].answer
                  : cards[currentIndex].question}
              </p>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              タップして{showAnswer ? '次の問題' : '答え'}を表示
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
