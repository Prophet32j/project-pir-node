$(function() {

  $('#login-form').submit(function(event) {

    var form = $(this);
    // event.preventDefault();

    var data = form.serialize();
    data.isBrower = true;

    $.ajax({
      type: 'POST',
      url: '/login',
      data: data
    })
    .done(function(json) {
      var user = json.user;
      var token = json.token;

      // save token and redirect to dashboard
      localStorage.setItem('token', token);
      // alert(localStorage.getItem('token'));

      window.location.href = "/dashboard?token="+token;
    })
    .fail(function() {
      form.trigger('reset');

      // flash an error message
      $('.alert').append("<p> <strong>Error! </strong>Incorrect email or password</p>");
    });

  });

});