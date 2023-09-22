import { DateTime } from "luxon";

import User from "./User";

describe("User", () => {
  test("toString", () => {
    const username = "Hubcap";
    const credentials = { expiration: DateTime.local() };
    const user = new User(username, credentials);

    expect(user.toString()).toEqual(username);
  });

  test("toJSON", () => {
    const username = "Hubcap";
    const credentials = {
      number: 1,
      text: "text",
      array: [1, 2, 3],
      dict: { a: 1 },
      expiration: DateTime.local(),
    };
    const user = new User(username, credentials);
    const userJSON = { username: username, credentials: credentials };
    const result = user.toJSON();

    expect(result).toEqual(userJSON);
  });

  test("fromJSON, valid", () => {
    const username = "Hubcap";
    const credentials = {
      number: 1,
      text: "text",
      array: [1, 2, 3],
      dict: { a: 1 },
      expiration: DateTime.local(),
    };
    const user = new User(username, credentials);
    const userJSON = user.toJSON();
    const result = User.fromJSON(userJSON);
    const resultJSON = result.toJSON();

    expect(resultJSON).toEqual(userJSON);
  });

  test("fromJSON, no credentials", () => {
    const username = "Hubcap";
    const userJSON = { username: username };
    expect(() => User.fromJSON(userJSON)).toThrow("Invalid user JSON");
  });

  test("JSON round-trip through text", () => {
    const username = "Hubcap";
    const credentials = {
      number: 1,
      text: "text",
      array: [1, 2, 3],
      dict: { a: 1 },
      expiration: DateTime.local(),
    };
    const user = new User(username, credentials);
    const userJSONText = JSON.stringify(user.toJSON());
    const result = User.fromJSON(JSON.parse(userJSONText));
    const resultJSON = result.toJSON();

    expect(JSON.stringify(resultJSON)).toEqual(userJSONText);
  });
});
