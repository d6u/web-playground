const resolveModule = require('../util/ModuleUtil').resolveModule;
import { RenderError } from '../Error';

module.exports = function renderCoffee(str) {
  return resolveModule('coffee-script')
    .then(function (coffee) {
      return coffee.compile(str);
    })
    .catch(function (err) {
      return new RenderError(err.message);
    });
};
