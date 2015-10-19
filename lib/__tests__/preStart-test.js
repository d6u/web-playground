'use strict';

jest.autoMockOff();
jest.mock('../util/Log');
jest.mock('../util/File');
jest.mock('../util/Playground');

const Bluebird = require('bluebird');

describe('preStart', () => {

  const mockOpts = {
    baseDir: '/home/project',
  };

  let File;
  let Playground;

  beforeEach(() => {
    File = require('../util/File');
    File.join = require.requireActual('../util/File').join;
    File.readFile.mockReturnValueOnce('key: value');
    File.readFile.mockReturnValue(Bluebird.resolve(''));

    Playground = require('../util/Playground');
    Playground.getExt.mockReturnValue('yml');
    Playground.parse.mockImpl(require.requireActual('../util/Playground').parse);
  });

  it.only('runs through everything', () => {
    const preStart = require('../preStart');
    const resultMock = jest.genMockFn();
    preStart(mockOpts).then(resultMock);
    jest.runAllTimers();

    expect(File.readFile).toBeCalledWith('/home/project/playground.yml');
    expect(File.readFile).toBeCalledWith('/home/project/html.html');
    expect(File.readFile).toBeCalledWith('/home/project/js.js');
    expect(File.readFile).toBeCalledWith('/home/project/css.css');

    expect(Playground.getExt).toBeCalledWith('playground.yml');

    expect(Playground.parse).toBeCalledWith('yml', 'key: value');

    expect(resultMock).toBeCalledWith([false]);
  });

});
