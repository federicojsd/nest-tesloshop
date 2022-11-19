import { Product } from "../../products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true,
    })
    email: string;

    @Column('text', {
        select: false,
    })
    password: string;

    @Column('text')
    fullName: string;

    @Column('bool',{
        default: true,
    })
    isActive: boolean;

    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[];

    @OneToMany(
        ( ) => Product,
        ( product ) => product.user
    )
    product: Product;

    @BeforeInsert()
    checkFieldsBeforeInser() {
        this.checkFields()
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFields()
    }

    checkFields(){
        this.email = this.email.toLocaleLowerCase().trim();
    }

}
