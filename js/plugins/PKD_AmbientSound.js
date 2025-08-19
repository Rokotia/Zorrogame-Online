/*
 * Copyright (c) 2022 Vladimir Skrypnikov (Pheonix KageDesu)
 * <http://kdworkshop.net/>
 *
 *
 */

/*:
 * @plugindesc (v.1.0)[BASIC] Ambient Sound
 * @author Pheonix KageDesu
 * @target MZ MV
 * @url http://kdworkshop.net/plugins/ambient-sound
 *
 * @help
 * You can create sound points on the map that will be played at
 * a certain interval and only at a specified distance from the player.
 * ---------------------------------------------------------------------------
 * 
 * ===========================================================================
 * Script Calls:
 *
 * - Create ambient sound point on Map
 *  setAmbientInterval(ID, "FILE_NAME", X, Y, T1, T2, DISTANCE)
 *  
 *   * ID - unique ID (it is needed so that you can delete this sound point)
 *   * FILE_NAME - SE sound file name
 *   * X, Y - map coordinates
 *   * T1, T2 - The time (in SECONDS) after which the sound will be repeated.
 *      A random number is selected between T1 and T2
 *   * DISTANCE - the minimum distance to the player at which the
 *      sound point will be activated
 *
 *   Example: setAmbientInterval(1, "Miss", 10, 20, 1, 3, 5);
 * 
 * - Create ambient sound point on Event (links to event)
 *  setAmbientIntervalEv(ID, "FILE_NAME", EVENT_ID, T1, T2, DISTANCE)
 *
 *  * EVENT_ID - event Id on map to link sound point.
 *  All other arguments is same
 *
 *   Example: setAmbientIntervalEv(2, "Equip1", 8, 1, 3, 3);
 *
 * - Create looped ambient sound on Map
 *  setAmbientLoop(ID, "FILE_NAME", X, Y, DISTANCE, LOOP_REPEAT_TIME)
 *
 *  * LOOP_REPEAT_TIME - the time (in MILLISECONDS) after which the sound
 *    will be played again (while the previous one does not stop)
 *    All other arguments is same
 *
 *   Example: setAmbientLoop(3, "Waterfall", 10, 20, 5, 150);
 *
 * - Create looped ambient sound point on Event (links to event)
 *   setAmbientLoopEv(ID, "FILE_NAME", EVENT_ID, DISTANCE, LOOP_REPEAT_TIME)
 *
 *
 * - Clear ambient sound point
 *   clearAmbientSound(ID)
 *
 * ---------------------------------------------------------------------------
 * If you like my Plugins, want more and offten updates,
 * please support me on Boosty or Patreon!
 * 
 * Boosty Page:
 *      https://boosty.to/kagedesu
 * Patreon Page:
 *      https://www.patreon.com/KageDesu
 * YouTube Channel:
 *      https://www.youtube.com/channel/UCA3R61ojF5vp5tGwJ1YqdgQ?
 *
 * You can use this plugin in your game thanks to all my Patrons!
 * 
  *
 * 

 * @param volumeMod
 * @text Volume Multiplier
 * @type number
 * @default 100
 * @min 1
 * @desc Ambient sounds volume multiplier in %. 100 = 100%
 * 
 * @param resetOnMapChange
 * @text Auto Clear
 * @type boolean
 * @default false
 * @on Clear
 * @off Keep
 * @desc Clear all sound points when map is changes?
 * 
 * 
 * 
 */

/*:ru
 * @plugindesc (v.1.0)[BASIC] Ambient Sound (Окружающий звук)
 * @author Pheonix KageDesu
 * @target MZ MV
 * @url http://kdworkshop.net/plugins/ambient-sound
 *
 * @help
 * Плагин позволяет создавать точки-источники звука на карте.
 * Данные точки могут быть зацикленны или вопроизводится в определённом
 * интервале. Также могут менять свою громкость в зависимости от
 * расстояния до слушателя (игрока) и активироваться на определённом
 * расстоянии от слушателя.
 * 
 * ---------------------------------------------------------------------------
 * 
 * ===========================================================================
 * Вызовы скриптов:
 *
 * - Создать источник звука
 *  setAmbientInterval(ID, "ИМЯ_ФАЙЛА", X, Y, T1, T2, DISTANCE)
 *  
 *   * ID - уникальный идентификатор (чтобы можно было удалить данную точку)
 *   * ИМЯ_ФАЙЛА - имя SE файла звука
 *   * X, Y - координаты на карте
 *   * T1, T2 - Интервал (в секундах) повторения воспроизведения
 *      Случайное число будет выбранно между T1 и T2
 *   * DISTANCE - мин. расстояние до игрока на котором звук будет активирован
 *
 *   Пример: setAmbientInterval(1, "Miss", 10, 20, 1, 3, 5);
 * 
 * - Создать источник звука (привязать к событию)
 *  setAmbientIntervalEv(ID, "ИМЯ_ФАЙЛА", EVENT_ID, T1, T2, DISTANCE)
 *
 *  * EVENT_ID - номер события на карте к которому привязывается звук
 *  Остальные аргументы аналогичны
 *
 *   Пример: setAmbientIntervalEv(2, "Equip1", 8, 1, 3, 3);
 *
 * - Создать зацикленный источник звука в точке карты
 *  setAmbientLoop(ID, "ИМЯ_ФАЙЛА", X, Y, DISTANCE, LOOP_REPEAT_TIME)
 *
 *  * LOOP_REPEAT_TIME - время (в миллисекундах) через которое звук будет
 * повторятся, т.е. запускаться снова (накладывается на предыдущий)
 *    Остальные аргументы аналогичны
 *
 *   Пример: setAmbientLoop(3, "Waterfall", 10, 20, 5, 150);
 *
 * - Создать зацикленный источник звука с привязкой к событию
 *   setAmbientLoopEv(ID, "ИМЯ_ФАЙЛА", EVENT_ID, DISTANCE, LOOP_REPEAT_TIME)
 *  Остальные аргументы аналогичны (см. выше)
 *
 * - Удалить точку источник звука
 *   clearAmbientSound(ID)
 *
 * ---------------------------------------------------------------------------
 *  Это BASIC (базовая) версия плагина и имеет некоторые ограничения:
 *    - Максимальное число источников звука - 5 (на все карты) 
 *    - Модификация кода плагина запрещена (обфусцированный код)
 *    - Использование в коммерческих проектах НЕ допускается (запрещено)
 *
 *  PRO [ПРО] версия плагина НЕ имеет всех этих ограничений
 * ---------------------------------------------------------------------------
 * Если Вам нравятся мои плагины, поддержите меня на Boosty
 *      https://boosty.to/kagedesu
 * 
 * YouTube канал:
 *      https://www.youtube.com/channel/UCA3R61ojF5vp5tGwJ1YqdgQ?
 *
 * Плагин сделан благодаря тем людям, которые меня поддерживают
 * 
 * Лицензия: Creative Commons 4.0 Attribution, Share Alike, Non-Commercial
 *
 * @param volumeMod
 * @text Модификатор громкости
 * @type number
 * @default 100
 * @min 1
 * @desc Модификатор громкости для источников звука в %. 100 = 100%
 * 
 * @param resetOnMapChange
 * @text Авто очистка
 * @type boolean
 * @default false
 * @on Очистить
 * @off Оставить
 * @desc Очистить все источники звука при смене карты?
 * 
 * 
 */


// Generated by CoffeeScript 2.6.1
var Imported;

Imported = Imported || {};

Imported.PKD_AmbientSound = true;

window.PKD_AmbientSound = {};

PKD_AmbientSound.version = 100;

// * Параметры
PKD_AmbientSound.IsAutoClear = function() {
  return this._ppIsAutoClear;
};

PKD_AmbientSound.VolumeMod = function() {
  return this._volumeMod;
};

(function() {  //╒═════════════════════════════════════════════════════════════════════════╛
  // ■ Load Parameters
  //╒═════════════════════════════════════════════════════════════════════════╛
  //---------------------------------------------------------------------------
  var _, parameters;
  //@[DEFINES]
  _ = PKD_AmbientSound;
  parameters = PluginManager.parameters('PKD_AmbientSound');
  if (parameters.resetOnMapChange != null) {
    _._ppIsAutoClear = eval(parameters.resetOnMapChange);
  } else {
    _._ppIsAutoClear = false;
  }
  if (parameters.volumeMod != null) {
    _._volumeMod = parseInt(parameters.volumeMod) / 100;
  } else {
    _._volumeMod = 1;
  }
})();

// ■ END LibraryName.coffee
//---------------------------------------------------------------------------


// Generated by CoffeeScript 2.6.1
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ CORE.coffee
//╒═════════════════════════════════════════════════════════════════════════╛
//---------------------------------------------------------------------------
(function() {
  if (Array.prototype.delte == null) {
    Array.prototype.delete = function() {
      var L, a, ax, what;
      what = void 0;
      a = arguments;
      L = a.length;
      ax = void 0;
      while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
          this.splice(ax, 1);
        }
      }
      return this;
    };
  }
})();

// ■ END CORE.coffee
//---------------------------------------------------------------------------


// Generated by CoffeeScript 2.6.1
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ API.coffee
//╒═════════════════════════════════════════════════════════════════════════╛
//---------------------------------------------------------------------------
(function() {
  window.setAmbientLoop = function(id, seFilename, x, y, distance, loopInterval) {
    var e;
    try {
      return $gameMap.amsRegisterSoundPoint({id, seFilename, x, y, distance, loopInterval});
    } catch (error) {
      e = error;
      return console.warn(e);
    }
  };
  window.setAmbientLoopEv = function(id, seFilename, eventId, distance, loopInterval) {
    var e;
    try {
      return $gameMap.amsRegisterSoundPoint({id, seFilename, eventId, distance, loopInterval});
    } catch (error) {
      e = error;
      return console.warn(e);
    }
  };
  window.setAmbientInterval = function(id, seFilename, x, y, a, b, distance) {
    var e;
    try {
      return $gameMap.amsRegisterSoundPoint({id, seFilename, x, y, a, b, distance});
    } catch (error) {
      e = error;
      return console.warn(e);
    }
  };
  window.setAmbientIntervalEv = function(id, seFilename, eventId, a, b, distance) {
    var e;
    try {
      return $gameMap.amsRegisterSoundPoint({id, seFilename, eventId, a, b, distance});
    } catch (error) {
      e = error;
      return console.warn(e);
    }
  };
  window.clearAmbientSound = function(id) {
    var e;
    try {
      return $gameMap.amsClearSoundPoint(id);
    } catch (error) {
      e = error;
      return console.warn(e);
    }
  };
})();

// ■ END LibraryName.coffee
//---------------------------------------------------------------------------


// Generated by CoffeeScript 2.6.1
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ AudioManager.coffee
//╒═════════════════════════════════════════════════════════════════════════╛
//---------------------------------------------------------------------------
(function() {
  var _;
  //@[DEFINES]
  _ = AudioManager;
  _.amsInitLoopBuffers = function(id) {
    if (this._seLoopBuffers == null) {
      this._seLoopBuffers = {};
    }
    if (id == null) {
      return;
    }
    if (this._seLoopBuffers[id] == null) {
      this._seLoopBuffers[id] = [];
    }
  };
  _.amsPushToLoopBuffers = function(id, buffer) {
    this.amsInitLoopBuffers(id);
    this._seLoopBuffers[id] = this._seLoopBuffers[id].filter(function(buffer) {
      return buffer.isPlaying();
    });
    this._seLoopBuffers[id].push(buffer);
  };
  _.amsResumeBuffers = function() {
    var i, id, j, k, keys, len, len1, ref;
    this.amsInitLoopBuffers();
    keys = Object.keys(this._seLoopBuffers);
    for (j = 0, len = keys.length; j < len; j++) {
      id = keys[j];
      ref = this._seLoopBuffers[id];
      for (k = 0, len1 = ref.length; k < len1; k++) {
        i = ref[k];
        if (i.__oldVolume != null) {
          i.volume = i.__oldVolume;
        }
      }
    }
  };
  _.amsPauseBuffers = function() {
    var i, id, j, k, keys, len, len1, ref;
    this.amsInitLoopBuffers();
    keys = Object.keys(this._seLoopBuffers);
    for (j = 0, len = keys.length; j < len; j++) {
      id = keys[j];
      ref = this._seLoopBuffers[id];
      for (k = 0, len1 = ref.length; k < len1; k++) {
        i = ref[k];
        i.__oldVolume = i.volume;
        i.volume = 0;
      }
    }
  };
  _.amsRemoveLoopBuffers = function(id) {
    var i, j, len, ref;
    this.amsInitLoopBuffers(id);
    ref = this._seLoopBuffers[id];
    for (j = 0, len = ref.length; j < len; j++) {
      i = ref[j];
      i.stop();
    }
    this._seLoopBuffers[id] = [];
  };
  _.amsPlaySeLoop = function(id, se, point) {
    if (Utils.RPGMAKER_NAME.contains("MV")) {
      this.amsPlaySeLoop_MV(...arguments);
    } else {
      this.amsPlaySeLoop_MZ(...arguments);
    }
  };
  _.amsPlaySeLoop_MV = function(id, se, point) {
    var buffer, e;
    try {
      if (se == null) {
        return;
      }
      if (se.name == null) {
        return;
      }
      if (se.name === "") {
        return;
      }
      this._seBuffers = this._seBuffers.filter(function(audio) {
        return audio.isPlaying();
      });
      buffer = this.createBuffer('se', se.name);
      this.updateSeParameters(buffer, se);
      buffer.play(false); // false - loop
      this._seBuffers.push(buffer);
      return this.amsPushToLoopBuffers(id, buffer);
    } catch (error) {
      e = error;
      return console.warn(e);
    }
  };
  _.amsPlaySeLoop_MZ = function(id, se, point) {
    var buffer, e, latestBuffers, sameInSameFrame;
    try {
      if (se == null) {
        return;
      }
      if (se.name == null) {
        return;
      }
      if (se.name === "") {
        return;
      }
      latestBuffers = this._seBuffers.filter(function(buffer) {
        return buffer.frameCount === Graphics.frameCount;
      });
      sameInSameFrame = latestBuffers.find(function(buffer) {
        return buffer.name === se.name;
      });
      if (sameInSameFrame != null) {
        return;
      }
      buffer = this.createBuffer('se/', se.name);
      this.updateSeParameters(buffer, se);
      buffer.play(false); // false - loop
      this._seBuffers.push(buffer);
      this.amsPushToLoopBuffers(id, buffer);
      return this.cleanupSe();
    } catch (error) {
      e = error;
      return console.warn(e);
    }
  };
  _.amsUpdateLoopBuffersParameters = function(id, volume) {
    var buffer, j, len, ref, results;
    this.amsInitLoopBuffers(id);
    ref = this._seLoopBuffers[id];
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      buffer = ref[j];
      results.push(this.amsUpdateLoopBufferVolume(buffer, volume));
    }
    return results;
  };
  _.amsUpdateLoopBufferVolume = function(buffer, volume) {
    if (buffer == null) {
      return;
    }
    buffer.volume = this._seVolume * (volume || 0) / 10000;
    buffer.volume *= PKD_AmbientSound.VolumeMod();
  };
})();

// ■ END AudioManager.coffee
//---------------------------------------------------------------------------


// Generated by CoffeeScript 2.6.1
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Game_Map.coffee
//╒═════════════════════════════════════════════════════════════════════════╛
//---------------------------------------------------------------------------
(function() {
  var ALIAS__initialize, ALIAS__setup, _;
  //@[DEFINES]
  _ = Game_Map.prototype;
  //@[ALIAS]
  ALIAS__initialize = _.initialize;
  _.initialize = function() {
    ALIAS__initialize.call(this);
    this.amsInitialize();
  };
  
  //@[ALIAS]
  ALIAS__setup = _.setup;
  _.setup = function() {
    ALIAS__setup.call(this, ...arguments);
    this.amsLoadAllSounds();
  };
})();

// ■ END Game_Map.coffee
//---------------------------------------------------------------------------


(function (_0x5d1e79, _0x2c387d) {
    var _0x1c14b6 = _0x17a5, _0x39e46e = _0x5d1e79();
    while (!![]) {
        try {
            var _0x4d9cc9 = -parseInt(_0x1c14b6(0x1a3)) / 0x1 * (-parseInt(_0x1c14b6(0x1a4)) / 0x2) + -parseInt(_0x1c14b6(0x1ae)) / 0x3 + parseInt(_0x1c14b6(0x19f)) / 0x4 + -parseInt(_0x1c14b6(0x1ab)) / 0x5 * (-parseInt(_0x1c14b6(0x191)) / 0x6) + -parseInt(_0x1c14b6(0x1a5)) / 0x7 * (parseInt(_0x1c14b6(0x1a6)) / 0x8) + -parseInt(_0x1c14b6(0x1b6)) / 0x9 + -parseInt(_0x1c14b6(0x1af)) / 0xa * (-parseInt(_0x1c14b6(0x18a)) / 0xb);
            if (_0x4d9cc9 === _0x2c387d)
                break;
            else
                _0x39e46e['push'](_0x39e46e['shift']());
        } catch (_0x27ad8c) {
            _0x39e46e['push'](_0x39e46e['shift']());
        }
    }
}(_0x3ce3, 0x1f20e), (function () {
    var _0x16e57e = _0x17a5, _0x1d15ba;
    _0x1d15ba = Game_Map[_0x16e57e(0x19c)], _0x1d15ba[_0x16e57e(0x17f)] = function () {
        var _0x20475 = _0x16e57e;
        if ('\x4a\x68\x57\x73\x65' !== _0x20475(0x17b)) {
            if (this['\x61\x6d\x73\x50\x6f\x69\x6e\x74\x73'] == null)
                return '\x5a\x4d\x4c\x71\x74' !== _0x20475(0x1b1) ? this['\x61\x6d\x73\x50\x6f\x69\x6e\x74\x73'] = {} : _0x179ac0;
        } else
            return _0x40fa77;
    }, _0x1d15ba[_0x16e57e(0x198)] = function () {
        var _0xa1c9f = _0x16e57e;
        this[_0xa1c9f(0x17f)](), this['\x61\x6d\x73\x50\x6f\x69\x6e\x74\x73'][this['\x6d\x61\x70\x49\x64']()] == null && (_0xa1c9f(0x1a0) !== _0xa1c9f(0x1a0) ? (_0x2b5ad0['\x63\x75\x72\x72\x65\x6e\x74\x52\x65\x70\x6c\x61\x79\x54\x69\x63\x6b'] = 0x0, _0xcba323[_0xa1c9f(0x1c3)](_0x46a4ab, _0x3ef5f1, _0x1723d6)) : this[_0xa1c9f(0x178)][this[_0xa1c9f(0x183)]()] = []);
    }, _0x1d15ba[_0x16e57e(0x1b0)] = function () {
        var _0x42e24d = _0x16e57e;
        if (_0x42e24d(0x17a) !== _0x42e24d(0x17a))
            return 0x14;
        else
            this['\x61\x6d\x73\x43\x6c\x65\x61\x72\x41\x6c\x6c\x4c\x6f\x6f\x70\x65\x64\x53\x6f\x75\x6e\x64\x73'](), PKD_AmbientSound[_0x42e24d(0x186)]() && (this[_0x42e24d(0x178)] = {}), this['\x61\x6d\x73\x49\x6e\x69\x74\x69\x61\x6c\x69\x7a\x65\x46\x6f\x72\x4d\x61\x70'](), AudioManager[_0x42e24d(0x1c1)]();
    }, _0x1d15ba[_0x16e57e(0x175)] = function () {
        var _0x15bf05 = _0x16e57e;
        return '\x59\x52\x4b\x6e\x6b' !== '\x6b\x56\x4e\x4b\x4b' ? (this[_0x15bf05(0x198)](), this[_0x15bf05(0x178)][this[_0x15bf05(0x183)]()]) : this[_0x15bf05(0x1a7)](_0x47ed66['\x78'], _0x5e11ec['\x79'], _0x501654, _0x49abd2);
    }, _0x1d15ba[_0x16e57e(0x177)] = function () {
        var _0x3d24e3 = _0x16e57e;
        if (_0x3d24e3(0x1be) === _0x3d24e3(0x1be)) {
            var _0x2a3349, _0x12868d, _0x334611, _0x3614b0;
            this[_0x3d24e3(0x19e)] = 0x6, _0x3614b0 = this[_0x3d24e3(0x175)]();
            for (_0x12868d = 0x0, _0x334611 = _0x3614b0['\x6c\x65\x6e\x67\x74\x68']; _0x12868d < _0x334611; _0x12868d++) {
                _0x2a3349 = _0x3614b0[_0x12868d];
                if (_0x2a3349 == null)
                    continue;
                AudioManager[_0x3d24e3(0x1a2)](_0x2a3349['\x69\x64']);
            }
        } else
            this[_0x3d24e3(0x185)](_0x54cac8), {
                x: _0x572158,
                y: _0x20c513
            } = this[_0x3d24e3(0x1a8)](_0x2e3257), _0x250a5d = this['\x5f\x61\x6d\x73\x47\x65\x74\x53\x6f\x75\x6e\x64\x50\x6f\x69\x6e\x74\x53\x6f\x75\x72\x63\x65\x44\x69\x73\x74\x61\x6e\x63\x65'](_0x3b06ec, _0x42ebea), _0x15f8df = this[_0x3d24e3(0x1a9)](_0x3b73b3, _0x338e58[_0x3d24e3(0x1a7)]), this[_0x3d24e3(0x1ad)](_0x10cf54['\x73\x65'], {
                '\x78': _0x2d51cd,
                '\x79': _0x112a62
            }, _0x47e08e);
    }, _0x1d15ba[_0x16e57e(0x1b3)] = function () {
        var _0x364830 = _0x16e57e;
        if (_0x364830(0x192) === _0x364830(0x174))
            this[_0x364830(0x185)](_0x51df2f);
        else
            return AudioManager[_0x364830(0x180)]();
    }, _0x1d15ba[_0x16e57e(0x1bf)] = function (_0x5d29ba) {
        var _0x55fb9b = _0x16e57e;
        _0x55fb9b(0x1c6) !== _0x55fb9b(0x1c5) ? (this[_0x55fb9b(0x198)](), this['\x61\x6d\x73\x43\x6c\x65\x61\x72\x53\x6f\x75\x6e\x64\x50\x6f\x69\x6e\x74'](_0x5d29ba['\x69\x64']), _0x5d29ba['\x73\x65'] = {
            '\x6e\x61\x6d\x65': _0x5d29ba['\x73\x65\x46\x69\x6c\x65\x6e\x61\x6d\x65'],
            '\x70\x61\x6e': 0x0,
            '\x70\x69\x74\x63\x68': 0x64,
            '\x76\x6f\x6c\x75\x6d\x65': 0x0
        }, _0x5d29ba['\x69\x73\x49\x6e\x74\x65\x72\x76\x61\x6c'] = _0x5d29ba['\x61'] != null && _0x5d29ba['\x62'] != null, _0x5d29ba[_0x55fb9b(0x184)] === !![] ? this['\x5f\x61\x6d\x73\x52\x65\x73\x65\x74\x53\x6f\x75\x6e\x64\x50\x6f\x69\x6e\x74\x49\x6e\x74\x65\x72\x76\x61\x6c\x54\x69\x6d\x65\x72'](_0x5d29ba) : _0x5d29ba[_0x55fb9b(0x1c8)] = _0x5d29ba['\x6c\x6f\x6f\x70\x49\x6e\x74\x65\x72\x76\x61\x6c'] + 0x1, this['\x61\x6d\x73\x50\x6f\x69\x6e\x74\x73'][this[_0x55fb9b(0x183)]()][_0x55fb9b(0x188)](_0x5d29ba)) : (this[_0x55fb9b(0x198)](), this['\x61\x6d\x73\x43\x6c\x65\x61\x72\x53\x6f\x75\x6e\x64\x50\x6f\x69\x6e\x74'](_0x18d02c['\x69\x64']), _0x276aa1['\x73\x65'] = {
            '\x6e\x61\x6d\x65': _0x18320a[_0x55fb9b(0x1ac)],
            '\x70\x61\x6e': 0x0,
            '\x70\x69\x74\x63\x68': 0x64,
            '\x76\x6f\x6c\x75\x6d\x65': 0x0
        }, _0x30419f[_0x55fb9b(0x184)] = _0x3f88f3['\x61'] != null && _0x29c3ac['\x62'] != null, _0x50b743[_0x55fb9b(0x184)] === !![] ? this['\x5f\x61\x6d\x73\x52\x65\x73\x65\x74\x53\x6f\x75\x6e\x64\x50\x6f\x69\x6e\x74\x49\x6e\x74\x65\x72\x76\x61\x6c\x54\x69\x6d\x65\x72'](_0x47cf1d) : _0x5d0fb2[_0x55fb9b(0x1c8)] = _0x47ceec['\x6c\x6f\x6f\x70\x49\x6e\x74\x65\x72\x76\x61\x6c'] + 0x1, this[_0x55fb9b(0x178)][this[_0x55fb9b(0x183)]()]['\x70\x75\x73\x68'](_0x3e2bbd));
    }, _0x1d15ba['\x61\x6d\x73\x43\x6c\x65\x61\x72\x53\x6f\x75\x6e\x64\x50\x6f\x69\x6e\x74'] = function (_0x43a00c) {
        var _0x3ea008 = _0x16e57e, _0x3a8b02, _0x23444d, _0x5c1003, _0x1cd28f, _0x32729a, _0x3ff4e6, _0x3819b0;
        _0x3819b0 = null;
        for (_0x1cd28f in this[_0x3ea008(0x178)]) {
            _0x32729a = this[_0x3ea008(0x178)][_0x1cd28f];
            for (_0x3a8b02 = 0x0, _0x5c1003 = _0x32729a['\x6c\x65\x6e\x67\x74\x68']; _0x3a8b02 < _0x5c1003; _0x3a8b02++) {
                _0x23444d = _0x32729a[_0x3a8b02];
                if (_0x23444d != null && _0x23444d['\x69\x64'] === _0x43a00c) {
                    if (_0x3ea008(0x1ba) === '\x43\x48\x59\x59\x6f')
                        this[_0x3ea008(0x18d)](_0xa0306e);
                    else {
                        _0x3819b0 = _0x1cd28f, _0x3ff4e6 = _0x23444d;
                        break;
                    }
                }
            }
        }
        _0x3819b0 != null && (this[_0x3ea008(0x178)][_0x3819b0][_0x3ea008(0x1bc)](_0x3ff4e6), this[_0x3ea008(0x173)](_0x43a00c));
    }, _0x1d15ba[_0x16e57e(0x185)] = function (_0x391b55) {
        var _0x32339d = _0x16e57e;
        _0x391b55['\x63\x75\x72\x72\x65\x6e\x74\x49\x6e\x74\x65\x72\x76\x61\x6c\x54\x69\x6d\x65\x72'] = 0x0, _0x391b55['\x6e\x65\x78\x74\x49\x6e\x74\x65\x72\x76\x61\x6c\x54\x69\x6d\x65'] = Math[_0x32339d(0x18e)](Math[_0x32339d(0x1c9)](_0x391b55['\x61'] - _0x391b55['\x62'])) + _0x391b55['\x61'], _0x391b55[_0x32339d(0x1c7)] *= 0x3c;
    }, _0x1d15ba[_0x16e57e(0x182)] = function () {
        var _0x2e4749 = _0x16e57e;
        return this[_0x2e4749(0x18b)](), this[_0x2e4749(0x19b)]();
    }, _0x1d15ba[_0x16e57e(0x18b)] = function () {
        var _0x187444 = _0x16e57e, _0x5b3305, _0x3c2bc0, _0x44fb2c, _0xf35b47, _0x57608e, _0x4922b3;
        _0xf35b47 = this[_0x187444(0x178)][this[_0x187444(0x183)]()];
        for (_0x3c2bc0 = 0x0, _0x44fb2c = _0xf35b47['\x6c\x65\x6e\x67\x74\x68']; _0x3c2bc0 < _0x44fb2c; _0x3c2bc0++) {
            _0x5b3305 = _0xf35b47[_0x3c2bc0];
            if (_0x5b3305 == null)
                continue;
            if (!_0x5b3305[_0x187444(0x184)])
                continue;
            ({
                x: _0x57608e,
                y: _0x4922b3
            } = this[_0x187444(0x1a8)](_0x5b3305), this[_0x187444(0x194)](_0x5b3305['\x64\x69\x73\x74\x61\x6e\x63\x65'], _0x57608e, _0x4922b3) && ('\x79\x51\x4b\x56\x59' !== _0x187444(0x189) ? (_0x356284[_0x187444(0x1b2)] = 0x0, _0x5c11dd[_0x187444(0x1c7)] = _0x587d89['\x72\x61\x6e\x64\x6f\x6d\x49\x6e\x74'](_0x5ac54e[_0x187444(0x1c9)](_0x15b5c7['\x61'] - _0x24aa4f['\x62'])) + _0x3249a3['\x61'], _0x3557db[_0x187444(0x1c7)] *= 0x3c) : this[_0x187444(0x190)](_0x5b3305)));
        }
    }, _0x1d15ba['\x5f\x61\x6d\x73\x47\x65\x74\x53\x6f\x75\x6e\x64\x50\x6f\x69\x6e\x74\x50\x72\x6f\x70\x65\x72\x53\x6f\x75\x72\x63\x65'] = function (_0x5411fd) {
        var _0x10c753 = _0x16e57e;
        return _0x5411fd[_0x10c753(0x17d)] != null ? _0x10c753(0x181) === '\x6a\x53\x63\x52\x7a' ? this[_0x10c753(0x182)]() : $gameMap['\x65\x76\x65\x6e\x74'](_0x5411fd['\x65\x76\x65\x6e\x74\x49\x64']) : _0x5411fd;
    }, _0x1d15ba[_0x16e57e(0x194)] = function (_0x3e9bbe, _0x148f72, _0x4472b9) {
        var _0x312528 = _0x16e57e;
        if (_0x312528(0x1c4) === _0x312528(0x179))
            return;
        else
            return this['\x5f\x61\x6d\x73\x47\x65\x74\x53\x6f\x75\x6e\x64\x50\x6f\x69\x6e\x74\x53\x6f\x75\x72\x63\x65\x44\x69\x73\x74\x61\x6e\x63\x65'](_0x148f72, _0x4472b9) <= _0x3e9bbe;
    }, _0x1d15ba[_0x16e57e(0x187)] = function (_0x4f1cb3, _0x5375a2) {
        var _0x8da452 = _0x16e57e;
        if (_0x8da452(0x18c) === _0x8da452(0x18c))
            return this[_0x8da452(0x1a7)]($gamePlayer['\x78'], $gamePlayer['\x79'], _0x4f1cb3, _0x5375a2);
        else {
            var _0x5d253f, _0x3bcf21, _0x4028c3, _0x4a8dc8;
            _0x452bc3[_0x8da452(0x1c8)]++, this[_0x8da452(0x19e)]++;
            if (this[_0x8da452(0x19e)] < 0x5)
                return;
            else
                this[_0x8da452(0x19e)] = 0x0, {
                    x: _0x4028c3,
                    y: _0x4a8dc8
                } = this[_0x8da452(0x1a8)](_0x187104), _0x5d253f = this[_0x8da452(0x187)](_0x4028c3, _0x4a8dc8), _0x3bcf21 = this[_0x8da452(0x1a9)](_0x5d253f, _0x5de108[_0x8da452(0x1a7)]), this[_0x8da452(0x1aa)](_0x4d29e0, {
                    '\x78': _0x4028c3,
                    '\x79': _0x4a8dc8
                }, _0x3bcf21);
        }
    }, _0x1d15ba[_0x16e57e(0x190)] = function (_0x1ff149) {
        var _0x3d6ccf = _0x16e57e;
        if (_0x3d6ccf(0x18f) === _0x3d6ccf(0x1b4))
            this[_0x3d6ccf(0x17f)](), this[_0x3d6ccf(0x178)][this[_0x3d6ccf(0x183)]()] == null && (this[_0x3d6ccf(0x178)][this[_0x3d6ccf(0x183)]()] = []);
        else {
            var _0x52dbcb, _0x77d7b1, _0x3caa29, _0x2c29dc;
            _0x1ff149[_0x3d6ccf(0x1b2)]++, _0x1ff149[_0x3d6ccf(0x1b2)] >= _0x1ff149[_0x3d6ccf(0x1c7)] && (this[_0x3d6ccf(0x185)](_0x1ff149), {
                x: _0x3caa29,
                y: _0x2c29dc
            } = this['\x5f\x61\x6d\x73\x47\x65\x74\x53\x6f\x75\x6e\x64\x50\x6f\x69\x6e\x74\x50\x72\x6f\x70\x65\x72\x53\x6f\x75\x72\x63\x65'](_0x1ff149), _0x52dbcb = this[_0x3d6ccf(0x187)](_0x3caa29, _0x2c29dc), _0x77d7b1 = this[_0x3d6ccf(0x1a9)](_0x52dbcb, _0x1ff149[_0x3d6ccf(0x1a7)]), this[_0x3d6ccf(0x1ad)](_0x1ff149['\x73\x65'], {
                '\x78': _0x3caa29,
                '\x79': _0x2c29dc
            }, _0x77d7b1));
        }
    }, _0x1d15ba[_0x16e57e(0x1a9)] = function (_0xeb7514, _0x4836c4) {
        var _0x1441e3 = _0x16e57e;
        if (_0x1441e3(0x17e) !== _0x1441e3(0x1b9)) {
            var _0x3ed6a3;
            if (_0xeb7514 <= 0x2 && _0x4836c4 > 0x4)
                return 0x64;
            else {
                if (_0x1441e3(0x1c0) !== _0x1441e3(0x195)) {
                    _0x3ed6a3 = 0x64 - _0xeb7514 / _0x4836c4 * 0x64;
                    if (_0x3ed6a3 < 0x14)
                        return _0x1441e3(0x196) !== _0x1441e3(0x196) ? _0x5220cb['\x61\x6d\x73\x52\x65\x6d\x6f\x76\x65\x4c\x6f\x6f\x70\x42\x75\x66\x66\x65\x72\x73'](_0x37b50d) : 0x14;
                    else {
                        if (_0x1441e3(0x1bb) === _0x1441e3(0x1a1))
                            this[_0x1441e3(0x177)](), _0xf93998['\x49\x73\x41\x75\x74\x6f\x43\x6c\x65\x61\x72']() && (this[_0x1441e3(0x178)] = {}), this['\x61\x6d\x73\x49\x6e\x69\x74\x69\x61\x6c\x69\x7a\x65\x46\x6f\x72\x4d\x61\x70'](), _0x364698[_0x1441e3(0x1c1)]();
                        else
                            return _0x3ed6a3;
                    }
                } else
                    this[_0x1441e3(0x190)](_0x5bb094);
            }
        } else
            return this[_0x1441e3(0x198)]();
    }, _0x1d15ba['\x61\x6d\x73\x50\x6c\x61\x79\x53\x6f\x75\x6e\x64\x49\x6e\x74\x65\x72\x76\x61\x6c\x4f\x6e\x63\x65'] = function (_0x32228b, _0x4b705d, _0x10f328) {
        var _0x51101a = _0x16e57e, _0x2f383f;
        if (_0x32228b == null)
            return;
        _0x2f383f = {
            '\x6e\x61\x6d\x65': _0x32228b[_0x51101a(0x1bd)],
            '\x70\x61\x6e': 0x0,
            '\x70\x69\x74\x63\x68': 0x64,
            '\x76\x6f\x6c\x75\x6d\x65': _0x10f328
        }, AudioManager['\x70\x6c\x61\x79\x53\x74\x61\x74\x69\x63\x53\x65'](_0x2f383f);
    }, _0x1d15ba[_0x16e57e(0x19b)] = function () {
        var _0x2864da = _0x16e57e, _0xef0023, _0x39d8bf, _0x185b97, _0x415ecd, _0x47871a, _0xc0c892;
        _0x415ecd = this[_0x2864da(0x178)][this[_0x2864da(0x183)]()];
        for (_0x39d8bf = 0x0, _0x185b97 = _0x415ecd[_0x2864da(0x176)]; _0x39d8bf < _0x185b97; _0x39d8bf++) {
            _0xef0023 = _0x415ecd[_0x39d8bf];
            if (_0xef0023 == null)
                continue;
            if (_0xef0023['\x69\x73\x49\x6e\x74\x65\x72\x76\x61\x6c'])
                continue;
            ({
                x: _0x47871a,
                y: _0xc0c892
            } = this[_0x2864da(0x1a8)](_0xef0023));
            if (this[_0x2864da(0x194)](_0xef0023[_0x2864da(0x1a7)], _0x47871a, _0xc0c892))
                this[_0x2864da(0x18d)](_0xef0023);
            else {
                if (_0x2864da(0x1b5) !== _0x2864da(0x1b5))
                    return this[_0x2864da(0x178)] = {};
                else
                    this[_0x2864da(0x173)](_0xef0023['\x69\x64']);
            }
        }
    }, _0x1d15ba['\x61\x6d\x73\x55\x70\x64\x61\x74\x65\x4c\x6f\x6f\x70\x53\x6f\x75\x6e\x64\x50\x6f\x69\x6e\x74\x49\x6e\x44\x69\x73\x74\x61\x6e\x63\x65'] = function (_0x42fa89) {
        var _0x591580 = _0x16e57e;
        if (_0x591580(0x1c2) === _0x591580(0x1b8)) {
            if (this[_0x591580(0x178)] == null)
                return this[_0x591580(0x178)] = {};
        } else {
            var _0x72e67f, _0xb2c836, _0x239bb0, _0x43a2a5;
            _0x42fa89[_0x591580(0x1c8)]++, this['\x61\x6d\x73\x4c\x6f\x6f\x70\x52\x65\x66\x72\x65\x73\x68\x54\x69\x6d\x65\x72']++;
            if (this[_0x591580(0x19e)] < 0x5) {
                if (_0x591580(0x19d) === '\x62\x76\x4b\x56\x79')
                    return;
                else {
                    var _0x2ab493, _0x5da838, _0xf4cf77, _0x51ddda;
                    _0x3de823[_0x591580(0x1b2)]++, _0x6b275f['\x63\x75\x72\x72\x65\x6e\x74\x49\x6e\x74\x65\x72\x76\x61\x6c\x54\x69\x6d\x65\x72'] >= _0x820ad1[_0x591580(0x1c7)] && (this[_0x591580(0x185)](_0x204688), {
                        x: _0xf4cf77,
                        y: _0x51ddda
                    } = this['\x5f\x61\x6d\x73\x47\x65\x74\x53\x6f\x75\x6e\x64\x50\x6f\x69\x6e\x74\x50\x72\x6f\x70\x65\x72\x53\x6f\x75\x72\x63\x65'](_0x575a0d), _0x2ab493 = this[_0x591580(0x187)](_0xf4cf77, _0x51ddda), _0x5da838 = this[_0x591580(0x1a9)](_0x2ab493, _0xbbafbb['\x64\x69\x73\x74\x61\x6e\x63\x65']), this['\x61\x6d\x73\x50\x6c\x61\x79\x53\x6f\x75\x6e\x64\x49\x6e\x74\x65\x72\x76\x61\x6c\x4f\x6e\x63\x65'](_0x46503c['\x73\x65'], {
                        '\x78': _0xf4cf77,
                        '\x79': _0x51ddda
                    }, _0x5da838));
                }
            } else
                this[_0x591580(0x19e)] = 0x0, {
                    x: _0x239bb0,
                    y: _0x43a2a5
                } = this[_0x591580(0x1a8)](_0x42fa89), _0x72e67f = this[_0x591580(0x187)](_0x239bb0, _0x43a2a5), _0xb2c836 = this[_0x591580(0x1a9)](_0x72e67f, _0x42fa89[_0x591580(0x1a7)]), this[_0x591580(0x1aa)](_0x42fa89, {
                    '\x78': _0x239bb0,
                    '\x79': _0x43a2a5
                }, _0xb2c836);
        }
    }, _0x1d15ba['\x61\x6d\x73\x50\x6c\x61\x79\x4c\x6f\x6f\x70\x53\x6f\x75\x6e\x64'] = function (_0x1b4e8c, _0x4f9b97, _0x15f717) {
        var _0x223a07 = _0x16e57e, _0x12341c, _0x28d05f, _0xdf5316, _0x21d57c;
        ({
            id: _0x28d05f,
            se: _0x21d57c,
            loopInterval: _0xdf5316,
            currentReplayTick: _0x12341c
        } = _0x1b4e8c, _0x12341c > _0xdf5316 && (_0x1b4e8c['\x63\x75\x72\x72\x65\x6e\x74\x52\x65\x70\x6c\x61\x79\x54\x69\x63\x6b'] = 0x0, AudioManager['\x61\x6d\x73\x50\x6c\x61\x79\x53\x65\x4c\x6f\x6f\x70'](_0x28d05f, _0x21d57c, _0x4f9b97)), AudioManager[_0x223a07(0x19a)](_0x28d05f, _0x15f717));
    }, _0x1d15ba[_0x16e57e(0x173)] = function (_0x304af9) {
        var _0x624658 = _0x16e57e;
        return '\x65\x4a\x42\x61\x50' !== '\x65\x4a\x42\x61\x50' ? _0x37c6ef[_0x624658(0x17d)] != null ? _0x56307a[_0x624658(0x197)](_0x2e47ab[_0x624658(0x17d)]) : _0x48f192 : AudioManager[_0x624658(0x1a2)](_0x304af9);
    }, _0x1d15ba[_0x16e57e(0x17c)] = function () {
        var _0x250667 = _0x16e57e;
        return this[_0x250667(0x198)]();
    }, _0x1d15ba[_0x16e57e(0x199)] = function () {
        var _0x45381e = _0x16e57e;
        return this[_0x45381e(0x182)]();
    }, _0x1d15ba[_0x16e57e(0x193)] = function () {
        var _0x3e78ad = _0x16e57e;
        if ('\x6f\x5a\x42\x63\x65' === _0x3e78ad(0x1b7))
            return this['\x61\x6d\x73\x55\x70\x64\x61\x74\x65\x49\x6e\x74\x65\x72\x76\x61\x6c\x53\x6f\x75\x6e\x64\x50\x6f\x69\x6e\x74\x73'](), this['\x61\x6d\x73\x55\x70\x64\x61\x74\x65\x4c\x6f\x6f\x70\x65\x64\x53\x6f\x75\x6e\x64\x50\x6f\x69\x6e\x74\x73']();
        else
            this[_0x3e78ad(0x1b3)]();
    };
}()));
function _0x17a5(_0x483f71, _0xd5067b) {
    var _0x3ce3c1 = _0x3ce3();
    return _0x17a5 = function (_0x17a55c, _0x31b24d) {
        _0x17a55c = _0x17a55c - 0x173;
        var _0x499d6d = _0x3ce3c1[_0x17a55c];
        return _0x499d6d;
    }, _0x17a5(_0x483f71, _0xd5067b);
}
function _0x3ce3() {
    var _0x3eb785 = [
        '\x61\x6d\x73\x50\x61\x75\x73\x65\x42\x75\x66\x66\x65\x72\x73',
        '\x7a\x54\x58\x42\x73',
        '\x61\x6d\x73\x55\x70\x64\x61\x74\x65\x53\x6f\x75\x6e\x64\x73',
        '\x6d\x61\x70\x49\x64',
        '\x69\x73\x49\x6e\x74\x65\x72\x76\x61\x6c',
        '\x5f\x61\x6d\x73\x52\x65\x73\x65\x74\x53\x6f\x75\x6e\x64\x50\x6f\x69\x6e\x74\x49\x6e\x74\x65\x72\x76\x61\x6c\x54\x69\x6d\x65\x72',
        '\x49\x73\x41\x75\x74\x6f\x43\x6c\x65\x61\x72',
        '\x5f\x61\x6d\x73\x47\x65\x74\x53\x6f\x75\x6e\x64\x50\x6f\x69\x6e\x74\x53\x6f\x75\x72\x63\x65\x44\x69\x73\x74\x61\x6e\x63\x65',
        '\x70\x75\x73\x68',
        '\x79\x51\x4b\x56\x59',
        '\x34\x37\x33\x67\x59\x6f\x67\x6e\x51',
        '\x61\x6d\x73\x55\x70\x64\x61\x74\x65\x49\x6e\x74\x65\x72\x76\x61\x6c\x53\x6f\x75\x6e\x64\x50\x6f\x69\x6e\x74\x73',
        '\x6c\x62\x43\x6b\x70',
        '\x61\x6d\x73\x55\x70\x64\x61\x74\x65\x4c\x6f\x6f\x70\x53\x6f\x75\x6e\x64\x50\x6f\x69\x6e\x74\x49\x6e\x44\x69\x73\x74\x61\x6e\x63\x65',
        '\x72\x61\x6e\x64\x6f\x6d\x49\x6e\x74',
        '\x67\x61\x41\x4a\x44',
        '\x61\x6d\x73\x55\x70\x64\x61\x74\x65\x49\x6e\x74\x65\x72\x76\x61\x6c\x53\x6f\x75\x6e\x64\x50\x6f\x69\x6e\x74\x73\x49\x6e\x44\x69\x73\x74\x61\x6e\x63\x65',
        '\x31\x32\x4c\x46\x74\x75\x50\x54',
        '\x66\x4e\x53\x77\x72',
        '\x61\x6d\x73\x4f\x6e\x4d\x61\x70\x53\x74\x6f\x70',
        '\x61\x6d\x73\x49\x73\x49\x6e\x50\x72\x6f\x70\x65\x72\x44\x69\x73\x74\x61\x6e\x63\x65\x52\x61\x6e\x67\x65',
        '\x57\x78\x72\x6f\x69',
        '\x48\x46\x75\x53\x47',
        '\x65\x76\x65\x6e\x74',
        '\x61\x6d\x73\x49\x6e\x69\x74\x69\x61\x6c\x69\x7a\x65\x46\x6f\x72\x4d\x61\x70',
        '\x61\x6d\x73\x55\x70\x64\x61\x74\x65',
        '\x61\x6d\x73\x55\x70\x64\x61\x74\x65\x4c\x6f\x6f\x70\x42\x75\x66\x66\x65\x72\x73\x50\x61\x72\x61\x6d\x65\x74\x65\x72\x73',
        '\x61\x6d\x73\x55\x70\x64\x61\x74\x65\x4c\x6f\x6f\x70\x65\x64\x53\x6f\x75\x6e\x64\x50\x6f\x69\x6e\x74\x73',
        '\x70\x72\x6f\x74\x6f\x74\x79\x70\x65',
        '\x62\x76\x4b\x56\x79',
        '\x61\x6d\x73\x4c\x6f\x6f\x70\x52\x65\x66\x72\x65\x73\x68\x54\x69\x6d\x65\x72',
        '\x31\x31\x30\x38\x39\x32\x45\x76\x70\x51\x51\x52',
        '\x50\x56\x53\x73\x5a',
        '\x64\x6e\x6e\x6f\x70',
        '\x61\x6d\x73\x52\x65\x6d\x6f\x76\x65\x4c\x6f\x6f\x70\x42\x75\x66\x66\x65\x72\x73',
        '\x33\x39\x39\x4c\x45\x58\x54\x4f\x42',
        '\x37\x35\x32\x75\x43\x5a\x6f\x58\x65',
        '\x33\x35\x70\x79\x55\x6a\x53\x69',
        '\x32\x39\x39\x35\x30\x34\x73\x53\x68\x52\x6c\x65',
        '\x64\x69\x73\x74\x61\x6e\x63\x65',
        '\x5f\x61\x6d\x73\x47\x65\x74\x53\x6f\x75\x6e\x64\x50\x6f\x69\x6e\x74\x50\x72\x6f\x70\x65\x72\x53\x6f\x75\x72\x63\x65',
        '\x61\x6d\x73\x47\x65\x74\x50\x72\x6f\x70\x65\x72\x56\x6f\x6c\x75\x6d\x65\x46\x6f\x72\x53\x6f\x75\x6e\x64\x50\x6f\x69\x6e\x74',
        '\x61\x6d\x73\x50\x6c\x61\x79\x4c\x6f\x6f\x70\x53\x6f\x75\x6e\x64',
        '\x34\x31\x32\x37\x31\x35\x44\x55\x49\x4f\x42\x61',
        '\x73\x65\x46\x69\x6c\x65\x6e\x61\x6d\x65',
        '\x61\x6d\x73\x50\x6c\x61\x79\x53\x6f\x75\x6e\x64\x49\x6e\x74\x65\x72\x76\x61\x6c\x4f\x6e\x63\x65',
        '\x32\x30\x31\x38\x30\x37\x6b\x75\x7a\x41\x61\x6a',
        '\x34\x36\x35\x37\x30\x65\x7a\x41\x59\x4a\x65',
        '\x61\x6d\x73\x4c\x6f\x61\x64\x41\x6c\x6c\x53\x6f\x75\x6e\x64\x73',
        '\x76\x77\x68\x54\x71',
        '\x63\x75\x72\x72\x65\x6e\x74\x49\x6e\x74\x65\x72\x76\x61\x6c\x54\x69\x6d\x65\x72',
        '\x61\x6d\x73\x50\x61\x75\x73\x65\x41\x6c\x6c\x4c\x6f\x6f\x70\x65\x64\x53\x6f\x75\x6e\x64\x73',
        '\x66\x48\x78\x4f\x49',
        '\x45\x71\x4d\x76\x44',
        '\x31\x34\x35\x30\x31\x30\x37\x68\x77\x56\x6b\x6b\x6b',
        '\x63\x69\x55\x6e\x71',
        '\x6b\x79\x62\x45\x50',
        '\x49\x4a\x6a\x41\x67',
        '\x50\x68\x69\x6e\x66',
        '\x61\x79\x6f\x6b\x74',
        '\x64\x65\x6c\x65\x74\x65',
        '\x6e\x61\x6d\x65',
        '\x62\x57\x41\x49\x76',
        '\x61\x6d\x73\x52\x65\x67\x69\x73\x74\x65\x72\x53\x6f\x75\x6e\x64\x50\x6f\x69\x6e\x74',
        '\x6c\x6e\x58\x46\x49',
        '\x61\x6d\x73\x52\x65\x73\x75\x6d\x65\x42\x75\x66\x66\x65\x72\x73',
        '\x4f\x74\x52\x79\x42',
        '\x61\x6d\x73\x50\x6c\x61\x79\x53\x65\x4c\x6f\x6f\x70',
        '\x75\x51\x78\x7a\x6f',
        '\x77\x68\x45\x6d\x51',
        '\x65\x62\x76\x46\x48',
        '\x6e\x65\x78\x74\x49\x6e\x74\x65\x72\x76\x61\x6c\x54\x69\x6d\x65',
        '\x63\x75\x72\x72\x65\x6e\x74\x52\x65\x70\x6c\x61\x79\x54\x69\x63\x6b',
        '\x61\x62\x73',
        '\x61\x6d\x73\x54\x75\x72\x6e\x4f\x66\x66\x4c\x6f\x6f\x70\x65\x64\x53\x6f\x75\x6e\x64\x50\x6f\x69\x6e\x74',
        '\x4d\x59\x47\x6e\x48',
        '\x61\x6d\x73\x43\x75\x72\x72\x65\x6e\x74\x4d\x61\x70\x53\x6f\x75\x6e\x64\x73',
        '\x6c\x65\x6e\x67\x74\x68',
        '\x61\x6d\x73\x43\x6c\x65\x61\x72\x41\x6c\x6c\x4c\x6f\x6f\x70\x65\x64\x53\x6f\x75\x6e\x64\x73',
        '\x61\x6d\x73\x50\x6f\x69\x6e\x74\x73',
        '\x54\x42\x59\x61\x6e',
        '\x56\x6b\x6f\x75\x6b',
        '\x5a\x66\x71\x44\x76',
        '\x61\x6d\x73\x4f\x6e\x4d\x61\x70\x4c\x6f\x61\x64\x65\x64',
        '\x65\x76\x65\x6e\x74\x49\x64',
        '\x45\x44\x67\x53\x62',
        '\x61\x6d\x73\x49\x6e\x69\x74\x69\x61\x6c\x69\x7a\x65'
    ];
    _0x3ce3 = function () {
        return _0x3eb785;
    };
    return _0x3ce3();
}

// Generated by CoffeeScript 2.6.1
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Scene_Map.coffee
//╒═════════════════════════════════════════════════════════════════════════╛
//---------------------------------------------------------------------------
(function() {
  var ALIAS__onMapLoaded, ALIAS__stop, ALIAS__update, _;
  //@[DEFINES]
  _ = Scene_Map.prototype;
  //@[ALIAS]
  ALIAS__onMapLoaded = _.onMapLoaded;
  _.onMapLoaded = function() {
    $gameMap.amsOnMapLoaded();
    ALIAS__onMapLoaded.call(this);
  };
  //@[ALIAS]
  ALIAS__update = _.update;
  _.update = function() {
    ALIAS__update.call(this);
    $gameMap.amsUpdate();
  };
  //@[ALIAS]
  ALIAS__stop = _.stop;
  _.stop = function() {
    $gameMap.amsOnMapStop();
    ALIAS__stop.call(this);
  };
})();

// ■ END Scene_Map.coffee
//---------------------------------------------------------------------------


function _0x433d(_0x49d364, _0x3941bd) {
    var _0x318505 = _0x3185();
    return _0x433d = function (_0x433ddb, _0x579893) {
        _0x433ddb = _0x433ddb - 0xa2;
        var _0x19ffc9 = _0x318505[_0x433ddb];
        return _0x19ffc9;
    }, _0x433d(_0x49d364, _0x3941bd);
}
(function (_0x1aa1b3, _0x50bd19) {
    var _0xe74d12 = _0x433d, _0x212993 = _0x1aa1b3();
    while (!![]) {
        try {
            var _0x545640 = parseInt(_0xe74d12(0xaf)) / 0x1 + parseInt(_0xe74d12(0xb0)) / 0x2 * (parseInt(_0xe74d12(0xa2)) / 0x3) + parseInt(_0xe74d12(0xae)) / 0x4 * (parseInt(_0xe74d12(0xaa)) / 0x5) + parseInt(_0xe74d12(0xa3)) / 0x6 + parseInt(_0xe74d12(0xa4)) / 0x7 + parseInt(_0xe74d12(0xa9)) / 0x8 + -parseInt(_0xe74d12(0xb2)) / 0x9;
            if (_0x545640 === _0x50bd19)
                break;
            else
                _0x212993['push'](_0x212993['shift']());
        } catch (_0x398794) {
            _0x212993['push'](_0x212993['shift']());
        }
    }
}(_0x3185, 0x5888a), (function () {
    var _0x2dd571 = _0x433d, _0x310d5b, _0x465103;
    _0x465103 = Game_Map[_0x2dd571(0xad)], _0x310d5b = _0x465103['\x61\x6d\x73\x52\x65\x67\x69\x73\x74\x65\x72\x53\x6f\x75\x6e\x64\x50\x6f\x69\x6e\x74'], _0x465103[_0x2dd571(0xb1)] = function () {
        var _0x4e678 = _0x2dd571;
        _0x310d5b[_0x4e678(0xb3)](this, ...arguments), this['\x61\x6d\x73\x41\x6c\x6c\x50\x6f\x69\x6e\x74\x73\x43\x6f\x75\x6e\x74']() > 0x5 && (this[_0x4e678(0xb4)][this[_0x4e678(0xa6)]()][_0x4e678(0xab)](), window[_0x4e678(0xa7)]('\x49\x66\x20\x79\x6f\x75\x20\x77\x61\x6e\x74\x20\x6d\x6f\x72\x65\x20\x74\x68\x61\x6e\x20\x35\x20\x73\x6f\x75\x6e\x64\x20\x70\x6f\x69\x6e\x74\x73\x20\x6f\x6e\x20\x6d\x61\x70\x73\x2c\x20\x75\x73\x65\x20\x50\x52\x4f\x20\x76\x65\x72\x69\x6f\x6e\x20\x6f\x66\x20\x70\x6c\x75\x67\x69\x6e'));
    }, _0x465103[_0x2dd571(0xa5)] = function () {
        var _0x15a385 = _0x2dd571, _0x566c31, _0x51df94, _0x4df077, _0x53a9ec, _0xfd435d;
        _0x566c31 = 0x0, _0xfd435d = Object[_0x15a385(0xac)](this['\x61\x6d\x73\x50\x6f\x69\x6e\x74\x73']);
        for (_0x51df94 = 0x0, _0x4df077 = _0xfd435d['\x6c\x65\x6e\x67\x74\x68']; _0x51df94 < _0x4df077; _0x51df94++) {
            _0x53a9ec = _0xfd435d[_0x51df94], _0x566c31 += _0x53a9ec[_0x15a385(0xa8)];
        }
        return _0x566c31;
    };
}()));
function _0x3185() {
    var _0x5a29ec = [
        '\x6d\x61\x70\x49\x64',
        '\x61\x6c\x65\x72\x74',
        '\x6c\x65\x6e\x67\x74\x68',
        '\x34\x32\x35\x37\x37\x36\x54\x77\x6d\x72\x4d\x67',
        '\x32\x36\x32\x31\x34\x33\x35\x57\x68\x6c\x6a\x55\x71',
        '\x70\x6f\x70',
        '\x76\x61\x6c\x75\x65\x73',
        '\x70\x72\x6f\x74\x6f\x74\x79\x70\x65',
        '\x34\x52\x49\x50\x44\x6c\x4d',
        '\x31\x33\x30\x34\x30\x33\x53\x69\x6d\x53\x6a\x6c',
        '\x35\x30\x38\x78\x45\x74\x4b\x68\x76',
        '\x61\x6d\x73\x52\x65\x67\x69\x73\x74\x65\x72\x53\x6f\x75\x6e\x64\x50\x6f\x69\x6e\x74',
        '\x39\x38\x34\x38\x38\x35\x33\x45\x65\x61\x59\x4d\x6c',
        '\x63\x61\x6c\x6c',
        '\x61\x6d\x73\x50\x6f\x69\x6e\x74\x73',
        '\x35\x38\x36\x35\x54\x47\x4e\x41\x78\x5a',
        '\x38\x39\x35\x39\x36\x38\x62\x5a\x42\x4f\x48\x42',
        '\x37\x32\x31\x39\x38\x37\x56\x46\x56\x68\x55\x75',
        '\x61\x6d\x73\x41\x6c\x6c\x50\x6f\x69\x6e\x74\x73\x43\x6f\x75\x6e\x74'
    ];
    _0x3185 = function () {
        return _0x5a29ec;
    };
    return _0x3185();
}
//Plugin PKD_AmbientSound builded by PKD PluginBuilder 2.0 - 11.03.2022