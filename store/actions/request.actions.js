export const REQUEST_ENQUEUE = "REQUEST_ENQUEUE";
export const REQUEST_DEQUEUE = "REQUEST_DEQUEUE";

export const enqueueRequest = (request) => {
  return {
    type: REQUEST_ENQUEUE,
    request,
  };
};

export const dequeueRequest = (request) => {
  return {
    type: REQUEST_DEQUEUE,
    request,
  };
};
