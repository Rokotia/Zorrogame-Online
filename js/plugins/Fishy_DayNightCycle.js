//=============================================================================
// Fishy_DayNightCycle.js
//=============================================================================
/*:
* @target MZ
* @plugindesc v1.0.0 Fishy Day Night Cycle
* @author Laugexd
* @help Fishy_DayNightCycle.js
*
* This is a plugin allowing you to quickly add a day and night cycle to your game.
* To disable tinting on a specific map, add the following notetag to the map's notes: "<fishy no tint>".

--Setup--
Install the plugin and set up your screen tints
Set up the variables you want to save the minute and hour to
Create a parallel common event
Add the plugin command "init" from this plugin
Add a wait of 60 frames after this plugin command
Turn on the variable to activate your common event and the plugin will be running

--Script Calls--

Fishy.dayNightCycle.addTimeVariable(name, max, gameVariable, overflowVariable)
Adds another time variable to the list of time related variables handled by the plugin.
Parameters:
string name: name of the variable, example: 'minute'.
integer max: the max value of this variable, example: 59.
integer gameVariable: the game variable to save this value to, example: 1.
string overflowVariable: the time variable to increase when this time variable reaches it's limit, example: 'hour'.

Fishy.dayNightCycle.editTimeVariable(name, key, value)
Edits a time variable from the list of time related variables handled by the plugin.
Parameters:
string name: the name of the time variable to edit, example: 'hour'.
string key: the value to change, options: ('max', 'overflowVariable'), example: 'overflowVariable'.
mixed value: the value to change to, example: 'day'.

Fishy.dayNightCycle.setTime(name, value)
Sets the time of a specific time variable to the desired amount, if over max it will increase the overflowVariable the correct amount and leave the remainder on this variable.
Parameters:
string name: the name of the time variable to set, example: 'hour'.
integer value: the value to set it to, example: 22.

Fishy.dayNightCycle.getMinute()
Returns the current minute.

Fishy.dayNightCycle.getHour()
Returns the current hour.

--License--
Free for commercial and non-commercial use.
crediting is optional but if done i would prefer if you wrote my name as "laugexd" and if you have the option of inserting links, insert the link "https://rpgmaker.laugexd.com/"

* @param tintTimes
* @text Tint Screen Times
* @desc A list of times to tint the screen and what to tint them to, needs to be in order of earliest to latest.
* @default 
* @type struct<tintList>[]

* @param minuteVariable
* @text Minute Variable
* @desc The variable to save the minute of the hour in
* @default
* @type variable

* @param hourVariable
* @text Hour Variable
* @desc The variable to save the hour in
* @default
* @type variable

* @param smoothTint
* @text Smooth Tint
* @desc Should tinting between tint screen times be smoothed?
* @default false
* @type boolean

* @param realTime
* @text Use Real Time
* @desc Should real time be used instead of game time?
* @default false
* @type boolean

*
* @command init
* @desc run this command in a parallel common event in order for the day night cycle to work, preferably add a wait time of 60 frames after.

*
* @command forceTimeCheck
* @desc run this command to force updating of time.
*
*/

/*~struct~tintList:
*
* @param tint
* @text Tint
* @desc The tint to apply to the screen
* @default
* @type struct<tintScreen>
*
* @param hour
* @text Hour
* @desc The hour at which this tint should activate
* @default 0
* @type number
* @min 0
* @max 23
* @decimals 0
*
* @param minute
* @text Minute
* @desc The minute of the hour at which this tint should activate
* @default 0
* @type number
* @min 0
* @max 59
* @decimals 0
*/

/*~struct~tintScreen:
*
* @param red
* @text Red
* @desc the red color value of the tint
* @default 0
* @type number
* @min -255
* @max 255
* @decimals 0
*
* @param green
* @text Green
* @desc the green color value of the tint
* @default 0
* @type number
* @min -255
* @max 255
* @decimals 0
*
* @param blue
* @text Blue
* @desc the blue color value of the tint
* @default 0
* @type number
* @min -255
* @max 255
* @decimals 0
*
* @param gray
* @text Gray
* @desc the gray color value of the tint
* @default 0
* @type number
* @min 0
* @max 255
* @decimals 0
*/


var Fishy = Fishy || {};
Fishy.dayNightCycle = {};
Fishy.dayNightCycle.pluginName = 'Fishy_DayNightCycle';
Fishy.dayNightCycle.version = 100;
Fishy.dayNightCycle.currentTint = {};
Fishy.dayNightCycle.currentAnimationStartTime = {};
Fishy.dayNightCycle.currentAnimationEndTime = {};
Fishy.dayNightCycle.currentTintTime = -1;
Fishy.dayNightCycle.realTime = false;
Fishy.dayNightCycle.timeVariables = [];
Fishy.dayNightCycle._init = function() {
    let minuteVariable = PluginManager.parameters(this.pluginName).minuteVariable;
    if (minuteVariable != null) {
        this.addTimeVariable('minute', 59, minuteVariable, 'hour');
    }
    let hourVariable = PluginManager.parameters(this.pluginName).hourVariable;
    if (hourVariable != null) {
        this.addTimeVariable('hour', 23, hourVariable, '');
    }
    this.realTime = JSON.parse(PluginManager.parameters(this.pluginName).realTime);
 
    PluginManager.registerCommand(this.pluginName, "init", args => {
        Fishy.dayNightCycle._forceTimeCheck();

        this._increaseTime('minute');
    });
 
    PluginManager.registerCommand(this.pluginName, "forceTimeCheck", args => {
        Fishy.dayNightCycle._forceTimeCheck(true);
    });
   
};

Fishy.dayNightCycle._forceTimeCheck = function(ignoreSmootTint = false) {
    if ($gameMap != null && $gameMap.mapId() > 0 && $dataMap != null) {
        let hourVariable = PluginManager.parameters(this.pluginName).hourVariable;
        let minuteVariable = PluginManager.parameters(this.pluginName).minuteVariable;
        let hour = $gameVariables.value(hourVariable);
        let minute = $gameVariables.value(minuteVariable);
        let startingHour = PluginManager.parameters(this.pluginName).startHour
        let startingMinute = PluginManager.parameters(this.pluginName).startMinute
        if (startingHour == null) {
            startingHour = 0;
        }
        if (startingMinute == null) {
            startingMinute = 0;
        }
        if (hour == null) {
            hour = startingHour;
        }
        if (minute == null) {
            minute = startingMinute;
        }
        if ($dataMap.note == null || $dataMap.note.contains('<fishy no tint>') == false) {
            let tintTimes = JSON.parse(PluginManager.parameters(this.pluginName).tintTimes);
            tintTimes.reverse();
            let foundTime = false;
            for (let i = 0; i < tintTimes.length; i++) {
                let tintTimeRaw = tintTimes[i];

                if (!foundTime) {
                    let tintTime = JSON.parse(tintTimeRaw);
                    let tint = JSON.parse(tintTime.tint);
                    if (hour >= tintTime.hour && minute >= tintTime.minute) {
                        let previousTintTime = null;
                        if ((i + 1) == tintTimes.length) {
                            previousTintTime = JSON.parse(tintTimes[0]);
                        } else {
                            previousTintTime = JSON.parse(tintTimes[i + 1]);
                        }
                        if (this.currentTint.red == null) {
                            if (previousTintTime != null) {
                                let previousTint = JSON.parse(previousTintTime.tint);
                                this.currentTint.red = parseInt(previousTint.red);
                                this.currentTint.green = parseInt(previousTint.green);
                                this.currentTint.blue = parseInt(previousTint.blue);
                                this.currentTint.gray = parseInt(previousTint.gray);
                            }
                        }
                        let newTintTime = false;
                        if (this.currentTintTime != i) {
                            newTintTime = true;
                            this.currentTintTime = i;
                        }
                        foundTime = true;
                        let newTint = {};
                        let now = new Date();
                        if (!ignoreSmootTint && JSON.parse(PluginManager.parameters(this.pluginName).smoothTint) === true) {
                            if (newTintTime) {
                                this.currentAnimationStartTime.red = null;
                                this.currentAnimationStartTime.green = null;
                                this.currentAnimationStartTime.blue = null;
                                this.currentAnimationStartTime.gray = null;
                            }
                            let nextTintTime = null;
                            if ((i - 1) == -1) {
                                nextTintTime = JSON.parse(tintTimes[tintTimes.length - 1]);
                            } else {
                                nextTintTime = JSON.parse(tintTimes[i - 1]);
                            }
                            let remainingMinutes = (Math.abs(hour - nextTintTime.hour) * 60) + (minute - nextTintTime.minute);
                            this.currentAnimationEndTime = new Date(now.getTime() + remainingMinutes * 60000);
                            this.currentAnimationEndTime = Math.abs(now.getTime() - this.currentAnimationEndTime.getTime());
                            let startTime = now.getTime();
                            let startTimeMinutes = (Math.abs(hour - tintTime.hour) * 60) + (minute - tintTime.minute);
                            startTime = new Date(now.getTime() + (startTimeMinutes * 60000));
                            startTime = startTime.getTime();
                            newTint.red = this._fishyCalculateCurrentBetweenMinAndMax(startTime, this.currentTint.red, parseInt(tint.red), 'red');
                            newTint.green = this._fishyCalculateCurrentBetweenMinAndMax(startTime, this.currentTint.green, parseInt(tint.green), 'green');
                            newTint.blue = this._fishyCalculateCurrentBetweenMinAndMax(startTime, this.currentTint.blue, parseInt(tint.blue), 'blue');
                            newTint.gray = this._fishyCalculateCurrentBetweenMinAndMax(startTime, this.currentTint.gray, parseInt(tint.gray), 'gray');
                        } else {
                            newTint.red = parseInt(tint.red);
                            newTint.green = parseInt(tint.green);
                            newTint.blue = parseInt(tint.blue);
                            newTint.gray = parseInt(tint.gray);
                        }

                        if (!ignoreSmootTint || (newTint.red != this.currentTint.red || newTint.green != this.currentTint.green || newTint.blue != this.currentTint.blue || newTint.gray != this.currentTint.gray)) {
                            let frames = 60;
                            if (ignoreSmootTint) {
                                frames = 1;
                            }
                            $gameScreen.startTint([newTint.red, newTint.green, newTint.blue, newTint.gray], frames);
                            this.currentTint.red = newTint.red;
                            this.currentTint.green = newTint.green;
                            this.currentTint.blue = newTint.blue;
                            this.currentTint.gray = newTint.gray;
                        }
    
                        break;
                    }
                }
            }
        } else {

        }
    }
}

Fishy.dayNightCycle._lerp = function(a, b, t) {
    return a * (1 - t) + b * t;
}

Fishy.dayNightCycle._fishyCalculateCurrentBetweenMinAndMax = function(currentTime, startValue, endValue, type) {
    let output = startValue;
    if (!this.currentAnimationStartTime.hasOwnProperty(type) || this.currentAnimationStartTime[type] == null) {
        this.currentAnimationStartTime[type] = currentTime;
    }
    
    let elapsedTime = currentTime - this.currentAnimationStartTime[type];
    if (elapsedTime < this.currentAnimationEndTime) {
        let multiplier = 1;
        multiplier = elapsedTime / this.currentAnimationEndTime;
        currentValue = this._lerp(startValue, endValue, multiplier);
        output = currentValue;

    } else {
        this.currentAnimationStartTime[type] = null;
    }

    return output;
}

Fishy.dayNightCycle._increaseTime = function(name, amount = 1) {
    if (this.realTime) {
        for (let i = 0; i < this.timeVariables.length; i++) {
            let value = null;
            if (this.timeVariables[i].name == 'second') {
                let date = new Date();
                value = date.getSeconds();
            } else if (this.timeVariables[i].name == 'minute') {
                let date = new Date();
                value = date.getMinutes();
            } else if (this.timeVariables[i].name == 'hour') {
                let date = new Date();
                value = date.getHours();
            } else if (this.timeVariables[i].name == 'day') {
                let date = new Date();
                value = date.getDate();
            } else if (this.timeVariables[i].name == 'month') {
                let date = new Date();
                value = date.getMonth() + 1;
            } else if (this.timeVariables[i].name == 'year') {
                let date = new Date();
                value = date.getFullYear();
            }
            
            if (value != null) {
                $gameVariables.setValue(this.timeVariables[i].gameVariable, value);
            }
        }
    } else {
        for (let i = 0; i < this.timeVariables.length; i++) {
            if (this.timeVariables[i].name == name) {
                for (let x = 0; x < amount; x++) {
                    let value = $gameVariables.value(this.timeVariables[i].gameVariable);
                    if (value >= this.timeVariables[i].max) {
                        value = 0;
                        this._increaseTime(this.timeVariables[i].overflowVariable)
                    } else {
                        value++;
                    }
                    $gameVariables.setValue(this.timeVariables[i].gameVariable, value);
                }
            }
        }
    }
}

Fishy.dayNightCycle.addTimeVariable = function(name, max, gameVariable, overflowVariable = '') {
    this.timeVariables.push({name: name, max: parseInt(max), overflowVariable: overflowVariable, gameVariable: gameVariable});
}
Fishy.dayNightCycle.editTimeVariable = function(name, key, value) {
    for (let i = 0; i < this.timeVariables.length; i++) {
        if (this.timeVariables[i].name == name) {
            if (key == 'max') {
                this.timeVariables[i].max = parseInt(value);
            } else if (key == 'overflowVariable') {
                this.timeVariables[i].overflowVariable = value;
            }
        }
    }
}

Fishy.dayNightCycle.setTime = function(name, value) {
    for (let i = 0; i < this.timeVariables.length; i++) {
        if (this.timeVariables[i].name == name) {
            if (value >= this.timeVariables[i].max) {
                let increaseBy = Math.floor(value / this.timeVariables[i].max);
                value = value % this.timeVariables[i].max;
                this._increaseTime(this.timeVariables[i].overflowVariable, increaseBy)
            } else {
                value += value;
            }
            $gameVariables.setValue(this.timeVariables[i].gameVariable, value);
        }
    }
}

Fishy.dayNightCycle.getMinute = function() {
    let minuteVariable = PluginManager.parameters(this.pluginName).minuteVariable;
    let minute = $gameVariables.value(minuteVariable);
    let startingMinute = PluginManager.parameters(this.pluginName).startMinute
    if (startingMinute == null) {
        startingMinute = 0;
    }
    if (minute == null) {
        minute = startingMinute;
    }

    return minute;
}

Fishy.dayNightCycle.getHour = function() {
    let hourVariable = PluginManager.parameters(this.pluginName).hourVariable;
    let hour = $gameVariables.value(hourVariable);
    let startingHour = PluginManager.parameters(this.pluginName).startHour
    if (startingHour == null) {
        startingHour = 0;
    }
    if (hour == null) {
        hour = startingHour;
    }

    return hour;
}

Fishy.dayNightCycle._init();


// end of file
