function ProfileController($scope, $location, $rootScope) {

if($scope.user && $scope.user.uid){
  /*
    Create and execute Built Query 
    to get other app users
  */
  var query  = BuiltApp.Class('built_io_application_user').Query();
      query.exec()
        .then(function(users){
          console.log('users',users);
          $sa($scope, function() {
            $scope.users = users.map(function(u) {
              return u.toJSON();
            })
            .filter(function(u){
              if(u.uid !== $scope.user.uid){
                return true;
              }
            });
          });
        }, function(err){
          console.log('Some Error While Fetching Users',err);
        });
} else {
  $location.path('/');
}
}