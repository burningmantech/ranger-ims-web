const imsURL = `/ims/`;
const eventsURL = `${imsURL}events/`;
const adminURL = `${imsURL}admin/`;

export const URLs = {
  ims: imsURL,
  events: eventsURL,
  event: (event) => `${eventsURL}${event.id}/`,
  admin: adminURL,
}
Object.freeze(URLs);
