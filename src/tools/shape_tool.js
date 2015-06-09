window.globals = window.globals || {};

//define tool
var shapeTool = new Tool();
window.globals.shapeTool = shapeTool;

shapeTool.onMouseDown = function (event) {
  distVector = globals.centerPoint - event.point;

  if (globals.brushType === 'auto') {
    var strokeWidth = distVector.length / 30;
    var brushSize = distVector.length / 5;

    if (strokeWidth < 1) {
      strokeWidth = 1;
    }
    if (brushSize < 30) {
      brushSize = 30;
    }
  }

  var circle = new Path.Circle(event.point, brushSize);
  circle.rotated = false;
  circle.strokeColor = 'black';
  circle.strokeWidth = strokeWidth;
  project.activeLayer.addChild(circle);
};
