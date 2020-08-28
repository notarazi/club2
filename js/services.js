    angular
      .module("app.services", [])
      .factory("BlankFactory", [function() {}])
      .service("BlankService", [function() {}])
      .service("User", [
        "$rootScope",
        "$timeout",
        "$q",
        "$http",
        "$ionicPopup",
        "$ionicLoading",
        "$firebaseAuth",
        "$firebaseObject",
        "$firebaseArray",
        "Defaults",
        function(
          $rootScope,
          $timeout,
          $q,
          $http,
          $ionicPopup,
          $ionicLoading,
          $firebaseAuth,
          $firebaseObject,
          $firebaseArray,
          Defaults
        ) {
          var self = this; /*use self var to avoid internal conflict*/
          this.userTemplate = {
            uid: '',
            pid: '',
            rid:'',
            mobileNo:'',
            email: '',
            displayName: '',
            imageData: '',
            isAdmin: false,
            organizations: [],
            branches: [],
            departments: [],
            units: [],
            families: [],
            teams: [],
          }
          this.data = {
            userStatus: {
              isSignedOut: true,
              isSignedIn: false
            },
            userInfo: {}
          }
          var hideIonicLoadingIfItIsShowing = function() {
            $ionicLoading._getLoader().then(function(state) {
              if (state.isShown == true) {
                $ionicLoading.hide();
              }
            });
          };
          /*setLocalUserInfo*/
          this.setLocalUserInfo = function(objNewUserInfo) {
            if (objNewUserInfo != null) {
              window.localStorage.setItem('userinfo', angular.toJson(objNewUserInfo));
            } else {
              window.localStorage.removeItem('userinfo');
            }
          }
          /*setLocalUserInfo end*/
          /*getLocalUserInfo*/
          this.getLocalUserInfo = function() {
            var objLocalUserInfo = angular.fromJson(window.localStorage.getItem('userinfo'))
            console.log('getLocalUserInfo', objLocalUserInfo);
            return objLocalUserInfo;
          }
          /*getLocalUserInfo end*/
          this.updateLocalUserStatus = function(isSignedIn) {
            if (isSignedIn == true) {
              self.data.userStatus.isSignedIn = true;
              self.data.userStatus.isSignedOut = false;
            } else {
              self.data.userStatus.isSignedIn = false;
              self.data.userStatus.isSignedOut = true;
            }
          }
          this.updateLocalUserInfo = function(objLocalUser) {
            console.log(objLocalUser)
            if (objLocalUser != null) {
              self.setLocalUserInfo(objLocalUser)
              self.data.userInfo = objLocalUser;
              self.updateLocalUserStatus(true)
            } else {
              self.setLocalUserInfo(null)
              self.data.userInfo = {};
              self.updateLocalUserStatus(false)
            }
          }
          this.reloadUserInfo = function() {
            console.log('reloadUserInfo');
            var objCurrentUser = firebase.auth().currentUser;
            firebase.database().ref('/UserInfo/' + objCurrentUser.uid).once('value').then(function(snapshot) {
              self.updateLocalUserInfo(snapshot.val());
              $rootScope.$apply();
            })
          }
          this.resetUserInfo = function() {
            console.log('resetUserInfo');
            self.data.userInfo = {};
            self.setLocalUserInfo(null);
            self.data.userStatus.isSignedIn = false;
            self.data.userStatus.isSignedOut = true;
          }
          /*initLocalUserInfo*/
          this.initLocalUserInfo = function() {
            console.log('initLocalUserInfo')
            self.updateLocalUserInfo(self.getLocalUserInfo());
          }
          /*initLocalUserInfo end*/
          /*getUserInfo*/
          this.getUserInfo = function() {
            var defer = $q.defer();
            var objCurrentUser = firebase.auth().currentUser;
            //console.log(objCurrentUser.uid);
            if (objCurrentUser) {
              var dbref = firebase.database().ref("UserInfo/" + objCurrentUser.uid);
              var objUserInfo = $firebaseObject(dbref);
              objUserInfo.$loaded().then(function() {
                console.log(objUserInfo)
                if (objUserInfo.uid === undefined) {
                  angular.forEach(self.userTemplate, function(value, key) {
                    objUserInfo[key] = objCurrentUser[key] || ''
                  });
                  objUserInfo.$save();
                } else {
                  objUserInfo.timeLastLogged = new Date().getTime();
                  objUserInfo.$save();
                }
                //console.log(objUserInfo)
                defer.resolve(objUserInfo);
              });
            } else {
              defer.reject(null);
            }
            return defer.promise;
          }
          /*getUserInfo*/
          /*setUserInfo*/
          this.setUserInfo = function(objUser) {
            var objCurrentUser = firebase.auth().currentUser;
            //console.log(objCurrentUser.uid);
            if (objCurrentUser) {
              var dbref = firebase.database().ref("UserInfo/" + objCurrentUser.uid);
              var objUserInfo = $firebaseObject(dbref);
              objUserInfo.$loaded().then(function() {
                console.log(objUserInfo)
                if (objUserInfo.uid === undefined) {
                  angular.forEach(self.userTemplate, function(value, key) {
                    objUserInfo[key] = objCurrentUser[key] || ''
                  });
                  objUserInfo.$save();
                } else {
                    if(objUser!=null){
                if (objUserInfo.uid === undefined) {
                  angular.forEach(self.userTemplate, function(value, key) {
                    objUserInfo[key] = objCurrentUser[key] || ''
                  });
                  objUserInfo.timeLastLogged = new Date().getTime();
                  objUserInfo.$save();
                    }
                }
                }
                //console.log(objUserInfo)
                defer.resolve(objUserInfo);
              });
            } else {

            }

          }
          /*setUserInfo*/          
          /* viewUserInfo */
          this.popupView = function() {
            var defaults = Defaults.data;
            self.getUserInfo().then(function(objUserInfo) {
              var newScope = $rootScope.$new();
              newScope.temp = objUserInfo;
              newScope.temp.imageData = newScope.temp.imageData || defaults.images.imgPerson;
              newScope.changePhoto = function() {
                document.getElementsByClassName("inputFile")[0].click();
                var inputFile = document.getElementsByClassName("inputFile")[0];
                inputFile.addEventListener("change", onInputFileChanged);

                function onInputFileChanged(elm) {
                  var file = elm.target.files[0];
                  var reader = new FileReader();
                  var preview = document.querySelector("img");
                  reader.addEventListener(
                    "load",
                    function() {
                      //preview.src = reader.result;
                      newScope.temp.imageData = reader.result;
                      newScope.$apply();
                      console.log(newScope.temp.imageData);
                    },
                    false
                  );
                  if (file) {
                    reader.readAsDataURL(file);
                  }
                }
              };
              // Custom popup
              var myPopup = $ionicPopup.show({
                template: '<center><img width="100px" ng-src="{{temp.imageData}}" width="100px" ng-click="changePhoto()" /></center>' +
                  '<p style="text-align:center;">{{temp.email}}</p>' +
                  '<input type="file" class="inputFile" style="display:none"/>' +
                  "<br/>" +
                  '<input type = "text" ng-model = "temp.displayName" placeholder="Nama Paparan">'+
                  '<input type = "text" ng-model = "temp.rid" placeholder="No KP">' +
                  '<input type = "text" ng-model = "temp.mobileNo" placeholder="No Mobile">'                
                ,
                title: "Pengguna",
                subTitle: "Info Ringkas",
                scope: newScope,
                buttons: [{
                    text: "Cancel"
                  },
                  {
                    text: "<b>Save</b>",
                    type: "button-positive",
                    onTap: function(e) {
                      console.log(newScope)
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
            }); /*getUserPublic if exist*/
          }; /*viewUserInfo*/
          /*DO SIGN UP*/
          this.doSignUp = function(objUser) {
            $ionicLoading.show({
              template: "Signing In ...",
              delay: 100
            });
            return firebase
              .auth()
              .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
              .then(function() {
                return firebase.auth().createUserWithEmailAndPassword(objUser.email, objUser.password)
                  .then(function(firebaseUser) {
                    // Success 
                    console.log('success')
                    
                     self.setUserInfo() ;
                    return firebaseUser
                  })
                  .catch(function(error) {
                    // Error Handling
                    console.log('error')
                    $ionicPopup.alert({
                      title: "<span class='assertive'>" + error.code + "</span>",
                      template: error.message
                    }); /*alert*/
                  }).finally(function(final) {
                    $ionicLoading.hide()
                  });
              }) /*setpersistence.then*/
              .catch(function(error) {
                // Handle Errors here.
                $ionicLoading.hide();
                $ionicPopup.alert({
                  title: "<span class='assertive'>" + error.code + "</span>",
                  template: error.message
                }); /*alert*/
              }); /*setpersistence.then.catch*/
          };
          /*doSignUp*/
          /*DO SIGN IN*/
          this.doSignIn = function(objUser) {
            $ionicLoading.show({
              template: "Signing In ...",
              delay: 100
            });
            return firebase
              .auth()
              .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
              .then(function() {
                return firebase.auth().signInWithEmailAndPassword(objUser.email, objUser.password)
                  .then(function(firebaseUser) {
                    // Success 
                    console.log('success')
                    return firebaseUser
                  })
                  .catch(function(error) {
                    // Error Handling
                    console.log('error')
                    $ionicPopup.alert({
                      title: "<span class='assertive'>" + error.code + "</span>",
                      template: error.message
                    }); /*alert*/
                  }).finally(function(final) {
                    $ionicLoading.hide()
                  });
              }) /*setpersistence.then*/
              .catch(function(error) {
                // Handle Errors here.
                $ionicLoading.hide();
                $ionicPopup.alert({
                  title: "<span class='assertive'>" + error.code + "</span>",
                  template: error.message
                }); /*alert*/
              }); /*setpersistence.then.catch*/
          };
          /*doSignIn*/
          /*DO SIGN OUT*/
          this.doSignOut = function(scope) {
            var confirmPopup = $ionicPopup.confirm({
              title: "Sign Out",
              template: "Are you sure?",
              cssClass: "popupCustom"
            });
            confirmPopup.then(function(res) {
              if (res) {
                //console.log("Confirmed Sign Out");
                self.resetUserInfo();
                $firebaseAuth().$signOut();
              } else {
                //console.log("Cancel sign Out");
              }
            });
          };
          /*doSignOut*/
          /*VERIFY ID TOKEN*/
          this.verifyIdToken = function() {
            //console.log('verifyIdToken')
            var verifiedToken = false;
            try {
              /*try getIdToken*/
              firebase
                .auth()
                .currentUser.getIdToken( /* forceRefresh */ true)
                .then(function(idToken) {
                  //console.log('getIdToken:')
                  //console.log(idToken)
                  // Send token to backend via HTTPS
                  // manual decode at jwt.io is also possible:
                  // 1.get cert at https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com
                  // 2.check verified at jwt.io
                  var url =
                    "https://script.google.com/macros/s/AKfycbwGgYhJhIpQQi8wfyhdUHm5eupTxMRmsaq1aQlGs8kl4T1nKGEi/exec";
                  var param = "?cmd=vfyidtoken&idtoken=" + idToken;
                  //$ionicLoading.show();
                  $http
                    .get(url + param)
                    .then(function(response) {
                      if (response) {
                        //console.log(response);
                        if (response) {
                          if (response.data) {
                            verifiedToken = angular.fromJson(response.data.content);
                          }
                        }
                      }
                      console.log("Firebase Token Check:" + verifiedToken);
                    })
                    .catch(function(e) {
                      console.log("Firebase Token Check:" + e);
                    });
                })
                .catch(function(error) {
                  // Handle error
                }); /*idToken*/
            } catch (error) {
              console.log(error);
            } /*try getIdToken*/
          };
          /*verifyidToken*/
          /*PREP USER SIGN UP*/
          this.prepUserSignUp = function() {
            var newScope = $rootScope.$new();
            newScope.popupData = {};
            var strPopup =
              '<form class="list" name="formSignUp"><input type="email" placeholder="Your Email" ng-model="popupData.email" ng-required="true" name="email"><div ng-hide="formSignUp.email.$valid" class="show-list-numbers-and-dots assertive">Enter valid email</div><br/><input type="password" placeholder="Your Password (min 6 chars)" ng-model="popupData.password" name="password" ng-required="true"><br/><input type="password" placeholder="Re-enter Password" ng-model="popupData.password1" name="password1" ng-required="true"><div ng-show="userNew.password!=userNew.password1" class="show-list-numbers-and-dots assertive"><p>Passwords must match one another</p></div><p name="formvalidity" style="display:none">{{formSignUp.$valid && (userNew.password==userNew.password1)}}</p></form>';
            var strPopupTitle =
              '<div style="text-align:center;"><i class="icon positive ion-planet" style="font-size:100pt;"></i></div>Sign Up';
            var strPopupSubTitle = "Enter Email and Password for Registration";
            return $ionicPopup.show({
              template: strPopup,
              title: strPopupTitle,
              subTitle: strPopupSubTitle,
              cssClass: "popupCustom",
              scope: newScope,
              buttons: [{
                  text: "Cancel",
                  type: "button-assertive"
                },
                {
                  text: "Sign Up",
                  type: "button-calm",
                  onTap: function(e) {
                    var elem1 = document.querySelectorAll('[name="formvalidity"]')[0];
                    if (elem1.innerHTML === "true") {
                      self.doSignUp(newScope.popupData);
                      //scope.popupData={};
                    } else {
                      $ionicPopup.alert({
                        title: "<span class='assertive'>" + error.code + "</span>",
                        template: "Please complete the form"
                      }); /*alert*/
                      e.preventDefault();
                    } /*if*/
                  } /*onTap*/
                } /*button*/
              ] /*buttons*/
            }); /*show*/
            newScope.$destroy();
          };
          /*prepUserSignUp*/
          /*PREP USER SIGN IN*/
          this.prepUserSignIn = function() {
            var newScope = $rootScope.$new();
            newScope.popupData = {};
            var strPopup =
              '<form class="list" name="formSignIn"><input type="email" placeholder="Your Email" ng-model="popupData.email" ng-required="true" name="email"><div ng-hide="formSignIn.email.$valid" class="show-list-numbers-and-dots assertive">Enter valid email</div><br/><input type="password" placeholder="Your Password (min 6 chars)" ng-model="popupData.password" name="password" ng-required="true"><br/><p name="formvalidity" style="display:none">{{formSignIn.$valid}}</p></form>';
            var strPopupTitle =
              '<div style="text-align:center;"><i class="icon positive ion-planet" style="font-size:100pt;"></i></div>Sign In';
            var strPopupSubTitle = "Enter Email and Password";
            return $ionicPopup.show({
              template: strPopup,
              title: strPopupTitle,
              subTitle: strPopupSubTitle,
              cssClass: "popupCustom",
              scope: newScope,
              buttons: [{
                  text: "Cancel",
                  type: "button-assertive"
                },
                {
                  text: "Sign In",
                  type: "button-balanced",
                  onTap: function(e) {
                    var elem1 = document.querySelectorAll('[name="formvalidity"]')[0];
                    if (elem1.innerHTML === "true") {
                      //console.log(newScope.popupData)
                      return self.doSignIn(newScope.popupData);
                    } else {
                      $ionicPopup.alert({
                        title: "<span class='assertive'>" + error.code + "</span>",
                        template: "Please complete the form"
                      }); /*alert*/
                      e.preventDefault();
                    } /*if*/
                  } /*onTap*/
                } /*button*/
              ] /*buttons*/
            }); /*show*/
            newScope.$destroy();
          };
          /*prepUserSignIn*/
          /*PREP USER SIGN OUT*/
          this.prepUserSignOut = function(scope) {
            self.doSignOut();
          };
          /*prepUserSignOut*/
          this.userAction = function(strCmd, strRef, objRef) {
            //console.log(strCmd, strRef, objRef)
            switch (strCmd) {
              case "signIn":
                self.prepUserSignIn();
                break;
              case "signUp":
                self.prepUserSignUp();
                break;
              case "signOut":
                self.prepUserSignOut();
                break;
              case "verifyIdToken":
                self.verifyIdToken();
                break;
              case "popupView":
                self.popupView();
                break;
            } /*switch*/
          }
        }
      ])
      .factory("Defaults", [
        function() {
          var imgLogo =
            "data:image/png;base64,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";
          /* http://flamingtext.com/logo/Design-Glow?fontname=great+vibes */
          var imgHeader = "";
          var imgPerson =
            "data:image/png;base64,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";
          var data = {
            images: {
              imgLogo: imgLogo,
              imgPerson: imgPerson
            },
            pages: {
              guestPage: "login",
              userPage: "menu.home"
            }
          };
          return {
            data: data
          };
        }
      ])

    /*end of services*/
    ;