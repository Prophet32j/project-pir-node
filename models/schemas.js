// use this to init all models in Mongoose
var models = ['admin', 'front-desk', 'parent', 'reader', 'volunteer'];

exports.init = function() {
  models.forEach(function(model) {
    require('./' + model)();
  });
}