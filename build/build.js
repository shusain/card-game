var Card = (function () {
    function Card() {
        this.streetCredCost = Math.ceil(Math.random() * 4);
        this.x = 0;
        this.y = 0;
        this.summoningSickness = false;
        this.face = Math.floor(random(0, 6));
        this.brow = Math.floor(random(0, 3));
        this.glasses = Math.floor(random(0, 10));
        this.mouth = Math.floor(random(0, 5));
        this.shirt = Math.floor(random(0, 9));
        this.hair = Math.floor(random(0, 25));
        this.attack = Math.floor(random(1, 6));
        this.defense = Math.floor(random(1, 6));
        this.cardImage = createGraphics(540, 760);
    }
    Card.prototype.calculateCost = function () {
        return this.attack + this.defense;
    };
    Card.prototype.checkMouseIsOver = function () {
        return mouseX > this.x && mouseX < this.x + this.cardImage.width * Card.SCALE && mouseY > this.y && mouseY < this.y + this.cardImage.height * Card.SCALE;
    };
    Card.prototype.canAttack = function () {
        return !this.tapped && !this.summoningSickness;
    };
    Card.prototype.canBePlayed = function (currentBoard, player) {
        if (player.streetCred < this.calculateCost()) {
            return false;
        }
        else
            return true;
    };
    Card.prototype.getCenter = function () {
        return { x: this.x + this.cardImage.width * Card.SCALE / 2, y: this.y + this.cardImage.height * Card.SCALE / 2 };
    };
    Card.prototype.drawBackgroundOfCard = function (highlighted) {
        if (highlighted === void 0) { highlighted = false; }
        this.cardImage.background("#ff7f0f");
        this.cardImage.noFill();
        this.cardImage.strokeWeight(10);
        highlighted ? this.cardImage.stroke(0, 200, 255) : this.cardImage.stroke(0);
        this.cardImage.rect(0, 0, this.cardImage.width, this.cardImage.height);
        this.cardImage.stroke(0);
    };
    Card.prototype.draw = function (highlighted) {
        if (highlighted === void 0) { highlighted = false; }
        this.drawBackgroundOfCard(highlighted);
        this.cardImage.rect(29, 75, 473, 324);
        this.cardImage.strokeWeight(3);
        this.cardImage.textSize(36);
        this.cardImage.textFont("Arial");
        this.cardImage.text("Homie", 40, 50);
        this.cardImage.text(this.attack + "/" + this.defense + " -- " + this.calculateCost() + " cred", 300, 50);
        this.cardImage.image(ImagePreloader.preloadedImages['shirt' + this.shirt], -132, 0);
        this.cardImage.image(ImagePreloader.preloadedImages['face' + this.face], -132, 0);
        this.cardImage.image(ImagePreloader.preloadedImages['brow' + this.brow], -132, 0);
        this.cardImage.image(ImagePreloader.preloadedImages['glasses' + this.glasses], -132, 0);
        this.cardImage.image(ImagePreloader.preloadedImages['hair' + this.hair], -132, 0);
        this.cardImage.image(ImagePreloader.preloadedImages['mouth' + this.mouth], -132, 0);
        if (this.summoningSickness) {
            this.cardImage.fill(0, 0, 0, 125);
            this.cardImage.rect(0, 0, this.cardImage.width, this.cardImage.height);
        }
        push();
        scale(Card.SCALE);
        image(this.cardImage, this.x / Card.SCALE, this.y / Card.SCALE);
        pop();
    };
    Card.SCALE = .25;
    return Card;
}());
var CardTypes;
(function (CardTypes) {
    CardTypes[CardTypes["Homie"] = 0] = "Homie";
    CardTypes[CardTypes["Battlefield"] = 1] = "Battlefield";
    CardTypes[CardTypes["Weapon"] = 2] = "Weapon";
    CardTypes[CardTypes["On_The_Spot"] = 3] = "On_The_Spot";
})(CardTypes || (CardTypes = {}));
var CryptoHomieGame = (function () {
    function CryptoHomieGame() {
        this.gameRunner = new GameRunner();
        this.gameRunner.startGame();
    }
    CryptoHomieGame.prototype.draw = function () {
        this.gameRunner.draw();
    };
    return CryptoHomieGame;
}());
var Deck = (function () {
    function Deck() {
    }
    Deck.makeDeck = function () {
        var newDeck = [];
        for (var i = 0; i < 60; i++) {
            var card = new Card();
            newDeck.push(card);
        }
        var myWeapon = new WeaponCard();
        newDeck.push(myWeapon);
        return newDeck;
    };
    return Deck;
}());
var CardMatchUp = (function () {
    function CardMatchUp() {
    }
    return CardMatchUp;
}());
var GameRunner = (function () {
    function GameRunner() {
        var _this = this;
        this.GAME_PHASES = [
            "pregame",
            "draw",
            "play card",
            "choose attackers",
            "choose defenders",
            "fight",
            "final play card",
            "throw away card",
            "change players"
        ];
        this.gamePhase = "pregame";
        this.attackers = [];
        this.defenders = [];
        this.players = [
            new Player(1),
            new Player(2)
        ];
        this.currentPlayer = this.players[0];
        var button;
        button = createButton('NEXT');
        button.position(windowWidth - 100, windowHeight - 400);
        button.mousePressed(function () {
            if (_this.gamePhase == "throw away card")
                return;
            if (_this.gamePhase != "draw")
                _this.changePhase();
            _this.processPhase();
        });
        document.addEventListener('click', this.mousePressedHandler.bind(this));
        document.addEventListener('dblclick', this.doubleClickHandler.bind(this));
        console.log("Game constructed");
    }
    Object.defineProperty(GameRunner.prototype, "otherPlayer", {
        get: function () {
            if (this.currentPlayer == this.players[0]) {
                return this.players[1];
            }
            else {
                return this.players[0];
            }
        },
        enumerable: true,
        configurable: true
    });
    GameRunner.prototype.changePhase = function () {
        if (this.GAME_PHASES.indexOf(this.gamePhase) + 1 < this.GAME_PHASES.length)
            this.gamePhase = this.GAME_PHASES[this.GAME_PHASES.indexOf(this.gamePhase) + 1];
        else
            this.gamePhase = this.GAME_PHASES[1];
    };
    GameRunner.prototype.processPhase = function () {
        if (this.gamePhase == "draw") {
            this.currentPlayer.drawACard();
            this.attackers = [];
            this.defenders = [];
            this.lastEarnedStreetCred = this.currentPlayer.rollForStreetCred();
            this.changePhase();
        }
        if (this.gamePhase == "play card") {
            if (this.currentPlayer.streetCred == 0)
                this.changePhase();
        }
        if (this.gamePhase == "choose attackers") {
        }
        if (this.gamePhase == "choose defenders") {
            if (this.attackers.length <= 0)
                this.changePhase();
        }
        if (this.gamePhase == "fight") {
            this.fight();
        }
        if (this.gamePhase == "final play card") {
            if (this.currentPlayer.streetCred == 0)
                this.changePhase();
        }
        if (this.gamePhase == "throw away card") {
            if (this.currentPlayer.hand.length < 8)
                this.changePhase();
        }
        if (this.gamePhase == "change players") {
            this.currentPlayer.board.forEach(function (card) { return card.summoningSickness = false; });
            this.currentPlayer = this.otherPlayer;
            this.currentPlayer.board.forEach(function (card) { return card.tapped = false; });
            this.changePhase();
        }
        console.log(this.gamePhase);
    };
    GameRunner.prototype.startGame = function () {
        this.players.forEach(function (player) { return player.drawAHandOfCards(); });
        this.gamePhase = "draw";
    };
    GameRunner.prototype.handleSelectCard = function () {
        var _this = this;
        this.currentPlayer.hand.forEach(function (card) {
            if (card.checkMouseIsOver()) {
                _this.selectedCard = card;
            }
        });
    };
    GameRunner.prototype.playCardToBoard = function () {
        if (this.gamePhase == "play card" || this.gamePhase == "final play card") {
            if (this.selectedCard && this.currentPlayer.hand.indexOf(this.selectedCard) != -1 && this.selectedCard.canBePlayed(this.currentPlayer.board, this.currentPlayer)) {
                this.currentPlayer.board.push(this.selectedCard);
                this.selectedCard.summoningSickness = true;
                this.currentPlayer.streetCred -= this.selectedCard.calculateCost();
                this.currentPlayer.hand.splice(this.currentPlayer.hand.indexOf(this.selectedCard), 1);
                this.selectedCard = null;
            }
        }
    };
    GameRunner.prototype.playCardToGraveyard = function () {
        if (this.gamePhase == "throw away card") {
            if (this.selectedCard && this.currentPlayer.hand.indexOf(this.selectedCard) != -1) {
                this.currentPlayer.graveYard.push(this.selectedCard);
                this.currentPlayer.hand.splice(this.currentPlayer.hand.indexOf(this.selectedCard), 1);
                this.selectedCard = null;
                this.processPhase();
            }
        }
    };
    GameRunner.prototype.chooseAttackers = function () {
        var _this = this;
        if (this.currentPlayer.board.length > 0) {
            this.currentPlayer.board.forEach(function (card) {
                if (card.checkMouseIsOver() && _this.attackers.indexOf(card) == -1 && card.canAttack()) {
                    _this.attackers.push(card);
                    card.tapped = true;
                }
            });
        }
        else {
            this.changePhase();
            this.processPhase();
        }
    };
    GameRunner.prototype.handleChooseDefenders = function () {
        var _this = this;
        if (this.attackers.length > 0 && this.otherPlayer.board.length > 0) {
            this.otherPlayer.board.forEach(function (card) {
                if (card.checkMouseIsOver() && _this.defenders.filter(function (defenderMatch) { return defenderMatch.defendingCard == card; }).length == 0 && !card.tapped) {
                    _this.lastSelectedDefender = card;
                }
            });
            this.attackers.forEach(function (card) {
                if (_this.lastSelectedDefender && card.checkMouseIsOver()) {
                    _this.defenders.push({
                        attackingCard: card,
                        defendingCard: _this.lastSelectedDefender
                    });
                }
            });
            console.log(this.defenders);
        }
        else {
            this.changePhase();
            this.processPhase();
        }
    };
    GameRunner.prototype.doubleClickHandler = function () {
        if (this.gamePhase == "play card" || this.gamePhase == "final play card") {
            this.playCardToBoard();
        }
        if (this.gamePhase == "throw away card") {
            this.playCardToGraveyard();
        }
    };
    GameRunner.prototype.mousePressedHandler = function () {
        if (this.gamePhase == "play card" || this.gamePhase == "final play card" || this.gamePhase == "throw away card") {
            this.handleSelectCard();
        }
        else if (this.gamePhase == "choose attackers") {
            this.chooseAttackers();
        }
        else if (this.gamePhase == "choose defenders") {
            this.handleChooseDefenders();
        }
    };
    GameRunner.prototype.fight = function () {
        var _this = this;
        if (this.attackers.length > 0) {
            this.attackers.forEach(function (attackCard) {
                attackCard.blocked = false;
                var blockers = _this.defenders.filter(function (defendingPair) { return defendingPair.attackingCard == attackCard; });
                if (blockers.length > 0) {
                    blockers.forEach(function (blocker) {
                        attackCard.blocked = true;
                        attackCard.defense -= blocker.defendingCard.attack;
                        blocker.defendingCard.defense -= attackCard.attack;
                        if (blocker.defendingCard.defense <= 0) {
                            _this.otherPlayer.board.splice(_this.otherPlayer.board.indexOf(blocker.defendingCard), 1);
                            _this.otherPlayer.graveYard.push(blocker.defendingCard);
                        }
                        if (attackCard.defense <= 0) {
                            _this.currentPlayer.board.splice(_this.currentPlayer.board.indexOf(attackCard), 1);
                            _this.currentPlayer.graveYard.push(attackCard);
                        }
                    });
                }
                if (attackCard.defense > 0 && !attackCard.blocked) {
                    _this.otherPlayer.life -= attackCard.attack;
                }
            });
            this.defenders = [];
        }
        else {
            this.changePhase();
            this.processPhase();
        }
    };
    GameRunner.prototype.draw = function () {
        if (this.gamePhase != "pregame") {
            this.drawBoard();
            this.drawPlayersHand(this.players[0]);
            this.drawPlayersHand(this.players[1], true);
            this.drawGameText();
            if (this.defenders) {
                this.drawDefenderLine();
            }
        }
    };
    GameRunner.prototype.drawDefenderLine = function () {
        this.defenders.forEach(function (defenderMatch) {
            var defendingCard = defenderMatch.defendingCard, attackingCard = defenderMatch.attackingCard;
            var _a = defendingCard.getCenter(), x = _a.x, y = _a.y;
            var _b = attackingCard.getCenter(), x2 = _b.x, y2 = _b.y;
            strokeWeight(3);
            stroke(255, 0, 0);
            line(x, y, x2, y2);
            strokeWeight(0);
        });
    };
    GameRunner.prototype.drawGameText = function () {
        fill(255);
        textSize(24);
        text(this.gamePhase, windowWidth - 400, windowHeight - 500);
        textSize(20);
        text("Player " + this.players[1].playerNumber, windowWidth - 200, 30);
        text("Life: " + this.players[1].life, windowWidth - 200, 50);
        text("Street Cred: " + this.players[1].streetCred, windowWidth - 200, 70);
        text("Graveyard Size: " + this.players[1].graveYard.length, windowWidth - 200, 90);
        text("New Street Cred Earned: " + this.lastEarnedStreetCred, windowWidth - 400, windowHeight - 460);
        textSize(20);
        text("Player " + this.players[0].playerNumber, windowWidth - 200, 600);
        text("Life: " + this.players[0].life, windowWidth - 200, 620);
        text("Street Cred: " + this.players[0].streetCred, windowWidth - 200, 640);
        text("Graveyard Size: " + this.players[0].graveYard.length, windowWidth - 200, 660);
    };
    GameRunner.prototype.drawBoard = function () {
        this.drawPlayersBoard(this.players[0]);
        this.drawPlayersBoard(this.players[1], true);
    };
    GameRunner.prototype.drawPlayersBoard = function (player, drawOnTop) {
        var _this = this;
        if (drawOnTop === void 0) { drawOnTop = false; }
        player.board.forEach(function (card) {
            var yOffset = drawOnTop ? -100 : 100;
            card.y = windowHeight / 2 + yOffset;
            card.x = windowWidth / 2 + player.board.indexOf(card) * 150 - player.board.length / 2 * 150;
            card.draw(_this.attackers.indexOf(card) != -1);
        });
    };
    GameRunner.prototype.drawPlayersHand = function (player, drawOnTop) {
        var _this = this;
        if (drawOnTop === void 0) { drawOnTop = false; }
        var displayArray = player.hand.slice();
        var isCardHovered = displayArray.filter(function (card) { return card.checkMouseIsOver(); });
        if (player == this.currentPlayer && isCardHovered.length > 0) {
            displayArray.sort(function (a, b) {
                return Math.pow(b.getCenter().x - mouseX, 2) - Math.pow(a.getCenter().x - mouseX, 2);
            });
        }
        displayArray.forEach(function (card) {
            card.x = windowWidth / 2 + player.hand.indexOf(card) * 100 - player.hand.length / 2 * 100;
            card.y = drawOnTop ? 10 : windowHeight - 100;
            var highlighted = false;
            if (_this.selectedCard == card) {
                card.y += drawOnTop ? 100 : -100;
                highlighted = true;
            }
            card.draw(highlighted);
        });
    };
    return GameRunner;
}());
var ImagePreloader = (function () {
    function ImagePreloader() {
    }
    ImagePreloader.prototype.ImagePreloader = function () {
    };
    ImagePreloader.loadImages = function () {
        for (var index = 0; index < 4; index++) {
            ImagePreloader.preloadedImages['brow' + index] = loadImage("images/eyebrows/brow" + (index + 1) + ".png");
        }
        for (var index = 0; index < 7; index++) {
            ImagePreloader.preloadedImages['face' + index] = loadImage("images/face/face" + (index + 1) + ".png");
        }
        for (var index = 0; index < 11; index++) {
            ImagePreloader.preloadedImages['glasses' + index] = loadImage("images/glasses/glasses" + (index + 1) + ".png");
        }
        for (var index = 0; index < 20; index++) {
            ImagePreloader.preloadedImages['hair' + index] = loadImage("images/hair/hair" + (index + 1) + ".png");
        }
        for (var index = 0; index < 10; index++) {
            ImagePreloader.preloadedImages['shirt' + index] = loadImage("images/shirt/shirt" + (index + 1) + ".png");
        }
        for (var index = 0; index < 25; index++) {
            ImagePreloader.preloadedImages['hair' + index] = loadImage("images/hair/hair" + (index + 1) + ".png");
        }
        for (var index = 0; index < 6; index++) {
            ImagePreloader.preloadedImages['mouth' + index] = loadImage("images/mouth/mouth" + (index + 1) + ".png");
        }
        for (var index = 0; index < 8; index++) {
            ImagePreloader.preloadedImages['weapons' + index] = loadImage("images/weapons/weapons" + (index + 1) + ".png");
        }
        for (var index = 0; index < 8; index++) {
            ImagePreloader.preloadedImages['board' + index] = loadImage("images/table/table.png");
        }
    };
    ImagePreloader.preloadedImages = {};
    return ImagePreloader;
}());
var Keyword = (function () {
    function Keyword() {
    }
    return Keyword;
}());
var Player = (function () {
    function Player(playerNumber) {
        this.playerNumber = playerNumber;
        this.life = 20;
        this.handLimit = 7;
        this.selectedDeck = new Deck();
        this.streetCred = 0;
        this.graveYard = [];
        this.board = [];
        this.selectedDeck.cards = Deck.makeDeck();
    }
    Player.prototype.drawACard = function () {
        this.hand.push(this.selectedDeck.cards.pop());
    };
    Player.prototype.drawAHandOfCards = function (drawOnTop) {
        if (drawOnTop === void 0) { drawOnTop = false; }
        this.hand = [];
        for (var i = 0; i < 7; i++) {
            this.drawACard();
        }
    };
    Player.prototype.rollForStreetCred = function () {
        var newStreetCred = Math.floor(Math.random() * 5) + 1;
        this.streetCred += newStreetCred;
        return newStreetCred;
    };
    Player.prototype.draw = function (drawOnTop) {
        if (drawOnTop === void 0) { drawOnTop = false; }
    };
    return Player;
}());
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var SpecialCard = (function (_super) {
    __extends(SpecialCard, _super);
    function SpecialCard() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SpecialCard.prototype.calculateCost = function () {
        return 0;
    };
    return SpecialCard;
}(Card));
var WeaponCard = (function (_super) {
    __extends(WeaponCard, _super);
    function WeaponCard() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.weapons = Math.floor(random(0, 8));
        return _this;
    }
    WeaponCard.prototype.calculateCost = function () {
        return 5;
    };
    WeaponCard.prototype.getCenter = function () {
        return { x: this.x + this.cardImage.width * Card.SCALE / 2, y: this.y + this.cardImage.height * Card.SCALE / 2 };
    };
    WeaponCard.prototype.drawBackgroundOfCard = function (highlighted) {
        if (highlighted === void 0) { highlighted = false; }
        this.cardImage.background("#ffee00");
        this.cardImage.noFill();
        this.cardImage.strokeWeight(10);
        highlighted ? this.cardImage.stroke(0, 200, 255) : this.cardImage.stroke(0);
        this.cardImage.rect(0, 0, this.cardImage.width, this.cardImage.height);
        this.cardImage.stroke(0);
    };
    WeaponCard.prototype.draw = function (highlighted) {
        if (highlighted === void 0) { highlighted = false; }
        this.drawBackgroundOfCard(highlighted);
        this.cardImage.rect(29, 75, 473, 324);
        this.cardImage.strokeWeight(3);
        this.cardImage.textSize(36);
        this.cardImage.textFont("Arial");
        this.cardImage.text("WEAPON", 40, 50);
        this.cardImage.text(this.attack + "/" + this.defense + " -- " + this.calculateCost() + " cred", 300, 50);
        this.cardImage.image(ImagePreloader.preloadedImages['weapons' + this.weapons], -450, -20);
        if (this.summoningSickness) {
            this.cardImage.fill(0, 0, 0, 125);
            this.cardImage.rect(0, 0, this.cardImage.width, this.cardImage.height);
        }
        push();
        scale(Card.SCALE);
        image(this.cardImage, this.x / Card.SCALE, this.y / Card.SCALE);
        pop();
    };
    return WeaponCard;
}(Card));
var game;
function setup() {
    console.log("🚀 - Setup initialized - P5 is running");
    game = new CryptoHomieGame();
    createCanvas(windowWidth, windowHeight);
    rectMode(CORNER).noFill().frameRate(30);
    ImagePreloader.loadImages();
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
function draw() {
    background('#006cff');
    game.draw();
}
//# sourceMappingURL=build.js.map