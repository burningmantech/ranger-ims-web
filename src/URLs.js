const rootURL = "/";
const homeURL = `${rootURL}ims/`;
const eventsURL = `${homeURL}events/`;
const adminURL = `${homeURL}admin/`;

export const URLs = {
  root: rootURL,
  home: homeURL,
  events: eventsURL,
  event: (event) => `${eventsURL}${event.id}/`,
  admin: adminURL,
}
Object.freeze(URLs);
