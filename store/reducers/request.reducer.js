import * as actions from "../actions/request.actions";

const initialState = [];

// https://stackoverflow.com/a/32922084
const deepEqual = (x, y) => {
  const ok = Object.keys,
    tx = typeof x,
    ty = typeof y;
  return x && y && tx === "object" && tx === ty
    ? ok(x).length === ok(y).length &&
        ok(x).every((key) => deepEqual(x[key], y[key]))
    : x === y;
};

const filterByRequest = ({ state, request }) =>
  state?.filter((existingRequest) => !deepEqual(existingRequest, request)) ??
  [];

export default function requestReducer(state = initialState, action) {
  switch (action.type) {
    case actions.REQUEST_ENQUEUE:
      //console.log("~~~ ENQUEUE ACTION ~~~", JSON.stringify(action));
      if (!action?.request) return state;
      return [...state, action.request];
    case actions.REQUEST_DEQUEUE:
      //console.log("~~~ DEQUEUE ACTION ~~~", JSON.stringify(action));
      if (!action?.request) return state;
      return filterByRequest({ state, request: action.request });
    default:
      return state;
  }
}
