export default class IncidentManagementSystem {

  constructor(bagURL) {
    if (! bagURL) {
      throw new Error("bagURL is required");
    }

    this.bagURL = bagURL;
    this._bag = null;
  }

  _fetch = async (request) => {
    return await fetch(request);
  }

  _loadBag = async () => {
    console.log("Retrieving bag from IMS server...");

    const headers = new Headers({
      "Content-Type": "application/json",
    });
    const request = new Request(
      this.bagURL,
      {
        mode: "cors",
        headers: headers,
      }
    );
    const response = await this._fetch(request);
    const bag = await response.json();

    console.log("IMS bag: " + JSON.stringify(bag));

    if (bag.urls == null) {
      throw new Error("Bag does not have URLs");
    }

    return bag;
  }

  bag = async () => {
    if (this._bag !== null) {
      return this._bag;
    }
    else {
      this._bag = await this._loadBag();
    }
    return this._bag;
  }

}
