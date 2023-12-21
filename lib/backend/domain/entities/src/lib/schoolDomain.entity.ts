import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { School } from './school.entity';

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
