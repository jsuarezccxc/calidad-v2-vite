export interface IUserAdministrator {
    id?: string;
    name: string;
    email: string;
    roles: IRoles[];
}

export interface IPermissions {
    name: string;
    description: string;
}

export interface IRoles {
    name: string;
    permissions: IPermissions[];
}
