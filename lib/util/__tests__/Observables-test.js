'use strict';

jest.autoMockOff();

describe('Observables', () => {

  const Observables = require('../Observables');
  const NoMoreFallbacksError = Observables.NoMoreFallbacksError;

  describe('createFallbacks', () => {

    it('emits fallback element when error', () => {
      const createFallbacks = Observables.createFallbacks;
      const subscribeMock = jest.genMockFn();

      createFallbacks(['a', 'b'])
        .doOnNext((val) => {
          if (val === 'a') {
            throw new Error();
          }
        })
        .retry()
        .subscribe(subscribeMock);

      expect(subscribeMock).toBeCalledWith('b');
    });

    it('throws error when no more fallbacks', () => {
      const createFallbacks = Observables.createFallbacks;
      const subscribeMock = jest.genMockFn();

      createFallbacks(['a', 'b'])
        .doOnNext((val) => {
          throw new Error();
        })
        .retry(3)
        .subscribeOnError(subscribeMock);

      expect(subscribeMock).toBeCalledWith(jasmine.any(NoMoreFallbacksError));
    });

  });

  describe('tryInOrder', () => {

    it('retries until no more fallbacks', () => {
      const tryInOrder = Observables.tryInOrder;
      const selectorMock = jest.genMockFn();
      selectorMock.mockImpl((val) => {
        throw new Error();
      });
      const subscribeMock = jest.genMockFn();
      const subscribeOnErrorMock = jest.genMockFn();

      tryInOrder(selectorMock, ['a', 'b'])
        .subscribe(subscribeMock, subscribeOnErrorMock);

      expect(selectorMock.mock.calls[0][0]).toBe('a');
      expect(selectorMock.mock.calls[1][0]).toBe('b');
      expect(subscribeMock).not.toBeCalled();
      expect(subscribeOnErrorMock).toBeCalledWith(jasmine.any(NoMoreFallbacksError));
    });

  });

});
