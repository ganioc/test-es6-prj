
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
  SWITCH_SCENE = 0,
  METERING,
  RUNNING,
  END,
}
class Character {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public color: string;
  public name: string;

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

class Meter extends Character implements IfBehavior {
  public speed: number;
  public speedMax: number;
  public baseSpeed: number;
  public bOccupied: boolean;
  private atomX: number;
  private timeNow: number;

  constructor(option: IfBasicInfo, basicLen: number) {
    super(option);
    this.speed = 0;
    this.speedMax = 10;
    this.baseSpeed = 0;
    this.bOccupied = false;

    this.atomX = basicLen;
  }
  public clearRect(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#000000';
    ctx.fillRect(this.x - this.width, 0, this.width * 2, this.y);
  }
  public draw(ctx: CanvasRenderingContext2D) {
    console.log(this.name, '-> draw');

    this.clearRect(ctx);

    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - this.width / 2, this.y - this.speed * this.atomX, this.width, this.speed * this.atomX);
  }

  public run(ctx: CanvasRenderingContext2D) {
    console.log(this.name, '-> run()');
    this.timeNow = Date.now();
    this.speed = 0;
    let VELOCITY = 10 / 1000;

    const runIt = () => {
      if (this.bOccupied === false) {
        this.clearRect(ctx);
        console.log("quit meter state");
        console.log('speed is:', this.speed);
        return;
      }
      const timeDelta = Date.now() - this.timeNow;
      if (timeDelta < 20) {
        window.requestAnimationFrame(() => {
          runIt();
        });
        return;
      }
      this.speed += (VELOCITY * timeDelta);
      console.log('this.speed:', this.speed);

      if (this.speed > this.speedMax) {
        this.speed = this.speedMax;
        VELOCITY = (-VELOCITY);
        console.log('over: velocity ->', VELOCITY);
      } else if (this.speed < 0) {
        this.speed = 0;
        VELOCITY = (-VELOCITY);
        console.log('under: velocity ->', VELOCITY);
      }
      this.draw(ctx);
      this.timeNow = Date.now();

      window.requestAnimationFrame(() => {
        runIt();
      });
    };

    if (this.bOccupied === false) {
      this.bOccupied = true;
      runIt();
    }
  }
  public stop(callback: () => void) {
    console.log(this.name, '-> stop()');
    this.bOccupied = false;
    callback();
  }
}
class Table extends Character implements IfBehavior {
  public color2: string;
  public speed: number;

  constructor(option: IfBasicInfo) {
    super(option);
  }
  public run(ctx: CanvasRenderingContext2D) {
    console.log('Table run()');
  }
  public draw(ctx: CanvasRenderingContext2D) {
    console.log(this.name, '->Table draw');
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height,
    );
  }
}
class Player extends Character implements IfBehavior {
  public angle: number;
  public speed: number;

  constructor(option: IfBasicInfo) {
    super(option);
    this.angle = 0;
  }
  public run(ctx: CanvasRenderingContext2D) {
    console.log('Player run');
  }
  public draw(ctx: CanvasRenderingContext2D) {
    console.log(this.name, '-> Player draw()');
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height,
    );
  }
  public approachTable(table: Table) {
    this.x = table.x;
    this.y = table.y - table.height / 2 - this.height / 2;
  }

}

class Playground {
  private timeNow: number;
  private colorBackground: string;
  private state: number;
  private player: Player;
  private playerTable: Table;
  private table: Table;
  private meter: Meter;

  // ground level
  private atomX: number;
  private groundLevelY: number;
  private borderX: number;

  // position values
  private playerWidth: number;
  private playerHeight: number;
  private playerDefaultX: number;
  // private playerDefaultY: number;
  // table values
  private tableDefaultCenterX: number;
  private tableRangeX: number;
  private tableRangeY: number;
  private tableLeftX: number;
  private tableWidthX: number;

  constructor(
    public width: number,
    public height: number,
    public ctx: CanvasRenderingContext2D) {

    this.colorBackground = '#000000';
    this.state = STATE.SWITCH_SCENE;

    this.atomX = this.width / 20;
    this.groundLevelY = this.height - this.atomX / 2;
    this.borderX = this.width - 4 * this.atomX;
    this.playerWidth = this.atomX;
    this.playerHeight = this.atomX * 2;
    this.playerDefaultX = this.borderX + (this.width - this.borderX) / 2;

    this.tableDefaultCenterX = this.borderX / 2;
    this.tableRangeX = (this.borderX - this.atomX) / 2;
    this.tableRangeY = this.atomX / 2;
    this.tableLeftX = this.atomX / 2;
    this.tableWidthX = (this.borderX - this.atomX);

    this.playerTable = new Table({
      x: this.tableDefaultCenterX,
      y: (this.groundLevelY - this.atomX / 2),
      width: this.atomX * 2,
      height: this.atomX,
      color: '#00ff00',
      name: 'player-table',
    });
    this.player = new Player({
      x: 0,
      y: 0,
      width: this.playerWidth,
      height: this.playerHeight,
      color: '#0000ff',
      name: 'player',
    });
    this.player.approachTable(this.playerTable);

    this.table = new Table({
      x: -100,
      y: (this.groundLevelY - this.atomX / 2),
      width: this.atomX * 2,
      height: this.atomX,
      color: '#ff0000',
      name: 'table',
    });

    this.meter = new Meter({
      x: this.playerDefaultX,
      y: this.atomX * 11,
      width: this.atomX,
      height: this.atomX * 10,
      color: '#ff00ff',
      name: 'meter',
    }, this.atomX);
    // const mycanvas = document.getElementById(CANVAS_ID);
    document.addEventListener('keydown', (event) => {
      console.log('keydown');
      console.log(event.code, event.type);
      // console.log();
      if (this.state !== STATE.METERING) {
        console.log('Can not respond to keydown event');
        return;
      }
      if (this.meter.bOccupied === false) {
        this.meter.run(this.ctx);
      } else {
        console.log('can not run meter again');
      }

      // this.meter.draw(this.ctx);
    });
    document.addEventListener('keyup', (event) => {
      console.log('keyup');
      // console.log(event);
      console.log(event.code, event.type);
      // console.log();
      this.meter.stop(() => {
        this.state = STATE.RUNNING;
        console.log('Switch to running state');
        this.runRunning();
      });
      // this.meter.clearRect(this.ctx);
    });
    // document.addEventListener('keypress', (event) => {
    //   console.log('keypress');
    // });
  }
  public clearRect() {
    this.ctx.fillStyle = this.colorBackground;
    // this.ctx.clearRect(0, 0, this.width, this.height);

    this.ctx.fillRect(0, 0, this.width, this.height);
  }
  public moveToDefault(playerX: number, tableX: number, dur: number, callback) {

    this.playerTable.speed = (playerX - this.playerTable.x) / (1000 * dur);
    this.table.speed = (tableX - this.table.x) / (1000 * dur);
    console.log('SPEED is:', this.playerTable.speed);

    this.timeNow = Date.now();

    const run = () => {
      const timeDelta = Date.now() - this.timeNow;

      if (timeDelta < 20) {
        window.requestAnimationFrame(() => {
          run();
        });
        return;
      }

      // timeDelta >= 50
      // move it
      const displacement = playerX - this.playerTable.x;
      if (displacement < 0.1) {
        callback();
        return;
      }

      if (displacement > this.playerTable.speed) {
        this.playerTable.x += this.playerTable.speed * timeDelta;
        this.table.x += this.table.speed * timeDelta;
      } else if (displacement > 0 && displacement <= this.playerTable.speed) {
        this.playerTable.x = playerX;
        this.table.x = tableX;
      }
      this.player.approachTable(this.playerTable);

      this.clearRect();
      this.playerTable.draw(this.ctx);
      this.player.draw(this.ctx);
      this.table.draw(this.ctx);

      this.timeNow = Date.now();

      window.requestAnimationFrame(() => {
        run();
      });
    };

    run();

  }
  public launchPlayer() {
    console.log('launchPlayer()');
    this.timeNow = Date.now();
    const aimX = this.tableLeftX + this.tableWidthX * this.meter.speed / 10;
    const aimY = this.table.y - this.table.height / 2;
    // this.meter.speed, 0~10,
    const targetMinX = this.table.x - this.table.width / 2 + this.atomX / 2;
    const targetMaxX = this.table.x + this.table.width / 2 - this.atomX / 2;

    if (aimX >= targetMinX && aimX <= targetMaxX) {
      console.log('right at place');
    } else {
      console.log('out of place');
    }

    const runIt = () => {
      console.log('runIt()');
    };
    runIt();
  }

  // public runOperating() {
  //   console.log('Run Operating');
  // }
  public runRunning() {
    console.log('Run Running');
    // this.launchPlayer();
  }
  public runSwitchScene() {
    console.log('Switch scene');
    this.moveToDefault(
      this.playerDefaultX,
      this.tableDefaultCenterX,
      1.0,
      () => {
        this.state = STATE.METERING;
        console.log('Switch to metering state');
      },
    );
  }
  // public run() {
  //   switch (this.state) {
  //     case STATE.OPERATING:
  //       this.runOperating();
  //       break;
  //     case STATE.RUNNING:
  //       this.runRunning();
  //       break;
  //     case STATE.SWITCH_SCENE:
  //       this.runSwitchScene();
  //       break;
  //     default:
  //       throw new Error('Unrecognized state:' + this.state);
  //       break;
  //   }
}
// public run(time: number) {
//   const timeDelta = Date.now() - time;

//   this.color = this.getColor(this.color, timeDelta);

//   this.ctx.clearRect(0, 0, this.width, this.height);

//   this.ctx.fillStyle = "#" + this.color;
//   this.ctx.fillRect(0, 0, this.width, this.height);

//   window.requestAnimationFrame(() => {
//     this.run(Date.now() - time);
//   });
// }
// private getColor(color: number, time: number): number {
//   let tmp = color + (time / 10);
//   if (tmp > 0xffffff) {
//     return 0;
//   }
//   return tmp;
// }
// }

let playground = new Playground(parseInt(WIDTH, 10), parseInt(HEIGHT, 10), context);

playground.runSwitchScene();

// playground.
