angular.module('modUtil', [])


    .service('svcUtils',[function() {
  
        this.isEmptyObject= function isEmptyObject(obj) {
            /*func to test for an empty object*/
            for(var key in obj) {
                if(obj.hasOwnProperty(key))
                return false;
                }
                return true;
        }
        
        this.eventify = function a (arr,what,callback) { 
            arr[what] = function b (e) { 
                Array.prototype[what].call(arr, e); 
                callback(arr); 
            }; 
        };         
        
        
    }])



      .service("PageGuard", [
        "$ionicHistory", "$state",
        function($ionicHistory, $state) {
          //console.log('PageGuardService');
          var self = this;
          var nextPage;

          this.allowSwitchPage = function(newNextPage) {
            nextPage = newNextPage
          } /*allowSwitchPage*/
          
          this.switchPage = function(
            newNextPage, disableAnimate, disableBack, historyRoot) {
            nextPage = newNextPage
            console.log('nextPage1:',nextPage)
            $ionicHistory.nextViewOptions({
              disableAnimate: disableAnimate,
              disableBack: disableBack,
              historyRoot: historyRoot
            });
            $state.go(newNextPage)
          } /*switchPage*/
          
          this.stateChangeStart = function(currentPage, event, toState, fromState) {
            /*
            console.log('stateChangeStart')
            console.log('currentPage:',currentPage);
            console.log('event:',currentPage);
            console.log('toState:',toState);
            console.log('fromState:',fromState);
            */
            console.log('nextPage2:',nextPage)
            if (nextPage == '') {
              console.log('prevent hardware back button');
              event.preventDefault();
            } else {
              if (toState.name != nextPage) {
                console.log('prevent default back button');
                event.preventDefault();
              }
            }
            nextPage = '';
          } /*stateChangeStart*/
        }
      ])
      
      
      
/*end*/
;