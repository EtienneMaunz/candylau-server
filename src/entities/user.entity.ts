import { UUID } from 'crypto';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: UUID;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;
}
