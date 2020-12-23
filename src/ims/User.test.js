import { DateTime } from "luxon";

import User from "./User";


describe("User", () => {

  test("username is required", () => {
    const message = "username is required";

    expect(() => {new User()}).toThrow(message);
    expect(() => {new User(undefined, {})}).toThrow(message);
    expect(() => {new User(null, {})}).toThrow(message);
  });

  test("credentials is required", () => {
    const username = "Hubcap";
    const message = "credentials is required";

    expect(() => {new User(username)}).toThrow(message);
    expect(() => {new User(username, undefined)}).toThrow(message);
    expect(() => {new User(username, null)}).toThrow(message);
  });

  test("credentials.expiration is required", () => {
    const username = "Hubcap";
    const message = "credentials.expiration is required";

    expect(() => {new User(username, {})}).toThrow(message);
  });

  test("toJSON", () => {
    const username = "Hubcap";
    const credentials = {
      number: 1,
      text: "text",
      array: [1, 2, 3],
      dict: {a: 1},
      expiration: DateTime.local(),
    };
    const user = new User(username, credentials);
    const userJSON = { username: username, credentials: credentials };
    const result = user.toJSON();

    expect(result).toEqual(userJSON);
  });

  test("fromJSON", () => {
    const username = "Hubcap";
    const credentials = {
      number: 1,
      text: "text",
      array: [1, 2, 3],
      dict: {a: 1},
      expiration: DateTime.local(),
    };
    const user = new User(username, credentials);
    const userJSON = user.toJSON();
    const result = User.fromJSON(userJSON);
    const resultJSON = result.toJSON();

    expect(resultJSON).toEqual(userJSON);
  });

  test("JSON round-trip through text", () => {
    const username = "Hubcap";
    const credentials = {
      number: 1,
      text: "text",
      array: [1, 2, 3],
      dict: {a: 1},
      expiration: DateTime.local(),
    };
    const user = new User(username, credentials);
    const userJSONText = JSON.stringify(user.toJSON());
    const result = User.fromJSON(JSON.parse(userJSONText));
    const resultJSON = result.toJSON();

    expect(JSON.stringify(resultJSON)).toEqual(userJSONText);
  });

});
