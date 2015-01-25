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
    .done(function(json) {
      appendToList([json.parent]);
      form.trigger('reset');
    })
    .fail(function(message) {
      alert(message);
    });
  });
  
  $(document).on('click', '.parents-link', function(event) {
    var anchor = $(this);
    var url = anchor.attr('href');
    // alert(url);
    event.preventDefault();
    
    $.ajax({
      type: 'DELETE',
      url: url
    })
    .done(function() {
      anchor.parent().remove();
    })
    .fail(function(message) {
      console.log(message);
      alert(message);
    });
  });
  
  function appendToList(parents) {
    var list = [];
    parents.forEach(function(parent) {
      var html = '<li><a class="parents-link" href="/parents/' + parent._id + '">' + parent.first_name + ' ' + parent.last_name;
      list.push(html);
    });
    $('#parent-list').append(list);
  }
  
});