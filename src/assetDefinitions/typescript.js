const resolveModule = require('../util/ModuleUtil').resolveModule;
import { RenderError } from '../Error';

module.exports = function renderTypeScript(str) {
  return resolveModule('typescript')
    .then(function (typescript) {
      return typescript.transpile(str);
    })
    .catch(function (err) {
      return new RenderError(err.message);
    });
};
