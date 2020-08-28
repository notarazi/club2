/* !!! IMPORTANT: Rename "mymodule" below and add your module to Angular Modules above. */

angular
  .module("modEzzi", [])

  .service("svcEzzi", [
    "$rootScope",
    "$http",
    "$ionicLoading",
    "$ionicPopup",
    "svcUtils",
    function($rootScope, $http, $ionicLoading, $ionicPopup, svcUtil) {
      var self = this;
      var BASE_URL =
        "https://demo.razzi.my/xspouse1";      
      var data = {};

    

      function jsontostring(objData) {
        return Object.keys(objData)
          .map(function(key) {
            return (
              encodeURIComponent(key) + "=" + encodeURIComponent(objData[key])
            );
          })
          .join("&");
      }
      
      this.showAlert = function(title,message) {
      var alertPopup = $ionicPopup.alert({
         title: title,
         template: message,
         okType: 'button-dark'
      });
      alertPopup.then(function(res) {
         // Custom functionality....
      });
   };
      
    this.update_appPath=function(strPath,strNode,strChar,strIndx){
        var arry_path=strPath.split(strChar);
        arry_path[strIndx]=strNode;
        return arry_path.join(strChar) 
    }
    
    this.upd_app_nav=function(objt_appl_navi,intr_indx,objt_refr){
        var navs=objt_appl_navi.path.length;
        objt_appl_navi[intr_indx]=objt_refr;
        while (navs-1>intr_indx){
            intr_indx++;
            objt_appl_navi[intr_indx]={};
        }
    }
    
    

      this.get = function(strCtrl,objData) {
          var param=jsontostring(objData);
          //console.log(param);
          
        $ionicLoading.show({
          template:
            '<ion-spinner icon="ios" class="spinner-balanced"></ion-spinner>'
        });
        
        var url=BASE_URL + '/'+strCtrl+'?data=' + encodeURIComponent(JSON.stringify(objData));
        console.log('url:',url);
        
        return $http({
          method: "GET",
          url: url,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"          
          },
          data: ''
        }).then(
          function mySucces(response) {
            $ionicLoading.hide();
            //console.log("success:" + JSON.stringify(response));
            return response.data.respdata;
          },
          function myError(response) {
              var resp=JSON.stringify(response);
            console.log("error:" + resp);
            $ionicLoading.hide();
          }
        );
      };



      this.post = function(strCtrl,objData) {
          var param=jsontostring(objData);
          //console.log(param);
          
        $ionicLoading.show({
          template:
            '<ion-spinner icon="ios" class="spinner-balanced"></ion-spinner>'
        });
        return $http({
          method: "POST",
          url: BASE_URL + '/'+strCtrl,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
          },
          data: JSON.stringify(objData)
        }).then(
          function mySucces(response) {
            $ionicLoading.hide();
            console.log("success:" + JSON.stringify(response));
            return response.data.respdata;
          },
          function myError(response) {
            console.log("error:" + response);
            $ionicLoading.hide();
          }
        );
      };


      this.loadingPost = function(cgrp,objData) {
        $ionicLoading.show({
          template:
            '<ion-spinner icon="ios" class="spinner-balanced"></ion-spinner>'
        });
        return $http({
          method: "POST",
          url: BASE_URL + "/"+ cgrp+ "?" + jsontostring(objData),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
          },
          data: jsontostring(objData)
        }).then(
          function mySucces(response) {
            $ionicLoading.hide();
            //console.log("success:" + JSON.stringify(response));
            return response.data.respdata;
          },
          function myError(response) {
            console.log("error:" + response);
            $ionicLoading.hide();
          }
        );
      };

      this.silentPost = function(cgrp,objData) {
        return $http({
          method: "POST",
          url: BASE_URL + "/"+ cgrp+ "?" + jsontostring(objData),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
          },
          data: jsontostring(objData)
        }).then(
          function mySucces(response) {
            //console.log("success:" + JSON.stringify(response.data));
            return response.data.respdata;
          },
          function myError(response) {
            console.log("error:" + response);
          }
        );
      };
    }
  ]);
