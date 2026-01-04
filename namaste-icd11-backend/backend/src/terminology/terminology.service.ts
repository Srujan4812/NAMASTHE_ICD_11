import { Injectable, OnModuleInit } from '@nestjs/common';
import { loadNamasteCsv } from './ingestion/namaste-csv.loader';
import { NamasteRepository } from '../database/namaste.repository';
import { NamasteCsvRow } from './ingestion/namaste-csv.loader';
import { NamasteTerminology } from '../database/namaste-terminology.schema';

@Injectable()
export class TerminologyService implements OnModuleInit {
  constructor(private readonly namasteRepository: NamasteRepository) {}

  async onModuleInit() {
    console.log('NAMASTE terminology service initialized - checking database for data');
    
    // Check if terminology data exists in the database
    const count = await this.namasteRepository.count();
    
    if (count === 0) {
      console.log('No NAMASTE terminology data found in database. Loading from CSV...');
      await this.loadTerminologyFromCsv();
    } else {
      console.log(`Found ${count} NAMASTE terminology entries in database`);
    }
  }

  private async loadTerminologyFromCsv() {
    try {
      // Load data from CSV
      const rows: NamasteCsvRow[] = loadNamasteCsv();
      
      // Transform CSV rows to database format
      const terminologyData = rows.slice(1).map(row => ({
        code: row.code,
        display: row.display,
        definition: row.definition,
        synonyms: row.synonyms,
        category: row.category,
      }));

      // Save to database
      await this.namasteRepository.createMany(terminologyData);
      console.log(`Loaded ${terminologyData.length} NAMASTE terminology entries from CSV into database`);
    } catch (error) {
      console.error('Error loading terminology from CSV:', error);
    }
  }

  /**
   * Enhanced search functionality to find codes from database
   */
  async expandValueSet(filter: string) {
    // Search in database using filter
    const results = await this.namasteRepository.findByFilter(filter);
    
    return {
      resourceType: 'ValueSet',
      status: 'active',
      expansion: {
        timestamp: new Date().toISOString(),
        total: results.length,
        contains: results.map((c: any) => ({
          system: 'http://namaste.icd11/CodeSystem/namaste-codes', // Standard system URL
          code: c.code,
          display: c.display,
          definition: c.definition, // Include definition for better UX
          synonyms: c.synonyms, // Include synonyms
        })),
      },
    };
  }
}