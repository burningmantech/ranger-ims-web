const imsURL = "/ims/";
const eventsURL = `${imsURL}events/`;
const adminURL = `${imsURL}admin/`;

export const URLs = {
  ims: imsURL,
  events: eventsURL,
  event: (eventID) => `${eventsURL}${eventID}/`,
  incidents: (eventID) => `${eventsURL}${eventID}/incidents/`,
  incident: (eventID, number) => `${eventsURL}${eventID}/incidents/${number}`,
  admin: adminURL,
};
Object.freeze(URLs);
