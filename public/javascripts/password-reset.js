$(function() {

  $('form[name="password-reset"]').on('submit', function(event) {

    alert('not implemented');
    return false;
    var form = $(this);
    event.preventDefault();

    var data = form.serialize();

    $.ajax({
      type: 'POST',
      url: '/reset-password',
      data: data
    })
    .done(function() {

    })
    .fail(function(json) {
      form.trigger('reset');

      
    });

  });

});