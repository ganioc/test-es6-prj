
const CANVAS_ID = 'mycanvas';
const canvas = document.getElementById(CANVAS_ID) as HTMLCanvasElement;
const WIDTH = document.getElementById(CANVAS_ID).getAttribute('width');
const HEIGHT = document.getElementById(CANVAS_ID).getAttribute('height');
const context = canvas.getContext('2d');

console.log('WIDTH:', WIDTH);
console.log('HEIGHT:', HEIGHT);

function Erun(callbackCheck: (number) => boolean, callbackRun: (number) => void) {
  let timeDelta: number = 123;
  let timeNow = Date.now();

  const runIt = () => {
    timeDelta = Date.now() - timeNow;

    const status: boolean = callbackCheck(timeDelta);
    console.log('status:', status);
    if (status === false) {
      return;
    }

    if (timeDelta < 20) {
      rerunIt();
      return;
    }
    callbackRun(timeDelta);

    timeNow = Date.now();

    rerunIt();
  };
  const rerunIt = () => {
    window.requestAnimationFrame(() => {
      runIt();
    });
  };
  runIt();
}

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

  public getColor(): string {
    const lstColor: string[] = [
      'ee0000',
      'ff0ff0',
      '606060',
      '00ff00',
      'ff002f',
      'ffff00',
      '00ffff',
      'ff00ff',
      '00bfff',
      '64fe2e',
    ];
    return lstColor[Math.floor(lstColor.length * Math.random())];
  }
}

class Meter extends Character implements IfBehavior {
  public speed: number;
  public speedMax: number;
  public baseSpeed: number;
  public bOccupied: boolean;
  private atomX: number;
  private timeNow: number;
  private color2: string;
  //private VELOCITY: number;

  constructor(option: IfBasicInfo, basicLen: number) {
    super(option);
    this.speed = 0;
    this.speedMax = 10;
    this.baseSpeed = 0;
    this.bOccupied = false;

    this.atomX = basicLen;
    this.color2 = '#ff8000';
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

    ctx.fillStyle = this.color2;
    ctx.fillRect(this.x - this.width / 2, this.y - 10 * this.atomX, this.width, (10 - this.speed) * this.atomX);
  }

  public run(ctx: CanvasRenderingContext2D) {
    this.speed = 0;
    let VELOCITY = 10 / 1000;

    if (this.bOccupied === false) {
      this.bOccupied = true;
      console.log("meter run() only once");

      Erun(
        (timeDelta) => {
          console.log('callbackCheck: ', timeDelta);
          if (this.bOccupied === false) {
            return false;
          } else {
            return true;
          }
        },
        (timeDelta) => {
          console.log('callbackrun: ', timeDelta);
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
        },
      );
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
    ctx.fillStyle = this.color2;
    ctx.fillRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height,
    );
  }
  public resetState(inX: number, inWidth: number) {
    this.x = inX;
    this.width = inWidth;
    this.color = '#' + this.getColor();
  }
  public copy(table: Table) {
    this.x = table.x;
    this.y = table.y;
    this.width = table.width;
    this.color = table.color;
  }
}
class Player extends Character implements IfBehavior {
  public angle: number;
  public speed: number;
  public speedX: number;
  public speedY: number;
  public heightJump: number;
  public gravityY: number;

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
  public drawRelative(ctx: CanvasRenderingContext2D) {
    console.log(this.name, '-> Player draw()');
    ctx.fillStyle = this.color;
    ctx.fillRect(
      - this.width / 2,
      - this.height / 2,
      this.width,
      this.height,
    );
  }
  public approachTable(table: Table) {
    this.x = table.x;
    this.y = table.y - table.height / 2 - this.height / 2;
  }
  public resetState(inX: number, inY: number) {
    this.x = inX;
    this.y = inY;
    this.color = '#0000ff'; // blue
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
  private score: number;
  private historyScore: number;

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
      width: this.atomX * 4,
      height: this.atomX,
      color: '#ff0000',
      name: 'table',
    });

    this.meter = new Meter({
      x: this.playerDefaultX,
      y: this.atomX * 11,
      width: this.atomX,
      height: this.atomX * 10,
      color: '#ff0000',
      name: 'meter',
    }, this.atomX);

    this.score = 0;
    this.historyScore = 0;
    // const mycanvas = document.getElementById(CANVAS_ID);
    document.addEventListener('keydown', (event) => {
      console.log('keydown');
      console.log(event.code, event.type);
      // console.log();
      if (this.state !== STATE.METERING) {
        // console.log('Can not respond to keydown event');
        return;
      }
      if (this.meter.bOccupied === false) {
        this.meter.run(this.ctx);
      } else {
        console.log('can not run meter again');
      }
    });
    document.addEventListener('keyup', (event) => {
      console.log('keyup');
      // console.log(event);
      console.log(event.code, event.type);

      if (this.state !== STATE.METERING) {
        // console.log('Can not respond to keydown event');
        return;
      }
      // console.log();
      this.meter.stop(() => {
        this.state = STATE.RUNNING;
        console.log('Switch to running state');
        this.runRunning();
      });
    });
  }
  public clearRect() {
    this.ctx.fillStyle = this.colorBackground;
    // this.ctx.clearRect(0, 0, this.width, this.height);

    this.ctx.fillRect(0, 0, this.width, this.height);
  }
  public drawLogo() {
    this.ctx.font = '22px Georgia';
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillText('Score: ' + this.score, 10, 50);
    this.ctx.fillText('History: ' + this.historyScore, 10, 80);

    this.ctx.font = '32px Georgia';
    this.ctx.fillText('Jump', 260, 50);
  }
  public reDraw() {
    this.clearRect();
    this.playerTable.draw(this.ctx);
    this.player.draw(this.ctx);
    this.table.draw(this.ctx);
    this.drawLogo();
  }
  public getTableWidth(): number {
    return (1 + Math.floor(3 * Math.random())) * this.atomX;
  }
  public resetState() {
    // put it to default state
    this.table.resetState(-100, this.getTableWidth());
    this.playerTable.resetState(this.tableDefaultCenterX, this.atomX * 2);
    this.player.resetState(this.tableDefaultCenterX,
      this.groundLevelY - this.playerTable.height - this.player.height / 2);
  }
  public start() {
    this.runSwitchScene(
      this.playerDefaultX,
      this.playerDefaultX,
      this.tableDefaultCenterX);

  }
  public explodePlayer(callback) {
    // this.player.color = '#000000';
    const DUR = 2;
    const aimX = Math.floor(this.tableRangeX * Math.random());
    const aimY = -200;

    this.player.gravityY = 1000;
    this.player.speedX = (this.player.x - aimX) / DUR;
    this.player.speedY = this.player.gravityY;

    this.timeNow = Date.now();

    const radiSpeed = 25;
    let angle = 0;

    const runIt = () => {
      let timeDelta = Date.now() - this.timeNow;

      if (timeDelta < 10) {
        window.requestAnimationFrame(() => {
          runIt();
        });
        return;
      }
      const displacement = this.player.y - aimY;

      timeDelta = timeDelta / 1000;

      if (displacement < 0.1) {
        callback();
        return;
      }

      this.player.x -= this.player.speedX * timeDelta;
      this.player.y -= this.player.speedY * timeDelta;
      this.player.speedY += this.player.gravityY * timeDelta;

      this.clearRect();
      this.playerTable.draw(this.ctx);
      this.table.draw(this.ctx);
      this.drawLogo();

      this.ctx.save();
      this.ctx.translate(this.player.x, this.player.y);
      angle += radiSpeed * timeDelta;
      this.ctx.rotate(angle);
      this.player.drawRelative(this.ctx);
      this.ctx.restore();

      this.timeNow = Date.now();
      window.requestAnimationFrame(() => {
        runIt();
      });

    };
    runIt();
  }
  public moveToDefault(playerX: number, playerTableX: number, tableX: number, dur: number, callback) {

    this.playerTable.speed = (playerTableX - this.playerTable.x) / (1000 * dur);
    this.table.speed = (tableX - this.table.x) / (1000 * dur);
    this.player.speedX = this.playerTable.speed;
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
      const displacement = playerTableX - this.playerTable.x;
      if (displacement < 0.1) {
        callback();
        return;
      }

      if (displacement > this.playerTable.speed) {
        this.playerTable.x += this.playerTable.speed * timeDelta;
        this.table.x += this.table.speed * timeDelta;
        this.player.x += this.player.speedX * timeDelta;
      } else if (displacement > 0 && displacement <= this.playerTable.speed) {
        this.playerTable.x = playerTableX;
        this.table.x = tableX;
        this.player.x = playerX;
      }
      // this.player.approachTable(this.playerTable);

      this.reDraw();

      this.timeNow = Date.now();

      window.requestAnimationFrame(() => {
        run();
      });
    };

    run();

  }
  public launchPlayer(callback: (result: boolean) => void) {
    console.log('launchPlayer()');
    const DUR = 2; // seconds
    const aimX = this.tableLeftX + this.tableWidthX * (1 - this.meter.speed / 10);
    const aimY = this.table.y - this.table.height / 2 - this.player.height / 2;
    // this.meter.speed, 0~10,
    const targetMinX = this.table.x - this.table.width / 2;
    const targetMaxX = this.table.x + this.table.width / 2;
    let result: boolean;
    // a = h/t^2
    // v = a * t;
    this.player.heightJump = this.atomX * 5 * (1 + Math.random());
    this.player.gravityY = 2 * (this.player.y - this.player.heightJump) / (Math.pow(DUR / 2, 2));
    this.player.speedX = (this.player.x - aimX) / DUR;
    this.player.speedY = this.player.gravityY * DUR / 2;

    console.log('gravityY:', this.player.gravityY);
    console.log('speedX', this.player.speedX);
    console.log('speedY:', this.player.speedY);

    if (aimX >= targetMinX && aimX <= targetMaxX) {
      console.log('right at place');
      result = true;
    } else {
      console.log('out of place');
      result = false;
    }

    this.timeNow = Date.now();
    const runIt = () => {
      console.log('launch ->runIt()');

      let timeDelta = (Date.now() - this.timeNow);

      if (timeDelta < 20) {
        window.requestAnimationFrame(() => {
          runIt();
        });
        return;
      }
      const displacement = this.player.x - aimX;
      console.log('displacement:', displacement);
      console.log('timeDelta:', timeDelta);
      timeDelta = timeDelta / 1000;
      console.log('timeDelta:', timeDelta);
      if (displacement < 0.1) {
        callback(result);
        return;
      }
      // change player position
      if (displacement > this.atomX / 4) {
        this.player.x -= this.player.speedX * timeDelta;
        // this.player.x -= 5;
        // this.player.y -= (this.player.speedY * timeDelta - this.player.gravityY * Math.pow(timeDelta, 2) / 2);
        this.player.y -= (this.player.speedY * timeDelta);
        this.player.speedY -= (this.player.gravityY * timeDelta);
      } else if (displacement > 0 && displacement <= this.atomX / 4) {
        this.player.x = aimX;
        this.player.y = aimY;
      }

      this.reDraw();

      this.timeNow = Date.now();
      window.requestAnimationFrame(() => {
        runIt();
      });
    };
    runIt();
  }

  public runRunning() {
    console.log('Run Running');
    setTimeout(() => {
      this.launchPlayer((result: boolean) => {
        console.log('finished launchPlayer()', result);

        if (result === true) {
          const deltaX = this.player.x - this.playerTable.x;
          // table be playerTable
          this.playerTable.copy(this.table);
          // player to default position
          this.table.resetState(-100, this.getTableWidth());
          // create new table
          // run Switch Scene
          this.score++;
          console.log('score:', this.score);
          if (this.score > this.historyScore) {
            this.historyScore = this.score;
          }
          this.reDraw();
          this.runSwitchScene(
            deltaX + this.playerDefaultX,
            this.playerDefaultX,
            (this.tableLeftX
              + this.table.width / 2
              + (this.tableWidthX - this.table.width)
              * Math.random()),
          );
        } else {
          // false
          this.explodePlayer(() => {
            this.score = 0;
            this.resetState();
            setTimeout(() => {
              this.reDraw();
              this.runSwitchScene(
                this.playerDefaultX,
                this.playerDefaultX,
                this.tableDefaultCenterX);
            }, 500);
          });

        }
      });
    }, 500);

  }
  public runSwitchScene(playerX: number, playerTableX: number, tableX: number) {
    console.log('Switch scene');
    this.state = STATE.SWITCH_SCENE;

    this.moveToDefault(
      playerX,
      playerTableX,
      tableX,
      1.0,
      () => {
        this.state = STATE.METERING;
        console.log('Switch to metering state');
      },
    );
  }
}

let playground = new Playground(parseInt(WIDTH, 10), parseInt(HEIGHT, 10), context);

playground.start();
