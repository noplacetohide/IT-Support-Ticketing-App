import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUser: Partial<User>): Promise<User> {
    const created = new this.userModel(createUser);
    return created.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email: email.toLowerCase().trim() }).exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.formatUserResponse(user);
  }

  async findAll(): Promise<User[]> {
    const users =await  this.userModel.find().exec();
    if(!users){
      throw new NotFoundException('Users not found');
    }
    const response = users.map((user) => this.formatUserResponse(user)); 
    return response;
  }

  private formatUserResponse(user: any): any {
    return {
      id:  user._id,
      name: user.name,
    };
  }
}
