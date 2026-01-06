const textBox = document.querySelector('.text-box');

textBox.addEventListener('click', () => {
  textBox.classList.toggle('flipped');
});


const balloonContainer = document.getElementById("balloon-container");

function random(num) {
  return Math.floor(Math.random() * num);
}

function getRandomStyles() {
  var r = random(255);
  var g = random(255);
  var b = random(255);
  var mt = random(200);
  var ml = random(50);
  var dur = random(5) + 5;
  return `
  background-color: rgba(${r},${g},${b},0.7);
  color: rgba(${r},${g},${b},0.7); 
  box-shadow: inset -7px -3px 10px rgba(${r - 10},${g - 10},${b - 10},0.7);
  margin: ${mt}px 0 0 ${ml}px;
  animation: float ${dur}s ease-in infinite
  `;
}

function createBalloons(num) {
  for (var i = num; i > 0; i--) {
    var balloon = document.createElement("div");
    balloon.className = "balloon";
    balloon.style.cssText = getRandomStyles();
    balloonContainer.append(balloon);
  }
}

function removeBalloons() {
  balloonContainer.style.opacity = 0;
  setTimeout(() => {
    balloonContainer.remove()
  }, 500)
}

function spawnPetAtRandomEdge(petEl) {
  const edge = Math.floor(Math.random() * 4);
  const w = window.innerWidth;
  const h = window.innerHeight;

  petEl.style.position = "fixed";

  switch (edge) {
    case 0: // top
      petEl.style.top = "0px";
      petEl.style.left = Math.random() * w + "px";
      break;

    case 1: // right
      petEl.style.top = Math.random() * h + "px";
      petEl.style.right = "0px";
      break;

    case 2: // bottom
      petEl.style.bottom = "0px";
      petEl.style.left = Math.random() * w + "px";
      break;

    case 3: // left
      petEl.style.top = Math.random() * h + "px";
      petEl.style.left = "0px";
      break;
  }
}

function createSitePet(gfx) {
  if (!gfx) {
    gfx = 'sprite';
  }

  const ANI = {
    IDEL1: 0,
    IDEL2: 1,
    IDEL3: 2,
    RIGHT: 3,
    DOWN: 4,
    LEFT: 5,
    UP: 6,
    PET: 7,
    SLEEP: 8
  };

  var ele = document.createElement("div");

  ele.style.position = 'fixed';
  ele.style.width = '64px';
  ele.style.height = '64px';
  //ele.style.backgroundColor = '#f0f';
  ele.style.backgroundImage = `url(https://derdere.github.io/site-pet/gfx/${gfx}.png)`;
  ele.style.backgroundRepeat = 'no-repeat';
  ele.style.backgroundPosition = '0px 0px';

  document.body.appendChild(ele);

  const MaxFrame = 8;
  var anim = 0;
  var frame = 0;
  var sleep = 0;
  var moving = false;
  const edge = Math.floor(Math.random() * 4); // 0 top, 1 right, 2 bottom, 3 left

    var x, y;

    if (edge === 0) {
    // top
    x = Math.floor(Math.random() * (window.innerWidth - 64));
    y = -64;
    } else if (edge === 1) {
    // right
    x = window.innerWidth;
    y = Math.floor(Math.random() * (window.innerHeight - 64));
    } else if (edge === 2) {
    // bottom
    x = Math.floor(Math.random() * (window.innerWidth - 64));
    y = window.innerHeight;
    } else {
    // left
    x = -64;
    y = Math.floor(Math.random() * (window.innerHeight - 64));
    }


  ele.style.top = `${y}px`;
  ele.style.left = `${x}px`;
  requestAnimationFrame(() => {
  ele.style.transition = 'top 1500ms linear, left 1500ms linear';
});
  

  var setAnim = (a) => {
    frame = 0;
    anim = a;
  };

  var update = () => {
    let bgX = -64 * frame;
    let bgY = -64 * anim;
    let pos = `${bgX}px ${bgY}px `;
    ele.style.backgroundPosition = pos;
    frame += 1;
    if (frame >= MaxFrame) {
      if (sleep > 0) {
        sleep -= 1;
        moving = false;
        setAnim(ANI.SLEEP);
      } else {
        if (((Math.round(Math.random() * 100000) % 2) == 0) && (x >= 0)) {
          let a = (Math.round(Math.random() * 100000) % 5) - 2;
          if (a < 0) a = 0;
          moving = false;
          setAnim(a);

        } else if (((Math.round(Math.random() * 100000) % 8) != 0) || (x < 0)) {
          let d = Math.round(Math.random() * 100000) % 4;
          let sx = 0;
          let sy = 0;
          let a = null;
          if (d == 3) {
            // up
            a = ANI.UP;
            sy = -64;
          } else if (d == 2) {
            // down
            a = ANI.DOWN;
            sy = 64;
          } else if (d == 1) {
            // left
            a = ANI.LEFT;
            sx = -64;
          } else {
            // right
            a = ANI.RIGHT;
            sx = 64;
          }
          if (x <= 0) {
            sx = 64;
            sy = 0;
            a = ANI.RIGHT;
          } else if (x >= (window.innerWidth - 64)) {
            sx = -64;
            sy = 0;
            a = ANI.LEFT;
          } else if (y <= 0) {
            sy = 64;
            sx = 0;
            a = ANI.DOWN;
          } else if (y >= (window.innerHeight - 64)) {
            sy = -64;
            sx = 0;
            a = ANI.UP;
          }
          x += sx;
          y += sy;
          moving = true;
          ele.style.top = `${y}px`;
          ele.style.left = `${x}px`;
          setAnim(a);

        } else {
          sleep = 5;
          moving = false;
          setAnim(ANI.SLEEP);
        }
      }
    }
    if ((!moving) && (sleep <= 0) && (anim != ANI.PET)) {
      ele.style.cursor = 'pointer';
    } else {
      ele.style.cursor = 'default';
    }
  };
  setInterval(update, 150);

  var click = () => {
    if ((!moving) && (sleep <= 0) && (anim != ANI.PET)) {
      setAnim(ANI.PET);
    }
  };
  ele.addEventListener('click', click);

  return ele;
}

window.addEventListener("load", () => {
  createBalloons(30);
  createSitePet("example");
  createSitePet("example");
  createSitePet("example");
  createSitePet("example");
  createSitePet("example");
  createSitePet("example");
  createSitePet("example");
  createSitePet("example");
  createSitePet("example");
  createSitePet("example");
  createSitePet("example");
  createSitePet("example");
});


