$(function() {
  var user = null;

  $('#user-form').submit(function(event) {
    var form = $(this);
    event.preventDefault();

    // console.log(form_data);

    // if (!validateEmail(document.getElementById('user-email').value)) {
    //   alert('failed Email validation');
    //   return false;
    // }

    var pass = document.getElementById('user-password').value;
    var conf_pass = document.getElementById('user-password-conf').value

    if (!validatePassword(pass, conf_pass)) {
      
      return false;
    }

    if (!validateAccountType($('#user-type').val())) {
      alert('failed account validation');
      return false;
    }

    var form_data = form.serialize();

    // make the AJAX call to save user
    $.ajax({
      type: 'POST',
      url: '/register',
      data: form_data
    })
    .done(function(json) {
      // bring up next form
      user = json.user;
      $('#user-registration-div').hide();
      switch (user.type) {
        case 'p': {
          $('#parent-email').val(user.email);
          $('#parent-registration-div').show();
          break;
        }
        case 'v': {
          $('#volunteer-email').val(user.email);
          $('#volunteer-registration-div').show();
          break;
        }
      }
      console.log(json.user);
    })
    .fail(function(json) {
      // figure out what went wrong

      console.log(json);
    });
  });

  $('#parent-form').submit(function(event) {
    var form = $(this);
    event.preventDefault();


    // do some validations here

    var form_data = form.serialize();

    // make the call
    $.ajax({
      type: 'POST',
      url: '/register/' + user._id,
      data: form_data
    })
    .done(function(json) {
      $('#parent-form').hide();
      $('#registration-success-div').show();
    })
    .fail(function(json) {

    });
  });

  $('#volunteer-form').submit(function(event) {
    var form = $(this);
    event.preventDefault();


    // do some validations here

    var form_data = form.serialize();

    // make the call
    $.ajax({
      type: 'POST',
      url: '/register/' + user._id,
      data: form_data
    })
    .done(function(json) {
      $('#volunteer-form').hide();
      $('#registration-success-div').show();
    })
    .fail(function(json) {

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
