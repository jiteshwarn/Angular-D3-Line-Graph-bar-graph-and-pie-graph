var app = angular.module("d3App", []);

app.controller("graphController", function ($scope, drawGraph) {
        drawGraph.draw();

});
