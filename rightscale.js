function RightScaleAPI() {

  // Public Variables
  this.configs = [];
  this.configs['api_version']   = '1.5';
  this.configs['api_endpoint']  = 'https://my.rightscale.com';
  this.deployments = '';

  // Private Variables
  var xmlhttp;
  var user_email;
  var user_pswd;
  var rs_acct;
  var isAuthenticated = false;
  var lastResponse;


  // Initialization
  //// XMLHttpRequest Object
  if (window.XMLHttpRequest) {
      // code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp=new XMLHttpRequest();
  } else {
      // code for IE6, IE5
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  //// Username and password
  console.log('[RS] RightScale JavaScript API Initialized');


  // User Email
  function getUserEmail() {
    return user_email;
  }
  this.getUserEmail=getUserEmail;

  function setUserEmail(input) {
    isAuthenticated=false;
    user_email=input;
    return true;
  }
  this.setUserEmail=setUserEmail;


  // User Password
  function getUserPswd() {
    return user_pswd;
  }
  this.getUserPswd=getUserPswd;

  function setUserPswd(input) {
    isAuthenticated=false;
    user_pswd=input;
    return true;
  }
  this.setUserPswd=setUserPswd;

  // RightScale Account
  function getRsAccount() {
    return rs_acct;
  }
  this.getRsAccount=getRsAccount;

  function setRsAccount(input) {
    isAuthenticated=false;
    rs_acct=input;
    return true;
  }
  this.setRsAccount=setRsAccount;

  // HTTP
  function send(method, url, params, callback) {
    lastResponse = undefined;
    //console.log ('Method: '+ method + ' | URL: '+ url + ' | Params:'+ params);
    xmlhttp.open(method,this.configs['api_endpoint']+url,false); // true == asynchronous (synchronous depreciated)
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.setRequestHeader("X_API_VERSION", this.configs['api_version']);
    if (typeof callback === 'function') {
      xmlhttp.onreadystatechange=callback;
    }
    xmlhttp.send(params);
    return true;
  }
  this.send=send;

  function handleSendResponse(callback) {
    if(xmlhttp.readyState == 4) {
      lastResponse = xmlhttp;
      return true;
    }
    else {
      return false;
    }
  }
  this.handleSendResponse=handleSendResponse;

  // Authenticate
  function authenticate() {
    isAuthenticated=false;
    params='account_href=/api/accounts/'+this.getRsAccount()+'&email='+this.getUserEmail()+'&password='+this.getUserPswd();
    this.send('POST', '/api/sessions', params, handleAuthResponse);
  }
  this.authenticate=authenticate;
  this.doAuth=authenticate;

  function handleAuthResponse() {
    if(xmlhttp.readyState == 4 && xmlhttp.status == 204) {
      console.log('[RS] Authentication successful!');
      isAuthenticated=true;
    }
    else {
      if (xmlhttp.status >= 400) {
        console.log('[RS] Error authenticating! Response: '+xmlhttp.status+' '+xmlhttp.statusText+' '+xmlhttp.responseText);
        isAuthenticated=false;
      }
    }
  }

  function getAuthStatus() {
    return isAuthenticated;
  }
  this.getAuthStatus=getAuthStatus;

  // Deployments
  function getDeployments() {
      console.log('[RS] Getting Deployments');
      if (this.send('GET', '/api/deployments', undefined, handleDeploymentResponse)) {
        console.log(xmlhttp.responseText);
      }
  }
  this.getDeployments=getDeployments;

  function handleDeploymentResponse() {
    if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      console.log('[RS] Deployments received');
      return true;
    }
  }


}
var pub;
