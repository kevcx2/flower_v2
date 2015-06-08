window.globals = window.globals || {};

//settings variables
var numSegments = 10;
var rotation = 360/numSegments;
var centerX = $('canvas').width()/2;
var centerY = $('canvas').height()/2;
var centerPoint = new Point(centerX, centerY);
var segLength = Math.min($('canvas').width(), $('canvas').height()) * 0.48;
var tri;

//create inital layers
var guideLayer = new Layer();
var drawLayer = new Layer();
updateSegmentDisplay();

//groups to hold drawings & rotations of original drawings
var rotateGroups = [];
var drawGroup = new Group();

//add neccessary settings to global object
globals.centerPoint = centerPoint;
globals.drawGroup = drawGroup;

//set button events
$('button.rotate').on('click', drawRotation);
$('button.clear').on('click', clearDrawing);
$('button.add-segment').on('click', addSegment);
$('button.remove-segment').on('click', removeSegment);
$('button.tool').on('click', selectTool);

function drawGuide() {
  guideLayer.activate();

  if (tri) {
    tri.remove();
  }

  var t1 = centerPoint;
  var t2 = new Point(centerPoint.x, centerPoint.y - segLength);
  t2 = t2.rotate(rotation/2, centerPoint);
  var t3 = new Point(centerPoint.x, centerPoint.y - segLength);
  t3 = t3.rotate(360 - rotation/2, centerPoint);

  tri = new Path();
  tri.add(t1);
  tri.add(t2);
  tri.add(t3);
  tri.closed = true;
  tri.strokeColor = "#4D4D4D";

  paper.view.draw();
  drawLayer.activate();
}

function drawRotation() {
  length = rotateGroups.length;
  rotateGroups[length] = drawGroup.clone();
  clearDrawGroup();

  //rotate & draw segments
  for(var i = length + 1; i <= length + numSegments; i++) {
    var newGroup = rotateGroups[i-1].clone();
    newGroup.rotate(rotation, centerPoint);
    rotateGroups[i] = newGroup;
  }
  rotateGroups[length].visible = false;
  paper.view.draw();
}

function clearDrawing() {
  rotateGroups.forEach(function (group) {
    group.remove();
  });
  rotateGroups = [];
  clearDrawGroup();
}

function clearDrawGroup() {
  drawGroup.remove();
  drawGroup = new Group();
  globals.drawGroup = drawGroup;
  paper.view.draw();
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
  if ($(event.target).hasClass('circle-tool')) {
    globals.shapeTool.activate();
  }
  else if ($(event.target).hasClass('draw-tool')) {
    globals.drawTool.activate();
  }
}
