import Router from "./modules/Router.mjs";
import UserModel from "./models/UserModel.js";
import Emitter from "./modules/Emitter.js";

import MenuView from "./views/MenuView.js";
import ProfileView from "./views/ProfileView.mjs";
import RegisterView from "./views/RegisterView.mjs";
import LoginView from "./views/LoginView.mjs";
import AboutView from "./views/AboutView.mjs";
import LeaderboardView from "./views/LeaderboardView.mjs";
import GameView from "./views/GameView.js";

import {errorHandler} from "./misc.js";

const user = UserModel;

Emitter.on("error", errorHandler, false);
Emitter.on("server-validation-error", function (data) {
    let commonErrorEl = document.getElementsByClassName("common_error")[0];

    commonErrorEl.innerText = data.error.message;
    commonErrorEl.classList.remove("hidden");
});

/**
 * Starts the application
 * @return {undefined}
 */
function main() {
    Router.
        add("/about", AboutView).
        add("/single", GameView).
        add("/mult", GameView).
        add("/", MenuView).
        add("/profile", ProfileView).
        add("/signup", RegisterView).
        add("/login", LoginView).
        add("/leaderboard", LeaderboardView);

    Router.open(window.location.pathname);
}

main();