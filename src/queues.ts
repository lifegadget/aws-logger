export const EVENT_QUEUE_URL = (evt: IRequestInput): string => 'https://sqs.eu-west-1.amazonaws.com/947418478752/LOGGER_EVENTS';
export const QUEUE_REGION = (evt: IRequestInput): IDictionary<string> => {
  return { region: 'eu-west' };
};

// export const EVENT_QUEUE_URL = (evt: IRequestInput): string => evt.stageParameters['LOGGER_EVENT_QUEUE_URL'];
// export const QUEUE_REGION = (evt: IRequestInput): IDictionary<string> => {
//   return { region: evt.stageParameters['LOGGER_QUEUE_REGION'] };
// };
