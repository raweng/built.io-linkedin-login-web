var config = {
  application_uid:      'linkedinlogin',
  application_api_key:  'blte501d189aa8b29b8',
  master_key:           'bltf0fa8bf28369be39'
}

/*
  Initializing the SDK
*/
Built.initialize(config.application_api_key, config.application_uid);

/*
  Log in using linked in
*/
Built.Extension.define('login', function(req, res) {
  var accessToken = req.params.access_token
  // We need these to be present in the response
  var scopes = ':(first-name,last-name,email-address,formatted-name,summary,picture-url,public-profile-url,headline,location)'
  var profile

  Built.Extension.http.get({
    url: 'https://api.linkedin.com/v1/people/~'+scopes+'?format=json&oauth2_access_token='+accessToken
  })
  .success(function(httpResponse) {
    profile = JSON.parse(httpResponse.text);

    Built.setMasterKey(config.master_key);
    
    // query for existing users
    var query = new Built.Query('built_io_application_user')
    query.where('email', profile.emailAddress)

    Built.User.generateAuthtoken(
      query,
      // we want to create a new user if he doesn't already exist
      true,
      // create or update users with the following profile
      {
        email: profile.emailAddress,
        linkedin_profile: profile
      }
    )
    .then(function(response) {
      return res.success(response)
    }, function(response) {
      return res.error('error', response)
    })
  })
  .error(function(httpResponse) {
    // the accesstoken we receive is bogus, return an error
    return res.error('error', httpResponse.text)
  })

});

/*
  The linked in call for retreiving the access token
*/
Built.Extension.define('linkedin', function(req, res) {
  var data = {
    code: req.params.code,
    grant_type: req.params.grant_type,
    redirect_uri: req.params.redirect_uri,
    client_id: req.params.client_id,
    client_secret: req.params.client_secret
  }

  var dataUrl = Object.keys(data).map(function(k) {
    return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
  }).join('&');

  Built.Extension.http.post({
    url: req.params.url + '?' + dataUrl
  }).
  success(function(httpResponse) {
    return res.success(httpResponse.text);
  }).
  error(function(httpResponse) {
    return res.error('error', httpResponse.text);
  });
});