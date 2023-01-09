import { getCustomRepository } from 'typeorm'
import { UsersRepositories } from '../repositories/UsersRepositories'
import { hash } from 'bcryptjs'

interface IUserRequest {
  name: string
  email: string
  admin?: boolean
  password: string
}

class CreateUserService {
  async execute({ name, email, admin = false, password }: IUserRequest) {
    const usersRepository = getCustomRepository(UsersRepositories)

    // Caso o email não está preenchido lança uma exceção
    if (!email) {
      throw new Error('Email incorrect')
    }

    // Verifica se o usuário já existe
    const userAlreadyExists = await usersRepository.findOne({ email })

    // Caso o usuário existe lança uma exceção
    if (userAlreadyExists) {
      throw new Error('User already exists')
    }

    const passwordHash = await hash(password, 8)

    // Cria a instancia de usuário
    const user = usersRepository.create({
      name,
      email,
      admin,
      password: passwordHash,
    })

    // Salva o usuário na base de dados
    await usersRepository.save(user)

    // Retorna o usuário criado
    return user
  }
}

export { CreateUserService }
