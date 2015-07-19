window.globals = window.globals || {};

//define tool
var drawTool = new Tool();
window.globals.drawTool = drawTool;

//tool settings
var sizingType = 'auto';
var brushSize = 5;
var colors = ["#A2BF68","#569E5F","#CC746F","#A45983"];
var drawPath;
var drawThicknessScale = 0.025;
var minLineSize = 0.75;

drawTool.onMouseDown = function (event) {
  drawPath = new Path();
  drawPath.rotated = false;
  project.activeLayer.addChild(drawPath);
  drawPath.fillColor = colors[Math.floor(Math.random() * colors.length)];
};

drawTool.onMouseDrag = function (event) {
  var step = event.delta;

  if (sizingType === 'auto') {
    distVector = globals.centerPoint - event.point;
    distFromCenter = distVector.length - 50;
    if (distFromCenter < minLineSize / drawThicknessScale) {
      distFromCenter = minLineSize / drawThicknessScale;
    }

    step.angle += 90;
    step.length = distFromCenter * drawThicknessScale;
  }

  if (sizingType === 'manual') {
    step.angle += 90;
    step.length = brushSize;
  }

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
