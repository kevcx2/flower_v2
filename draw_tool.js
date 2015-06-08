window.globals = window.globals || {};

//define tool
var drawTool = new Tool();
window.globals.drawTool = drawTool;

//tool settings
var colors = ["#A2BF68","#569E5F","#CC746F","#A45983"];
var drawPath;
var drawThicknessScale = 0.025;
var minLineSize = 0.75;

drawTool.onMouseDown = function (event) {
  drawPath = new Path();
  globals.drawGroup.addChild(drawPath);
  drawPath.fillColor = colors[Math.floor(Math.random() * colors.length)];
};

drawTool.onMouseDrag = function (event) {
  distVector = globals.centerPoint - event.point;
  distFromCenter = distVector.length - 50;
  if (distFromCenter < minLineSize / drawThicknessScale) {
    distFromCenter = minLineSize / drawThicknessScale;
  }

  var step = event.delta;
  step.angle += 90;
  step.length = distFromCenter * drawThicknessScale;

  var top = event.middlePoint + step;
  var bottom = event.middlePoint - step;

  drawPath.add(top);
  drawPath.insert(0, bottom);
  drawPath.smooth();
};

drawTool.onMouseUp = function (event) {
  drawPath.add(event.point);
	drawPath.closed = true;
	drawPath.smooth();
};
