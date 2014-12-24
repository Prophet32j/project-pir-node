$(function() {
  
  // get all users and append to page
  $.get('/parents', function(parents) {
    appendToList('parent-list', parents);
  });
  
  // form submission to test POST /users
  $('form[name="parent-form"]').on('submit', function(event) {
    var form = $(this);
    alert('hello');
    event.preventDefault();
    
    var data = form.serialize();
    
    $.ajax({
      type: 'POST',
      url: '/parents',
      data: data
    })
    .done(function(doc) {
      appendToList('parent-list', [doc]);
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
  
  function appendToList(id, docs) {
    var list = [];
    docs.forEach(function(doc) {
      var html = '<li><a href="/parents/' + doc._id + '">' + doc.email;
      list.push(html);
    });
    $('#' + id).append(list);
  }
  
});