import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({ id, email: "testemail@gmail.com", password: "testpassword" } as User)
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: "testpassword" } as User])
      },
      // remove: () => { },
      // update: () => { }
    };

    fakeAuthService = {
      // signup: () => { },
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        },
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it("findAllUsers return a list of users with the given email", async () => {
    const users = await controller.findAllUsers("test@email.com")
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual("test@email.com");
  });
  it("findOneUser return a User with the given id", async () => {
    const user = await controller.findUser("1")
    expect(user).toBeDefined();
    expect(user.id).toEqual(1);

  });

  it("findUser throw an error if user with given id is not found", async () => {
    fakeUsersService.findOne = () => Promise.resolve(null);
    try {
      await controller.findUser("24")
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });

  it("signin update session object and returns user", async () => {
    const session = { userId: -10 };
    const user = await controller.signin({ email: "test@gmail.com", password: "testpassword" }, session);
    expect(user.id).toBe(1);
    expect(session.userId).toEqual(1);
  });

  it("whoami should return user", async () => {
    const user = await controller.whoAmi({ id: 1, email: "test@gmail.com", password: "testpassword" } as User);
    expect(user).toBeDefined();
    expect(user.id).toBe(1);
  });

  it("signout user session most be null", async () => {
    const session = { userId: 1 };
    const siginout = await controller.signout(session);
    expect(session.userId).toBe(null);

  })

});
