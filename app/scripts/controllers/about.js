'use strict';

/**
 * @ngdoc function
 * @name saleApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the saleApp
 */
angular.module('saleApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
