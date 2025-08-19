//=============================================================================
// ButtonMash.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Button Mash Mini-Game v1.1.0
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
 * @desc Which button to mash (write: left, right, up, down, z, x, space, enter)
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
 * $gameSystem.startButtonMash(key, duration, target);
 * 
 * Example:
 * $gameSystem.startButtonMash('left', 5, 20);
 * 
 * Keys supported: 'z', 'x', 'space', 'enter', 'left', 'right', 'up', 'down'
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

    // Key mapping for RPG Maker MZ
    const keyMap = {
        'z': 'ok',
        'x': 'cancel', 
        'space': 'ok',
        'enter': 'ok',
        'left': 'left',
        'right': 'right',
        'up': 'up',
        'down': 'down'
    };

    // Button Mash Scene
    class Scene_ButtonMash extends Scene_MenuBase {
        initialize() {
            super.initialize();
            this._key = 'z';
            this._duration = 5;
            this._target = 20;
            this._presses = 0;
            this._timeLeft = 0;
            this._gameEnded = false;
            this._lastInput = false;
        }

        prepare(key, duration, target) {
            this._key = key || defaultKey;
            this._duration = duration || defaultDuration;
            this._target = target || defaultTarget;
            this._presses = 0;
            this._timeLeft = this._duration * 60; // Convert to frames (60fps)
            this._gameEnded = false;
        }

        create() {
            super.create();
            this.createAllWindows();
        }

        createAllWindows() {
            this.createHelpWindow();
            this.createDisplayWindow();
        }

        createHelpWindow() {
            const rect = this.helpWindowRect();
            this._helpWindow = new Window_Help(rect);
            this._helpWindow.setText("¡DUELO DE PAYASOS!");
            this.addWindow(this._helpWindow);
        }

        helpWindowRect() {
            const wx = 0;
            const wy = 0;
            const ww = Graphics.boxWidth;
            const wh = this.calcWindowHeight(2, false);
            return new Rectangle(wx, wy, ww, wh);
        }

        createDisplayWindow() {
            const rect = this.displayWindowRect();
            this._displayWindow = new Window_ButtonMashDisplay(rect);
            this._displayWindow.setup(this._key, this._target, this._presses, this._timeLeft);
            this.addWindow(this._displayWindow);
        }

        displayWindowRect() {
            const wx = 0;
            const wy = this._helpWindow.y + this._helpWindow.height;
            const ww = Graphics.boxWidth;
            const wh = Graphics.boxHeight - wy;
            return new Rectangle(wx, wy, ww, wh);
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
            const inputKey = keyMap[this._key.toLowerCase()];
            if (!inputKey) return;

            let pressed = false;
            
            // Check for key press
            if (inputKey === 'ok' && Input.isTriggered('ok')) {
                pressed = true;
            } else if (inputKey === 'cancel' && Input.isTriggered('cancel')) {
                pressed = true;
            } else if (inputKey === 'left' && Input.isTriggered('left')) {
                pressed = true;
            } else if (inputKey === 'right' && Input.isTriggered('right')) {
                pressed = true;
            } else if (inputKey === 'up' && Input.isTriggered('up')) {
                pressed = true;
            } else if (inputKey === 'down' && Input.isTriggered('down')) {
                pressed = true;
            }

            if (pressed) {
                this._presses++;
                SoundManager.playCursor();
            }
        }

        updateTimer() {
            this._timeLeft--;
            if (this._timeLeft < 0) {
                this._timeLeft = 0;
            }
        }

        updateDisplay() {
            this._displayWindow.refresh(this._key, this._target, this._presses, this._timeLeft);
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
                $gameSwitches.setValue(failSwitch, false);
                this._helpWindow.setText("¡GANASTE EL DUELO!");
            } else {
                SoundManager.playBuzzer();
                $gameSwitches.setValue(successSwitch, false);
                $gameSwitches.setValue(failSwitch, true);
                this._helpWindow.setText("¡PERDISTE EL DUELO!");
            }

            this._displayWindow.refresh(this._key, this._target, this._presses, this._timeLeft);

            // Return to previous scene after delay
            setTimeout(() => {
                this.popScene();
            }, 2000);
        }
    }

    // Display Window
    class Window_ButtonMashDisplay extends Window_Base {
        initialize(rect) {
            super.initialize(rect);
            this._key = 'z';
            this._target = 20;
            this._presses = 0;
            this._timeLeft = 300;
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
            
            const lineHeight = this.lineHeight();
            let y = 0;

            // Instructions
            this.changeTextColor(ColorManager.systemColor());
            const keyText = this._key.toUpperCase();
            this.drawText(`¡Presiona [${keyText}] rápidamente!`, 0, y, this.contentsWidth(), 'center');
            y += lineHeight * 2;

            // Progress
            this.changeTextColor(ColorManager.normalColor());
            this.drawText("Progreso:", 0, y, this.contentsWidth(), 'center');
            y += lineHeight;

            // Progress bar
            const barWidth = this.contentsWidth() - 100;
            const barHeight = 20;
            const barX = 50;
            const barY = y;

            // Background
            this.contents.fillRect(barX, barY, barWidth, barHeight, ColorManager.gaugeBackColor());
            
            // Progress fill
            const progress = Math.min(this._presses / this._target, 1);
            const fillWidth = Math.floor(barWidth * progress);
            const color = progress >= 1 ? ColorManager.powerUpColor() : ColorManager.hpGaugeColor1();
            this.contents.fillRect(barX, barY, fillWidth, barHeight, color);
            
            y += lineHeight * 2;

            // Numbers
            this.changeTextColor(ColorManager.normalColor());
            this.drawText(`${this._presses} / ${this._target}`, 0, y, this.contentsWidth(), 'center');
            y += lineHeight * 2;

            // Time
            const seconds = Math.ceil(this._timeLeft / 60);
            this.changeTextColor(seconds <= 2 ? ColorManager.deathColor() : ColorManager.normalColor());
            this.drawText(`Tiempo: ${seconds}s`, 0, y, this.contentsWidth(), 'center');
        }
    }

    // Game System extension
    Game_System.prototype.startButtonMash = function(key, duration, target) {
        const scene = new Scene_ButtonMash();
        scene.prepare(key, duration, target);
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