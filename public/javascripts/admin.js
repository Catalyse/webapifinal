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
          newtable += "<td>" + userList[i].username + "</td>";
          newtable += "<td>" + userList[i].name + "</td>";
          newtable += "<td>" + userList[i].donated + "</tr>";
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

//Cleave.js stuff=======================================================================================