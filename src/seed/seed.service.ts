import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,
  ){}
  
  async runSeed() {
    await this.insertNewProducts();
    return `Seed executed!`;
  }

  private async insertNewProducts() {
    await this.productsService.deleteAllProducts();

    const products = initialData.products;
    const insertPromises = [];
    products.forEach( product => {
      insertPromises.push( this.productsService.create( product ) );
    });

    //Espera q todas las prmesas se cumplan
    const result = await Promise.all( insertPromises );
    return true;
  }

}