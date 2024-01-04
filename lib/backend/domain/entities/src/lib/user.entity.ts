import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  password: string;

  @ManyToMany(() => Role)
  @JoinTable({ name: 'user_role_join' })
  roles: Role[];
}

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
}
