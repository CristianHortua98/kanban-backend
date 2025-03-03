import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TaskStatus } from "../interfaces/task-status.enum";
import { Project } from "src/projects/entities/project.entity";
import { Notification } from "src/notifications/entities/notification.entity";
import { Comment } from "src/comments/entities/comment.entity";

@Entity('tasks')
export class Task {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(
        () => Project,
        project => project.tasks,
        {nullable: false, eager: true}
    )
    @JoinColumn({name: 'project_id'})
    project_id: Project;

    @Column({
        type: 'varchar',
        length: 300
    })
    title: string;

    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @Column({
        type: 'enum',
        enum: TaskStatus,
        default: TaskStatus.PENDING
    })
    status: TaskStatus;


    @ManyToOne(
        () => User,
        user => user.createdTasks,
        {nullable: false, eager: true}
    )
    @JoinColumn({name: 'user_created_id'})
    user_created: User;


    @ManyToOne(
        () => User,
        user => user.tasks,
        {nullable: true, eager: true}
    )
    @JoinColumn({name: 'user_assigned_id'})
    user_assigned: User;


    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    create_at: Date;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP'
    })
    update_at: Date;


    @Column({
        type: 'int',
        default: 1
    })
    is_active: number;

    @OneToMany(
        () => Notification,
        notification => notification.id_task
    )
    notifications: Notification[];


    @OneToMany(
        () => Comment,
        comment => comment.task
    )
    comments: Comment[];

}
