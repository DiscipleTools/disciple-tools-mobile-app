# Data Store #

The data store uses the [Redux](https://redux.js.org/) state container to manage data within the app.

Additions to the basic Redux setup include:

* [Redux Persist](https://github.com/rt2zz/redux-persist) - Automatically persists the data store to local storage so as to save the state between sessions and assist in allowing offline usage.
* [Redux Saga](https://redux-saga.js.org/) - Redux middleware to assist in the execution of asynchronous tasks like API calls

## Directory Structure ##

This `/store` directory is setup with the following structure:

* `actions/` - Redux action creators and constants grouped together by their root state property name (e.g. `users` and `contacts`)
* `sagas/` - Redux sagas grouped together by their root state property name. Sagas handle async actions and will dispatch the appropriate actions based on success/failure conditions.
* `reducer.js` - Redux reducers that directly transform the state. (Currently in a single file, but could be split off into individual files like actions and sagas)
* `sagas.js` - Root saga that joins together the individual sagas.
* `store.js` - Initialization of the app data store to be included in the root of the app

## Accessing Data in Components/Screens ##

The structure of the data can be seen in `reducer.js` by looking at the `initialState` constant.

In order to access data from the store within a Component or Screen, there are a few things to add to the component.

### `connect` Component Wrapper ###

Include the `connect` function with `import { connect } from 'react-redux';`.

Instead of exporting the component in the normal way of:
```
export default MyComponent
```

...use the `connect` function to wrap it like: 
```
export default connect(mapStateToProps, mapDispatchToProps)(MyComponent)
``` 

*See below for description of the two function parameters*

### `mapStateToProps` to fetch data from store ###

In order to sync data from the store into the props of our component so that we can access them, we use the first parameter of the `connect` function to define which data we need and how we want to expose it within our component.

```javascript
const mapStateToProps = state => ({
  contacts: state.contacts.items,
  user: state.user,
});
export default connect(mapStateToProps, mapDispatchToProps)(MyComponent);
```

In this case, we will pull in `state.contacts.items` (the array of contacts) into a prop named `contacts`. This exposes it in the component using `this.props.contacts`. Likewise, we are exposing `state.user` via `this.props.user`.

### `mapDispatchToProps` to execute store actions ###

In order to dispatch actions that will update data in the store, we use the `mapDispatchToProps` parameter of `connect`.

```javascript
import { getAll as getAllContacts } from '../store/actions/contacts.actions';
...
const mapDispatchToProps = dispatch => ({
  getContacts: (domain, token) => {
    dispatch(getAllContacts(domain, token));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(MyComponent);
```

The above creates the function `this.props.getContacts(domain, token)` to be used anywhere in that component. This action will fetch all contacts from the DT API and push them into the state (`state.contacts.items`) so that they are then available through the mapped prop above `this.props.contacts`. 

## Data Flow ##

Using the Redux pattern, data flows in a single direction around a loop:

`State` --> `Component/View` --> `Actions` --> `Reducer` --> `State`

Since we are doing both synchronous and asynchronous changes to the state, there are two different ways that updates happen between actions and reducers.

![Redux Data Flow](./redux-data-flow.png)

### Synchronous Data ###
Synchronous data follows the basic pattern of Redux:

1. Component dispatches an action:
   E.g.
   ```javascript
   dispatch(logout())
   ```
1. Action creator creates the action to be handled by reducer:
   ```javascript
   export function logout() {
     return { type: USER_LOGOUT };
   }
   ```
1. Reducer looks for action type and updates the store appropriately:
   ```javascript
   switch (action.type) {
     ...
     case userActions.USER_LOGOUT:
       return Object.assign({}, state, {
         token: null,
       });
     default:
       return state;
   }
   ```
   
### Asynchronous Data ###
Asynchronous data updates are those that will wait for a response from an external service, most often through APIs. All API requests to DT within this app would follow this pattern.

1. Component dispatches an action:
   E.g.
   ```javascript
   dispatch(login(domain, username, password));
   ```
1. Action creator creates the action to be handled by **saga**:
   ```javascript
   export function login(domain, username, password) {
     return {
       type: USER_LOGIN,
       domain,
       username,
       password,
     };
   }
   ```
1. Saga watches for actions of given type and intercepts them before they go to the reducer:
   ```javascript
   export default function* userSaga() {
     yield all([
       takeLatest(actions.USER_LOGIN, login),
     ]);
   }
   ```
1. Saga intercepts action and executes async code using [ES6 generators](https://goshakkk.name/javascript-generators-understanding-sample-use-cases/):
   ```javascript
   export function* login({ domain, username, password }) {
     yield put({ type: actions.USER_LOGIN_START });
   
     let response = yield fetch(`https://${domain}/wp-json/jwt-auth/v1/token`, {
         method: 'POST',
         ...
       });
   
     const jsonData = yield response.json();
     if (jsonData && jsonData.code && jsonData.data && jsonData.data.status
       && jsonData.data.status === 403) {
       yield put({
         type: actions.USER_LOGIN_FAILURE,
         error: {
           code: jsonData.code,
           message: jsonData.message,
         },
       });
     } else {
       yield put({
         type: actions.USER_LOGIN_SUCCESS,
         domain,
         user: jsonData,
       });
     }
   }
   ```
   1. At the start of a request, we dispatch (or `put`) action to update the state that we are loading data.
   1. On success, we dispatches success action.
   1. On failure, we dispatches failure action.
1. Reducer looks for action type and updates the store appropriately:
   ```javascript
   switch (action.type) {
     case userActions.USER_LOGIN_START:
       return Object.assign({}, state, {
         isLoading: true,
         error: null,
       });
     case userActions.USER_LOGIN_SUCCESS:
       return Object.assign({}, state, {
         isLoading: false,
         domain: action.domain,
         token: action.user.token,
         username: action.user.user_nicename,
         displayName: action.user.user_display_name,
         email: action.user.user_email,
       });
     case userActions.USER_LOGIN_FAILURE:
       return Object.assign({}, state, {
         isLoading: false,
         error: action.error,
       });
     ...
     default:
       return state;
   }
   ```