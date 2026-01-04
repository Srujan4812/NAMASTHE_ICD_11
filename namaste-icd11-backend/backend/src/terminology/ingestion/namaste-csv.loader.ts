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

  if (lines.length === 0) {
    return [];
  }

  const headers = lines[0].split(',').map(h => h.trim());

  const rows: NamasteCsvRow[] = [];

  // Skip the header row (index 0) and process data rows starting from index 1
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, '')); // Remove quotes if present

    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || ''; // Use empty string if value doesn't exist
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