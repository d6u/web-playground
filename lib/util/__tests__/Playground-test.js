'use strict';

jest.autoMockOff();

describe('Playground', () => {

  describe('getExt', () => {

    it('return the extension of the path', () => {
      const getExt = require('../Playground').getExt;
      expect(getExt('/file/path.HTML')).toBe('html');
    });

  });

});
