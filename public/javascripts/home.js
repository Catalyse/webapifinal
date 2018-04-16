//Init
$(function() {
  ReloadProductList();
});

function CloseAddProductModal() {
  $(".addproduct").modal('hide');
}

function ValidateProductForm(finish) {
  document.getElementById('addproducterrorfield').classList.add('hidden');
  if(document.getElementById('addproductquantity').value == '' || parseFloat(document.getElementById('addproductquantity').value) < 1) {
    document.getElementById('addproducterrorfield').classList.remove('hidden');
    finish(false);
  }
  else {
    finish(true);
  }
}

function AddProduct(id) {
  $(".addproduct").modal({closable: true}).modal('show').modal('refresh');
  document.getElementById('addproductbuttonsubmit').onclick = function() {
    ValidateProductForm(function(result) {
      if(result) {
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
              $(".successprompt").modal('show');
              document.getElementById('successprompttext').innerHTML = "Item Successfully Added to Cart!";
              setTimeout(function() {
                $(".successprompt").modal('hide');                
              }, 2000);
            }
          }
        }
        xhttp.open("POST", "/r/cart/item/add/" + id + "/" + document.getElementById('addproductquantity').value, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send();
      }
    });
  }
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
                newtable += "<tr onclick='AddProduct(" + productList[i].id + ")' class='title'>";
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

function LogoutRedirect() {
  window.location.href = "/";
}