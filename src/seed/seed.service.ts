import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ){}
  

/*
  --> RUN SEED
*/
  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.inserUsers();

    await this.insertNewProducts( adminUser);
    return `Seed executed!`;
  }


/*
  --> DELETE TABLES
*/
  private async deleteTables() {
    await this.productsService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute();
  }


/*
  --> INSERT USERS
*/
  private async inserUsers() {
    const seedUsers = initialData.users;
    const users: User[] = [];

    seedUsers.forEach( user => {
      const { password, ...userData } = user;
      const userToPush = this.userRepository.create({
        ...userData, 
        password: bcrypt.hashSync(password, 10) 
      })
      users.push(userToPush)
    });

    const dbUsers = await this.userRepository.save( users );
    return dbUsers[1];
  }


/*
  --> INSERT PRODUCTS
*/
  private async insertNewProducts(user: User) {
    await this.productsService.deleteAllProducts();

    const products = initialData.products;
    const insertPromises = [];
    products.forEach( product => {
      insertPromises.push( this.productsService.create( product, user ) );
    });

    //Espera q todas las prmesas se cumplan
    const result = await Promise.all( insertPromises );
    return true;
  }

}
