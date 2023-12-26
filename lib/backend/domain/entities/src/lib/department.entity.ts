import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Course } from './course.entity';

@Entity()
export class Department {
  static create(params?: { id?: string; name?: string; courses?: Course[] }) {
    const newDepartment = new Department();
    newDepartment.id = params?.id || '';
    newDepartment.name = params?.name || '';
    newDepartment.courses = params?.courses || [];
    return newDepartment;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Course, (course) => course.department)
  courses: Course[];
}
