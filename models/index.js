// use this to init all models in Mongoose
var models = ['admin', 'front-desk', 'parent', 'reader', 'volunteer', 'pair'];

module.exports = function() {
//   console.log('here!!!');
  models.forEach(function(model) {
    require('./' + model)();
  });
}