import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BundleService } from './bundle.service';

@Controller('Bundle')
export class BundleController {
  constructor(
    private readonly bundleService: BundleService,
  ) {}

  @Post()
  async ingestBundle(@Body() bundle: any) {
    return this.bundleService.saveBundle(bundle);
  }

  // Phase 7 — verification only
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.bundleService.getBundle(id);
  }
  
  @Get()
  async getAllBundles() {
    return this.bundleService.getAllBundles();
  }
}
