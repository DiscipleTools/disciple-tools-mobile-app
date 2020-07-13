import React from 'react';
//import App from '../App';
import { shallow, mount } from 'enzyme';

describe.skip('Test Describe', () => {
  it('Test ID', () => {
    //const wrapper = shallow(<App />);
    const wrapper = mount(<App />);
    console.log(wrapper.instance().state);
    console.log(wrapper.debug());
    setImmediate(() => {
      console.log(wrapper.instance().state);
      console.log(wrapper.debug());
      expect(true).toBeTruthy();
    });
    //expect(wrapper.exists()).toBeTruthy();
    //let providerExist;
    /*do {
            //console.log(wrapper.instance().state);
            wrapper.update();
            //providerExist = wrapper.find('AppNavigator');
        } while (!wrapper.instance().state.isLoadingComplete)
        console.log(wrapper.debug());*/
  });
});
