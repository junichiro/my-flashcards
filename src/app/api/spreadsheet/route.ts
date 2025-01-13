import { getSpreadsheetData } from '../../../utils/spreadsheet';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await getSpreadsheetData();
    return NextResponse.json(data);
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch spreadsheet data' },
      { status: 500 }
    );
  }
}
