angular
  .module("modWakaf", [])

  .service("svcWakaf", [
    "$q",
    "$firebaseObject",
    "$firebaseArray",
    "$firebaseAuth",
    "$ionicPopup",
    "$ionicLoading",
    function(
      $q,
      $firebaseObject,
      $firebaseArray,
      $firebaseAuth,
      $ionicPopup,
      $ionicLoading
    ) {
      var self = this;
      this.data = {};

      this.getFirebaseUser = function() {
        var deferred = $q.defer();
        var authObj = $firebaseAuth();

        authObj.$onAuthStateChanged(function(firebaseUser) {
          if (firebaseUser) {
            deferred.resolve(firebaseUser);
          } else {
            console.log("reject");
            deferred.reject(0);
          }
        });
        return deferred.promise;
      };

      this.getFbsRecords = function(strBaseRef) {
        var deferred = $q.defer();

        self.getFirebaseUser().then(function(firebaseUser) {
          if (firebaseUser) {
            console.log(firebaseUser);
            var dataPath = strBaseRef +"/" + firebaseUser.uid;
            console.log("dataPath:", dataPath);
            var dbsRef = firebase
              .database()
              .ref()
              .child(dataPath);

            $ionicLoading.show();
            var list = $firebaseArray(dbsRef);
            //console.log(list);
            list.$loaded().then(function(result) {
              $ionicLoading.hide();
              //console.log(result);
              self.data[strBaseRef] = result;
              //console.log(self.data);
              deferred.resolve(result);
            }); /*loaded*/
          } else {
            console.log("reject");
            deferred.reject(0);
          }
        });

        return deferred.promise;
      };/* getFbsRecords */

        this.setCloneRecord=function(objRecord){
            self.data['clone']=objRecord;
        }
        this.getCloneRecord=function(){
            return self.data['clone'];
        }
      
      this.addFbsRecord=function(strBaseRef,objRecord){
        var deferred = $q.defer();
        $ionicLoading.show();
        self.data[strBaseRef].$add(objRecord).then(function(ref) {
            //ref.key() === list[2].$id; // true
            console.log('add result:',ref)
            $ionicLoading.hide();
            deferred.resolve(ref);
            });
        return deferred.promise;          
      };/* addFbsRecord */
      this.saveFbsRecord=function(strBaseRef,objRecord){
        var deferred = $q.defer();
        $ionicLoading.show();
        self.data[strBaseRef].$save(objRecord).then(function(ref) {
            //ref.key() === list[2].$id; // true
            console.log('add result:',ref)
            $ionicLoading.hide();
            deferred.resolve(ref);
            });
        return deferred.promise;          
      };/* saveFbsRecord */      
      
    }
  ]);

/* end service */
