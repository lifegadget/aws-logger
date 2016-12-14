let region = 'eu-west-1';

export const EVENT_QUEUE_URL: string = `https://sqs.${region}.amazonaws.com/947418478752/LOGGER_EVENTS`;

export const QUEUE_REGION = (evt?: AWSRequest): IDictionary<string> => {
  return { region };
};

