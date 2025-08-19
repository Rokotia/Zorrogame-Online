//=============================================================================
// EnemySplitPlugin.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Enemy Split v1.0.0
 * @author YourName
 * @version 1.0.0
 * 
 * @help EnemySplitPlugin.js
 * 
 * This plugin allows enemies to split into two when their HP drops below
 * a certain threshold.
 * 
 * Usage:
 * 1. Add a state with note tag: <split>
 * 2. Create a skill/item that applies this state
 * 3. Or use the script call: splitEnemy(enemyIndex)
 */

(() => {
    'use strict';

    // Function to split an enemy
    window.splitEnemy = function(enemyIndex) {
        const enemy = $gameTroop._enemies[enemyIndex];
        if (!enemy || enemy.isDead() || enemy.hp <= 10) return false;

        // Calculate split HP and preserve stats
        const hp = Math.floor(enemy.hp / 2);
        const tp = enemy.tp;
        const speed = enemy.params[6]; // AGI parameter
        const enemyId = enemy._enemyId;
        
        // Calculate new positions
        const originalX = enemy._screenX;
        const originalY = enemy._screenY;
        
        // Position calculations (similar to original)
        const x1 = Math.round(originalX * (Math.random() * 0.36 + 0.85));
        const y1 = Math.round(originalY * (Math.random() * 1.1 + 0.5));
        
        const x2 = (x1 < originalX * 1.02) ? 
            Math.round(originalX * (Math.random() * 0.19 + 1.02)) : 
            Math.round(originalX * (Math.random() * 0.18 + 0.85));
        const y2 = (y1 < originalY) ? 
            Math.round(originalY * (Math.random() * 0.6 + 1)) : 
            Math.round(originalY * (Math.random() * 0.5 + 0.5));

        // Constrain positions to screen bounds
        const pos1 = {
            x: Math.min(Math.max(x1, 10), 600),
            y: Math.min(Math.max(y1, 300), 500)
        };
        const pos2 = {
            x: Math.min(Math.max(x2, 10), 600),
            y: Math.min(Math.max(y2, 300), 500)
        };

        // Remove original enemy
        $gameTroop._enemies.splice(enemyIndex, 1);

        // Create two new enemies
        const enemy1 = new Game_Enemy(enemyId, pos1.x, pos1.y);
        const enemy2 = new Game_Enemy(enemyId, pos2.x, pos2.y);

        // Set their HP and stats
        enemy1.setHp(hp);
        enemy1.setTp(tp);
        enemy2.setHp(hp);
        enemy2.setTp(tp);

        // Insert new enemies
        $gameTroop._enemies.splice(enemyIndex, 0, enemy1, enemy2);

        // Refresh troop
        $gameTroop.makeUniqueNames();
        
        // Refresh battle sprites
        if (SceneManager._scene._spriteset) {
            SceneManager._scene._spriteset.refreshEnemyBattlers();
        }

        return true;
    };

    // Override Game_Enemy death to check for split
    const _Game_Enemy_die = Game_Enemy.prototype.die;
    Game_Enemy.prototype.die = function() {
        // Check if enemy should split before dying
        if (this.hp > 10 && this.isStateAffected(1)) { // State ID 1 for "split"
            const enemyIndex = $gameTroop._enemies.indexOf(this);
            if (enemyIndex >= 0) {
                splitEnemy(enemyIndex);
                return; // Don't actually die
            }
        }
        _Game_Enemy_die.call(this);
    };

    // Alternative: Check for split when taking damage
    const _Game_Enemy_onDamage = Game_Enemy.prototype.onDamage;
    Game_Enemy.prototype.onDamage = function(value) {
        _Game_Enemy_onDamage.call(this, value);
        
        // Check if should split after taking damage
        if (this.hp <= this.mhp / 2 && this.hp > 10 && !this._hasSplit) {
            // Check for split condition (you can customize this)
            if (this.enemy().note.includes('<split>')) {
                this._hasSplit = true; // Prevent multiple splits
                const enemyIndex = $gameTroop._enemies.indexOf(this);
                if (enemyIndex >= 0) {
                    splitEnemy(enemyIndex);
                }
            }
        }
    };

    // Refresh enemy battler sprites
    Spriteset_Battle.prototype.refreshEnemyBattlers = function() {
        // Remove old enemy sprites
        for (const sprite of this._enemySprites) {
            this._battleField.removeChild(sprite);
        }
        this._enemySprites = [];
        
        // Create new enemy sprites
        for (const enemy of $gameTroop.aliveMembers()) {
            const sprite = new Sprite_Enemy(enemy);
            this._enemySprites.push(sprite);
            this._battleField.addChild(sprite);
        }
    };

    // === ALTERNATIVE IMPLEMENTATIONS ===

    // Method 1: Script Call in Event
    // Use this in a script call: splitEnemyById(1, 2)
    window.splitEnemyById = function(troopMemberIndex, stateId = 1) {
        const enemy = $gameTroop._enemies[troopMemberIndex];
        if (!enemy) return false;
        
        enemy.addState(stateId); // Add death state or custom state
        return splitEnemy(troopMemberIndex);
    };

    // Method 2: Skill/Item Effect
    // Add this to a skill's damage formula or use as a common event
    window.skillSplitEffect = function(target) {
        if (target.isEnemy() && target.hp > 10) {
            const enemyIndex = $gameTroop._enemies.indexOf(target);
            if (enemyIndex >= 0) {
                return splitEnemy(enemyIndex);
            }
        }
        return false;
    };

    // Method 3: Automatic split at 50% HP (like your original)
    // This version automatically triggers when enemy reaches 50% HP
    const _Game_Battler_refresh = Game_Battler.prototype.refresh;
    Game_Battler.prototype.refresh = function() {
        _Game_Battler_refresh.call(this);
        
        if (this.isEnemy() && !this._hasSplit && this.hp > 10) {
            const hpRatio = this.hp / this.mhp;
            if (hpRatio <= 0.5 && this.enemy().note.includes('<autoSplit>')) {
                this._hasSplit = true;
                const enemyIndex = $gameTroop._enemies.indexOf(this);
                if (enemyIndex >= 0) {
                    // Delay the split slightly to avoid refresh conflicts
                    $gameTemp.reserveCommonEvent(0); // Use a dummy common event or create one
                    setTimeout(() => splitEnemy(enemyIndex), 100);
                }
            }
        }
    };

})();