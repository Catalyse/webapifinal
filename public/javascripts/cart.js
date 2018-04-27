//Init
$(function() {
  ReloadCartList();
  ReloadCharityListDropdown();
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

function CloseCheckoutModal() {
  $(".checkout").modal('hide');
}

function Checkout() {
  $(".checkout").modal({closable: true}).modal('show').modal('refresh');
  document.getElementById('checkoutcharitybuttonsubmit').onclick = function() {
    SelectCharity();
  }
  document.getElementById('checkoutbuttonsubmit').onclick = function() {
    document.getElementById('checkoutbuttonsubmit').classList.add('loading');
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200) {  
        document.getElementById('checkoutbuttonsubmit').classList.remove('loading');      
        if(this.responseText.indexOf("$$REDIRECT$$") !== -1) {
          LogoutRedirect();
        }
        else if(this.responseText.indexOf("Error") !== -1 || this.responseText.indexOf("error") !== -1) {
          alert("Error: " + this.responseText);
        }
        else if (this.responseText != "1") {
          alert("One or more of the items in your cart is not available in the quantity you want!");
        }
        else {
          ReloadCartList();
          $(".successprompt").modal('show');
          document.getElementById('successprompttext').innerHTML = "Checkout Complete!";
          setTimeout(function() {
            $(".successprompt").modal('hide');                
          }, 2000);
        }
      }
    }
    xhttp.open("POST", "/r/transaction/add/false/null", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
  }
}

function ValidateCharitySelection(finishfunction) {
  document.getElementById('charitylistfield').classList.remove('error');
  document.getElementById('chairtyerrorfield').classList.add('hidden');
  if(document.getElementById('charitylist').value == '') {
    document.getElementById('charitylistfield').classList.add('error');
    document.getElementById('chairtyerrorfield').classList.remove('hidden');
    finishfunction(false);
  }
  else {
    finishfunction(true);
  }
}

function CloseCharityModal() {
  $(".charity").modal('hide');
}

function SelectCharity() {
  $(".checkout").modal('hide');
  $(".charity").modal({closable: true}).modal('show').modal('refresh');
  document.getElementById('donatebuttonsubmit').onclick = function() {
    ValidateCharitySelection(function(result) {
      if(result == true) {
        document.getElementById('donatebuttonsubmit').classList.add('loading');
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if(this.readyState == 4 && this.status == 200) {    
            document.getElementById('donatebuttonsubmit').classList.remove('loading');    
            if(this.responseText.indexOf("$$REDIRECT$$") !== -1) {
              LogoutRedirect();
            }
            else if(this.responseText.indexOf("Error") !== -1 || this.responseText.indexOf("error") !== -1) {
              alert("Error: " + this.responseText);
            }
            else {
              ReloadCartList();
              $(".successprompt").modal('show');
              document.getElementById('successprompttext').innerHTML = "Checkout and Donation Complete!";
              setTimeout(function() {
                $(".successprompt").modal('hide');                
              }, 2000);
            }
          }
        }
        xhttp.open("POST", "/r/transaction/add/true/" + document.getElementById('charitylist').value, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send();
      }
    });
  }
}

function ReloadCharityListDropdown() {
  var newDropdown = '';
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      if(this.responseText.indexOf("$$REDIRECT$$") !== -1) {
        LogoutRedirect();
      }
      else if(this.responseText.indexOf("Error") === -1) {
        var charityList = JSON.parse(this.responseText);
        newDropdown += "<option value=''>Choose Charity</option>"
        for(i = 0; i < charityList.length; i++)
        {
          newDropdown += "<option value='" + charityList[i].id + "'>" + charityList[i].name + "</option>"
        }
        document.getElementById('charitylist').innerHTML = newDropdown;
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
  xhttp.open("POST", "/r/charity/all", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
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
        document.getElementById('totalcost').innerHTML = "Total Cost: $" + 0;
      }
      else if(this.responseText.indexOf("Error") === -1) {
        var cart = JSON.parse(this.responseText);
        if(cart.contents == 'null' || cart.contents == 'NULL' || cart.contents == null)
        {
          cartTable.innerHTML = "<p style='margin-top:10px;margin-bottom:10px;text-align:center;'>Nothing found in cart!</p>";
          document.getElementById('totalcost').innerHTML = "Total Cost: $" + 0;
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
                var totalcost = 0;
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
                      totalcost += (parseFloat(productList[j].cost * parseFloat(details[1])));
                      linkedProduct = true;
                      break;
                    }
                  }
                  if(!linkedProduct) {
                    newtable += "<tr class='title'><p style='margin-top:10px;margin-bottom:10px;text-align:center;'>Error Finding Product!</p></tr>";
                  }
                }
                if(totalcost == 0) {
                  document.getElementById('totalcost').innerHTML = "Total Cost: $" + 0;
                }
                else {
                  document.getElementById('totalcost').innerHTML = "Total Cost: $" + totalcost;
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