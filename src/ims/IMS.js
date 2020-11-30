export default class IncidentManagementSystem {

  constructor(bagURL) {
    if (! bagURL) {
      throw new Error("bagURL is required");
    }

    this.bagURL = bagURL;
  }

}
