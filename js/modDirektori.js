angular
  .module("modDirektori", [])
    .factory('fcyDirektori', [
        function() {
    var data={
        records:{},
        path:[]
        };
    
    var setDataPath=function(level,param_data){
        data.path[level]=param_data
    }
    var getDataPath=function(level){
        return data.path[level]
    }    
    var setData=function(param_data){
        data.records=param_data;
    }
    
    var resetData=function(){
        data.records={}
    }    

    var getData=function(level){
        return data.records[level];
    }
    var getAllData=function(){
        return data.records;
    }    
    
    return {
                data: data,
                setData:function(param_data){return setData(param_data)},
                setDataPath:function(level,param_data){return setDataPath(level,param_data)},
                getDataPath:function(level){return getDataPath(level)},
                resetData:function (){resetData()},
                getData:function(param_level){return getData(param_level)},
                
                getAllData:function(){return getAllData()}
    };    
    
    
}])


.service('svcDirektori', ['$http','$ionicLoading',function($http,$ionicLoading){

	var BASE_URL = "https://script.google.com/macros/s/AKfycbxrdXO_ZWdD6ne_WpWmlw0FEPvMXMAwyN6sZm4Jk70tVwPNGJYu/exec";
	var items = [];
	function jsontostring(objData){
	    return Object.keys(objData).map(function(key){
	            return encodeURIComponent(key) + '=' + 
	            encodeURIComponent(objData[key]);
	            }).join('&');
	}
	return {
	    RegClient: function(objData){
	       return $http({
	           method: 'POST',
	           url: BASE_URL + '?cmd=regclient',
	           headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
	           data:jsontostring(objData)
	           }).then(function mySucces(response) {
	               console.log("success:" + JSON.stringify(response));
	               return 1
	               }, function myError(response) {
	                   console.log("error:" + response);
	               });  
	    },	    
	    GetData: function(objData){
	        console.log(100)
	        $ionicLoading.show();
			return $http.get(BASE_URL+'?'+jsontostring(objData)).then(function(response){
			    $ionicLoading.hide();
			    console.log(response)
				return response;
			});	        
	    },
	    GetClient: function(strRef){
			return $http.get(BASE_URL+'?cmd=getclient&ref='+strRef).then(function(response){
				return response;
			});	        
	    },
	    ResetClient: function(strRef){
			return $http.get(BASE_URL+'?cmd=resetclient&ref='+strRef).then(function(response){
				return response;
			});	        
	    }
	}

}]);





    
    
    ;