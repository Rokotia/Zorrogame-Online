// PlacePictureBehindEnemies.js
// RPG Maker MZ plugin — mirror a shown Picture behind chosen battler layers.
// Works with side-view + VisuStella by letting you target enemies, actors, or battlefield.
// Save as: js/plugins/PlacePictureBehindEnemies.js  (UTF-8, no BOM)

/*:
 * @target MZ
 * @plugindesc Show a Picture BEHIND battlers by mirroring it under chosen layer (works with Move/Rotate Picture).
 *
 * @command PlaceBehind
 * @text Place Picture Behind Enemies
 * @arg id
 * @type number
 * @min 1
 * @desc Picture ID to mirror behind enemies.
 *
 * @command PlaceBehindOn
 * @text Place Picture Behind (Choose Layer)
 * @arg id
 * @type number
 * @min 1
 * @desc Picture ID to mirror.
 * @arg layer
 * @type select
 * @option auto
 * @option enemies
 * @option actors
 * @option battlefield
 * @default auto
 * @desc Where to place the mirrored sprite.
 *
 * @command RestoreToPictures
 * @text Restore Picture To Picture Layer
 * @arg id
 * @type number
 * @min 1
 * @desc Remove the mirror and reveal the original picture again.
 */
(() => {
  "use strict";
  const PLUGIN_NAME = "PlacePictureBehindEnemies";
  const mirrors = new Map();

  function spriteset() {
    const scene = SceneManager._scene;
    return scene && scene._spriteset ? scene._spriteset : null;
  }
  function pictureSprite(id) {
    const ss = spriteset();
    return ss && ss._pictureSprites ? ss._pictureSprites[Number(id) - 1] : null;
  }
  function layerInfoFor(layer) {
    switch ((layer || "auto").toLowerCase()) {
      case "enemies": return enemyLayerInfo();
      case "actors": return actorLayerInfo();
      case "battlefield": return battlefieldInfo();
      case "auto":
      default:
        return enemyLayerInfo() || actorLayerInfo() || battlefieldInfo();
    }
  }
  function enemyLayerInfo() {
    const ss = spriteset();
    if (!ss) return null;
    let parent = null, nodes = [];
    if (ss._battleEnemies && ss._battleEnemies.parent) {
      parent = ss._battleEnemies.parent; nodes = ss._battleEnemies.children;
    } else if (ss._enemySprites && ss._enemySprites.length) {
      parent = ss._enemySprites[0].parent; nodes = ss._enemySprites;
    }
    return makeLayerInfo(parent, nodes);
  }
  function actorLayerInfo() {
    const ss = spriteset();
    if (!ss) return null;
    let parent = null, nodes = [];
    if (ss._battleActors && ss._battleActors.parent) {
      parent = ss._battleActors.parent; nodes = ss._battleActors.children;
    } else if (ss._actorSprites && ss._actorSprites.length) {
      parent = ss._actorSprites[0].parent; nodes = ss._actorSprites;
    }
    return makeLayerInfo(parent, nodes);
  }
  function battlefieldInfo() {
    const ss = spriteset();
    const parent = ss && (ss._battleField || ss._battlefield || ss._baseSprite);
    return parent ? { parent, minIndex: 0, minZ: (parent.sortableChildren ? -99999 : 0) } : null;
  }
  function makeLayerInfo(parent, nodes) {
    if (!parent || !nodes || nodes.length === 0) return null;
    let minIndex = Infinity, minZ = Infinity;
    for (const s of nodes) {
      if (!s || !s.parent) continue;
      const idx = s.parent.children.indexOf(s);
      if (idx >= 0 && idx < minIndex) minIndex = idx;
      const z = typeof s.zIndex === "number" ? s.zIndex : 0;
      if (z < minZ) minZ = z;
    }
    if (!isFinite(minIndex)) minIndex = 0;
    if (!isFinite(minZ)) minZ = 0;
    return { parent, minIndex, minZ };
  }
  function toLocalIn(container, globalPoint) {
    const out = new PIXI.Point(globalPoint.x, globalPoint.y);
    container.worldTransform.applyInverse(out, out);
    return out;
  }
  function ensureBehind(m, info) {
    if (!info || !info.parent || !m.clone) return;
    const parent = info.parent;
    if (m.clone.parent !== parent) {
      if (m.clone.parent) m.clone.parent.removeChild(m.clone);
      parent.addChild(m.clone);
    }
    if (parent.sortableChildren) {
      const targetZ = Math.min(info.minZ - 1, -99999);
      if (m.clone.zIndex !== targetZ) { m.clone.zIndex = targetZ; parent.sortChildren(); }
    } else {
      const current = parent.children.indexOf(m.clone);
      const desired = Math.max(0, info.minIndex - 1);
      if (current !== desired) parent.setChildIndex(m.clone, desired);
    }
  }
  function syncCloneToSource(m, info) {
    const src = m.src; if (!src || !m.clone || !info) return;
    ensureBehind(m, info);
    if (m.clone.bitmap !== src.bitmap) m.clone.bitmap = src.bitmap;
    m.clone.anchor.set(src.anchor.x, src.anchor.y);
    m.clone.scale.set(src.scale.x, src.scale.y);
    m.clone.rotation = src.rotation;
    m.clone.opacity = src.opacity;
    m.clone.blendMode = src.blendMode;
    const gp = src.getGlobalPosition(new PIXI.Point());
    const lp = toLocalIn(info.parent, gp);
    m.clone.position.set(lp.x, lp.y);
    src.visible = false;
    m.clone.visible = true;
  }
  function placeBehind(id, layerKey) {
    const src = pictureSprite(id);
    if (!src) return;
    let rec = mirrors.get(id);
    if (!rec) { rec = { src, clone: new Sprite(src.bitmap), parent: null }; mirrors.set(id, rec); }
    const info = layerInfoFor(layerKey);
    if (info) syncCloneToSource(rec, info);
  }

  PluginManager.registerCommand(PLUGIN_NAME, "PlaceBehind", args => {
    placeBehind(Number(args.id || 0), "enemies");
  });
  PluginManager.registerCommand(PLUGIN_NAME, "PlaceBehindOn", args => {
    placeBehind(Number(args.id || 0), String(args.layer || "auto"));
  });
  PluginManager.registerCommand(PLUGIN_NAME, "RestoreToPictures", args => {
    const id = Number(args.id || 0);
    const m = mirrors.get(id);
    if (!m) return;
    if (m.clone && m.clone.parent) m.clone.parent.removeChild(m.clone);
    if (m.src) m.src.visible = true;
    mirrors.delete(id);
  });

  const _Spriteset_Battle_update = Spriteset_Battle.prototype.update;
  Spriteset_Battle.prototype.update = function() {
    _Spriteset_Battle_update.call(this);
    if (mirrors.size === 0) return;
    for (const [id, m] of mirrors) {
      if (!m || !m.src) { mirrors.delete(id); continue; }
      if (!m.src.bitmap || !m.src.parent) {
        if (m.clone && m.clone.parent) m.clone.parent.removeChild(m.clone);
        mirrors.delete(id); continue;
      }
      const info = enemyLayerInfo() || actorLayerInfo() || battlefieldInfo();
      if (info) syncCloneToSource(m, info);
    }
  };

  const _Scene_Battle_terminate = Scene_Battle.prototype.terminate;
  Scene_Battle.prototype.terminate = function() {
    for (const [, m] of mirrors) {
      if (m && m.clone && m.clone.parent) m.clone.parent.removeChild(m.clone);
      if (m && m.src) m.src.visible = true;
    }
    mirrors.clear();
    if (_Scene_Battle_terminate) _Scene_Battle_terminate.call(this);
  };
})();
