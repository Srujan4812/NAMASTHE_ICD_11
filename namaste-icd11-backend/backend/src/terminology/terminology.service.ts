import { Injectable } from '@nestjs/common';
import { loadNamasteCsv } from './ingestion/namaste-csv.loader';
import { buildNamasteCodeSystem } from './ingestion/namaste-codesystem.builder';

@Injectable()
export class TerminologyService {

  constructor() {
    console.log('NAMASTE terminology service initialized - fetching directly from CSV');
  }

  /**
   * Get NAMASTE code system directly from CSV
   */
  private getNamasteCodeSystem() {
    // Load fresh data from CSV each time to ensure latest data
    const rows = loadNamasteCsv();
    return buildNamasteCodeSystem(rows);
  }

  /**
   * Enhanced search functionality to find codes from CSV
   */
  expandValueSet(filter: string) {
    const codeSystem = this.getNamasteCodeSystem();
    const concepts = codeSystem.concept || [];

    // Enhanced search to match partial terms, synonyms, and various patterns
    const filtered = concepts.filter((c: any) => {
      const searchTerm = filter.toLowerCase().trim();
      
      // Check if the search term matches the code, display, or synonyms
      const codeMatch = c.code.toLowerCase().includes(searchTerm);
      const displayMatch = c.display.toLowerCase().includes(searchTerm);
      
      // Check synonyms if they exist
      let synonymsMatch = false;
      if (c.property && Array.isArray(c.property)) {
        for (const prop of c.property) {
          if (prop.code === 'synonym' && 
              prop.valueString && 
              prop.valueString.toLowerCase().includes(searchTerm)) {
            synonymsMatch = true;
            break;
          }
        }
      }
      
      return codeMatch || displayMatch || synonymsMatch;
    });

    return {
      resourceType: 'ValueSet',
      status: 'active',
      expansion: {
        timestamp: new Date().toISOString(),
        total: filtered.length,
        contains: filtered.map((c: any) => ({
          system: codeSystem.url,
          code: c.code,
          display: c.display,
          definition: c.definition, // Include definition for better UX
          synonyms: c.property?.find((p: any) => p.code === 'synonym')?.valueString, // Include synonyms
        })),
      },
    };
  }
}