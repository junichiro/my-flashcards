// src/utils/spreadsheet.ts
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export type FlashCard = {
  question: string;
  answer: string;
};

export type FlashCardSet = {
  title: string;
  cards: FlashCard[];
};

export async function getSpreadsheetData(): Promise<FlashCardSet[]> {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS || '');
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    if (!spreadsheetId || !credentials) {
      throw new Error('環境変数が設定されていません');
    }

    const serviceAccountAuth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const doc = new GoogleSpreadsheet(spreadsheetId, serviceAccountAuth);
    await doc.loadInfo();
    console.log('Spreadsheet title:', doc.title); // スプレッドシートの読み込み確認
    
    // 全シートのデータを取得
    const cardSets: FlashCardSet[] = [];
    
    for (const sheet of doc.sheetsByIndex) {
      console.log('Processing sheet:', sheet.title); // シート名確認
      
      const rows = await sheet.getRows();
      console.log('Rows loaded:', rows.length); // 行数確認

      const cards = rows.map(row => ({
        question: row.get('question'),
        answer: row.get('answer'),
      }));

      cardSets.push({
        title: sheet.title,
        cards: cards,
      });
      
      console.log('Processed cards for sheet:', sheet.title, cards); // 処理後のデータ確認
    }

    return cardSets;

  } catch (error) {
    console.error('スプレッドシートの読み込みエラーの詳細:', error);
    return [];
  }
}
