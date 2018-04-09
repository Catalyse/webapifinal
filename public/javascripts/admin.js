//User Modal Functions ----------------------------------------------------------------------------------------------
var userEditMode = false;
$(function(){
  $("#adduser").click(function(){
    $(".adduser").modal('show').modal('refresh');
    document.getElementById("usermodalheader").innerHTML = "Add User";
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
        userform.elements["fname"].value = user[0].fname;
        userform.elements["lname"].value = user[0].lname;
        userform.elements["username"].value = user[0].username;
        userform.elements["email"].value = user[0].email;
        userform.elements["permid"].value = user[0].permissionsid;
        if(user[0].userid > 1){
          userform.elements["linkeddriver"].value = user[0].userid;
          document.getElementById('driverlist').className = "field";
        }else{
          userform.elements["linkeddriver"].value = '';
          document.getElementById('driverlist').className = "field disabled ";
        }
        document.getElementById('deleteuserbutton').onclick = function() {
          DeleteUser(uid);
        }
      }
    }
  }
  xhttp.open("POST", "/admin/r/user/", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(postdata);
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
        xhttp.open("POST", "/admin/r/user/add", true);
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
        xhttp.open("POST", "/admin/r/user/edit", true);
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