import { faker } from "@faker-js/faker";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Crudder } from "../../src/crudder/crudder.js";

type User = {
  address: {
    city: string;
    state: string;
    street: string;
    zip: string;
  };
  email: string;
  name: string;
  number: string;
};

function createUser() {
  return {
    address: {
      city: faker.location.city(),
      state: faker.location.state(),
      street: faker.location.street(),
      zip: faker.location.zipCode(),
    },
    email: faker.internet.email(),
    name: faker.person.fullName(),
    number: faker.phone.number(),
  } satisfies User;
}

describe("orm", () => {
  let orm: Crudder<User, "email">;

  beforeEach(() => {
    orm = new Crudder<User, "email">("email");
  });

  it("should create a user", () => {
    const user = createUser();
    const result = orm.create(user);

    expect(result).not.toBeInstanceOf(Error);
    expect(orm.count()).toBe(1);
    expect(orm.findUnique(user.email)).toBe(user);
  });

  it("should get correct count", () => {
    const randomCount = faker.number.int({ max: 100, min: 10 });
    for (let index = 0; randomCount > index; index += 1) {
      orm.create(createUser());
    }

    expect(orm.count()).toBe(randomCount);
  });

  it("should create many users", () => {
    const randomCount = faker.number.int({ max: 100, min: 10 });
    const users = [];

    for (let index = 0; index < randomCount; index += 1) {
      users.push(createUser());
    }

    orm.createMany(users);
    expect(orm.count()).toBe(randomCount);
  });

  it("should delete a user", () => {
    const user = createUser();
    orm.create(user);
    expect(orm.count()).toBe(1);
    orm.delete(user.email);
    expect(orm.count()).toBe(0);
  });

  it("should delete many users", () => {
    const randomCount = faker.number.int({ max: 100, min: 10 });
    for (let index = 0; randomCount > index; index += 1) {
      orm.create(createUser());
    }
    expect(orm.count()).toBe(randomCount);
    const users = orm.findMany();
    orm.deleteMany(
      users.map((user) => {
        return user.email;
      }),
    );
    expect(orm.count()).toBe(0);
  });

  it("should find the first user", () => {
    const randomCount = faker.number.int({ max: 100, min: 10 });
    for (let index = 0; randomCount > index; index += 1) {
      orm.create({
        ...createUser(),
        number: "myNumber",
      });
    }

    const user = orm.findFirst({ number: "myNumber" });

    expect(user).toBeDefined();
  });

  it("should find many users", () => {
    const randomCount = faker.number.int({ max: 100, min: 10 });
    for (let index = 0; randomCount > index; index += 1) {
      orm.create(createUser());
    }

    const users = orm.findMany();
    expect(users.length).toEqual(randomCount);
  });

  it("should find a user by unique id", () => {
    const randomCount = faker.number.int({ max: 100, min: 10 });
    for (let index = 0; randomCount > index; index += 1) {
      orm.create(createUser());
    }
    const unique = orm.create(createUser());

    expect(unique).not.toBeInstanceOf(Error);

    if (unique instanceof Error) {
      return;
    }

    expect(orm.findUnique(unique.email)).not.toBeInstanceOf(Error);
  });

  it("should update a user", () => {
    const created = orm.create(createUser());

    if (created instanceof Error) {
      throw new TypeError("failed to create");
    }

    orm.update(created.email, { name: "hello world" });

    expect(orm.findUnique(created.email)?.name).toBe("hello world");
  });

  it("should update many users", () => {
    const randomCount = faker.number.int({ max: 100, min: 10 });
    const users = [];
    for (let index = 0; randomCount > index; index += 1) {
      users.push(createUser());
    }
    orm.createMany(users);
    orm.updateMany(
      users.map((user) => {
        return {
          data: { name: "helloWorld" },
          key: user.email,
        };
      }),
    );

    expect(orm.findMany()).toStrictEqual(
      users.map((user) => {
        return {
          ...user,
          name: "helloWorld",
        };
      }),
    );
  });

  it("should update or insert", () => {
    expect(orm.count()).toBe(0);
    orm.upsert("email", createUser());
    expect(orm.count()).toBe(1);
    orm.upsert("email", createUser());
    expect(orm.count()).toBe(1);
  });

  it("should return count 0 if orm is empty", () => {
    expect(orm.count()).toBe(0);
  });

  it("should return error on create if item already exists", () => {
    const user = createUser();
    const result1 = orm.create(user);
    expect(result1).not.toBeInstanceOf(Error);

    const result2 = orm.create(user);
    expect(result2).toBeInstanceOf(Error);
  });

  it("should return undefined if delete fails", () => {
    const result = orm.delete("email");
    expect(result).toBe(undefined);
  });

  it("should return undefined if there are no matches", () => {
    const user = createUser();
    orm.create(user);
    expect(orm.findFirst({ email: "nope" })).toBe(undefined);
  });

  it("should return empty array if nothing found", () => {
    expect(orm.findMany()).toStrictEqual([]);
  });

  it("should return undefined if nothing found", () => {
    expect(orm.findUnique("email")).toBe(undefined);
  });

  it("should emit created event", () => {
    const callMe = vi.fn((user: User) => {
      return user;
    });

    orm.subscribe("created", callMe);

    expect(callMe).toHaveBeenCalledTimes(0);
    orm.create(createUser());
    expect(callMe).toHaveBeenCalledOnce();
  });

  it("should add multiple listeners", () => {
    const callMe = vi.fn((user: User) => {
      return user;
    });

    orm.subscribe("created", callMe);
    orm.subscribe("created", callMe);
    orm.subscribe("created", callMe);

    expect(orm.listenerCount("created")).toBe(3);
    orm.unsubscribe("created", callMe);
    expect(orm.listenerCount("created")).toBe(0);
  });

  it("should emit created event for every create many", () => {
    const callMe = vi.fn(() => {
      return null;
    });
    orm.subscribe("created", callMe);

    const randomCount = faker.number.int({ max: 100, min: 10 });
    for (let index = 0; randomCount > index; index += 1) {
      orm.create(createUser());
    }

    expect(callMe).toHaveBeenCalledTimes(randomCount);
  });

  it("should emit deleted event", () => {
    const callMe = vi.fn(() => {
      return null;
    });
    orm.subscribe("deleted", callMe);

    const randomCount = faker.number.int({ max: 100, min: 10 });
    for (let index = 0; randomCount > index; index += 1) {
      orm.create(createUser());
    }
    orm.deleteMany(
      orm.findMany().map((user) => {
        return user.email;
      }),
    );

    expect(callMe).toHaveBeenCalledTimes(randomCount);
  });

  it("should emit updated event", () => {
    const callMe = vi.fn(() => {
      return null;
    });
    orm.subscribe("updated", callMe);

    const randomCount = faker.number.int({ max: 100, min: 10 });
    for (let index = 0; randomCount > index; index += 1) {
      orm.create(createUser());
    }
    orm.updateMany(
      orm.findMany().map((item) => {
        return {
          data: item,
          key: item.email,
        };
      }),
    );

    expect(callMe).toHaveBeenCalledTimes(randomCount);
  });
});
