import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FhirResource } from './fhir-resource.schema';

@Injectable()
export class FhirRepository {
  constructor(
    @InjectModel(FhirResource.name)
    private readonly model: Model<FhirResource>,
  ) {}

  // -------------------------------
  // WRITE (used in Phase 5)
  // -------------------------------
  async save(resource: any) {
    const meta = resource.meta ?? {};

    return this.model.create({
      resourceType: resource.resourceType,
      resourceId: resource.id,
      versionId: meta.versionId ?? '1',
      status: resource.status,
      lastUpdated: meta.lastUpdated,
      resource,
    });
  }

  // -------------------------------
  // READ — latest version (FHIR-style)
  // -------------------------------
  async findLatest(resourceType: string, resourceId: string) {
    return this.model
      .findOne({ resourceType, resourceId })
      .sort({ versionId: -1 })
      .lean()
      .exec();
  }

  // -------------------------------
  // EXISTS check
  // -------------------------------
  async exists(resourceType: string, resourceId: string): Promise<boolean> {
    return (
      (await this.model.countDocuments({ resourceType, resourceId })) > 0
    );
  }

  // -------------------------------
  // READ — by Mongo _id (Phase 7 verification only)
  // -------------------------------
  async findByMongoId(id: string) {
    return this.model.findById(id).lean().exec();
  }
}
