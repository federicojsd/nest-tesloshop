import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>) {}


/*
  --> CREATE USER
*/
  async create(createUserDto: CreateUserDto) {
    try {

      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });
      await this.userRepository.save(user);
      delete user.password;

      return user;

    } catch (error) {
      this.handleDBErrors(error);
    }
  }


/*
  --> LOGIN USER
*/
  async login(loginUserDto: LoginUserDto) {

    const { password, email } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true}
      });

    if( !user || !bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid');

    return user;
  }

/*
  --> HANDLE ERRORS
*/
  private handleDBErrors( error: any): never {
    if(error.code === '23505')
      throw new BadRequestException(error.detail);

    console.log(error);
    throw new InternalServerErrorException(`Something went wrong, please check logs!`);
  }

}
