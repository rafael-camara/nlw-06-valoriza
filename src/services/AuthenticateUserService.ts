import { compare } from 'bcryptjs'
import { getCustomRepository } from 'typeorm'
import { sign } from 'jsonwebtoken'

import { UsersRepositories } from '../repositories/UsersRepositories'

interface IAuthenticateRequest {
  email: string
  password: string
}

class AuthenticateUserService {
  async execute({ email, password }: IAuthenticateRequest) {
    const usersRepositories = getCustomRepository(UsersRepositories)

    // Verificar se email existe
    const user = await usersRepositories.findOne({ email })

    if (!user) {
      throw new Error('Email/Password incorrect')
    }

    // Verificar se senha está correta
    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      throw new Error('Email/Password incorrect')
    }

    // Gerar token
    const token = sign(
      {
        email: user.email,
      },
      'a51203e9e92dbc839b8ceabdf11bfd7c',
      {
        subject: user.id,
        expiresIn: '1d',
      },
    )

    return token
  }
}

export { AuthenticateUserService }
