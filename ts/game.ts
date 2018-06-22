
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
interface IfBehavior {
  run(ctx: CanvasRenderingContext2D): void;
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
    this.color = option.color;
    this.name = option.name;
  }

  get x_position() {
    return this.x;
  }
  set x_position(yIn: number) {
    this.y = yIn;
  }
}
// let startTime = Date.now();
// let tmpSpeed: number = 0;

class Table extends Character implements IfBehavior {
  private color2: string;

  constructor(option: IfBasicInfo) {
    super(option);
  }
  public run(ctx: CanvasRenderingContext2D) {
    console.log('Table run()');
  }
  public draw(ctx: CanvasRenderingContext2D) {
    console.log('Table draw');
  }
}
class Player extends Character implements IfBehavior {

  constructor(option: IfBasicInfo) {
    super(option);
  }
  public run(ctx: CanvasRenderingContext2D) {
    console.log('Player run');
  }
  public draw(ctx: CanvasRenderingContext2D) {
    console.log('Player draw()');
  }
}

class Playground {
  private timeNow: number;
  private color: string;
  private player: Player;
  private playerTable: Table;
  private table: Table;
  private state: number;

  constructor(
    public width: number,
    public height: number,
    public ctx: CanvasRenderingContext2D) {
    this.color = '#000000';
    this.run(Date.now());

  }
  public run(time: number) {
    const timeDelta = Date.now() - time;

    this.color = this.getColor(this.color, timeDelta);

    this.ctx.clearRect(0, 0, this.width, this.height);

    this.ctx.fillStyle = "#" + this.color;
    this.ctx.fillRect(0, 0, this.width, this.height);

    window.requestAnimationFrame(() => {
      this.run(Date.now() - time);
    });
  }
  private getColor(color: number, time: number): number {
    let tmp = color + (time / 10);
    if (tmp > 0xffffff) {
      return 0;
    }
    return tmp;
  }
}

let playground = new Playground(parseInt(WIDTH, 10), parseInt(HEIGHT, 10), context);
playground.run(Date.now());
