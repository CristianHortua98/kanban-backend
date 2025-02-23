import { Task } from "src/tasks/entities/task.entity";
import { User } from "src/users/entities/user.entity";
import { BeforeInsert, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('projects')
export class Project {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({
        type: 'varchar',
        length: 50
    })
    name: string;

    @Column({
        type: 'varchar',
        length: 10,
        unique: true
    })
    code: string;

    @ManyToOne(
        () => User,
        user => user.createdProjects,
        {nullable: false, eager: true}
    )
    @JoinColumn({name: 'user_created_id'})
    user_created: User;

    @ManyToMany(
        () => User,
        user => user.projects
    )
    @JoinTable({
        name: 'projects_collaborators',
        joinColumn: {
            name: 'id_project',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'id_user',
            referencedColumnName: 'id'
        }
    })
    collaborators: User[];

    @OneToMany(
        () => Task,
        task => task.project_id
    )
    tasks: Task[];


    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    create_at: Date;

    @Column({
        type: 'int',
        default: 1
    })
    is_active: number;


    @BeforeInsert()
    fieldCode(){
        this.code = this.code.toUpperCase();
    }

}
 