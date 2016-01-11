import expect, { createSpy, spyOn, isSpy } from 'expect'

describe('Error', function () {

  describe('RenderError', function () {

    const { RenderError } = require('../src/Error');

    it('has correct error message', function () {
      const err = new RenderError('I am a message');

      expect(err.message).toBe('I am a message');
    });

  });

});
