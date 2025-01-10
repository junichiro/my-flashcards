// src/utils/spreadsheet.ts
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export type FlashCard = {
  question: string;
  answer: string;
};

export async function getSpreadsheetData(): Promise<FlashCard[]> {
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
    
    const sheet = doc.sheetsByIndex[0];
    console.log('Sheet title:', sheet.title); // シート名確認
    
    const rows = await sheet.getRows();
    console.log('Rows loaded:', rows.length); // 行数確認

    const cards = rows.map(row => ({
      question: row.get('question'),
      answer: row.get('answer'),
    }));

    console.log('Processed cards:', cards); // 処理後のデータ確認
    return cards;

  } catch (error) {
    console.error('スプレッドシートの読み込みエラーの詳細:', error);
    return [];
  }
}