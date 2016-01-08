const resolveModule = require('../util/ModuleUtil').resolveModule;
import { RenderError } from '../Error';

module.exports = function renderEjs(str) {
  return resolveModule('ejs')
    .then(function (ejs) {
      return ejs.render(str);
    })
    .catch(function (err) {
      return new RenderError(err.message);
    });
};
