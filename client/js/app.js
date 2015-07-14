function u(url) {return 'markup/' + url};

// Safe apply
function $sa(scope, fn) {
    (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
}

angular.module('app', ['ngRoute', 'ngCookies'])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.
  when('/', {
    controller: LandingCtrl,
    templateUrl: u('landing.html')
  }).
  when('/linkedin_login', {
    controller: LinkedInLoginCtrl,
    templateUrl: u('login_linkedin.html')
  }).
  when('/profile', {
    controller: ProfileController,
    templateUrl: u('profile.html')
  }).
  otherwise({redirectTo:'/'});
}])
.run(['$rootScope', '$location', function($rootScope, $location) {
  // App Name
  $rootScope.appName = 'LinkedIn Login';

  $rootScope.getName = function(profile) {
    if(profile && profile.get){
      return profile.get('linkedin_profile').formattedName;
    }
  }

  $rootScope.makeUser = function(profile) {
    $rootScope.user = profile;
    $rootScope.user.name = $rootScope.getName(profile);
  }

  $rootScope.clearUser = function() {
    delete $rootScope.user;
  }

  $rootScope.logout = function() {
    BuiltApp.User.getCurrentUser()
      .then(function(user){
        return user.logout()
      })
      .then(function(res){
        BuiltUser.clearSession();
        $sa($rootScope, function() {
          $rootScope.clearUser();
          $location.path('/');
        });
      }, function(err){
        console.log('Error', err);
        BuiltUser.clearSession();
        $sa($rootScope, function() {
          $rootScope.clearUser();
          $location.path('/');
        })
      });
  }

  /*
    Get User and redirect to `/profile` route
  */
  BuiltApp.User.getCurrentUser()
    .then(function(data){
      console.log('data',data.toJSON());
      $sa($rootScope, function(){
        $rootScope.makeUser(data.toJSON());
        $location.path('/profile');
      });
    }, function(error){
      console.log('Please Login.')
    });
}])

/*
  App Config
*/
config = {
  host: 'api.built.io',
  protocol: 'https',
  application_api_key: 'blte501d189aa8b29b8'
}

/*
 Initialize BuiltApp
*/
var BuiltApp  = Built.App(config.application_api_key);
var BuiltUser = BuiltApp.User;