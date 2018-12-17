/**
 * @module views/GameView
 */

import BaseView from "./BaseView.js";
import WebSocks from "../modules/WS.js";
import NavigationController from "../controllers/NavigationController.mjs";
import FormController from "../controllers/FormController.mjs";
import Emitter from "../modules/Emitter.js";
import Single from "../components/game/game_modes/Single.js";
import {WSPathSingleplayer} from "../config";

/**
 * View of the game page
 * @class GameView
 * @extends BaseView
 */
export default class GameView extends BaseView {
    /**
     * Creates view and renders it
     */
    constructor() {
        super();
        this._navigationController = new NavigationController();
        this.registerEvents();

        this._ws = new WebSocks("game");

        this._player = null;

        Emitter.on("game-message", (data) => {
           Emitter.emit("info", data);
        }, false);

        Emitter.on("single-player-got-scores", (user) => {
            this.viewSection.getElementsByClassName("js-game-status")[0].innerHTML = Handlebars.templates.GameHeaderStatus({user});

        }, false);

        Emitter.on("single-game-change-state", (message) => {
            message = {header: "lol", desc: "kek"};
            this.viewSection.getElementsByClassName("js-game-status")[0].innerHTML = Handlebars.templates.GameHeaderStatus({message: message});
        }, false);

        Emitter.on("single-player-left-game", (user) => {
            this.viewSection.getElementsByClassName("js-game-status")[0].innerHTML = Handlebars.templates.GameHeaderStatus({header: `${user.username} left game...`, desc: "You win!"});
        }, false);

        Emitter.on("done-get-user", (user) => {
            this.setFirstPlayer(user);
        });

        Emitter.on("single-render-game", () => {
            this.renderGame()
        }, false)
    }

    setFirstPlayer(user) {
        this._player = {
            username: user.username,
            score: user.score
        };
    }

    /**
     * Emits load event and shows view
     * @return {undefined}
     */
    show() {
        if (!this._player) {
            Emitter.emit("get-user");
        }

        this._ws.connect(WSPathSingleplayer);
        this._game = new Single();

        Emitter.emit("single-render-game");
        super.show();
    }

    hide() {
        this._ws.close();
        super.hide();
    }

    renderGame() {
        const state = {
            mult: false,
            player: this._player,
        };

        this.viewSection.innerHTML = Handlebars.templates.Game(state);

        const height = window.innerHeight;
        const width = window.innerWidth;

        const canvas = document.createElement("canvas");

        if (width / height > 16 / 9) {
            canvas.width = height * 16 / 9;
            canvas.height = height;
        } else {
            canvas.height = width * 9 / 16;
            canvas.width = width;
        }

        canvas.id = "canvas-single";
        canvas.style = "border-left: 4px solid #00000082;border-right: 3px solid #00000082;display: block;box-shadow: inset 0 0 20px #00000085;position: relative;background: #fff;";

        this.viewSection.getElementsByClassName("js-canvas-wrapper")[0].appendChild(canvas);

        console.log("preinit");
        this._game.init(canvas, {width: canvas.width, height: canvas.height});
        this._game.start();
    }


    /**
     * Generates html and puts it to this.viewSection
     * @return {undefined}
     */
    render() {
        super.render();
        this.renderGame();
    }

    /**
     * Register events for NavigationController to handle
     * @return {undefined}
     */
    registerEvents() {
        this.viewSection.addEventListener("click", this._navigationController.keyPressedCallback);

        window.addEventListener("resize", () => {
            const height = window.innerHeight;
            const width = window.innerWidth;
            const canvas = document.getElementById("canvas-single");

            if (width / height > 16 / 9) {
                canvas.width = height * 16 / 9;
                canvas.height = height;

            } else {
                canvas.height = width * 9 / 16;
                canvas.width = width;
            }
        });
    }
}