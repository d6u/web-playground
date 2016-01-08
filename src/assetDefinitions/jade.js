const resolveModule = require('../util/ModuleUtil').resolveModule;
import { RenderError } from '../Error';

module.exports = function renderJade(str) {
  return resolveModule('jade')
    .then(function (jade) {
      return jade.render(str, {pretty: true});
    })
    .catch(function (err) {
      return new RenderError(err.message);
    });
};
