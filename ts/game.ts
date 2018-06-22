
console.log('start');

const CANVAS_ID = "mycanvas"
const canvas = <HTMLCanvasElement>document.getElementById(CANVAS_ID);
const WIDTH = document.getElementById(CANVAS_ID).getAttribute('width');
const HEIGHT = document.getElementById(CANVAS_ID).getAttribute('height');
const context = canvas.getContext('2d');

console.log('WIDTH:', WIDTH);
console.log('HEIGHT:', HEIGHT);

//let startTime = Date.now();
//let tmpSpeed: number = 0;
class Chair {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  color2: string;

  constructor() {

  }

  draw(context: CanvasRenderingContext2D) {

  }
}
class Player {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;


  constructor() {

  }
  draw(context: CanvasRenderingContext2D) {

  }
}
enum STATE {
  BUSY = 0,
  OPERATION,
  RUNNING,
  
}
class Playground {
  private timeNow: number;
  private color: number;
  player: Player;
  chairPlayer: Chair;
  state: number;

  constructor(
    public width: number,
    public height: number,
    public context: CanvasRenderingContext2D) {
    this.color = 0;
    this.run(Date.now());

  }
  private getColor(color: number, time: number): number {
    let tmp = color + (time / 10);
    if (tmp > 0xffffff) {
      return 0;
    }
    return tmp;
  }
  public run(time: number) {
    let timeDelta = Date.now() - time;

    this.color = this.getColor(this.color, timeDelta);

    this.context.clearRect(0, 0, this.width, this.height);

    this.context.fillStyle = "#" + this.color;
    this.context.fillRect(0, 0, this.width, this.height);

    window.requestAnimationFrame(() => {
      this.run(Date.now() - time);
    });
  }
}

let playground = new Playground(parseInt(WIDTH), parseInt(HEIGHT), context);
playground.run(Date.now());


