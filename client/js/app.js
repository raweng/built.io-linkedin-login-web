function u(url) {return 'markup/' + url};

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
  // app name
  $rootScope.appName = 'LinkedIn Login';

  $rootScope.getName = function(profile) {
    return profile.linkedin_profile.formattedName;
  }

  $rootScope.makeUser = function(profile) {
    $rootScope.user = profile;
    $rootScope.user.name = $rootScope.getName(profile);
  }

  $rootScope.clearUser = function() {
    delete $rootScope.user;
  }

  $rootScope.logout = function() {
    Built.User.logout().
    onSuccess(function() {
      Built.User.clearSession();

      $sa($rootScope, function() {
        $rootScope.clearUser();
        $location.path('/');
      })
    }).
    onError(function() {
      console.log('error')
      Built.User.clearSession();
      
      $sa($rootScope, function() {
        $rootScope.clearUser();
        $location.path('/');
      })
    })
  }

  if (Built.User.getSession()) {
    $rootScope.makeUser(Built.User.getSession());
    Built.User.setCurrentUser(Built.User.getSession());
    $location.path('/profile');
  }
  
}]);

config = {
  host: 'api.built.io',
  protocol: 'https',
  application_api_key: 'blte501d189aa8b29b8',
  application_uid: 'linkedinlogin'
}

// initialize built
Built.setURL(config.host, config.protocol);
// Built.fallbackForCORS(true);
Built.initialize(config.application_api_key, config.application_uid);