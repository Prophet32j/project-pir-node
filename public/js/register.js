$(function() {

  $('form[name="user-registration"]').on('submit', function(event) {
    var form = $(this);
    event.preventDefault();

    var form_data = form.serialize();
    console.log(form_data);

    // if (validateEmail(form.))

    // make the AJAX call to save user
    $.ajax({
      type: 'POST',
      url: '/users',
      data: form_data
    })
    .done(function(json) {
      // bring up new page, or hide form and show success
      // user needs to go validate their email
      console.log(json.user);
      alert(json.user);
    })
    .fail(function(message) {
      // figure out what went wrong, handle this later
      console.log(message);
    });
  });

  function validateEmail(email) {
    return true;
  }

  function validatePassword(pass, conf_pass) {
    return pass === conf_pass;
  }
});