var wheel = require('wheel')
var eventify = require('ngraph.events')
var kinetic = require('./lib/kinetic.js')
var animate = require('amator');
var THREE = require('three');


/**
 * Creates a new input controller.
 *
 * @param {Object} camera - a three.js perspective camera object.
 * @param {DOMElement+} owner - owner that should listen to mouse/keyboard/tap
 * events. This is optional, and defaults to document.body.
 * @param {Object3D} toKeepInBounds - a three.js Object3D to confine the bounds
 * of the visible region. The camera FOV will max out at the height of the image
 * so the container is completely full with the image at all times.
 *
 *
 * @returns {Object} api for the input controller. It currently supports only one
 * method `dispose()` which should be invoked when you want to to release input
 * controller and all events.
 *
 * Consumers can listen to api's events via `api.on('change', function() {})`
 * interface. The change event will be fire every time when camera's position changed.
 */
export default function panzoom(camera, owner, toKeepInBounds, minDepth, maxDepth) {
  var isDragging = false
  var panstartFired = false
  var touchInProgress = false
  var lastTouchTime = new Date(0)
  var smoothZoomAnimation, smoothPanAnimation;
  var panPayload = {
    dx: 0,
    dy: 0
  }
  var zoomPayload = {
    dx: 0,
    dy: 0,
    dz: 0
  }

  var lastPinchZoomLength

  var mousePos = {
    x: 0,
    y: 0
  }

  owner = owner || document.body;
  owner.setAttribute('tabindex', 1); // TODO: not sure if this is really polite

  var smoothScroll = kinetic(getCameraPosition, {
    scrollCallback: onSmoothScroll
  })

  wheel.addWheelListener(owner, onMouseWheel)

  var toKeepInBoundsBounding = new THREE.Box3().setFromObject(toKeepInBounds)
  var api = eventify({
    dispose: dispose,
    speed: 0.02,
    min: minDepth,
    max: maxDepth,
    yUpperBound: toKeepInBoundsBounding.max.y,
    yLowerBound: toKeepInBoundsBounding.min.y,
    xLowerBound: toKeepInBoundsBounding.min.x,
    xUpperBound: toKeepInBoundsBounding.max.x
  })

  owner.addEventListener('mousedown', handleMouseDown)
  owner.addEventListener('touchstart', onTouch)
  owner.addEventListener('keydown', onKeyDown)

  return api;

  function onTouch(e) {
    var touchTime = new Date();
    var timeBetweenTaps = touchTime - lastTouchTime;
    lastTouchTime = touchTime;

    var touchesCount = e.touches.length;

    if (timeBetweenTaps < 400 && touchesCount === 1) {
      handleDoubleTap(e);
    } else if (touchesCount < 3) {
      handleTouch(e)
    }
  }

  function onKeyDown(e) {
    var x = 0, y = 0, z = 0
    if (e.keyCode === 38) {
      y = 1 // up
    } else if (e.keyCode === 40) {
      y = -1 // down
    } else if (e.keyCode === 37) {
      x = 1 // left
    } else if (e.keyCode === 39) {
      x = -1 // right
    } else if (e.keyCode === 189 || e.keyCode === 109) { // DASH or SUBTRACT
      z = 1 // `-` -  zoom out
    } else if (e.keyCode === 187 || e.keyCode === 107) { // EQUAL SIGN or ADD
      z = -1 // `=` - zoom in (equal sign on US layout is under `+`)
    }
    // TODO: Keypad keycodes are missing.

    if (x || y) {
      e.preventDefault()
      e.stopPropagation()
      smoothPanByOffset(4 * x, 4 * y)
    }

    if (z) {
      smoothZoom(owner.clientWidth/2, owner.clientHeight/2, z)
    }
  }

  function getPinchZoomLength(finger1, finger2) {
    return (finger1.clientX - finger2.clientX) * (finger1.clientX - finger2.clientX) +
      (finger1.clientY - finger2.clientY) * (finger1.clientY - finger2.clientY)
  }

  function handleTouch(e) {
    e.stopPropagation()
    e.preventDefault()

    setMousePos(e.touches[0])

    if (!touchInProgress) {
      touchInProgress = true
      window.addEventListener('touchmove', handleTouchMove)
      window.addEventListener('touchend', handleTouchEnd)
      window.addEventListener('touchcancel', handleTouchEnd)
    }
  }

  function handleDoubleTap(e) {
    e.stopPropagation()
    e.preventDefault()

    var tap = e.touches[0];

    smoothScroll.cancel();

    smoothZoom(tap.clientX, tap.clientY, -1);
  }

  function smoothPanByOffset(x, y) {
    if (smoothPanAnimation) {
      smoothPanAnimation.cancel();
    }

    var from = { x: x, y: y }
    var to = { x: x, y: y }
    var to = { x: 2 * x, y: 2 * y }
    smoothPanAnimation = animate(from, to, {
      easing: 'linear',
      duration: 0,
      step: function(d) {
        panByOffset(d.x, d.y)
      }
    })
  }

  function smoothZoom(x, y, scale) {
    var from = { delta: scale }
    var to = { delta: scale * 2 }

    console.log("debug:: from - to", from ,to)

    if (smoothZoomAnimation) {
      smoothZoomAnimation.cancel();
    }

    smoothZoomAnimation = animate(from, to, {
      duration: 200,
      step: function(d) {
        var scaleMultiplier = getScaleMultiplier(d.delta);
        zoomTo(x, y, scaleMultiplier)
      }
    })
  }

  function handleTouchMove(e) {
    triggerPanStart()

    if (e.touches.length === 1) {
      e.stopPropagation()
      var touch = e.touches[0]

      var dx = touch.clientX - mousePos.x
      var dy = touch.clientY - mousePos.y

      setMousePos(touch)

      panByOffset(dx, dy)
    } else if (e.touches.length === 2) {
      // it's a zoom, let's find direction
      var t1 = e.touches[0]
      var t2 = e.touches[1]
      var currentPinchLength = getPinchZoomLength(t1, t2)

      var delta = 0
      if (currentPinchLength < lastPinchZoomLength) {
        delta = 1
      } else if (currentPinchLength > lastPinchZoomLength) {
        delta = -1
      }

      var scaleMultiplier = getScaleMultiplier(delta)

      setMousePosFromTwoTouches(e);

      zoomTo(mousePos.x, mousePos.y, scaleMultiplier)

      lastPinchZoomLength = currentPinchLength

      e.stopPropagation()
      e.preventDefault()
    }
  }

  function setMousePosFromTwoTouches(e) {
    var t1 = e.touches[0]
    var t2 = e.touches[1]
    mousePos.x = (t1.clientX + t2.clientX)/2
    mousePos.y = (t1.clientY + t2.clientY)/2
  }

  function handleTouchEnd(e) {
    if (e.touches.length > 0) {
      setMousePos(e.touches[0])
    } else {
      touchInProgress = false
      triggerPanEnd()
      disposeTouchEvents()
    }
  }

  function disposeTouchEvents() {
    window.removeEventListener('touchmove', handleTouchMove)
    window.removeEventListener('touchend', handleTouchEnd)
    window.removeEventListener('touchcancel', handleTouchEnd)
  }

  function getCameraPosition() {
    return camera.position
  }

  function onSmoothScroll(x, y) {
    const [x1, x2, y1, y2] = getVisibleCoordinates(toKeepInBounds.position.z)
    if ((x1 < api.xLowerBound) || (x2 > api.xUpperBound)) {
      camera.position.x = camera.position.x
    } else if ((y1 < api.yLowerBound) || (y2 > api.yUpperBound)
    ) {
      camera.position.y = camera.position.y
    } else {
      api.fire('change')
      camera.position.x = x;
      camera.position.y = y;
    }
  }

  function handleMouseDown(e) {
    isDragging = true
    setMousePos(e)

    window.addEventListener('mouseup', handleMouseUp, true)
    window.addEventListener('mousemove', handleMouseMove, true)
  }

  function handleMouseUp() {
    disposeWindowEvents()
    isDragging = false
    owner.style.cursor = "pointer"

    triggerPanEnd()
  }

  function setMousePos(e) {
    mousePos.x = e.clientX
    mousePos.y = e.clientY
  }

  function handleMouseMove(e) {
    if (!isDragging) return

    const pixelsToStartPan = 1
    var dx = e.clientX - mousePos.x
    var dy = e.clientY - mousePos.y

    if (Math.abs(dx) > pixelsToStartPan || Math.abs(dy) > pixelsToStartPan) {
      owner.style.cursor = "grabbing"
      triggerPanStart()
      panByOffset(dx, dy)
    }

    setMousePos(e)
  }

  function triggerPanStart() {
    if (!panstartFired) {
      api.fire('panstart')
      panstartFired = true
      // @TODO: if we want momentum based movement uncomment the below
      // smoothScroll.start()
    }
  }

  function triggerPanEnd() {
    if (panstartFired) {
      smoothScroll.stop()
      api.fire('panend')
      panstartFired = false
    }
  }

  function disposeWindowEvents() {
    window.removeEventListener('mouseup', handleMouseUp, true)
    window.removeEventListener('mousemove', handleMouseMove, true)
  }

  function dispose() {
    wheel.removeWheelListener(owner, onMouseWheel)
    disposeWindowEvents()
    disposeTouchEvents()

    smoothScroll.cancel()
    triggerPanEnd()

    owner.removeEventListener('mousedown', handleMouseDown)
    owner.removeEventListener('touchstart', onTouch)
    owner.removeEventListener('keydown', onKeyDown)
  }

  function panByOffset(dx, dy) {
    var currentScale = getCurrentScale()

    //@TODO: CC custom
    const dampenFactor = 1

    panPayload.dx = -dx/(currentScale * dampenFactor)
    panPayload.dy = dy/(currentScale * dampenFactor)

    const [x1, x2, y1, y2] = getVisibleCoordinates(toKeepInBounds.position.z)
    if ((x1 < api.xLowerBound && panPayload.dx < 0) || (x2 > api.xUpperBound && panPayload.dx > 0)) {
      camera.position.x = camera.position.x
    } else if ((y1 < api.yLowerBound && panPayload.dy < 0) || (y2 > api.yUpperBound && panPayload.dy > 0)) {
      camera.position.y = camera.position.y
    } else {
      // we fire first, so that clients can manipulate the payload
      api.fire('beforepan', panPayload)
      camera.position.x += panPayload.dx
      camera.position.y += panPayload.dy
    }

    api.fire('change')
  }

  function onMouseWheel(e) {
    e.preventDefault()

    var scaleMultiplier = getScaleMultiplier(e.deltaY)
    smoothScroll.cancel()
    zoomTo(e.clientX, e.clientY, scaleMultiplier)
  }

  function zoomTo(offsetX, offsetY, scaleMultiplier) {
    var currentScale = getCurrentScale()

    var dx = (offsetX - owner.clientWidth / 2) / currentScale
    var dy = (offsetY - owner.clientHeight / 2) / currentScale

    var newZ = camera.position.z * scaleMultiplier
    if (newZ < api.min || newZ > api.max) {
      return
    }

    const [x1, x2, y1, y2] = getVisibleCoordinates(toKeepInBounds.position.z)

    zoomPayload.dz = newZ - camera.position.z
    zoomPayload.dx = -(scaleMultiplier - 1) * dx
    zoomPayload.dy = (scaleMultiplier - 1) * dy


    const futureX1 = x1 + zoomPayload.dx
    const futureX2 = x2 + zoomPayload.dx
    const futureY1 = y1 + zoomPayload.dy
    const futureY2 = y2 + zoomPayload.dy
    const isZoomingOut = zoomPayload.dz > 0


    if ((futureX1) < api.xLowerBound) {
      if (isZoomingOut) {
        zoomPayload.dx += Math.abs(zoomPayload.dz / 10)
      }
      // console.log("debug:: we want to push right")
    }

    if ((futureX2) > api.xUpperBound) {
      if (isZoomingOut) {
        zoomPayload.dx -= Math.abs(zoomPayload.dz / 10)
      }
      // console.log("debug:: we want to push left")
    }

    if ((futureY1) < api.yLowerBound) {
      if (isZoomingOut) {
        zoomPayload.dy += Math.abs(zoomPayload.dz / 10)
      }
    }

    if ((futureY2) > api.yUpperBound) {
      if (isZoomingOut) {
        zoomPayload.dy -= Math.abs(zoomPayload.dz / 10)
      }
    }

    api.fire('beforezoom', zoomPayload)

    camera.position.z += zoomPayload.dz
    camera.position.x += zoomPayload.dx
    camera.position.y += zoomPayload.dy

    api.fire('change')
  }

  function getVisibleCoordinates(depth) {
    const height = visibleHeightAtZDepth(depth, camera)
    const width = visibleWidthAtZDepth(depth, camera)

    const x1 =  camera.position.x - (width/2)
    const x2 =  camera.position.x + (width/2)
    const y1 = camera.position.y - (height/2)
    const y2 = camera.position.y + (height/2)
    return [x1, x2, y1, y2]
  }

  function visibleHeightAtZDepth( depth, camera ) {
    // compensate for cameras not positioned at z=0
    const cameraOffset = camera.position.z;
    if ( depth < cameraOffset ) depth -= cameraOffset;
    else depth += cameraOffset;

    // vertical fov in radians
    const vFOV = camera.fov * Math.PI / 180;

    // Math.abs to ensure the result is always positive
    return 2 * Math.tan( vFOV / 2 ) * Math.abs( depth );
  };

  function visibleWidthAtZDepth( depth, camera ) {
    const height = visibleHeightAtZDepth( depth, camera );
    return height * camera.aspect;
  };

  function getCurrentScale() {
    // TODO: This is the only code that depends on camera. Extract?
    // vertical field of view in radians
    var vFOV = camera.fov * Math.PI / 180
    var height = 2 * Math.tan( vFOV / 2 ) * camera.position.z
    var currentScale = owner.clientHeight / height
    return currentScale
  }

  function getScaleMultiplier(delta) {
    var scaleMultiplier = 1
    if (delta > 10) {
      delta = 10;
    } else if (delta < -10) {
      delta = -10;
    }
    scaleMultiplier = (1 + api.speed * delta)

    return scaleMultiplier
  }
}

