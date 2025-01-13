// src/app/page.tsx
import { getSpreadsheetData } from '../utils/spreadsheet';
import Link from 'next/link';
import styles from './page.module.css';

export default async function Page() {
  const cardSets = await getSpreadsheetData();
  
  return (
    <div className={styles.container}>
      <div className="min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          フラッシュカード セット一覧
        </h1>
        
        {cardSets.length > 0 ? (
          <div className="max-w-2xl mx-auto">
            <ul className="space-y-4">
              {cardSets.map((set, index) => (
                <li key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <Link 
                    href={`/flashcard?set=${index}`}
                    className="block p-6"
                  >
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {set.title}
                      </h2>
                      <span className="text-gray-600">
                        {set.cards.length}枚のカード
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-red-500 mb-4">
              カードセットの読み込みに失敗しました。
            </p>
            <p className="text-gray-600">
              読み込まれたセット数: {cardSets.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
