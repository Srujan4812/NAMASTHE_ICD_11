import { Body, Controller, Post } from '@nestjs/common';
import { ConceptMapService } from './conceptmap.service';

@Controller('ConceptMap')
export class ConceptMapController {
  constructor(private readonly service: ConceptMapService) {
    console.log('✅ ConceptMapController LOADED');
  }

  @Post('$translate')
  async translate(@Body() body: any) {
    const code = body?.code;
    const system = body?.system;
    const targetSystem = body?.targetSystem;

    if (!code || !system || !targetSystem) {
      return {
        resourceType: 'OperationOutcome',
        issue: [
          {
            severity: 'error',
            code: 'invalid',
            diagnostics: 'code, system, and targetSystem are required',
          },
        ],
      };
    }

    const result = await this.service.translate(code, system, targetSystem);

    if (!result) {
      return {
        resourceType: 'OperationOutcome',
        issue: [
          {
            severity: 'information',
            code: 'not-found',
            diagnostics: 'No mapping found for the given code',
          },
        ],
      };
    }

    /* ---------- DIRECT ---------- */
    if ('direct' in result) {
      return {
        resourceType: 'Parameters',
        parameter: result.direct.map((t) => ({
          name: 'match',
          part: [
            { name: 'code', valueCode: t.code },
            { name: 'display', valueString: t.display },
            { name: 'equivalence', valueCode: t.equivalence },
          ],
        })),
      };
    }

    /* ---------- CHAINED ---------- */
    if ('chained' in result) {
      return {
        resourceType: 'Parameters',
        parameter: result.chained.map((c) => ({
          name: 'dual-match',
          part: [
            { name: 'tm2-code', valueCode: c.tm2.code },
            { name: 'tm2-display', valueString: c.tm2.display },
            { name: 'bio-code', valueCode: c.bio[0].code },
            { name: 'bio-display', valueString: c.bio[0].display },
          ],
        })),
      };
    }
  }
}
