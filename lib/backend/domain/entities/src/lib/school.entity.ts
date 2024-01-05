import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Course } from './course.entity';

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

  @OneToMany(() => Course, (course) => course.school, {
    cascade: ['insert', 'update', 'remove'],
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

@Entity()
export class SchoolDomain {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => School, (school) => school.domains, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  school: School;

  @Column({ unique: true })
  domain: string;

  @Column({ nullable: true })
  schoolId: string;

  /**
Creates a new instance of SchoolDomain.
@param param - The parameters for creating a new instance.
@param param.id - The id of the school domain.
@param param.domain - The domain of the school domain.
@returns The newly created instance of SchoolDomain.
 */
  static create(param: { id?: string; domain?: string }) {
    const newSchoolDomain = new SchoolDomain();
    newSchoolDomain.id = param?.id || '';
    newSchoolDomain.domain = param?.domain || '';
    return newSchoolDomain;
  }
}
