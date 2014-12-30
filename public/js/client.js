$(function() {
  
  // get all users and append to page
  $.get('/parents', function(json) {
    appendToList(json.parents);
  });
  
  // form submission to test POST /users
  $('form[name="parent-form"]').on('submit', function(event) {
    var form = $(this);
    event.preventDefault();
    
    var data = form.serialize();
    
    $.ajax({
      type: 'POST',
      url: '/parents',
      data: data
    })
    .done(function(parent) {
      appendToList([parent]);
      form.trigger('reset');
    })
    .fail(function(message) {
      alert(message);
    });
  });
  
//   $(document).on('click', '.a-users-del', function(event) {
//     var anchor = $(this);
//     var url = anchor.attr('href');
//     alert(url);
//     event.preventDefault();
    
//     $.ajax({
//       type: 'DELETE',
//       url: url
//     })
//     .done(function() {
//       anchor.parent().remove();
//     })
//     .fail(function(message) {
//       alert(message);
//     });
//   });
  
  function appendToList(parents) {
    var list = [];
    parents.forEach(function(parent) {
      var html = '<li><a href="/parents/' + parent._id + '">' + parent.email;
      list.push(html);
    });
    $('#parent-list').append(list);
  }
  
});