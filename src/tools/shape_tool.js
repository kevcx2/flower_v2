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

  var shape = new Path.Circle(event.point, brushSize);
  shape.rotated = false;
  shape.strokeColor = 'black';
  shape.strokeWidth = strokeWidth;
  project.activeLayer.addChild(shape);
};

shapeTool.showSettingsBox = function () {
  $settingsBox = $('<div>')
  $settingsBox.addClass('shape-settings');
  $settingsBox.html('Shape Settings');

  $circleButton = $('<button>')
  $circleButton.html('⃝');
  $settingsBox.append($circleButton);

  $circleButton = $('<button>')
  $circleButton.html('⃝');
  $settingsBox.append($circleButton);

  $('.settings').html('');
  $('.settings').append($settingsBox);
};
