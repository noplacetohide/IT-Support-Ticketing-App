import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Ticket, TicketDocument } from './schemas/ticket.schema';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketQueryDto } from './dto/ticket-query.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>,
    private usersService: UsersService,
  ) {}

  async create(createTicketDto: CreateTicketDto, userId: string): Promise<any> {
    try {
      const ticketData = {
        ...createTicketDto,
        created_by: new Types.ObjectId(userId),
        assignee: createTicketDto.assignee
          ? new Types.ObjectId(createTicketDto.assignee)
          : null,
      };

      const ticket = new this.ticketModel(ticketData);
      const savedTicket = await ticket.save();

      return this.populateUserData(savedTicket);
    } catch (error) {
      if (error.kind === 'ObjectId') {
        throw new BadRequestException('Invalid user ID');
      }
      throw error;
    }
  }

  async findAll(queryDto: TicketQueryDto, userId?: string): Promise<any> {
    const { page = 1, limit = 100, status, assignee, priority, due_date, created_at } = queryDto;

    const filter: any = { is_deleted: false };

    if (status?.length) filter.status = { $in: status };
    if (assignee?.length) filter.assignee = { $in: assignee.map((a) => new Types.ObjectId(a)) };
    if (priority?.length) filter.priority = { $in: priority };

    if (due_date) {
      const startDate = new Date(due_date);
      const endDate = new Date(due_date);
      endDate.setDate(endDate.getDate() + 1);
      filter.due_date = { $gte: startDate, $lt: endDate };
    }

    if (created_at) {
      const startDate = new Date(created_at);
      const endDate = new Date(created_at);
      endDate.setDate(endDate.getDate() + 1);
      filter.createdAt = { $gte: startDate, $lt: endDate };
    }

    const skip = (page - 1) * limit;
    const total = await this.ticketModel.countDocuments(filter);

    const tickets = await this.ticketModel
      .find(filter)
      .populate('assignee', 'name')
      .populate('created_by', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    // Format the response
    const formattedTickets = tickets.map((ticket) => this.formatTicketResponse(ticket));

    return {
      data: formattedTickets,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<any> {
    try {
      const ticket = await this.ticketModel
        .findById(new Types.ObjectId(id))
        .populate('assignee', 'name')
        .populate('created_by', 'name')
        .exec();

      if (!ticket || ticket.is_deleted) {
        throw new NotFoundException('Ticket not found');
      }

      return this.formatTicketResponse(ticket);
    } catch (error) {
      if (error.kind === 'ObjectId') {
        throw new NotFoundException('Ticket not found');
      }
      throw error;
    }
  }

  async update(id: string, updateTicketDto: UpdateTicketDto): Promise<any> {
    try {
      const updateData: any = { ...updateTicketDto };

      if (updateTicketDto.assignee) {
        updateData.assignee = new Types.ObjectId(updateTicketDto.assignee);
      }

      const ticket = await this.ticketModel
        .findByIdAndUpdate(new Types.ObjectId(id), updateData, {
          new: true,
        })
        .populate('assignee', 'name')
        .populate('created_by', 'name')
        .exec();

      if (!ticket || ticket.is_deleted) {
        throw new NotFoundException('Ticket not found');
      }

      return this.formatTicketResponse(ticket);
    } catch (error) {
      if (error.kind === 'ObjectId') {
        throw new NotFoundException('Ticket not found');
      }
      throw error;
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const result = await this.ticketModel
        .findByIdAndUpdate(
          new Types.ObjectId(id),
          { is_deleted: true },
          { new: true },
        )
        .exec();

      if (!result) {
        throw new NotFoundException('Ticket not found');
      }
      return {success: true}
    } catch (error) {
      if (error.kind === 'ObjectId') {
        throw new NotFoundException('Ticket not found');
      }
      throw error;
    }
  }

  private async populateUserData(ticket: TicketDocument): Promise<any> {
    await ticket.populate([
      { path: 'assignee', select: 'name' },
      { path: 'created_by', select: 'name' },
    ]);

    return this.formatTicketResponse(ticket);
  }

  private formatTicketResponse(ticket: any): any {
    return {
      _id: ticket._id,
      title: ticket.title,
      description: ticket.description,
      due_date: ticket.due_date,
      priority: ticket.priority,
      status: ticket.status,
      assignee: ticket?.assignee
        ? {
            id: ticket.assignee._id,
            name: ticket.assignee.name,
          }
        : null,
      created_by: {
        id: ticket.created_by._id,
        name: ticket.created_by.name,
      },
      is_deleted: ticket.is_deleted,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };
  }
}
