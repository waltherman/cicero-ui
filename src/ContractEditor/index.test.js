import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import ContractEditor from './index';

const props = {
  value: null,
  onChange: () => 1,
  lockText: true,
  template: {},
  loadTemplateObject: () => 1,
  parseClause: () => 1,
};

describe('<ContractEditor />', () => {
  describe('on initialization', () => {
    it('renders page correctly', () => {
      const component = shallow(<ContractEditor {...props} />);
      const tree = toJson(component);
      expect(tree).toMatchSnapshot();
    });
  });
});
