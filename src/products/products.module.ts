import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductImage } from './entities';
import { AuthModule } from '../auth/auth.module';

@Module({
  exports: [ ProductsService, TypeOrmModule ],
  controllers: [ ProductsController ],
  providers: [ ProductsService ],
  imports: [ TypeOrmModule.forFeature([Product, ProductImage]), AuthModule]
})
export class ProductsModule {}
