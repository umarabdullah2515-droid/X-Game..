// =========================
// WARRIOR SYSTEM
// =========================

const warriors = {

    Umar: {
        look: "🔥🧍",
        display: "♕Umar♕",
        health: 100,
        speed: 7,
        bulletSpeed: 16,
        coinBonus: 2,
        damage: 2,          // Damage Boost: bullets hit harder
        regen: false,
        dash: false,
        ability: "🔥 Damage Boost"
    },

    Abdullah: {
        look: "⚡🧍",
        display: "♛Abdullah♛",
        health: 100,
        speed: 10,
        bulletSpeed: 16,
        coinBonus: 2,
        damage: 1,
        regen: false,
        dash: false,
        ability: "⚡ Speed Boost"
    },

    Hammad: {
        look: "🎯🧍",
        display: "💯Hammad💯",
        health: 100,
        speed: 7,
        bulletSpeed: 22,
        coinBonus: 2,
        damage: 1,
        regen: false,
        dash: false,
        ability: "🎯 Fast Bullets"
    },

    Mani: {
        look: "💥🧍",
        display: "♞Mani♞",
        health: 100,
        speed: 7,
        bulletSpeed: 16,
        coinBonus: 5,
        damage: 1,
        regen: false,
        dash: false,
        ability: "💰 Extra Coins"
    },

    Hazqeel: {
        look: "🛡️🧍",
        display: "⛓️‍💥Hazqeel⛓️‍💥",
        health: 150,
        speed: 6,
        bulletSpeed: 16,
        coinBonus: 2,
        damage: 1,
        regen: false,
        dash: false,
        ability: "🛡️ Extra Health"
    },

    Qasim: {
        look: "👑🧍",
        display: "🏴Qasim🏴",
        health: 100,
        speed: 7,
        bulletSpeed: 18,
        coinBonus: 3,
        damage: 1,
        regen: true,        // Health Recovery: regen over time
        dash: false,
        ability: "❤️ Health Recovery"
    },

    Azan: {
        look: "🚀🧍",
        display: "💲Azan💲",
        health: 100,
        speed: 9,
        bulletSpeed: 20,
        coinBonus: 2,
        damage: 1,
        regen: false,
        dash: true,          // Dash: spacebar burst + brief invulnerability
        ability: "🚀 Dash"
    }
};

let currentWarrior = null;

// =========================
// LOGIN SYSTEM
// =========================

const GAME_PASSWORD = "Aimsians Legends";
const LOGIN_STORAGE_KEY = "pgc_logged_in";

// Agar pehle kabhi login ho chuka hai, to login screen dikhao hi mat
(function checkExistingLogin() {
    try {
        if (localStorage.getItem(LOGIN_STORAGE_KEY) === "true") {
            document.addEventListener("DOMContentLoaded", function() {
                document.getElementById("loginScreen").style.display = "none";
                document.getElementById("menu").style.display = "block";
            });
        }
    } catch (e) {
        // localStorage available nahi hai (private mode waghera) — normal login chalega
    }
})();

function loginGame() {

    const password =
        document.getElementById("passwordInput").value;

    const message =
        document.getElementById("loginMessage");

    if (password === GAME_PASSWORD) {

        try {
            localStorage.setItem(LOGIN_STORAGE_KEY, "true");
        } catch (e) {
            // storage fail ho to bhi game chalega, bas dubara password maangega
        }

        document.getElementById("loginScreen").style.display = "none";

        document.getElementById("menu").style.display = "block";

        message.innerText = "";

    } else {

        message.innerText = "❌ Wrong Password";

        document.getElementById("passwordInput").value = "";
    }
}

let selectedCharacter = "";   // display name, e.g. "♕Umar♕"
let selectedKey = "";         // warriors object key, e.g. "Umar"

let playerX = window.innerWidth / 2;
let playerY = window.innerHeight / 2;

let speed = 8;
let score = 0;
let health = 100;
let maxHealth = 100;

let enemies = [];
let gameRunning = false;

// Movement direction memory (used by dash)
let lastDir = { x: 0, y: -1 };

// Dash state
let dashReady = true;
const DASH_DISTANCE = 160;
const DASH_COOLDOWN_MS = 3000;
const DASH_INVULN_MS = 400;
let isInvulnerable = false;

// Regen timer handle
let regenInterval = null;


// =========================
// CHARACTER SELECT
// =========================

function selectCharacter(key) {

    const warrior = warriors[key];
    if (!warrior) return;

    selectedKey = key;
    selectedCharacter = warrior.display;

    document.getElementById("selected").innerText =
        "Selected: " + warrior.display;

    document.getElementById("abilityPreview").innerText =
        "Ability: " + warrior.ability;

    document.getElementById("start").disabled = false;
}


// =========================
// START GAME
// =========================

function startGame() {

    currentWarrior = warriors[selectedKey];
    if (!currentWarrior) return; // safety: no character picked

    document.getElementById("menu").style.display = "none";
    document.getElementById("game").style.display = "block";

    document.getElementById("name").innerText =
        "🎮 " + selectedCharacter;

    playerX = window.innerWidth / 2;
    playerY = window.innerHeight / 2;

    // Apply warrior stats
    speed = currentWarrior.speed;
    health = currentWarrior.health;
    maxHealth = currentWarrior.health;
    lastDir = { x: 0, y: -1 };
    dashReady = true;
    isInvulnerable = false;

    score = 0;
    enemies = [];
    gameRunning = true;

    document.getElementById("score").innerText = score;
    document.getElementById("health").innerText = health;
    document.getElementById("dashStatus").innerText =
        currentWarrior.dash ? "🚀 Dash: SPACE (ready)" : "";

    updatePlayer();

    // Enemies create karo
    for (let i = 0; i < 5; i++) {
        createEnemy();
    }

    enemyLoop();

    // Health Recovery ability
    if (regenInterval) clearInterval(regenInterval);
    if (currentWarrior.regen) {
        regenInterval = setInterval(function() {
            if (!gameRunning) return;
            if (health < maxHealth) {
                health = Math.min(maxHealth, health + 1);
                document.getElementById("health").innerText = health;
            }
        }, 4000);
    }
}


// =========================
// PLAYER MOVEMENT
// =========================

document.addEventListener("keydown", function(event) {

    if (!gameRunning) return;

    let key = event.key.toLowerCase();

    // Dash ability (Azan only)
    if (key === " " || event.code === "Space") {
        event.preventDefault();
        if (currentWarrior && currentWarrior.dash) {
            tryDash();
        }
        return;
    }

    let dx = 0;
    let dy = 0;

    if (key === "w" || event.key === "arrowup") {
        playerY -= speed;
        dy = -1;
    }

    if (key === "s" || event.key === "arrowdown") {
        playerY += speed;
        dy = 1;
    }

    if (key === "a" || key === "arrowleft") {
        playerX -= speed;
        dx = -1;
    }

    if (key === "d" || key === "arrowright") {
        playerX += speed;
        dx = 1;
    }

    if (dx !== 0 || dy !== 0) {
        lastDir = { x: dx, y: dy };
    }

    // Screen ke andar rakho
    playerX = Math.max(40, Math.min(playerX, window.innerWidth - 40));
    playerY = Math.max(90, Math.min(playerY, window.innerHeight - 40));

    updatePlayer();
});


// =========================
// DASH (Azan ability)
// =========================

function tryDash() {

    if (!dashReady) return;

    dashReady = false;

    playerX += lastDir.x * DASH_DISTANCE;
    playerY += lastDir.y * DASH_DISTANCE;

    playerX = Math.max(40, Math.min(playerX, window.innerWidth - 40));
    playerY = Math.max(90, Math.min(playerY, window.innerHeight - 40));

    updatePlayer();

    // Brief invulnerability during the dash
    isInvulnerable = true;
    document.getElementById("player").classList.add("invulnerable");

    setTimeout(function() {
        isInvulnerable = false;
        document.getElementById("player").classList.remove("invulnerable");
    }, DASH_INVULN_MS);

    // Cooldown
    const dashStatus = document.getElementById("dashStatus");
    dashStatus.innerText = "🚀 Dash: cooling down...";

    setTimeout(function() {
        dashReady = true;
        dashStatus.innerText = "🚀 Dash: SPACE (ready)";
    }, DASH_COOLDOWN_MS);
}


// =========================
// UPDATE PLAYER
// =========================

function updatePlayer() {

    const player = document.getElementById("player");

    player.style.left = playerX + "px";
    player.style.top = playerY + "px";
}


// =========================
// CREATE ENEMY
// =========================

function createEnemy() {

    const enemy = document.createElement("div");

    enemy.className = "enemy";
    enemy.innerHTML = "👾";

    document.getElementById("game").appendChild(enemy);

    // Random side se enemy aaye
    let side = Math.floor(Math.random() * 4);

    let x;
    let y;

    if (side === 0) {
        x = 30;
        y = Math.random() * window.innerHeight;
    }

    if (side === 1) {
        x = window.innerWidth - 50;
        y = Math.random() * window.innerHeight;
    }

    if (side === 2) {
        x = Math.random() * window.innerWidth;
        y = 90;
    }

    if (side === 3) {
        x = Math.random() * window.innerWidth;
        y = window.innerHeight - 50;
    }

    enemy.style.left = x + "px";
    enemy.style.top = y + "px";

    // Enemies get tougher as score climbs, so Damage Boost stays useful
    const toughness = 1 + Math.floor(score / 200);

    enemies.push({
        element: enemy,
        x: x,
        y: y,
        speed: 1.5,
        hp: toughness
    });
}


// =========================
// ENEMY MOVEMENT
// =========================

function enemyLoop() {

    if (!gameRunning) return;

    enemies.forEach(function(enemy) {

        let dx = playerX - enemy.x;
        let dy = playerY - enemy.y;

        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 50) {

            enemy.x += (dx / distance) * enemy.speed;
            enemy.y += (dy / distance) * enemy.speed;

        } else if (!isInvulnerable) {

            // Player ko damage
            health -= 1;

            document.getElementById("health").innerText = health;

            if (health <= 0) {
                gameOver();
            }
        }

        enemy.element.style.left = enemy.x + "px";
        enemy.element.style.top = enemy.y + "px";
    });

    requestAnimationFrame(enemyLoop);
}


// =========================
// SHOOTING
// =========================

document.addEventListener("click", function(event) {

    if (!gameRunning) return;

    shoot(event.clientX, event.clientY);
});


function shoot(targetX, targetY) {

    const bullet = document.createElement("div");

    bullet.className = "bullet";

    document.getElementById("game").appendChild(bullet);

    let bulletX = playerX;
    let bulletY = playerY;

    bullet.style.left = bulletX + "px";
    bullet.style.top = bulletY + "px";

    let dx = targetX - playerX;
    let dy = targetY - playerY;

    let distance = Math.sqrt(dx * dx + dy * dy);

    const bulletSpeed = currentWarrior ? currentWarrior.bulletSpeed : 15;
    const damage = currentWarrior ? currentWarrior.damage : 1;

    let velocityX = (dx / distance) * bulletSpeed;
    let velocityY = (dy / distance) * bulletSpeed;


    function moveBullet() {

        if (!gameRunning) {
            bullet.remove();
            return;
        }

        bulletX += velocityX;
        bulletY += velocityY;

        bullet.style.left = bulletX + "px";
        bullet.style.top = bulletY + "px";


        // Enemy hit check
        for (let i = enemies.length - 1; i >= 0; i--) {

            let enemy = enemies[i];

            let enemyDX = bulletX - enemy.x;
            let enemyDY = bulletY - enemy.y;

            let enemyDistance =
                Math.sqrt(enemyDX * enemyDX + enemyDY * enemyDY);

            if (enemyDistance < 40) {

                enemy.hp -= damage;

                if (enemy.hp <= 0) {

                    // Enemy remove
                    enemy.element.remove();
                    enemies.splice(i, 1);

                    // Score increase (Extra Coins ability scales this)
                    const coinBonus = currentWarrior ? currentWarrior.coinBonus : 2;
                    score += Math.round(10 * (coinBonus / 2));

                    document.getElementById("score").innerText = score;

                    // New enemy
                    setTimeout(createEnemy, 500);
                }

                bullet.remove();
                return;
            }
        }


        // Bullet screen se bahar
        if (
            bulletX < 0 ||
            bulletX > window.innerWidth ||
            bulletY < 60 ||
            bulletY > window.innerHeight
        ) {
            bullet.remove();
            return;
        }

        requestAnimationFrame(moveBullet);
    }

    moveBullet();
}


// =========================
// GAME OVER
// =========================

function gameOver() {

    gameRunning = false;

    if (regenInterval) clearInterval(regenInterval);

    alert(
        "GAME OVER!\n\n" +
        "Character: " + selectedCharacter +
        "\nScore: " + score
    );

    location.reload();
}
