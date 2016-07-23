'use strict';

angular.module('wobbleApp')
  .directive('smallWobble', [ '$timeout', function($timeout) {
    var directive = {
      restrict: 'E',
      scope: {
        width: '@',
        height: '@',
        data: '@',
        circle: '@',
        min: '@',
        max: '@'
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
          .orient("bottom").ticks(4).tickSubdivide(true).tickFormat(d3.time.format("%M:%S"));

        yAxis = d3.svg.axis().scale(y)
          .orient("left").ticks(5);

        // Define the line
        valueline = d3.svg.line()
          .x(function(d) { return x(d.time); })
          .y(function(d) { return y(d.votes); })
          .interpolate("monotone");
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
          .style("margin-left", "-50px")
          .append("g").attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

        // Scale the range of the data
        x.domain(d3.extent(data, function(d) { return d.time; }));
        y.domain([-1,1]);

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

        svg.append("circle")
          .attr("class", "dot")
          .fill('blue');

      };

      scope.redrawChart = function(el, newVal, config){
        var data = JSON.parse(newVal);

        var parseTime = d3.time.format("%H:%M:%S").parse;

        data.forEach(function(d) {
          d.time = parseTime(d.time);
          d.votes = +d.votes;
        });

        //console.log(JSON.stringify(data));
        setChartParams(data, config);

        // Scale the range of the data
        //var min = d3.min(data, function(d) { return d.votes; });
        //var max = d3.max(data, function(d) { return d.votes; });
        //console.log('undefined min?: ' + typeof scope.min === "undefined" + ' , min: ' + scope.min );
        var min = (typeof(scope.min)==='undefined')? d3.min(data, function(d) { return d.votes; }):scope.min;
        var max = (typeof(scope.max)==='undefined')? d3.min(data, function(d) { return d.votes; }):scope.max;
        x.domain(d3.extent(data, function(d) { return d.time; }));
        y.domain([min < -1.0 ? min: -1.0, max > 1.0 ? max: 1.0]);

        //console.log('hey: ' + JSON.stringify(data));

        svg = d3.select(el).transition();

        // Make the changes
        svg.select(".line")   // change the line
          .duration(0)
          .attr("d", valueline(data));
        svg.select(".x.axis") // change the x axis
          .duration(250)
          .call(xAxis);
        svg.select(".y.axis") // change the y axis
          .duration(250)
          .call(yAxis);
        svg.select(".dot")
          .duration(0)
          .attr("cx", x(0))
          .attr("cy", y(0))
          .attr("r", 4);

      };

      scope.redrawCircle = function(el, newVal){
        var d = JSON.parse(newVal);

        var parseTime = d3.time.format("%H:%M:%S").parse;

        var data = {
          time: parseTime(d.time),
          votes: +d.votes
        };

        //console.log('circle: ' + JSON.stringify(data));

        svg = d3.select(el).transition();

        svg.select(".dot")
          .duration(0)
          .attr("cx", x(data.time))
          .attr("cy", y(data.votes));
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


      scope.$watch('circle', function(newVal, oldVal){

        if (newVal !== oldVal && newVal.length>0) {
          //console.log(newVal);
          //console.log('circle : ' + JSON.stringify(newVal));
          //scope.redrawChart(element[0], newVal, config);
          scope.redrawCircle(element[0], newVal);
        }
      });

    }

    return directive;
  }]);

