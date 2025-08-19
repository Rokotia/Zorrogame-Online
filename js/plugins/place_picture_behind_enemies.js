// PlacePictureBehindEnemies.js
// RPG Maker MZ plugin — move a shown Picture behind enemy battlers during battle.
// Save this file as EXACTLY: PlacePictureBehindEnemies.js
// Encoding: UTF-8 (no BOM). Plain ASCII characters only.

/*:
 * @target MZ
 * @plugindesc Place a shown Picture behind battlers in battle (keeps Move/Rotate Picture working).
 * @command PlaceBehind
 * @text Place Picture Behind Enemies
 * @arg id
 * @type number
 * @min 1
 * @desc Picture ID to move behind enemies.
 *
 * @command RestoreToPictures
 * @text Restore Picture To Picture Layer
 * @arg id
 * @type number
 * @min 1
 * @desc Picture ID to restore to the normal picture layer.
 */
(() => {
  "use strict";

  // Use the literal plugin name to avoid any filename/regex issues.
  const PLUGIN_NAME = "PlacePictureBehindEnemies";

  // Track original parent/index so we can restore later.
  const placed = new Map(); // id -> { parent, index }

  function spriteset() {
    const scene = SceneManager._scene;
    return scene && scene._spriteset ? scene._spriteset : null;
  }
  function battlefield() {
    const ss = spriteset();
    return ss && ss._battleField ? ss._battleField : null;
  }
  function enemySprites() {
    const ss = spriteset();
    return ss && ss._enemySprites ? ss._enemySprites : [];
  }
  function pictureSprite(id) {
    const ss = spriteset();
    if (!ss || !ss._pictureSprites) return null;
    const idx = Number(id) - 1;
    return ss._pictureSprites[idx] || null;
  }
  function insertIndexUnderFirstEnemy(bf) {
    const es = enemySprites();
    if (!es.length) return bf.children.length;
    const firstEnemy = es[0];
    const idx = bf.children.indexOf(firstEnemy);
    return idx >= 0 ? idx : bf.children.length;
  }

  // Move a shown picture behind enemy sprites (still in battlefield container).
  PluginManager.registerCommand(PLUGIN_NAME, "PlaceBehind", args => {
    const id = Number(args.id || 0);
    const spr = pictureSprite(id);
    const bf = battlefield();
    if (!spr || !bf) return;

    // Remember original parent/index to restore later.
    if (!placed.has(id) && spr.parent) {
      const parent = spr.parent;
      const index = parent.children.indexOf(spr);
      placed.set(id, { parent, index });
    }

    // Reparent to battlefield below enemies.
    if (spr.parent) spr.parent.removeChild(spr);
    const insertIndex = insertIndexUnderFirstEnemy(bf);
    bf.addChildAt(spr, insertIndex);
  });

  // Restore a picture to the original picture layer.
  PluginManager.registerCommand(PLUGIN_NAME, "RestoreToPictures", args => {
    const id = Number(args.id || 0);
    const spr = pictureSprite(id);
    const rec = placed.get(id);
    if (!spr || !rec || !rec.parent) {
      placed.delete(id);
      return;
    }
    if (spr.parent) spr.parent.removeChild(spr);
    const parent = rec.parent;
    const index = Math.min(rec.index, parent.children.length);
    parent.addChildAt(spr, index);
    placed.delete(id);
  });

  // Safety: clear references when leaving battle.
  const _Scene_Battle_terminate = Scene_Battle.prototype.terminate;
  Scene_Battle.prototype.terminate = function() {
    placed.clear();
    if (_Scene_Battle_terminate) _Scene_Battle_terminate.call(this);
  };
})();
