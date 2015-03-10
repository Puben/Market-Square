'use strict';

console.log("in main.js");

// define our app and dependencies (remember to include firebase!)
var app = angular.module("sampleApp", ["firebase", 'ngRoute']);
var userName;
/*
 var usserApp = angular.module("nameApp"), ["firebase"]);
 */



// this factory returns a synchronized array of chat messages
app.factory("chatMessages", ["$firebaseArray",
  function($firebaseArray) {
    var ref = new Firebase("https://marketsquare.firebaseio.com/chat/");

    // this uses AngularFire to create the synchronized array
    return $firebaseArray(ref);
  }
]);

// this factory returns a synchronized array of ads
app.factory("ads", ["$firebaseArray",
  function($firebaseArray) {
    var ref = new Firebase("https://marketsquare.firebaseio.com/ads/");
    // this uses AngularFire to create the synchronized array
    return $firebaseArray(ref);
  }
]);

// this factory returns a firebase object
app.factory("session", ["$firebaseObject",
  function($firebaseObject) {
    var ref = new Firebase("https://marketsquare.firebaseio.com/sessions/");
    // this uses AngularFire to create the synchronized array
    return $firebaseObject(ref);
  }
]);

app.factory("ArrayWithSum", function($firebaseArray) {
  return $firebaseArray.$extend({
    sum: function() {
      var total = 0;
      angular.forEach(this.$list, function(rec) {
        total += rec.x;
      });
      return total;
    }
  });
});

app.factory('Person', function () {
    return function Person (name) {
      this.name = name;
    };
  });


app.config(function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode({
  enabled: false,
  requireBase: false
});
  $routeProvider

    // route for the home page
      .when('/', {
      controller:'RouteCtrl',
      templateUrl:'uirouter.html'

    })
    .when('/session', {
      templateUrl : 'views/main.html',
      controller  : 'SessionCtrl'
    })

    .when('/about', {
      templateUrl : 'views/about.html',
      controller  : 'AboutCtrl'
    })

    .when('/users', {
      templateUrl : 'views/users.html',
      controller  : 'UsersCtrl'
    })
     .when('/chat', {
      templateUrl : 'views/chat.html',
      controller  : 'ChatCtrl'
    })
    .when('/ads', {
      templateUrl : 'views/ads.html',
      controller  : 'AdsCtrl'
    })
    // route for the contact page
    .when('/contact', {
      templateUrl : 'views/contact.html',
      controller  : 'contactController'
    })
    .otherwise({redirectTo: "/"});

});

app.run(function ($location, $window, $rootScope) {
  
});

app.controller('RouteCtrl', function($scope) {

   /** create $scope.template **/
   $scope.template={
     "about":"views/about.html",
     "login":"views/login.html",
     "chat":"views/chat.html"
     //"contact":"contactus.html"
     
   }
   $scope.message={
     //"about":"Message from home template",
     "login":"Message from login template",
     //"contact":"Message from contact template"
   }
  });

app.controller("ChatCtrl", ["$scope", "chatMessages",
  // we pass our new chatMessages factory into the controller
  function($scope, chatMessages) {
    // For the first test case!

    console.log("--> ChatCtrl - Chat module loaded!" + userName);
    $scope.user = userName;
    $scope.message = $scope.user;

    // chatMessages array to the scope to be used in our ng-repeat
    $scope.messages = chatMessages;
  
    // a method to create new messages; called by ng-submit
    $scope.addMessage = function() {
      // calling $add on a synchronized array is like Array.push(),
      // except that it saves the changes to Firebase!
      $scope.messages.$add({
        from: $scope.user,
        content: $scope.message
      });

      // reset the message input
      $scope.message = "";
    };

    // if the messages are empty, add something for fun!
    $scope.messages.$loaded(function() {
      if ($scope.messages.length === 0) {
        $scope.messages.$add({
          from: "Market Square",
          content: "Hello world!"
        });
      }
    });
  }
]);

app.controller("AboutCtrl", function($scope) {
  console.log("-->AboutCtrl loaded -");
  $scope.data = ' - 1st. semester project - use with care! all data is subject to the public';
});

// ADS CONTROLLER
app.controller("AdsCtrl", ["$scope", "$firebaseArray",
  function($scope, $firebaseArray) {
    //CREATE A FIREBASE REFERENCE
    var ref = new Firebase("https://marketsquare.firebaseio.com/ads");

    console.log("---> In AdsCtrl and loaded firebase reference!");
    // GET MESSAGES AS AN ARRAY
    $scope.ads = $firebaseArray(ref);

      $scope.newAd = function(e) {
          $scope.ads.$loaded().then(function(ads) {
            console.log("in newAd");
          });
        }
       
      }
    ]);

// SESSION CONTROLLER

app.controller("SessionCtrl", ["$scope", "$firebaseObject",
  function($scope, $firebaseObject) { 
    var ref = new Firebase("https://marketsquare.firebaseio.com/users");
    console.log("---> In SessionCtrl and loaded firebase reference!");
    var obj = $firebaseObject(ref);
 // to take an action after the data loads
    obj.$loaded(function(data) {
    console.log(data === obj); // true
  },
  function(error) {
    console.error("Error:", error);
  }).then(function() {
       // To iterate the key/value pairs of the object, use angular.forEach()
       angular.forEach(obj, function(value, key) {
          console.log(key, value);
       });
     });
     // To make the data available in the DOM, assign it to $scope
     $scope.data = obj;
     console.log(ref);
  }]);

// USERS CONTROLLER
app.controller("UsersCtrl", ["$scope", "$firebaseArray", 
  function($scope, $firebaseArray) {
		//CREATE A FIREBASE REFERENCE

  	var ref = new Firebase("https://marketsquare.firebaseio.com/users");


  	console.log("---> In UsersCtrl and loaded firebase reference!");
  	// GET MESSAGES AS AN ARRAY
    $scope.users = $firebaseArray(ref);
    var name = $scope.name;



    //ADD USER METHOD
    $scope.addUser = function(e) {
    $scope.pin = Math.floor(Math.random()*9000) + 1000;


     $scope.users.$loaded().then(function(users) {
        $scope.id = $scope.users.length + 1; 

        var userRef = new Firebase("https://marketsquare.firebaseio.com/users/"+$scope.name);
        $scope.user = $firebaseArray(userRef);
        console.log(userName);
        $scope.user.$add({userId: $scope.id, userPin: $scope.pin, active: true});
      // Alert the user - Give PIN!
      alert("This is your PIN: " + $scope.pin + "This is your ID:" + $scope.id);
      });
      console.log("User created! " + $scope.name);
      };

      $scope.login = function(e) {
        $scope.users.$loaded().then(function(users) {
          userName = $scope.name;
          console.log(userName);
          try {
          $scope.url = angular.element(document.location.href='/#/chat');
          name = $scope.name;

      }
      catch(err) {
     console.log("---> Loaded the chat module : Expected error! No mitigation?"+ $scope.name);
      }

          });

        }
      }
    ]);

  
app.controller('contactController', function($scope) {
  console.log("--> In contactController");
  $scope.message = 'Contact us! JK. This is just a demo.';
});
  