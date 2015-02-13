$(function() {

  $('form[name="login"]').on('submit', function(event) {

    var form = $(this);
    event.preventDefault();

    var data = form.serialize();

    $.ajax({
      type: 'POST',
      url: '/login',
      data: data
    })
    .done(function(json) {
      var user = json.user;
      var token = json.token;

      localStorage.setItem('token', token);
      alert(localStorage.getItem('token'));

      // save token and redirect to Ember route based on user type
      switch (user.type) {
        case 'p':
          window.location.href = "/parent";
          break;
        case 'v':
          window.location.href = "/volunteer";
          break;
        case 'a':
          window.location.href = "/admin";
          break;
        case 'f':
          window.location.href = "/front-desk";
          break;
      }
    })
    .fail(function() {
      form.trigger('reset');

      // flash an error message
      $('.alert').show();
    });

  });

});