$(function() {

  var user = {}, 
      parent = {}, 
      volunteer = {};
  
  // ajax call to check if email is registered
  $('#user-email').blur(function() {
    var email = $(this).val();
    if (email) {
      if (validateEmail(email)) {
        $('#user-email-div').addClass('has-error');
        $('#user-email-span').removeClass('error-icon-hidden');
        $('#user-email-info').text('Email already in use');
      } else {
        $('#user-email-div').removeClass('has-error');
        $('#user-email-span').addClass('error-icon-hidden');
        $('#user-email-info').text('');
      }
    }
  });

  $('#user-password-conf').blur(function() {
    var password, confPass;
    password = $('#user-password').val();
    confPass = $(this).val();
    if (!validatePassword(password, confPass)) {
      $('#user-password-div').addClass('has-error');
      $('.user-password-span').removeClass('error-icon-hidden');
      $('#user-password-info').text('Passwords do not match');
    } else {
      $('#user-password-div').removeClass('has-error');
      $('.user-password-span').addClass('error-icon-hidden');
      $('#user-password-info').text('');
    }
  });

  $('#next-1').click(function() {
    var email = $('#user-email').val();
    var password = $('#user-password').val();
    var password_conf = $('#user-password-conf').val();

    if (validateEmail(email) || !validatePassword(password, password_conf)) {
      return false;
    }

    // everything checks out
    user.email = email;
    user.password = password;

    // move to step 2
    $('#step-1').addClass('hidden');
    $('#step-2').removeClass('hidden');
  });

  $('#next-2').click(function() {
    var type = $('input[name=type]:checked').val();
    // make sure something is selected
    if(!type) {
      $('#user-type-div').addClass('has-error');
      $('#user-type-span').removeClass('error-icon-hidden');
      $('#user-type-info').text('Please select your account type');
      return false;
    } else {
      $('#user-type-div').removeClass('has-error');
      $('#user-type-span').addClass('error-icon-hidden');
      $('#user-type-info').text('');
    }
    user['type'] = type;

    // check to see if we need a step 4
    if (type === 'p') {
      $('#done-1').removeClass('hidden');
      $('#next-3').addClass('hidden');
    } else {
      $('#done-1').addClass('hidden');
      $('#next-3').removeClass('hidden');
    }

    // move to step 3
    $('#step-2').addClass('hidden');
    $('#step-3').removeClass('hidden');
  });

  $('#next-3').click(function() {
    var first_name = $('#first-name').val();
    var last_name = $('#last-name').val();
    var phone = $('#phone').val();

    // validate they aren't blank
    if (!first_name) {

      return false;
    } else if (!last_name) {

      return false;
    } else if (!phone) {

      return false;
    }

    volunteer.email = user.email;
    volunteer.first_name = first_name;
    volunteer.last_name = last_name;
    volunteer.phone = phone;

    // move to step 4
    $('#step-3').addClass('hidden');
    $('#step-4').removeClass('hidden');
  });

  $('#done-1').click(function() {
    var first_name = $('#first-name').val();
    var last_name = $('#last-name').val();
    var phone = $('#phone').val();

    // validate they aren't blank
    if (!first_name) {

      return false;
    } else if (!last_name) {

      return false;
    } else if (!phone) {

      return false;
    }

    parent.email = user.email;
    parent.first_name = first_name;
    parent.last_name = last_name;
    parent.phone = phone;

    // make the POST calls to register user and parent
    var json = registerUser(user, function(err, doc) {
      if (err) {
        return false;
      }
      registerAccount(doc._id, parent, function(err, account) {
        if (err) {
          return false;
        }
        $('#step-contents').addClass('hidden');
        $('#registration-success').removeClass('hidden');
      });
    });
  });
  //   .fail(function(jqxhr) {
  //     // figure out what went wrong
  //     var err = jqxhr.responseJSON.error;
  //     switch (err.name) {
  //       case 'MongoError': {
  //         if (err.code == 11000) { // duplicate email
  //           // add styles to email div and show glyph
  //           $('#user-email-div').addClass('has-error');
  //           $('#user-email-span').removeClass('error-icon-hidden');
  //           $('#user-email-info').text('Email already in use');
  //         }
  //         break;
  //       }
  //       case 'NotFoundError': {
  //         // need to alert the user that the email/id wasn't found
  //       }
  //       default: {
  //         console.log('something else went wrong');
  //         console.error(err);
  //       }
  //     }
  //     // console.log(jqxhr.responseJSON.error);
  //   });
  // });
  
  // register back button clicks
  $('#back-2').click(function() {
    $('#step-2').addClass('hidden');
    $('#step-1').removeClass('hidden');
  });
  $('#back-3').click(function() {
    $('#step-3').addClass('hidden');
    $('#step-2').removeClass('hidden');
  });
  $('#back-4').click(function() {
    $('#step-4').addClass('hidden');
    $('#step-3').removeClass('hidden');
  });
});

function validatePassword(pass, conf_pass) {
  return pass.length && pass === conf_pass;
}

function validateAccountType(type) {
  return type === 'p' || type === 'v';
}

function validateEmail(email) {
  var uri = "/api/users/exists/";
  var encoded = uri + encodeURIComponent(email)
  console.log(encoded);
  $.ajax({
    type: 'GET',
    url: encoded
  })
  .done(function(json) {
    return true;
  })
  .fail(function(jqXHR) {
    return false;
  });
}

function registerUser(data, callback) {
  $.ajax({
    type: 'POST',
    url: '/register',
    data: data
  })
  .done(function(json) {
    return callback(null, json.user);
  })
  .fail(function(jqxhr) {
    return callback(jqxhr.responseJSON.error);
  });
}

function registerAccount(user_id, account, callback) {
  $.ajax({
    type: 'POST',
    url: '/register/' + user_id,
    data: account
  })
  .done(function(json) {
    return callback(null, json);
  })
  .fail(function(jqxhr) {
    return callback(jqxhr.responseJSON.error);
  });
}
