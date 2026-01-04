import { Injectable } from '@nestjs/common';
import { FhirRepository } from '../database/fhir.repository';
import { ConceptMapService } from '../terminology/conceptmap.service';

@Injectable()
export class BundleService {
  constructor(
    private readonly conceptMapService: ConceptMapService,
    private readonly fhirRepository: FhirRepository,
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
      if (derivedMappings && derivedMappings.result === true && derivedMappings.match) {
        const icd11Coding = {
          system: 'http://hl7.org/fhir/sid/icd-11',
          code: derivedMappings.match[0].code,
          display: derivedMappings.match[0].display
        };
        condition.code.coding.push(icd11Coding);
      }
    }

    // Save the validated and potentially updated bundle to the database
    const savedBundle = await this.fhirRepository.save(bundle);
    
    return {
      resourceType: 'OperationOutcome',
      issue: [
        {
          severity: 'information',
          code: 'informational',
          diagnostics: 'Bundle saved successfully',
          details: {
            text: JSON.stringify({
              bundleId: savedBundle._id,
              namasteCode: namasteCoding.code,
              derivedMappings,
            }),
          },
        },
      ],
    };
  }

  async getBundle(mongoId: string) {
    // Retrieve a bundle by MongoDB _id from the database
    const bundle = await this.fhirRepository.findByMongoId(mongoId);
    return bundle;
  }

  async getAllBundles() {
    // Retrieve all bundles from the database
    // Using exists check to find all bundles by resourceType
    // First, we need to get all bundle resources
    const bundles = await this.fhirRepository['model'].find({ resourceType: 'Bundle' }).lean().exec();
    return bundles;
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
