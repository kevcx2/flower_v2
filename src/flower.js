window.globals = window.globals || {};

//settings variables
var numSegments = 10;
var rotation = 360/numSegments;
var centerX = $('canvas').width()/2;
var centerY = $('canvas').height()/2;
var centerPoint = new Point(centerX, centerY);
globals.centerPoint = centerPoint;
var segLength = Math.min($('canvas').width(), $('canvas').height()) * 0.48;
var guide;

//create inital layers
var guideLayer = new Layer();
addWorkingLayer();
updateSegmentDisplay();
drawGuide();

//set button events
$('button.rotate').on('click', drawRotation);
$('button.clear').on('click', clearDrawing);
$('button.add-segment').on('click', addSegment);
$('button.remove-segment').on('click', removeSegment);
$('button.tool').on('click', selectTool);
$('button.add-layer').on('click', addWorkingLayer);

function drawGuide() {
  currLayer = project.activeLayer;
  guideLayer.activate();

  if (guide) {
    guide.remove();
  }

  var t1 = centerPoint;
  var t2 = new Point(centerPoint.x, centerPoint.y - segLength);
  t2 = t2.rotate(rotation/2, centerPoint);
  var t3 = new Point(centerPoint.x, centerPoint.y - segLength);
  t3 = t3.rotate(360 - rotation/2, centerPoint);

  guide = new Path();
  guide.add(t1);
  guide.add(t2);
  guide.add(t3);
  guide.closed = true;
  guide.strokeColor = "#4D4D4D";

  paper.view.draw();
  currLayer.activate();
}

function drawRotation() {
  var rotationQueue = [];
  project.activeLayer.children.forEach(function(child) {
    if (!child.rotated) {
      rotationQueue.push(child);
    }
  });

  rotationQueue.forEach(function(child) {
    _rotate(child);
  });
}

function _rotate(shape) {
  var shapeCopy = rotationCopy(shape);
  for (i = 0; i < numSegments; i++) {
    shapeCopy.rotate(rotation, centerPoint);
    shapeCopy = rotationCopy(shapeCopy);
  }
  shapeCopy.remove();
  shape.rotated = true;
}

function rotationCopy(shape) {
  var newShape = shape.clone();
  newShape.rotated = true;
  return newShape;
}

function clearDrawing() {
  removeQueue = [];
  project.activeLayer.children.forEach(function(child) {
    removeQueue.push(child);
  });

  removeQueue.forEach(function(child) {
    child.remove();
  });
}

function addSegment() {
  numSegments += 1;
  rotation = 360/numSegments;
  updateSegmentDisplay();
  drawGuide();
}

function removeSegment() {
  if (numSegments > 3) {
    numSegments -= 1;
    rotation = 360/numSegments;
    updateSegmentDisplay();
    drawGuide();
  }
}

function updateSegmentDisplay() {
  $('h4.segment-counter').html('Segments: ' + numSegments);
}

function selectTool(event) {
  console.log($(event.target));
  if ($(event.target).hasClass('circle-tool')) {
    globals.shapeTool.activate();
  }
  else if ($(event.target).hasClass('draw-tool')) {
    globals.drawTool.activate();
  }
}

function addWorkingLayer() {
  newLayer = new Layer();
  // newLayer.rotateTracker = 0;
  globals.layers = globals.layers || [];
  globals.layers.push(newLayer);

  $layerDeleteButton = $('<button>').addClass('delete-layer');
  $layerDeleteButton.html('-');
  $layerDeleteButton.on('click', deleteLayer);

  $layerUiItem = $('<li>').html('Layer ' + globals.layers.length);
  $layerUiItem.append($layerDeleteButton);
  $layerUiItem.attr('id', newLayer.id);

  $('.layers ul').append($layerUiItem);
}

function deleteLayer(event) {
  //only delete if there is more than 1 layer - cannot have no layers in a project
  if (globals.layers.length > 1) {

    $layerUiItem = $(event.target).parent();
    targetLayerId = parseInt($layerUiItem.attr('id'));
    //remove layer from global list
    for (var i = 0; i < globals.layers.length; i++) {
      if (globals.layers[i].id === targetLayerId) {
        globals.layers.splice(i, 1);
      }
    }
    //remove layer from paper.js project
    project.layers.forEach(function(layer) {
      if (layer.id === targetLayerId) {
        layer.remove();
        $layerUiItem.remove();
      }
    });
    paper.view.draw();
  }
}
