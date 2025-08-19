//Tea_proximitySound.js
/*:
 * @target MZ
 * @plugindesc Adds proximity based sound to events (YT tutorial linked below)
 * @author Tea
 * @url https://discord.gg/pCSbpqYfPM
 *
 * @help
 * ############################################################################
 *                                Tea_proximitySound
 *                                    Version 1.4.4
 *                                        Tea
 * ############################################################################
 *
 * Special thanks to Drifty, Drag, Zeriab and SirLegna for their help!
 * 
 * @help https://discord.gg/pCSbpqYfPM
 * ^^^ Please follow the link above for the comprehensive help file, which includes 
 * screen shots and videos.
 *
 * @command remoteSoundEmitter
 * @text remote emitter
 * @desc Tag an event being triggered remotely by a separate controlling proximity sound event. 
 * 
 * @arg arg1
 * @text Remote Emitter
 * @desc Tag this event as being a sound emitter that is controlled by a separate event. No parameters required.
 * 
 * @command proximitySound
 * @text proximity sound
 * @desc Indicate ranges from an event where the ME volume set in that event will decrement evenly.
 * 
 * @arg arg1
 * @text Event ID
 * @desc The ID of the event you want to be the center point of your sound.
 * @default 0
 *  
 * @arg arg2
 * @text BGS (Background Sound)
 * @desc The BGS you want to use for the proximity sound
 * @type file
 * @dir audio/bgs/
 * @default  Choose BGS
 * 
 * @arg argSub2
 * @text BGS Pitch
 * @parent arg2
 * @type number
 * @default 100
 * @min 50
 * @max 150
 * 
 * @arg arg3
 * @text Range for BGS vol 100%.
 * @desc The tile radius around the event that will play the BGS at 100% volume.
 * @default 1
 * 
 * @arg arg4
 * @text Range for BGS vol 90%
 * @desc The tile radius around the event that will play the BGS at 90% volume.
 * @default 2
 * 
 * @arg arg5
 * @text Range for BGS vol 80%
 * @desc The tile radius around the event that will play the BGS at 80% volume.
 * @default 3
 * 
 * @arg arg6
 * @text Range for BGS vol 70%
 * @desc The tile radius around the event that will play the BGS at 70% volume.
 * @default 4
 * 
 * @arg arg7
 * @text Range for BGS vol 60%
 * @desc The tile radius around the event that will play the BGS at 60% volume.
 * @default 5
 * 
 * @arg arg8
 * @text Range for BGS vol 50%
 * @desc The tile radius around the event that will play the BGS at 50% volume.
 * @default 6
 * 
 * @arg arg9
 * @text Range for BGS vol 40%
 * @desc The tile radius around the event that will play the BGS at 40% volume.
 * @default 7
 * 
 * @arg arg10
 * @text Range for BGS vol 30%
 * @desc The tile radius around the event that will play the BGS at 30% volume.
 * @default 8
 * 
 * @arg arg11
 * @text Range for BGS vol 20%
 * @desc The tile radius around the event that will play the BGS at 20% volume.
 * @default 9
 * 
 * @arg arg12
 * @text Range for BGS vol 10%
 * @desc The tile radius around the event that will play the BGS at 10% volume.
 * @default 10
 * 
 * @arg arg13
 * @text The range that you want the sound to stop playing
 * @desc The tile radius around the event that will cancel the BGS.
 * @default 11
 *
 * @arg arg14
 * @text Turn dynamic 3D panning on?
 * @desc Pans sound more to the right or the left depending on player position and direction in relation to event. Works best in 3D. 
 * @type boolean
 * @on True
 * @off false
 * @default false
 * 
 * @arg arg15
 * @text Turn dynamic 2D panning on?
 * @desc Pans sound more to the right or the left depending on which side the event is in relation to the player. Works best in 2D.
 * @type boolean
 * @on True
 * @off false
 * @default false
 * 
 * 
 * @
 * ############################################################################
 *  End
 * ############################################################################
 * 
 * Change Log:
 * 1.0.0 - Release 
 * 1.1 - Fixed a bug where if you entered a map in a location that wasn't 
 * specified in your parameters, but in range of the proximity sound event
 * the sound wouldn't play until you stepped on the exact range coordinates
 * specified in the parameters.  
 * 1.2 - Fixed a critical bug that could cause a stack overflow error that will crash the game. 
 * 1.3 - Fixed a bug with how the sound was terminated when using 8-dir movement. It will now terminate the BGS if the player is walking diagonally.
 * 1.4 - Major update. 3D panning improved, panning contrast increased for better player perception, allowed for overlapping events, general optimization.
 * 1.4.1 - Hotfix for a case where a player intractable prox event bgs wouldn't play the second time, after being deactivated by the player, without player movement.
 * 1.4.2 - More optimizations
 * 1.4.3 - fixed remote emitters not working, added a plugin command to enable them
 * 1.4.4 - Sound will now start playing if the player is transferred or starts the game in range of a proximity sound without the player needed to take a step.
 * 1.5 - Made plugin compatible with spawned events, just leave EventID 0.
 *
 * https://discord.gg/DriftwoodGaming
 * https://www.youtube.com/DriftwoodGamingMV
 * https://www.patreon.com/DriftwoodGaming
 * https://driftwoodGaming.com
 * 
 */

(() => {
    'use strict';
    let dirCheck = false;
    let initial = 0;
    let codeRan = 0;

    AudioManager.playBgs = function(bgs, pos) {
        if (this.isCurrentBgs(bgs)) {
            this.updateBgsParameters(bgs);
        } else {
            if (bgs.name) {
                this._bgsBuffer = this.createBuffer("bgs/", bgs.name);
                this.updateBgsParameters(bgs);
                this._bgsBuffer.play(true, pos || 0);
            }
        }
        this.updateCurrentBgs(bgs, pos);
    }; 

    function getUniqueProximitySoundEventIds() {
        let uniqueEventIds = []; // Array to store unique event IDs
    
        // Ensure $dataMap and $dataMap.events are defined and not null
        if (!$dataMap || !$dataMap.events)
            return uniqueEventIds;
    
        // Iterate through each event in $dataMap.events
        for (let event of $dataMap.events) {
            // Skip if the event is null
            if (!event || !event.pages) continue;
            
            const activePageId = $gameMap.event(event.id).findProperPageIndex();
            if (activePageId < 0 || activePageId >= event.pages.length) continue;
            
            // get current active page id
            const page = event.pages[activePageId];
            if (!page || !page.list) continue;
            // Iterate through each command in the list
            for (let command of page.list) {
                // Check if the command code is 357 and parameters include "Tea_proximitySound"
                if (command.code === 357 && command.parameters[0] === "Tea_proximitySound") {
                    let gameEvent = $gameMap.event(event.id);
                    if(gameEvent.meetsConditions(page)){
                        // Add to the array if this ID is not already in it
                        if (!uniqueEventIds.includes(event.id)) {
                            uniqueEventIds.push(event.id);
                        }
                    }
                    
                }
            }
        }
        return uniqueEventIds; // Return the array of unique event IDs
    };

    // Function to calculate the distance between two points
    function calculateDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    };

    PluginManager.registerCommand("Tea_proximitySound", "remoteSoundEmitter", remoteSoundEmitter); 
    PluginManager.registerCommand("Tea_proximitySound", "proximitySound", proximitySound); 
    function remoteSoundEmitter(){};
    function proximitySound(args) {
        if (Number(args.arg1) === 0) {
            if (this && typeof this._eventId === "number") {
                args.arg1 = this._eventId;
            } else {
                console.warn("Tea_proximitySound: This plugin command must be called in an on map event");
                return; // safely exit the command if context is invalid
            }
        }
        let evtX = $gameMap.event(args.arg1).x;
        let evtY = $gameMap.event(args.arg1).y; 
        let plaX = $gamePlayer.x;
        let plaY = $gamePlayer.y;
        let dist = Math.round($gameMap.distance(plaX, plaY, evtX, evtY));
        let bgs = args.arg2;
        let pitch = args.argSub2;
        let dir = $gamePlayer.direction();
        let obj = { "name": bgs, "volume": 100, "pitch": pitch, "pan": 0 }; 
        let cond1 = 
        plaY <= evtY && plaX <= evtX && dir === 8 || 
        plaY <= evtY && plaX <= evtX && dir === 6 || 
        plaY >= evtY && plaX <= evtX && dir === 8 || 
        plaY >= evtY && plaX <= evtX && dir === 4 || 
        plaY >= evtY && plaX >= evtX && dir === 4 || 
        plaY >= evtY && plaX >= evtX && dir === 2 || 
        plaY <= evtY && plaX >= evtX && dir === 2 ||
        plaY <= evtY && plaX >= evtX && dir === 6;
        let cond2 = 
        plaY <= evtY && plaX <= evtX && dir === 4 || 
        plaY <= evtY && plaX <= evtX && dir === 2 || 
        plaY >= evtY && plaX <= evtX && dir === 2 || 
        plaY >= evtY && plaX <= evtX && dir === 6 || 
        plaY >= evtY && plaX >= evtX && dir === 6 || 
        plaY >= evtY && plaX >= evtX && dir === 8 ||
        plaY <= evtY && plaX >= evtX && dir === 8 || 
        plaY <= evtY && plaX >= evtX && dir === 4;

    // Iterate through all events to find the closest one
    let closestEventId = null;
    let minimumDistance = Number.MAX_VALUE;
    $gameMap.events().forEach(event => {
        let distance = calculateDistance(plaX, plaY, event.x, event.y);
        if (distance < minimumDistance && getUniqueProximitySoundEventIds().includes(event.eventId())) {
            minimumDistance = distance;
            closestEventId = event.eventId();
        }
    });
    if(dist >= 0 && dist <= args.arg3 && initial === 0 && closestEventId == args.arg1 || Math.floor(plaX) == evtX && Math.floor(plaY) == evtY && initial === 0 && closestEventId == args.arg1){
        dirCheck = true;
        //2D dynamic panning
        if (args.arg15 == "true"){
            if(plaX >= evtX){
                AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 100, "pitch": obj.pitch, "pan": obj.pan = -80 });
            };
            if(plaX <= evtX){
                AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 100, "pitch": obj.pitch, "pan": obj.pan = 80 });
            };
            initial = 1;
        };
        if(args.arg14 == "true"){
            //3D dynamic panning
            if(cond1){
                AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 100, "pitch": obj.pitch, "pan": obj.pan = 80 });  
            };
            if(cond2){
                AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 100, "pitch": obj.pitch, "pan": obj.pan = -80 });  
            };
            initial = 1;
        }else
            AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 100, "pitch": obj.pitch, "pan": obj.pan });
            initial = 1;
    };

    if(!AudioManager._currentBgs){
        if(dist >= 0 && dist <= args.arg3 && closestEventId == args.arg1 || Math.floor(plaX) == evtX && Math.floor(plaY) == evtY && closestEventId == args.arg1){
            dirCheck = true;
            //2D dynamic panning
            if (args.arg15 == "true"){
                if(plaX >= evtX){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 100, "pitch": obj.pitch, "pan": obj.pan = -80 });
                };
                if(plaX <= evtX){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 100, "pitch": obj.pitch, "pan": obj.pan = 80 });
                };
                initial = 0;
            };
            if(args.arg14 == "true"){
                //3D dynamic panning
                if(cond1){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 100, "pitch": obj.pitch, "pan": obj.pan = 80 });  
                };
                if(cond2){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 100, "pitch": obj.pitch, "pan": obj.pan = -80 });  
                };
                initial = 0;
            }else
                AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 100, "pitch": obj.pitch, "pan": obj.pan });
                initial = 0;
        };
    }

    if($gamePlayer.isMoving() === true && closestEventId == args.arg1 || codeRan === 0 && closestEventId == args.arg1){
        if(dist >= 0 && dist <= args.arg3 || Math.floor(plaX) == evtX && Math.floor(plaY) == evtY){
            dirCheck = true;
            //2D dynamic panning
            if (args.arg15 == "true"){
                if(plaX >= evtX){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 100, "pitch": obj.pitch, "pan": obj.pan = -80 });
                };
                if(plaX <= evtX){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 100, "pitch": obj.pitch, "pan": obj.pan = 80 });
                };
            };
            if(args.arg14 == "true"){
                //3D dynamic panning
                if(cond1){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 100, "pitch": obj.pitch, "pan": obj.pan = 80 });  
                };
                if(cond2){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 100, "pitch": obj.pitch, "pan": obj.pan = -80 });  
                };
            }else
                AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 100, "pitch": obj.pitch, "pan": obj.pan });
                codeRan = 1;
        };

        if(dist > args.arg3 && dist <= args.arg4){
            dirCheck = true;
            if (args.arg15 == "true"){
                if(plaX >= evtX){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 90, "pitch": obj.pitch, "pan": obj.pan = -80 });
                };
                if(plaX <= evtX){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 90, "pitch": obj.pitch, "pan": obj.pan = 80 });
                };
            };
            if(args.arg14 == "true"){
                if(cond1){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 90, "pitch": obj.pitch, "pan": obj.pan = 80 });  
                };
                if(cond2){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 90, "pitch": obj.pitch, "pan": obj.pan = -80 });  
                };   
            }else 
                AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 90, "pitch": obj.pitch, "pan": obj.pan });
                codeRan = 1;
        };

        if(dist > args.arg4 && dist <= args.arg5){
            dirCheck = true;
            if (args.arg15 == "true"){
                if(plaX >= evtX){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 80, "pitch": obj.pitch, "pan": obj.pan = -80 });
                };
                if(plaX <= evtX){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 80, "pitch": obj.pitch, "pan": obj.pan = 80 });
                };
            };
            if(args.arg14 == "true"){
                if(cond1){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 80, "pitch": obj.pitch, "pan": obj.pan = 80 });  
                };
                if(cond2){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 80, "pitch": obj.pitch, "pan": obj.pan = -80 });  
                };
            }else
                AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 80, "pitch": obj.pitch, "pan": obj.pan });
                codeRan = 1;
        };

        if(dist > args.arg5 && dist <= args.arg6){
            dirCheck = true;
            if (args.arg15 == "true"){
                if(plaX >= evtX){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 70, "pitch": obj.pitch, "pan": obj.pan = -80 });
                };
                if(plaX <= evtX){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 70, "pitch": obj.pitch, "pan": obj.pan = 80 });
                };
            };
            if(args.arg14 == "true"){
                if(cond1){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 70, "pitch": obj.pitch, "pan": obj.pan = 80 });  
                };
                if(cond2){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 70, "pitch": obj.pitch, "pan": obj.pan = -80 });  
                };
            }else
                AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 70, "pitch": obj.pitch, "pan": obj.pan });
                codeRan = 1;
        };

        if(dist > args.arg6 && dist <= args.arg7){
            dirCheck = true;
            if (args.arg15 == "true"){
                if(plaX >= evtX){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 60, "pitch": obj.pitch, "pan": obj.pan = -90 });
                };
                if(plaX <= evtX){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 60, "pitch": obj.pitch, "pan": obj.pan = 90 });
                };
            };
            if(args.arg14 == "true"){
                if(cond1){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 60, "pitch": obj.pitch, "pan": obj.pan = 90 });  
                };
                if(cond2){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 60, "pitch": obj.pitch, "pan": obj.pan = -90 });  
                };
            }else
                AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 60, "pitch": obj.pitch, "pan": obj.pan });
                codeRan = 1;
        };

        if(dist > args.arg7 && dist <= args.arg8){
            dirCheck = true;
            if (args.arg15 == "true"){
                if(plaX >= evtX){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 50, "pitch": obj.pitch, "pan": obj.pan = -100 });
                };
                if(plaX <= evtX){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 50, "pitch": obj.pitch, "pan": obj.pan = 100 });
                };
            };
            if(args.arg14 == "true"){
                if(cond1){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 50, "pitch": obj.pitch, "pan": obj.pan = 100 });  
                };
                if(cond2){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 50, "pitch": obj.pitch, "pan": obj.pan = -100 });  
                };
            }else
                AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 50, "pitch": obj.pitch, "pan": obj.pan });
                codeRan = 1;
        };

        if(dist > args.arg8 && dist <= args.arg9){
            dirCheck = true;
            if (args.arg15 == "true"){
                if(plaX >= evtX){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 40, "pitch": obj.pitch, "pan": obj.pan = -100 });
                };
                if(plaX <= evtX){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 40, "pitch": obj.pitch, "pan": obj.pan = 100 });
                };
            };
            if(args.arg14 == "true"){
                if(cond1){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 40, "pitch": obj.pitch, "pan": obj.pan = 100 });  
                };
                if(cond2){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 40, "pitch": obj.pitch, "pan": obj.pan = -100 });  
                };
            }else
                AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 40, "pitch": obj.pitch, "pan": obj.pan }); 
                codeRan = 1; 
        };

        if(dist > args.arg9 && dist <= args.arg10){
            dirCheck = true;
            if (args.arg15 == "true"){
                if(plaX >= evtX){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 30, "pitch": obj.pitch, "pan": obj.pan = -100 });
                };
                if(plaX <= evtX){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 30, "pitch": obj.pitch, "pan": obj.pan = 100 });
                };
            };
            if(args.arg14 == "true"){
                if(cond1){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 30, "pitch": obj.pitch, "pan": obj.pan = 100 });  
                };
                if(cond2){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 30, "pitch": obj.pitch, "pan": obj.pan = -100 });  
                };
            }else
                AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 30, "pitch": obj.pitch, "pan": obj.pan });
                codeRan = 1;
        };

        if(dist > args.arg10 && dist <= args.arg11){
            dirCheck = true;
            if (args.arg15 == "true"){
                if(plaX >= evtX){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 20, "pitch": obj.pitch, "pan": obj.pan = -100 });
                };
                if(plaX <= evtX){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 20, "pitch": obj.pitch, "pan": obj.pan = 100 });
                };
            };
            if(args.arg14 == "true"){
                if(cond1){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 20, "pitch": obj.pitch, "pan": obj.pan = 100 });  
                };
                if(cond2){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 20, "pitch": obj.pitch, "pan": obj.pan = -100 });  
                };
            }else
                AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 20, "pitch": obj.pitch, "pan": obj.pan });
                codeRan = 1;
        };

        if(dist > args.arg11 && dist <= args.arg12){
            dirCheck = true;
            if (args.arg15 == "true"){
                if(plaX >= evtX){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 10, "pitch": obj.pitch, "pan": obj.pan = -100 });
                };
                if(plaX <= evtX){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 10, "pitch": obj.pitch, "pan": obj.pan = 100 });
                };
            };
            if(args.arg14 == "true"){
                if(cond1){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 10, "pitch": obj.pitch, "pan": obj.pan = 100 });  
                };
                if(cond2){
                    AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 10, "pitch": obj.pitch, "pan": obj.pan = -100 });  
                };
            }else
                AudioManager.playBgs({ "name": obj.name, "volume": obj.volume = 10, "pitch": obj.pitch, "pan": obj.pan });
                codeRan = 1;
        };

        if(dist >= args.arg13 && dirCheck === true && getUniqueProximitySoundEventIds().includes(closestEventId)){
                AudioManager.fadeOutBgs(1); 
                dirCheck = false; 
                initial = 0; 
                codeRan = 0;
        }; 
    }; 
};

    const Tea_Game_Player_performTransfer = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function() {
        Tea_Game_Player_performTransfer.call(this)
        if (dirCheck === true && this._newMapId !== $gameMap.mapId()){
            AudioManager.fadeOutBgs(1);
            dirCheck = false;  
            initial = 0;    
        };
    };
})();



