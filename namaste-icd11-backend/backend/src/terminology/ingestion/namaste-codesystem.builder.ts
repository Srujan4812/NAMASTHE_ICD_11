import { NamasteCsvRow } from './namaste-csv.loader';

export function buildNamasteCodeSystem(rows: NamasteCsvRow[]) {
  return {
    resourceType: 'CodeSystem',
    id: 'namaste',
    url: 'http://namaste.gov.in/CodeSystem/namaste',
    version: '1.0.0',
    name: 'NAMASTE',
    title: 'NAMASTE AYUSH Terminology',
    status: 'active',
    experimental: false,
    content: 'complete',
    concept: rows.map(row => ({
      code: row.code,
      display: row.display,
      definition: row.definition,
      property: row.synonyms
        ? [
            {
              code: 'synonym',
              valueString: row.synonyms
            }
          ]
        : []
    }))
  };
}
