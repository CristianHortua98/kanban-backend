import { Task } from "src/tasks/entities/task.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('comments')
export class Comment {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({
        type: 'text',
    })
    message: string;

    @ManyToOne(
        () => Task,
        task => task.comments,
        {nullable: false, eager: true}
    )
    @JoinColumn({name: 'id_task'})
    task: Task;

    @ManyToOne(
        () => User,
        user => user.comments,
        {nullable: false, eager: true}
    )
    @JoinColumn({name: 'id_user'})
    user_created: User;

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

}
