'use strict';

jest.autoMockOff();
jest.mock('fs');
jest.mock('chokidar');

describe('File', function () {

  describe('readFile', function () {
    it('reads file with encoding', function () {
      var fs = require('fs');
      var readFile = require('../File').readFile;
      readFile('file_name');
      expect(fs.readFile).toBeCalledWith(
        'file_name',
        {encoding: 'utf8'},
        jasmine.any(Function)
      );
    });
  });

  describe('writeFile', function () {
    it('writes file with encoding', function () {
      var fs = require('fs');
      var writeFile = require('../File').writeFile;
      writeFile('file_name', 'file_content');
      expect(fs.writeFile).toBeCalledWith(
        'file_name',
        'file_content',
        {encoding: 'utf8'},
        jasmine.any(Function)
      );
    });
  });

  describe('watch', function () {
    var chokidar;
    var watch;
    var onMock;
    var closeMock;

    beforeEach(function () {
      chokidar = require('chokidar');
      onMock = jest.genMockFn();
      closeMock = jest.genMockFn();
      chokidar.watch.mockReturnValue({
        on: onMock,
        close: closeMock,
      });
      watch = require('../File').watch;
    });

    it('invokes chokidar.watch on subscribe', function () {
      expect(chokidar.watch).not.toBeCalled();
      watch('pattern').subscribe();
      expect(chokidar.watch).toBeCalledWith(
        'pattern',
        {
          ignored: jasmine.any(RegExp),
          persistent: true
        });
    });

    it('emits element on file change', function () {
      var subscribeMock = jest.genMockFn();
      watch('pattern').subscribe(subscribeMock);
      expect(subscribeMock).not.toBeCalled();
      onMock.mock.calls[0][1](null, 'file_path');
      expect(subscribeMock).toBeCalledWith('file_path');
    });

    it('closes watcher on un-subscribe', function () {
      var disposable = watch('pattern').subscribe();
      expect(closeMock).not.toBeCalled();
      disposable.dispose();
      expect(closeMock).toBeCalled();
    });

  });

});
