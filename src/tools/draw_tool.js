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
  if (sizingType === 'auto') {
    distVector = globals.centerPoint - event.point;
    distFromCenter = distVector.length - 50;
    if (distFromCenter < minLineSize / drawThicknessScale) {
      distFromCenter = minLineSize / drawThicknessScale;
    }

    var step = event.delta;
    step.angle += 90;
    step.length = distFromCenter * drawThicknessScale;
  }

  if (sizingType === 'manual') {
    var step = event.delta;
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

drawTool.showSettingsBox = function () {
  var $settingsBox = $('<div>');
  $settingsBox.addClass('draw-settings');
  $settingsBox.html('Draw Settings');

  $autoSizeArea = $('<div>');
  $autoSizeArea.addClass('drawing-size-selector');
  $autoSizeArea.addClass('auto-size');
  $autoSizeArea.addClass('active-size');
  $autoSizeArea.on('click', drawTool.setAutoSize);
  $autoSizeArea.html("Auto");
  $settingsBox.append($autoSizeArea);

  $manualSizeArea = $('<div>');
  $manualSizeArea.addClass('drawing-size-selector');
  $manualSizeArea.addClass('manual-size');
  $manualSizeArea.on('click', drawTool.setManualSize);
  $settingsBox.append($manualSizeArea);

  $manualBrushDemo = $('<div>');
  $manualBrushDemo.addClass('brush-size-demo');
  $manualBrushDemo.css('width', brushSize + 7);
  $manualBrushDemo.css('height', brushSize + 7);
  $manualSizeArea.append($manualBrushDemo);

  $manualSizeUp = $('<button>');
  $manualSizeUp.html('+');
  $manualSizeUp.on('click', function () {
    brushSize += 2;
    $manualBrushDemo.css('width', brushSize + 7);
    $manualBrushDemo.css('height', brushSize + 7);
  }.bind(this));
  $manualSizeArea.append($manualSizeUp);

  $manualSizeDown = $('<button>');
  $manualSizeDown.html('-');
  $manualSizeDown.on('click', function () {
    if (brushSize > 1) {
      brushSize -= 2;
      $manualBrushDemo.css('width', brushSize + 7);
      $manualBrushDemo.css('height', brushSize + 7);
    }
  }.bind(this));
  $manualSizeArea.append($manualSizeDown);

  $('.settings').html('');
  $('.settings').append($settingsBox);
};

drawTool.setAutoSize = function (event) {
  sizingType = 'auto';
  $('.active-size').removeClass('active-size');
  $(event.delegateTarget).addClass('active-size');
};

drawTool.setManualSize = function (event) {
  sizingType = 'manual';
  $('.active-size').removeClass('active-size');
  $(event.delegateTarget).addClass('active-size');
};
