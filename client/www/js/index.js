var app = angular
  .module('htn2015', [
  ])
app.controller('MainCtrl', function ($timeout, $interval, $scope, $http, $rootScope) {
    document.addEventListener('deviceready', onDeviceReady, false);
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    var smsInboxPlugin;
    var watchId = null;
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, [{enableHighAccuracy: true}]);
    $scope.bluetoothList = [{name: 'HC-05', address:'98:D3:31:50:20:C8'}]
    $scope.travelling = false;
    var startPosition = {};
    var maneuver;
    var offCourse = 0;
    var prevDistance;
    var currentStep = 0;
    var travelData = [];
// ble.startScan([], function(device) {
//     console.log(JSON.stringify(device));
// }, failure);

// setTimeout(ble.stopScan,
//     5000,
//     function() { console.log("Scan complete"); },
//     function() { console.log("stopScan failed"); }
// );
  function geoSuccess(position) {
    var mapEl = document.getElementById('closest-store');
    startPosition.latitude = position.coords.latitude;
    startPosition.longitude = position.coords.longitude;
    console.log(position);
  }
  function geoError(error) {
    console.log(error);
  }
  // document.addEventListener("deviceready", function(){
  // }, false);
  function onDeviceReady(){
    console.log('on device ready');
    watchID = navigator.geolocation.watchPosition(onLocationChange, onError, {enableHighAccuracy: true});
    bluetoothSerial.discoverUnpaired(success, failure);
    smsInboxPlugin = cordova.require('cordova/plugin/smsinboxplugin');
    function success(list){
        console.log(list);
        $scope.bluetoothList = list;
        $rootScope.$digest();
        console.log($scope.bluetoothList);
    }
    function failure(){
        console.log('no devices found');
    }
  }
  function onLocationChange(position){
    if(travelData.length == 0)
      return;
    var distanceRemaining = calculateDistance(
      position.coords.latitude,
      travelData[currentStep].end_location.lat,
      position.coords.longitude,
      travelData[currentStep].end_location.lng
      );
    if(distanceRemaining < 0.5){
      //todo:flash light
    }
    else if(distanceRemaining < 0.1){
      distanceRemaining = calculateDistance(
        position.coords.latitude,
        travelData[currentStep].end_location.lat,
        position.coords.longitude,
        travelData[currentStep].end_location.lng
      );
      currentStep++;
      //todo:stop flashing light
    }
    else if(distanceRemaining > previousDistance)
      offCourse++
      if(offCourse >= 5){
        $scope.getPath();
        currentStep = 0;
        offCourse = 0;
      }

  }
  // Haversine Formula for calculating distances
  function calculateDistance(lat1, lat2, lon1, lon2){
      var dlon = lon2 - lon1 
      var dlat = lat2 - lat1 
      var a = (Math.sin(dlat/2))^2 + Math.cos(lat1) * Math.cos(lat2) * (Math.sin(dlon/2))^2 
      var c = 2 * Math.atan2( Math.sqrt(a), Math.sqrt(1-a) ) 
      return 6373 * c;
  }
  $scope.sendData = function(){
    bluetoothSerial.write('a', success, failure);

    function success(){
        console.log('data sent successfully');
    }
    function failure(){
        console.log('data not sent');
    }
  }
  $scope.addDevice = function(macAddress, index){
    console.log(macAddress);
    bluetoothSerial.connect(macAddress, success, failure);

    function success(){
        console.log('connected successfully');
        $scope.bluetoothList.splice(index, 1);
    }
    function failure(){
        console.log('connection failed');
    }
  }
  $scope.refresh = function(){
        console.log('trying to connect');
        bluetoothSerial.connect('98:D3:31:50:20:C8', success, failure);
        function success(){
            console.log('connected');
        }
        function failure(){
            console.log('not connected');
        }
        // bluetoothSerial.discoverUnpaired(success, failure);
        // function success(list){
        //     $scope.bluetoothList = list;
        // }
        // function failure(){
        //     console.log('no devices found');
        // }
  }
  $scope.val = "338 King Street North";
  $scope.getPath = function(){
            var encodedVal = encodeURIComponent($scope.val);
            var googleURL = "https://maps.googleapis.com/maps/api/directions/json?";
            console.log(googleURL + "origin=" + startPosition.latitude + ',' + startPosition.longitude + '&destination=' + encodedVal + '&mode=bicycling&key=AIzaSyC8BVV9FTVj5K4S5a05ammUKclM4MkIqyo')
            $http({
              method: 'GET',
              url: googleURL + "origin=" + startPosition.latitude + ',' + startPosition.longitude + '&destination=' + encodedVal + '&mode=bicycling&key=AIzaSyC8BVV9FTVj5K4S5a05ammUKclM4MkIqyo'
            }).success(function(data) {
              console.log("google direction data:", data);
              travelData = data.routes.legs[0].steps;
            });
  }
  function direction(nextStep) {
    if(nextStep.indexOf('left')){
      maneuver = 'left';
    }
    else if(nextStep.indexOf('right')){
      maneuver = 'right';
    }
    else
      maneuver = 'straight';
}

});