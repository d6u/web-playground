const resolveModule = require('../util/ModuleUtil').resolveModule;
const RenderError = require('../ServeAssets').RenderError;

module.exports = function renderEjs(str) {
  return resolveModule('ejs')
    .then(function (ejs) {
      return ejs.render(str);
    })
    .catch(function (err) {
      return new RenderError(err.message);
    });
};
