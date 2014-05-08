function LinkedInLoginCtrl($scope, $location, $rootScope) {
  // search for linkedin params
  $scope.message = 'Logging in...';
  if ($location.search().access_token) {
    // Login to linked in by making an extension function call
    Built.Extension.execute('login', {access_token: $location.search().access_token}, {
      onSuccess: function(profile) {
        profile = JSON.parse(profile)

        $sa($scope, function() {
          $rootScope.makeUser(profile.result);
          Built.User.setCurrentUser(profile.result);
          Built.User.saveSession();

          $location.search('');
          $location.path('/profile');
        })  
      },
      onError: function() {
        $scope.message = 'Signing in using LinkedIn failed. Please try again.';
      }
    })
  } else {
    $scope.message = 'Invalid login. Try logging in properly.';
  }
}