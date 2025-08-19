
/*:
 * @target MZ
 * @plugindesc Button Mash QTE with progress bar - mash a key to fill the bar before time runs out! v1.1 by RPGMakerGPT
 * @author RPGMakerGPT
 *
 * @help
 * Use this script call in an event:
 * QTEManager.startMash("z", 10, 180, 10, 11);
 *
 * - "z" is the key to mash
 * - 10 is the number of times it must be pressed
 * - 180 is the time limit in frames (60 = 1 second)
 * - 10 is the Common Event ID to run on success
 * - 11 is the Common Event ID to run on failure
 */

var QTEManager = QTEManager || {};
QTEManager._active = false;
QTEManager._key = "";
QTEManager._timer = 0;
QTEManager._requiredPresses = 0;
QTEManager._currentPresses = 0;
QTEManager._successCE = 0;
QTEManager._failureCE = 0;
QTEManager._barSprite = null;

QTEManager.startMash = function(key, presses, time, successCE, failureCE) {
    this._active = true;
    this._key = key.toLowerCase();
    this._requiredPresses = presses;
    this._currentPresses = 0;
    this._timer = time;
    this._successCE = successCE;
    this._failureCE = failureCE;
    this.createProgressBar();
};

QTEManager.createProgressBar = function() {
    if (!SceneManager._scene) return;
    const scene = SceneManager._scene;
    const width = 300;
    const height = 20;
    const sprite = new Sprite(new Bitmap(width, height));
    sprite.x = (Graphics.width - width) / 2;
    sprite.y = Graphics.height - 100;
    sprite.bitmap.fillAll("black");
    scene.addChild(sprite);
    this._barSprite = sprite;
    this.updateProgressBar();
};

QTEManager.updateProgressBar = function() {
    if (!this._barSprite) return;
    const width = 300;
    const height = 20;
    const percent = this._currentPresses / this._requiredPresses;
    const filledWidth = Math.floor(width * percent);
    const bitmap = this._barSprite.bitmap;
    bitmap.clear();
    bitmap.fillRect(0, 0, width, height, "gray"); // background
    bitmap.fillRect(0, 0, filledWidth, height, "lime"); // progress
};

QTEManager.removeProgressBar = function() {
    if (this._barSprite && SceneManager._scene) {
        SceneManager._scene.removeChild(this._barSprite);
        this._barSprite = null;
    }
};

QTEManager.update = function() {
    if (!this._active) return;

    if (this._timer > 0) {
        this._timer--;

        if (Input.isTriggered(this._key)) {
            this._currentPresses++;
            this.updateProgressBar();
            if (this._currentPresses >= this._requiredPresses) {
                this._active = false;
                this.removeProgressBar();
                $gameTemp.reserveCommonEvent(this._successCE);
            }
        }

    } else {
        this._active = false;
        this.removeProgressBar();
        if (this._currentPresses >= this._requiredPresses) {
            $gameTemp.reserveCommonEvent(this._successCE);
        } else {
            $gameTemp.reserveCommonEvent(this._failureCE);
        }
    }
};

const alias_updateMainQTEBar = Scene_Map.prototype.updateMain;
Scene_Map.prototype.updateMain = function() {
    alias_updateMainQTEBar.call(this);
    QTEManager.update();
};
