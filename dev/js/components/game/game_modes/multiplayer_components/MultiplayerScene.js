import {LEVEL_NUMBER_FONT_SIZE} from "../../configs/config";
import SceneCircle from "../../models/Circle/SceneCircle";
import Multiplayer from "../Multiplayer";
import {
    CIRCLE_DROP,
    LEVEL_LOAD,
    LEVEL_START,
    LEVEL_STOP,
    LINE_DROP,
    LINE_INPUT,
    LINE_UPDATED
} from "../single_components/Events";
import SceneLine from "../../models/Line/SceneLine";
import Point from "../../models/Point/Point";
import {LINE_REFRESH, MULT_COMP_START} from "./MultiplayerEvents";


export default class MultiplayerScene {
    constructor(game) {
        this._game = game;

        this._stop = true;

        this._ctx = null;

        this._walls = [];
        this._player = {
            circles: [],
            color: "red",
            line: null
        };
        this._enemy = {
            circles: [],
            color: "blue",
            line: null
        };
    }

    init(ctx) {
        this._ctx = ctx;

        this._game.on(MULT_COMP_START, this.start.bind(this), false);
        this._game.on(LEVEL_STOP, this.stop.bind(this), false);
        this._game.on(LEVEL_LOAD, this.loadLevel.bind(this), false);

        this._game.on(LINE_INPUT, this.initLine.bind(this), false);
        this._game.on(LINE_UPDATED, this.updateLine.bind(this), false);
        this._game.on(LINE_DROP, this.dropLine.bind(this), false);
        this._game.on(LINE_REFRESH, this.initLine.bind(this), false);

        this._game.on(CIRCLE_DROP, this.dropCircle.bind(this), false);
    }

    loadLevel(level) {

        this._walls = [];
        this._player.circles = [];
        this._enemy.circles = [];

        level.circles.forEach((circle) => {
            this.addCircle(circle);
        });
    }

    addCircle(circle) {
        if (circle !== undefined) {
            if (circle.type === "goal") {
                circle.color = this._player.color;
                this._player.circles[circle.num] = new SceneCircle(circle);
                circle.color = this._enemy.color;
                this._enemy.circles[circle.num] = new SceneCircle(circle);
            } else if (circle.type === "wall") {
                this._walls[circle.num] = new SceneCircle(circle);
            }
        }
    }

    dropCircle({player, num}) {
        if (player === "player") {
            delete this._player.circles[num];
        } else {
            delete this._enemy.circles[num];
        }
    }

    updateLine({playerLine, enemyLine}) {
        if (playerLine) {
            this._player.line.beginLine = playerLine.beginLine;
            this._player.line.endLine = playerLine.endLine;
        }
        if (enemyLine) {
            this._enemy.line.beginLine = enemyLine.beginLine;
            this._enemy.line.endLine = enemyLine.endLine;
        }
    }

    initLine() {
        this._player.line = new SceneLine(new Point(-10, -10));
        this._enemy.line = new SceneLine(new Point(-10, -10));
    }

    dropLine(player) {
        if (player === "player") {
            this._player.line = null;
        } else {
            this._enemy.line = null;
        }
    }

    showDisconnected() {
        this.clear();

        this._ctx.save();

        this._ctx.font = `${String(LEVEL_NUMBER_FONT_SIZE * this._game.scale)}px Quantico`;
        this._ctx.fillText("Disconnected", this._game.window.width / 2,
            this._game.window.height / 2);

        this._ctx.restore();
    }

    showWaitingServer() {
        this.clear();

        this._ctx.save();

        this._ctx.font = `${String(LEVEL_NUMBER_FONT_SIZE * this._game.scale)}vw Quantico`;
        this._ctx.fillText("Waiting server", 0,
            this._game.window.height / 2);

        this._ctx.restore();
    }

    showWaitingPlayers() {
        this.clear();

        this._ctx.save();

        this._ctx.font = `${String(LEVEL_NUMBER_FONT_SIZE * this._game.scale)}vw Quantico`;
        this._ctx.fillText("Waiting another player", 0,
            this._game.window.height / 2);

        this._ctx.restore();
    }

    showPresentationPlayers() {
        this.clear();

        this._ctx.save();

        this._ctx.font = `${String(LEVEL_NUMBER_FONT_SIZE * this._game.scale)}vw Quantico`;

        this._ctx.fillStyle = "red";
        this._ctx.textAlign = "right";
        this._ctx.fillText(this._game._player.nickname, this._game.window.width / 2, this._game.window.height / 2);

        this._ctx.fillStyle = "black";
        this._ctx.textAlign = "center";
        this._ctx.fillText(" vs ", this._game.window.width / 2, this._game.window.height / 2);

        this._ctx.fillStyle = "blue";
        this._ctx.textAlign = "left";
        this._ctx.fillText(this._game._enemy.nickname, this._game.window.width / 2, this._game.window.height / 2);

        this._ctx.restore();
    }

    showInputingLine() {
        this.clear();

        this._ctx.save();

        if (this._player.line) {
            this._player.line.draw(this._ctx, this._game.scale, this._player.color);
        }

        this._walls.forEach((circle) => {
            circle.draw(this._ctx);
        });

        this._ctx.globalCompositeOperation = "lighter";

        this._player.circles.forEach((circle) => {
            circle.draw(this._ctx);
        });
        this._enemy.circles.forEach((circle) => {
            circle.draw(this._ctx);
        });

         this._ctx.restore();
    }

    showGamePreview() {
        this.clear();

        this._ctx.save();

        this._ctx.textAlign = "center";

        this._ctx.font = `${String(LEVEL_NUMBER_FONT_SIZE * this._game.scale)}vw Quantico`;
        this._ctx.fillText("GO", this._game.window.width / 2,
            this._game.window.height / 2);

        this._ctx.restore();
    }

    showGameProcessing() {
        this.clear();

        this._ctx.save();

        if (this._player.line) {
            this._player.line.draw(this._ctx, this._game.scale, this._player.color);
        }
        if (this._enemy.line) {
            this._enemy.line.draw(this._ctx, this._game.scale, this._enemy.color);
        }

        this._walls.forEach((circle) => {
            circle.draw(this._ctx);
        });

        this._ctx.globalCompositeOperation = "lighter";

        this._player.circles.forEach((circle) => {
            circle.draw(this._ctx);
        });
        this._enemy.circles.forEach((circle) => {
            circle.draw(this._ctx);
        });

        this._ctx.restore();
    }

    showEnd(status) {
        this.clear();

        this._ctx.save();

        if (status === "SUCCESS") {
            this._ctx.fillStyle = "red";
        } else {
            this._ctx.fillStyle = "blue";
        }
        this._ctx.textAlign = "center";

        this._ctx.font = `${String(LEVEL_NUMBER_FONT_SIZE * this._game.scale)}vw Quantico`;
        this._ctx.fillText(status, this._game.window.width / 2,
            this._game.window.height / 2);

        this._ctx.restore();
    }

    start() {
        if (this._stop) {
            this._stop = false;

            this.loopCallback();
        }
    }

    stop() {
        this._stop = true;
    }

    render() {
        switch (this._game.state) {
            case Multiplayer.STATES.PRESENTATION_PLAYERS:
                this.showPresentationPlayers();
                break;
            case Multiplayer.STATES.WAITING_SERVER:
                this.showWaitingServer();
                break;
            case Multiplayer.STATES.WAITING_PLAYERS:
                this.showWaitingPlayers();
                break;
            case Multiplayer.STATES.INPUTTING_LINE:
                this.showInputingLine();
                break;
            case Multiplayer.STATES.GAME_PREVIEW:
                this.showGamePreview();
                break;
            case Multiplayer.STATES.GAME_PROCESSING:
                this.showGameProcessing();
                break;
            case Multiplayer.STATES.END_SUCCESS:
                this.showEnd("SUCCESS");
                break;
            case Multiplayer.STATES.END_FAILURE:
                this.showEnd("FAILURE");
                break;
        }
    }

    clear() {
        const ctx = this._ctx;
        ctx.clearRect(0, 0, this._game.window.width, this._game.window.height);
    }

    loopCallback() {

        if (!this._stop) {
            // this.clear();
            this.render();
            window.requestAnimationFrame(this.loopCallback.bind(this));
        }
    }
}