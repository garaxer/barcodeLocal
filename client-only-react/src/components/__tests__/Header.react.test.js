// https://create-react-app.dev/docs/running-tests/
// https://redux.js.org/recipes/writing-tests
// https://willowtreeapps.com/ideas/best-practices-for-unit-testing-with-a-react-redux-approach
// Export the component without the store and shallow render to test
import React from 'react';
import { shallow } from 'enzyme';
import { Header } from '../Header.jsx';

import { App } from '../App.jsx';

import UserProfile from '../users/UserProfile';

it('renders without crashing', () => {
  shallow(<App />);
});

it('renders without crashing', () => {
  shallow(<UserProfile match={{ params: 1 }} />);
});

it('renders welcome message', () => {
  const wrapper = shallow(<Header />);
  const welcome = 'DNRME Survey Integration - Barcode Generator';
  // expect(wrapper.contains(welcome)).toBe(true);
  expect(wrapper.contains(welcome)).toEqual(true);
});
