function LinkedInLoginCtrl($scope, $location, $rootScope) {
  
  // search for linkedin params
  $scope.message = 'Logging in...';
  if ($location.search().access_token) {
    // Login to linked in by making an extension function call
    BuiltApp.Extension.execute('login', {access_token: $location.search().access_token})
      .then(function(profile){
        $sa($scope, function(){
          $rootScope.makeUser(profile);
          BuiltUser = BuiltUser.setSession(profile);
          $location.search('');
          $location.path('/profile');
        })
      }, function(err){
        $scope.message = 'Signing in using LinkedIn failed. Please try again.';
      })

  } else {
    $scope.message = 'Invalid login. Try logging in properly.';
  }
}