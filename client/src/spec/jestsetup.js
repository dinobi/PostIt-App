import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import jwtDecode from 'jwt-decode';
// import localStorage from 'mock-local-storage'
// React 15 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });

global.window = {}

// Make Enzyme functions available in all test files without importing
global.shallow = shallow;
global.render = render;
global.mount = mount;
global.$ = jest.fn();



// Mock browser api and make it available in all test files without importing

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

