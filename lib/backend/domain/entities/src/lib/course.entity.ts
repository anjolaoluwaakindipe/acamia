import { PrimaryGeneratedColumn, Column, Index, ManyToOne, Entity } from "typeorm";
import { Department } from "./department.entity";
import { School } from "./school.entity";


@Index(["name", "code"], {unique: true})
@Entity()
export class Course {
    static create(params?: {id?: string, code?:string, name?:string, department?: Department, school?: School}) {
        const newCourse = new Course
        newCourse.id = params?.id || ""
        newCourse.code = params?.code  || ""
        newCourse.name = params?.name || ""
        newCourse.department = params?.department 
        newCourse.school = params?.school
        return newCourse
    }
    

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({unique: true})
    code: string

    @Column()
    name:string

    @ManyToOne(()=> Department, (department) => department.courses)
    department?: Department

    @ManyToOne(()=> School, (school) => school.courses)
    school?: School
}