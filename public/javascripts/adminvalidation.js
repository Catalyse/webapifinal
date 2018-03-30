//Trailer Modal Functions ----------------------------------------------------------------------------------------------
function ValidateTrailerForm() {
  var trailerform = document.getElementById('trailerform');
  var valid = true;
  var errorcontent = '';
  if(trailerform.elements['id'].value == '') {
    if(valid) {
      trailerform.className = "ui form error";
      valid = false;
      errorcontent = "<p>Trailer ID Cannot Be Empty!</p>"
      document.getElementById('traileridfield').className = "field error";
    }
    else {
      errorcontent += "<p>Trailer ID Cannot Be Empty!</p>"
      document.getElementById('traileridfield').className = "field error";
    }
  } else{
    document.getElementById('traileridfield').className = "field";
  } 

  if(!valid) {
    document.getElementById('trailerformerrormsg').innerHTML = errorcontent;
    $(".addtrailer").modal('refresh');
  }
  return valid;
}
//End Trailer Modal Functions ----------------------------------------------------------------------------------------------

//User Modal Functions ----------------------------------------------------------------------------------------------
function ValidateUserForm() {
  var userform = document.getElementById('userform');
  var valid = true;
  var errorcontent = '';

  if(userform.elements['fname'].value == '') {
    if(valid) {
      userform.className = "ui form error";
      valid = false;
      errorcontent = "<p>First Name Cannot Be Empty!</p>"
      document.getElementById('userfnamebox').className = "field error";
    }
    else {
      errorcontent += "<p>First Name Cannot Be Empty!</p>"
      document.getElementById('userfnamebox').className = "field error";
    }
  } else{
    document.getElementById('userfnamebox').className = "field";
  } 

  if(userform.elements['lname'].value == '') {
    if(valid) {
      userform.className = "ui form error";
      valid = false;
      errorcontent = "<p>Last Name Cannot Be Empty!</p>"
      document.getElementById('userlnamebox').className = "field error";
    }
    else {
      errorcontent += "<p>Last Name Cannot Be Empty!</p>"
      document.getElementById('userlnamebox').className = "field error";
    }
  } else{
    document.getElementById('userlnamebox').className = "field";
  } 

  if(userform.elements['username'].value == '') {
    if(valid) {
      userform.className = "ui form error";
      valid = false;
      errorcontent = "<p>Username Cannot Be Empty!</p>"
      document.getElementById('userunamebox').className = "field error";
    }
    else {
      errorcontent += "<p>Username Cannot Be Empty!</p>"
      document.getElementById('userunamebox').className = "field error";
    }
  } else{
    document.getElementById('userunamebox').className = "field";
  } 

  if(userform.elements['password'].value == '') {
    if(userform.elements['userEditMode'].value == 'false') {//if not false, then the password field can be blank
      if(valid) {
        userform.className = "ui form error";
        valid = false;
        errorcontent = "<p>Password Cannot Be Empty!</p>"
        document.getElementById('userpassbox').className = "field error";
      }
      else {
        errorcontent += "<p>Password Cannot Be Empty!</p>"
        document.getElementById('userpassbox').className = "field error";
      }
    }
  } else{
    document.getElementById('userpassbox').className = "field";
  } 

  if(userform.elements['passwordverify'].value == '') {
    if(userform.elements['userEditMode'].value == 'false') {//if not false, then the password field can be blank
      if(valid) {
        userform.className = "ui form error";
        valid = false;
        errorcontent = "<p>You must verify your password!</p>"
        document.getElementById('userpassvbox').className = "field error";
      }
      else {
        errorcontent += "<p>You must verify your password!</p>"
        document.getElementById('userpassvbox').className = "field error";
      }
    }
  } else{
    document.getElementById('userpassbox').className = "field";    
    document.getElementById('userpassvbox').className = "field";
  } 

  if(userform.elements['password'].value != '' && userform.elements['passwordverify'].value != '') {
    if(userform.elements['password'].value != userform.elements['passwordverify'].value) {
      if(valid) {
        userform.className = "ui form error";
        valid = false;
        errorcontent = "<p>Your passwords do not match!</p>";
        document.getElementById('userpassbox').className = "field error";
        document.getElementById('userpassvbox').className = "field error";        
      }
      else {
        errorcontent += "<p>Your passwords do not match!</p>";  
        document.getElementById('userpassbox').className = "field error";   
        document.getElementById('userpassvbox').className = "field error";    
      }
    }
  }

  if(userform.elements['email'].value == '') {
    if(valid) {
      userform.className = "ui form error";
      valid = false;
      errorcontent = "<p>Email Cannot Be Empty!</p>"
      document.getElementById('useremailbox').className = "field error";
    }
    else {
      errorcontent += "<p>Email Cannot Be Empty!</p>"
      document.getElementById('useremailbox').className = "field error";
    }
  } else{
    document.getElementById('useremailbox').className = "field";
  } 

  if(userform.elements['permid'].value == '') {
    if(valid) {
      userform.className = "ui form error";
      valid = false;
      errorcontent = "<p>Role Cannot Be Empty!</p>"
      document.getElementById('userrolebox').className = "field error";
    }
    else {
      errorcontent += "<p>Role Cannot Be Empty!</p>"
      document.getElementById('userrolebox').className = "field error";
    }
  } else{
    document.getElementById('userrolebox').className = "field";
  } 

  if(!valid) {
    document.getElementById('userformerrormsg').innerHTML = errorcontent;
    $(".adduser").modal('refresh');
  }
  return valid;
}
//End User Modal Functions ----------------------------------------------------------------------------------------------

//Driver Modal Functions ----------------------------------------------------------------------------------------------
function ValidateDriverForm(){
  var driverform = document.getElementById('driverform');
  var valid = true;
  var errorcontent = '';

  if(driverform.elements['fname'].value == '') {
    if(valid) {
      driverform.className = "ui form error";
      valid = false;
      errorcontent = "<p>First Name Cannot Be Empty!</p>"
      document.getElementById('drivfnamebox').className = "field error";
    }
    else {
      errorcontent += "<p>First Name Cannot Be Empty!</p>"
      document.getElementById('drivfnamebox').className = "field error";
    }
  } else{
    document.getElementById('drivfnamebox').className = "field";
  } 

  if(driverform.elements['lname'].value == '') {
    if(valid) {
      driverform.className = "ui form error";
      valid = false;
      errorcontent = "<p>Last Name Cannot Be Empty!</p>"
      document.getElementById('drivlnamebox').className = "field error";
    }
    else {
      errorcontent += "<p>Last Name Cannot Be Empty!</p>"
      document.getElementById('drivlnamebox').className = "field error";
    }
  } else{
    document.getElementById('drivlnamebox').className = "field";
  } 

  if(driverform.elements['phonenumber'].value == '') {
    if(valid) {
      driverform.className = "ui form error";
      valid = false;
      errorcontent = "<p>Phone Number Cannot Be Empty!</p>"
      document.getElementById('drivphonebox').className = "field error";
    }
    else {
      errorcontent += "<p>Phone Number Cannot Be Empty!</p>"
      document.getElementById('drivphonebox').className = "field error";
    }
  } else{
    document.getElementById('drivphonebox').className = "field";
  } 

  if(driverform.elements['licenseno'].value == '') {
    if(valid) {
      driverform.className = "ui form error";
      valid = false;
      errorcontent = "<p>License Number Cannot Be Empty!</p>"
      document.getElementById('drivlicensebox').className = "field error";
    }
    else {
      errorcontent += "<p>License Number Cannot Be Empty!</p>"
      document.getElementById('drivlicensebox').className = "field error";
    }
  } else{
    document.getElementById('drivlicensebox').className = "field";
  } 

  if(driverform.elements['driverpaypercent'].value == '') {
    if(valid) {
      driverform.className = "ui form error";
      valid = false;
      errorcontent = "<p>Paypercent Cannot Be Empty!</p>"
      document.getElementById('drivpercentbox').className = "field error";
    }
    else {
      errorcontent += "<p>Paypercent Cannot Be Empty!</p>"
      document.getElementById('drivpercentbox').className = "field error";
    }
  } else{
    document.getElementById('drivpercentbox').className = "field";
  } 

  if(driverform.elements['street'].value == '') {
    if(valid) {
      driverform.className = "ui form error";
      valid = false;
      errorcontent = "<p>Street Cannot Be Empty!</p>"
      document.getElementById('drivstreetbox').className = "field error";
    }
    else {
      errorcontent += "<p>Street Cannot Be Empty!</p>"
      document.getElementById('drivstreetbox').className = "field error";
    }
  } else{
    document.getElementById('drivstreetbox').className = "field";
  } 

  if(driverform.elements['city'].value == '') {
    if(valid) {
      driverform.className = "ui form error";
      valid = false;
      errorcontent = "<p>City Cannot Be Empty!</p>"
      document.getElementById('drivcitybox').className = "field error";
    }
    else {
      errorcontent += "<p>City Cannot Be Empty!</p>"
      document.getElementById('drivcitybox').className = "field error";
    }
  } else{
    document.getElementById('drivcitybox').className = "field";
  } 

  if(driverform.elements['state'].value == '') {
    if(valid) {
      driverform.className = "ui form error";
      valid = false;
      errorcontent = "<p>State Cannot Be Empty!</p>"
      document.getElementById('drivstatebox').className = "field error";
    }
    else {
      errorcontent += "<p>State Cannot Be Empty!</p>"
      document.getElementById('drivstatebox').className = "field error";
    }
  } else{
    document.getElementById('drivstatebox').className = "field";
  } 

  if(driverform.elements['zip'].value == '') {
    if(valid) {
      driverform.className = "ui form error";
      valid = false;
      errorcontent = "<p>Zip Cannot Be Empty!</p>"
      document.getElementById('drivzipbox').className = "field error";
    }
    else {
      errorcontent += "<p>Zip Cannot Be Empty!</p>"
      document.getElementById('drivzipbox').className = "field error";
    }
  } else{
    document.getElementById('drivzipbox').className = "field";
  }
  
  if(driverform.elements['zip'].value > 99999) {
    if(valid) {
      driverform.className = "ui form error";
      valid = false;
      errorcontent = "<p>Zip is Too Long</p>"
      document.getElementById('drivzipbox').className = "field error";
    }
    else {
      errorcontent += "<p>Zip is Too Long</p>"
      document.getElementById('drivzipbox').className = "field error";
    }
  } else{
    document.getElementById('drivzipbox').className = "field";
  }

  if(!valid) {
    document.getElementById('driverformerrormsg').innerHTML = errorcontent;
    $(".adddriver").modal('refresh');
  }
  return valid;
}
//End Driver Modal Functions ----------------------------------------------------------------------------------------------