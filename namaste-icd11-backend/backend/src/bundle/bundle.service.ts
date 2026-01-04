import { Injectable } from '@nestjs/common';
import { ConceptMapService } from '../terminology/conceptmap.service';

// In-memory storage for bundles (for CSV-only mode)
const bundleStorage: Map<string, any> = new Map();
let bundleCounter = 1;

@Injectable()
export class BundleService {
  constructor(
    private readonly conceptMapService: ConceptMapService,
  ) {}

  async saveBundle(bundle: any) {
    /* ----------------------------------
       STEP 3 — STRUCTURAL VALIDATION
    -----------------------------------*/

    if (!bundle || bundle.resourceType !== 'Bundle') {
      return this.outcomeError('Request body is not a FHIR Bundle');
    }

    if (!Array.isArray(bundle.entry)) {
      return this.outcomeError('Bundle.entry must be an array');
    }

    const resourceTypes = bundle.entry
      .map((e: any) => e?.resource?.resourceType)
      .filter(Boolean);

    const required = ['Patient', 'Encounter', 'Condition'];

    for (const r of required) {
      if (!resourceTypes.includes(r)) {
        return this.outcomeError(`Missing required resource: ${r}`);
      }
    }

    const allowed = new Set(required);
    const unsupported = resourceTypes.filter(r => !allowed.has(r));

    if (unsupported.length > 0) {
      return this.outcomeError(
        `Unsupported resource types in Bundle: ${unsupported.join(', ')}`,
      );
    }

    console.log('Bundle structure validated');
    console.log('Resources:', resourceTypes);

    /* ----------------------------------
       STEP 4 — TERMINOLOGY LOGIC
    -----------------------------------*/

    const conditionEntry = bundle.entry.find(
      (e: any) => e.resource?.resourceType === 'Condition',
    );

    const condition = conditionEntry?.resource;

    if (!condition?.code?.coding || !Array.isArray(condition.code.coding)) {
      return this.outcomeError('Condition.code.coding is required');
    }

    const namasteCoding = condition.code.coding.find(
      (c: any) =>
        c.system === 'http://namaste.gov.in/CodeSystem/namaste',
    );

    if (!namasteCoding?.code) {
      return this.outcomeError('NAMASTE coding is required in Condition');
    }

    const hasIcd11 = condition.code.coding.some(
      (c: any) =>
        typeof c.system === 'string' && c.system.includes('icd11'),
    );

    let derivedMappings: any = null;

    if (!hasIcd11) {
      derivedMappings = await this.conceptMapService.translate(
        namasteCoding.code,
        'http://namaste.gov.in/CodeSystem/namaste',
        'https://icd.who.int/CodeSystem/icd11',
      );
      
      // Add the ICD-11 mapping to the condition if found
      if (derivedMappings && derivedMappings.chained) {
        for (const chained of derivedMappings.chained) {
          const icd11Coding = {
            system: 'http://hl7.org/fhir/sid/icd-11',
            code: chained.bio[0].code,
            display: chained.bio[0].display
          };
          condition.code.coding.push(icd11Coding);
        }
      }
    }

    // Save the validated and potentially updated bundle to in-memory storage
    const bundleId = `bundle-${bundleCounter++}`;
    bundleStorage.set(bundleId, bundle);
    
    return {
      resourceType: 'OperationOutcome',
      issue: [
        {
          severity: 'information',
          code: 'informational',
          diagnostics: 'Bundle saved successfully',
          details: {
            text: JSON.stringify({
              bundleId: bundleId,
              namasteCode: namasteCoding.code,
              derivedMappings,
            }),
          },
        },
      ],
    };
  }

  async getBundle(bundleId: string) {
    // Retrieve a bundle by ID from in-memory storage
    const bundle = bundleStorage.get(bundleId);
    if (!bundle) {
      return null;
    }
    return bundle;
  }

  async getAllBundles() {
    // Retrieve all bundles from in-memory storage
    return Array.from(bundleStorage.values());
  }
  
  private outcomeError(message: string) {
    return {
      resourceType: 'OperationOutcome',
      issue: [
        {
          severity: 'error',
          code: 'invalid',
          diagnostics: message,
        },
      ],
    };
  }
}