import { Controller, Get, Query } from '@nestjs/common';
import { TerminologyService } from './terminology.service';

@Controller('ValueSet')
export class TerminologyController {
  constructor(private readonly terminologyService: TerminologyService) {}

  @Get('$expand')
  expand(@Query('filter') filter: string) {
    return this.terminologyService.expandValueSet(filter || '');
  }
}
