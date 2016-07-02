//'use strict';
//
//
//angular.module('wobbleApp')
//  .directive('areaChart', ['_', function (_) {
//    var w;
//    var h;
//    var path;
//    var subjects;
//
//    //function defaultSettings(){
//    //    return {
//    //      width: scope.width, // The plot width
//    //      height: scope.height // The plot height
//    //      //margin_left: 10,
//    //      //arc_thickness: 0.2,
//    //      //start_angle: 180,
//    //      //end_angle: 180
//    //    };
//    //  }
//    //
//    //  var config = defaultSettings();
//
//    function createChart (el) {
//      w = el.clientWidth;
//      h = el.clientHeight;
//      //w = 480;
//      //h = 320;
//      console.log('width: ' + w + ' height: ' + h);
//
//      path = d3
//        .select(el)
//        .append('svg')
//        .attr('width', '100%')
//        .attr('height', '100%')
//        .append('g')
//        .append('path');
//    }
//
//    function updateChart (data) {
//      var dates = _.map(data, 'time');
//      var counts = _.map(data, 'votes');
//
//      var x = d3.time.scale()
//        .domain(d3.extent(dates))
//        .range([0, w]);
//
//      var y = d3.scale.linear()
//        .domain(d3.extent(counts))
//        .range([h, 0]);
//
//      var area = d3.svg.area()
//        .interpolate('bundle')
//        .x(function (d) {
//          return x(d.time);
//        })
//        .y0(function (d) {
//          return y(0);
//        })
//        .y1(function (d) {
//          return y(d.votes);
//        });
//
//      path
//        .datum(data)
//        .transition()
//        .duration(450)
//        .attr('d', area);
//    }
//
//    return {
//      restrict: 'E',
//      scope: {
//        chartData: '='
//      },
//      link: function (scope, elem, attr) {
//        createChart(elem[0]);
//        scope.$watch('chartData', function (newVal, oldVal) {
//          console.log('new data');
//          var data = JSON.parse(newVal);
//          //var data = newVal;
//          console.log('new data: ' + JSON.stringify(data));
//          if (data) updateChart(data);
//        });
//      }
//    };
//  }]);


'use strict';

angular.module('wobbleApp')
  .directive('wobble', [ '$timeout', function($timeout) {
    var directive = {
      restrict: 'E',
      scope: {
        width: '@',
        height: '@',
        data: '@'
      },
      link: link
    };

    function link(scope, element, attrs) {

      var x, y, xAxis, yAxis, valueline, svg, width, height;
      var margin = {top: 30, right: 20, bottom: 30, left: 50};

      var setChartParams=function(data, config){

        width = config.width - margin.left - margin.right;
        height = config.height - margin.top - margin.bottom;

        x = d3.time.scale().range([0, width]);
        y = d3.scale.linear().range([height, 0]);

        // Define the axes
        xAxis = d3.svg.axis().scale(x)
          .orient("bottom").ticks(4).tickFormat(d3.time.format("%M:%S"));

        yAxis = d3.svg.axis().scale(y)
          .orient("left").ticks(5);

        // Define the line
        valueline = d3.svg.line()
          .x(function(d) { return x(d.time); })
          .y(function(d) { return y(d.votes); })
          .interpolate("basis");

      };

      scope.createChart = function(el, newVal, config){

        //console.log('create chart wobble');
        var data = JSON.parse(newVal);
        //console.log('data' + JSON.stringify(data) + ' typeof: ' + typeof(newVal));

        var parseTime = d3.time.format("%H:%M:%S").parse;

        data.forEach(function(d) {
          d.time = parseTime(d.time);
          d.votes = +d.votes;
        });

        setChartParams(data, config);

        svg = d3.select(el)
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g").attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

        // Scale the range of the data
        x.domain(d3.extent(data, function(d) { return d.time; }));
        y.domain([d3.min(data, function(d) { return d.votes; }),
          d3.max(data, function(d) { return d.votes; })]);

        // Add the valueline path.
        svg.append("path")
          .attr("class", "line")
          .attr("d", valueline(data));

        // Add the X Axis
        svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

        // Add the Y Axis
        svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);

      };

      scope.redrawChart = function(el, newVal){
        var data = JSON.parse(newVal);

        var parseTime = d3.time.format("%H:%M:%S").parse;

        data.forEach(function(d) {
          d.time = parseTime(d.time);
          d.votes = +d.votes;
        });

        //console.log(JSON.stringify(data));
        setChartParams(data, config);

        // Scale the range of the data
        x.domain(d3.extent(data, function(d) { return d.time; }));
        y.domain([d3.min(data, function(d) { return d.votes; }), d3.max(data, function(d) { return d.votes; })]);

        //console.log('hey: ' + JSON.stringify(data));

        svg = d3.select(el).transition();

        // Make the changes
        svg.select(".line")   // change the line
          .duration(250)
          .attr("d", valueline(data));
        svg.select(".x.axis") // change the x axis
          .duration(250)
          .call(xAxis);
        svg.select(".y.axis") // change the y axis
          .duration(250)
          .call(yAxis);

      };

      function defaultSettings(){
        return {
          width: scope.width, // The plot width
          height: scope.height/2 // The plot height
          //margin_left: 10,
          //arc_thickness: 0.2,
          //start_angle: 180,
          //end_angle: 180
        };
      }

      var config = defaultSettings();

      scope.createChart(element[0], scope.data, config);

      //scope.$watch('ready', function(newVal, oldVal){
      //    if (newVal!=oldVal) {
      //        scope.createChart(element[0], [scope.limit, scope.amount, scope.container], config)
      //    }
      //});
      //scope.$watchGroup(['limit', 'amount', 'container'], function(newValues, oldValues){
      //  //if (newValues!=oldValues) {
      //  scope.createChart(element[0], newValues, config);
      //  //}
      //});
      //scope.$watchGroup(['width', 'height', 'data'], function(newValues, oldValues){
      //  console.log(JSON.stringify(newValues));
      //  //if (newValues!=oldValues) {
      //    scope.createChart(element[0], newValues, config);
      //  //}
      //}, true);

      scope.$watch('data', function(newVal, oldVal){
        //console.log('data changed');
        if (newVal !== oldVal) {
          //scope.createChart(element[0], newVal, config);
          //console.log('vis new data');
          //var config = defaultSettings(element.parent()[0].offsetWidth);
          //scope.createChart(element[0], newVal, config);
          scope.redrawChart(element[0], newVal, config);
        }
      });
    }

    return directive;
}]);

