//=============================================================================
// ButtonMash.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Button Mash Mini-Game v1.0.0
 * @author YourName
 * @url 
 * @help ButtonMash.js
 * 
 * @param defaultKey
 * @text Default Button
 * @desc Default button to mash (z, x, space, enter, left, right, up, down)
 * @type string
 * @default z
 * 
 * @param defaultDuration
 * @text Default Duration (seconds)
 * @desc How long the button mash lasts
 * @type number
 * @min 1
 * @max 30
 * @default 5
 * 
 * @param defaultTarget
 * @text Default Target Presses
 * @desc Number of presses needed to win
 * @type number
 * @min 1
 * @max 200
 * @default 20
 * 
 * @param successSwitch
 * @text Success Switch ID
 * @desc Switch that turns ON when player wins
 * @type switch
 * @default 1
 * 
 * @param failSwitch
 * @text Fail Switch ID
 * @desc Switch that turns ON when player fails
 * @type switch
 * @default 2
 * 
 * @command startButtonMash
 * @text Start Button Mash
 * @desc Start the button mash mini-game
 * 
 * @arg key
 * @text Button to Press
 * @desc Which button to mash (if using arrows: left goes left, right goes right)
 * @type combo
 * @option z
 * @option x
 * @option space
 * @option enter
 * @option left
 * @option right
 * @option up
 * @option down
 * @default z
 * 
 * @arg duration
 * @text Duration (seconds)
 * @desc How long the game lasts
 * @type number
 * @min 1
 * @max 30
 * @default 5
 * 
 * @arg target
 * @text Target Presses
 * @desc How many presses needed to win
 * @type number
 * @min 1
 * @max 200
 * @default 20
 * 
 * @help ButtonMash.js
 * 
 * This plugin adds a button mashing mini-game to your RPG Maker MZ project.
 * 
 * Plugin Commands:
 * - Start Button Mash: Begins the mini-game with specified parameters
 * 
 * Script Calls:
 * $gameSystem.startButtonMash(key, duration, target, onSuccess, onFail);
 * 
 * Example:
 * $gameSystem.startButtonMash('z', 5, 20, 
 *   function() { $gameSwitches.setValue(1, true); },
 *   function() { $gameSwitches.setValue(2, true); }
 * );
 * 
 * Keys supported: 'z', 'x', 'space', 'enter', 'shift', 'ctrl', 'left', 'right', 'up', 'down'
 */

(() => {
    'use strict';
    
    const pluginName = 'ButtonMash';
    const parameters = PluginManager.parameters(pluginName);
    const defaultKey = parameters['defaultKey'] || 'z';
    const defaultDuration = parseInt(parameters['defaultDuration']) || 5;
    const defaultTarget = parseInt(parameters['defaultTarget']) || 20;
    const successSwitch = parseInt(parameters['successSwitch']) || 1;
    const failSwitch = parseInt(parameters['failSwitch']) || 2;

    // Key mapping
    const keyMap = {
        'z': 90,
        'x': 88,
        'space': 32,
        'enter': 13,
        'shift': 16,
        'ctrl': 17,
        'left': 37,
        'right': 39,
        'up': 38,
        'down': 40
    };

    // Button Mash Scene
    class Scene_ButtonMash extends Scene_Base {
        constructor() {
            super();
            this._key = 'z';
            this._duration = 5;
            this._target = 20;
            this._onSuccess = null;
            this._onFail = null;
        }

        initialize(key, duration, target, onSuccess, onFail) {
            this._key = key || defaultKey;
            this._duration = duration || defaultDuration;
            this._target = target || defaultTarget;
            this._onSuccess = onSuccess;
            this._onFail = onFail;
            this._presses = 0;
            this._timeLeft = this._duration * 60; // Convert to frames
            this._gameEnded = false;
        }

        create() {
            super.create();
            this.createBackground();
            this.createWindowLayer();
            this.createDisplay();
        }

        createBackground() {
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
            this._backgroundSprite.opacity = 128;
            this.addChild(this._backgroundSprite);
        }

        createDisplay() {
            // Main window
            const rect = new Rectangle(100, 100, Graphics.width - 200, 300);
            this._displayWindow = new Window_ButtonMash(rect);
            this._displayWindow.setup(this._key, this._target, this._presses, this._timeLeft);
            this.addWindow(this._displayWindow);

            // Progress bar
            this._progressBar = new Sprite();
            this._progressBar.bitmap = new Bitmap(Graphics.width - 240, 40);
            this._progressBar.x = 120;
            this._progressBar.y = 280;
            this.addChild(this._progressBar);

            this.updateProgressBar();
        }

        update() {
            super.update();
            if (!this._gameEnded) {
                this.updateInput();
                this.updateTimer();
                this.updateDisplay();
                this.checkGameEnd();
            }
        }

        updateInput() {
            const keyCode = keyMap[this._key.toLowerCase()];
            if (keyCode && Input._currentState[keyCode] && !Input._previousState[keyCode]) {
                this._presses++;
                SoundManager.playCursor();
            }
        }

        updateTimer() {
            this._timeLeft--;
            if (this._timeLeft <= 0) {
                this._timeLeft = 0;
            }
        }

        updateDisplay() {
            this._displayWindow.refresh(this._key, this._target, this._presses, this._timeLeft);
            this.updateProgressBar();
        }

        updateProgressBar() {
            const bitmap = this._progressBar.bitmap;
            bitmap.clear();
            
            // Background
            bitmap.fillRect(0, 0, bitmap.width, bitmap.height, '#333333');
            
            // Progress
            const progress = Math.min(this._presses / this._target, 1);
            const progressWidth = Math.floor(bitmap.width * progress);
            const color = progress >= 1 ? '#00ff00' : '#0099ff';
            bitmap.fillRect(0, 0, progressWidth, bitmap.height, color);
            
            // Border
            bitmap.strokeRect(0, 0, bitmap.width, bitmap.height, '#ffffff');
        }

        checkGameEnd() {
            if (this._presses >= this._target) {
                this.endGame(true);
            } else if (this._timeLeft <= 0) {
                this.endGame(false);
            }
        }

        endGame(success) {
            this._gameEnded = true;
            
            if (success) {
                SoundManager.playRecovery();
                $gameSwitches.setValue(successSwitch, true);
                if (this._onSuccess) this._onSuccess();
            } else {
                SoundManager.playMiss();
                $gameSwitches.setValue(failSwitch, true);
                if (this._onFail) this._onFail();
            }

            setTimeout(() => {
                SceneManager.pop();
            }, 1500);
        }
    }

    // Display Window
    class Window_ButtonMash extends Window_Base {
        constructor(rect) {
            super(rect);
        }

        setup(key, target, presses, timeLeft) {
            this._key = key;
            this._target = target;
            this._presses = presses;
            this._timeLeft = timeLeft;
            this.refresh();
        }

        refresh(key, target, presses, timeLeft) {
            if (key !== undefined) this._key = key;
            if (target !== undefined) this._target = target;
            if (presses !== undefined) this._presses = presses;
            if (timeLeft !== undefined) this._timeLeft = timeLeft;

            this.contents.clear();
            
            // Title
            this.changeTextColor(ColorManager.systemColor());
            this.drawText('¡BUTTON MASH!', 0, 0, this.contentsWidth(), 'center');
            
            // Instructions
            this.changeTextColor(ColorManager.normalColor());
            const keyText = this._key.toUpperCase();
            this.drawText(`¡Presiona [${keyText}] rápidamente!`, 0, 40, this.contentsWidth(), 'center');
            
            // Progress
            this.changeTextColor(ColorManager.hpColor(this._presses / this._target));
            this.drawText(`${this._presses} / ${this._target}`, 0, 80, this.contentsWidth(), 'center');
            
            // Time
            const seconds = Math.ceil(this._timeLeft / 60);
            this.changeTextColor(seconds <= 2 ? ColorManager.deathColor() : ColorManager.normalColor());
            this.drawText(`Tiempo: ${seconds}s`, 0, 120, this.contentsWidth(), 'center');
        }
    }

    // Game System extensions
    Game_System.prototype.startButtonMash = function(key, duration, target, onSuccess, onFail) {
        const scene = new Scene_ButtonMash();
        scene.initialize(key, duration, target, onSuccess, onFail);
        SceneManager.push(scene);
    };

    // Plugin Command Registration
    PluginManager.registerCommand(pluginName, "startButtonMash", args => {
        const key = args.key || defaultKey;
        const duration = parseInt(args.duration) || defaultDuration;
        const target = parseInt(args.target) || defaultTarget;
        
        $gameSystem.startButtonMash(key, duration, target);
    });

})();