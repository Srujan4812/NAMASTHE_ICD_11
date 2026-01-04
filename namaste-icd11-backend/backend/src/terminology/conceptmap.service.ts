import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

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
  constructor(
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async translate(
    code: string,
    system: string,
    targetSystem: string,
  ): Promise<TranslateResult> {
    const collection = this.connection.collection('conceptmaps');

    /* ---------- DIRECT MAP ---------- */
    const directMap = await collection.findOne({
      resourceType: 'ConceptMap',
      sourceUri: system,
      targetUri: targetSystem,
      status: 'active',
    });

    if (directMap) {
      for (const group of directMap.group || []) {
        for (const element of group.element || []) {
          if (element.code === code) {
            return {
              direct: element.target || [],
            };
          }
        }
      }
    }

    /* ---------- CHAIN: NAMASTE → TM2 → BIO ---------- */
    if (
      system === 'http://example.org/fhir/CodeSystem/NAMASTE' &&
      targetSystem === 'http://id.who.int/icd11/mms'
    ) {
      const tm2Result = await this.translate(
        code,
        system,
        'http://id.who.int/icd11/mms/tm2',
      );

      if (!tm2Result || !('direct' in tm2Result) || tm2Result.direct.length === 0) {
        return null;
      }

      const chainedResults: ChainedResult[] = [];

      for (const tm2 of tm2Result.direct) {
        const bioResult = await this.translate(
          tm2.code,
          'http://id.who.int/icd11/mms/tm2',
          'http://id.who.int/icd11/mms',
        );

        if (bioResult && 'direct' in bioResult && bioResult.direct.length > 0) {
          chainedResults.push({
            tm2,
            bio: bioResult.direct,
          });
        }
      }

      if (chainedResults.length === 0) {
        return null;
      }

      return {
        chained: chainedResults,
      };
    }

    return null;
  }
}
