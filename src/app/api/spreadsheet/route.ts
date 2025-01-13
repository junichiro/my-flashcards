import { getSpreadsheetData } from '../../../utils/spreadsheet';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const setIndex = parseInt(searchParams.get('set') || '');

  if (isNaN(setIndex)) {
    return NextResponse.json(
      { error: 'Invalid set index' },
      { status: 400 }
    );
  }

  try {
    const data = await getSpreadsheetData();
    const selectedSet = data[setIndex];

    if (!selectedSet) {
      return NextResponse.json(
        { error: 'Set not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(selectedSet);
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch spreadsheet data' },
      { status: 500 }
    );
  }
}
