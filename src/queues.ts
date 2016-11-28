export const EVENT_QUEUE_URL = (evt: AWSRequest): string => 'https://sqs.eu-west-1.amazonaws.com/947418478752/LOGGER_EVENTS';

export const QUEUE_REGION = (evt: AWSRequest): IDictionary<string> => {
  return { region: 'eu-west-1' };
};

