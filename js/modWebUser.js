angular.module("modWebUser", [])
.service("svcWebUser", [
  "$http",
  function($http) {
      var self = this;


      
    var BASE_URL =
      "https://script.google.com/macros/s/AKfycbzR7SMFah36XNHPc2i-Kb2Tcf8RE0gtBJ2cGIzKZ3fOnsQHIRE/exec?";      


    this.post=function(url,rqsParam){
      return $http({
        method: "POST",
        url: BASE_URL,
        data: rqsParam, //forms user object
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      }).then(function(response) {
        console.log(response);
        return response;
        if (data.errors) {
          //data.errors
          console.log(data);
        } else {
          //data.message
          console.log(data);
          return data;
        }
      });        
    }



      
    this.getUser = function(rqsParam) {
        if (!rqsParam){rqsParam={}};
        self.post(BASE_URL,rqsParam).then(function(res){
            return res
        })
    };
    this.setUser = function(rqsParam) {
      return $http({
        method: "POST",
        url: BASE_URL,
        data: rqsParam, //forms user object
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      }).then(function(response) {
        console.log(response);
        return response;
        if (data.errors) {
          //data.errors
          console.log(data);
        } else {
          //data.message
          console.log(data);
          return data;
        }
      });
    };
  }
]);
