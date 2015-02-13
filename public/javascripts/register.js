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
    .fail(function(jqxhr) {
      // figure out what went wrong
      var err = jqxhr.responseJSON.error;
      switch (err.name) {
        case 'MongoError': {
          if (err.code == 11000) { // duplicate email
            // add styles to email div and show glyph
            $('#user-email-div').addClass('has-error');
            $('#user-email-span').removeClass('error-icon-hidden');
            $('#user-email-info').text('Email already in use');
          }
          break;
        }
        case 'NotFoundError': {
          // need to alert the user that the email/id wasn't found
        }
        default: {
          console.log('something else went wrong');
          console.error(err);
        }
      }
      // console.log(jqxhr.responseJSON.error);
    });
  });

  $('#parent-form').submit(function(event) {
    var form = $(this);
    event.preventDefault();


    // do some validations here

    var form_data = form.serialize();
    console.log(form_data);
    // make the call
    $.ajax({
      type: 'POST',
      url: '/register/' + user._id,
      data: form_data
    })
    .done(function(json) {
      $('#parent-registration-div').hide();
      $('#registration-success-div').show();
    })
    .fail(function(jqxhr) {
      console.log(jqxhr.responseJSON);
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
