import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PaymentEntity{
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    cartId:number;
    @Column()
    paymentStatus:string
    @Column()
    userId:number
    @Column()
    amount:number
} 
