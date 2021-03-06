import {
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { Wallet } from './wallet.entity';
import { Warehouse } from './warehouse.entity';
import { Account } from './account.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  created: Date;

  @Exclude()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  updated: Date;

  @Column('text', {nullable: true})
  params: string;

  @Column({length: 512, nullable: true})
  email: string;

  @Exclude()
  @Column({length: 64, nullable: true})
  password: string;

  @OneToOne(type => Warehouse, {
    eager: true,
  })
  @JoinColumn()
  warehouseWallet: Warehouse;

  @Column('int')
  status: number;

  @Column({default: false})
  isProtected: boolean;

  @Column({ length: 10 })
  uid: string;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date();
  }

  @OneToMany(type => Wallet, wallet => wallet.company, {
    eager: true,
  })
  @JoinColumn()
  wallets: Wallet[];

  @ManyToOne(type => Account, account => account.companies)
  account: Account;

  getParams() {
    return JSON.parse(this.params ?? '{}');
  }

  setParams(params) {
    this.params = JSON.stringify(params ?? {});
  }
}
