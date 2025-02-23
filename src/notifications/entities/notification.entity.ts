import { Task } from "src/tasks/entities/task.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('notifications')
export class Notification {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(
        () => Task,
        task => task.notifications,
        {nullable: false, eager: true}
    )
    @JoinColumn({name: 'id_task'})
    id_task: Task;

    @ManyToOne(
        () => User,
        user => user.notifications,
        {nullable: false, eager: true}
    )
    @JoinColumn({name: 'id_user'})
    id_user: User;

    @Column({
        type: 'int',
        default: 1
    })
    active: number;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    create_at: Date;

}
