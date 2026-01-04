import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NamasteTerminology } from './namaste-terminology.schema';

@Injectable()
export class NamasteRepository {
  constructor(
    @InjectModel(NamasteTerminology.name)
    private namasteModel: Model<NamasteTerminology>,
  ) {}

  async create(terminology: Partial<NamasteTerminology>): Promise<NamasteTerminology> {
    const createdTerminology = new this.namasteModel(terminology);
    return createdTerminology.save();
  }

  async createMany(terminologies: Partial<NamasteTerminology>[]): Promise<NamasteTerminology[]> {
    return this.namasteModel.insertMany(terminologies, { ordered: false }); // Continue on error
  }

  async findAll(): Promise<NamasteTerminology[]> {
    return this.namasteModel.find();
  }

  async findByCode(code: string): Promise<NamasteTerminology | null> {
    return this.namasteModel.findOne({ code });
  }

  async findByFilter(filter: string): Promise<NamasteTerminology[]> {
    const searchTerm = filter.toLowerCase().trim();
    
    return this.namasteModel.find({
      $or: [
        { code: { $regex: searchTerm, $options: 'i' } },
        { display: { $regex: searchTerm, $options: 'i' } },
        { synonyms: { $regex: searchTerm, $options: 'i' } },
        { definition: { $regex: searchTerm, $options: 'i' } },
      ],
    });
  }

  async count(): Promise<number> {
    return this.namasteModel.countDocuments();
  }

  async deleteAll(): Promise<any> {
    return this.namasteModel.deleteMany({});
  }
}