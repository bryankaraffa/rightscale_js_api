function RightScaleAPI() {

  // Public Variables
  this.configs = [];
  this.configs['api_version']   = '1.5';
  this.configs['api_endpoint']  = 'https://my.rightscale.com';

  // Private Variables
  var xmlhttp;
  var user_email;
  var user_pswd;
  var rs_acct;


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
  console.log('RightScale API Initialized.');


  // User Email
  function getUserEmail() {
    return user_email;
  }
  this.getUserEmail=getUserEmail;

  function setUserEmail(input) {
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
    rs_acct=input;
    return true;
  }
  this.setRsAccount=setRsAccount;

  // HTTP
  function send(method, url, params) {
    console.log ('Method: '+ method + ' | URL: '+ url + ' | Params:'+ params);
    xmlhttp.open(method,this.configs['api_endpoint']+url,false); // false == synchronous request (depreciated)
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //xmlhttp.setRequestHeader("Content-length", params.length);
    xmlhttp.setRequestHeader("X_API_VERSION", 1.5);
    xmlhttp.send(params);
    return(xmlhttp);
  }
  this.send=send;

  // Authenticate
  function authenticate() {
    account_href='/api/accounts/7954';
    params = new Array();
    params['account_href']=account_href;
    r=this.send('POST', '/api/sessions', 'account_href=/api/accounts/7954&email='+this.getUserEmail()+'&password='+this.getUserPswd());
    console.log(r); // Debugging
    if (r.status === 204) {
      console.log('[RS] Authentication successful!')
    }
  }
  this.authenticate=authenticate;


}
