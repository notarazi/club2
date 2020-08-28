angular
  .module("app.controllers", [])

  .controller("loginCtrl", [
    "$rootScope",
    "$scope",
    "$state",
    "$stateParams",
    "$ionicHistory",
    "$ionicPopup",
    "svcFbsUser",
    "svcWebUser",
    "firebase",
    "$firebaseAuth",
    function(
      $rootScope,
      $scope,
      $state,
      $stateParams,
      $ionicHistory,
      $ionicPopup,
      svcFbsUser,
      svcWebUser,
      firebase,
      $firebaseAuth
    ) {
        
      $rootScope.app = {};

      var provider = new firebase.auth.GoogleAuthProvider();
      $scope.glogin = function() {
        console.log("glogin");
        firebase
          .auth()
          .signInWithPopup(provider)
          .then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            console.log(result);
            var token = result.credential.accessToken;
            console.log(token);
            // The signed-in user info.
            var user = result.user;
            console.log(user);
            // ...
          })
          .catch(function(error) {
            console.log(error);
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
          });
      };

      /* INIT BEGIN */
      $rootScope.user = {
        webProfile: {}
      };
      /* INIT END */

      /* USER ACTION */
      $scope.userAction = function(strCmdGrp, strCmd, strRef, objRef) {
        console.log(strCmdGrp + "|" + strCmd + "|" + strRef + "|" + objRef);
        switch (strCmdGrp) {
          case "nav":
            switch (strCmd) {
              case "intro":
                //console.log('show intro');
                $scope.showInfo();
                break;
            }
            break;
          case "user":
            svcFbsUser.userAction(strCmd, strRef, objRef).then(function(a) {
              if (a == undefined) {
                console.log("error");
              } else {
                console.log("result:" + JSON.stringify(a));
              }
            });
            break;
        } /* CmdGrp Switch*/
      }; /*userAction*/
      /* USER ACTION END */

      /* INTERNAL FUNCTION */

      $scope.showInfo = function() {
        var alertPopup = $ionicPopup.alert({
          title: "Info",
          template: "This is app info"
        });

        alertPopup.then(function(res) {
          // Custom functionality....
        });
      };

      /* end INTERNAL FUNCTION */

      /* onAuthStateChanged BEGIN */
      $firebaseAuth().$onAuthStateChanged(function(objAuthUser) {
        console.log("$onAuthStateChanged");
        console.log("objAuthUser:");
        //console.log(objAuthUser);
        if (!objAuthUser) {
          console.log("not objAuthUser");
          $rootScope.user.fbsUser = {};
          window.localStorage.removeItem("fbsUser");
          $rootScope.user.webUser = {};
          window.localStorage.removeItem("webUser");
          $rootScope.user.isSignedIn = false;
        } else {
          //console.log('objAuthUser');
          firebase
            .auth()
            .currentUser.getIdToken(/* forceRefresh */ true)
            .then(function(idToken) {
              // Send token to your backend via HTTPS
              // decode at jwt.io,
              // get cert at https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com
              // check verified at jwt.io
              //console.log("idToken:");
              //console.log(idToken);
            });

          $rootScope.user.fbsUser = objAuthUser;
          window.localStorage.setItem("fbsUser", angular.toJson(objAuthUser));
          svcWebUser.post({}).then(function(a) {
            //console.log(a)
          });
          $rootScope.user.webUser = {};

          $rootScope.user.isSignedIn = false;

          console.log("gotopage menuhome 1");
          $state.go("menu.home");
        }
      });
      /* onAuthStateChanged END */

      /* PAGE EVENTS */
      $scope.$on("$ionicView.beforeEnter", function() {
        //console.log("beforeEnter");
        /* DETERMINE THAT USER HAS SIGNED IN PREVIOUSLY */
        $rootScope.webuser = angular.fromJson(
          window.localStorage.getItem("webuser")
        );
        //console.log("webuser", $rootScope.webuser);
        if (!$rootScope.webuser) {
          //console.log("null");
          //svcWebUser.userAction('signIn', '', '')
          //stay here.
        } else {
          //goto menu home type 2
          console.log("gotopage menuhome 2");
          $state.go("menu.home");
        }
        /* DETERMINE THAT USER HAS SIGNED IN PREVIOUSLY END*/
        /* DETERMINE THAT INTRO PAGE TO BE SKIPPED */
        var skipIntro = window.localStorage.getItem("skipintro");
        if (skipIntro != "true") {
          //switch to intro view
        }
        /* DETERMINE THAT INTRO PAGE TO BE SKIPPED END*/
      });
      /* PAGE EVENTS END */

      $scope.imageData =
        "data:image/png;base64,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";
    }
  ])

  .controller("homeCtrl", [
    "$rootScope",
    "$scope",
    "$state",
    "$stateParams",
    "$ionicPopup",
    "$ionicLoading",
    "$firebaseAuth",
    "svcEzzi",
    "firebase",
    function(
      $rootScope,
      $scope,
      $state,
      $stateParams,
      $ionicPopup,
      $ionicLoading,
      $firebaseAuth,
      svcEzzi,
      firebase
    ) {
      /* userAction BEGIN */
      $scope.userAction = function(strgCmmdGrup, strgCmmd, strgRefr, objtRefr) {
        //console.log(strCmdGrp, strCmd, strRef, objRef);
        switch (strgCmmdGrup) {
          case "nav":
            switch (strgCmmd) {
              case "":
                break;
            } /*switch cmd*/
            break; /*nav*/
        } /*switch cmdgrp*/
      }; /* userAction END */
      /*Internal Functions*/
      /*End Internal Functions*/
      /*Page Events*/
      $scope.$on("$ionicView.loaded", function() {});
      $scope.$on("$ionicView.enter", function() {});
      $scope.$on("$ionicView.beforeLeave", function() {});
      /*End Page Events*/
    }
  ])

  .controller("menuCtrl", [
    "$rootScope",
    "$scope",
    "$state",
    "$stateParams",
    "$ionicHistory",
    "$ionicPopup",
    "svcFbsUser",
    "$firebaseAuth",
    "svcEzzi",
    function(
      $rootScope,
      $scope,
      $state,
      $stateParams,
      $ionicHistory,
      $ionicPopup,
      svcFbsUser,
      $firebaseAuth,
      svcEzzi
    ) {
      $scope.userAction = function(strgCmmdGrup, strgCmmd, strgRefr, objtRefr) {
        switch (strgCmmdGrup) {
          case "user":
            if (strgCmmd == "signOut") {
              confirmSignOut();
            }
            break;
          case "nav":
            break;
        } /* CmdGrp Switch*/
      }; /*userAction*/
      /*internal functions*/
      $rootScope.appl = {
        user_pfle: "",
        nodes: {
          wgrp_study: {
            preset: {
              topic: "",
              subtopic: ""
            },
            path: [
              "wgrp",
              "wgrp_study",
              "wgrp_study_topics",
              "wgrp_study_subtopics"
            ],
            curr: "0",
            "0": {},
            "1": {},
            "2": {},
            "3": {}
          }
        }
      };
      console.log("menu-home:");
      //console.log($rootScope.appl);
      var confirmSignOut = function() {
        var confirmPopup = $ionicPopup.confirm({
          title: "Sign Out",
          template: "Are you sure?",
          cssClass: "popupCustom"
        });
        confirmPopup.then(function(res) {
          if (res) {
            svcFbsUser.userAction("signOut", "", "");
            $state.go("login");
          } else {
            console.log("Cancel sign Out");
          }
        });
      };
      var loadUserPfle = function() {
        console.log("loadWebUserProfile");
        $firebaseAuth().$onAuthStateChanged(function(objAuthUser) {
          var param = {
            cmmd: "get_user_profile",
            token: objAuthUser.qa,
            subdata: "1"
          };
          svcEzzi.get("Wgrp", param).then(function(response) {
            console.log("get_user_profile:");
            //console.log(response);
            $rootScope.appl.user_pfle = response;
            console.log('$rootScope.appl.user_pfle.email:');
            //console.log($rootScope.appl.user_pfle.email);
            if ($rootScope.appl.user_pfle.email == "a@a.com") {
              $rootScope.appl.demo = true;
              //$rootScope.appl.demo = false;
            } else {
              $rootScope.appl.demo = false;
            }
            //return response;
          });
        });
      };
      $scope.checkValidUser = function() {
        console.log("checkValidUser");        
        $rootScope.webuser = angular.fromJson(
          window.localStorage.getItem("fbsUser")
        );
        console.log("rootScope.webuser:");        
        //console.log($rootScope.webuser);
        if ($rootScope.webuser == null) {
          $ionicPopup
            .alert({
              title: "Error",
              template: "Unauthorised User"
            })
            .then(function() {
              window.history.back();
            });
        }
      };
      /*end internal functions*/
      /*page events*/
      $scope.$on("$ionicView.loaded", function() {
        console.log("view.loaded");
        console.log("rootScope.webuser:");
        //console.log($rootScope.webuser);
      });
      $scope.$on("$ionicView.beforeEnter", function() {
        console.log("view.beforeEnter");
        $scope.checkValidUser();
      });
      $scope.$on("$ionicView.enter", function() {
        console.log("view.enter");
        loadUserPfle();
      });

      /*end page events*/
    }
  ])

  .controller("sampleCtrl", [
    "$rootScope",
    "$scope",
    "$state",
    "$stateParams",
    "PageGuard",
    "$firebaseAuth",
    "svcEzzi",
    function(
      $rootScope,
      $scope,
      $state,
      $stateParams,
      PageGuard,
      $firebaseAuth,
      svcEzzi
    ) {
      /*Internal functions*/

      /*End Internal functions*/
      /*Page Events*/

      $scope.$on("$ionicView.loaded", function() {});
      /*End Page Events*/
    }
  ])

  .controller("pentadbirCtrl", [
    "$scope",
    "$stateParams",
    function($scope, $stateParams) {}
  ])

  .controller("penyelarasCtrl", [
    "$scope",
    "$stateParams",
    function($scope, $stateParams) {}
  ])

  .controller("pengurusCtrl", [
    "$scope",
    "$stateParams",
    function($scope, $stateParams) {}
  ])

  .controller("moderatorCtrl", [
    "$rootScope",
    "$scope",
    "$state",
    "$stateParams",
    "$ionicPopup",
    "svcEzzi",
    function($rootScope, $scope, $state, $stateParams, $ionicPopup, svcEzzi) {
      $scope.userAction = function(strgCmmdGrup, strgCmmd, strgRefr, objtRefr) {
        switch (strgCmmdGrup) {
          case "rec":
            $scope.popRecNew();
            break;
          case "nav":
            switch (strgCmmd) {
              case "appserv1":
                $state.go(strgRefr);
                break;
            }

            break;
        } /* CmdGrp Switch*/
      }; /*userAction*/
      $scope.popRecNew = function() {
        var myPopup = $ionicPopup.show({
          template:
            '<center><img width="100px" ng-src="{{temp.imageData}}" width="100px" ng-click="changePhoto()" /></center>' +
            '<p style="text-align:center;">{{temp.email}}</p>' +
            '<input type="file" class="inputFile" style="display:none"/>' +
            "<br/>" +
            '<input type = "text" ng-model = "temp.displayName" placeholder="Nama Paparan">' +
            '<input type = "text" ng-model = "temp.rid" placeholder="No KP">' +
            '<input type = "text" ng-model = "temp.mobileNo" placeholder="No Mobile">',
          title: "Pengguna",
          subTitle: "Info Ringkas",
          scope: $scope,
          buttons: [
            {
              text: "Cancel"
            },
            {
              text: "<b>Save</b>",
              type: "button-positive",
              onTap: function(e) {
                console.log(newScope);
                if (!newScope.temp.displayName) {
                  //don't allow the user to close unless he enters model...
                  e.preventDefault();
                } else {
                  return newScope.temp;
                }
              }
            }
          ]
        });
        myPopup.then(function(res) {
          console.log("Tapped!", res);
          if (res != undefined) {
            objUserInfo.$save();
            self.reloadUserInfo();
          }
        });
      };
    }
  ])

  .controller("ahliCtrl", [
    "$scope",
    "$stateParams",
    function($scope, $stateParams) {}
  ])

  .controller("penggunaCtrl", [
    "$scope",
    "$stateParams",
    function($scope, $stateParams) {}
  ])

  .controller("pageCtrl", [
    "$scope",
    "$stateParams", // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function($scope, $stateParams) {
      $scope.data = {
        dateValue: new Date()
      };

      var endOfYear = moment().endOf("year");

      if (moment().isBefore(endOfYear)) {
        console.log("The year isn't over");
      }

      var a = moment();
      var difference = moment.duration(endOfYear.diff(a));
      var days = difference.asDays();

      console.log(days);

      var ctr = 0;
      $scope.$watch("data.dateValue", function() {
        if (ctr > 0) {
          $scope.strDateValue = $scope.data.dateValue.getTime();
        }
        ctr++;
      });
    }
  ])

  .controller("kumpulanUsrahCtrl", [
    "$scope",
    "$rootScope",
    "$state",
    "$stateParams",
    "$ionicModal",
    "svcEzzi",
    "$firebaseAuth",
    "$ionicPopup" /*
wgrp_study level 0
*/,
    function(
      $scope,
      $rootScope,
      $state,
      $stateParams,
      $ionicModal,
      svcEzzi,
      $firebaseAuth,
      $ionicPopup
    ) {
      $scope.listMain = [];
      var initRecoEdit = function() {
        $scope.recoEdit = {
          hid: "",
          refr: "",
          desc: "",
          locn: "",
          estartdate: "",
          sstartdate: new Date()
        };
      };
      initRecoEdit();

      $scope.userAction = function(strgCmmdGrup, strgCmmd, strgRefr, objtRefr) {
        switch (strgCmmdGrup) {
          case "rec":
            switch (strgCmmd) {
              case "new":
                initRecoEdit();
                $scope.openModal();
                break;
              case "open":
                svcEzzi.upd_app_nav(
                  $rootScope.appl.nodes.wgrp_study,
                  0,
                  objtRefr
                );
                $state.go("pertemuanUsrah");
                break;
              case "edit":
                initRecoEdit();
                //console.log(objRef)
                $scope.openModal(objtRefr);
                break;
            }
            break;
          case "nav":
            switch (strgCmmd) {
              case "back":
                window.history.back();
                break;
            }
            break;
        } /* CmdGrp Switch*/
      }; /*userAction*/

      $scope.modal = $ionicModal.fromTemplate(
        '<ion-modal-view class="styled-container">' +
          '<ion-header-bar class="bar bar-header bar-dark">' +
          '<button class="button button-energized" ng-click="closeModal();">cancel</button>' +
          '<h1 class="title">Kumpulan</h1>' +
          "</ion-header-bar>" +
          '<ion-content  class="pad10px" >' +
          '<ion-item class="item-icon-left positive">' +
          '<i class="icon ion-bookmark"></i>Rujukan' +
          '<input ng-model="recoEdit.refr" type="text" style="width:220px">' +
          "</ion-item>" +
          '<ion-item class="item-icon-left positive">' +
          '<i class="icon ion-document-text"></i>Keterangan' +
          '<input ng-model="recoEdit.desc" type="text" style="width:220px">' +
          "</ion-item>" +
          '<ion-item class="item-icon-left positive">' +
          '<i class="icon ion-ios-location positive"></i>Lokasi' +
          '<input ng-model="recoEdit.locn" type="text" style="width:220px">' +
          "</ion-item>" +
          '<ion-item class="item-icon-left positive item">' +
          '<i class="icon ion-ios-calendar positive"></i>Masa' +
          '<div class="item" ion-datetime-picker="" date="" ng-model="recoEdit.sstartdate" style="padding-left: 0px;border-color: white;">' +
          '<span style="width:0px;display:inline-block;"></span>' +
          '<span><strong class="ng-binding">{{recoEdit.sstartdate| date: "yyyy-MM-dd"}}</strong></span>' +
          "</div>" +
          "</ion-item>" +
          "<br/>" +
          '<div class="button-bar">' +
          '<button class="button button-energized button-block" ng-click="closeModal();">CANCEL</button>' +
          '<button class="button button-assertive button-block" ng-click="processRecoEdit(&#39;del&#39;);">DELETE</button>' +
          '<button class="button button-balanced button-block" ng-click="processRecoEdit(&#39;save&#39;);">SAVE</button>' +
          "</div>" +
          '<p style="color:#d7dbde;">' +
          "+:{{recoEdit.estartdate}}<br/>" +
          '-:{{recoEdit.estartdate | date: "yyyy-MM-dd" }}' +
          "</p>" +
          "</ion-content>" +
          "</div>" +
          "</ion-modal-view>",
        {
          scope: $scope,
          animation: "slide-in-up"
        }
      );
      $scope.openModal = function(objtRefr) {
        //  console.log('objRef:', objRef)
        if (typeof objtRefr === "object") {
          console.log("objtRefr.estartdate:", objtRefr.estartdate);
          Object.keys($scope.recoEdit).forEach(function(key) {
            console.log("recoEdit:", key, $scope.recoEdit[key]);
            console.log("objtRefr:", key, objtRefr[key]);
            if (key == "sstartdate") {
              $scope.recoEdit.sstartdate =
                new Date(Number(objtRefr["estartdate"])) || new Date();
            } else {
              $scope.recoEdit[key] = objtRefr[key] || "";
            }
          });
        }
        $scope.modal.show();
      };
      $scope.closeModal = function() {
        $scope.modal.hide();
      };

      //Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function() {
        $scope.modal.remove();
      });

      // Execute action on hide modal
      $scope.$on("modal.hidden", function() {
        // Execute action
      });

      // Execute action on remove modal
      $scope.$on("modal.removed", function() {
        // Execute action
      });

      $scope.processRecoEdit = function(strgCmmd) {
        //alert(strCmd);
        //$scope.modal.hide();
        if ($rootScope.appl.demo == true) {
          //alert('feature disabled for demo user')
          $ionicPopup.alert({
            title: "Error",
            template: "Fungsi disekat untuk pengguna Demo."
          });
          return;
        }
        if (strgCmmd == "del") {
          var confirmPopup = $ionicPopup.confirm({
            title: "DELETE",
            template: "Anda Pasti?",
            cssClass: "popupCustom"
          });
          confirmPopup.then(function(resl) {
            if (resl) {
              var subdata = {
                wgrp_hid: $scope.recoEdit.hid
              };
              $scope.rqsWgrp("del_wgrp", subdata);
              $scope.modal.hide();
            } else {
              console.log("Cancel sign Out");
              $scope.modal.hide();
            }
          });
        } else {
          $scope.modal.hide();
          if ($scope.recoEdit.hid != "") {
            var wgrp = {
              refr: $scope.recoEdit.refr,
              desc: $scope.recoEdit.desc,
              locn: $scope.recoEdit.locn,
              estartdate: $scope.recoEdit.estartdate
            };
            var subdata = {
              wgrp: wgrp,
              modr_hid: $rootScope.appl.user_pfle.hid,
              wgrp_hid: $scope.recoEdit.hid
            };
            $scope.rqsWgrp("upd_wgrp", subdata);
          } else {
            var wgrp = {
              refr: $scope.recoEdit.refr,
              desc: $scope.recoEdit.desc,
              locn: $scope.recoEdit.locn,
              estartdate: $scope.recoEdit.estartdate
            };
            var subdata = {
              wgrp: wgrp,
              modr_hid: $rootScope.appl.user_pfle.email
            };
            console.log(subdata);
            $scope.rqsWgrp("add_wgrp_add_modr", subdata);
          }
        }
      };

      $scope.rqsWgrp = function(strgCmmd, objtRefr) {
        //console.log (JSON.stringify($rootScope.user.webProfile));
        $firebaseAuth().$onAuthStateChanged(function(objAuthUser) {
          var param = {
            cmmd: strgCmmd,
            token: objAuthUser.qa,
            subdata: objtRefr
          };
          svcEzzi.get("Wgrp", param).then(function(resp) {
            console.log("cmmd:", resp);
            $scope.loadWgrp();
          });
        });
      };

      $scope.addWgrpAddModr = function(recoEdit) {
        //console.log (JSON.stringify($rootScope.user.webProfile));
        var wgrp = {
          refr: recoEdit.refr,
          desc: recoEdit.desc,
          locn: recoEdit.locn,
          estartdate: recoEdit.estartdate
        };

        var subdata = {
          wgrp: wgrp,
          modr_hid: $rootScope.appl.user_pfle.hid
        };
        $firebaseAuth().$onAuthStateChanged(function(objAuthUser) {
          var param = {
            cmmd: "add_wgrp_add_modr",
            token: objAuthUser.qa,
            subdata: subdata
          };
          svcEzzi.get("Wgrp", param).then(function(response) {
            console.log("add_wgrp_add_modr:", response);
            $scope.loadWgrp();
          });
        });
      };

      $scope.loadWgrp = function() {
        $firebaseAuth().$onAuthStateChanged(function(objAuthUser) {
          var param = {
            cmmd: "get_modr_wgrp",
            token: objAuthUser.qa,
            subdata: "1"
          };
          svcEzzi.get("Wgrp", param).then(function(response) {
            console.log("get_wgrp:", response);
            $scope.listMain = response;
          });
        });
      };

      $scope.$on("$ionicView.enter", function() {
        //$scope.loadWebUserProfile();
        $scope.loadWgrp();
        console.log("nodelevel0:", $rootScope.appl);
        console.log(
          "nodelevel0 is empty object?:",
          angular.equals($rootScope.appl.nodes.wgrp_study["0"], {})
        );
      });

      $scope.$watch("recoEdit.sstartdate", function() {
        // if (typeof $scope.recoEdit.sstartdate === "undefined") return;
        $scope.recoEdit.estartdate = $scope.recoEdit.sstartdate.getTime();
      });
    }
  ])

  .controller("pertemuanUsrahCtrl", [
    "$scope",
    "$rootScope",
    "$state",
    "$stateParams",
    "$ionicModal",
    "svcEzzi",
    "$firebaseAuth",
    "$ionicPopup",
    "$q" /*
wgrp_study level 1
*/,
    function(
      $scope,
      $rootScope,
      $state,
      $stateParams,
      $ionicModal,
      svcEzzi,
      $firebaseAuth,
      $ionicPopup,
      $q
    ) {
      $scope.listMain = [];
      var initRecoEdit = function() {
        $scope.recoEdit = {
          hid: "",
          refr: "",
          desc: "",
          locn: "",
          estartdate: "",
          sstartdate: new Date()
        };
      };
      initRecoEdit();

      $scope.userAction = function(strgCmmdGrup, strgCmmd, strgRefr, objtRefr) {
        switch (strgCmmdGrup) {
          case "rec":
            switch (strgCmmd) {
              case "new":
                initRecoEdit();
                $scope.openModal();
                break;
              case "open":
                svcEzzi.upd_app_nav(
                  $rootScope.appl.nodes.wgrp_study,
                  1,
                  objtRefr
                );
                $state.go("topikPerbincangan");
                break;
              case "edit":
                initRecoEdit();
                $scope.openModal(objtRefr);
                break;
            }
            break;
          case "nav":
            switch (strgCmmd) {
              case "back":
                svcEzzi.upd_app_nav($rootScope.appl.nodes.wgrp_study, 0, {});
                window.history.back();
                break;
            }
            break;
        } /* CmmdGrup Switch*/
      }; /*userAction*/

      $scope.modal = $ionicModal.fromTemplate(
        '<ion-modal-view class="styled-container">' +
          '<ion-header-bar class="bar bar-header bar-dark">' +
          '<button class="button button-energized" ng-click="closeModal();">cancel</button>' +
          '<h1 class="title">Pertemuan</h1>' +
          "</ion-header-bar>" +
          '<ion-content  class="pad10px" >' +
          '<ion-item class="item-icon-left positive">' +
          '<i class="icon ion-bookmark"></i>Rujukan' +
          '<input ng-model="recoEdit.refr" type="text" style="width:220px">' +
          "</ion-item>" +
          '<ion-item class="item-icon-left positive">' +
          '<i class="icon ion-document-text"></i>Keterangan' +
          '<input ng-model="recoEdit.desc" type="text" style="width:220px">' +
          "</ion-item>" +
          '<ion-item class="item-icon-left positive">' +
          '<i class="icon ion-ios-location positive"></i>Lokasi' +
          '<input ng-model="recoEdit.locn" type="text" style="width:220px">' +
          "</ion-item>" +
          '<ion-item class="item-icon-left positive item">' +
          '<i class="icon ion-ios-calendar positive"></i>Masa' +
          '<div class="item" ion-datetime-picker="" date="" ng-model="recoEdit.sstartdate" style="padding-left: 0px;border-color: white;">' +
          '<span style="width:0px;display:inline-block;"></span>' +
          '<span><strong class="ng-binding">{{recoEdit.sstartdate| date: "yyyy-MM-dd"}}</strong></span>' +
          "</div>" +
          "</ion-item>" +
          "<br/>" +
          '<div class="button-bar">' +
          '<button class="button button-energized button-block" ng-click="closeModal();">CANCEL</button>' +
          '<button class="button button-assertive button-block" ng-click="processRecoEdit(&#39;del&#39;);">DELETE</button>' +
          '<button class="button button-balanced button-block" ng-click="processRecoEdit(&#39;save&#39;);">SAVE</button>' +
          "</div>" +
          '<p style="color:#d7dbde;">' +
          "+:{{recoEdit.estartdate}}<br/>" +
          '-:{{ recoEdit.estartdate | date: "yyyy-MM-dd" }}' +
          "</p>" +
          "</ion-content>" +
          "</div>" +
          "</ion-modal-view>",
        {
          scope: $scope,
          animation: "slide-in-up"
        }
      );

      $scope.openModal = function(objtRefr) {
        if (typeof objtRefr === "object") {
          console.log("objtRefr.estartdate:", objtRefr.estartdate);
          Object.keys($scope.recoEdit).forEach(function(key) {
            console.log("recoEdit:", key, $scope.recoEdit[key]);
            console.log("objtRefr:", key, objtRefr[key]);
            if (key == "sstartdate") {
              $scope.recoEdit.sstartdate = new Date(
                Number(objtRefr["estartdate"])
              );
            } else {
              $scope.recoEdit[key] = objtRefr[key] || "";
            }
          });
        }
        $scope.modal.show();
      };

      $scope.closeModal = function() {
        $scope.modal.hide();
      };
      //Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function() {
        $scope.modal.remove();
      });
      // Execute action on hide modal
      $scope.$on("modal.hidden", function() {
        // Execute action
      });
      // Execute action on remove modal
      $scope.$on("modal.removed", function() {
        // Execute action
      });
      $scope.processRecoEdit = function(strgCmmd) {
        if ($rootScope.appl.demo == true) {
          //alert('feature disabled for demo user')
          $ionicPopup.alert({
            title: "Error",
            template: "Fungsi disekat untuk pengguna Demo."
          });
          return;
        }
        if (strgCmmd == "del") {
          var confirmPopup = $ionicPopup.confirm({
            title: "DELETE",
            template: "Anda Pasti?",
            cssClass: "popupCustom"
          });
          confirmPopup.then(function(res) {
            if (res) {
              var subdata = {
                objt_param: {
                  hid: $scope.recoEdit.hid
                }
              };
              reqs_serv("del_study_topic", subdata).then(function(resp) {
                load_listMain();
              });
              $scope.modal.hide();
            } else {
              console.log("Cancel sign Out");
              $scope.modal.hide();
            }
          });
        } else {
          $scope.modal.hide();
          if ($scope.recoEdit.hid != "") {
            //upd
            var wgrp = {
              refr: $scope.recoEdit.refr,
              desc: $scope.recoEdit.desc,
              locn: $scope.recoEdit.locn,
              estartdate: $scope.recoEdit.estartdate
            };
            var subdata = {
              reco: wgrp,
              hid: $scope.recoEdit.hid
            };
            reqs_serv("upd_wgrp_study", subdata).then(function(resp) {
              load_listMain();
            });
          } else {
            //new
            var reco = {
              refr: $scope.recoEdit.refr,
              desc: $scope.recoEdit.desc,
              locn: $scope.recoEdit.locn,
              estartdate: $scope.recoEdit.estartdate
            };
            var subdata = {
              reco: reco,
              phid: $rootScope.appl.nodes.wgrp_study["0"]["hid"]
            };
            reqs_serv("add_wgrp_study", subdata).then(function(resp) {
              load_listMain();
            });
          }
        }
      };

      var reqs_serv = function(strgCmmd, objtRefr) {
        var deferred = $q.defer();
        $firebaseAuth().$onAuthStateChanged(function(objAuthUser) {
          var param = {
            cmmd: strgCmmd,
            token: objAuthUser.qa,
            subdata: objtRefr
          };
          svcEzzi.get("Wgrp", param).then(function(response) {
            console.log("cmmd:", response);
            //$scope.loadWgrp();
            //return response;
            deferred.resolve(response);
          });
        });
        return deferred.promise;
      };

      var load_listMain = function() {
        objt_refr = {
          objt_param: {
            phid: $rootScope.appl.nodes.wgrp_study["0"]["hid"]
          }
        };
        reqs_serv("get_wgrp_study", objt_refr).then(function(resp) {
          console.log("get_wgrp_study resp", resp);
          $scope.listMain = resp;
        });
      };

      $scope.$on("$ionicView.enter", function() {
        console.log("nodes:", $rootScope.appl.nodes);
        console.log(
          "node.wgrp_study_0.hid:",
          $rootScope.appl.nodes.wgrp_study["0"]["hid"]
        );
        load_listMain();
        console.log(
          "node.level1 is empty object?:",
          angular.equals($rootScope.appl.nodes.wgrp_study["1"], {})
        );
      });
      $scope.$watch("recoEdit.sstartdate", function() {
        // if (typeof $scope.recEdit.sstartdate === "undefined") return;
        $scope.recoEdit.estartdate = $scope.recoEdit.sstartdate.getTime();
      });
    }
  ])

  .controller("topikPerbincanganCtrl", [
    "$scope",
    "$rootScope",
    "$state",
    "$stateParams",
    "$ionicModal",
    "svcEzzi",
    "$firebaseAuth",
    "$ionicPopup",
    "$q" /*
wgrp_study level 2
*/,
    function(
      $scope,
      $rootScope,
      $state,
      $stateParams,
      $ionicModal,
      svcEzzi,
      $firebaseAuth,
      $ionicPopup,
      $q
    ) {
      $scope.listMain = [];
      $scope.listPresetTopic = [];
      var initRecoEdit = function() {
        $scope.recoEdit = {
          hid: "",
          refr: "",
          desc: "",
          topic: "",
          locn: "",
          estartdate: "",
          sstartdate: new Date()
        };
      };
      initRecoEdit();

      var findInArray = function(arry, prop, value) {
        return arry.find(function(a, index) {
          if (a[prop] == value) return a;
        });
      };

      $scope.userAction = function(strgCmmdGrup, strgCmmd, strgRefr, objtRefr) {
        switch (strgCmmdGrup) {
          case "rec":
            switch (strgCmmd) {
              case "new":
                initRecoEdit();
                $scope.openModal();
                break;
              case "open":
                console.log($scope.listPresetTopic);
                $rootScope.appl.nodes.wgrp_study.preset.topic = findInArray(
                  $scope.listPresetTopic,
                  "desc",
                  objtRefr.topic
                ).hid;
                svcEzzi.upd_app_nav(
                  $rootScope.appl.nodes.wgrp_study,
                  2,
                  objtRefr
                );
                $state.go("subtopikPerbincangan");
                break;
              case "edit":
                initRecoEdit();
                //console.log(objRef)
                $scope.openModal(objtRefr);
                break;
            }
            break;
          case "nav":
            /* menu nav is handled by detectMenuAndApplyPageGuard()*/
            switch (strgCmmd) {
              case "back":
                svcEzzi.upd_app_nav($rootScope.appl.nodes.wgrp_study, 1, {});
                window.history.back();
                break;
            }
            break;
        } /* CmdGrp Switch*/
      }; /*userAction*/

      $scope.showPopup = function() {
        $scope.selectTopic = function(objtTopic) {
          $scope.recoEdit.topic = objtTopic.desc;
          myPopup.close();
        };

        // Custom popup
        var myPopup = $ionicPopup.show({
          template:
            '<button ng-repeat="item in listPresetTopic" class="button button-stable button-block" ng-click="selectTopic(item)">{{item.desc}}</button>',
          title: "Topik",
          subTitle: "pilih...",
          scope: $scope,

          buttons: [
            {
              text: "Cancel",
              type: "button-energized"
            }
          ]
        });

        myPopup.then(function(res) {
          console.log("Tapped!", res);
        });
      };

      $scope.modal = $ionicModal.fromTemplate(
        '<ion-modal-view class="styled-container">' +
          '<ion-header-bar class="bar bar-header bar-dark">' +
          '<button class="button button-energized" ng-click="closeModal();">cancel</button>' +
          '<h1 class="title">Topik</h1>' +
          "</ion-header-bar>" +
          '<ion-content  class="pad10px" >' +
          '<ion-item class="item-icon-left positive">' +
          '<i class="icon ion-bookmark"></i>Rujukan' +
          '<input ng-model="recoEdit.refr" type="text" style="width:220px">' +
          "</ion-item>" +
          '<ion-item class="item-icon-left positive">' +
          '<i class="icon ion-document-text"></i>Keterangan' +
          '<input ng-model="recoEdit.desc" type="text" style="width:220px">' +
          "</ion-item>" +
          '<ion-item class="item-icon-left  item-icon-right positive">' +
          '<i class="icon ion-pricetag"></i>Topik' +
          '<input ng-model="recoEdit.topic" type="text" style="width:220px;background-color:khaki;">' +
          '<i class="icon ion-search" ng-click="showPopup();"></i>' +
          "</ion-item>" +
          '<ion-item class="item-icon-left positive">' +
          '<i class="icon ion-ios-location positive"></i>Lokasi' +
          '<input ng-model="recoEdit.locn" type="text" style="width:220px">' +
          "</ion-item>" +
          '<ion-item class="item-icon-left positive item">' +
          '<i class="icon ion-ios-calendar positive"></i>Masa' +
          '<div class="item" ion-datetime-picker="" date="" ng-model="recoEdit.sstartdate" style="padding-left: 0px;border-color: white;">' +
          '<span style="width:0px;display:inline-block;"></span>' +
          '<span><strong class="ng-binding">{{recoEdit.sstartdate| date: "yyyy-MM-dd"}}</strong></span>' +
          "</div>" +
          "</ion-item>" +
          "<br/>" +
          '<div class="button-bar">' +
          '<button class="button button-energized button-block" ng-click="closeModal();">CANCEL</button>' +
          '<button class="button button-assertive button-block" ng-click="processRecoEdit(&#39;del&#39;);">DELETE</button>' +
          '<button class="button button-balanced button-block" ng-click="processRecoEdit(&#39;save&#39;);">SAVE</button>' +
          "</div>" +
          '<p style="color:#d7dbde;">' +
          "+:{{recoEdit.estartdate}}<br/>" +
          '-:{{ recoEdit.estartdate | date: "yyyy-MM-dd" }}' +
          "</p>" +
          "</ion-content>" +
          "</div>" +
          "</ion-modal-view>",
        {
          scope: $scope,
          animation: "slide-in-up"
        }
      );

      $scope.openModal = function(objtRefr) {
        //console.log('objRef:', objRef)
        if (typeof objtRefr === "object") {
          console.log("objtRefr.estartdate:", objtRefr.estartdate);
          Object.keys($scope.recoEdit).forEach(function(key) {
            console.log("recoEdit:", key, $scope.recoEdit[key]);
            console.log("objtRefr:", key, objtRefr[key]);
            if (key == "sstartdate") {
              $scope.recoEdit.sstartdate = new Date(
                Number(objtRefr["estartdate"])
              );
            } else {
              $scope.recoEdit[key] = objtRefr[key] || "";
            }
          });
        }
        $scope.modal.show();
      };
      $scope.closeModal = function() {
        $scope.modal.hide();
      };

      //Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function() {
        $scope.modal.remove();
      });
      // Execute action on hide modal
      $scope.$on("modal.hidden", function() {
        // Execute action
      });
      // Execute action on remove modal
      $scope.$on("modal.removed", function() {
        // Execute action
      });
      $scope.processRecoEdit = function(strgCmmd) {
        //alert(strCmd);
        //$scope.modal.hide();
        if ($rootScope.appl.demo == true) {
          //alert('feature disabled for demo user')
          $ionicPopup.alert({
            title: "Error",
            template: "Fungsi disekat untuk pengguna Demo."
          });
          return;
        }
        if (strgCmmd == "del") {
          var confirmPopup = $ionicPopup.confirm({
            title: "DELETE",
            template: "Anda Pasti?",
            cssClass: "popupCustom"
          });
          confirmPopup.then(function(res) {
            if (res) {
              var subdata = {
                objt_param: {
                  hid: $scope.recEdit.hid
                }
              };
              reqs_serv("del_topic_subtopic", subdata).then(function(resp) {
                load_listMain();
              });
              $scope.modal.hide();
            } else {
              console.log("Cancel sign Out");
              $scope.modal.hide();
            }
          });
        } else {
          $scope.modal.hide();
          if ($scope.recoEdit.hid != "") {
            //upd
            var wgrp = {
              refr: $scope.recoEdit.refr,
              desc: $scope.recoEdit.desc,
              topic: $scope.recoEdit.topic,
              locn: $scope.recoEdit.locn,
              estartdate: $scope.recoEdit.estartdate
            };
            var subdata = {
              reco: wgrp,
              hid: $scope.recoEdit.hid
            };
            reqs_serv("upd_wgrp_study_topic", subdata).then(function(resp) {
              load_listMain();
            });
          } else {
            //new
            var reco = {
              refr: $scope.recoEdit.refr,
              desc: $scope.recoEdit.desc,
              topic: $scope.recoEdit.topic,
              locn: $scope.recoEdit.locn,
              estartdate: $scope.recoEdit.estartdate
            };
            var subdata = {
              reco: reco,
              phid: $rootScope.appl.nodes.wgrp_study["1"]["hid"]
            };
            reqs_serv("add_wgrp_study_topic", subdata).then(function(resp) {
              load_listMain();
            });
          }
        }
      };

      var reqs_serv = function(strgCmmd, objtRefr) {
        var deferred = $q.defer();

        $firebaseAuth().$onAuthStateChanged(function(objAuthUser) {
          var param = {
            cmmd: strgCmmd,
            token: objAuthUser.qa,
            subdata: objtRefr
          };
          svcEzzi.get("Wgrp", param).then(function(response) {
            console.log("cmmd:", response);
            //$scope.loadWgrp();
            //return response;
            deferred.resolve(response);
          });
        });
        return deferred.promise;
      };
      var load_listMain = function() {
        objt_refr = {
          objt_param: {
            phid: $rootScope.appl.nodes.wgrp_study["1"]["hid"]
          }
        };
        reqs_serv("get_wgrp_study_topic", objt_refr).then(function(resp) {
          console.log("get_wgrp_study_topic:", resp);
          $scope.listMain = resp;
          load_listPresetTopic();
        });
      };
      var load_listPresetTopic = function() {
        objt_refr = {
          objt_param: {}
        };
        reqs_serv("get_study_preset_topic", objt_refr).then(function(resp) {
          console.log("get_study_preset_topic resp", resp);
          $scope.listPresetTopic = resp;
        });
      };

      $scope.$on("$ionicView.enter", function() {
        console.log("nodes:", $rootScope.appl.nodes);
        console.log(
          "node.wgrp_study_1.hid:",
          $rootScope.appl.nodes.wgrp_study["1"]["hid"]
        );
        load_listMain();
        console.log(
          "node.level2 is empty object?:",
          angular.equals($rootScope.appl.nodes.wgrp_study["2"], {})
        );
      });

      $scope.$watch("recoEdit.sstartdate", function() {
        // if (typeof $scope.recEdit.sstartdate === "undefined") return;
        $scope.recoEdit.estartdate = $scope.recoEdit.sstartdate.getTime();
      });
    }
  ])

  .controller("subtopikPerbincanganCtrl", [
    "$scope",
    "$rootScope",
    "$state",
    "$stateParams",
    "$ionicModal",
    "svcEzzi",
    "$firebaseAuth",
    "$ionicPopup",
    "$q" /*
wgrp_study level 2
*/,
    function(
      $scope,
      $rootScope,
      $state,
      $stateParams,
      $ionicModal,
      svcEzzi,
      $firebaseAuth,
      $ionicPopup,
      $q
    ) {
      $scope.listMain = [];
      $scope.listPresetSubtopic = [];
      var initRecoEdit = function() {
        $scope.recoEdit = {
          hid: "",
          refr: "",
          desc: "",
          subtopic: "",
          locn: "",
          estartdate: "",
          sstartdate: new Date()
        };
      };
      initRecoEdit();

      $scope.userAction = function(strgCmmdGrup, strgCmmd, strgRefr, objtRefr) {
        switch (strgCmmdGrup) {
          case "rec":
            switch (strgCmmd) {
              case "new":
                $scope.openModal();
                break;
              case "open":
                break;
              case "edit":
                console.log(objtRefr);
                $scope.openModal(objtRefr);
                break;
            }
            break;
          case "nav":
            /* menu nav is handled by detectMenuAndApplyPageGuard()*/
            switch (strgCmmd) {
              case "back":
                svcEzzi.upd_app_nav($rootScope.appl.nodes.wgrp_study, 2, {});
                window.history.back();
                break;
            }
            break;
        } /* CmdGrp Switch*/
      }; /*userAction*/

      $scope.showPopup = function() {
        $scope.selectSubtopic = function(objtSubtopic) {
          $scope.recoEdit.subtopic = objtSubtopic.desc;
          myPopup.close();
        };

        // Custom popup
        var myPopup = $ionicPopup.show({
          template:
            '<button ng-repeat="item in listPresetSubtopic" class="button button-stable button-block" ng-click="selectSubtopic(item)">{{item.desc}}</button>',

          title: "Suptopik",
          subTitle: "pilih...",
          scope: $scope,

          buttons: [{ text: "Cancel", type: "button-energized" }]
        });

        myPopup.then(function(res) {
          console.log("Tapped!", res);
        });
      };

      $scope.modal = $ionicModal.fromTemplate(
        '<ion-modal-view class="styled-container">' +
          '<ion-header-bar class="bar bar-header bar-dark">' +
          '<button class="button button-energized" ng-click="closeModal();">cancel</button>' +
          '<h1 class="title">Topik</h1>' +
          "</ion-header-bar>" +
          '<ion-content  class="pad10px" >' +
          '<ion-item class="item-icon-left positive">' +
          '<i class="icon ion-bookmark"></i>Rujukan' +
          '<input ng-model="recoEdit.refr" type="text" style="width:220px">' +
          "</ion-item>" +
          '<ion-item class="item-icon-left positive">' +
          '<i class="icon ion-document-text"></i>Keterangan' +
          '<input ng-model="recoEdit.desc" type="text" style="width:220px">' +
          "</ion-item>" +
          '<ion-item class="item-icon-left  item-icon-right positive">' +
          '<i class="icon ion-pricetags"></i>Subtopik' +
          '<input ng-model="recoEdit.subtopic" type="text" style="width:220px;background-color:khaki;">' +
          '<i class="icon ion-search" ng-click="showPopup();"></i>' +
          "</ion-item>" +
          '<ion-item class="item-icon-left positive">' +
          '<i class="icon ion-ios-location positive"></i>Lokasi' +
          '<input ng-model="recoEdit.locn" type="text" style="width:220px">' +
          "</ion-item>" +
          '<ion-item class="item-icon-left positive item">' +
          '<i class="icon ion-ios-calendar positive"></i>Masa' +
          '<div class="item" ion-datetime-picker="" date="" ng-model="recoEdit.sstartdate" style="padding-left: 0px;border-color: white;">' +
          '<span style="width:0px;display:inline-block;"></span>' +
          '<span><strong class="ng-binding">{{recoEdit.sstartdate| date: "yyyy-MM-dd"}}</strong></span>' +
          "</div>" +
          "</ion-item>" +
          "<br/>" +
          '<div class="button-bar">' +
          '<button class="button button-energized button-block" ng-click="closeModal();">CANCEL</button>' +
          '<button class="button button-assertive button-block" ng-click="processRecoEdit(&#39;del&#39;);">DELETE</button>' +
          '<button class="button button-balanced button-block" ng-click="processRecoEdit(&#39;save&#39;);">SAVE</button>' +
          "</div>" +
          '<p style="color:#d7dbde;">' +
          "+:{{recoEdit.estartdate}}<br/>" +
          '-:{{ recoEdit.estartdate | date: "yyyy-MM-dd" }}' +
          "</p>" +
          "</ion-content>" +
          "</div>" +
          "</ion-modal-view>",
        {
          scope: $scope,
          animation: "slide-in-up"
        }
      );

      $scope.openModal = function(objtRefr) {
        console.log("objtRefr:", objtRefr);

        if (typeof objtRefr === "object") {
          console.log("objtRef.estartdate:", objtRefr.estartdate);

          Object.keys($scope.recoEdit).forEach(function(key) {
            console.log("recoEdit:", key, $scope.recoEdit[key]);
            console.log("objtRefr:", key, objtRefr[key]);
            if (key == "sstartdate") {
              $scope.recoEdit.sstartdate = new Date(
                Number(objtRefr["estartdate"])
              );
            } else {
              $scope.recoEdit[key] = objtRefr[key] || "";
            }
          });
        }
        $scope.modal.show();
      };

      $scope.closeModal = function() {
        $scope.modal.hide();
      };

      //Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function() {
        $scope.modal.remove();
      });
      // Execute action on hide modal
      $scope.$on("modal.hidden", function() {
        // Execute action
      });
      // Execute action on remove modal
      $scope.$on("modal.removed", function() {
        // Execute action
      });

      $scope.processRecoEdit = function(strgCmmd) {
        if ($rootScope.appl.demo == true) {
          //alert('feature disabled for demo user')
          $ionicPopup.alert({
            title: "Error",
            template: "Fungsi disekat untuk pengguna Demo."
          });
          return;
        }
        if (strgCmmd == "del") {
          var confirmPopup = $ionicPopup.confirm({
            title: "DELETE",
            template: "Anda Pasti?",
            cssClass: "popupCustom"
          });
          confirmPopup.then(function(res) {
            if (res) {
              var subdata = {
                objt_param: { hid: $scope.recoEdit.hid }
              };
              reqs_serv("del_topic_subtopic", subdata).then(function(resp) {
                load_listMain();
              });
              $scope.modal.hide();
            } else {
              console.log("Cancel sign Out");
              $scope.modal.hide();
            }
          });
        } else {
          $scope.modal.hide();
          if ($scope.recoEdit.hid != "") {
            //upd
            var wgrp = {
              refr: $scope.recoEdit.refr,
              desc: $scope.recoEdit.desc,
              subtopic: $scope.recoEdit.subtopic,
              locn: $scope.recoEdit.locn,
              estartdate: $scope.recoEdit.estartdate
            };
            var subdata = {
              reco: wgrp,
              hid: $scope.recoEdit.hid
            };
            reqs_serv("upd_wgrp_study_topic_subtopic", subdata).then(function(
              resp
            ) {
              load_listMain();
            });
          } else {
            //new
            var reco = {
              refr: $scope.recoEdit.refr,
              desc: $scope.recoEdit.desc,
              subtopic: $scope.recoEdit.subtopic,
              locn: $scope.recoEdit.locn,
              estartdate: $scope.recoEdit.estartdate
            };
            var subdata = {
              reco: reco,
              phid: $rootScope.appl.nodes.wgrp_study["1"]["hid"]
            };
            reqs_serv("add_wgrp_study_topic_subtopic", subdata).then(function(
              resp
            ) {
              load_listMain();
            });
          }
        }
      };

      var reqs_serv = function(strgCmmd, objtRefr) {
        var deferred = $q.defer();
        $firebaseAuth().$onAuthStateChanged(function(objAuthUser) {
          var param = {
            cmmd: strgCmmd,
            token: objAuthUser.qa,
            subdata: objtRefr
          };
          svcEzzi.get("Wgrp", param).then(function(response) {
            console.log("cmmd:", response);
            deferred.resolve(response);
          });
        });
        return deferred.promise;
      };
      var load_listMain = function() {
        objt_refr = {
          objt_param: { phid: $rootScope.appl.nodes.wgrp_study["2"]["hid"] }
        };
        reqs_serv("get_wgrp_study_topic_subtopic", objt_refr).then(function(
          resp
        ) {
          console.log("get_wgrp_study resp", resp);
          $scope.listMain = resp;
          objt_topic_refr = {
            objt_param: { phid: $rootScope.appl.nodes.wgrp_study.preset.topic }
          };
          console.log(objt_topic_refr);
          reqs_serv("get_study_preset_subtopic", objt_topic_refr).then(function(
            resp
          ) {
            $scope.listPresetSubtopic = resp;
          });
        });
      };
      $scope.$on("$ionicView.enter", function() {
        console.log("nodes:", $rootScope.appl.nodes);
        console.log(
          "node.wgrp_study_1.hid:",
          $rootScope.appl.nodes.wgrp_study["1"]["hid"]
        );
        load_listMain();
        console.log(
          "node.level2 is empty object?:",
          angular.equals($rootScope.appl.nodes.wgrp_study["2"], {})
        );
      });

      $scope.$watch("recoEdit.sstartdate", function() {
        // if (typeof $scope.recoEdit.sstartdate === "undefined") return;
        $scope.recoEdit.estartdate = $scope.recoEdit.sstartdate.getTime();
      });
    }
  ])

  .controller("presetTopikCtrl", [
    "$scope",
    "$rootScope",
    "$state",
    "$stateParams",
    "$ionicPopup",
    "$q",
    "$firebaseAuth",
    "svcEzzi", // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function(
      $scope,
      $rootScope,
      $state,
      $stateParams,
      $ionicPopup,
      $q,
      $firebaseAuth,
      svcEzzi
    ) {
      var initRecoEdit = function() {
        $scope.recoEdit = {
          phid: "",
          hid: "",
          refr: "",
          desc: ""
        };
      };
      initRecoEdit();

      $scope.userAction = function(strgCmmdGrup, strgCmmd, strgRefr, objtRefr) {
        switch (strgCmmdGrup) {
          case "rec":
            switch (strgCmmd) {
              case "new":
                initRecoEdit();
                $scope.showPopup();
                break;
              case "open":
                $rootScope.appl.nodes.wgrp_study.preset.topic = objtRefr;
                $state.go("presetSubtopik");
                break;
              case "edit":
                initRecoEdit();
                console.log(objtRefr);
                $scope.showPopup(objtRefr);
                break;
            }
            break;
          case "nav":
            /* menu nav is handled by detectMenuAndApplyPageGuard()*/
            switch (strgCmmd) {
              case "back":
                window.history.back();
                break;
            }

            break;
        } /* CmdGrp Switch*/
      }; /*userAction*/

      $scope.showPopup = function(objtRefr) {
        if (objtRefr) {
          $scope.recoEdit = {
            hid: objtRefr.hid,
            refr: objtRefr.refr,
            desc: objtRefr.desc
          };
        }
        // Custom popup
        var myPopup = $ionicPopup.show({
          template: '<input type = "text" ng-model = "recoEdit.desc">',
          title: "Topik",
          subTitle: "Edit Topik",
          scope: $scope,

          buttons: [
            {
              text: "Cancel",
              type: "button-energized button-small"
            },
            {
              text: "Del",
              type: "button-assertive button-small",
              onTap: function(e) {
                if (!$scope.recoEdit.desc) {
                  //don't allow the user to close unless he enters model...
                  e.preventDefault();
                } else {
                  return "del";
                }
              }
            },
            {
              text: "OK",
              type: "button-balanced button-small",
              onTap: function(e) {
                if (!$scope.recoEdit.desc) {
                  //don't allow the user to close unless he enters model...
                  e.preventDefault();
                } else {
                  return $scope.recoEdit.desc;
                }
              }
            }
          ]
        });

        myPopup.then(function(res) {
          console.log("Tapped!", res);
          if (res != undefined) $scope.processRecoEdit(res);
        });
      };

      $scope.processRecoEdit = function(strgCmmd) {
        console.log(strgCmmd);
        console.log($scope.recoEdit);
        if ($rootScope.appl.demo == true) {
          //alert('feature disabled for demo user')
          $ionicPopup.alert({
            title: "Error",
            template: "Fungsi disekat untuk pengguna Demo."
          });
          return;
        }
        if (strgCmmd == "del") {
          var confirmPopup = $ionicPopup.confirm({
            title: "DELETE",
            template: "Anda Pasti?",
            cssClass: "popupCustom"
          });
          confirmPopup.then(function(res) {
            if (res) {
              var subdata = {
                reco: {
                  hid: $scope.recoEdit.hid
                }
              };
              //reqs_serv('del_wgrp_study_topic',subdata).then(function(resp){load_recs()}) ;
              reqs_serv("del_study_preset_topic", subdata).then(function(resp) {
                load_listMain();
              });
            } else {
              console.log("Cancel sign Out");
            }
          });
        } else {
          if ($scope.recoEdit.hid != "") {
            //upd
            var wgrp = {
              refr: $scope.recoEdit.refr,
              desc: $scope.recoEdit.desc,
              topic: $scope.recoEdit.topic
            };
            var subdata = {
              reco: wgrp,
              hid: $scope.recoEdit.hid
            };
            reqs_serv("upd_study_preset_topic", subdata).then(function(resp) {
              load_listMain();
            });
          } else {
            //new
            var reco = {
              refr: $scope.recoEdit.refr,
              desc: $scope.recoEdit.desc
            };
            var subdata = {
              reco: reco
            };
            reqs_serv("add_study_preset_topic", subdata).then(function(resp) {
              load_listMain();
            });
          }
        }
      };

      var reqs_serv = function(strgCmmd, objtRefr) {
        var deferred = $q.defer();
        $firebaseAuth().$onAuthStateChanged(function(objAuthUser) {
          var param = {
            cmmd: strgCmmd,
            token: objAuthUser.qa,
            subdata: objtRefr
          };
          svcEzzi.get("Wgrp", param).then(function(response) {
            console.log("cmmd:", response);
            deferred.resolve(response);
          });
        });
        return deferred.promise;
      };
      var load_listMain = function() {
        objt_refr = {
          objt_param: {}
        };
        reqs_serv("get_study_preset_topic", objt_refr).then(function(resp) {
          console.log("get_study_preset_topic resp", resp);
          $scope.listMain = resp;
        });
      };

      $scope.$on("$ionicView.enter", function() {
        console.log(
          "node.wgrp_study.reset:",
          $rootScope.appl.nodes.wgrp_study.preset
        );
        load_listMain();
      });
    }
  ])

  .controller("presetSubtopikCtrl", [
    "$scope",
    "$rootScope",
    "$state",
    "$stateParams",
    "$ionicPopup",
    "$q",
    "$firebaseAuth",
    "svcEzzi", // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function(
      $scope,
      $rootScope,
      $state,
      $stateParams,
      $ionicPopup,
      $q,
      $firebaseAuth,
      svcEzzi
    ) {
      var initRecoEdit = function() {
        $scope.recoEdit = {
          phid: "",
          hid: "",
          refr: "",
          desc: ""
        };
      };
      initRecoEdit();

      $scope.userAction = function(strgCmmdGrup, strgCmmd, strgRefr, objtRefr) {
        switch (strgCmmdGrup) {
          case "rec":
            switch (strgCmmd) {
              case "new":
                initRecoEdit();
                $scope.showPopup();
                break;
              case "open":
                $rootScope.appl.nodes.wgrp_study.preset.topic = objtRefr;
                $state.go("presetSubtopik");
                break;
              case "edit":
                initRecoEdit();
                console.log(objtRefr);
                $scope.showPopup(objtRefr);
                break;
            }
            break;
          case "nav":
            /* menu nav is handled by detectMenuAndApplyPageGuard()*/
            switch (strgCmmd) {
              case "back":
                window.history.back();
                break;
            }

            break;
        } /* CmdGrp Switch*/
      }; /*userAction*/

      $scope.showPopup = function(objtRefr) {
        if (objtRefr) {
          $scope.recoEdit = {
            hid: objtRefr.hid,
            refr: objtRefr.refr,
            desc: objtRefr.desc
          };
        }
        // Custom popup
        var myPopup = $ionicPopup.show({
          template: '<input type = "text" ng-model = "recoEdit.desc">',
          title: "Subtopik",
          subTitle: "Edit Topik",
          scope: $scope,

          buttons: [
            {
              text: "Cancel",
              type: "button-energized"
            },
            {
              text: "Del",
              type: "button-assertive",
              onTap: function(e) {
                if (!$scope.recoEdit.desc) {
                  //don't allow the user to close unless he enters model...
                  e.preventDefault();
                } else {
                  return "del";
                }
              }
            },
            {
              text: "OK",
              type: "button-positive button-small",
              onTap: function(e) {
                if (!$scope.recoEdit.desc) {
                  //don't allow the user to close unless he enters model...
                  e.preventDefault();
                } else {
                  return $scope.recoEdit.desc;
                }
              }
            }
          ]
        });

        myPopup.then(function(res) {
          console.log("Tapped!", res);
          if (res != undefined) $scope.processRecoEdit(res);
        });
      };

      $scope.processRecoEdit = function(strgCmmd) {
        console.log(strgCmmd);
        console.log($scope.recoEdit);
        if ($rootScope.appl.demo == true) {
          //alert('feature disabled for demo user')
          $ionicPopup.alert({
            title: "Error",
            template: "Fungsi disekat untuk pengguna Demo."
          });
          return;
        }
        if (strgCmmd == "del") {
          var confirmPopup = $ionicPopup.confirm({
            title: "DELETE",
            template: "Anda Pasti?",
            cssClass: "popupCustom"
          });
          confirmPopup.then(function(res) {
            if (res) {
              var subdata = {
                reco: {
                  hid: $scope.recoEdit.hid
                }
              };
              //reqs_serv('del_wgrp_study_topic',subdata).then(function(resp){load_recs()}) ;
              reqs_serv("del_study_preset_subtopic", subdata).then(function(
                resp
              ) {
                load_listMain();
              });
            } else {
              console.log("Cancel sign Out");
            }
          });
        } else {
          if ($scope.recoEdit.hid != "") {
            //upd
            var wgrp = {
              refr: $scope.recoEdit.refr,
              desc: $scope.recoEdit.desc,
              topic: $scope.recoEdit.topic
            };
            var subdata = {
              reco: wgrp,
              hid: $scope.recoEdit.hid
            };
            reqs_serv("upd_study_preset_subtopic", subdata).then(function(
              resp
            ) {
              load_listMain();
            });
          } else {
            //new
            var reco = {
              refr: $scope.recoEdit.refr,
              desc: $scope.recoEdit.desc
            };
            var subdata = {
              reco: reco
            };
            reqs_serv("add_study_preset_subtopic", subdata).then(function(
              resp
            ) {
              load_listMain();
            });
          }
        }
      };

      var reqs_serv = function(strgCmmd, objtRefr) {
        var deferred = $q.defer();
        $firebaseAuth().$onAuthStateChanged(function(objAuthUser) {
          var param = {
            cmmd: strgCmmd,
            token: objAuthUser.qa,
            subdata: objtRefr
          };
          svcEzzi.get("Wgrp", param).then(function(response) {
            console.log("cmmd:", response);
            deferred.resolve(response);
          });
        });
        return deferred.promise;
      };
      var load_listMain = function() {
        objt_refr = {
          objt_param: {
            phid: $rootScope.appl.nodes.wgrp_study.preset.topic.hid
          }
        };
        reqs_serv("get_study_preset_subtopic", objt_refr).then(function(resp) {
          console.log("get_study_preset_subtopic resp", resp);
          $scope.listMain = resp;
        });
      };

      $scope.$on("$ionicView.enter", function() {
        console.log(
          "node.wgrp_study.reset:",
          $rootScope.appl.nodes.wgrp_study.preset
        );
        load_listMain();
      });
    }
  ])

  .controller("resetCtrl", [
    "$scope",
    "$stateParams",
    "svcEzzi",
    "$q",
    "$firebaseAuth", // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function($scope, $stateParams, svcEzzi, $q, $firebaseAuth) {
      $scope.userAction = function(strCmdGrp, strCmd, strRef, objRef) {
        switch (strCmdGrp) {
          case "sys":
            switch (strCmd) {
              case "resetwgrp":
                reqs_serv("new_wgrp_table_set", {});
                break;
              case "resetwgrpstudy":
                reqs_serv("new_wgrp_study_table_set", {});
                break;
            }
            break;
        }
      }; /*useraction*/
      var reqs_serv = function(strCmd, objRef) {
        var deferred = $q.defer();
        $firebaseAuth().$onAuthStateChanged(function(objAuthUser) {
          var param = {
            cmmd: strCmd,
            token: objAuthUser.qa,
            subdata: objRef
          };
          svcEzzi.get("Wgrp", param).then(function(response) {
            console.log("cmmd:", response);
            //$scope.loadWgrp();
            //return response;
            deferred.resolve(response);
          });
        });
        return deferred.promise;
      };
    }
  ]);
