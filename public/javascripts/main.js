//Map functions===================================================================================================
$(function() {
  InitMapBlank();
  (function(){
    UpdateBusses();
    setTimeout(arguments.callee, 2500);
  })();
})