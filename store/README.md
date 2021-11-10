# Data Store

The data store uses the [Redux](https://redux.js.org/) state container to manage data within the app.

Additions to the basic Redux setup include:

- [Redux Persist](https://github.com/rt2zz/redux-persist) - Automatically persists the data store to local storage so as to save the state between sessions and assist in allowing offline usage.

## Directory Structure

This `/store` directory is setup with the following structure:

- `actions/` - Redux action creators and constants grouped together by their root state property name (e.g. `users` and `contacts`)
- `reducers/` - Redux reducers that directly transform the state.
- `rootReducer.js` - Root reducer that joins together the individual reducers.
- `store.js` - Initialization of the app data store to be included in the root of the app

## Data Flow

Using the Redux pattern, data flows in a single direction around a loop:

`State` --> `Component` --> `Actions` --> `Reducer` --> `State`

![Redux Data Flow](./redux-data-flow.png)
