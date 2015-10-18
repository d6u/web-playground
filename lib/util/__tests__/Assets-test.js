'use strict';

jest.autoMockOff();
jest.mock('../../asset-definitions');
jest.mock('../Observables');
jest.mock('../File');
jest.mock('../Log');

const Rx = require('rx');

describe('Assets', () => {

  describe('createAssetFileIfNotExist', () => {

    const mockPlayground = {
      html: {
        preprocessor: 'processor_name'
      }
    };

    let assetDefinitions;
    let Observables;
    let File;
    let Log;
    let tryInOrderObservable;
    let factory;
    let createAssetFileIfNotExist;

    beforeEach(() => {
      assetDefinitions = require('../../asset-definitions');
      assetDefinitions.html = {
        preProcessors: {
          processor_name: {
            extensions: ['ext1', 'ext2', 'ext3']
          }
        }
      };

      tryInOrderObservable = new Rx.Subject();

      Observables = require('../Observables');
      Observables.tryInOrderCurry.mockReturnValue(tryInOrderObservable);

      File = require('../File');

      Log = require('../Log');

      factory = jest.genMockFn();
      factory.mockReturnValue('html_content');

      createAssetFileIfNotExist = require('../Assets').createAssetFileIfNotExist;
    });

    it('finds predefined extension names of asset type and pre-processor type', () => {
      createAssetFileIfNotExist('/home', 'html', factory)(mockPlayground);

      expect(Observables.tryInOrderCurry).toBeCalledWith(
        jasmine.any(Function),
        ['ext1', 'ext2', 'ext3']
      );
    });

    it('passes asset file path to `readFile`', () => {
      createAssetFileIfNotExist('/home', 'html', factory)(mockPlayground);
      Observables.tryInOrderCurry.mock.calls[0][0]('some_ext');
      expect(File.readFile).toBeCalledWith('/home/html.some_ext');
    });

    it('logs file creation', () => {
      createAssetFileIfNotExist('/home', 'html', factory)(mockPlayground).subscribe();
      tryInOrderObservable.onError(new Error());
      expect(Log.info).toBeCalledWith('Did not find /home/html.ext1, creating one...');
      jest.runAllTimers();
      expect(Log.logCreateFile).toBeCalledWith('/home/html.ext1');
    });

    it('invokes `writeFile` with target file name', () => {
      createAssetFileIfNotExist('/home', 'html', factory)(mockPlayground).subscribe();
      tryInOrderObservable.onError(new Error());
      jest.runAllTimers();
      expect(File.writeFile).toBeCalledWith('/home/html.ext1');
    });

    it('invokes `factory` with first extension', () => {
      createAssetFileIfNotExist('/home', 'html', factory)(mockPlayground).subscribe();
      tryInOrderObservable.onError(new Error());
      expect(factory).toBeCalledWith('ext1');
    });

  });

  describe('extensionsForAsset', () => {

    const mockPlayground = {
      html: {
        preprocessor: 'processor_name'
      }
    };

    let assetDefinitions;
    let extensionsForAsset;

    beforeEach(() => {
      assetDefinitions = require('../../asset-definitions');
      assetDefinitions.html = {
        preProcessors: {
          processor_name: {
            extensions: ['ext1', 'ext2', 'ext3']
          }
        }
      };

      extensionsForAsset = require('../Assets').extensionsForAsset;
    });

    it('finds predefined extension names of asset type', () => {
      expect(extensionsForAsset('html')(mockPlayground))
        .toEqual(['ext1', 'ext2', 'ext3']);
    });

  });

  describe('rendererForAsset', () => {

    const mockPlayground = {
      html: {
        preprocessor: 'processor_name'
      }
    };

    let assetDefinitions;
    let renderer;
    let rendererForAsset;

    beforeEach(() => {
      renderer = jest.genMockFn();

      assetDefinitions = require('../../asset-definitions');
      assetDefinitions.html = {
        preProcessors: {
          processor_name: {
            render: renderer
          }
        }
      };

      rendererForAsset = require('../Assets').rendererForAsset;
    });

    it('finds predefined render function for asset type', () => {
      expect(rendererForAsset('html')(mockPlayground))
        .toBe(renderer);
    });

  });

  describe('postProcessorForCss', () => {

    const mockPlayground = {
      css: {
        vender_prefixing: 'post_processor_name'
      }
    };

    let assetDefinitions;
    let renderer;
    let postProcessorForCss;

    beforeEach(() => {
      renderer = jest.genMockFn();

      assetDefinitions = require('../../asset-definitions');
      assetDefinitions.css = {
        postProcessors: {
          post_processor_name: {
            render: renderer
          }
        }
      };

      postProcessorForCss = require('../Assets').postProcessorForCss;
    });

    it('finds CSS post processor render function', () => {
      expect(postProcessorForCss(mockPlayground))
        .toBe(renderer);
    });

  });

  // describe('getHtmlExts', () => {
  //
  //   it('', () => {
  //   });
  //
  // });
  //
  // describe('getHtmlRenderer', () => {
  //
  //   it('', () => {
  //   });
  //
  // });
  //
  // describe('getJsExts', () => {
  //
  //   it('', () => {
  //   });
  //
  // });
  //
  // describe('getJsRenderer', () => {
  //
  //   it('', () => {
  //   });
  //
  // });
  //
  // describe('getCssExts', () => {
  //
  //   it('', () => {
  //   });
  //
  // });
  //
  // describe('getCssRenderer', () => {
  //
  //   it('', () => {
  //   });
  //
  // });


});
