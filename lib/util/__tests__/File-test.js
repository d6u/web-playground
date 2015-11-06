'use strict';

jest.autoMockOff();
jest.mock('fs');
jest.mock('chokidar');

describe('File', () => {

  describe('readFile', () => {
    it('reads file with encoding', () => {
      const fs = require('fs');
      const readFile = require('../File').readFile;
      readFile('file_name');
      expect(fs.readFile).toBeCalledWith(
        'file_name',
        {encoding: 'utf8'},
        jasmine.any(Function)
      );
    });
  });

  describe('writeFile', () => {
    it('writes file with encoding', () => {
      const fs = require('fs');
      const writeFile = require('../File').writeFile;
      writeFile('file_name', 'file_content');
      expect(fs.writeFile).toBeCalledWith(
        'file_name',
        'file_content',
        {encoding: 'utf8'},
        jasmine.any(Function)
      );
    });
  });

  describe('watch', () => {
    let chokidar;
    let watch;
    let onMock;
    let closeMock;

    beforeEach(() => {
      chokidar = require('chokidar');
      onMock = jest.genMockFn();
      closeMock = jest.genMockFn();
      chokidar.watch.mockReturnValue({
        on: onMock,
        close: closeMock,
      });
      watch = require('../File').watch;
    });

    it('invokes chokidar.watch on subscribe', () => {
      expect(chokidar.watch).not.toBeCalled();
      watch('pattern').subscribe();
      expect(chokidar.watch).toBeCalledWith(
        'pattern',
        {
          ignored: jasmine.any(RegExp),
          persistent: true
        });
    });

    it('emits element on file change', () => {
      const subscribeMock = jest.genMockFn();
      watch('pattern').subscribe(subscribeMock);
      expect(subscribeMock).not.toBeCalled();
      onMock.mock.calls[0][1](null, 'file_path');
      expect(subscribeMock).toBeCalledWith('file_path');
    });

    it('closes watcher on un-subscribe', () => {
      const disposable = watch('pattern').subscribe();
      expect(closeMock).not.toBeCalled();
      disposable.dispose();
      expect(closeMock).toBeCalled();
    });

  });

});
