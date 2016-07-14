'use strict';

/**
 * @ngdoc function
 * @name wobbleApp.controller:initCtrl
 * @description
 * # initCtrl
 * Controller of the wobbleApp
 */
angular.module('wobbleApp')
  .controller('initCtrl', [ '$scope', '$state',
    function ($scope, $state) {
      var vm = this;

      $state.go('init.main');
    }
  ]);