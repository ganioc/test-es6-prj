
console.log('start');

const CANVAS_ID = 'mycanvas';
const canvas = document.getElementById(CANVAS_ID) as HTMLCanvasElement;
const WIDTH = document.getElementById(CANVAS_ID).getAttribute('width');
const HEIGHT = document.getElementById(CANVAS_ID).getAttribute('height');
const context = canvas.getContext('2d');

console.log('WIDTH:', WIDTH);
console.log('HEIGHT:', HEIGHT);

interface IfBasicInfo {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  name: string;
}
enum STATE {
  PREP = 0,
  OPERATION,
  RUNNING,
  SWITCH_SCENE,
}
class Character {
  protected x: number;
  protected y: number;
  protected width: number;
  protected height: number;
  protected color: string;
  protected name: string;

  constructor(option: IfBasicInfo) {
    this.x = option.x;
    this.y = option.y;
    this.width = option.width;
    this.height = option.height;
    this.name = option.name;
  }
  public run(ctx: CanvasRenderingContext2D) {

  }
  get x_p() {
    return this.x;
  }
  set x_p(yIn: number) {
    this.y = yIn;
  }
}
// let startTime = Date.now();
// let tmpSpeed: number = 0;

class Table extends Character {
  private color2: string;

  constructor(option: IfBasicInfo) {
    super(option);
  }

  public draw(context: CanvasRenderingContext2D) {

  }
}
class Player extends Character {

  constructor(option: IfBasicInfo) {
    super(option);
  }
  public draw(context: CanvasRenderingContext2D) {

  }
}



class Playground {
  private timeNow: number;
  private color: number;
  private player: Player;
  private playerTable: Table;
  private table: Table;
  private state: number;

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

let playground = new Playground(parseInt(WIDTH, 10), parseInt(HEIGHT, 10), context);
playground.run(Date.now());


