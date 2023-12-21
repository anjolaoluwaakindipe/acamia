import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Course } from './course.entity';
import { SchoolDomain } from './schoolDomain.entity';

export type SchoolCreationObject = {
  id?: string;
  name?: string;
  description?: string;
  city?: string;
  stateOrProvince?: string;
  country?: string;
  courses?: Course[];
};

@Entity()
export class School {
  /**
   * static method to create a school
   * @param params
   * @returns
   */
  static create(params?: SchoolCreationObject) {
    const newSchool = new School();
    newSchool.id = params?.id || '';
    newSchool.name = params?.name || '';
    newSchool.description = params?.description || '';
    newSchool.city = params?.city || '';
    newSchool.stateOrPronvince = params?.stateOrProvince || '';
    newSchool.country = params?.country || '';
    newSchool.courses = params?.courses || [];
    return newSchool;
  }

  @PrimaryGeneratedColumn('uuid', {})
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  city: string;

  @Column()
  stateOrPronvince: string;

  @Column()
  country: string;

  @OneToMany(() => Course, (course) => course.school, 
  {
    cascade: ["insert", "update",'remove']
  })
  courses: Course[];

  @OneToMany(() => SchoolDomain, (domain) => domain.school)
  domains: SchoolDomain[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  /**
   * This helps quickly connect both School and schoolDomain entities together
   * @param {SchoolDomain} schoolDomain
   */
  addDomain(schoolDomain: SchoolDomain) {
    if (this.domains == null) {
      this.domains = [];
    }
    this.domains.push(schoolDomain);
    schoolDomain.school = this;
  }
}
