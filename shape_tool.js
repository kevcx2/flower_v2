window.globals = window.globals || {};

//define tool
var shapeTool = new Tool();
window.globals.shapeTool = shapeTool;

var circleSize = 50;

shapeTool.onMouseDown = function (event) {
  var circle = new Path.Circle(event.point, circleSize);
  circle.strokeColor = 'black';
  globals.drawGroup.addChild(circle);
};
