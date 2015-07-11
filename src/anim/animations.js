window.globals = window.globals || {};
globals.animation = globals.animation || {};

globals.animation.bounceLayer = function (event) {
  event.stopPropagation();

  $layerUiItem = $(event.target).parent();
  targetLayerId = parseInt($layerUiItem.attr('id'));
  targetLayer = globals.findLayerById(targetLayerId);
  targetLayer.scaleFactor = 1;

  targetLayer.animSpeed = Math.random() * 0.5;
  targetLayer.animOptions = {inBounce: true, min: .1, max: 1, scaleSpeed: .01};

  if (targetLayer.animation === undefined) {
    targetLayer.animation = function (layer, speed, options) {
      var scaleSpeed = options.scaleSpeed;

      if (options && options.inBounce) {
        if (layer.scaleFactor < options.min) {
          layer.animOptions.inBounce = false;
        }
        else {
          layer.scale(1 - scaleSpeed, globals.centerPoint);
          layer.scaleFactor = layer.scaleFactor * (1 - scaleSpeed);
          // console.log(layer.scaleFactor);
        }
      }
      else {
        if (layer.scaleFactor < options.max) {
          layer.scale(1 + scaleSpeed, globals.centerPoint);
          layer.scaleFactor = layer.scaleFactor * (1 + scaleSpeed);
          // console.log(layer.scaleFactor);
        }
        else {
          layer.animOptions.inBounce = true;
        }
      }
    };
  }

  else {
    targetLayer.animation = undefined;
  }
  // console.log('bounced layer' + targetLayerId);
}

globals.animation.rotateLayer = function (event) {
  event.stopPropagation();

  $layerUiItem = $(event.target).parent();
  targetLayerId = parseInt($layerUiItem.attr('id'));
  targetLayer = globals.findLayerById(targetLayerId);

  targetLayer.animSpeed = Math.random() * 0.5;

  if (targetLayer.animation === undefined) {
    targetLayer.animation = function (layer, speed) {
      layer.rotate(speed, globals.centerPoint);
    };
  }

  else {
    targetLayer.animation = undefined;
  }
}
