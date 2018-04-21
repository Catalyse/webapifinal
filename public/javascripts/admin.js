//Init
$(function() {
  ReloadCategoryList();
  ReloadCharityList();
  ReloadProductList();
});

//User Modal Functions ----------------------------------------------------------------------------------------------
var userEditMode = false;
$(function(){
  $("#adduser").click(function(){
    $(".adduser").modal('show').modal('refresh');
    document.getElementById("usermodalheader").innerHTML = "Add User";
    document.getElementById('deleteuserbutton').classList.add('disabled');
    userEditMode = false;
    document.getElementById('userform').reset();
    document.getElementById('userform').className = "ui form";
  });
  $(".adduser").modal({
    closable: true
  });
});

function CloseUserModal() {
  $(".adduser").modal('hide');
}

function EditUser(uid) {
  $(".adduser").modal({closable: true}).modal('show').modal('refresh');
  document.getElementById('deleteuserbutton').classList.remove('disabled');
  document.getElementById("usermodalheader").innerHTML = "Edit User";
  document.getElementById("userIDField").value = uid;
  userEditMode = true;
  var userform = document.getElementById('userform');
  userform.className = "ui loading form";

  var postdata = "uid=" + uid;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      if(this.responseText.indexOf("$$REDIRECT$$") !== -1) {
        LogoutRedirect();
      }
      else if(this.responseText == "-1") {
        userform.className = "ui form error";
        document.getElementById("userformerrormsg").innerHTML = this.responseText;
      }
      else {
        userform.className = "ui form";
        var user = JSON.parse(this.responseText);
        userform.elements["name"].value = user[0].name;
        userform.elements["username"].value = user[0].username;
        document.getElementById('deleteuserbutton').onclick = function() {
          DeleteUser(uid);
        }
      }
    }
  }
  xhttp.open("POST", "/r/user/", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(postdata);
  return false;
}

function DeleteUser(uid){
  $(".adduser").modal('hide');
  $(".warningprompt").modal({closable: true}).modal('show').modal('refresh');
  document.getElementById('warningheader').innerHTML = "Warning: Deleting User!";
  document.getElementById('warningprompttext').innerHTML = "Are you sure you want to delete this user?  This action is irreversable."
  document.getElementById('warningbuttoncancel').onclick = function() {
    $(".warningprompt").modal('hide');
    $(".adduser").modal({closable: true}).modal('show').modal('refresh');
  }
  document.getElementById('warningbuttonsubmit').onclick = function() {
    document.getElementById('warningbuttonsubmit').className = "ui loading negative right labeled icon button";
    var postdata = "id=" + uid;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200) {
        if(this.responseText.indexOf("$$REDIRECT$$") !== -1) {
          LogoutRedirect();
        }
        else if(this.responseText == "1") {
          document.getElementById('warningbuttonsubmit').className = "ui negative right labeled icon button";
          $(".warningprompt").modal('hide');
          $(".adduser").modal('hide');
          $(".successprompt").modal('show');
          ReloadUserList();
          document.getElementById('successprompttext').innerHTML = "User Successfully Deleted!";
          setTimeout(function() {
            $(".successprompt").modal('hide');                
          }, 1000);
        }
        else {
          $(".warningprompt").modal('hide');          
          document.getElementById('warningbuttonsubmit').className = "ui negative right labeled icon button";
          document.getElementById('warningbuttonsubmit').innerHTML = "Okay";
          document.getElementById('warningheader').innerHTML = "Error!";
          document.getElementById('warningprompttext').innerHTML = this.responseText; 
          $(".warningprompt").modal('show');          
          document.getElementById('warningbuttonsubmit').onclick = function() {
            document.getElementById('warningbuttonsubmit').innerHTML = "Delete<i class=\"cancel icon\"></i>";
            $(".warningprompt").modal('hide');
            $(".adduser").modal({closable: true}).modal('show').modal('refresh');
          }
        }
      }
      if(this.readyState == 4 && this.status != 200) {
        $(".successprompt").modal('show');
        document.getElementById('successpromptheader').innerHTML = "Error!";
        document.getElementById('successpromptmessagebody').className = "ui error message";
        document.getElementById('successprompttext').innerHTML = "Server Error! Please Try Again";
        setTimeout(function() {
          document.getElementById('successpromptheader').innerHTML = "Success";
          document.getElementById('successpromptmessagebody').className = "ui success message";
          $(".successprompt").modal('hide');                
        }, 2000);
      }
    }
    xhttp.open("POST", "/r/user/delete", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(postdata);
    return false;
  }
  return false;
}

$(function(){
  $("#usersubmit").click(function() {
    var userform = document.getElementById('userform');
    if(ValidateUserForm()){
      userform.className = "ui loading form";
      if(!userEditMode) {
        var postdata = "name=" + userform.elements["name"].value + "&username=" + userform.elements["username"].value + "&password=" + userform.elements["password"].value;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if(this.readyState == 4 && this.status == 200) {
            if(this.responseText.indexOf("$$REDIRECT$$") !== -1) {
              LogoutRedirect();
            }
            if(this.responseText.indexOf("$$UNAUTH$$") !== -1){
              $(".unauthprompt").modal('show').modal('refresh');
            }
            else if(this.responseText == "1") {
              userform.className = "ui form";
              userform.reset();
                $(".successprompt").modal('show');
                ReloadUserList();
                document.getElementById('successprompttext').innerHTML = "User Successfully Added!";
                setTimeout(function() {
                  $(".successprompt").modal('hide');                
                }, 2000);
            }
            else {
              userform.className = "ui form error";
              document.getElementById("userformerrormsg").innerHTML = this.responseText;
            }
          }
        }
        xhttp.open("POST", "/r/user/add", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(postdata);
        return false;
      }
      else {
        if(userform.elements["password"].value == '') {
          var postdata = "uid=" + document.getElementById("userIDField").value + "&editpassword=false&name=" + userform.elements["name"].value + "&username=" + userform.elements["username"].value;
        }
        else {
          var postdata = "uid=" + document.getElementById("userIDField").value + "&editpassword=true&name=" + userform.elements["name"].value + "&username=" + userform.elements["username"].value + "&password=" + userform.elements["password"].value;
        }
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if(this.readyState == 4 && this.status == 200) {
            if(this.responseText.indexOf("$$REDIRECT$$") !== -1) {
              LogoutRedirect();
            }
            if(this.responseText.indexOf("$$UNAUTH$$") !== -1){
              $(".unauthprompt").modal('show').modal('refresh');
            }
            else if(this.responseText == "1") {
              userform.className = "ui form";
              userform.reset();
              $(".adduser").modal('hide');
              $(".successprompt").modal('show');
              ReloadUserList();
              document.getElementById('successprompttext').innerHTML = "User Successfully Edited!";
              setTimeout(function() {
                $(".successprompt").modal('hide');                
              }, 1000);
            }
            else {
              userform.className = "ui form error";
              document.getElementById("userformerrormsg").innerHTML = this.responseText;
            }
          }
        }
        xhttp.open("POST", "/r/user/edit", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(postdata);
        return false;
      }
    }
    else {
      return false;
    }
  });
});
//End User Modal Functions ----------------------------------------------------------------------------------------------

//Category Modal Functions ----------------------------------------------------------------------------------------------
var categoryEditMode = false;
$(function(){
  $("#addcategory").click(function(){
    $(".addcategory").modal('show').modal('refresh');
    document.getElementById("categorymodalheader").innerHTML = "Add Category";
    document.getElementById('deletecategorybutton').classList.add('disabled');
    categoryEditMode = false;
    document.getElementById('categoryform').reset();
    document.getElementById('categoryform').className = "ui form";
  });
  $(".addcategory").modal({
    closable: true
  });
});

function CloseCategoryModal() {
  $(".addcategory").modal('hide');
}

function EditCategory(id) {
  $(".addcategory").modal({closable: true}).modal('show').modal('refresh');
  document.getElementById('deletecategorybutton').classList.remove('disabled');
  document.getElementById("categorymodalheader").innerHTML = "Edit Category";
  document.getElementById("categoryIDField").value = id;
  categoryEditMode = true;
  var categoryform = document.getElementById('categoryform');
  categoryform.className = "ui loading form";

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      if(this.responseText.indexOf("$$REDIRECT$$") !== -1) {
        LogoutRedirect();
      }
      else if(this.responseText == "-1") {
        categoryform.className = "ui form error";
        document.getElementById("categoryformerrormsg").innerHTML = this.responseText;
      }
      else {
        categoryform.className = "ui form";
        var category = JSON.parse(this.responseText);
        categoryform.elements["categoryname"].value = category.name;
        categoryform.elements["categorydescription"].value = category.description;
        document.getElementById('deletecategorybutton').onclick = function() {
          Deletecategory(uid);
        }
      }
    }
  }
  xhttp.open("GET", "/r/category/" + id, true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
  return false;
}

function DeleteCategory(id){
  $(".addcategory").modal('hide');
  $(".warningprompt").modal({closable: true}).modal('show').modal('refresh');
  document.getElementById('warningheader').innerHTML = "Warning: Deleting Category!";
  document.getElementById('warningprompttext').innerHTML = "Are you sure you want to delete this category?  This action is irreversable."
  document.getElementById('warningbuttoncancel').onclick = function() {
    $(".warningprompt").modal('hide');
    $(".addcategory").modal({closable: true}).modal('show').modal('refresh');
  }
  document.getElementById('warningbuttonsubmit').onclick = function() {
    document.getElementById('warningbuttonsubmit').className = "ui loading negative right labeled icon button";
    var postdata = "id=" + id;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200) {
        if(this.responseText.indexOf("$$REDIRECT$$") !== -1) {
          LogoutRedirect();
        }
        else if(this.responseText == "1") {
          document.getElementById('warningbuttonsubmit').className = "ui negative right labeled icon button";
          $(".warningprompt").modal('hide');
          $(".addcategory").modal('hide');
          $(".successprompt").modal('show');
          ReloadCategoryList();
          document.getElementById('successprompttext').innerHTML = "Category Successfully Deleted!";
          setTimeout(function() {
            $(".successprompt").modal('hide');                
          }, 1000);
        }
        else {
          $(".warningprompt").modal('hide');          
          document.getElementById('warningbuttonsubmit').className = "ui negative right labeled icon button";
          document.getElementById('warningbuttonsubmit').innerHTML = "Okay";
          document.getElementById('warningheader').innerHTML = "Error!";
          document.getElementById('warningprompttext').innerHTML = this.responseText; 
          $(".warningprompt").modal('show');          
          document.getElementById('warningbuttonsubmit').onclick = function() {
            document.getElementById('warningbuttonsubmit').innerHTML = "Delete<i class=\"cancel icon\"></i>";
            $(".warningprompt").modal('hide');
            $(".addcategory").modal({closable: true}).modal('show').modal('refresh');
          }
        }
      }
      if(this.readyState == 4 && this.status != 200) {
        $(".successprompt").modal('show');
        document.getElementById('successpromptheader').innerHTML = "Error!";
        document.getElementById('successpromptmessagebody').className = "ui error message";
        document.getElementById('successprompttext').innerHTML = "Server Error! Please Try Again";
        setTimeout(function() {
          document.getElementById('successpromptheader').innerHTML = "Success";
          document.getElementById('successpromptmessagebody').className = "ui success message";
          $(".successprompt").modal('hide');                
        }, 2000);
      }
    }
    xhttp.open("DELETE", "/r/category/delete", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(postdata);
    return false;
  }
  return false;
}

$(function(){
  $("#categorysubmit").click(function() {
    var categoryform = document.getElementById('categoryform');
    if(ValidateCategoryForm()){
      categoryform.className = "ui loading form";
      if(!categoryEditMode) {
        var postdata = "name=" + categoryform.elements["categoryname"].value + "&description=" + categoryform.elements["categorydescription"].value;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if(this.readyState == 4 && this.status == 200) {
            if(this.responseText.indexOf("$$REDIRECT$$") !== -1) {
              LogoutRedirect();
            }
            if(this.responseText.indexOf("$$UNAUTH$$") !== -1){
              $(".unauthprompt").modal('show').modal('refresh');
            }
            else if(this.responseText == "1") {
              categoryform.className = "ui form";
              categoryform.reset();
                $(".successprompt").modal('show');
                ReloadCategoryList();
                document.getElementById('successprompttext').innerHTML = "Category Successfully Added!";
                setTimeout(function() {
                  $(".successprompt").modal('hide');                
                }, 2000);
            }
            else {
              categoryform.className = "ui form error";
              document.getElementById("categoryformerrormsg").innerHTML = this.responseText;
            }
          }
        }
        xhttp.open("POST", "/r/category/add", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(postdata);
        return false;
      }
      else {
        var postdata = "id=" + document.getElementById("categoryIDField").value + "&categoryname=" + categoryform.elements["categoryname"].value + "&description=" + categoryform.elements["categorydescription"].value;        
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if(this.readyState == 4 && this.status == 200) {
            if(this.responseText.indexOf("$$REDIRECT$$") !== -1) {
              LogoutRedirect();
            }
            if(this.responseText.indexOf("$$UNAUTH$$") !== -1){
              $(".unauthprompt").modal('show').modal('refresh');
            }
            else if(this.responseText == "1") {
              categoryform.className = "ui form";
              categoryform.reset();
              $(".addcategory").modal('hide');
              $(".successprompt").modal('show');
              ReloadcategoryList();
              document.getElementById('successprompttext').innerHTML = "Category Successfully Edited!";
              setTimeout(function() {
                $(".successprompt").modal('hide');                
              }, 1000);
            }
            else {
              categoryform.className = "ui form error";
              document.getElementById("categoryformerrormsg").innerHTML = this.responseText;
            }
          }
        }
        xhttp.open("POST", "/r/category/edit", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(postdata);
        return false;
      }
    }
    else {
      return false;
    }
  });
});
//End Category Modal Functions ----------------------------------------------------------------------------------------------

//Product Modal Functions ----------------------------------------------------------------------------------------------
var productEditMode = false;
$(function(){
  $("#addproduct").click(function(){
    $(".addproduct").modal('show').modal('refresh');
    document.getElementById("productmodalheader").innerHTML = "Add Product";
    document.getElementById('deleteproductbutton').classList.add('disabled');
    productEditMode = false;
    document.getElementById('productform').reset();
    document.getElementById('productform').className = "ui form";
  });
  $(".addproduct").modal({
    closable: true
  });
});

function CloseProductModal() {
  $(".addproduct").modal('hide');
}

function EditProduct(id) {
  $(".addproduct").modal({closable: true}).modal('show').modal('refresh');
  document.getElementById('deleteproductbutton').classList.remove('disabled');
  document.getElementById("productmodalheader").innerHTML = "Edit Product";
  document.getElementById("productIDField").value = id;
  productEditMode = true;
  var productform = document.getElementById('productform');
  productform.className = "ui loading form";

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      if(this.responseText.indexOf("$$REDIRECT$$") !== -1) {
        LogoutRedirect();
      }
      else if(this.responseText == "-1") {
        productform.className = "ui form error";
        document.getElementById("productformerrormsg").innerHTML = this.responseText;
      }
      else {
        productform.className = "ui form";
        var product = JSON.parse(this.responseText);
        productform.elements["productname"].value = product.name;
        productform.elements["productdescription"].value = product.description;
        productform.elements["productcost"].value = product.cost;
        productform.elements["productquantity"].value = product.quantity;
        productform.elements["productcategory"].value = product.category;
        document.getElementById('deleteproductbutton').onclick = function() {
          DeleteProduct(id);
        }
      }
    }
  }
  xhttp.open("GET", "/r/product/" + id, true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
  return false;
}

function DeleteProduct(id){
  $(".addproduct").modal('hide');
  $(".warningprompt").modal({closable: true}).modal('show').modal('refresh');
  document.getElementById('warningheader').innerHTML = "Warning: Deleting Product!";
  document.getElementById('warningprompttext').innerHTML = "Are you sure you want to delete this product?  This action is irreversable."
  document.getElementById('warningbuttoncancel').onclick = function() {
    $(".warningprompt").modal('hide');
    $(".addproduct").modal({closable: true}).modal('show').modal('refresh');
  }
  document.getElementById('warningbuttonsubmit').onclick = function() {
    document.getElementById('warningbuttonsubmit').className = "ui loading negative right labeled icon button";
    var postdata = "id=" + id;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200) {
        if(this.responseText.indexOf("$$REDIRECT$$") !== -1) {
          LogoutRedirect();
        }
        else if(this.responseText == "1") {
          document.getElementById('warningbuttonsubmit').className = "ui negative right labeled icon button";
          $(".warningprompt").modal('hide');
          $(".addproduct").modal('hide');
          $(".successprompt").modal('show');
          ReloadproductList();
          document.getElementById('successprompttext').innerHTML = "Product Successfully Deleted!";
          setTimeout(function() {
            $(".successprompt").modal('hide');                
          }, 1000);
        }
        else {
          $(".warningprompt").modal('hide');          
          document.getElementById('warningbuttonsubmit').className = "ui negative right labeled icon button";
          document.getElementById('warningbuttonsubmit').innerHTML = "Okay";
          document.getElementById('warningheader').innerHTML = "Error!";
          document.getElementById('warningprompttext').innerHTML = this.responseText; 
          $(".warningprompt").modal('show');          
          document.getElementById('warningbuttonsubmit').onclick = function() {
            document.getElementById('warningbuttonsubmit').innerHTML = "Delete<i class=\"cancel icon\"></i>";
            $(".warningprompt").modal('hide');
            $(".addproduct").modal({closable: true}).modal('show').modal('refresh');
          }
        }
      }
      if(this.readyState == 4 && this.status != 200) {
        $(".successprompt").modal('show');
        document.getElementById('successpromptheader').innerHTML = "Error!";
        document.getElementById('successpromptmessagebody').className = "ui error message";
        document.getElementById('successprompttext').innerHTML = "Server Error! Please Try Again";
        setTimeout(function() {
          document.getElementById('successpromptheader').innerHTML = "Success";
          document.getElementById('successpromptmessagebody').className = "ui success message";
          $(".successprompt").modal('hide');                
        }, 2000);
      }
    }
    xhttp.open("DELETE", "/r/product/delete", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(postdata);
    return false;
  }
  return false;
}

$(function(){
  $("#productsubmit").click(function() {
    var productform = document.getElementById('productform');
    if(ValidateProductForm()){
      productform.className = "ui loading form";
      if(!productEditMode) {
        var postdata = "name=" + productform.elements["productname"].value + "&description=" + productform.elements["productdescription"].value + "&cost=" + productform.elements["productcost"].value + "&quantity=" + productform.elements["productquantity"].value + "&category="  + productform.elements["productcategory"].value;;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if(this.readyState == 4 && this.status == 200) {
            if(this.responseText.indexOf("$$REDIRECT$$") !== -1) {
              LogoutRedirect();
            }
            if(this.responseText.indexOf("$$UNAUTH$$") !== -1){
              $(".unauthprompt").modal('show').modal('refresh');
            }
            else if(this.responseText == "1") {
              productform.className = "ui form";
              productform.reset();
                $(".successprompt").modal('show');
                ReloadProductList();
                document.getElementById('successprompttext').innerHTML = "Product Successfully Added!";
                setTimeout(function() {
                  $(".successprompt").modal('hide');                
                }, 2000);
            }
            else {
              productform.className = "ui form error";
              document.getElementById("productformerrormsg").innerHTML = this.responseText;
            }
          }
        }
        xhttp.open("POST", "/r/product/add", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(postdata);
        return false;
      }
      else {
        var postdata = "id=" + document.getElementById("productIDField").value + "&name=" + productform.elements["productname"].value + "&description=" + productform.elements["productdescription"].value + "&cost=" + productform.elements["productcost"].value + "&quantity=" + productform.elements["productquantity"].value + "&category="  + productform.elements["productcategory"].value;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if(this.readyState == 4 && this.status == 200) {
            if(this.responseText.indexOf("$$REDIRECT$$") !== -1) {
              LogoutRedirect();
            }
            if(this.responseText.indexOf("$$UNAUTH$$") !== -1){
              $(".unauthprompt").modal('show').modal('refresh');
            }
            else if(this.responseText == "1") {
              productform.className = "ui form";
              productform.reset();
              $(".addproduct").modal('hide');
              $(".successprompt").modal('show');
              ReloadproductList();
              document.getElementById('successprompttext').innerHTML = "Product Successfully Edited!";
              setTimeout(function() {
                $(".successprompt").modal('hide');                
              }, 1000);
            }
            else {
              productform.className = "ui form error";
              document.getElementById("productformerrormsg").innerHTML = this.responseText;
            }
          }
        }
        xhttp.open("POST", "/r/product/edit", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(postdata);
        return false;
      }
    }
    else {
      return false;
    }
  });
});
//End product Modal Functions ----------------------------------------------------------------------------------------------

//Charity Modal Functions ----------------------------------------------------------------------------------------------
var charityEditMode = false;
$(function(){
  $("#addcharity").click(function(){
    $(".addcharity").modal('show').modal('refresh');
    document.getElementById("charitymodalheader").innerHTML = "Add Charity";
    document.getElementById('deletecharitybutton').classList.add('disabled');
    charityEditMode = false;
    document.getElementById('charityform').reset();
    document.getElementById('charityform').className = "ui form";
  });
  $(".addcharity").modal({
    closable: true
  });
});

function CloseCharityModal() {
  $(".addcharity").modal('hide');
}

function EditCharity(id) {
  $(".addcharity").modal({closable: true}).modal('show').modal('refresh');
  document.getElementById('deletecharitybutton').classList.remove('disabled');
  document.getElementById("charitymodalheader").innerHTML = "Edit Charity";
  document.getElementById("charityIDField").value = id;
  charityEditMode = true;
  var charityform = document.getElementById('charityform');
  charityform.className = "ui loading form";

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      if(this.responseText.indexOf("$$REDIRECT$$") !== -1) {
        LogoutRedirect();
      }
      else if(this.responseText == "-1") {
        charityform.className = "ui form error";
        document.getElementById("charityformerrormsg").innerHTML = this.responseText;
      }
      else {
        charityform.className = "ui form";
        var charity = JSON.parse(this.responseText);
        charityform.elements["charityname"].value = charity.name;
        charityform.elements["charitydescription"].value = charity.description;
        document.getElementById('deletecharitybutton').onclick = function() {
          DeleteCharity(id);
        }
      }
    }
  }
  xhttp.open("GET", "/r/charity/" + id, true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
  return false;
}

function DeleteCharity(id){
  $(".addcharity").modal('hide');
  $(".warningprompt").modal({closable: true}).modal('show').modal('refresh');
  document.getElementById('warningheader').innerHTML = "Warning: Deleting Charity!";
  document.getElementById('warningprompttext').innerHTML = "Are you sure you want to delete this charity?  This action is irreversable."
  document.getElementById('warningbuttoncancel').onclick = function() {
    $(".warningprompt").modal('hide');
    $(".addcharity").modal({closable: true}).modal('show').modal('refresh');
  }
  document.getElementById('warningbuttonsubmit').onclick = function() {
    document.getElementById('warningbuttonsubmit').className = "ui loading negative right labeled icon button";
    var postdata = "id=" + id;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200) {
        if(this.responseText.indexOf("$$REDIRECT$$") !== -1) {
          LogoutRedirect();
        }
        else if(this.responseText == "1") {
          document.getElementById('warningbuttonsubmit').className = "ui negative right labeled icon button";
          $(".warningprompt").modal('hide');
          $(".addcharity").modal('hide');
          $(".successprompt").modal('show');
          ReloadCharityList();
          document.getElementById('successprompttext').innerHTML = "Charity Successfully Deleted!";
          setTimeout(function() {
            $(".successprompt").modal('hide');                
          }, 1000);
        }
        else {
          $(".warningprompt").modal('hide');          
          document.getElementById('warningbuttonsubmit').className = "ui negative right labeled icon button";
          document.getElementById('warningbuttonsubmit').innerHTML = "Okay";
          document.getElementById('warningheader').innerHTML = "Error!";
          document.getElementById('warningprompttext').innerHTML = this.responseText; 
          $(".warningprompt").modal('show');          
          document.getElementById('warningbuttonsubmit').onclick = function() {
            document.getElementById('warningbuttonsubmit').innerHTML = "Delete<i class=\"cancel icon\"></i>";
            $(".warningprompt").modal('hide');
            $(".addcharity").modal({closable: true}).modal('show').modal('refresh');
          }
        }
      }
      if(this.readyState == 4 && this.status != 200) {
        $(".successprompt").modal('show');
        document.getElementById('successpromptheader').innerHTML = "Error!";
        document.getElementById('successpromptmessagebody').className = "ui error message";
        document.getElementById('successprompttext').innerHTML = "Server Error! Please Try Again";
        setTimeout(function() {
          document.getElementById('successpromptheader').innerHTML = "Success";
          document.getElementById('successpromptmessagebody').className = "ui success message";
          $(".successprompt").modal('hide');                
        }, 2000);
      }
    }
    xhttp.open("DELETE", "/r/charity/delete", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(postdata);
    return false;
  }
  return false;
}

$(function(){
  $("#charitysubmit").click(function() {
    var charityform = document.getElementById('charityform');
    if(ValidateCharityForm()){
      charityform.className = "ui loading form";
      if(!charityEditMode) {
        var postdata = "name=" + charityform.elements["charityname"].value + "&description=" + charityform.elements["charitydescription"].value;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if(this.readyState == 4 && this.status == 200) {
            if(this.responseText.indexOf("$$REDIRECT$$") !== -1) {
              LogoutRedirect();
            }
            else if(this.responseText == "1") {
              charityform.className = "ui form";
              charityform.reset();
                $(".successprompt").modal('show');
                ReloadCharityList();
                document.getElementById('successprompttext').innerHTML = "Charity Successfully Added!";
                setTimeout(function() {
                  $(".successprompt").modal('hide');                
                }, 2000);
            }
            else {
              charityform.className = "ui form error";
              document.getElementById("charityformerrormsg").innerHTML = this.responseText;
            }
          }
        }
        xhttp.open("POST", "/r/charity/add", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(postdata);
        return false;
      }
      else {
        var postdata = "id=" + document.getElementById("charityIDField").value + "&name=" + charityform.elements["charityname"].value + "&description=" + charityform.elements["charitydescription"].value;        
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if(this.readyState == 4 && this.status == 200) {
            if(this.responseText.indexOf("$$REDIRECT$$") !== -1) {
              LogoutRedirect();
            }
            else if(this.responseText == "1") {
              charityform.className = "ui form";
              charityform.reset();
              $(".addcharity").modal('hide');
              $(".successprompt").modal('show');
              ReloadcharityList();
              document.getElementById('successprompttext').innerHTML = "Charity Successfully Edited!";
              setTimeout(function() {
                $(".successprompt").modal('hide');                
              }, 1000);
            }
            else {
              charityform.className = "ui form error";
              document.getElementById("charityformerrormsg").innerHTML = this.responseText;
            }
          }
        }
        xhttp.open("POST", "/r/charity/edit", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(postdata);
        return false;
      }
    }
    else {
      return false;
    }
  });
});
//End Charity Modal Functions ----------------------------------------------------------------------------------------------

//List Reloading Functions ----------------------------------------------------------------------------------------------
function ReloadUserList() {
  var userTable = document.getElementById('usertable');
  var newtable = '';
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      if(this.responseText.indexOf("$$REDIRECT$$") !== -1) {
        LogoutRedirect();
      }
      else if(this.responseText.indexOf("Error") === -1) {
        var userList = JSON.parse(this.responseText);
        for(i = 0; i < userList.length; i++)
        {
          newtable += "<tr onclick='EditUser(" + userList[i].id + ")' class='title'>";
          newtable += "<td style='width:33%'>" + userList[i].username + "</td>";
          newtable += "<td style='width:33%'>" + userList[i].name + "</td>";
          newtable += "<td style='width:33%'>" + userList[i].donated + "</td></tr>";
        }
        userTable.innerHTML = newtable;
      }
      else {
        alert("ERROR: " + this.responseText);
      }
    }
  }
  xhttp.open("POST", "/r/user/all", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
}

function ReloadCategoryList() {
  var categoryTable = document.getElementById('categorytable');
  var newtable = '';
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      ReloadCategoryListDropdown();
      if(this.responseText.indexOf("$$REDIRECT$$") !== -1) {
        LogoutRedirect();
      }
      if(this.responseText.indexOf("$$NORESULT$$") !== -1){
        categoryTable.innerHTML = "<p style='margin-top:10px;margin-bottom:10px;text-align:center;'>No categories found!</p>";
      }
      else if(this.responseText.indexOf("Error") === -1) {
        var categoryList = JSON.parse(this.responseText);
        for(i = 0; i < categoryList.length; i++)
        {
          newtable += "<tr onclick='EditCategory(" + categoryList[i].id + ")' class='title'>";
          newtable += "<td style='width:33%'>" + categoryList[i].id + "</td>";
          newtable += "<td style='width:33%'>" + categoryList[i].name + "</td>";
          newtable += "<td style='width:33%'>" + categoryList[i].description + "</td></tr>";
        }
        categoryTable.innerHTML = newtable;
      }
      else {
        alert("ERROR: " + this.responseText);
      }
    }
  }
  xhttp.open("POST", "/r/category/all", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
}

function ReloadProductList() {
  var productTable = document.getElementById('producttable');
  var newtable = '';
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      if(this.responseText.indexOf("$$REDIRECT$$") !== -1) {
        LogoutRedirect();
      }
      if(this.responseText.indexOf("$$NORESULT$$") !== -1){
        productTable.innerHTML = "<p style='margin-top:10px;margin-bottom:10px;text-align:center;'>No products found!</p>";
      }
      else if(this.responseText.indexOf("Error") === -1) {
        var productList = JSON.parse(this.responseText);
        xhttp.onreadystatechange = function() {
          if(this.readyState == 4 && this.status == 200) {
            if(this.responseText.indexOf("$$REDIRECT$$") !== -1) {
              LogoutRedirect();
            }
            else if(this.responseText.indexOf("Error") === -1) {
              var categoryList = JSON.parse(this.responseText);
              for(i = 0; i < productList.length; i++)
              {
                newtable += "<tr onclick='EditProduct(" + productList[i].id + ")' class='title'>";
                newtable += "<td style='width:20%'>" + productList[i].name + "</td>";
                newtable += "<td style='width:20%'>" + productList[i].description + "</td>";
                newtable += "<td style='width:20%'>" + productList[i].cost + "</td>";
                newtable += "<td style='width:20%'>" + productList[i].quantity + "</td>";
                var foundCategory = false;
                for(j = 0; j < categoryList.length; j++) {
                  if(categoryList[j].id == productList[i].category) {
                    foundCategory = true;
                    newtable += "<td style='width:20%'>" + categoryList[j].name + "</td></tr>";
                    break;
                  }
                }
                if(!foundCategory) {
                  newtable += "<td style='width:20%'>Category Lookup Failure</td></tr>";                  
                }
              }
              productTable.innerHTML = newtable;
            }
            else {
              alert("ERROR: " + this.responseText);
            }
          }
        }
        xhttp.open("POST", "/r/category/all", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send();
      }
      else {
        alert("ERROR: " + this.responseText);
      }
    }
  }
  xhttp.open("POST", "/r/product/all", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
}

function ReloadCharityList() {
  var charityTable = document.getElementById('charitytable');
  var newtable = '';
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      if(this.responseText.indexOf("$$REDIRECT$$") !== -1) {
        LogoutRedirect();
      }
      if(this.responseText.indexOf("$$NORESULT$$") !== -1){
        charityTable.innerHTML = "<p style='margin-top:10px;margin-bottom:10px;text-align:center;'>No charities found!</p>";
      }
      else if(this.responseText.indexOf("Error") === -1) {
        var charityList = JSON.parse(this.responseText);
        for(i = 0; i < charityList.length; i++)
        {
          newtable += "<tr onclick='EditCharity(" + charityList[i].id + ")' class='title'>";
          newtable += "<td style='width:33%'>" + charityList[i].name + "</td>";
          newtable += "<td style='width:33%'>" + charityList[i].description + "</td>";
          newtable += "<td style='width:33%'>" + charityList[i].donated + "</td></tr>";
        }
        charityTable.innerHTML = newtable;
      }
      else {
        alert("ERROR: " + this.responseText);
      }
    }
  }
  xhttp.open("POST", "/r/charity/all", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
}

function ReloadCategoryListDropdown() {
  var newDropdown = '';
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      if(this.responseText.indexOf("$$REDIRECT$$") !== -1) {
        LogoutRedirect();
      }
      else if(this.responseText.indexOf("Error") === -1) {
        var categoryList = JSON.parse(this.responseText);
        newDropdown += "<option value=''>Choose Category</option>"
        for(i = 0; i < categoryList.length; i++)
        {
          newDropdown += "<option value='" + categoryList[i].id + "'>" + categoryList[i].name + "</option>"
        }
        document.getElementById('productcategory').innerHTML = newDropdown;
      }
      else {
        alert("Error: " + this.responseText);
      }
    }
    if(this.readyState == 4 && this.status != 200) {
      $(".successprompt").modal('show');
      document.getElementById('successpromptheader').innerHTML = "Error!";
      document.getElementById('successpromptmessagebody').className = "ui error message";
      document.getElementById('successprompttext').innerHTML = "Server Error! Please Try Again";
      setTimeout(function() {
        document.getElementById('successpromptheader').innerHTML = "Success";
        document.getElementById('successpromptmessagebody').className = "ui success message";
        $(".successprompt").modal('hide');                
      }, 2000);
    }
  }
  xhttp.open("POST", "/r/category/all", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
}

function LogoutRedirect() {
  window.location.href = "/";
}