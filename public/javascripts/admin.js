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
      if(this.responseText.indexOf("$$UNAUTH$$") !== -1){
        $(".unauthprompt").modal('show').modal('refresh');
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
    userform.className = "ui loading form";
    if(ValidateUserForm()){
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

  var postdata = "id=" + id;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      if(this.responseText.indexOf("$$REDIRECT$$") !== -1) {
        LogoutRedirect();
      }
      if(this.responseText.indexOf("$$UNAUTH$$") !== -1){
        $(".unauthprompt").modal('show').modal('refresh');
      }
      else if(this.responseText == "-1") {
        categoryform.className = "ui form error";
        document.getElementById("categoryformerrormsg").innerHTML = this.responseText;
      }
      else {
        categoryform.className = "ui form";
        var category = JSON.parse(this.responseText);
        categoryform.elements["categoryname"].value = category[0].name;
        categoryform.elements["categorydescription"].value = category[0].description;
        document.getElementById('deletecategorybutton').onclick = function() {
          Deletecategory(uid);
        }
      }
    }
  }
  xhttp.open("POST", "/r/category/", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(postdata);
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
    xhttp.open("POST", "/r/category/delete", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(postdata);
    return false;
  }
  return false;
}

$(function(){
  $("#categorysubmit").click(function() {
    var categoryform = document.getElementById('categoryform');
    categoryform.className = "ui loading form";
    if(ValidateCategoryForm()){
      if(!categoryEditMode) {
        var postdata = "categoryname=" + categoryform.elements["categoryname"].value + "&description=" + categoryform.elements["categorydescription"].value;
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
                ReloadcategoryList();
                document.getElementById('successprompttext').innerHTML = "category Successfully Added!";
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

function EditProduct(uid) {
  $(".addproduct").modal({closable: true}).modal('show').modal('refresh');
  document.getElementById('deleteproductbutton').classList.remove('disabled');
  document.getElementById("productmodalheader").innerHTML = "Edit Product";
  document.getElementById("productIDField").value = uid;
  productEditMode = true;
  var productform = document.getElementById('productform');
  productform.className = "ui loading form";

  var postdata = "uid=" + uid;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      if(this.responseText.indexOf("$$REDIRECT$$") !== -1) {
        LogoutRedirect();
      }
      if(this.responseText.indexOf("$$UNAUTH$$") !== -1){
        $(".unauthprompt").modal('show').modal('refresh');
      }
      else if(this.responseText == "-1") {
        productform.className = "ui form error";
        document.getElementById("productformerrormsg").innerHTML = this.responseText;
      }
      else {
        productform.className = "ui form";
        var product = JSON.parse(this.responseText);
        productform.elements["name"].value = product[0].name;
        productform.elements["productname"].value = product[0].productname;
        document.getElementById('deleteproductbutton').onclick = function() {
          Deleteproduct(uid);
        }
      }
    }
  }
  xhttp.open("POST", "/r/product/", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(postdata);
  return false;
}

function Deleteproduct(uid){
  $(".addproduct").modal('hide');
  $(".warningprompt").modal({closable: true}).modal('show').modal('refresh');
  document.getElementById('warningheader').innerHTML = "Warning: Deleting product!";
  document.getElementById('warningprompttext').innerHTML = "Are you sure you want to delete this product?  This action is irreversable."
  document.getElementById('warningbuttoncancel').onclick = function() {
    $(".warningprompt").modal('hide');
    $(".addproduct").modal({closable: true}).modal('show').modal('refresh');
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
          $(".addproduct").modal('hide');
          $(".successprompt").modal('show');
          ReloadproductList();
          document.getElementById('successprompttext').innerHTML = "product Successfully Deleted!";
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
    xhttp.open("POST", "/r/product/delete", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(postdata);
    return false;
  }
  return false;
}

$(function(){
  $("#productsubmit").click(function() {
    var productform = document.getElementById('productform');
    productform.className = "ui loading form";
    if(ValidateproductForm()){
      if(!productEditMode) {
        var postdata = "name=" + productform.elements["name"].value + "&productname=" + productform.elements["productname"].value + "&password=" + productform.elements["password"].value;
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
                ReloadproductList();
                document.getElementById('successprompttext').innerHTML = "product Successfully Added!";
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
        if(productform.elements["password"].value == '') {
          var postdata = "uid=" + document.getElementById("productIDField").value + "&editpassword=false&name=" + productform.elements["name"].value + "&productname=" + productform.elements["productname"].value;
        }
        else {
          var postdata = "uid=" + document.getElementById("productIDField").value + "&editpassword=true&name=" + productform.elements["name"].value + "&productname=" + productform.elements["productname"].value + "&password=" + productform.elements["password"].value;
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
              productform.className = "ui form";
              productform.reset();
              $(".addproduct").modal('hide');
              $(".successprompt").modal('show');
              ReloadproductList();
              document.getElementById('successprompttext').innerHTML = "product Successfully Edited!";
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
      if(this.responseText.indexOf("$$UNAUTH$$") !== -1){
        $(".unauthprompt").modal('show').modal('refresh');
      }
      else if(this.responseText.indexOf("Error") === -1) {
        var userList = JSON.parse(this.responseText);
        for(i = 0; i < userList.length; i++)
        {
          newtable += "<tr onclick='EditUser(" + userList[i].id + ")' class='title'>";
          newtable += "<td style='width:33%'>" + userList[i].username + "</td>";
          newtable += "<td style='width:33%'>" + userList[i].name + "</td>";
          newtable += "<td style='width:33%'>" + userList[i].donated + "</tr>";
        }
        userTable.innerHTML = newtable;
      }
      else {

      }
    }
  }
  xhttp.open("POST", "/r/user/all", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
}

function LogoutRedirect() {
  window.location.href = "/?redirect=true&from=/admin";
}