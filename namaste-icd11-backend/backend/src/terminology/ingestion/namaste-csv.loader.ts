import * as fs from 'fs';
import * as path from 'path';

export interface NamasteCsvRow {
  code: string;
  display: string;
  definition: string;
  synonyms?: string;
  category?: string;
}

export function loadNamasteCsv(): NamasteCsvRow[] {
  const filePath = path.join(
    __dirname,
    '..','..','..', // Go back to src directory
    'data',
    'namaste.csv'
  );

  const raw = fs.readFileSync(filePath, 'utf-8');

  const lines = raw.split('\n').filter(line => line.trim().length > 0);

  const headers = lines[0].split(',').map(h => h.trim());

  const rows: NamasteCsvRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());

    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index];
    });

    rows.push(row as NamasteCsvRow);
  }

  return rows;
}

if (require.main === module) {
  const rows = loadNamasteCsv();
  console.log('Parsed rows:', rows.length);
  console.log(rows);
}

