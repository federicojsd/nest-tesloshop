import { User } from "../../auth/entities/user.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        example: '1054c9c6-7908-4932-882b-cff2a312f75a',
        description: 'product uuid',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'T-Shirt',
        description: 'product title',
        uniqueItems: true
    })
    @Column('text', {
        unique: true,
    })
    title: string;

    @ApiProperty({
        example: 0,
        description: 'product price',
        default: 0
    })
    @Column('float', {
        default: 0
    })
    price: number;

    @ApiProperty({
        example: 'cotton t-shirt',
        description: 'product description'
    })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @ApiProperty({
        example: 't_shirt',
        description: 'product slug',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    slug: string;

    @ApiProperty({
        example: 1,
        description: 'product stock',
        default: 0
    })
    @Column('int', {
        default: 0
    })
    stock: number;

    @ApiProperty({
        example: ['M', 'L', 'XL'],
        description: 'product sizes'
    })
    @Column('text', {
        array: true
    })
    sizes: string[];

    @ApiProperty({
        example: 'man',
        description: 'product gender'
    })
    @Column('text')
    gender: string;

    @ApiProperty({
        example: ['cotton', 'imported'],
        description: 'product tags'
    })
    @Column('text',{
        array: true,
        default: [],
    })
    tags: string[];

    @ApiProperty({
        example: ['image.jpg', 'image.jpeg', 'image.png'],
        description: 'product images'
    })
    @OneToMany(
        ( ) => ProductImage,
        ( ProductImage ) => ProductImage.product,
        { cascade: true, eager:true }
    )
    images?: ProductImage[];

    @ManyToOne(
        ( ) => User,
        ( user ) => user.product,
        { eager: true }
    )
    user: User;

    @BeforeInsert()
    checkSlugInsert() {

        if( !this.slug ){
            this.slug = this.title;
        }
        this.slug = this.slug
        .toLocaleLowerCase()
        .replaceAll( ' ', '_' )
        .replaceAll( "'" , '' );
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        if(this.slug){
            this.slug = this.slug
            .toLocaleLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", "")
        }
    }
}
