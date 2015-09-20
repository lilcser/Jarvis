var app = angular
  .module('htn2015', [
      'angular-carousel'
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
    $scope.placesResults;
    $scope.stillSearching = true;
    var startPosition = {};
    var maneuver;
    var offCourse = 0;
    var prevDistance;
    var currentStep = 0;
    var travelData = [];
    var key = {
      threeleft: 'a',
      threeright: 'b',
      oneleft: 'c',
      oneright: 'd',
      threeuturn: 'e',
      oneuturn: 'g',
      sms: 'f'
    }
    $scope.navBarTitle = "Jarvis"
// ble.startScan([], function(device) {
//     console.log(JSON.stringify(device));
// }, failure);

// setTimeout(ble.stopScan,
//     5000,
//     function() { console.log("Scan complete"); },
//     function() { console.log("stopScan failed"); }
// );
  function geoSuccess(position) {
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
    watchID = navigator.geolocation.watchPosition(onLocationChange, onLocationChangeError, {enableHighAccuracy: true});
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
  function onLocationChange(position){
    console.log('position', position);
    if(travelData.length == 0 || currentStep >= travelData.length)
      return;
    var distanceRemaining = calculateDistance(
      position.coords.latitude,
      position.coords.longitude,
      travelData[currentStep].end_location.lat,
      travelData[currentStep].end_location.lng
      );
    console.log('distance remaining', distanceRemaining);
    console.log('currentStep', currentStep);
    if(distanceRemaining < 0.3){
      if(currentStep + 1 != travelData.length){
        var dataKey = 'three'+direction(travelData[currentStep+1].maneuver);
        $scope.sendData(key.dataKey);
      }
    }
    else if(distanceRemaining < 0.1){
      currentStep++;
      if(currentStep != travelData.length){
        var dataKey = 'one'+direction(travelData[currentStep].maneuver);
        $scope.sendData(key.dataKey);
        //send maneuver data
      }
    }
    else if(distanceRemaining > previousDistance){
      offCourse++;
      if(offCourse >= 10){
        $scope.getPath();
        currentStep = 0;
        offCourse = 0;
      }
    }
    else{
      //do nothing and wait for he next location update
    }

  }
  function onLocationChangeError(){
    console.log('error on location change');
  }
  // Haversine Formula for calculating distances
  function calculateDistance(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1); // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
  Math.sin(dLat/2) * Math.sin(dLat/2) +
  Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
  Math.sin(dLon/2) * Math.sin(dLon/2)
  ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
  }

  function deg2rad(deg) {
  return deg * (Math.PI/180)
  }
  $scope.sendData = function(data){
    bluetoothSerial.write(data, success, failure);

    function success(){
        console.log('data sent successfully');
    }
    function failure(){
        console.log('data not sent');
    }
  }
  $scope.addDevice = function(macAddress, index){
    console.log(macAddress);
    console.log('attempting to pair device');
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
  $scope.findPlaces = function(){
        var search = document.getElementById('search').value;
        console.log(search)
        console.log('#search',search);
        var encodedVal = encodeURIComponent(search);
        $http({
          method: 'GET',
          url: 'https://maps.googleapis.com/maps/api/place/textsearch/json?query='+ search +'&key=AIzaSyC8BVV9FTVj5K4S5a05ammUKclM4MkIqyo'
        }).success(function(data){
          $scope.stillSearching = false;
          $scope.placesResults = data.results;
          console.log('google places api', data);
        })
  }
  $scope.getPath = function(address, index){
            console.log('placesresults',$scope.placesResults);
            console.log('going to ' + address);
            var encodedVal = encodeURIComponent(address);
            var googleURL = 'https://maps.googleapis.com/maps/api/directions/json?'
            console.log(googleURL + "origin=" + startPosition.latitude + ',' + startPosition.longitude + '&destination=' + address + '&mode=bicycling&key=AIzaSyC8BVV9FTVj5K4S5a05ammUKclM4MkIqyo')
            $http({
              method: 'GET',
              url: googleURL + "origin=" + startPosition.latitude + ',' + startPosition.longitude + '&destination=' + address + '&mode=bicycling&key=AIzaSyC8BVV9FTVj5K4S5a05ammUKclM4MkIqyo'
            }).success(function(data) {
              console.log("google direction data:", data);
              console.log(SMS);
              travelData = data.routes[0].legs[0].steps;
              console.log(travelData);
              if(SMS) SMS.startWatch(function(){
                  console.log('watching started');
                  document.addEventListener('onSMSArrive', function(e){
                    console.log('i found a text message!');
                    $scope.sendData('f');
                  });
              }, function(){
                  console.log('failed to start watching');
              });
            });
  }

  function direction(nextStep) {
    console.log('nextStep', nextStep);
    if(nextStep.indexOf('left') > -1){
      maneuver = 'left';
    }
    else if(nextStep.indexOf('right') > -1){
      maneuver = 'right';
    }
    else if(nextStep.indexOf('uturn') > -1){
      maneuver = 'uturn';
    }
    else
      maneuver = 'straight';
}
  $scope.$watch('carouselIndex', function(){
    if($scope.carouselIndex == 0){
      $scope.navBarTitle = 'MY DEVICES';
    }
    else if($scope.carouselIndex == 1){
      $scope.navBarTitle = 'JARVIS';
    }
  })
});