import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketQueryDto } from './dto/ticket-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Post()
  create(@Body() createTicketDto: CreateTicketDto, @Request() req: any) {
    return this.ticketsService.create(createTicketDto, req.user._id);
  }

  @Get()
  findAll(@Query() queryDto: TicketQueryDto, @Request() req: any) {
    return this.ticketsService.findAll(queryDto, req.user._id);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.ticketsService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    return this.ticketsService.update(id, updateTicketDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.ticketsService.delete(id);
  }
}
