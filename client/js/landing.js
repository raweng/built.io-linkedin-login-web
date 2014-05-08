var LandingCtrl = [
  '$scope', '$cookies', '$location', '$window', 
  function($scope, $cookies, $location, $window) {
    if ($scope.user) {
      return $location.path('/profile');
    }

    function url() {
      if ($location.port() && ($location.port() !== 80))
        return [$location.host(), $location.port()].join(':')
      else
        return $location.host()
    }

    $scope.loginLinkedIn = function() {
      // redirect to linkedin
      var e = function(u) {return encodeURIComponent(u);}
      var base = 'https://www.linkedin.com/uas/oauth2/authorization';
      var response_type = e('code');
      var client_id = e('75vurd5br8m7v9');
      var redirect_uri = e('http://' + url() + '/oauth_callback.html');
      var scope = e('r_basicprofile r_emailaddress');
      var state = e(Math.ceil(Math.random()*10000).toString());

      base = base +
        '?response_type=' + response_type +
        '&client_id=' + client_id +
        '&redirect_uri=' + redirect_uri +
        '&scope=' + scope +
        '&state=' + state

      $window.location.href = value = base;
    }
  }
];