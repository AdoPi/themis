(function($){
  $(window).load(function(){
    initConnectionSettings();
  });
  function initConnectionSettings() {
    // Show login form
    $('.login').html(tmpl('loginForm', {
      "email" : i18n.index.loginForm.email,
      "lb" : i18n.index.loginForm.lb,
      "button" : i18n.index.loginForm.button
    })).show();
    // Load settings
  //  loadFirebaseSettings(cs);
      init();
  }
  // Init login
  function init() {
    try {
      initLoginForm();
    }
    catch(err) {
      console.log(err);
    }
  }
  function initLoginForm() {
//    var auth = firebase.auth(),
 //       database = firebase.database();
    // Login
    $('.login form').on('submit', function() {
      // Grab values
      var email = $('input[name="email"]').val(),
        lbname = $('input[name="lb"]').val();
        $.ajax('/connect/'+lbname+'/'+email).done(function(data){
            window.location = "/leaderboard/"+data.id;
        })

      return false;
    });
  }
  function loadFirebaseSettings(cs) {
    if (typeof firebase !== 'undefined') {
      var config = {
        apiKey: cs.apiKey,
        authDomain: cs.authDomain,
        databaseURL: cs.databaseURL
      };
      firebase.initializeApp(config);
    }
  }
})(jQuery);
