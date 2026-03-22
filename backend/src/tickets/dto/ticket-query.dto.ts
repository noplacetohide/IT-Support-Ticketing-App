import { IsOptional, IsEnum, IsMongoId, IsDateString, IsArray, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { TicketPriority, TicketStatus } from '../schemas/ticket.schema';

export class TicketQueryDto {
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsArray()
  @IsEnum(TicketStatus, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  status?: TicketStatus[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  assignee?: string[];

  @IsOptional()
  @IsArray()
  @IsEnum(TicketPriority, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  priority?: TicketPriority[];

  @IsOptional()
  @IsDateString()
  due_date?: string;

  @IsOptional()
  @IsDateString()
  created_at?: string;
}
