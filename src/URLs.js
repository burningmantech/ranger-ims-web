const imsURL = `/ims/`;
const eventsURL = `${imsURL}events/`;
const adminURL = `${imsURL}admin/`;

export const URLs = {
  ims: imsURL,
  events: eventsURL,
  event: (event) => `${eventsURL}${event.id}/`,
  incidents: (event) => `${eventsURL}${event.id}/incidents/`,
  incident: (event, number) => `${eventsURL}${event.id}/incidents/${number}`,
  admin: adminURL,
}
Object.freeze(URLs);
