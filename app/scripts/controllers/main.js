'use strict';

console.log("in main.js");

// define our app and dependencies (remember to include firebase!)
var app = angular.module("sampleApp", ["firebase", 'ngRoute']);
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


app.config(function($routeProvider) {
  $routeProvider

    // route for the home page
    .when('/', {
      templateUrl : 'views/main.html',
      controller  : 'ChatCtrl'
    })

    .when('/about', {
      templateUrl : 'views/about.html',
      controller  : 'AboutCtrl'
    })

    .when('/users', {
      templateUrl : 'views/users.html',
      controller  : 'UsersCtrl'
    })

    // route for the contact page
    .when('/contact', {
      templateUrl : 'views/contact.html',
      controller  : 'contactController'
    });
});

app.controller("ChatCtrl", ["$scope", "chatMessages",
  // we pass our new chatMessages factory into the controller
  function($scope, chatMessages) {
    console.log("--> ChatCtrl - Chat module loaded!");
    $scope.user = "Guest " + Math.round(Math.random() * 100);

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

// USERS CONTROLLER
app.controller("UsersCtrl", ["$scope", "$firebaseArray",
        function($scope, $firebaseArray) {
          //CREATE A FIREBASE REFERENCE
          var ref = new Firebase("https://marketsquare.firebaseio.com/users");
          console.log("---> In UsersCtrl and loaded firebase reference!");
          // GET MESSAGES AS AN ARRAY
          $scope.users = $firebaseArray(ref);

          //ADD USER METHOD
          $scope.addUser = function(e) {

          $scope.users.$loaded().then(function(users) {

            $scope.users.$add({
            user: $scope.user,
            userId: users.length + 1,
            pin: "1234"
            });

            })
          }
        }
      ]);
  


app.controller('contactController', function($scope) {
  console.log("--> In contactController");
  $scope.message = 'Contact us! JK. This is just a demo.';
});
  