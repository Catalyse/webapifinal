//Init
$(function() {
  ReloadCartList();
});

function CloseClearCartModal() {
  $(".clearcart").modal('hide');
}

function ClearCart() {
  $(".clearcart").modal({closable: true}).modal('show').modal('refresh');
  document.getElementById('clearcartbuttonsubmit').onclick = function() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200) {        
        if(this.responseText.indexOf("$$REDIRECT$$") !== -1) {
          LogoutRedirect();
        }
        else if(this.responseText.indexOf("Error") !== -1 || this.responseText.indexOf("error") !== -1) {
          alert("Error: " + this.responseText);
        }
        else {
          ReloadCartList();
          $(".successprompt").modal('show');
          document.getElementById('successprompttext').innerHTML = "Cart Successfully Cleared!";
          setTimeout(function() {
            $(".successprompt").modal('hide');                
          }, 2000);
        }
      }
    }
    xhttp.open("DELETE", "/r/cart/", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
  }
}

function CloseClearItemModal() {
  $(".clearitem").modal('hide');
}

function ClearItem(id) {
  $(".clearitem").modal({closable: true}).modal('show').modal('refresh');
  document.getElementById('clearitembuttonsubmit').onclick = function() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200) {        
        if(this.responseText.indexOf("$$REDIRECT$$") !== -1) {
          LogoutRedirect();
        }
        else if(this.responseText.indexOf("Error") !== -1 || this.responseText.indexOf("error") !== -1) {
          alert("Error: " + this.responseText);
        }
        else {
          ReloadCartList();
          $(".successprompt").modal('show');
          document.getElementById('successprompttext').innerHTML = "Item Removed from Cart!";
          setTimeout(function() {
            $(".successprompt").modal('hide');                
          }, 2000);
        }
      }
    }
    xhttp.open("DELETE", "/r/cart/item/" + id, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
  }
}

function ReloadCartList() {
  var cartTable = document.getElementById('carttable');
  var newtable = '';
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      if(this.responseText.indexOf("$$REDIRECT$$") !== -1) {
        LogoutRedirect();
      }
      if(this.responseText.indexOf("$$NORESULT$$") !== -1){
        cartTable.innerHTML = "<p style='margin-top:10px;margin-bottom:10px;text-align:center;'>No Cart found!</p>";
      }
      else if(this.responseText.indexOf("Error") === -1) {
        var cart = JSON.parse(this.responseText);
        if(cart.contents == 'null' || cart.contents == 'NULL' || cart.contents == null)
        {
          cartTable.innerHTML = "<p style='margin-top:10px;margin-bottom:10px;text-align:center;'>Nothing found in cart!</p>";
        }
        else {
          var contents = cart.contents.split("$$");
          xhttp.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
              if(this.responseText.indexOf("$$REDIRECT$$") !== -1) {
                LogoutRedirect();
              }
              else if(this.responseText.indexOf("Error") === -1) {
                var productList = JSON.parse(this.responseText);
                for(i = 0; i < contents.length; i++)
                {
                  var linkedProduct = false;
                  var details = contents[i].split("%");
                  for(j = 0; j < productList.length; j++) {
                    if(productList[j].id == details[0]) {
                      newtable += "<tr onclick='ClearItem(" + details[0] + ")' class='title'>";
                      newtable += "<td style='width:25%'>" + productList[j].name + "</td>";
                      newtable += "<td style='width:25%'>" + productList[j].description + "</td>";
                      newtable += "<td style='width:25%'>" + productList[j].cost + "</td>";
                      newtable += "<td style='width:25%'>" + details[1] + "</td></tr>";//Quantity
                      linkedProduct = true;
                      break;
                    }
                  }
                  if(!linkedProduct) {
                    newtable += "<tr class='title'><p style='margin-top:10px;margin-bottom:10px;text-align:center;'>Error Finding Product!</p></tr>";
                  }
                }
                cartTable.innerHTML = newtable;
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
      }
      else {
        alert("ERROR: " + this.responseText);
      }
    }
  }
  xhttp.open("GET", "/r/cart/", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
}

function LogoutRedirect() {
  window.location.href = "/";
}