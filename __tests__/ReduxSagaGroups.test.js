import { expectSaga } from 'redux-saga-test-plan';
import requestSaga from '../store/sagas/request.sagas';
import groupsReducer from '../store/reducers/groups.reducer';
import requestReducer from '../store/reducers/request.reducer';
import { combineReducers } from 'redux';
import * as groupActions from '../store/actions/groups.actions';

describe.skip('Redux Saga - Groups', () => {
  it('Groups - Online', (done) => {
    const request = {
      domain: 'dtappdemo.wpengine.com',
      token: '',
      offset: 0,
      limit: 10,
      sort: 'name',
    };

    const getGroupsPayload = {
      url: `https://${request.domain}/wp-json/dt-posts/v2/groups?offset=${request.offset}&limit=${request.limit}&sort=${request.sort}`,
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${request.token}`,
        },
      },
      action: groupActions.GROUPS_GETALL_RESPONSE,
    };

    const getGroups = {
      type: 'REQUEST',
      payload: getGroupsPayload,
    };

    const initialState = {
      groups: [],
    };

    const reducers = combineReducers({
      requestReducer,
      groupsReducer,
    });

    return expectSaga(requestSaga)
      .withState(initialState)
      .withReducer(reducers)
      .dispatch(getGroups)
      .run()
      .then(
        (value) => {
          console.log(value.storeState);
        },
        (error) => {
          console.error(error);
        },
      )
      .finally(() => {
        done();
      });
  });
});
