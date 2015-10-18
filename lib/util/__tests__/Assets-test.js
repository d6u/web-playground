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
    let actualFile;
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
      Observables.tryInOrder.mockReturnValue(tryInOrderObservable);

      actualFile = require.requireActual('../File');
      File = require('../File');
      File.join = actualFile.join;

      Log = require('../Log');

      factory = jest.genMockFn();
      factory.mockReturnValue('html_content');

      createAssetFileIfNotExist = require('../Assets').createAssetFileIfNotExist;
    });

    it('finds predefined extension names of asset type and pre-processor type', () => {
      createAssetFileIfNotExist('/home', 'html', factory)(mockPlayground);

      expect(Observables.tryInOrder).toBeCalledWith(
        jasmine.any(Function),
        ['ext1', 'ext2', 'ext3']
      );
    });

    it('passes asset file path to `readFile`', () => {
      createAssetFileIfNotExist('/home', 'html', factory)(mockPlayground);
      Observables.tryInOrder.mock.calls[0][0]('some_ext');
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
        preprocessor: 'html_processor_name'
      },
      js: {
        preprocessor: 'js_processor_name'
      },
      css: {
        preprocessor: 'css_processor_name'
      }
    };

    let assetDefinitions;
    let extensionsForAsset;

    beforeEach(() => {
      assetDefinitions = require('../../asset-definitions');
      assetDefinitions.html = {
        preProcessors: {
          html_processor_name: {
            extensions: ['ext1', 'ext2', 'ext3']
          }
        }
      };
      assetDefinitions.js = {
        preProcessors: {
          js_processor_name: {
            extensions: ['ext11', 'ext12', 'ext13']
          }
        }
      };
      assetDefinitions.css = {
        preProcessors: {
          css_processor_name: {
            extensions: ['ext21', 'ext22', 'ext23']
          }
        }
      };

      extensionsForAsset = require('../Assets').extensionsForAsset;
    });

    it('finds predefined extension names of asset type', () => {
      expect(extensionsForAsset('html')(mockPlayground))
        .toEqual(['ext1', 'ext2', 'ext3']);
    });

    describe('getHtmlExts', () => {

      it('finds predefined extension names for HTML asset', () => {
        expect(require('../Assets').getHtmlExts(mockPlayground))
          .toEqual(['ext1', 'ext2', 'ext3']);
      });

    });

    describe('getJsExts', () => {

      it('finds predefined extension names for JS asset', () => {
        expect(require('../Assets').getJsExts(mockPlayground))
          .toEqual(['ext11', 'ext12', 'ext13']);
      });

    });

    describe('getCssExts', () => {

      it('finds predefined extension names for CSS asset', () => {
        expect(require('../Assets').getCssExts(mockPlayground))
          .toEqual(['ext21', 'ext22', 'ext23']);
      });

    });

  });

  describe('rendererForAsset', () => {

    const mockPlayground = {
      html: {
        preprocessor: 'html_processor_name'
      },
      js: {
        preprocessor: 'js_processor_name'
      },
      css: {
        preprocessor: 'css_processor_name'
      }
    };

    let assetDefinitions;
    let htmlRenderer;
    let jsRenderer;
    let cssRenderer;
    let rendererForAsset;

    beforeEach(() => {
      htmlRenderer = jest.genMockFn();
      jsRenderer = jest.genMockFn();
      cssRenderer = jest.genMockFn();

      assetDefinitions = require('../../asset-definitions');
      assetDefinitions.html = {
        preProcessors: {
          html_processor_name: {
            render: htmlRenderer
          }
        }
      };
      assetDefinitions.js = {
        preProcessors: {
          js_processor_name: {
            render: jsRenderer
          }
        }
      };
      assetDefinitions.css = {
        preProcessors: {
          css_processor_name: {
            render: cssRenderer
          }
        }
      };

      rendererForAsset = require('../Assets').rendererForAsset;
    });

    it('finds predefined render function for asset type', () => {
      expect(rendererForAsset('html')(mockPlayground))
        .toBe(htmlRenderer);
    });

    describe('getHtmlRenderer', () => {

      it('finds predefined render function for HTML asset', () => {
        expect(require('../Assets').getHtmlRenderer(mockPlayground))
          .toBe(htmlRenderer);
      });

    });

    describe('getJsRenderer', () => {

      it('finds predefined render function for JS asset', () => {
        expect(require('../Assets').getJsRenderer(mockPlayground))
          .toBe(jsRenderer);
      });

    });

    describe('getCssRenderer', () => {

      it('finds predefined render function for CSS asset', () => {
        expect(require('../Assets').getCssRenderer(mockPlayground))
          .toBe(cssRenderer);
      });

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

});
