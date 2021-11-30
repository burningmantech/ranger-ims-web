const baseURL = `/ims/`;
const eventsURL = `${baseURL}events/`;
const adminURL = `${baseURL}admin/`;

export const URLs = {
  home: baseURL,
  events: eventsURL,
  event: (event) => `${eventsURL}${event.id}/`,
  admin: adminURL,
}
Object.freeze(URLs);
