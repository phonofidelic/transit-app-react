import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from './';
import * as types from '../actiontypes';
import nock from 'nock';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('asynch actions', () => {
  afterEach(() => {
    nock.cleanAll()
  });

  it('creates RECIEVE_ROUTES when routes fetch is done', () => {
    nock('https://transit.land')
    .get('/api/v1/feeds?bbox=-122.4183,37.7758,-122.4120,37.7858')
    .reply(200, {
      response: 'hello'
    });

    const expectedActions = [
      { type: types.RECIEVE_ROUTES }
    ];

    const store = mockStore({ routes: [] });

    return store.dispatch(actions.fetchNearbyRoutes())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
  })
})