function ProfileController($scope, $location, $rootScope) {
  // get the other app users
  var query = new Built.Query('built_io_application_user');
  query
    .notContainedIn('uid', $scope.user.uid)
    .ascending('linkedin_profile.formattedName');

  query.exec()
  .then(function(users) {
    $sa($scope, function() {
      $scope.users = users.map(function(u) {return u.toJSON()});
    });
  });
}