export interface User{

    fullname: string;
    document: number;
    phone: number;
    username: string;
    email: string;
    roles: Rol[];
    id: number;
    is_active: number;
    create_at: Date;

}

export interface Rol{

    id: number;
    name_rol: string;

}