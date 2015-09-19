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
    console.log('foo');
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);

    $scope.bluetoothList = [{name: 'HC-05', address:'98:D3:31:50:20:C8'}]
    $scope.travelling = false;
    var startPosition = {};
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
    bluetoothSerial.discoverUnpaired(success, failure);
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
            });
  }
});