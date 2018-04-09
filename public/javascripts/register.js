var userEditMode = false;
$(function(){
  $("#usersubmit").click(function() {
    var userform = document.getElementById('userform');
    userform.className = "ui loading form";
    if(ValidateUserForm()){
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
      xhttp.open("POST", "/r/register", true);
      xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhttp.send(postdata);
      return false;
    }
    else {
      return false;
    }
  });
});