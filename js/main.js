(function() {


  /**
   * Initialize major event handlers
   */
  function init() {
    // register event listeners
    document.querySelector('#login-form-btn').addEventListener('click', showLoginForm);
    document.querySelector('#login-btn').addEventListener('click', login);
    document.querySelector('#register-form-btn').addEventListener('click', showRegisterForm);
    document.querySelector('#login-link').addEventListener('click', showLoginForm);   
    document.querySelector('#logout-link').addEventListener('click', signOut);  
    document.querySelector('#register-btn').addEventListener('click', register);
    
    onSessionInvalid();
 
  }

  /**
   * Session
   */
 

  function onSessionValid() {


    var loginForm = document.querySelector('#login-form');
    var registerForm = document.querySelector('#register-form');
    var logoutBtn = document.querySelector('#logout-link');
    var loginBtn = document.querySelector('#login-link');
    var userProfile = document.querySelector('#user-profile');  
      
 
   
    showElement(userProfile);
    showElement(logoutBtn, 'inline-block');
    hideElement(loginForm);
    hideElement(registerForm);
    hideElement(loginBtn, 'inline-block'); 
            
      
  }
    
  
    

  function onSessionInvalid() {
    var loginForm = document.querySelector('#login-form');
    var registerForm = document.querySelector('#register-form');
    var logoutBtn = document.querySelector('#logout-link');
    var userProfile = document.querySelector('#user-profile');
    var loginBtn = document.querySelector('#login-link');  
  
    hideElement(userProfile);
    hideElement(logoutBtn);
    hideElement(registerForm);
    hideElement(loginForm);
    showElement(loginBtn, 'inline-block'); 
      
      
  }
    
  function showLoginForm() {
    var loginForm = document.querySelector('#login-form');
    var registerForm = document.querySelector('#register-form');
    var logoutBtn = document.querySelector('#logout-link');

  
    
    hideElement(logoutBtn);
    hideElement(registerForm);
    showElement(loginForm);
  }

  function hideElement(element) {
    element.style.display = 'none';
  }

  function showElement(element, style) {
    var displayStyle = style ? style : 'block';
    element.style.display = displayStyle;
  }
  
  function showRegisterForm() {
    var loginForm = document.querySelector('#login-form');
    var registerForm = document.querySelector('#register-form');
    var logoutBtn = document.querySelector('#logout-link');

 
   
    hideElement(logoutBtn);
    hideElement(loginForm);
    
    clearRegisterResult();
    showElement(registerForm);
  }  

    
  // -----------------------------------
  // Login
  // -----------------------------------

  function login() {
    var authenticationData = { 
        Username : document.getElementById("username").value,
        Password : document.getElementById("password").value,
 
    };
    
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    
	var poolData = {
        UserPoolId : _config.cognito.userPoolId, // Your user pool id here
        ClientId : _config.cognito.clientId, // Your client id here
    };
      
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
	
    var userData = {
        Username : document.getElementById("username").value,
        Pool : userPool,
    };  
      
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);  
      
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
			var accessToken = result.getAccessToken().getJwtToken();
			console.log(accessToken);
            onSessionValid();
            console.log(result);
            
        },
        onFailure: function(err) {
            alert(err.message || JSON.stringify(err));
        },
    });  

  }

  

  // -----------------------------------
  // Register
  // -----------------------------------

  function register() {
    var poolData;  
    var username = document.querySelector('#register-username').value;
    var password; 
    var fullName = document.querySelector('#register-full-name').value;
    var email = document.getElementById("register-email").value;  
    var creditCard = document.getElementById("register-credit-card").value; 
      
    if (document.getElementById("register-password").value != document.getElementById("confirm-password").value) {
			alert("Passwords Do Not Match!")
			throw "Passwords Do Not Match!"
    } else {
			password =  document.getElementById("register-password").value;	
    }
    
    poolData = {
				UserPoolId : _config.cognito.userPoolId, // Your user pool id here
				ClientId : _config.cognito.clientId // Your client id here
    };		
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var attributeList = [];

    var dataEmail = {
        Name : 'email', 
        Value : email, //get from form field
    };

    var dataPersonalName = {
        Name : 'name', 
        Value : fullName, //get from form field
    };
    
    var dataCreditCard = {
        Name : 'custom:credit-card', 
        Value : creditCard, //get from form field
    };
    
    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
    var attributePersonalName = new AmazonCognitoIdentity.CognitoUserAttribute(dataPersonalName);  
	var attributeCreditCard = new AmazonCognitoIdentity.CognitoUserAttribute(dataCreditCard);
      
    attributeList.push(attributeEmail);
	attributeList.push(attributePersonalName); 
    attributeList.push(attributeCreditCard); 
    
    userPool.signUp(username, password, attributeList, null, function(err, result){
			if (err) {
				alert(err.message || JSON.stringify(err));
				return;
			}
			cognitoUser = result.user;
			console.log('user name is ' + cognitoUser.getUsername());
			//change elements of page
			document.getElementById("register-result").innerHTML = "Check your email for a verification link";
			
		});  
  }



  function clearRegisterResult() {
    document.querySelector('#register-result').innerHTML = '';
  }

  function signOut(){
        var data = { 
		UserPoolId : _config.cognito.userPoolId,
        ClientId : _config.cognito.clientId
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
    var cognitoUser = userPool.getCurrentUser();
        
	    if (cognitoUser != null) {
          cognitoUser.signOut();
          onSessionInvalid(); 
        }
        
  }    



  init();

})();
