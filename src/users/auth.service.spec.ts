import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe("AuthService", () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter(user => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = { id: Math.floor(Math.random() * 99999), email, password } as User
        users.push(user);
        return Promise.resolve(user);
      }

    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it("create a new user with salted and hashed password", async () => {
    const user = await service.signup("test@gmail.com", "testpassword");
    const [salt, hash] = user.password.split(".");

    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
    expect(user.password).not.toEqual("testpassword");
  });

  it("throws an error if user signs up with email that is in use", async () => {
    await service.signup("test@gmail.com", "testpassword");

    try {
      await service.signup("test@gmail.com", "testpassword");
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException)
    }
  });

  it("throws if signin is called with an unused email", async () => {
    try {
      await service.signin("test@gmail.com", "testpassword");
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException)
    }
  });

  it("throws if an invlaid password is provided", async () => {

    await service.signup("test@gmail.com", "testpassword");

    try {
      await service.signin("test@gmail.com", "wrongpassword");
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException)
    }
  });

  it("retrun a user if correct password is provided", async () => {
    await service.signup("test@gmail.com", "testpassword");

    const user = await service.signin("test@gmail.com", "testpassword");

    expect(user).toBeDefined();
  });




})
