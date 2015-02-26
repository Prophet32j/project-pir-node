$(function() {

  var user = {}, 
      parent = {}, 
      volunteer = {};
  
  // ajax call to check if email is registered
  $('#user-email').blur(function() {
    var email = $(this).val();
    if (email) {
      validateEmail(email, function(exists) {
        if (exists) {
          displayFormError('user-email-div', 'Email already in use');
        } else {
          hideFormError('user-email-div');
        }
      });
    }
  });

  $('#user-password-conf').blur(function() {
    var password, confPass;
    password = $('#user-password').val();
    confPass = $(this).val();
    if (!validatePassword(password, confPass)) {
      displayFormError('user-password-div', 'Password do not match');
      return false;
    } else {
      hideFormError('user-password-div');
    }
  });

  $('#next-1').click(function() {
    var email = $('#user-email').val();
    var password = $('#user-password').val();
    var password_conf = $('#user-password-conf').val();

    if (!validatePassword(password, password_conf)) {
      return false;
    }

    return validateEmail(email, function(exists) {
      if (exists) {
        displayFormError('user-email-div', 'Email already exists');
        return false;
      }
      hideFormError('user-email-div');

      // everything checks out
      user.email = email;
      user.password = password;

      // move to step 2
      $('#step-1').addClass('hidden');
      $('#step-2').removeClass('hidden');
      return true;
    });
  });

  $('#next-2').click(function() {
    var type = $('input[name=type]:checked').val();
    // make sure something is selected
    if(!type) {
      displayFormError('user-type-div', 'Please select your account type');
      return false;
    } else {
      hideFormError('user-type-div');
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
    if (!validateBasicInfo(first_name, last_name, phone)) {
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
    if (!validateBasicInfo(first_name, last_name, phone)) {
      return false;
    }

    parent.email = user.email;
    parent.first_name = first_name;
    parent.last_name = last_name;
    parent.phone = phone;

    // make the POST calls to register user and parent
    register({ user: user, parent: parent }, function(err) {
      if (err) {
        displayUserError(err);
        return false;
      }
      
      displaySuccess();
    });
  });

  $('#done-2').click(function() {
    var affiliation = $('#volunteer-affiliation').val();
    var gender = $('input[name=gender]:checked').val();
    var two_readers = $('input[name=two_reader]:checked').val();
    var special_ed = $('input[name=special_ed]:checked').val();
    var language_ed = $('input[name=language_ed]:checked').val();
    var about_me = $('#volunteer-about-me').val();

    if (!validateVolunteerInfo(affiliation, gender, about_me)) {
      return false;
    }

    // everything checks out

    volunteer.affiliation = affiliation;
    volunteer.gender = gender;
    volunteer.two_readers = (two_readers === 'true' ? true : false);
    volunteer.special_ed = (special_ed === 'true' ? true : false)
    volunteer.language_ed = (language_ed === 'true' ? true : false)
    volunteer.about_me = about_me;

    register({ user: user, volunteer: volunteer }, function(err) {
      if (err) {
        displayUserError(err);
        $('#step-4').addClass('hidden');
        $('#step-1').removeClass('hidden');
        return false;
      }
      
      displaySuccess();
    });
  });
  
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

function validateEmail(email, callback) {
  var uri = "/api/users/exists/";
  var encoded = uri + encodeURIComponent(email)

  $.ajax({
    type: 'GET',
    url: encoded
  })
  .done(function(json) {
    return callback(true);
  })
  .fail(function(jqXHR) {
    return callback(false);
  });
}

function displayUserError(err) {
  // figure out what to display
  switch(err.name) {
    case 'MongoError': {
      if (err.code == 11000) {
        displayFormError('user-email-div', 'Email already taken');
        $('#step-1').removeClass('hidden');
        $('#step-3').addClass('hidden');
        break;
      }
    }
  }
}

function displayParentError(err) {

}

function displayVolunteerError(err) {
  console.log(err);
}

function displayFormError(div_id, error_text) {
  var id = '#' + div_id
  $(id).addClass('has-error');
  $(id + ' span').removeClass('error-icon-hidden');
  $(id + ' p').text(error_text);
}

function hideFormError(div_id) {
  var id = '#' + div_id;
  $(id).removeClass('has-error');
  $(id + ' span').addClass('error-icon-hidden');
  $(id + ' p').text('');
}

function displaySuccess() {
  $('#step-contents').addClass('hidden');
  $('#registration-success').removeClass('hidden');
}

function register(data, callback) {
  $.ajax({
    type: 'POST',
    url: '/register',
    data: data
  })
  .done(function(json) {
    return callback();
  })
  .fail(function(jqxhr) {
    return callback(jqxhr.responseJSON.error);
  });
}

function validateBasicInfo(first_name, last_name, phone) {

  // validate they aren't blank
  var flag = true;
  if (!first_name) {
    displayFormError('first-name-div', 'Please enter a first name');
    flag = false;
  } else {
    hideFormError('first-name-div');
  }
  if (!last_name) {
    displayFormError('last-name-div', 'Please enter a last name');
    flag = false;
  } else {
    hideFormError('last-name-div');
  }
  if (!phone) {
    displayFormError('phone-div', 'Please enter a phone number');
    flag = false;
  } else {
    hideFormError('phone-div');
  }
  return flag;
}

function validateVolunteerInfo(affiliation, gender, about_me) {
  var flag = true;
  if (!affiliation) {
    displayFormError('volunteer-affiliation-div', 'Please enter your college');
    flag = false;
  } else {
    hideFormError('volunteer-affiliation-div');
  }
  if (!gender) {
    displayFormError('volunteer-gender-div', 'Please choose your gender');
    flag = false;
  } else {
    hideFormError('volunteer-gender-div');
  }
  if (!about_me) {
    displayFormError('volunteer-about-me-div', 'Please enter something about yourself');
    flag = false;
  } else {
    hideFormError('volunteer-about-me-div');
  }
  return flag;
}
