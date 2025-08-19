
/*:
 * @target MZ
 * @plugindesc Button Mash QTE - press a key multiple times within a time limit to succeed! v1.0 by RPGMakerGPT
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

QTEManager.startMash = function(key, presses, time, successCE, failureCE) {
    this._active = true;
    this._key = key.toLowerCase();
    this._requiredPresses = presses;
    this._currentPresses = 0;
    this._timer = time;
    this._successCE = successCE;
    this._failureCE = failureCE;
};

QTEManager.update = function() {
    if (!this._active) return;

    if (this._timer > 0) {
        this._timer--;

        if (Input.isTriggered(this._key)) {
            this._currentPresses++;
            if (this._currentPresses >= this._requiredPresses) {
                this._active = false;
                $gameTemp.reserveCommonEvent(this._successCE);
            }
        }

    } else {
        this._active = false;
        if (this._currentPresses >= this._requiredPresses) {
            $gameTemp.reserveCommonEvent(this._successCE);
        } else {
            $gameTemp.reserveCommonEvent(this._failureCE);
        }
    }
};

const alias_updateMainMash = Scene_Map.prototype.updateMain;
Scene_Map.prototype.updateMain = function() {
    alias_updateMainMash.call(this);
    QTEManager.update();
};
