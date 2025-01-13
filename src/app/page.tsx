// src/app/page.tsx
import { getSpreadsheetData } from '../utils/spreadsheet';
import FlashCardComponent from '../components/FlashCard';
import styles from './page.module.css'; // CSSモジュールをインポート

export default async function Page() {
  const cards = await getSpreadsheetData();
  
  return (
    <div className={styles.container}> {/* コンテナクラスを適用 */}
      {cards.length > 0 ? (
        <FlashCardComponent initialCards={cards} />
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <p className="text-red-500 mb-4">
              カードの読み込みに失敗しました。
            </p>
            <p className="text-gray-600">
              読み込まれたカード数: {cards.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
