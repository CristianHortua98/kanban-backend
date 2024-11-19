import { IsEmail } from "class-validator";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Rol } from "./rol.entity";

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
    user: string;

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
        this.user = this.user.toLowerCase().trim();

    }

    @BeforeUpdate()
    checkFieldBeforeUpdate(){
        this.checkFieldBeforeInsert();
    }

}
