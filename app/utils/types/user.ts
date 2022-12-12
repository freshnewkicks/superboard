export enum ERoles {
    "Creator",
    "Admin",
    "Mod",
    "Member",
}

export type TUser = {
    id: number,
    username: string,
    email: string,
    role: keyof typeof ERoles,
    password: string,
    session_token: string,
    memberSince: string,
    parties: number,
    boards: number
}

export type TBoard = {
    id: number,
    creatorId: number,
    name: string,
    created: string,
    tasks: TTask[],
    members: TUser[]
}

export type TTask = {
    id: number,
    name: string,
    board: TBoard,
    boardId: number,
}

export type Party = {
    id: number,
    name: string,
    members: TUser[],
    memberId: number
}