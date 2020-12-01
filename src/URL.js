const rootURL = "/";
const homeURL = `${rootURL}ims/`;
const eventsURL = `${homeURL}events/`;
const adminURL = `${homeURL}admin/`;

export const URL = {
  root: rootURL,
  home: homeURL,
  event: eventsURL,
  admin: adminURL,
}
Object.freeze(URL);
