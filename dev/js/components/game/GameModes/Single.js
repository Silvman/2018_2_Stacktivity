import Game from "./Game.js";
import User from "../models/User/User.js";
import {
    LEVEL_COMPLETE,
    LEVEL_NEXT,
    LEVEL_RELOAD,
    LEVEL_PREV,
    LEVEL_START,
    LEVEL_LOAD,
    LEVEL_SHOW_PREVIEW,
    LEVEL_EVENT,
    LEVEL_FAILED,
    LEVEL_SHOW_LINE_FAILED,
    LEVEL_STOP
} from "../Events";
import {defaultLevels} from "../configs/defaultLevels";
import {
    LEVEL_SHOW_LINE_FAILED_TIME,
    LEVEL_SHOW_TIME
} from "../configs/config";

export default class Single extends Game {
    constructor() {
        super("single");

        this._user = null;
    }

    init(canvas, {width, height}) {
        this.on(LEVEL_EVENT, this.manageLevels.bind(this), false);

        this._window = {
            width: width,
            height: height
        };

        this._user = Single.loadUser();

        const ctx = canvas.getContext('2d');

        this._logic.init();
        this._scene.init(this._window, ctx);
        this._control.init(this, canvas);
    }

    start() {
        this._level = Single.loadLevel(this._user.currentLevel);
        this.emit(LEVEL_LOAD, this._level);

        this.emit(LEVEL_SHOW_PREVIEW);

        window.setTimeout(this.emit.bind(this), LEVEL_SHOW_TIME, LEVEL_START);
    }

    manageLevels(command) {
        switch (command) {
            case LEVEL_COMPLETE:
                this._user.currentLevel++;
                this.emit(LEVEL_STOP);
                this.start();
                break;
            case LEVEL_FAILED:
                this.emit(LEVEL_STOP);
                this.emit(LEVEL_SHOW_LINE_FAILED);

                window.setTimeout(this.manageLevels.bind(this),
                    LEVEL_SHOW_LINE_FAILED_TIME, LEVEL_RELOAD);
                break;
            case LEVEL_RELOAD:
                this.emit(LEVEL_LOAD, this._level);
                this.emit(LEVEL_START);
                break;
            case LEVEL_NEXT:
                if (this._user.currentLevel < this._user.maxLevel) {
                    this._user.currentLevel++;
                    this.emit(LEVEL_STOP);
                    this.start();
                }
                break;
            case LEVEL_PREV:
                if (this._user.currentLevel > 0) {
                    this._user.currentLevel--;
                    this.emit(LEVEL_STOP);
                    this.start();
                }
                break;
        }

    }

    static loadLevel(num) {
        // fetch from server

        if (num < 0 || num > defaultLevels.length) {
            return;
        }
        return defaultLevels[num];
    }

    setLevel(level) {
        this._level = level;
    }

    nextLevel() {
        const next = (this._level.levelNumber + 1) % defaultLevels.length;
        this.emit(LEVEL_LOAD, Game.loadLevel(next));
    }

    static loadUser() {
        // fetch from server
        return new User({nickname: "mynameis", maxLevel: defaultLevels.length - 1, currentLevel: 0});
    }
}