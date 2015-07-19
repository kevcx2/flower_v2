window.globals = window.globals || {};

//settings variables
var numSegments = 10;
var rotation = 360/numSegments;
var centerX = $('canvas').width()/2;
var centerY = $('canvas').height()/2;
var centerPoint = new Point(centerX, centerY);
var segLength = Math.min($('canvas').width(), $('canvas').height()) * 0.48;
var guide;

//setup global properties
globals.centerPoint = centerPoint;
globals.brushSize = 5;
globals.brushWeight = 5;
globals.brushType = 'auto';
globals.animationQueue = [];
globals.$activeLayer = undefined;


//create inital layers
var guideLayer = new Layer();
addWorkingLayer();
updateSegmentDisplay();
drawGuide();
globals.drawTool.showSettingsBox();

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
  for (i = 0; i < numSegments - 1; i++) {
    shapeCopy.rotate(rotation, centerPoint);
    shapeCopy = rotationCopy(shapeCopy);
  }
  shape.rotated = true;
}

function rotationCopy(shape) {
  var newShape = shape.clone();
  newShape.rotated = true;
  return newShape;
}

function onFrame(event) {
  globals.layers.forEach(function(layer) {
    if (layer.animation) {
      layer.animation(layer, layer.animSpeed, layer.animOptions);
    }
  });
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
  // console.log($(event.target));
  if ($(event.target).hasClass('circle-tool')) {
    globals.shapeTool.activate();
    globals.shapeTool.showSettingsBox();
  }
  else if ($(event.target).hasClass('draw-tool')) {
    globals.drawTool.activate();
    globals.drawTool.showSettingsBox();
  }
}

function addWorkingLayer() {
  if (globals.$activeLayer) {
    globals.$activeLayer.removeClass('active-layer');
  }

  newLayer = new Layer();
  newLayer.animation = undefined;

  globals.layers = globals.layers || [];
  globals.layers.push(newLayer);

  $layerDeleteButton = $('<button>').addClass('delete-layer');
  $layerDeleteButton.html('-');
  $layerDeleteButton.on('click', deleteLayer);

  $layerRotateButton = $('<button>').addClass('rotate-anim');
  $layerRotateButton.html('Rotate');
  $layerRotateButton.on('click', globals.animation.rotateLayer);

  $layerBounceButton = $('<button>').addClass('bounce-anim');
  $layerBounceButton.html('Bounce');
  $layerBounceButton.on('click', globals.animation.bounceLayer);

  $layerUiItem = $('<li>').html('Layer ' + newLayer.id);
  $layerUiItem.append($layerDeleteButton);
  $layerUiItem.append($layerRotateButton);
  $layerUiItem.append($layerBounceButton);
  $layerUiItem.attr('id', newLayer.id);

  $('.layers ul').append($layerUiItem);

  $layerUiItem.on('click', setActiveLayer);
  $layerUiItem.addClass('active-layer');
  globals.$activeLayer = $layerUiItem;
}

function setActiveLayer(event) {
  $layerUiItem = $(event.delegateTarget);

  globals.$activeLayer.removeClass('active-layer');
  $layerUiItem.addClass('active-layer');
  globals.$activeLayer = $layerUiItem;

  targetLayerId = parseInt($layerUiItem.attr('id'));
  targetLayer = globals.findLayerById(targetLayerId);
  targetLayer.activate();
  console.log('setActiveLayer clicked!');
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

    globals.findLayerById(targetLayerId).remove();
    $layerUiItem.remove();

    paper.view.draw();
  }
}

globals.findLayerById = function (targetId) {
  targetLayer = undefined;
  project.layers.forEach(function(layer) {
    if (layer.id === targetId) {
      targetLayer = layer;
    }
  });
  return targetLayer;
};
