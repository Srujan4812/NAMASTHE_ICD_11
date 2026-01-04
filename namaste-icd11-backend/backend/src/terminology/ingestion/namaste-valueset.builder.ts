export function buildNamasteValueSet() {
  return {
    resourceType: 'ValueSet',
    id: 'namaste-all',
    url: 'http://namaste.gov.in/ValueSet/namaste-all',
    version: '1.0.0',
    name: 'NAMASTEAll',
    title: 'All NAMASTE AYUSH Codes',
    status: 'active',
    experimental: false,
    compose: {
      include: [
        {
          system: 'http://namaste.gov.in/CodeSystem/namaste'
        }
      ]
    }
  };
}
