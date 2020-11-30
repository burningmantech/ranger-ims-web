export default class IncidentManagementSystem {

  constructor(bagURL) {
    if (! bagURL) {
      throw new Error("bagURL is required");
    }

    this.bagURL = bagURL;
    this._bag = null;
  }

  _loadBag = async() => {
  }

  _bag = async() => {
    const bag = this._bag;
    if (bag !== null) {
      if (bag.expiration.isBefore(now)) {
        return bag;
      }
    }

    await this._loadBag();
    return this._bag;
  }

}
