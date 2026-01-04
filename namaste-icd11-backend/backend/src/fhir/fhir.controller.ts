import { Controller, Get } from '@nestjs/common';

@Controller('fhir')
export class FhirController {

  @Get('metadata')
  getMetadata() {
    return {
      resourceType: "CapabilityStatement",
      status: "active",
      date: new Date().toISOString(),
      kind: "instance",
      fhirVersion: "4.0.1",
      format: ["json"],
      rest: [
        {
          mode: "server",
          resource: [
            { type: "CodeSystem" },
            { type: "ValueSet" },
            { type: "ConceptMap" },
            { type: "Condition" },
            { type: "Bundle" }
          ]
        }
      ]
    };
  }
}
