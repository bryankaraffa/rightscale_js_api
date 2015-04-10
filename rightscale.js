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
  var resources = [];


  // Initialization
  //// XMLHttpRequest Object
  if (typeof window !== 'undefined') { // Check if being used in browser
    if (typeof window.XMLHttpRequest !== 'undefined') {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    } else if (typeof window.ActiveXObject !== 'undefined') {
        // code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
  }
  else {
    console.log('[RS] RightScale JS API is not being loaded in a browser.');
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
    xmlhttp.open(method,this.configs['api_endpoint']+url,true); // true == asynchronous (synchronous depreciated)
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
    if(this.readyState == 4 && this.status == 204) {
      console.log('[RS] Authentication successful!');
      isAuthenticated=true;
    }
    else {
      if (this.status >= 400) {
        console.log('[RS] Error authenticating! Response: '+this.status+' '+this.statusText+' '+this.responseText);
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
      resources['deployments'] = undefined;
      console.log('[RS] Getting Deployments');
      this.send('GET', '/api/deployments', undefined, handleDeploymentResponse);
      return true;
  }
  this.getDeployments=getDeployments;

  function handleDeploymentResponse() {
    if(this.readyState == 4 && this.status == 200) {
      console.log('[RS] Deployments received');
      resources['deployments'] = JSON.parse(this.response);
      return true;
    }
    else if (this.readyState == 4) {
      console.log('[RS] ERROR: Deployments not received');
    }
  }

  function showDeployments() {
    if (typeof resources['deployments'] !== undefined) {
      return resources['deployments'];
    }
  }
  this.showDeployments=showDeployments;
}

if (typeof window === 'undefined') { // Check if being used in browser
  module.exports={ RightScaleAPI:new RightScaleAPI() }
}
