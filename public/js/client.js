$(function() {
  
  // get all users and append to page
  $.get('/users', appendToList);
  
  // form submission to test POST /users
  $('form').on('submit', function(event) {
    var form = $(this);
    
    event.preventDefault();
    
    var userData = form.serialize();
    
    $.ajax({
      type: 'POST',
      url: '/users',
      data: userData
    })
    .done(function(user) {
      appendToList([user]);
      form.trigger('reset');
    })
    .fail(function(message) {
      
    });
  });
  
  function appendToList(users) {
    var list = [];
    for (i in users) {
      var html = '<li>' + users[i];
      list.push(html);
    }
    $('#user-list').append(list);
  }
});