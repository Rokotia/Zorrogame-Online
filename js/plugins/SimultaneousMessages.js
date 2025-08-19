/*:
 *
 * @plugindesc Shows Multiple Messages Simultaneously
 * @author Jake Jilg "mogwai"
 * 
 * 
 *  When any of these tags are used, the tag will override default Top/Middle/Bottom
 *
 *  Use tags \[top] \[middle] \[bottom] on the same line to show text at the same time.
 * \[bottom]Hello, how are you doing?\[top]¿Hola cómo estás?
 *  
 * Optional tag parameters (only needed on first line) (must be in this order)
 *  
 * \[pos hue:R,G,B] \[top face:FaceName,Index,HueRotate] face hueRotate is optional 
 *
 * example \[middle hue:155,0,250 face:People4,2,150]
 *
 * version 0.3
 */

// ------- globals -------

var subWindowLayer;

var messageWindowBottom = {};
var messageWindowMiddle = {};
var messageWindowTop = {};

var simultaneousAquisition = [];

var okGetNum = {
	"bottom": 2,
	"middle": 1,
	"top"   : 0
};

var okGetFace = {
	2 : [], 
	1 : [],
	0 : []
};

var okGetTone = {
	2 : [0,0,0], 
	1 : [0,0,0],
	0 : [0,0,0]
};

// ------ aliases ----

// create three window children
(function(alias){
	Scene_Base.prototype.createWindowLayer = function() {
		alias.apply(this, arguments);
		var width = Graphics.boxWidth;
		var height = Graphics.boxHeight;
		var x = (Graphics.width - width) / 2;
		var y = (Graphics.height - height) / 2;
		
		subWindowLayer = this._windowLayer;
	};
})(Scene_Base.prototype.createWindowLayer);

// add our two new message window siblings
(function(alias){
	Scene_Map.prototype.createMessageWindow = function() {
		alias.apply(this, arguments);
		
		messageWindowBottom = this._messageWindow;
		messageWindowMiddle = new Window_Message();
		messageWindowTop    = new Window_Message();
		
		// the mainChild is the reactor
		messageWindowBottom._isMainChild = true;
		messageWindowMiddle._isMainChild = false;
		messageWindowTop._isMainChild    = false;
		
		subWindowLayer.addChild(messageWindowTop);
		subWindowLayer.addChild(messageWindowMiddle);
		
		messageWindowBottom._positionType = 2;
		messageWindowMiddle._positionType = 1;
		messageWindowTop._positionType    = 0;
 	};   
})(Scene_Map.prototype.createMessageWindow);

// when they clear, we clear too $gameMessage.clear
(function(alias){
	Game_Message.prototype.clear = function() {
		
		alias.apply(this, arguments);
		if(this.positionType() !== undefined)
			simultaneousAquisition = [this.positionType()];
		else
			simultaneousAquisition = [];
		okGetFace = {
			2 : [], 
			1 : [],
			0 : []
		};
		okGetTone = {
			2 : [0,0,0], 
			1 : [0,0,0],
			0 : [0,0,0]
		};
	};
})(Game_Message.prototype.clear);

// look for sign to simul-text $gameMessage.add
(function(alias){
	Game_Message.prototype.add = function() {
		
		var pe = simultaneousAquisition;
		if(pe.indexOf($gameMessage.positionType()) === -1)
			pe.push($gameMessage.positionType());
		
		arguments[0] = arguments[0].replace(
		/\\\[(top|middle|bottom)( hue:([\d,]+))?( face:([^\]]+))?]/g, 
		function(m, tag, m2, hue, m3, face){
			
			$gameMap._interpreter._waitCount += 5;
			
			if(m2 !== undefined){
				var hues = hue.split(",");
				for(var i = 0; i < hues.length; i++){
					hues[i] = parseInt(hues[i]);
				}
				okGetTone[okGetNum[tag]] = hues;
			}
			
			if(m3 !== undefined){
				okGetFace[okGetNum[tag]] = face.split(",");
			}
			
			if(pe.indexOf(okGetNum[tag]) === -1)
				pe.push(okGetNum[tag]);

			// lets hope this string doesn't come up in-game (it's used to parse)
			return "xThIsTx4G03sOn(" + okGetNum[tag] + "):";
			//      ^ sloppy yet functional
		});
		alias.apply(this, arguments);
    };
})(Game_Message.prototype.add);

// when I close, you close... just like that..
(function(alias){
	Window_Message.prototype.close = function() {
		$gameMap._interpreter._waitCount += 5;
		if(this._isMainChild){
			messageWindowMiddle.close();
			messageWindowTop.close();
		}
		alias.apply(this, arguments);
		
		this.isMakeMessage = false;
	};
})(Window_Message.prototype.close);

// when I open, you close... just like that..
(function(alias){
	Window_Message.prototype.open = function(textState) {
		var pe = simultaneousAquisition;
		if(pe.indexOf(this._positionType) !== -1)
			alias.apply(this, arguments);
	};
})(Window_Message.prototype.open);

// I want to look pretty for my window message
(function(alias){
	Window_Message.prototype.updateTone = function() {
		var tone = okGetTone[this._positionType] || [];
		if(tone.length > 0){
			this.setTone(tone[0]||0, tone[1]||0, tone[2]||0);
		}else{
			alias.apply(this, arguments);
		}
	};
})(Window_Message.prototype.updateTone);

// a unique face for a unique monicker 
(function(alias){
	Window_Message.prototype.drawFace =function(faceName, faceIndex, x, y, width, height){
		var face = okGetFace[this._positionType];
		
		if(face.length === 0)
			return alias.apply(this, arguments);
		
		var punim = face[0] !== undefined ? 
			face[0] : $gameMessage.faceName();
		var faceIndex = face[1] !== undefined ? 
			parseInt(face[1]) - 1 : $gameMessage.faceIndex();
		var hue =   face[2] !== undefined ? 
			parseInt(face[2]) : 0;
		
		width = width || Window_Base._faceWidth;
		height = height || Window_Base._faceHeight;
		var bitmap = ImageManager.loadFace(punim, hue);
		var pw = Window_Base._faceWidth;
		var ph = Window_Base._faceHeight;
		var sw = Math.min(width, pw);
		var sh = Math.min(height, ph);
		var dx = Math.floor(x + Math.max(width - pw, 0) / 2);
		var dy = Math.floor(y + Math.max(height - ph, 0) / 2);
		var sx = faceIndex % 4 * pw + (pw - sw) / 2;
		var sy = Math.floor(faceIndex / 4) * ph + (ph - sh) / 2;
		
		var contents = this.contents;
		bitmap.addLoadListener(function(){
			contents.blt(bitmap, sx, sy, sw, sh, dx, dy);
		});
	};
})(Window_Message.prototype.drawFace);



// ------ overwrites -------

// 3 endings for 1

Window_Message.prototype.updateMessage = function() {

	var top = messageWindowTop._textState || this._textState;
	var mid = messageWindowMiddle._textState || this._textState;;
	var bot = messageWindowBottom._textState || this._textState;;
	
	var pe = simultaneousAquisition;
	if(pe.indexOf(0) === -1)
		mid = this._textState;
	if(pe.indexOf(1) === -1)
		top = this._textState;
	
    if (this._textState) {
        while (!this.isEndOfText(this._textState)) {
            if (this.needsNewPage(this._textState)) {
                this.newPage(this._textState);
            }
            this.updateShowFast();
            this.processCharacter(this._textState);
            if (!this._showFast && !this._lineShowFast) {
                break;
            }
            if (this.pause || this._waitCount > 0) {
                break;
            }
        }
        if (this.isEndOfText(bot) && this.isEndOfText(mid) && this.isEndOfText(top)) {
            this.onEndOfText();
        }
        return true;
    } else {
        return false;
    }
};

// 3 message starts for 1
Window_Message.prototype.startMessage = function() {
	
	var text = $gameMessage.allText();
	if(text.match(/xThIsTx4G03sOn\(\d\):/) !== null){
		var txt = text.split(/xThIsTx4G03sOn/g);
		var text = "";
		for(var i = 0; i < txt.length; i++){
			if(txt[i].charAt(1) === (this._positionType+""))
				text += txt[i].substr(4) + "\n";
		}
		text = text.replace(/\n{2}/g,"\n");
	}
	this.isMakeMessage = true;
	
	if(this._isMainChild){
		if(!messageWindowMiddle.isMakeMessage){
			messageWindowMiddle.pause = false;
			messageWindowMiddle.startMessage();
		}
		if(!messageWindowTop.isMakeMessage){
			messageWindowTop.pause = false;
			messageWindowTop.startMessage();
		}
	}
    
    this._textState = {};
    this._textState.index = 0;
    this._textState.text = this.convertEscapeCharacters(text);
    this.newPage(this._textState);
    this.updatePlacement();
    this.updateBackground();
 	this.open();
};

// each window has it's own position type
Window_Message.prototype.updatePlacement = function() {
    //this._positionType = $gameMessage.positionType();
    messageWindowBottom._positionType = 2;
	messageWindowMiddle._positionType = 1;
	messageWindowTop._positionType    = 0;
	
    this.y = this._positionType * (Graphics.boxHeight - this.height) / 2;
    this._goldWindow.y = this.y > 0 ? 0 : Graphics.boxHeight - this._goldWindow.height;
};

// if we move the windows to $gameMessage.positionType(), they overlap
Window_Message.prototype.areSettingsChanged = function() {
    return (this._background !== $gameMessage.background());
            //this._positionType !== $gameMessage.positionType()
};

