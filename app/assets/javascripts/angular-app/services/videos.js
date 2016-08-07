'use strict';

/**
 * @ngdoc service
 * @name apiCakeApp.videoService
 * @description
 * # videoService
 * Service in the wobbleApp.
 */
angular.module('wobbleApp')
  .service('videoService', ['$http', '$q', function ($http, $q) {
    var vm = this;

    vm.query = function(videoId){
      var deferred = $q.defer();

      $http.get('/videos/'+videoId).then(function(response){
        deferred.resolve(response.data);
      }, function(e){
        deferred.reject(e);
      });
      return deferred.promise;
    };

    vm.query_all = function(){
      var deferred = $q.defer();

      $http.get('/videos.json').then(function(response){
        deferred.resolve(response.data);
      }, function(e){
        deferred.reject(e);
      });
      return deferred.promise;
    };

  }]
);
