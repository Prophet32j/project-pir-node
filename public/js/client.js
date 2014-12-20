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
  
  $('.a-users-del').click(function(event) {
    var anchor = $(this);
    var url = anchor.attr('href');
    
    event.preventDefault();
    
    $.ajax({
      type: 'DELETE',
      url: url
    })
    .done(function() {
      anchor.remove();
    })
    .fail(function(message) {
      alert(message);
    });
  });
  
  function appendToList(users) {
    var list = [];
    users.forEach(function(user) {
      var html = '<li><a href="/users/' + user.data._id + '">' + 
          user.data.first_name + ' ' + user.data.last_name + '</a>' + '\t' +
          '<a class="a-users-del" href="/users/' + user.data._id + '">delete</a>';
      list.push(html);
    });
    $('#user-list').append(list);
  }
  
});