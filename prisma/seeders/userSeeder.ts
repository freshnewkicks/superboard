import type { TUser } from "~/utils/types/user"
import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'
import { prisma } from "@prisma/client"

export const UserSeeder = async() => {
    const generate_password = async() => {
        let this_pass = faker.random.words()
        let rounds = await bcrypt.genSalt(10)
        let hash = await bcrypt.hash(this_pass, rounds)
        return hash
    }

    const USER_DATA: TUser = {
        id: Number(faker.random.numeric()),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        role: faker.random.numeric() === "1" ? "Admin" : "Member",
        password: await generate_password(),
        session_token: "",
        memberSince: "",
        parties: 0,
        boards: 0
    }
    
}