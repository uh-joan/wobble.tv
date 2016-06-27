'use strict';

/**
 * @ngdoc overview
 * @name apiCakeApp
 * @description
 * # apiCakeApp
 *
 * Main module of the application.
 */
angular
  .module('wobbleApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'templates',
    'ui.router',
    'ui.bootstrap'
  ])
  .constant('YT_event', {
    STOP:            0,
    PLAY:            1,
    PAUSE:           2,
    STATUS_CHANGE:   3,
    GET_TIME:        4,
    VOTE_UP:         5,
    VOTE_DOWN:       6
  })
  .config(function ($routeProvider, $stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/main');
    //
    // Now set up the states
    $stateProvider
      .state('main', {
        url: '/main',
        views: {
          '': {
            templateUrl: 'main.html',
            controller: 'mainCtrl',
            controllerAs: 'vm'
          }
        }
      })
  });