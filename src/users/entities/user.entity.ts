import { IsEmail } from "class-validator";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Rol } from "./rol.entity";
import { Project } from "src/projects/entities/project.entity";
import { Task } from "src/tasks/entities/task.entity";
import { Notification } from "src/notifications/entities/notification.entity";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({
        type: 'varchar',
        length: 50
    })
    fullname: string;

    @Column({
        type: 'varchar',
        length: 20,
        unique: true,
    })
    document: number;

    @Column({
        type: 'varchar',
        length: 15
    })
    phone: number;

    @Column({
        type: 'varchar',
        length: 20,
        unique: true
    })
    username: string;

    @Column({
        type: 'varchar',
        length: 100,
        select: false
    })
    password: string;


    @Column({
        type: 'varchar',
        length: 50, 
        unique: true,
    })
    @IsEmail({}, {message: 'Email is not valid'})
    email: string;

    @ManyToMany(
        () => Rol,
        roles => roles.users,
        {cascade: true, eager: true}
    )
    @JoinTable({
        name: 'users_roles',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'rol_id',
            referencedColumnName: 'id'
        }
    })
    roles: Rol[];


    @OneToMany(
        () => Project,
        project => project.user_created
    )
    createdProjects: Project[];

    @OneToMany(
        () => Task,
        task => task.user_created
    )
    createdTasks: Task[];

    @ManyToMany(
        () => Project,
        project => project.collaborators
    )
    projects: Project[];

    @OneToMany(
        () => Task,
        task => task.user_assigned
    )
    tasks: Task[];


    @OneToMany(
        () => Notification,
        notification => notification.id_user
    )
    notifications: Notification[];

    @Column({
        type: 'int',
        default: 1
    })
    is_active: number;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    create_at: Date;

    @BeforeInsert()
    checkFieldBeforeInsert(){

        this.email = this.email.toLowerCase().trim();
        this.username = this.username.toLowerCase().trim();

    }

    @BeforeUpdate()
    checkFieldBeforeUpdate(){
        this.checkFieldBeforeInsert();
    }

}
