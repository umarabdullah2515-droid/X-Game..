** {
    box-sizing: border-box;
}

body {
    margin: 0;
    overflow: hidden;
    font-family: Arial, sans-serif;
    background: #111;
}

/* MENU */

#menu {
    width: 100vw;
    height: 100vh;
    text-align: center;
    padding-top: 60px;
    color: white;
    background: linear-gradient(135deg, #111, #333);
}

#menu h1 {
    font-size: 45px;
}

.characters {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 12px;
    max-width: 700px;
    margin: 30px auto;
}

.characters button {
    width: 150px;
    padding: 15px;
    border: 0;
    border-radius: 10px;
    background: #444;
    color: white;
    font-size: 18px;
    cursor: pointer;
}

.characters button:hover {
    background: #666;
}

.abilityPreview {
    color: #ffd166;
    min-height: 22px;
}

#start {
    padding: 15px 40px;
    border: 0;
    border-radius: 10px;
    font-size: 20px;
    cursor: pointer;
    background: #777;
    color: white;
}

#start:enabled {
    background: #e63946;
}


/* GAME */

#game {
    display: none;
    position: relative;
    width: 100vw;
    height: 100vh;
    background:
        radial-gradient(circle, #555 0%, #222 60%, #111 100%);
}

/* INFO */

#info {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;

    display: flex;
    justify-content: space-around;
    align-items: center;

    background: rgba(0,0,0,0.8);
    color: white;
    font-size: 20px;

    z-index: 10;
}

#dashStatus {
    font-size: 16px;
    color: #7bdff2;
}

/* PLAYER */

#player {
    position: absolute;
    left: 50%;
    top: 50%;

    transform: translate(-50%, -50%);

    font-size: 65px;
    user-select: none;

    transition: filter 0.15s ease;
}

#player.invulnerable {
    filter: drop-shadow(0 0 12px #7bdff2) brightness(1.5);
}

/* GUN */

#gun {
    position: absolute;
    left: 50px;
    top: 30px;
    font-size: 35px;
}


/* BULLET */

.bullet {
    position: absolute;
    width: 12px;
    height: 12px;

    background: yellow;
    border-radius: 50%;

    box-shadow: 0 0 10px yellow;

    pointer-events: none;
    z-index: 20;
}

/* ENEMY (was missing position:absolute, so left/top set by JS never worked) */

.enemy {
    position: absolute;
    font-size: 40px;
    user-select: none;
    pointer-events: none;
    z-index: 15;
}

/* =========================
   LOGIN SCREEN
========================= */

#loginScreen {
    width: 100vw;
    height: 100vh;

    display: flex;
    justify-content: center;
    align-items: center;

    background:
        radial-gradient(circle at center, #333, #050505);

    color: white;
}

.loginBox {
    width: 380px;

    padding: 35px;

    text-align: center;

    background: rgba(0, 0, 0, 0.85);

    border: 2px solid #555;
    border-radius: 15px;

    box-shadow: 0 0 30px rgba(0, 0, 0, 0.8);
}

.loginBox h1 {
    margin-bottom: 10px;
}

.loginBox input {
    width: 100%;

    padding: 14px;

    margin: 20px 0 12px;

    border: none;
    border-radius: 8px;

    font-size: 16px;

    outline: none;
}

.loginBox button {
    width: 100%;

    padding: 14px;

    border: none;
    border-radius: 8px;

    background: #e63946;
    color: white;

    font-size: 18px;
    font-weight: bold;

    cursor: pointer;
}

.loginBox button:hover {
    background: #ff4d5a;
}

#loginMessage {
    min-height: 20px;

    margin-top: 15px;

    font-weight: bold;
}
