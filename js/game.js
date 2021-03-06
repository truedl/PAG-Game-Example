var pag = Game('game', {'w': 800, 'h': 600, 'loadInto': 'load'});
var player = new Controller(pag.game.width/2-15, pag.game.height/2-15);
var detect = pag.object.collision.detect;
var __fruit = [];
var i = 0;
var _score = 0;
var mode = 'idle';
var __level = 'main';
var __load = {
  'main': {
    load: function(){
      pag.draw.color('#6c85b9');
      pag.draw.custom(0, 0, pag.game.width, pag.game.height);
      pag.draw.color('#000');
      pag.draw.custom(0, 0, 100, 600);
      pag.draw.custom(700, 0, 100, 600);
      pag.set.font('22px sans-serif');
      pag.draw.color('#fff');
      pag.draw.text('Score: '+_score, 10, 32);
    }
  },
  'lose': {
    load: function(){
      pag.set.font('52px sans-serif');
      pag.draw.color('#e83131');
      pag.draw.text('You Lose', 10, 42);
      pag.set.font('22px sans-serif');
      pag.draw.color('#000');
      pag.draw.text('Score: '+_score, 10, 68);
    }
  }
}

pag.image.load('point', 'content/point.png');
pag.image.load('bomb', 'content/bomb.png');

pag.animate.start(6, 'player-idle', ['content/idle-1.png', 'content/idle-2.png', 'content/idle-3.png', 'content/idle-2.png']);
pag.animate.start(6, 'player-move', ['content/move-1.png', 'content/move-2.png']);

pag.control.start();
pag.onkey.do(100, function(){
  if(detect(pag.object.collision.box, '+x5', player, {'pos': [700, 0], 'size': [60, 600]})){
    return;
  } else {
    player.x += 5;
  }
})

pag.onkey.do(97, function(){
  if(detect(pag.object.collision.box, '-x5', player, {'pos': [0, 0], 'size': [100, 600]})){
    return;
  } else {
    player.x -= 5;
  }
})

pag.onkey.do(115, function(){
  if(detect(pag.object.collision.box, '+y5', player, {'pos': [100, 100], 'size': 30})){
    return;
  } else {
    player.y += 5;
  }
})

pag.onkey.do(119, function(){
  if(detect(pag.object.collision.box, '-y5', player, {'pos': [100, 100], 'size': 30})){
    return;
  } else {
    player.y -= 5;
  }
})

function gint(f, t){
  return Math.floor(Math.random()*(t-f))+f;
}

function addPoint(){
  if(__level != 'lose'){
    _score += 1;
  }
}

function fallObj(x, y, d){
  this.x = x;
  this.y = y;
  this.d = d;
}

function startObj(obj, _i){
  var _temp = setInterval(function(){
    if(__level == 'lose'){
      clearInterval(_temp);
      return;
    }

    if(detect(pag.object.collision.box, '+y5', new Controller(obj.x, obj.y), {'pos': [player.x, player.y], 'size': 32})){
      if(obj.d == false){
        addPoint();
        obj.x = gint(100, 600);
        obj.y = gint(0, 50);
        obj.d = Math.random() >= 0.50;
      } else {
        __level = 'lose';
        __fruit = [];
      }
    } else {
      obj.y += 5;
    }

    if(obj.y+5 >= 580){
      obj.x = gint(100, 600);
      obj.y = gint(0, 50);
      obj.d = Math.random() >= 0.50;
    }
  }, 1000/12)
}

function doObj(){
  __fruit.push(new fallObj(gint(100, 700), gint(0, 50), Math.random() >= 0.50));
  startObj(__fruit[i], i);
  i++;
}

function drawObjs(){
  for(var i = 0; i < __fruit.length; i++){
    if(__fruit[i].d){
      pag.draw.image('bomb', __fruit[i].x, __fruit[i].y);
    } else {
      pag.draw.image('point', __fruit[i].x, __fruit[i].y);
    }
  }
}

var _create = setInterval(function(){
  if(__fruit.length < 26){
    doObj();
  } else {
    clearInterval(_create);
  }
}, 240)

pag.update(24, function(){
  __load[__level].load();
  if(__level != 'lose'){
    drawObjs();
    if(pag.control.n.length > 0){
      mode = 'move';
    } else {
      mode = 'idle';
    }
    if(mode == 'idle'){
      pag.draw.animate(pag.animate.it('player-idle'), player.x, player.y);
    } else if(mode == 'move'){
      pag.draw.animate(pag.animate.it('player-move'), player.x, player.y);
    }
    pag.control.check();
  }
})
