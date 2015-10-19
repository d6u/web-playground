'use strict';

jest.autoMockOff();
jest.mock('portscanner');

describe('Options', () => {

  describe('mergeDefault', () => {

    beforeEach(() => {
      require('portscanner').findAPortNotInUse.mockImpl((a, b, c, done) => {
        done(null, 3456);
      });
    });

    it('merges default options with provided ones', () => {
      const mergeDefault = require('../Options').mergeDefault;
      const resultMock = jest.genMockFn();
      mergeDefault({}).then(resultMock);
      jest.runAllTimers();
      expect(resultMock).toBeCalledWith({
        port: 3456,
        bundle: false,
        openBrowser: true,
        liveReload: true,
        baseDir: jasmine.any(String),
      });
    });

  });

});
