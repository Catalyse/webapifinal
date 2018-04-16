//User Modal Functions ----------------------------------------------------------------------------------------------
function ValidateUserForm() {
  var userform = document.getElementById('userform');
  var valid = true;
  var errorcontent = '';

  if(userform.elements['name'].value == '') {
    if(valid) {
      userform.className = "ui form error";
      valid = false;
      errorcontent = "<p>Name Cannot Be Empty!</p>"
      document.getElementById('namefield').className = "field error";
    }
    else {
      errorcontent += "<p>Name Cannot Be Empty!</p>"
      document.getElementById('namefield').className = "field error";
    }
  } else{
    document.getElementById('namefield').className = "field";
  } 

  if(userform.elements['username'].value == '') {
    if(valid) {
      userform.className = "ui form error";
      valid = false;
      errorcontent = "<p>Username Cannot Be Empty!</p>"
      document.getElementById('usernamefield').className = "field error";
    }
    else {
      errorcontent += "<p>Username Cannot Be Empty!</p>"
      document.getElementById('usernamefield').className = "field error";
    }
  } else{
    document.getElementById('usernamefield').className = "field";
  } 

  if(userform.elements['password'].value == '') {
    if(!userEditMode) {//if not false, then the password field can be blank
      if(valid) {
        userform.className = "ui form error";
        valid = false;
        errorcontent = "<p>Password Cannot Be Empty!</p>"
        document.getElementById('passwordfield').className = "field error";
      }
      else {
        errorcontent += "<p>Password Cannot Be Empty!</p>"
        document.getElementById('passwordfield').className = "field error";
      }
    }
  } else{
    document.getElementById('passwordfield').className = "field";
  } 

  if(userform.elements['verifypassword'].value == '') {
    if(!userEditMode) {//if not false, then the password field can be blank
      if(valid) {
        userform.className = "ui form error";
        valid = false;
        errorcontent = "<p>You must verify your password!</p>"
        document.getElementById('verifyfield').className = "field error";
      }
      else {
        errorcontent += "<p>You must verify your password!</p>"
        document.getElementById('verifyfield').className = "field error";
      }
    }
  } else{
    document.getElementById('passwordfield').className = "field";    
    document.getElementById('verifyfield').className = "field";
  } 

  if(userform.elements['password'].value != '' && userform.elements['verifypassword'].value != '') {
    if(userform.elements['password'].value != userform.elements['verifypassword'].value) {
      if(valid) {
        userform.className = "ui form error";
        valid = false;
        errorcontent = "<p>Your passwords do not match!</p>";
        document.getElementById('passwordfield').className = "field error";
        document.getElementById('verifyfield').className = "field error";        
      }
      else {
        errorcontent += "<p>Your passwords do not match!</p>";  
        document.getElementById('passwordfield').className = "field error";   
        document.getElementById('verifyfield').className = "field error";    
      }
    }
  }
  
  if(!valid) {
    document.getElementById('userformerrormsg').innerHTML = errorcontent;
    $(".adduser").modal('refresh');
  }
  return valid;
}
//End User Modal Functions ----------------------------------------------------------------------------------------------

//Category Modal Functions ----------------------------------------------------------------------------------------------
function ValidateCategoryForm() {
  var categoryform = document.getElementById('categoryform');
  var valid = true;
  var errorcontent = '';

  if(categoryform.elements['categoryname'].value == '') {
    valid = false;
    errorcontent = "<p>Name Cannot Be Empty!</p>"
    document.getElementById('categorynamefield').classList.add("error");
  } 
  else {
    document.getElementById('categorynamefield').classList.remove("error")
  } 

  if(categoryform.elements['categorydescription'].value == '') {
    valid = false;
    errorcontent += "<p>Description Cannot Be Empty!</p>"
    document.getElementById('categorydescriptionfield').classList.add("error");
  } 
  else {
    document.getElementById('categorydescriptionfield').classList.remove("error")
  } 
  
  if(!valid) {
    categoryform.classList.add("error");
    document.getElementById('categoryformerrormsg').innerHTML = errorcontent;
    $(".addcategory").modal('refresh');
  }
  else {
    categoryform.classList.remove("error");
  }
  return valid;
}
//End Category Modal Functions -----------------------------------------------------------------------------------------

//Product Modal Functions ----------------------------------------------------------------------------------------------
function ValidateProductForm() {
  var productform = document.getElementById('productform');
  var valid = true;
  var errorcontent = '';

  if(productform.elements['productname'].value == '') {
    valid = false;
    errorcontent = "<p>Name Cannot Be Empty!</p>"
    document.getElementById('productnamefield').classList.add("error");
  } 
  else {
    document.getElementById('productnamefield').classList.remove("error")
  } 

  if(productform.elements['productdescription'].value == '') {
    valid = false;
    errorcontent += "<p>Description Cannot Be Empty!</p>"
    document.getElementById('productdescriptionfield').classList.add("error");
  } 
  else {
    document.getElementById('productdescriptionfield').classList.remove("error")
  } 

  if(productform.elements['productquantity'].value == '') {
    valid = false;
    errorcontent += "<p>Quantity Cannot Be Empty!</p>"
    document.getElementById('productquantityfield').classList.add("error");
  } 
  else {
    if(parseFloat(productform.elements['productquantity'].value) < 0) {
      valid = false;
      errorcontent += "<p>Quantity Cannot Be Less Than Zero!</p>"
      document.getElementById('productquantityfield').classList.add("error");
    } 
    else {
      document.getElementById('productquantityfield').classList.remove("error")
    }
  } 

  if(productform.elements['productcost'].value == '') {
    valid = false;
    errorcontent += "<p>Cost Cannot Be Empty!</p>"
    document.getElementById('productcostfield').classList.add("error");
  } 
  else {
      if(parseFloat(productform.elements['productcost'].value) < 0) {
        valid = false;
        errorcontent += "<p>Cost Cannot Be Less Than Zero!</p>"
        document.getElementById('productcostfield').classList.add("error");
      } 
      else {
        document.getElementById('productcostfield').classList.remove("error")
      } 
  }

  if(productform.elements['productcategory'].value == '') {
    valid = false;
    errorcontent += "<p>You Must Select A Category!</p>"
    document.getElementById('productcategoryfield').classList.add("error");
  } 
  else {
    document.getElementById('productcategoryfield').classList.remove("error")
  } 
  
  if(!valid) {
    productform.classList.add("error");
    document.getElementById('productformerrormsg').innerHTML = errorcontent;
    $(".addproduct").modal('refresh');
  }
  else {
    productform.classList.remove("error");
  }
  return valid;
}
//End Product Modal Functions ----------------------------------------------------------------------------------------------

//Charity Modal Functions ----------------------------------------------------------------------------------------------
function ValidateCharityForm() {
  var charityform = document.getElementById('charityform');
  var valid = true;
  var errorcontent = '';

  if(charityform.elements['charityname'].value == '') {
    valid = false;
    errorcontent = "<p>Name Cannot Be Empty!</p>"
    document.getElementById('charitynamefield').classList.add("error");
  } 
  else {
    document.getElementById('charitynamefield').classList.remove("error")
  } 

  if(charityform.elements['charitydescription'].value == '') {
    valid = false;
    errorcontent += "<p>Description Cannot Be Empty!</p>"
    document.getElementById('charitydescriptionfield').classList.add("error");
  } 
  else {
    document.getElementById('charitydescriptionfield').classList.remove("error")
  } 
  
  if(!valid) {
    charityform.classList.add("error");
    document.getElementById('charityformerrormsg').innerHTML = errorcontent;
    $(".addcharity").modal('refresh');
  }
  else {
    charityform.classList.remove("error");
  }
  return valid;
}
//End charity Modal Functions -----------------------------------------------------------------------------------------