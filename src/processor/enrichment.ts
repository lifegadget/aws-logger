import '../common';

/**
 * If the event comes from the frontend and isn't supplying its own
 * geolocation information then add geo information 
 */
export function geoLocate(event: IServerlessEvent): IServerlessEvent {
  return event;
}