import { Injectable } from '@nestjs/common';

/* ---------- TYPES ---------- */

type ConceptMapTarget = {
  code: string;
  display: string;
  equivalence: string;
};

type ChainedResult = {
  tm2: ConceptMapTarget;
  bio: ConceptMapTarget[];
};

type TranslateResult =
  | { direct: ConceptMapTarget[] }
  | { chained: ChainedResult[] }
  | null;

/* ---------- SERVICE ---------- */

@Injectable()
export class ConceptMapService {
  constructor() {}

  async translate(
    code: string,
    system: string,
    targetSystem: string,
  ): Promise<TranslateResult> {
    // In CSV-only mode, we can implement predefined mappings or return null
    // For now, return null to indicate no mapping found
    // This could be enhanced later with static mappings
    
    /* ---------- CHAIN: NAMASTE → TM2 → BIO ---------- */
    if (
      system === 'http://example.org/fhir/CodeSystem/NAMASTE' &&
      targetSystem === 'http://id.who.int/icd11/mms'
    ) {
      // For demonstration purposes, return a basic mapping
      // In a real implementation, you could have predefined mappings here
      const mockResult: ChainedResult = {
        tm2: {
          code: 'TM2_' + code,
          display: 'Mock TM2 mapping for ' + code,
          equivalence: 'equivalent',
        },
        bio: [{
          code: 'BIO_' + code,
          display: 'Mock ICD-11 mapping for ' + code,
          equivalence: 'equivalent',
        }],
      };
      
      return {
        chained: [mockResult],
      };
    }

    return null;
  }
}