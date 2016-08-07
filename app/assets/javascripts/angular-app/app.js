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
    VOTE_DOWN:       6,
    GET_DURATION:    7
  })
  .constant('_', window._)
  .value('time_step','1')
  .value('domain','http://localhost:3000')
  //.value('domain','https://fullsocialwobble.herokuapp.com')
  //.value('domain','http://wobble.tv')
  .config(function ($routeProvider, $stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/init');
    //
    // Now set up the states
    $stateProvider
      .state('init', {
        url: '/init',
        resolve: {
          videos: ['videoService', '$q', function(videoService, $q){
            var deferred = $q.defer();

            videoService.query_all().then(function(res){
              deferred.resolve(res.data);
            }, function(e){
              deferred.reject(e);
            });
            return deferred.promise;
          }]
        },
        views: {
          '': {
            templateUrl: 'init.html',
            controller: 'initCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('init.main', {
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