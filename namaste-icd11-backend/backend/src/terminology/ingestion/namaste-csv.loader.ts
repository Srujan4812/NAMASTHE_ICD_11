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
  // Try multiple possible paths to find the CSV file in deployed environment
  const possiblePaths = [
    // Path when running from dist directory in deployed environment
    path.join(process.cwd(), 'data', 'namaste.csv'),
    // Path relative to the loader file
    path.join(__dirname, '..', '..', '..', 'data', 'namaste.csv'),
    // Path when running from src directory
    path.join(__dirname, '..', '..', 'data', 'namaste.csv'),
    // Path when running from root
    path.join(process.cwd(), 'namaste-icd11-backend', 'backend', 'data', 'namaste.csv'),
  ];

  let csvPath = '';
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      csvPath = p;
      break;
    }
  }

  if (!csvPath) {
    console.error('ERROR: Could not find namaste.csv file in any of the expected locations');
    console.error('Tried paths:', possiblePaths);
    throw new Error('CSV file not found');
  }

  const raw = fs.readFileSync(csvPath, 'utf-8');

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