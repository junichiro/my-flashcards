import { getSpreadsheetData } from '../../utils/spreadsheet';
import FlashCardComponent from '../../components/FlashCard';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function FlashCardPage({
  searchParams,
}: {
  searchParams: { set?: string };
}) {
  const cardSets = await getSpreadsheetData();
  const setIndex = parseInt(searchParams.set ?? '');
  
  // セットが指定されていないか、無効な場合はトップページにリダイレクト
  if (isNaN(setIndex) || setIndex < 0 || setIndex >= cardSets.length) {
    redirect('/');
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
