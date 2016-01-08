// TO DO: 
// Add button to clear keyframes
// Add perspective selection button: -webkit-perspective: 400 -> 800 -> 1200px;
// Add vendor prefixes
// Add Animation Event polyfill

/**
 * Plethora <actor> 2.0 <http://github.com/kostasx/>
 * Copyright 2014 PlethoraThemes <http://plethorathemes.com/>
 */
 ;(function(){

  var mousex    = 0;
  var mousey    = 0;
  var grabx     = 0;
  var graby     = 0;
  var orix      = 0;
  var oriy      = 0;
  var elex      = 0;
  var eley      = 0;
  var algor     = 0;
  var dragobj   = null;
  var keyframes = {
      frame_01 : { x:270, y:0, z:0, set: false },
      frame_02 : { x:270, y:0, z:0, set: false },
      frame_03 : { x:270, y:0, z:0, set: false },
      frame_04 : { x:270, y:0, z:0, set: false },
      frame_05 : { x:270, y:0, z:0, set: false },
      frame_06 : { x:270, y:0, z:0, set: false },
      frame_07 : { x:270, y:0, z:0, set: false },
      frame_08 : { x:270, y:0, z:0, set: false },
      frame_09 : { x:270, y:0, z:0, set: false },
      frame_10 : { x:270, y:0, z:0, set: false }
  }
  var selectedKeyframe = "";

  var tridiv           = document.querySelector(".scene");
      tridiv.rotX      = 270;
      tridiv.rotY      = 0;
      tridiv.rotZ      = 0;

  /* 
  // Building an animationEvents polyfill
  function whichAnimationEvent(event){

      var el = document.createElement('fakeelement');
      var animationEvents = {
        'animation':'animation',
        'MozAnimation':'mozAnimation',
        'WebkitAnimation':'webkitAnimation',
      }

      for( var a in animationEvents){
          if( el.style[a] !== undefined ){
              return animationEvents[a] + event;
          }
      }

  }
  var animationEvent = whichAnimationEvent("start");
      animationEvent && e.addEventListener(animationEvent, function() {
      });
  */

  var plethoraController = function plethoraControllerCb(){

    var rangeInputListener = function(){
      document.body.addEventListener("keydown", function keyDownCb(e){
        switch(e.keyCode){
          case 37:  // LEFT
            tridiv.rotY--;
            break;
          case 38:  // TOP
            tridiv.rotX++;
            break;
          case 39:  // RIGHT
            tridiv.rotY++;
            break;
          case 40:  // BOTTOM
            tridiv.rotX--;
            break;
          default:
            break;
        }
        tridiv.style.webkitTransform = "rotateX(" + tridiv.rotX + "deg) rotateY(" + tridiv.rotY + "deg) rotateZ(" + tridiv.rotZ + "deg)"
      });
    }

    rangeInputListener();

  }

  var animator = function(){

    $(".timeline").find("ul").on("click", "li", function(e){

      var currentTargetID = e.currentTarget.id;
      selectedKeyframe    = currentTargetID.replace( "frame_", "" );
      var _keyframe       = keyframes[currentTargetID];

      if ( keyframes[currentTargetID].set === false ){

        for ( var i = selectedKeyframe-1; i > 0 ; i-- ){

          if ( keyframes["frame_0" + i].set === true ){

            var _prevKeyframe = keyframes["frame_0" + i];
            var _keyframeDiv = $( "#" + currentTargetID );
                _keyframe.x = _prevKeyframe.x;
                _keyframe.y = _prevKeyframe.y;          
                _keyframe.z = _prevKeyframe.z;

                _keyframeDiv.find(".framex").text(_prevKeyframe.x);
                _keyframeDiv.find(".framey").text(_prevKeyframe.y);
                _keyframeDiv.find(".framez").text(_prevKeyframe.z);
          }

        }

      } else {

        tridiv.rotX = _keyframe.x;
        tridiv.rotY = _keyframe.y;
        tridiv.rotZ = _keyframe.z;
        updateTridiv();

      }

      var ul = e.delegateTarget.querySelectorAll("li"); 
      [].forEach.call(
        ul, 
        function(li){
          li.firstElementChild.style.backgroundColor = "transparent";
        }
      );
      e.currentTarget.childNodes[1].style.backgroundColor = "rgba(235, 255, 0, 0.79)";
    });
  }

  animator();

  function falsefunc() { return false; } // used to block cascading events

  function init()
  {
    document.onmousemove = update; // update(event) implied on NS, update(null) implied on IE
    update();
  }

  function getMouseXY(e) { // works on IE6,FF,Moz,Opera7
    if (!e) e = window.event; // works on IE, but not NS (we rely on NS passing us the event)

    if (e)
    { 
      if (e.pageX || e.pageY)
      { 
        mousex = e.pageX;
        mousey = e.pageY;
        algor = '[e.pageX]';
        if (e.clientX || e.clientY) algor += ' [e.clientX] '
      }
      else if (e.clientX || e.clientY)
      { 
        mousex = e.clientX + document.body.scrollLeft;
        mousey = e.clientY + document.body.scrollTop;
        algor = '[e.clientX]';
        if (e.pageX || e.pageY) algor += ' [e.pageX] '
      }  
    }
  }

  function update(e) {
    var _mousex = mousex;
    var _mousey = mousey;
    getMouseXY(e); // NS is passing (event), while IE is passing (null)
    // tridiv.rotY = ( mousey > _mousey ) ? tridiv.rotY-1 : tridiv.rotY+1 ;
    // tridiv.rotY = ( mousex > _mousex ) ? tridiv.rotY-1 : tridiv.rotY+1 ;
    // tridiv.style.webkitTransform = "rotateX(" + tridiv.rotX + "deg) rotateY(" + tridiv.rotY + "deg) rotateZ(" + tridiv.rotZ + "deg)"
  }

  function grab(context){
    document.onmousedown = falsefunc; // in NS this prevents cascading of events, thus disabling text selection
    dragobj = context;
    dragobj.style.zIndex = 10; // move it to the top
    document.onmousemove = drag;
    document.onmouseup = drop;
    grabx = mousex;
    graby = mousey;
    elex = orix = dragobj.offsetLeft;
    eley = oriy = dragobj.offsetTop;
    update();
  }

  function drag(e){ // parameter passing is important for NS family 
    if (dragobj)
    {
      elex = orix + (mousex-grabx);
      eley = oriy + (mousey-graby);
      dragobj.style.position = "absolute";
      dragobj.style.left = (elex).toString(10) + 'px';
      dragobj.style.top  = (eley).toString(10) + 'px';
    }
    update(e);
    return false; // in IE this prevents cascading of events, thus text selection is disabled
  }

  function drop(){
    if (dragobj)
    {
      dragobj.style.zIndex = 0;
      dragobj = null;
    }
    update();
    document.onmousemove = update;
    document.onmouseup = null;
    document.onmousedown = null;   // re-enables text selection on NS
  }

  function updateTridiv(xyz){
    var transformValue           = "rotateX(" + tridiv.rotX + "deg) rotateY(" + tridiv.rotY + "deg) rotateZ(" + tridiv.rotZ + "deg)";
    tridiv.style.webkitTransform = tridiv.style.mozTransform = tridiv.style.Transform = transformValue;
  }

  function rangeToPercentage( start, end ){
    var percentage = [];
    for ( var i = 0; i < 100; i++ ) {
      percentage[i] = ( ( i + 1 ) * ( end - start ) ) / 100;
    };
    return percentage;
  }

  function animate(){

    var find = document.getElementsByTagName("head")[0].querySelector("style");
    if ( find !== null ){
      document.head.removeChild(find);
      $(".scene").removeClass("animate");
      // TRIGGERING REFLOW IN ORDER TO RESTART THE ANIMATION (Thanks Chris!)
      document.body.querySelector(".scene").offsetWidth = document.body.querySelector(".scene").offsetWidth;
    }

    var cssAnimation = document.createElement('style');
        cssAnimation.type = 'text/css';
        cssAnimation.setAttribute("data-animation","enabled");

    var rules = '.animate { -webkit-animation-duration:10s; -webkit-animation-name:slidein; }';

       rules += '@-webkit-keyframes slidein {';
        for ( var i = 1; i <= 10; i++ ){
          var counter = ( i !== 10 ) ? "0" + i : "10"; 

          if ( keyframes["frame_" + counter].set === true ){
            if ( i === 1 ) {
              rules += 'from  { -webkit-transform: rotateX(' + keyframes[ "frame_" + counter ].x + 'deg) rotateY(' + keyframes[ "frame_" + counter ].y + 'deg) rotateZ(' + keyframes[ "frame_" + counter ].z + 'deg) }';
            } else if ( i === 10 ) {
              rules += 'to { -webkit-transform: rotateX(' + keyframes[ "frame_" + counter ].x + 'deg) rotateY(' + keyframes[ "frame_" + counter ].y + 'deg) rotateZ(' + keyframes[ "frame_" + counter ].z + 'deg) }';
            } else {
              rules += ( i * 10 ) + '%  { -webkit-transform: rotateX(' + keyframes[ "frame_" + counter ].x + 'deg) rotateY(' + keyframes[ "frame_" + counter ].y + 'deg) rotateZ(' + keyframes[ "frame_" + counter ].z + 'deg) }';
            }
          }
        }
        rules += '}';

    rules = document.createTextNode(rules);
    cssAnimation.appendChild(rules);
    var res = document.getElementsByTagName("head")[0].appendChild(cssAnimation);

    console.log(rules);

    $(".scene").addClass("animate");

  }

  function animationHandlers(el){

    el.addEventListener("webkitAnimationStart", function(e){
      console.log("webkitanimationstart");
      console.log(e);
      $(".blink").addClass("launchStart");
    }, false);
   
    el.addEventListener("webkitAnimationEnd", function(e){
      $(".blink").removeClass("launchStart");
      console.log("webkitanimationend");
      console.log(e);
    }, false);
   
  }

  $(function(){

    animationHandlers( document.body.querySelector(".scene") );

    plethoraController();

    $(".launch").on("click", function(){ animate(); });

    $("#controls").on("input", "input",function(e){

      var _currentFrame = "#frame_" + selectedKeyframe;
      var _target       = e.target;
      var _value        = _target.value;

      switch(_target.name){
        case "rotX":
          tridiv.rotX = _value;
          $("span.rotX").text(_value);
          $(_currentFrame).find(".framex").text(_value);
          if ( selectedKeyframe !== "" ) {
            keyframes["frame_" + selectedKeyframe].x = _value;
            keyframes["frame_" + selectedKeyframe].set = true;
          }
          break;
        case "rotY":
          tridiv.rotY = _value;
          $("span.rotY").text(_value);
          $(_currentFrame).find(".framey").text(_value);
          if ( selectedKeyframe !== "" ) {
            keyframes["frame_" + selectedKeyframe].y = _value;
            keyframes["frame_" + selectedKeyframe].set = true;
          }
          break;
        case "rotZ":
          tridiv.rotZ = _value;
          $("span.rotZ").text(_value);
          $(_currentFrame).find(".framez").text(_value);
          if ( selectedKeyframe !== "" ) {
            keyframes["frame_" + selectedKeyframe].z = _value;
            keyframes["frame_" + selectedKeyframe].set = true;
          }
          break;
        default:
          break;
       }
       updateTridiv();
    });

  });

}.call(this));