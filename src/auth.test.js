import { Authenticator, TestAuthentationSource, User } from "./auth";


describe("User", () => {

  test("username is defined", () => {
    const message = "username is not defined";

    expect(() => {new User()}).toThrow(message);
    expect(() => {new User(undefined, {})}).toThrow(message);
  });

  test("username is not null", () => {
    const message = "username is null";

    expect(() => {new User(null, {})}).toThrow(message);
  });

  test("asJSON", () => {
    const username = "Cheese Butter";
    const credentials = {
      number: 1,
      text: "text",
      array: [1, 2, 3],
      dict: {a: 1},
    };
    const user = new User(username, credentials);
    const userJSON = {username: username, credentials: credentials};

    expect(user.asJSON()).toEqual(userJSON);
  });

  test("fromJSON", () => {
    const username = "Cheese Butter";
    const credentials = {
      number: 1,
      text: "text",
      array: [1, 2, 3],
      dict: {a: 1},
    };
    const user = new User(username, credentials);
    const userJSON = user.asJSON();
    const result = User.fromJSON(userJSON);
    const resultJSON = result.asJSON();

    expect(resultJSON).toEqual(userJSON);
  });

});


describe("TestAuthentationSource", () => {

  test("valid login -> user", async () => {
    const username = "user";
    const password = username;
    const source = new TestAuthentationSource();
    const result = await source.login(username, {password: password});

    expect(result).not.toBeNull();

    const user = result.user;

    expect(user.username).toEqual(username);
    expect(user.credentials).toEqual({});
  });

  test("valid login -> expiration", async () => {
    const username = "user";
    const password = username;
    const now = new Date();
    const source = new TestAuthentationSource();
    const result = await source.login(username, {password: password});

    expect(result).not.toBeNull();

    const expiration = result.expiration;

    expect(expiration.getTime()).toBeGreaterThan(now.getTime());
  });

  test("invalid login -> null", async () => {
    const username = "user";
    const password = "Not My Password";
    const source = new TestAuthentationSource();
    const result = await source.login(username, {password: password});

    expect(result).toBeNull();
  });

});


describe("Authenticator", () => {

  test("authentication source is defined", () => {
    const message = "authentication source is not defined";
    expect(() => {new Authenticator()}).toThrow(message);
    expect(() => {new Authenticator(undefined)}).toThrow(message);
  });

  test("authentication source is not null", () => {
    const message = "authentication source is null";
    expect(() => {new Authenticator(null)}).toThrow(message);
  });

  test("valid login -> user", async () => {
    const username = "user";
    const password = username;
    const source = new TestAuthentationSource();
    const authenticator = new Authenticator(source);
    const result = await authenticator.login(username, {password: password});

    expect(result).toBe(true);

    const user = authenticator.user;

    expect(user.username).toEqual(username);
    expect(user.credentials).toEqual({});

    expect(authenticator.isLoggedIn()).toBe(true);
  });

  test("valid login -> expiration", async () => {
    const username = "user";
    const password = username;
    const now = new Date();
    const source = new TestAuthentationSource();
    const authenticator = new Authenticator(source);
    const result = await authenticator.login(username, {password: password});

    expect(result).toBe(true);

    const expiration = authenticator.expiration;

    expect(expiration.getTime()).toBeGreaterThan(now.getTime());
  });

  test("invalid login", async () => {
    const username = "user";
    const password = "Not My Password";
    const source = new TestAuthentationSource();
    const authenticator = new Authenticator(source);
    const result = await authenticator.login(username, {password: password});

    expect(result).toBe(false);

    expect(authenticator.user).toBe(null);
    expect(authenticator.expiration).toBe(null);

    expect(authenticator.isLoggedIn()).toBe(false);
  });

  test("logout", async () => {
    const username = "user";
    const password = username;
    const source = new TestAuthentationSource();
    const authenticator = new Authenticator(source);
    const result = await authenticator.login(username, {password: password});

    expect(result).toBe(true);
    expect(authenticator.isLoggedIn()).toBe(true);

    await authenticator.logout();

    expect(authenticator.user).toBe(null);
    expect(authenticator.expiration).toBe(null);

    expect(authenticator.isLoggedIn()).toBe(false);
  });

});
