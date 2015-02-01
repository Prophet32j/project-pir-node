$(function() {

  $('form[name="user-registration"]').on('submit', function(event) {
    var form = $(this);
    event.preventDefault();

    var form_data = form.serialize();
    // console.log(form_data);

    if (!validateEmail(document.getElementById('emailaddress').value)) {
      alert('failed Email validation');
      return false;
    }
    var pass = document.getElementById('password').value;
    var conf_pass = document.getElementById('password-conf').value
    if (!validatePassword(pass, conf_pass)) {
      alert('failed Password validation');
      return false;
    }

    if (!validateAccountType($('#account').val())) {
      alert('failed account validation');
      return false;
    }

    // make the AJAX call to save user
    $.ajax({
      type: 'POST',
      url: '/register',
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

});

function validateEmail(email) {
  return true;
}

function validatePassword(pass, conf_pass) {
  return pass && pass === conf_pass;
}

function validateAccountType(type) {
  return type === 'p' || type === 'v';
}