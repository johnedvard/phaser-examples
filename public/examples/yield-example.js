let clickCounter = 0;
const runs = 50000000;

function initHTML(gameParentEl) {
    const html = `<button id="taskA">Start blocking task</button>
      <button id="taskB">Start second blocking task</button>
      <button id="taskC">Start non-blocking task</button>
      <div>
        Counter:
        <div id="clickcounter">0</div>
      </div>
      <div>
        Computed Res:
        <div id="conputedres">0</div>
      </div>`;

    const wrapperEl = document.createElement("div");
    wrapperEl.innerHTML = html;
    if(gameParentEl) gameParentEl.appendChild(wrapperEl);
    else document.body.appendChild(wrapperEl);
    setTimeout(() => {
        document.getElementById("taskA").addEventListener("touchstart", () => start("a"));
        document.getElementById("taskA").addEventListener("mouseup", start("a"));
        document.getElementById("taskB").addEventListener("touchstart", () => start("b"));
        document.getElementById("taskB").addEventListener("mouseup", start("b"));
        document.getElementById("taskC").addEventListener("touchstart", () => start("c"));
        document.getElementById("taskC").addEventListener("mouseup", start("c"));
        
    })
        
  }
  
  
  function incrementCounter() {
    clickCounter++;
    document.getElementById("clickcounter").innerHTML = clickCounter;
  }

  function setComputedRes(res) {
    document.getElementById("conputedres").innerHTML = res;
  }
  
  
  
  function start(type) {
    console.log("start now: ", type);
    setComputedRes(0)
    setTimeout(() => {
        if (type === "a") startBlockingTask();
        else if (type === "b") startSecondBlockingTask();
        else if (type === "c") startNonBlockingTask();
    });
  }
  
  function startNonBlockingTask() {
    return new Promise((resolve) => {
      let res = 0;
      for (let i = 0; i < 20; i++) {
        setTimeout(
          (i) => {
            for (let j = 0; j < runs; j++) {
              res += i + j;
              if (j === runs - 1 && i === 20 - 1) {
                console.log("resolve non-blocking task: ", res);
                setComputedRes(res);
                resolve();
              }
            }
          },
          0,
          i
        );
      }
    });
  }
  function startSecondBlockingTask() {
    return new Promise((resolve) => {
      const promises = [];
      let res = 0;
      for (let i = 0; i < 20; i++) {
        const prom = new Promise((innerResolve) => {
          for (let j = 0; j < runs; j++) {
            res += i + j;
            if (j === runs - 1) {
              innerResolve();
            }
          }
        });
        promises.push(prom);
      }
      Promise.allSettled(promises).then(() => {
        console.log("res", res);
        setComputedRes(res);
        resolve();
      });
    });
  }
  function startBlockingTask() {
    return new Promise((resolve) => {
      let res = 0;
      for (let i = 0; i < 20; i++) {
        for (let j = 0; j < runs; j++) {
          res += i + j;
        }
      }
      console.log("resolve blocking task ", res);
      setComputedRes(res);
      resolve();
    });
  }
  
let game;

export const initGame = () => {
  if (game) return;
  
  /** used if embedded directly on a page */
  const gameParentEl = document.getElementById("phaser-example-parent");
  
  
 initHTML(gameParentEl);
 document.addEventListener("click", incrementCounter);
 game = {};
  
};

initGame();
