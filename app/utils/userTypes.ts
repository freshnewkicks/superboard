export enum ENormalRoles {
    "Creator",
    "Mod",
    "User",
}

export enum EAdminRoles {
    "Admin",
    "Mod",
}

export type TUserInfo = {
    name: string,
    role: keyof typeof ENormalRoles,
    password: string,
    session_token: string,
    
}