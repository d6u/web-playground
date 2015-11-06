/*eslint no-undefined:0*/

'use strict';

jest.autoMockOff();

describe('Functional', () => {

  describe('later', () => {

    it('wraps a provided function that returns a new funtion', () => {
      const later = require('../Functional').later;
      const initialFunc = jest.genMockFn();

      const wrappedFunc = later(initialFunc);
      expect(initialFunc.mock.calls.length).toEqual(0);

      const bindedFunc = wrappedFunc('arg1');
      expect(initialFunc.mock.calls.length).toEqual(0);

      bindedFunc('not taken');
      expect(initialFunc.mock.calls.length).toEqual(1);
      expect(initialFunc.mock.calls[0]).toEqual(['arg1']);
    });

  });

  describe('noop', () => {

    it('always returns nothing', () => {
      const noop = require('../Functional').noop;
      expect(noop()).toBe(undefined);
    });

  });

  describe('defaultToProps', () => {

    it('replaces `null` and `undefined` with default props', () => {
      const defaultToProps = require('../Functional').defaultToProps;
      expect(defaultToProps({a: 'val1', b: 'val2'}, {a: null, c: 'val3'}))
        .toEqual({a: 'val1', b: 'val2', c: 'val3'});
    });

  });

});
