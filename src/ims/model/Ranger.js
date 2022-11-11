import invariant from "invariant";

export default class Ranger {
  static statuses = Object.freeze(["active", "inactive", "vintage", "other"]);

  static statusToString = (status) => {
    invariant(status != null, "status is required");
    switch (status) {
      case "active":
        return "Active Ranger";
      case "inactive":
        return "Inactive Ranger";
      case "vintage":
        return "Vintage Ranger";
      case "other":
        return "(Unknown Person Type)";
      default:
        throw new Error(`Invalid status: ${status}`);
    }
  };

  constructor({
    handle, // text
    name, // text
    status, // "active", "inactive", "vintage", "other"
    email, // list of text
    enabled, // boolean
    directoryID, // text
  }) {
    invariant(handle != null, "handle is required");
    invariant(name != null, "name is required");
    invariant(status != null, "status is required");
    invariant(email != null, "email is required");
    invariant(enabled != null, "enabled is required");

    this.handle = handle;
    this.name = name;
    this.status = status;
    this.email = email;
    this.enabled = enabled;
    this.directoryID = directoryID;
  }

  toString = () => {
    return `${Ranger.statusToString(this.status)} ${this.handle} (${
      this.name
    })`;
  };
}
