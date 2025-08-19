//=============================================================================
// RPG Maker MZ - Enemy Levels
// COCOMODE_enemyLevels.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc Enables the user to apply levels and level-based changes to enemies encountered in combat, based on various parameters.
 * @author CocoMode
 *
 * @url https://cocomode.itch.io/
 *
 * @param separator1
 * @text ==========================
 * @desc Separator between different sections of the definitions.
 * @type note
 *
 * @param separator2
 * @text |  Default Definitions   |
 * @desc Separator between different sections of the definitions.
 * @type note
 *
 * @param separator3
 * @text ==========================
 * @desc Separator between different sections of the definitions.
 * @type note
 *
 * @param defaultLevelType
 * @text Default Level Type
 * @type select
 * @desc Define the method by which to determine the default level for enemies.
 * @option Fixed Value
 * @value fixedValue
 * @option Based on Party Levels
 * @value partyLevels
 * @option Based on a Game Variable
 * @value gameVariable
 * @option Determined by Location Parameters
 * @value locationBased
 * @default partyLevels
 *
 * @param fixedLevel
 * @text Fixed Level
 * @type number
 * @desc Enter a number to be used as a fixed value for the default level of enemies in the game.
 * @min 1
 * @max 10000000
 * @default 1
 *
 * @param partyLevels
 * @text By Party Levels
 * @type select
 * @desc Choose a metric of the party members' levels to be used as the default level of enemies in the game.
 * @option Highest Level of Party Members
 * @value partyHighest
 * @option Average Level of Party Members
 * @value partyAverage
 * @option Lowest Level of Party Members
 * @value partyLowest
 * @option Highest Level of the Battling Party Members
 * @value battlingHighest
 * @option Average Level of the Battling Party Members
 * @value battlingAverage
 * @option Lowest Level of the Battling Party Members
 * @value battlingLowest
 * @default battlingAverage
 *
 * @param gameVariable
 * @text Game Variable
 * @desc Specify the game variable whose value is to be used as the default level of enemies in the game.
 * @type variable
 * @min 0
 * @max 100000000000000000
 * @default 1000
 *
 * @param locationBased
 * @text Locations Based
 * @desc Determine the default level of enemies in the game based on their location parameters.
 * @type struct<locationBasedParams>
 *
 * @param positiveVariance
 * @text Positive Level Variance:
 * @type number
 * @desc Define the default positive variance value for the level of enemies in the game.
 * @min 0
 * @max 1000000000000000000000
 * @default 0
 *
 * @param negativeVariance
 * @text Negative Level Variance:
 * @type number
 * @desc Define the default negative variance value for the level of enemies in the game.
 * @min 0
 * @max 1000000000000000000000
 * @default 0
 *
 * @param minLevel
 * @text Minimum Level
 * @desc Define the default minimum level for enemies in the game.
 * @type number
 * @min 1
 * @max 10000000000000
 * @default 1
 *
 * @param maxLevel
 * @text Maximum Level
 * @desc Define the default maximum level for enemies in the game.
 * @type number
 * @min 1
 * @max 10000000000000
 * @default 100
 *
 * @param statIncreaseType
 * @text Stat Increase Type
 * @desc Define the method by which to increase the enemy's stats per level (flat, relative, or a combination of both).
 * @type select
 * @option Relative
 * @value relative
 * @option Flat
 * @value flat
 * @option A Combination of Both
 * @value relativeAndFlat
 * @default relative
 *
 * @param relativeStatIncrease
 * @text Relative Stat Increase
 * @desc Define the default relative rate by which to increase enemy stats per level.
 * @type struct<relativeStatIncreaseParams>
 *
 * @param flatStatIncrease
 * @text Flat Stat Increase
 * @desc Define the default flat rate by which to increase enemy stats per level.
 * @type struct<flatStatIncreaseParams>
 *
 * @param skillsPerLevel
 * @text Skills Per Level
 * @desc Define the default for which skills the enemy gains per level.
 * @type struct<skillsPerLevelParams>[]
 *
 * @param traitsPerLevel
 * @text Traits Per Level
 * @desc Define the default for which traits the enemy gains per level.
 * @type struct<traitsPerLevelParams>[]
 *
 * @param dropsPerLevel
 * @text Drops Per Level
 * @desc Define the default for which items (items / weapons / armor) the enemy drops per level.
 * @type struct<dropsPerLevelParams>[]
 *
 * @param displayLevel
 * @text Display Level?
 * @desc Define whether or not to display an enemy's name & level above its sprite in battle.
 * @type boolean
 * @on Display Level
 * @off Do Not Display Level
 * @default true
 *
 * @param levelDisplayFormat
 * @text Level Display Format
 * @desc Define the format in which to display the enemy's name & level in battle (%1 - Level, %2 - Name)
 * @type string
 * @default Level %1 %2
 *
 * @param separator5
 * @text ==========================
 * @desc Separator between different sections of the definitions.
 * @type note
 *
 * @param separator6
 * @text | Definitions Per Enemy  |
 * @desc Separator between different sections of the definitions.
 * @type note
 *
 * @param separator7
 * @text ==========================
 * @desc Separator between different sections of the definitions.
 * @type note
 *
 * @param definitionsPerEnemy
 * @text Definitions Per Enemy
 * @desc Define the parameters for determining a specific enemy's level (per enemy ID).
 * @type struct<definitionsPerEnemyParams>[]
 *
 * @param separator9
 * @text ==========================
 * @desc Separator between different sections of the definitions.
 * @type note
 *
 * @param separator10
 * @text |  Bonuses & Penalties   |
 * @desc Separator between different sections of the definitions.
 * @type note
 *
 * @param separator11
 * @text ==========================
 * @desc Separator between different sections of the definitions.
 * @type note
 *
 * @param levelBonuses
 * @text Bonus/Penalty Definitions
 * @desc Define the parameters & conditions for granting bonuses or penalties to enemy level.
 * @type struct<levelBonusesParams>
 *
 * @command enemyInstanceDefinitions
 * @text Enemy Instance Level Definitions
 * @desc Define the parameters for determining the level of Enemy Instances (= enemies in a specific battle).
 *
 * @arg enemyInstanceDefinitions
 * @text Instance Definitions
 * @desc Define the parameters for determining the level of Enemy Instances (= enemies in a specific battle).
 * @type struct<enemyInstanceDefinitionsParams>[]
 *
 * @command changeLevelsMidBattle
 * @text Change Enemy Levels Mid-Battle
 * @desc Define parameters & conditions for changing enemy levels mid-battle.
 *
 * @arg changeLevelsMidBattle
 * @text Level Change Definitions
 * @desc Define parameters & conditions for changing enemy levels mid-battle.
 * @type struct<changeLevelsMidBattleParams>
 *
 * @help COCOMODE_enemyLevels.js
 * 
 * Enemies in RPG Maker MZ do not have a built-in level progression system, 
 * and are defined with static parameters that do not change throughout the
 * game. 
 * 
 * This plugin allows game developers:
 * -----------------------------------
 * 1. To apply levels to enemies in their game, based on various conditions.
 * 
 * 2. To define how these enemies "evolve" per level, in terms of:
 * 
 *    2.1. The Increase in their stats (Max HP, Max MP, Attack etc.)
 * 
 *    2.2. The accumulation of skills & traits.
 * 
 *    2.3. The increase in the amount of gold they drop when defeated.
 * 
 *    2.4. The items they drop in each level when defeated.
 * 
 *    2.5. The EXP awarded for defeating them.
 * 
 *    2.6. And even the the way they look in battle (the images used as 
 *         the enemy's sprites per level).
 * 
 * 3. To apply enemy levels and the customization of enemy levels in the 
 *    following descending order (each category overriding the one preceding 
 *    it):
 * 
 *    3.1. As a default - all enemies in the game not otherwise customized 
 *         will be affected.
 * 
 *    3.2. Per enemy type (ID) - all enemies of a certain ID (for example -
 *         all Goblins) not otherwise customized will be affected.
 * 
 *    3.3. Per enemy instance - specific enemies in a specific battle will 
 *         be affected.
 * 
 * 4. To DETERMINE enemy levels:
 *    
 *    4.1. Using fixed values.
 * 
 *    4.2. Based on the game party / battling party members' levels (highest, 
 *         average or lowest).
 *    
 *    4.3. Based on the value of game variables.
 * 
 *    4.4. Based on the enemy's location data (map IDs, Map difficulty, Region
 *         IDs).
 * 
 * 5. To MODIFY enemy levels ("on top" of the previously determined level) 
 *    through:
 *   
 *    5.1. Level variation definitions (the user can define a "range" instead 
 *         of a fixed number), which enable level diversity within an enemy 
 *         troop.
 * 
 *    5.2. Bonus / penalty modifiers, which can be defined based on various
 *         parameters such as enemy ID, location data, the value of game 
 *         variables, weather conditions, items in the player party's 
 *         possession, and the composition of the player's party.
 * 
 * 6. To define the enemy's stats / gold / EXP increase per level in one of
 *    three different methods:
 * 
 *    6.1. Flat - a fixed value will be added to each parameter per level.
 *         For example: a fixed value of 5 will be added to max HP per level.
 * 
 *         The formula for calculating a stat's value (where 'base' is the 
 *         original value in the database): base + (flat rate * (level - 1))
 * 
 *    6.2. Relative - a percentage of the current value of the parameter 
 *         will be added to it when progressing to the next level. For
 *         example: if the value of ATK at level 4 is 20, and the defined
 *         relative progression rate for this parameter is 20% per level, 
 *         then the value of ATK at level 5 will be 24 (20 + 4).
 * 
 *         The formula for calculating a stat's value in this case: 
 *         base * (relative rate ** (level - 1))
 *         
 *    6.3. Flat & Relative - a combination of both methods.
 * 
 *         The formula for calculating a stat's value in this case:
 *         ((((((base * relative rate) + flat rate) * relative rate) + flat 
 *         rate) * relative rate) + flat rate)... (and so on for the required
 *         number of levels - 1) 
 * 
 * 7. To change enemy levels mid-battle through a plugin command, or allow 
 *    the player's party to do the same through the application of items or 
 *    skills. 
 * 
 * 8. To Define whether or not to display the enemy's name & level above their
 *    sprite during battle, and if display - the textual format in which to 
 *    display it.
 * 
 * 
 * Plugin Parameters & Commands Explained:
 * =======================================
 * 
 * Default / General Definitions
 * -----------------------------
 * The first part of the plugin's parameters contains the default level 
 * definitions - applied to all enemies in the game unless otherwise
 * customized.
 * 
 * 1. Default Level Type - Defines the method by which to determine the 
 *    default level for enemies. Options include:
 *   
 *    (1) Fixed Value.
 * 
 *    (2) Based on Party Levels - Enemy levels will be determined by a (later
 *        defined) metric of the game party's / batttling party's levels - 
 *        either highest, average, or lowest level. 
 * 
 *    (3) Based on a Game Variable - Enemy levels will be determined by the 
 *        value of a (later defined) game variable.
 * 
 *    (4) Determined by Location Parameters - enemy levels will be determined
 *        by their location Data (map ID, region ID, etc., specific parameters
 *        defined later)
 * 
 * 2. Fixed level - If the method chosen to determine enemy levels was "Fixed 
 *    Value", this is where you enter the fixed value itself (a number).
 * 
 * 3. By Party Levels - If the method chosen to determine enemy levels was 
 *    "Based on Party Levels", this is where you select the metric of the 
 *    party's levels to be used for enemy level. Options include:
 * 
 *    (1) Highest Level of Party Members.
 * 
 *    (2) Average Level of Party Members.
 * 
 *    (3) Lowest Level of Party Members.
 * 
 *    (4) Highest Level of the Battling Party Members (just the members of the 
 *        party who participate in battle, usually the first four).
 * 
 *    (5) Average Level of the Battling Party Members.
 * 
 *    (6) Lowest Level of the Battling Party Members.
 * 
 * 4. Game Variable - If the method chosen to determine enemy levels was 
 *    "Based on a Game Variable", this is where you enter the ID (a number) of 
 *    the game variable whose value will be used.
 * 
 * 5. Location Based - If the method chosen to determine enemy levels was 
 *    "Determined by Location Parameters", this is where you enter the various
 *    definitions for determining enemy level based on their location data. 
 *    Sub-parameters:
 * 
 *    5.1. By Map ID - Definitions based on the specific map the enemy is in.
 *         The user can create multiple definitions. Sub-parameters for each 
 *         definition:
 * 
 *         5.1.1. Map IDs - The Ids of the game maps in which to determine the 
 *                enemy's level.
 * 
 *         5.1.2. Level Type - the method by which to determine the level for 
 *                enemies in the chosen game maps. options include "Fixed 
 *                Value", "Based on Party Levels" and "Based on a Game 
 *                Variable" (see explanations in article 1).
 * 
 *         5.1.3. Fixed Level - If the selected method to determine enemy 
 *                levels in the chosen game maps was "Fixed Value", this is 
 *                where you enter the fixed value itself (a number).
 * 
 *         5.1.4. By Party Levels - If the selected method to determine enemy 
 *                levels in the chosen game maps was "Based on Party Levels", 
 *                this is where you select the metric of the party's levels 
 *                to be used for enemy level (highest / average / lowest 
 *                level of party / battling party members).
 * 
 *         5.1.5. Game Variable - If the selected method to determine enemy 
 *                levels in the chosen game maps was "Based on a Game 
 *                Variable", this is where you enter the ID (a number) of the
 *                game variable whose value will be used.
 * 
 * 
 *    5.2. By Map Difficulty - Definitions based on the difficulty level 
 *         defined for the map that the enemy is in (if such a definition 
 *         exists). These definitions override definitions by map ID, if 
 *         clashed.
 * 
 *         A difficulty level can be assigned to a game map as metadata in its 
 *         "note" section, in the following way:
 *         <difficulty:difficulty level>
 *         where instead of the "difficulty level" place holder, the user can 
 *         enter one of these difficulty levels: easy, medium, hard, very 
 *         hard, hellscape.
 * 
 *         The user can create multiple definitions. Sub-parameters for each 
 *         definition:
 *          
 *         5.2.1. Map Difficulty Levels - The difficulty levels of game maps 
 *                for which to determine the enemy's level
 *     
 *         5.2.2. Level Type - the method by which to determine the level for 
 *                enemies in game maps with the chosen difficulty levels.
 * 
 *         5.2.3. Fixed Level - If the selected method to determine enemy 
 *                levels for the chosen map difficulties was "Fixed Value", 
 *                this is where you enter the fixed value itself (a number).
 * 
 *         5.2.4. By Party Levels - If the selected method to determine enemy 
 *                levels for the chosen map difficulties was "Based on Party 
 *                Levels", this is where you select the metric of the party's 
 *                levels to be used for enemy level (highest / average / 
 *                lowest level of party / battling party members).
 * 
 *         5.1.5. Game Variable - If the selected method to determine enemy 
 *                levels for the chosen map difficulties was "Based on a Game
 *                Variable", this is where you enter the ID (a number) of the 
 *                game variable whose value will be used.
 * 
 *    5.3. By Region ID - Definitions based on the region the enemy is in. 
 *         These definitions override definitions by map ID & map difficulty, 
 *         if clashed.
 * 
 *         The user can create multiple definitions. Sub-parameters for each 
 *         definition:
 *          
 *         5.3.1. Region IDs - The Ids of the regions in which to determine 
 *                the enemy's level.
 *     
 *         5.3.2. Level Type - the method by which to determine the level for 
 *                enemies in the chosen regions.
 * 
 *         5.3.3. Fixed Level - If the selected method to determine enemy 
 *                levels in the chosen region IDs was "Fixed Value", this
 *                is where you enter the fixed value itself (a number).
 * 
 *         5.3.4. By Party Levels - If the selected method to determine enemy 
 *                levels in the chosen region IDs was "Based on Party 
 *                Levels", this is where you select the metric of the party's 
 *                levels to be used for enemy level (highest / average / 
 *                lowest level of party / battling party members).
 * 
 *         5.3.5. Game Variable - If the selected method to determine enemy 
 *                levels in the chosen region IDs was "Based on a Game
 *                Variable", this is where you enter the ID (a number) of the 
 *                game variable whose value will be used.
 * 
 * 6. Positive Level Variance - A numerical value indicating the positive 
 *    variance for determininbg an enemy's level. For example: if the enemy's
 *    initially-determined level is 5, and the positive variance is 2, then 
 *    the enemy's final level can be 5, 6, or 7.
 * 
 * 7. Negative Level Variance - The same, only for negative variance. Using
 *    both positive and negative variance values, the user can define a 
 *    "range" from which to randomly choose the enemy's level. For example:
 *    if the initially-determined enemy level is 5, the positive variance is
 *    2, and the negative variance is 1, then the enemy's final level can be
 *    either 4, 5, 6 or 7.
 * 
 *    NOTE: In case the user does not define a positive and / or negative
 *    variance value, the default for both is 0. 
 * 
 * 8. Minimum Level - The minimum possible level for enemies in the game,
 *    after ALL calculations (including the application of bonuses & 
 *    penalties) are completed.  
 * 
 * 9. Maximum Level - The maximum possible level for enemies in the game,
 *    after ALL calculations (including the application of bonuses & 
 *    penalties) are completed.
 * 
 *    The minimum & maximum values are used to "clamp" the enemy's level
 *    to make sure that it doesn't exceed certain boundaries.
 * 
 *    NOTE: In case the user does not define a minimum and / or a 
 *    maximum level, the default range is 1 - 100. 
 * 
 * 10. Stat Increase Type - The method by which to increase enemy stats 
 *     (max HP, max MP, ATK etc.), gold and EXP per level. Available
 *     options:
 * 
 *     (1) Relative - A percentage of the stat's existing value is added 
 *         to generate its new value for each level progression.
 * 
 *     (2) Flat - A fixed value is added to generate the stat's new
 *         value for each level progression.
 * 
 *     (3) A Combination of Both.
 * 
 *     For a detailed explanation of these options and the mathematical 
 *     formulas they employ, see the plugin's general description at the
 *     top of this help section. 
 * 
 * 11. Relative Stat Increase - If the chosen Stat Increase Type was 
 *     "Relative" or "A combination of Both", this is where you define
 *     the actual Relative values to be added to each stat per level. In 
 *     the case of a relative rate, these values are defined as 
 *     percentages (1 - 100). The sub-parameters are the stats, each one
 *     defined with its own value:
 * 
 *     11.1. Max HP (Hit Points).
 * 
 *     11.2. Max MP (Magic Points).
 * 
 *     11.3. ATK (Attack).
 * 
 *     11.4. DEF (Defense).
 * 
 *     11.5. MAT (Magic Attack).
 * 
 *     11.6. MDF (Magic Defense).
 * 
 *     11.7. AGI (Agility).
 * 
 *     11.8. LUK (Luck).
 * 
 *     11.9. EXP (Experience Points).
 * 
 *     11.10. Gold.
 * 
 * 12. Flat Stat Increase - If the chosen Stat Increase Type was 
 *     "Flat" or "A combination of Both", this is where you define
 *     the actual flat (fixed) values to be added to each stat per level. 
 *     The sub-parameters are the stats - same as those of relative stat 
 *     increase (see previous article).
 * 
 * 13. Skills Per Level - This section allows the user to determine which
 *     of the skills defined for the enemy in the RMMZ database will be
 *     available to them per level.
 * 
 *     For example: let's say we created an enemy in the RMMZ database 
 *     called "Snake King", for which we defined 3 skills: Attack, 
 *     Double-Attack & Venom. The user can define that the first skill will 
 *     be available to the enemy starting from level 2, the second skill 
 *     starting from level 4, and the third skill starting from level 7.
 * 
 *     The user can create multiple definitions. Sub-parameters for each
 *     definition:
 * 
 *     13.1. Level - The level in which the chosen skills (see next) will
 *           be available to the enemy. 
 * 
 *     13.2. Skills (Indices) - The indices of the skills to be made 
 *           available to the enemy when he reaches the above-defined level. 
 *           These are indices in the enemy's skill list in the database.
 *           For example - if you want the first skill (attack) to be 
 *           available to the enemy at this level, you need to enter the 
 *           index 0 (or 1 for the sedcond skill - Double Attack, 2 for the 
 *           third skill - Venom, and so on). 
 * 
 *     Note: If nothing is defined in this section, All the skills defined
 *     for the enemy in the database will be available to them from level 1.
 *     
 * 14. Traits Per Level - This section allows the user to determine which
 *     of the traits defined for the enemy in the RMMZ database will be
 *     available to them per level.
 * 
 *     This section works the same way as "Skills Per Level" and has
 *     similar sub-parameters to be defined.
 * 
 * 15. Drops Per Level - This section allows the user to determine which
 *     items (i.e. items / weapons / armor pieces) the enemy can possibly 
 *     drops per level, and the probability of each item drop.
 * 
 *     The user can create multiple definitions in this section, one for 
 *     each level. Sub-parameters for each definition:
 * 
 *     15.1. Level - The enemy level in which to drop the defined items.
 * 
 *     15.2. Items - A section in which to define the various items to 
 *           drop at the defined level. The user can make multiple 
 *           definitions per level, each one with its own drop-probabilty.
 *           Sub-parameters for each definition:
 * 
 *           15.2.1. Items - The IDs (numerical values) of the possible
 *                   items to drop at the defined enemy level.
 * 
 *           15.2.2. Weapons - The IDs (numerical values) of the possible
 *                   weapons to drop at the defined enemy level.
 * 
 *           15.2.3. Armor - The IDs (numerical values) of the possible
 *                   armor pieces to drop at the defined enemy level.
 * 
 *           15.2.4. Probability: The probabilty that the items defined 
 *                   in this section will actually drop when the enemy is 
 *                   defeated in battle. Defined as 1-in-X, X being the 
 *                   numerical value entered by the user (the smaller
 *                   the number, the bigger the chances).         
 * 
 *     Note 1: If this section is not filled at all, the enemy will drop 
 *     the default items defined for them in the database, at the
 *     probability defined there.
 * 
 *     Note 2: If this section is filled, but the items / weapons / armor
 *     sections are left as empty arrays ([]), the enemy will drop NOTHING
 *     at the defined level (not even the default items defined for them 
 *     in the database).
 * 
 * 
 * 16. Display Level? - Allows the user to determine whether the enemy's 
 *     name & level will be displayed above the enemy's sprite during 
 *     battle (true) or not (false).
 * 
 * 17. Level Display Format - If the user chose to display the enemy's name
 *     & level, this section allows him to define the textual format in 
 *     which to display them (as a string), where %1 is a placeholder for 
 *     the level, and %2 is a placeholder for the name.
 * 
 *     For example, this format: "Level %1 %2", will produce results such as:
 * 
 *     "Level 5 Goblin"
 *     "Level 12 Snake King"
 *     etc.
 * 
 * 
 * Definitions Per Enemy (ID)
 * --------------------------
 * The second part of the plugin's parameters contains level definitions for
 * SPECIFIC enemies (for example: Goblin) - i.e. by enemy ID. These 
 * definitions OVERRIDE the default / general definitions detailed in the
 * first part.  
 *
 * 
 * 18. Definitions Per Enemy - This section allows the user to define level
 *     parameters for enemies by their ID. The user can make multiple 
 *     definitions for different types of enemies. Sub-Parameters for each
 *     definition:
 * 
 *     18.1. Enemy - the ID of the enemy to whom the definition applies.
 * 
 *     18.2. Enemy Level Definitions - The level definitions for the chosen 
 *           enemy. 
 * 
 *           NOTE: The sub-parameters in this section are MOSTLY identical
 *           to the ones detailed in the default / general definitions
 *           ("Level Type", "Fixed Level", "By Party Levels", etc...). 
 *           The difference is that here, they apply only to the chosen 
 *           enemy.
 *              
 *           There are however three differences:
 * 
 *           18.2.1 In the "Level Type" article, an option was was added: 
 *                  "Original Value in DB". if the user chooses this option, 
 *                  the enemy's level WILL NOT BE MANIPULATED AT ALL, and 
 *                  instead will remain as defined in the RMMZ database.
 * 
 *           18.2.2. Images Per Level - a new sub-parameter, allowing the user
 *                   to define how the enemy will look during battle (the 
 *                   image used for their sprite) depending on their level. 
 *                   the user can make multiple definitions for different 
 *                   levels. Sub-parameters for each definition:
 * 
 *                   18.2.2.1. Enemy Level - A numerical value, indicating 
 *                             that starting from this level, the defined 
 *                             images (see next) are to be used as sprites for
 *                             this enemy in battle.
 * 
 *                   18.2.2.2. Front-View Image file - the file containing the 
 *                             enemy image to be used if the game is in 
 *                             front-view battle mode. Can only be chosen from
 *                             the img/enemies folder.
 * 
 *                   18.2.2.3. Side-View Image file - the file containing the 
 *                             enemy image to be used if the game is in 
 *                             side-view battle mode. Can only be chosen from
 *                             the img/sv_enemies folder.
 * 
 *           18.2.3. If the following sections are NOT filled:
 * 
 *                   "Skills Per Level"
 * 
 *                   "Traits Per Level"
 * 
 *                   "Drops Per Level"
 * 
 *                   Then the plugin will use the base definitions in the 
 *                   database.
 * 
 * 
 * NOTE: The manipulation of level parameters for ENEMY-INSTANCES (specific 
 * enemies in pecific battles) is applied through a plugin command, which is 
 * explained later (and not through the plugin's parameters).
 * 
 * 
 * Bonus & Penalty Definitions
 * ---------------------------
 * The third part of the plugin's parameters contains definitions for 
 * bonuses & penalties with which to modify enemy levels based on various 
 * conditions. This affords the user further flexibilty and more minute 
 * control over the application of enemy levels.
 * 
 * 19. Bonus/Penalty Definitions - This section allows the user to modify 
 *     enemy levels through the application of bonuses & penalties, based 
 *     on various parameters.
 * 
 *     Note: From here on, for brevity's sake, the explanations refer to
 *     'bonuses', which include 'penalties' as well (penalties being just 
 *     negative bonuses...) 
 * 
 *     Sub-parameters:
 * 
 *     19.1. Enemy Id Based Bonuses - This section allows the user to apply
 *           bonuses / penalties to enemy levels based on the enemy's ID.
 *           The user can create multiple definitins. Sub-parameters for each
 *           definition:
 * 
 *           19.1.1. enemy IDs - The IDs of the enemies to whom a 
 *                   bonus / penalty is to be granted.
 * 
 *                   NOTE: If no enemy IDs are entered here, the following 
 *                   bonus / penalty definitions will apply to ALL enemies in
 *                   the game. 
 * 
 *           19.1.2. Minimum Bonus - a numerical value indicating the minimum 
 *                   bonus / penalty to be granted to the chosen enemies. 
 *   
 *           19.1.3. Maximum Bonus - a numerical value indicating the maximum 
 *                   bonus / penalty to be granted to the chosen enemies.
 * 
 *                   Using the minimum and maximum bonus definitions, the user
 *                   can create a 'range' of values, from which the final 
 *                   bonus / penalty value will be chosen randomly. 
 * 
 *     19.2. Location Based Bonuses - This section allows the user to apply
 *           bonuses / penalties to enemy levels based on the enemy's location
 *           data (map ID, map difficulty, region ID). The user can create 
 *           multiple definitins. Sub-parameters for each definition:
 *   
 *           19.2.1. Map Based Bonuses - Allows the user to define game maps
 *                   (by their ID) in which to grant a bonus / penalty to 
 *                   enemy levels. The user can create multiple definitions. 
 *                   Sub-parameters for each definition:
 * 
 *                   19.2.1.1. Map IDs - The IDs of the game maps in which to
 *                             grant the bonus / penalty to enemy levels.
 * 
 *                   19.2.1.2. Enemy IDs - The IDs of enemies to whom the 
 *                             bonus / penalty is to be granted in the chosen
 *                             game maps.
 * 
 *                             NOTE: if this article is left EMPTY, the bonus
 *                             / penalty will be granted to ALL ENEMIES within
 *                             the chosen game maps.
 *                 
 *                   19.2.1.3. Minimum Bonus - a numerical value indicating 
 *                             the minimum bonus / penalty to be granted to 
 *                             enemy levels in the chosen game maps. 
 * 
 *                   19.2.1.4. Maximum Bonus - a numerical value indicating 
 *                             the maximum bonus / penalty to be granted to 
 *                             enemy levels in the chosen game maps. 
 * 
 *           19.2.2. Map Difficulty Based Bonuses - Allows the user to define 
 *                   bonuses / penalties to enemy level based on the 
 *                   difficulty level of the game map they are in (if such a
 *                   difficulty level is defined). The user can create 
 *                   multiple definitions. Sub-parameters for each 
 *                   definition:
 * 
 *                   19.2.2.1. Map Difficulty - The difficulty levels for 
 *                             which to grant the bonus / penalty to enemy 
 *                             levels (options are easy, medium, hard, very
 *                             hard, and hellscape).
 * 
 *                   19.2.2.2. Enemy IDs - The IDs of enemies to whom the 
 *                             bonus / penalty is to be granted if they are 
 *                             located in a game map whose difficulty level
 *                             matches one of the defined difficulty levels.
 * 
 *                             NOTE: if this article is left EMPTY, the bonus
 *                             / penalty will be granted to ALL ENEMIES within
 *                             such game maps.
 *                 
 *                   19.2.2.3. Minimum Bonus - a numerical value indicating 
 *                             the minimum bonus / penalty to be granted to 
 *                             enemy levels in such game maps. 
 * 
 *                   19.2.2.4. Maximum Bonus - a numerical value indicating 
 *                             the maximum bonus / penalty to be granted to 
 *                             enemy levels in such game maps. 
 * 
 *           19.2.3. Region Based Bonuses - Allows the user to define regions
 *                   (by their ID) in which to grant a bonus / penalty to 
 *                   enemy levels. The user can create multiple definitions. 
 *                   Sub-parameters for each definition:
 * 
 *                   19.2.3.1. Region IDs - The IDs of the regions in which to
 *                             grant the bonus / penalty to enemy levels.
 * 
 *                   19.2.3.2. Enemy IDs - The IDs of enemies to whom the 
 *                             bonus / penalty is to be granted in the chosen
 *                             regions.
 * 
 *                             NOTE: if this article is left EMPTY, the bonus
 *                             / penalty will be granted to ALL ENEMIES within
 *                             the chosen regions.
 *                 
 *                   19.2.3.3. Minimum Bonus - a numerical value indicating 
 *                             the minimum bonus / penalty to be granted to 
 *                             enemy levels in the chosen regions. 
 * 
 *                   19.2.3.4. Maximum Bonus - a numerical value indicating 
 *                             the maximum bonus / penalty to be granted to 
 *                             enemy levels in the chosen regions. 
 * 
 *     19.3. Weather Based Bonuses - This section allows the user to define 
 *           bonuses / penalties to enemy levels based on weather conditions
 *           (type & power) such as rain, storm, etc. The user can create 
 *           multiple definitions. Sub-parameters for each definition:
 * 
 *           19.3.1. Weather Type - Strings indicating the types of weather 
 *                   for which bonuses / penalties to enemy levels are to be 
 *                   granted. RMMZ built-in options include "rain", "storm" &
 *                   "snow", but customized options can be added and used as 
 *                   well (if they are defined in the same format as the 
 *                   built-in options).
 * 
 *           19.3.2. Weather Power - Numerical values indicating the intensity 
 *                   of the chosen weather conditions. If the power of a 
 *                   chosen weather type is equal to or greater than the
 *                   defined values, it triggers a bonus / penalty. Usable 
 *                   values for this article are between 1 (weakest) and 40 
 *                   (strongest). 
 * 
 *           19.3.3. Enemy IDs - The IDs of enemies to whom the bonus / 
 *                   penalty is to be granted if the defined weather
 *                   conditions are met.
 * 
 *                   NOTE: if this article is left EMPTY, and weather 
 *                   conditions are met, the bonus / penalty will be granted 
 *                   to ALL ENEMIES.
 *                 
 *           19.3.4. Minimum Bonus - a numerical value indicating the minimum 
 *                   bonus / penalty to be granted to enemy levels if weather 
 *                   conditions are met. 
 * 
 *           19.3.4. Maximum Bonus - a numerical value indicating the maximum 
 *                   bonus / penalty to be granted to enemy levels if weather 
 *                   conditions are met. 
 * 
 *     19.4. Variable Based Bonuses - This section allow the user to grant 
 *           bonuses / penalties to enemy levels based on the value of a game 
 *           variable. The user can create multiple definitions. 
 *           Sub-parameters for each definition:
 * 
 *           19.4.1. Variable - A numerical value indicating the ID of the 
 *                   game variable whose value is to determine the bonus / 
 *                   penalty.
 * 
 *           19.4.2. Enemy IDs - The IDs of enemies to whom the bonus / 
 *                   penalty is to be granted.
 * 
 *                   NOTE: if this article is left EMPTY, the bonus / penalty
 *                   will be granted to ALL ENEMIES.
 * 
 *     19.5. Item Based Bonuses - This section allows the user to grant 
 *           bonuses / penalties to enemy levels based on the existence of 
 *           certain items (i.e. items, weapons or armor pieces) in the game
 *           party's inventory. The user can create multiple definitions. 
 *           Sub-parameters for each definition:
 * 
 *           19.5.1. Items - IDs of items that grant a bonus / penalty to 
 *                   enemy levels if found in the game party's inventory.
 * 
 *           19.5.2. Weapons - IDs of weapons that grant a bonus / penalty to 
 *                   enemy levels if found in the game party's inventory.
 * 
 *           19.5.3. Armor Pieces - IDs of armor pieces that grant a bonus / 
 *                   penalty to enemy levels if found in the game party's 
 *                   inventory.
 * 
 *           19.5.4. Enemy IDs - The IDs of enemies to whom the bonus / 
 *                   penalty is to be granted if the defined items are found
 *                   in the game party's inventory.
 * 
 *                   NOTE: if this article is left EMPTY, and item conditions
 *                   are met, the bonus / penalty will be granted to ALL 
 *                   ENEMIES.
 *                 
 *           19.5.5. Minimum Bonus - a numerical value indicating the minimum 
 *                   bonus / penalty to be granted to enemy levels if item
 *                   conditions are met. 
 * 
 *           19.5.6. Maximum Bonus - a numerical value indicating the maximum 
 *                   bonus / penalty to be granted to enemy levels if item 
 *                   conditions are met. 
 *
 *     19.6. Party Composition Based Bonuses - This section allows the user to
 *           grant bonuses / penalties to enemy levels if members of certain
 *           defined classes (such as knight, sorcerer, cleric etc.) are in 
 *           the game party. The user can create multiple definitions. 
 *           Sub-parameters for each definition:
 * 
 *           19.6.1. Classes - the IDs of the classes that grant a bonus / 
 *                   penalty to enemy levels if members of these classes are 
 *                   in the game party.
 * 
 *           19.6.3. Enemy IDs - The IDs of enemies to whom the bonus / 
 *                   penalty is to be granted if the game party contains 
 *                   members of the chosen classes.
 * 
 *                   NOTE: if this article is left EMPTY, and class conditions
 *                   are met, the bonus / penalty will be granted to ALL 
 *                   ENEMIES.
 *                 
 *           19.5.5. Minimum Bonus - a numerical value indicating the minimum 
 *                   bonus / penalty to be granted to enemy levels if class
 *                   conditions are met. 
 * 
 *           19.5.6. Maximum Bonus - a numerical value indicating the maximum 
 *                   bonus / penalty to be granted to enemy levels if class 
 *                   conditions are met.
 * 
 * 
 * Plugin command "Enemy Instance Level Definitions" Explained:
 * ------------------------------------------------------------
 * This plugin command allows the user to define level parameters for
 * ENEMY-INSTANCES, i.e. specific enemies in specific battles. 
 * These definitions override enemy ID-based definitions and the
 * default / general definitions. 
 * 
 * 
 * How to use it:
 * ++++++++++++++
 * 1. Place the command in the event's contents, before the battle processing 
 *    command.
 * 
 * 2. Fill out the command's arguments.
 * 
 * 
 * Explanation of the command's arguments:
 * +++++++++++++++++++++++++++++++++++++++
 * 1. Instance Definitions - This section allows the user to define level 
 *    parameters for enemy instances in the specific battle-event it is 
 *    placed in. The user can create multiple definitions, one for each
 *    enemy in the troop. Sub-parameters for each definition:
 * 
 *    1.1. Enemy Index - The index in the enemy troop of the specific enemy
 *         to whom the following level efinition applies (index 0 is the first
 *         enemy, 1 is the second enemy, etc.)
 * 
 *    1.2. Enemy Definitions - A set of level definitions for this enemy
 *         (or enemies). Sub-parameters are IDENTICAL to the ones used
 *         for enemy ID-based definitions, and therefore will not be 
 *         explained again:
 * 
 *         1.2.1. Level Type.
 * 
 *         1.2.2. Fixed Level.
 * 
 *         1.2.3. By Party Levels.
 * 
 *         1.2.4. Game Variable.
 * 
 *         1.2.5. Positive Level Variance.
 *  
 *         1.2.6. Negative Level Variance.
 * 
 *         1.2.7. Minimum Level.
 * 
 *         1.2.8. Maximum Level.
 * 
 *         1.2.9. Stat Increase Type.
 * 
 *         1.2.10. Relative Stat Increase.
 * 
 *         1.2.11. Flat Stat Increase.
 * 
 *         1.2.12. Skills Per Level.
 * 
 *                 NOTE: if this article is not filled, the plugin will use 
 *                 the base definitions in the database.
 * 
 *         1.2.13. Traits Per Level.
 *                 NOTE: Same as "Skills Per Level".
 * 
 *         1.2.14. Drops Per Level.
 *                 NOTE 1: Same as "Skills Per Level".
 * 
 *                 NOTE 2: If this article is filled, but the items / weapons
 *                 / armor sections are left as empty arrays ([]), the enemy
 *                 will drop NOTHING at the defined level (not even the 
 *                 default items defined for them in the database).
 * 
 *         1.2.15. Images Per Level.
 *                 NOTE: Same as "Skills Per Level".
 *          
 * 
 * Plugin command "Change Enemy Levels Mid-Battle" Explained:
 * ----------------------------------------------------------
 * This plugin command allows the user to change (decrease or increase)
 * enemy levels mid-battle, if certain conditions are met. Current
 * options for triggering a level-change include:
 * 
 * 1. After X turns (X defined by the user).
 * 
 * 2. Once one member of the game party, or all members of the game
 *    party, reach a certain HP threshold (defined by the user).
 * 
 * 3. Once one enemy in the enemy troop, or all enemies in the enemy
 *    troop, reach a certain HP threshold (defined by the user)
 * 
 * How to use it:
 * ++++++++++++++
 * 1. Place the command in the event's contents, before the battle processing 
 *    command (and after the "Enemy Instance Level Definitions" plugin 
 *    command, if that command is used).
 * 
 * 2. Fill out the command's arguments.
 * 
 * 
 * Explanation of the command's arguments:
 * +++++++++++++++++++++++++++++++++++++++
 * 1. Level Change Definitions - This section allows the user to define 
 *    conditions for a change in the enemy's level during battle, and the
 *    parameters of the consequent change. The user can create multiple 
 *    definitions. Sub-parameters for each definition:
 * 
 *    1.1. Enemy Indices - The indices in the enemy troop of the specific 
 *         enemies that are to be affected by the level change (index 0
 *         for the first enemy, 1 for the second enemy, etc.)
 * 
 *         NOTE: if this article is left empty, then ALL enemies in the
 *         enemy troop will be affected by the level change.
 * 
 *    1.2. When to Change Enemy Levels - This is where you define the 
 *         condition to trigger a mid-battle level change. Options are:
 *     
 *         (1) After X turns (X defined separately).
 * 
 *         (2) When at least one enemy's HP is below Y (Y defined separately).
 * 
 *         (3) When all enemies' HP is below Y (Y defined separately).
 * 
 *         (4) When at least one actor's HP is below Y (Y defined separately).
 * 
 *         (5) When all actors' HP is below Y (Y defined separately).
 * 
 *    1.3. Minimum Turns - If the chosen condition for enemy level-change is
 *         "After X turns", this is where you define the minimum number of
 *         turns to trigger a level change.
 * 
 *    1.4. Maximum Turns - If the chosen condition for enemy level-change is
 *         "After X turns", this is where you define the maximum number of
 *         turns to trigger a level change.
 * 
 *         NOTE: The use of minimum and maximum turns allows the user to 
 *         create a 'range' of options from which the final number of
 *         turns will be randomly selected, thereby creating variance.
 * 
 *    1.5. Hp Threshold - If the chosen condition for enemy level-change is
 *         one of those that require an HP threshold (Y), this is where you
 *         define what type of threshold it will be. Options are:
 *         
 *         (1) Fixed Value - A number indicating the HP threshold.
 * 
 *         (2) Percentage of Max HP - a number between 1 and 100, 
 *             indicating a threshold that is relative to (= a percentage
 *             of) the enemy's Max HP value.
 * 
 *    1.6. HP Fixed Threshold Minimum - If the chosen type of HP threshold
 *         is "Fixed Value", this is where you define the minimum value of
 *         HP to trigger a level change.
 * 
 *    1.7. HP Fixed Threshold Maximum - If the chosen type of HP threshold
 *         is "Fixed Value", this is where you define the maximum value of
 *         HP to trigger a level change.
 * 
 *         NOTE: The use of minimum and maximum values allows the user to 
 *         create a 'range' of options from which the final value for the
 *         HP threshold will be randomly selected, thereby creating 
 *         variance.
 * 
 *    1.8. HP % Threshold Minimum - If the chosen type of HP threshold
 *         is "Percentage of Max HP", this is where you define the minimum
 *         percentage to trigger a level change.
 *  
 *    1.9. HP % Threshold Maximum - If the chosen type of HP threshold
 *         is "Percentage of Max HP", this is where you define the maximum
 *         percentage to trigger a level change.
 *  
 *         NOTE: The use of minimum and maximum percentage allows the user to 
 *         create a 'range' of options from which the final value for the
 *         HP threshold will be randomly selected.
 * 
 *    1.10. Decrease or Increase - This is where you define whether the 
 *          level-change will decrease or increase the enemy's level.
 * 
 *    1.11. Minimum Level Change - The minimum value by which to change the 
 *          enemy's level.
 * 
 *    1.12. Maximum Level Change - The maximum value by which to change the 
 *          enemy's level.
 * 
 *          NOTE: The use of minimum and maximum values allows the user to 
 *          create a 'range' of options from which the final value for the
 *          level change will be randomly selected.
 *         
 * 
 * How to Create Skills & Items That Change Enemy Levels Mid-Battle:
 * -----------------------------------------------------------------
 * (1) This plugin allows for the creation of items and skills that can 
 *     be used in-game by the player's party to reduce enemy levels 
 *     mid-battle (and therefore be used as an offensive ability). 
 * 
 * (2) These items and skills can either be successfully applied, or they
 *     can fail, depending on their other definitions in the RMMZ editor, 
 *     the defensive strengths and weaknesses of the enemy, etc. For example:
 * 
 *     if the skill type was defined as "Magic", with a success rate of
 *     50%, and the enemy on whom it is applied has a strong magic defense,
 *     or a high evasion rate, etc. - the skill's effect might be blocked 
 *     or evaded by the enemy. 
 * 
 *     The plugin allows the user to trigger action in a cases of failure as 
 *     well, to create THE EFFECT OF THE SKILL OR ITEM "BACKFIRING" (see 
 *     later).
 * 
 * (3) The plugin displays a message to the player, informing them of the 
 *     success (in green font) or failure (in red font) of the action, and
 *     the resultant level change (decrease or increase), if there was one. 
 * 
 * (4) The creation of these items or skills is done by adding metadata 
 *     definitions in the "Note" window of the item / skill in the RMMZ 
 *     editor:
 * 
 * 
 * Mandatory Definitions:
 * ++++++++++++++++++++++
 * 1. First you need to define the type of level reduction to be performed
 *    by the item / skill. 
 * 
 *    It can be a "flat" reduction of a fixed value (for example: 
 *    decreasing enemy level by 2). In that case, you need to write:
 * 
 *    <decrease level: flat>
 * 
 *    Or, it can be a "relative" reduction - a percentage of the enemy's 
 *    current level (for example: decreasing enemy level by 25%). If that
 *    is the required condition, you need to write:
 *  
 *    <decrease level: relative>
 * 
 * 2. Next, you need to define the amount or percentage by which to reduce
 *    enemy level, depending on your choice in the previous article.
 * 
 *    If you chose to reduce enemy level by a fixed value ("flat"), then 
 *    you need to write:
 * 
 *    <flat: value> 
 * 
 *    where instead of the 'value' placeholder you enter 
 *    a number. for example: <flat: 2> will reduce enemy level by 2.
 * 
 *    However, if you chose to reduce enemy level by a percentage of its
 *    current value ("relative"), you need to write:
 * 
 *    <relative: value> 
 * 
 *    where instead of the 'value' placeholder you enter 
 *    a number between 1 and 100, representing a percentage. for example: 
 *    <relative: 25> will reduce enemy level by 25%. *  
 * 
 * Optional Definitions:
 * +++++++++++++++++++++
 * 3. If you want to introduce variance into the process of determining the
 *    value of the level change, you can define positive and negative 
 *    variance values, like this:
 * 
 *    <positive variance: value>
 *    <negative variance: value> 
 *      
 *    where instead of the 'value' placeholders you enter numbers.
 * 
 *    Let's say the initial value for level change was determined as 3, the
 *    positive variance value is 1, and the negative variance value is 2.
 *    the final value of the level change will be randomly selected from a 
 *    range between 1 (3 - 2) and 4 (3 + 1).
 * 
 * 4. As mentioned earlier, the Application of an item or a skill can fail, 
 *    depending on various parameters. If you want to create the effect of
 *    the item / skill "backfiring" (= "punish" the player for the failure),
 *    you can define that in case of failure, the enemy's level will INCREASE
 *    by the computed value, INSTEAD OF DECREASING. to do that, add:
 * 
 *    <if fail: increase> 
 * 
 * 
 * FINAL NOTE: other definitions regarding the item / skill's scope (one 
 * enemy or all), effectiveness, visual effects etc. - are done in the
 * RMMZ editor just like you would do for any other item or skill.
 */
/*~struct~locationBasedParams:
 * @param mapId
 * @text By Map ID:
 * @type struct<mapIdParams>[]
 * @desc Define how enemy levels are determined in specific game maps.
 *
 * @param mapDifficulty
 * @text By Map Difficulty:
 * @type struct<mapDifficultyParams>[]
 * @desc Define how enemy levels are determined by a game map's difficulty level (overrides map ID Definitions).
 *
 * @param regionId
 * @text By Region ID:
 * @type struct<regionIdParams>[]
 * @desc Define how enemy levels are determined in specific regions (overrides map ID and map Difficulty Definitions).
 */
/*~struct~mapIdParams:
 * @param ids
 * @text Map IDs:
 * @type number[]
 * @desc Enter the Ids of the game maps for which to define parameters for enemy levels.
 * @min 0
 * @max 100000000000000
 *
 * @param levelType
 * @text Level Type:
 * @type select
 * @desc Define the method by which to determine enemy levels in the chosen game maps.
 * @option Fixed Value
 * @value fixedValue
 * @option Based on Party Levels
 * @value partyLevels
 * @option Based on a Game Variable
 * @value gameVariable
 * @default partyLevels
 *
 * @param fixedLevel
 * @text Fixed Level:
 * @type number
 * @desc Enter a number to be used as a fixed value for the level of enemies in the chosen game maps.
 * @min 1
 * @max 10000000
 * @default 1
 *
 * @param partyLevels
 * @text By Party Levels:
 * @type select
 * @desc Choose a metric of the party members' levels to be used as the level of enemies in the chosen game maps.
 * @option Highest Level of Party Members
 * @value partyHighest
 * @option Average Level of Party Members
 * @value partyAverage
 * @option Lowest Level of Party Members
 * @value partyLowest
 * @option Highest Level of the Battling Party Members
 * @value battlingHighest
 * @option Average Level of the Battling Party Members
 * @value battlingAverage
 * @option Lowest Level of the Battling Party Members
 * @value battlingLowest
 * @default battlingAverage
 *
 * @param gameVariable
 * @text Game Variable:
 * @desc Specify the game variable whose value is to be used as the level of enemies in the chosen game maps.
 * @type variable
 * @min 0
 * @max 100000000000000000
 * @default 1000
 */
/*~struct~mapDifficultyParams:
 * @param difficultyLevels
 * @text Map Difficulty Levels:
 * @type select[]
 * @desc Select the difficulty levels of the game maps for which to define parameters for enemy levels.
 * @option Easy
 * @value easy
 * @option Medium
 * @value medium
 * @option Hard
 * @value hard
 * @option Very Hard
 * @value very hard
 * @option Hellscape
 * @value hellscape
 *
 * @param levelType
 * @text Level Type:
 * @type select
 * @desc Define the method by which to determine enemy levels in the relevant game maps.
 * @option Fixed Value
 * @value fixedValue
 * @option Based on Party Levels
 * @value partyLevels
 * @option Based on a Game Variable
 * @value gameVariable
 * @default partyLevels
 *
 * @param fixedLevel
 * @text Fixed Level:
 * @type number
 * @desc Enter a number to be used as a fixed value for the level of enemies in the relevant game maps.
 * @min 1
 * @max 10000000
 * @default 1
 *
 * @param partyLevels
 * @text By Party Levels:
 * @type select
 * @desc Choose a metric of the party members' levels to be used as the level of enemies in the relevant game maps.
 * @option Highest Level of Party Members
 * @value partyHighest
 * @option Average Level of Party Members
 * @value partyAverage
 * @option Lowest Level of Party Members
 * @value partyLowest
 * @option Highest Level of the Battling Party Members
 * @value battlingHighest
 * @option Average Level of the Battling Party Members
 * @value battlingAverage
 * @option Lowest Level of the Battling Party Members
 * @value battlingLowest
 * @default battlingAverage
 *
 * @param gameVariable
 * @text Game Variable:
 * @desc Specify the game variable whose value is to be used as the level of enemies in the relevant game maps.
 * @type variable
 * @min 0
 * @max 100000000000000000
 * @default 1000
 */
/*~struct~regionIdParams:
 * @param regionIds
 * @text Region IDs:
 * @type number[]
 * @desc Enter the Ids of the regions for which to define parameters for enemy levels.
 * @min 1
 * @max 255
 *
 * @param levelType
 * @text Level Type:
 * @type select
 * @desc Define the method by which to determine enemy levels in the chosen regions.
 * @option Fixed Value
 * @value fixedValue
 * @option Based on Party Levels
 * @value partyLevels
 * @option Based on a Game Variable
 * @value gameVariable
 * @default partyLevels
 *
 * @param fixedLevel
 * @text Fixed Level:
 * @type number
 * @desc Enter a number to be used as a fixed value for the level of enemies in the chosen regions.
 * @min 1
 * @max 10000000
 * @default 1
 *
 * @param partyLevels
 * @text By Party Levels:
 * @type select
 * @desc Choose a metric of the party members' levels to be used as the level of enemies in the chosen regions.
 * @option Highest Level of Party Members
 * @value partyHighest
 * @option Average Level of Party Members
 * @value partyAverage
 * @option Lowest Level of Party Members
 * @value partyLowest
 * @option Highest Level of the Battling Party Members
 * @value battlingHighest
 * @option Average Level of the Battling Party Members
 * @value battlingAverage
 * @option Lowest Level of the Battling Party Members
 * @value battlingLowest
 * @default battlingAverage
 *
 * @param gameVariable
 * @text Game Variable:
 * @desc Specify the game variable whose value is to be used as the level of enemies in the chosen regions.
 * @type variable
 * @min 0
 * @max 100000000000000000
 * @default 1000
 */
/*~struct~relativeStatIncreaseParams:
 * @param maxHp
 * @text Max HP (Hit Points):
 * @type number
 * @desc Define the rate (in percents) by which to increase the enemy's max HP (maximum hit points) stat per level.
 * @default 0
 * @min 0
 * @max 100
 *
 * @param maxMp
 * @text Max MP (Magic Points):
 * @type number
 * @desc Define the rate (in percents) by which to increase the enemy's max MP (maximum magic points) stat per level.
 * @default 0
 * @min 0
 * @max 100
 *
 * @param atk
 * @text ATK (Attack):
 * @type number
 * @desc Define the rate (in percents) by which to increase the enemy's ATK (attack) stat per level.
 * @default 0
 * @min 0
 * @max 100
 *
 * @param def
 * @text DEF (Defense):
 * @type number
 * @desc Define the rate (in percents) by which to increase the enemy's DEF (defense) stat per level.
 * @default 0
 * @min 0
 * @max 100
 *
 * @param mat
 * @text MAT (Magic Attack):
 * @type number
 * @desc Define the rate (in percents) by which to increase the enemy's MAT (magic attack) stat per level.
 * @default 0
 * @min 0
 * @max 100
 *
 * @param mdf
 * @text MDF (Magic Defense):
 * @type number
 * @desc Define the rate (in percents) by which to increase the enemy's MDF (magic defense) stat per level.
 * @default 0
 * @min 0
 * @max 100
 *
 * @param agi
 * @text AGI (Agility):
 * @type number
 * @desc Define the rate (in percents) by which to increase the enemy's AGI (agility) stat per level.
 * @default 0
 * @min 0
 * @max 100
 *
 * @param luk
 * @text LUK (Luck):
 * @type number
 * @desc Define the rate (in percents) by which to increase the enemy's LUK (luck) stat per level.
 * @default 0
 * @min 0
 * @max 100
 *
 * @param exp
 * @text EXP (Experince Points):
 * @type number
 * @desc Define the rate (in percents) by which to increase the enemy's EXP (experience points rewarded) stat per level.
 * @default 0
 * @min 0
 * @max 100
 *
 * @param gold
 * @text Gold:
 * @type number
 * @desc Define the rate (in percents) by which to increase the enemy's gold amount (dropped when defeated) per level.
 * @default 0
 * @min 0
 * @max 100
 */
/*~struct~flatStatIncreaseParams:
 * @param maxHp
 * @text Max HP (Hit Points):
 * @type number
 * @desc Define the flat rate by which to increase the enemy's max HP (maximum hit points) stat per level.
 * @default 0
 * @min 0
 * @max 100000000000000000
 *
 * @param maxMp
 * @text Max MP (Magic Points):
 * @type number
 * @desc Define the flat rate by which to increase the enemy's max MP (maximum magic points) stat per level.
 * @default 0
 * @min 0
 * @max 100000000000000000
 *
 * @param atk
 * @text ATK (Attack):
 * @type number
 * @desc Define the flat rate by which to increase the enemy's ATK (attack) stat per level.
 * @default 0
 * @min 0
 * @max 100000000000000000
 *
 * @param def
 * @text DEF (Defense):
 * @type number
 * @desc Define the flat rate by which to increase the enemy's DEF (defense) stat per level.
 * @default 0
 * @min 0
 * @max 100000000000000000
 *
 * @param mat
 * @text MAT (Magic Attack):
 * @type number
 * @desc Define the flat rate by which to increase the enemy's MAT (magic attack) stat per level.
 * @default 0
 * @min 0
 * @max 100000000000000000
 *
 * @param mdf
 * @text MDF (Magic Defense):
 * @type number
 * @desc Define the flat rate by which to increase the enemy's MDF (magic defense) stat per level.
 * @default 0
 * @min 0
 * @max 100000000000000000
 *
 * @param agi
 * @text AGI (Agility):
 * @type number
 * @desc Define the flat rate by which to increase the enemy's AGI (agility) stat per level.
 * @default 0
 * @min 0
 * @max 100000000000000000
 *
 * @param luk
 * @text LUK (Luck):
 * @type number
 * @desc Define the flat rate by which to increase the enemy's LUK (luck) stat per level.
 * @default 0
 * @min 0
 * @max 100000000000000000
 *
 * @param exp
 * @text EXP (Experince Points):
 * @type number
 * @desc Define the flat rate by which to increase the enemy's EXP (experience points rewarded when defeated) stat per level.
 * @default 0
 * @min 0
 * @max 100000000000000000
 *
 * @param gold
 * @text Gold:
 * @type number
 * @desc Define the flat rate by which to increase the enemy's gold amount (dropped when defeated) per level.
 * @default 0
 * @min 0
 * @max 100000000000000000
 */
/*~struct~skillsPerLevelParams:
 * @param level
 * @text Level:
 * @desc Define the level in which the enemy gains the chosen skills.
 * @type number
 * @min 1
 * @max 1000000000000000
 * @default 1
 *
 * @param skills
 * @text Skills (Indices):
 * @desc Enter the indices (in the enemy's skills list in the RMMZ editor) of skills the enemy gains at the defined level.
 * @type number[]
 * @default []
 * @min 0
 * @max 10000000000000
 */
/*~struct~traitsPerLevelParams:
 * @param level
 * @text Level:
 * @desc Define the level in which the enemy gains the chosen traits.
 * @type number
 * @min 1
 * @max 10000000000000
 *
 * @param traits
 * @text Traits (Indices):
 * @desc Enter the indices (in the enemy's traits list in the RMMZ editor) of traits the enemy gains at the defined level.
 * @type number[]
 * @default []
 * @min 0
 * @max 10000000000000
 */
/*~struct~dropsPerLevelParams:
 * @param level
 * @text Level:
 * @desc Define the level in which the enemy drops the chosen items.
 * @type number
 * @min 1
 * @max 10000000000000
 *
 * @param itemsToDrop
 * @text Items:
 * @type struct<itemsToDropParams>[]
 * @desc Define the items that the enemy can drop at the defined level, and the probability of the drop.
 */
/*~struct~itemsToDropParams:
 * @param items
 * @text Item(s):
 * @desc Select item(s) that the enemy can drop at this level.
 * @type item[]
 *
 * @param weapons
 * @text Weapon(s):
 * @desc Select weapon(s) that the enemy can drop at this level.
 * @type weapon[]
 *
 * @param armor
 * @text Armor:
 * @desc Select armor pieces that the enemy can drop at this level.
 * @type armor[]
 *
 * @param probability
 * @text Probability:
 * @desc Define the probability of the enemy dropping the selected items as 1-in-X (X being the number you enter here).
 * @type number
 * @min 1
 * @max 1000000000000
 * @default 5
 */
/*~struct~definitionsPerEnemyParams:
 * @param enemyId
 * @text Enemy:
 * @desc Choose the enemy (ID) for which to define dedicated level parameters.
 * @type enemy
 *
 * @param enemyLevelDefinitions
 * @text Enemy Level Definitions
 * @desc Define the parameters for the chosen enemy's level.
 * @type struct<enemyLevelDefinitionsParams>
 */
/*~struct~enemyLevelDefinitionsParams:
 * @param levelType
 * @text Level Type
 * @type select
 * @desc Define the method by which to determine this enemy's level.
 * @option Original Value in DB
 * @value static
 * @option Fixed Value
 * @value fixedValue
 * @option Based on Party Levels
 * @value partyLevels
 * @option Based on a Game Variable
 * @value gameVariable
 * @option Determined by Location Parameters
 * @value locationBased
 * @default partyLevels
 *
 * @param fixedLevel
 * @text Fixed Level
 * @type number
 * @desc Enter a number to be used as a fixed value for this enemy's level.
 * @min 1
 * @max 10000000
 * @default 1
 *
 * @param partyLevels
 * @text By Party Levels
 * @type select
 * @desc Choose a metric of the party members' levels to be used as this enemy's level.
 * @option Highest Level of Party Members
 * @value partyHighest
 * @option Average Level of Party Members
 * @value partyAverage
 * @option Lowest Level of Party Members
 * @value partyLowest
 * @option Highest Level of the Battling Party Members
 * @value battlingHighest
 * @option Average Level of the Battling Party Members
 * @value battlingAverage
 * @option Lowest Level of the Battling Party Members
 * @value battlingLowest
 * @default battlingAverage
 *
 * @param gameVariable
 * @text Game Variable
 * @desc Specify the game variable whose value is to be used as this enemy's level.
 * @type variable
 * @min 0
 * @max 100000000000000000
 * @default 1000
 *
 * @param locationBased
 * @text Locations Based
 * @desc Determine this enemy's level based on their location parameters.
 * @type struct<locationBasedParams>
 *
 * @param positiveVariance
 * @text Positive Level Variance:
 * @type number
 * @desc Define the positive variance value for this enemy's level.
 * @min 0
 * @max 1000000000000000000000
 * @default 0
 *
 * @param negativeVariance
 * @text Negative Level Variance:
 * @type number
 * @desc Define the negative variance value for this enemy's level.
 * @min 0
 * @max 1000000000000000000000
 * @default 0
 *
 * @param minLevel
 * @text Minimum Level
 * @desc Define this enemy's minimum level.
 * @type number
 * @min 1
 * @max 10000000000000
 * @default 1
 *
 * @param maxLevel
 * @text Maximum Level
 * @desc Define this enemy's maximum level.
 * @type number
 * @min 1
 * @max 10000000000000
 * @default 100
 *
 * @param statIncreaseType
 * @text Stat Increase Type
 * @desc Define the method by which to increase this enemy's stats per level (flat, relative, or a combination of both).
 * @type select
 * @option Relative
 * @value relative
 * @option Flat
 * @value flat
 * @option A Combination of Both
 * @value relativeAndFlat
 * @default relative
 *
 * @param relativeStatIncrease
 * @text Relative Stat Increase
 * @desc Define the relative rate by which to increase this enemy's stats per level.
 * @type struct<relativeStatIncreaseParams>
 *
 * @param flatStatIncrease
 * @text Flat Stat Increase
 * @desc Define the flat rate by which to increase this enemy's stats per level.
 * @type struct<flatStatIncreaseParams>
 *
 * @param skillsPerLevel
 * @text Skills Per Level
 * @desc Define which skills this enemy gains per level.
 * @type struct<skillsPerLevelParams>[]
 *
 * @param traitsPerLevel
 * @text Traits Per Level
 * @desc Define which traits this enemy gains per level.
 * @type struct<traitsPerLevelParams>[]
 *
 * @param dropsPerLevel
 * @text Drops Per Level
 * @desc Define which items (items / weapons / armor) this enemy drops per level.
 * @type struct<dropsPerLevelParams>[]
 *
 * @param imagesPerLevel
 * @text Images Per Level
 * @desc Define what this enemy looks like in battle (the image used) based on their level.
 * @type struct<imagesPerLevelParams>[]
 */
/*~struct~imagesPerLevelParams:
 * @param enemyLevel
 * @text Enemy Level:
 * @desc Define the enemy level in which to start using the chosen image.
 * @type number
 * @min 1
 *
 * @param frontViewImageFile
 * @text Front-View Image File:
 * @desc Choose an image to be used in front-view battle (from img/enemies folder only!).
 * @type file
 *
 * @param sideViewImageFile
 * @text Side-View Image File:
 * @desc Choose an image to be used in side-view battle (from img/sv_enemies folder only!).
 * @type file
 */
/*~struct~enemyInstanceDefinitionsParams:
 * @param enemyIndex
 * @text Enemy Index:
 * @desc Enter the index in the enemy troop of the specific enemy instance for which to define level parameters.
 * @type number
 * @min 0
 * @default 0
 *
 * @param enemyDefinitions
 * @text Enemy Definitions
 * @desc Define level parameters for this specific enemy instance.
 * @type struct<enemyDefinitionsParams>
 */
/*~struct~enemyDefinitionsParams:
 * @param levelType
 * @text Level Type
 * @type select
 * @desc Define the method by which to determine the level for this enemy instance.
 * @option Original Value in DB
 * @value static
 * @option Fixed Value
 * @value fixedValue
 * @option Based on Party Levels
 * @value partyLevels
 * @option Based on a Game Variable
 * @value gameVariable
 * @default partyLevels
 *
 * @param fixedLevel
 * @text Fixed Level
 * @type number
 * @desc Enter a number to be used as a fixed value for the level of this enemy instance.
 * @min 1
 * @max 10000000
 * @default 1
 *
 * @param partyLevels
 * @text By Party Levels
 * @type select
 * @desc Choose a metric of the party members' levels to be used as the level of this enemy instance.
 * @option Highest Level of Party Members
 * @value partyHighest
 * @option Average Level of Party Members
 * @value partyAverage
 * @option Lowest Level of Party Members
 * @value partyLowest
 * @option Highest Level of the Battling Party Members
 * @value battlingHighest
 * @option Average Level of the Battling Party Members
 * @value battlingAverage
 * @option Lowest Level of the Battling Party Members
 * @value battlingLowest
 * @default battlingAverage
 *
 * @param gameVariable
 * @text Game Variable
 * @desc Specify the game variable whose value is to be used as the level of this enemy instance.
 * @type variable
 * @min 0
 * @max 100000000000000000
 * @default 1000
 *
 * @param positiveVariance
 * @text Positive Level Variance:
 * @type number
 * @desc Define the positive variance value for the level of this enemy instance.
 * @min 0
 * @max 1000000000000000000000
 * @default 0
 *
 * @param negativeVariance
 * @text Negative Level Variance:
 * @type number
 * @desc Define the negative variance value for the level of this enemy instance.
 * @min 0
 * @max 1000000000000000000000
 * @default 0
 *
 * @param minLevel
 * @text Minimum Level
 * @desc Define the minimum level for this enemy instance.
 * @type number
 * @min 1
 * @max 10000000000000
 * @default 1
 *
 * @param maxLevel
 * @text Maximum Level
 * @desc Define the maximum level for this enemy instance.
 * @type number
 * @min 1
 * @max 10000000000000
 * @default 100
 *
 * @param statIncreaseType
 * @text Stat Increase Type
 * @desc Define the method by which to increase this enemy instance's stats per level (flat / relative / both).
 * @type select
 * @option Relative
 * @value relative
 * @option Flat
 * @value flat
 * @option A Combination of Both
 * @value relativeAndFlat
 * @default relative
 *
 * @param relativeStatIncrease
 * @text Relative Stat Increase
 * @desc Define the relative rate by which to increase this enemy instance's stats per level.
 * @type struct<relativeStatIncreaseParams>
 *
 * @param flatStatIncrease
 * @text Flat Stat Increase
 * @desc Define the flat rate by which to increase this enemy instance's stats per level.
 * @type struct<flatStatIncreaseParams>
 *
 * @param skillsPerLevel
 * @text Skills Per Level
 * @desc Define which skills this enemy instance gains per level.
 * @type struct<skillsPerLevelParams>[]
 *
 * @param traitsPerLevel
 * @text Traits Per Level
 * @desc Define which traits this enemy instance gains per level.
 * @type struct<traitsPerLevelParams>[]
 *
 * @param dropsPerLevel
 * @text Drops Per Level
 * @desc Define what items this enemy instance drops per level.
 * @type struct<dropsPerLevelParams>[]
 *
 * @param imagesPerLevel
 * @text Images Per Level
 * @desc Define what this enemy instance looks like in battle (the image used) based on their level.
 * @type struct<imagesPerLevelParams>[]
 */
/*~struct~levelBonusesParams:
 * @param enemyIdBasedBonuses
 * @text Enemy ID Based Bonuses:
 * @desc Define enemies (IDs) to grant a level bonus / penalty to.
 * @type struct<enemyIdBasedBonusesParams>[]
 *
 * @param locationBasedBonuses
 * @text Location Based Bonuses:
 * @desc Define location parameters (map ID, map difficulty or region ID) that grant a bonus / penalty to enemy level.
 * @type struct<locationBasedBonusesParams>
 *
 * @param weatherBasedBonuses
 * @text Weather Based Bonuses:
 * @desc Define weather conditions (type & power) in which to grant a bonus / penalty to enemy levels.
 * @type struct<weatherBasedBonusesParams>[]
 *
 * @param variableBasedBonuses
 * @text Variable Based Bonuses:
 * @desc Define game variables whose value will be granted as a bonus / penalty to enemy levels
 * @type struct<variableBasedBonusesParams>[]
 *
 * @param itemBasedBonuses
 * @text Item Based Bonuses:
 * @desc Define items that grant a bonus / penalty to enemy levels if found in the game party's inventory.
 * @type struct<itemBasedBonusesParams>[]
 *
 * @param partyCompositionBasedBonuses
 * @text Party Composition Based Bonuses:
 * @desc Define classes that grant a bonus / penalty to enemy level if members of said class are in the game party.
 * @type struct<partyCompositionBasedBonusesParams>[]
 *
 */
/*~struct~locationBasedBonusesParams:
 * @param mapIdBonuses
 * @text Map Based Bonuses:
 * @desc Define maps (IDs) in which to grant a bonus / penalty to enemy level.
 * @type struct<mapIdBonusesParams>[]
 *
 * @param mapDifficultyBonuses
 * @text Map Difficulty Based Bonuses:
 * @desc Define map difficulty levels for which to grant a bonus / penalty to enemy level (overrides map ID definitions).
 * @type struct<mapDifficultyBonusesParams>[]
 *
 * @param regionIdBonuses
 * @text Region Based Bonuses:
 * @desc Define region IDs in which to grant a bonus / penalty to enemy level (overrides map ID & Difficulty definitions).
 * @type struct<regionIdBonusesParams>[]
 */
/*~struct~mapIdBonusesParams:
 * @param mapId
 * @text Map ID(s):
 * @desc Enter the ID(s) of game maps in which to grant a bonus / penalty to enemy level.
 * @type number[]
 * @min 1
 *
 * @param enemyId
 * @text Enemy ID(s):
 * @desc Enter IDS of enemies to be affected by the bonus / penalty conditions (If left empty - all enemies will be affected).
 * @type enemy[]
 *
 * @param minBonus
 * @text Minimum Bonus:
 * @desc Define the minimum bonus / penalty to grant to enemy levels in the selected game maps.
 * @type number
 * @min -100
 * @max 100
 * @default 0
 *
 * @param maxBonus
 * @text Maximum Bonus:
 * @desc Define the maximum bonus / penalty to grant to enemy levels in the selected game maps.
 * @type number
 * @min -100
 * @max 100
 * @default 0
 */
/*~struct~mapDifficultyBonusesParams:
 * @param mapDifficulty
 * @text Map Difficulty:
 * @desc Select the difficulty level(s) of game maps for which to grant a bonus / penalty to enemy level.
 * @type select[]
 * @option Easy
 * @value easy
 * @option Medium
 * @value medium
 * @option Hard
 * @value hard
 * @option Very Hard
 * @value very hard
 * @option Hellscape
 * @value hellscape
 *
 * @param enemyId
 * @text Enemy ID(s):
 * @desc Enter IDS of enemies to be affected by the bonus / penalty conditions (If left empty - all enemies will be affected).
 * @type enemy[]
 *
 * @param minBonus
 * @text Minimum Bonus:
 * @desc Define the minimum bonus / penalty to grant to enemy levels for the selected map difficulty levels.
 * @type number
 * @min -100
 * @max 100
 * @default 0
 *
 * @param maxBonus
 * @text Maximum Bonus:
 * @desc Define the maximum bonus / penalty to grant to enemy levels for the selected map difficulty levels.
 * @type number
 * @min -100
 * @max 100
 * @default 0
 */
/*~struct~regionIdBonusesParams:
 * @param regionId
 * @text Regions IDs:
 * @desc Enter the ID(s) of regions in which to grant a bonus / penalty to enemy level.
 * @type number[]
 * @min 1
 * @max 255
 *
 * @param enemyId
 * @text Enemy ID(s):
 * @desc Enter IDS of enemies to be affected by the bonus / penalty conditions (If left empty - all enemies will be affected).
 * @type enemy[]
 *
 * @param minBonus
 * @text Minimum Bonus:
 * @desc Define the minimum bonus / penalty to grant to enemy levels in the selected regions.
 * @type number
 * @min -100
 * @max 100
 * @default 0
 *
 * @param maxBonus
 * @text Maximum Bonus:
 * @desc Define the maximum bonus / penalty to grant to enemy levels in the selected regions.
 * @type number
 * @min -100
 * @max 100
 * @default 0
 */
/*~struct~enemyIdBasedBonusesParams:
 * @param enemyId
 * @text Enemy IDs:
 * @desc Enter the IDs of enemies to grant a level bonus / penalty to.
 * @type enemy[]
 *
 * @param minBonus
 * @text Minimum Bonus:
 * @desc Define the minimum bonus / penalty to grant to enemy level for the selected enemies.
 * @type number
 * @min -100
 * @max 100
 * @default 0
 *
 * @param maxBonus
 * @text Maximum Bonus:
 * @desc Define the maximum bonus / penalty to grant to enemy level for the selected enemies.
 * @type number
 * @min -100
 * @max 100
 * @default 0
 */
/*~struct~weatherBasedBonusesParams:
 * @param weatherType
 * @text Weather Type:
 * @desc Enter the types of weather in which to grant bonuses / penalties to enemy level (built-in: rain, storm, snow).
 * @type string[]
 *
 * @param weatherPower
 * @text Weather Power:
 * @desc Enter weather power values for which to grant bonuses / penalties to enemy level (1 --> 40).
 * @type number
 * @min 1
 * @max 40
 *
 * @param enemyId
 * @text Enemy ID(s):
 * @desc Enter IDS of enemies to be affected by the bonus / penalty conditions (If left empty - all enemies will be affected).
 * @type enemy[]
 *
 * @param minBonus
 * @text Minimum Bonus:
 * @desc Define the minimum bonus / penalty to grant to enemy level in these weather conditions.
 * @type number
 * @min -100
 * @max 100
 * @default 0
 *
 * @param maxBonus
 * @text Maximum Bonus:
 * @desc Define the maximum bonus / penalty to grant to enemy level in these weather conditions.
 * @type number
 * @min -100
 * @max 100
 * @default 0
 */
/*~struct~variableBasedBonusesParams:
 * @param variable
 * @text Variable:
 * @desc Choose a game variable whose value will be used as bonus / penalty to enemy level.
 * @type variable
 *
 * @param enemyId
 * @text Enemy ID(s):
 * @desc Enter IDS of enemies to be affected by the bonus / penalty conditions (If left empty - all enemies will be affected).
 * @type enemy[]
 */
/*~struct~itemBasedBonusesParams:
 * @param items
 * @text Items:
 * @desc Select items that grant the defined bonus / penalty to enemy level if found in the game party's inventory.
 * @type item[]
 *
 * @param weapons
 * @text Weapons:
 * @desc Select weapons that grant the defined bonus / penalty to enemy level if found in the game party's inventory.
 * @type weapon[]
 *
 * @param armor
 * @text Armor Pieces:
 * @desc Select armor pieces that grant the defined bonus / penalty to enemy level if found in the game party's inventory..
 * @type armor[]
 *
 * @param enemyId
 * @text Enemy ID(s):
 * @desc Enter IDS of enemies to be affected by the bonus / penalty conditions (If left empty - all enemies will be affected).
 * @type enemy[]
 *
 * @param minBonus
 * @text Minimum Bonus:
 * @desc Define the minimum bonus / penalty to grant to enemy level if the selected items are in the game party's inventory.
 * @type number
 * @min -100
 * @max 100
 * @default 0
 *
 * @param maxBonus
 * @text Maximum Bonus:
 * @desc Define the maximum bonus / penalty to grant to enemy level if the selected item's are in the game party's inventory.
 * @type number
 * @min -100
 * @max 100
 * @default 0
 */
/*~struct~partyCompositionBasedBonusesParams:
 * @param classes
 * @text Classes:
 * @desc Select classes that grant the defined bonus / penalty to enemy level if members of said class are in the party.
 * @type class[]
 *
 * @param enemyId
 * @text Enemy ID(s):
 * @desc Enter IDS of enemies to be affected by the bonus / penalty conditions (If left empty - all enemies will be affected).
 * @type enemy[]
 *
 * @param minBonus
 * @text Minimum Bonus:
 * @desc Define the minimum bonus / penalty to grant to enemy level if the party contains members of the selected classes.
 * @type number
 * @min -100
 * @max 100
 * @default 0
 *
 * @param maxBonus
 * @text Maximum Bonus:
 * @desc Define the maximum bonus / penalty to grant to enemy level if the party contains members of the selected classes.
 * @type number
 * @min -100
 * @max 100
 * @default 0
 */
/*~struct~changeLevelsMidBattleParams:
 * @param enemyIndices
 * @text Enemy Indices:
 * @desc Enter indices of enemies in the enemy troop to be affected by the level change (If empty - all will be affected).
 * @type number[]
 * @min 0
 * @default []
 *
 * @param whenToChangeLevels
 * @text When to Change Enemy Levels
 * @desc Define the condition that needs to be met in order to change the enemy's level during the battle.
 * @type select
 * @option After X turns (X defined separately).
 * @value afterXTurns
 * @option When at least one enemy's HP is below Y (Y defined separately).
 * @value oneEnemyHpBelowY
 * @option When all enemies' HP is below Y (Y defined separately).
 * @value allEnemyHpBelowY
 * @option When at least one Actor's HP is below Y (Y defined separately).
 * @value oneActorHpBelowY
 * @option When all actors' HP is below Y (Y defined separately).
 * @value allActorHpBelowY
 *
 * @param minTurns
 * @text Minimum Turns:
 * @desc Define the minimum number of turns before performing the level change.
 * @type number
 * @min 1
 *
 * @param maxTurns
 * @text Maximum Turns:
 * @desc Define the maximum number of turns before performing the level change.
 * @type number
 * @min 1
 *
 * @param hpThreshold
 * @text HP Threshold
 * @desc Define whether the HP threshold for triggering a level change is a fixed value or a percentage of Max HP.
 * @type select
 * @option Fixed Value
 * @value fixed
 * @option Percentage of Max HP
 * @value percentage
 * @default fixed
 *
 * @param minFixedHp
 * @text HP Fixed Threshold Minimum:
 * @desc Define the minimum amount of HP to serve as fixed-value thershold for triggering a level change.
 * @type number
 * @min 1
 * @max 100000000000000
 *
 * @param maxFixedHp
 * @text HP Fixed Threshold Maxnimum:
 * @desc Define the maximum amount of HP to serve as a fixed-value thershold for triggering a level change.
 * @type number
 * @min 1
 * @max 100000000000000
 *
 * @param minPercentHp
 * @text HP % Threshold Minimum:
 * @desc Define the minimum percent of HP to serve as a relative thershold for triggering a level change.
 * @type number
 * @min 0
 * @max 100
 *
 * @param maxPercentHp
 * @text HP % Threshold Maximum:
 * @desc Define the maximum percent of HP to serve as a relative thershold for triggering a level change.
 * @type number
 * @min 0
 * @max 100
 *
 * @param decreaseOrIncrease
 * @text Decrease or Increase Enemy Level(s)
 * @desc Define whether to decrease or increase the enemy's level by the defined amount.
 * @type select
 * @option Decrease
 * @value decrease
 * @option Increase
 * @value increase
 *
 * @param minLevelChange
 * @text Minimum Level Change
 * @desc Define the minimum number by which to change (decrease / increase) the enemy's level.
 * @type number
 * @min 0
 *
 * @param maxLevelChange
 * @text Maximum Level Change
 * @desc Define the maximum number by which to change (decrease / increase) the enemy's level.
 * @type number
 * @min 0
 */

const _0xf7143a=_0x3346;(function(_0x5f1cc9,_0x37c49f){const _0x48a901=_0x3346,_0x365693=_0x5f1cc9();while(!![]){try{const _0x5ddcbb=-parseInt(_0x48a901(0x14f))/0x1+parseInt(_0x48a901(0x148))/0x2*(parseInt(_0x48a901(0x1fc))/0x3)+-parseInt(_0x48a901(0x221))/0x4*(-parseInt(_0x48a901(0x223))/0x5)+parseInt(_0x48a901(0x154))/0x6*(parseInt(_0x48a901(0x16d))/0x7)+parseInt(_0x48a901(0x209))/0x8*(parseInt(_0x48a901(0x163))/0x9)+parseInt(_0x48a901(0x202))/0xa+-parseInt(_0x48a901(0x1bf))/0xb*(parseInt(_0x48a901(0x145))/0xc);if(_0x5ddcbb===_0x37c49f)break;else _0x365693['push'](_0x365693['shift']());}catch(_0xc9df93){_0x365693['push'](_0x365693['shift']());}}}(_0x4be8,0xe5823));function _0x3346(_0x3d70e0,_0x40b128){const _0x4be8b4=_0x4be8();return _0x3346=function(_0x33466f,_0x45d621){_0x33466f=_0x33466f-0x145;let _0x5813c6=_0x4be8b4[_0x33466f];return _0x5813c6;},_0x3346(_0x3d70e0,_0x40b128);}var COCOMODE=COCOMODE||{};function _0x4be8(){const _0x130fe2=['difficulty','gold','#FF0000','levelTransformation','number','troopToTransform','_hp','customChanged','_enemySprites','hpThreshold','ids','static','updateTurn','minPercentHp','4986708tIuXdH','weatherType','warn','984176LLtuxt','frontViewImageFile','maxFixedHp','troopMapping','usageLimit','interpolate','mhp','5521BoiFnJ','probability','difficultyLevels','armor','oneEnemyHpBelowY','114rZFYiz','minTurns','prototype','floor','weapons','enemyInstanceDefinitions','locationBased','byMapId','updatePosition','\x27s\x20level\x20','relativeAndFlat','parent','items','allMembers','positive\x20variance','7002vMYAUz','traits','itemsToDrop','Level\x20%1\x20%2','endBattle','_scene','changeLabel','clear','makeEncounterTroopId','drawText','491687bQhmFT','param','mpRatio','registerCommand','general','events','turnCount','fixedLevel','StatIncrease','decrease','code','value','_customLevel','idConversion','Failed\x20to\x20parse\x20an\x20enemy\x20instance\x20entry:','byVariable','every','minBonus','height','anchor','partyLevels','meta','mmp','defineProperty','decreased','${level}','interPlugin','levelChange','item','negativeVariance','flat','entries','updateNameVisibility','_triggeringEventId','bitmap','bonusDefinitions','regionIds','enemyId','partyAverage','true','find','negative\x20variance','hasItem','some','byItem','byWeather','blink','one','dropItems','img/sv_enemies/','exp','map','fixedValue','partyLowest','partyHighest','oneActorHpBelowY','requestEffect','startsWith','usage','setHp','max','allEnemyHpBelowY','increased','if\x20fail','isArray','result','fixed','levelBonuses','forEach','battleMembers','actions','startBattle','members','setup','missed','mapId','pages','fontSize','indexOf','params','slice','\x20by\x20','66IpWtXJ','min','setMp','default','showBattleText','enemyEventToChest','regionId','gameVariable','decrease\x20level','maxBonus','maxLevelChange','perEnemy','_nameSprite','Enemy','decreaseOrIncrease','set','PerLevel','all','enemyLevels','enemyIndex','minFixedHp','_enemies','round','_hidden','parameters','visible','update','percentage','minLevel','clamp','midBattleDefinitions','levelDisplayFormat','addChild','ceil','mapDifficulty','percentHpThreshold','stringify','replace','relative','positiveVariance','object','evaded','increase','highestEnemyId','parse','list','battlerName','push','fromEntries','Failed\x20to\x20parse\x20enemyInstanceDefinitions:','string','level','customLevelChanged','onLoad','name','byClass','sideViewImageFile','displayLevel','enemyIndices','normalColor','afterXTurns','3NwiSxT','includes','destroy','enemyLevelDefinitions','other','Action\x20succeeded!','632650awAGtt','unshift','isHidden','levelChanged','levelType','pop','random','8480UvTeMF','length','center','_battler','imagesPerLevel','values','getLevel','enemyLevel','Action\x20failed!','skills','COCOMODE_enemyLevels','turnToChange','class','abs','keys','filter','textColor','apply','charAt','trim','changeLevelsMidBattle','enemyDefinitions','removeChild','screenY','452AgavxS','call','32050EjWmKQ','perEnemyInstance','battlingLowest','per\x20instance','allActorHpBelowY','dropsPerLevel','maxLevel','personal','statIncreaseType'];_0x4be8=function(){return _0x130fe2;};return _0x4be8();}COCOMODE[_0xf7143a(0x1d1)]=function(){const _0xaea421=_0xf7143a;'use\x20strict';const _0x48cced=_0xaea421(0x213),_0x213c66=PluginManager['parameters'](_0x48cced),_0x163f52={};_0x163f52[_0xaea421(0x16e)]={},_0x163f52[_0xaea421(0x16e)]['default']={},_0x163f52[_0xaea421(0x16e)][_0xaea421(0x1ca)]={},_0x163f52['param'][_0xaea421(0x190)]={};const _0x1165d7={'maxHp':0x0,'maxMp':0x0,'atk':0x0,'def':0x0,'mat':0x0,'mdf':0x0,'agi':0x0,'luk':0x0,'exp':0x0,'gold':0x0};let {defaultLevelType:_0x18b126,fixedLevel:_0x1e2751,partyLevels:_0x11e5c7,gameVariable:_0x2a0c9d,locationBased:_0x27ad2f,displayLevel:_0x520aae,levelDisplayFormat:_0x5dda3a,definitionsPerEnemy:_0x36be27}=_0x213c66;_0x163f52['param'][_0xaea421(0x1c2)]['levelType']=_0x18b126;const _0x3dfede=_0x163f52[_0xaea421(0x16e)]['default'];if(_0x3dfede['levelType']){switch(_0x3dfede[_0xaea421(0x206)]){case _0xaea421(0x1a1):_0x4d93de(_0x1e2751,()=>{const _0x3525a3=_0xaea421;_0x3dfede[_0x3525a3(0x174)]=+_0x1e2751;},_0x3dfede[_0xaea421(0x206)]);break;case _0xaea421(0x181):_0x4d93de(_0x11e5c7,()=>{const _0x27689d=_0xaea421;_0x3dfede[_0x27689d(0x181)]=_0x11e5c7;},_0x3dfede[_0xaea421(0x206)]);break;case'gameVariable':_0x4d93de(_0x2a0c9d,()=>{const _0x4799d7=_0xaea421;_0x3dfede[_0x4799d7(0x1c6)]=+_0x2a0c9d;},_0x3dfede[_0xaea421(0x206)]);break;case'locationBased':_0x27ad2f&&_0x4d93de(_0x27ad2f,()=>{const _0x564605=_0xaea421,_0x50a5e7=JSON[_0x564605(0x1eb)](_0x27ad2f);for(const _0x25195 in _0x50a5e7){let _0x17652c=_0x50a5e7[_0x25195];_0x17652c&&(_0x50a5e7[_0x25195]=JSON[_0x564605(0x1eb)](_0x17652c)[_0x564605(0x1a0)](_0x168362=>{const _0x1db111=_0x564605;_0x168362=JSON[_0x1db111(0x1eb)](_0x168362);for(const _0x1fbc2d in _0x168362){let _0x3089a9=_0x168362[_0x1fbc2d];if(_0x3089a9){if(!isNaN(_0x3089a9))_0x168362[_0x1fbc2d]=+_0x3089a9;else _0x3089a9[_0x1db111(0x1a6)]('[')&&(_0x168362[_0x1fbc2d]=JSON[_0x1db111(0x1eb)](_0x3089a9)[_0x1db111(0x1a0)](_0x2adaf3=>isNaN(_0x2adaf3)?_0x2adaf3:+_0x2adaf3));}}return _0x168362;}));}Object[_0x564605(0x217)](_0x50a5e7)['length']&&(_0x3dfede[_0x564605(0x15a)]={},_0x2bdff9(_0x50a5e7,_0x564605(0x1b8),_0x564605(0x236)),_0x2bdff9(_0x50a5e7,'mapDifficulty',_0x564605(0x151)),_0x2bdff9(_0x50a5e7,_0x564605(0x1c5),'regionIds'),!Object['keys'](_0x3dfede['locationBased'])['length']&&(delete _0x3dfede[_0x564605(0x15a)],delete _0x3dfede[_0x564605(0x206)]));},_0x3dfede['levelType']);break;}_0x2e9e5b(_0x213c66),_0x143be8(_0x213c66),_0xaedcf2(_0x213c66);}const _0x59f2c8=_0x163f52[_0xaea421(0x16e)];_0x59f2c8[_0xaea421(0x1f8)]=_0x520aae===_0xaea421(0x194);if(_0x59f2c8[_0xaea421(0x1f8)])_0x59f2c8[_0xaea421(0x1de)]=_0x5dda3a||_0xaea421(0x166);if(_0x36be27){const _0x378999=JSON['parse'](_0x36be27)[_0xaea421(0x1a0)](_0x1a15e3=>{const _0x560b6f=_0xaea421;_0x1a15e3=JSON[_0x560b6f(0x1eb)](_0x1a15e3);if(_0x1a15e3[_0x560b6f(0x192)])_0x1a15e3['enemyId']=+_0x1a15e3[_0x560b6f(0x192)];if(_0x1a15e3['enemyLevelDefinitions'])_0x1a15e3[_0x560b6f(0x1ff)]=JSON[_0x560b6f(0x1eb)](_0x1a15e3[_0x560b6f(0x1ff)]);return _0x1a15e3;});for(const _0x58bd3f of _0x378999){const {enemyId:_0x42b356,enemyLevelDefinitions:_0x31a6c2}=_0x58bd3f;_0x42b356&&_0x31a6c2&&(_0x163f52[_0xaea421(0x16e)][_0xaea421(0x1ca)][_0x42b356]={'levelType':_0x31a6c2[_0xaea421(0x206)]});const _0x5a694b=_0x163f52[_0xaea421(0x16e)][_0xaea421(0x1ca)][_0x42b356];if(_0x5a694b?.[_0xaea421(0x206)]&&_0x31a6c2){let {fixedLevel:_0x522b10,partyLevels:_0x5697ce,gameVariable:_0xf33205,locationBased:_0xb90db9}=_0x31a6c2;switch(_0x5a694b['levelType']){case _0xaea421(0x237):break;case _0xaea421(0x1a1):_0x4d93de(_0x522b10,()=>{const _0x5dfc7a=_0xaea421;_0x5a694b[_0x5dfc7a(0x174)]=+_0x522b10;},_0x5a694b);break;case _0xaea421(0x181):_0x4d93de(_0x5697ce,()=>{const _0x48a52d=_0xaea421;_0x5a694b[_0x48a52d(0x181)]=_0x5697ce;},_0x5a694b);break;case'gameVariable':_0x4d93de(_0xf33205,()=>{_0x5a694b['gameVariable']=+_0xf33205;},_0x5a694b);break;case _0xaea421(0x15a):_0x4d93de(_0xb90db9,()=>{const _0x2546ab=_0xaea421;_0xb90db9=JSON[_0x2546ab(0x1eb)](_0xb90db9);for(const _0x5c2b14 in _0xb90db9){let _0x43792c=_0xb90db9[_0x5c2b14];if(!_0x43792c)continue;const _0x2b5949=JSON['parse'](_0x43792c)['map'](_0x4429a0=>{const _0x459847=_0x2546ab,_0x4bffd2=JSON[_0x459847(0x1eb)](_0x4429a0);for(const _0x17f5fa in _0x4bffd2){let _0x28a31e=_0x4bffd2[_0x17f5fa];if(!_0x28a31e)continue;if(!isNaN(_0x28a31e))_0x4bffd2[_0x17f5fa]=+_0x28a31e;else _0x28a31e['startsWith']('[')&&(_0x4bffd2[_0x17f5fa]=JSON[_0x459847(0x1eb)](_0x28a31e)[_0x459847(0x1a0)](_0x4b4d83=>isNaN(_0x4b4d83)?_0x4b4d83:+_0x4b4d83));}return _0x4bffd2;});_0xb90db9[_0x5c2b14]=_0x2b5949;}const {mapId:_0x518a66,mapDifficulty:_0x46961a,regionId:_0x396f43}=_0xb90db9;_0x518a66?.[_0x2546ab(0x20a)]||_0x46961a?.['length']||_0x396f43?.[_0x2546ab(0x20a)]?(_0x5a694b[_0x2546ab(0x15a)]={},_0x2bdff9(_0xb90db9,_0x2546ab(0x1b8),_0x2546ab(0x236),_0x42b356),_0x2bdff9(_0xb90db9,_0x2546ab(0x1e1),_0x2546ab(0x151),_0x42b356),_0x2bdff9(_0xb90db9,_0x2546ab(0x1c5),_0x2546ab(0x191),_0x42b356),!Object[_0x2546ab(0x217)](_0x5a694b[_0x2546ab(0x15a)])[_0x2546ab(0x20a)]&&delete _0x5a694b):delete _0x5a694b;},_0x5a694b);break;}_0x5a694b?.['levelType']&&(_0x2e9e5b(_0x31a6c2,_0x42b356),_0x143be8(_0x31a6c2,_0x42b356),_0xaedcf2(_0x31a6c2,_0x42b356),_0x82a7ad(_0x31a6c2,_0x42b356));}}}if(_0x213c66[_0xaea421(0x1b0)]){const _0x1cc080=JSON[_0xaea421(0x1eb)](_0x213c66[_0xaea421(0x1b0)]),_0x11430d=_0x47b6d5=>{const _0x3ae36e=_0xaea421;return _0x47b6d5[_0x3ae36e(0x1a0)](_0x45a970=>{const _0x5d6538=_0x3ae36e,_0x4d95fb=JSON[_0x5d6538(0x1eb)](_0x45a970);for(const _0x2c72cf in _0x4d95fb){const _0x5bc6cb=_0x4d95fb[_0x2c72cf];_0x5bc6cb&&(!isNaN(_0x5bc6cb)?_0x4d95fb[_0x2c72cf]=+_0x4d95fb[_0x2c72cf]:_0x4d95fb[_0x2c72cf]=JSON[_0x5d6538(0x1eb)](_0x4d95fb[_0x2c72cf])['map'](_0x4ebbb7=>isNaN(_0x4ebbb7)?_0x4ebbb7:+_0x4ebbb7));}return _0x4d95fb;});};for(const _0x597518 in _0x1cc080){let _0x462892=_0x1cc080[_0x597518];if(!_0x462892)continue;_0x462892=JSON[_0xaea421(0x1eb)](_0x462892);if(Array[_0xaea421(0x1ad)](_0x462892))_0x1cc080[_0x597518]=_0x11430d(_0x462892);else{for(const _0x254d1c in _0x462892){let _0x32f4a3=_0x462892[_0x254d1c];if(!_0x32f4a3)continue;_0x32f4a3=JSON['parse'](_0x32f4a3),_0x462892[_0x254d1c]=_0x11430d(_0x32f4a3);}_0x1cc080[_0x597518]=_0x462892;}}_0x163f52['param'][_0xaea421(0x190)]['default']={},_0x163f52[_0xaea421(0x16e)][_0xaea421(0x190)][_0xaea421(0x1ca)]={};const {enemyIdBasedBonuses:_0x55ea68,locationBasedBonuses:_0x94eebe,weatherBasedBonuses:_0x981177,variableBasedBonuses:_0x55a586,itemBasedBonuses:_0x54bd89,partyCompositionBasedBonuses:_0xad17fe}=_0x1cc080;if(_0x55ea68)for(const {minBonus:_0x5bb300,maxBonus:_0x44cf17,enemyId:_0x99ca63}of _0x55ea68){const [_0x5a47e5,_0x5085d3,_0x1ef0f4]=_0x3b7d8c(_0x5bb300,_0x44cf17);if(!_0x1ef0f4)continue;const _0x11ce7f={'minBonus':_0x5a47e5,'maxBonus':_0x5085d3};if(_0x99ca63?.[_0xaea421(0x20a)])for(const _0x40242d of _0x99ca63){const _0x4bc5ab=_0x163f52[_0xaea421(0x16e)][_0xaea421(0x190)][_0xaea421(0x1ca)];_0x4bc5ab[_0x40242d]=_0x4bc5ab[_0x40242d]||{},_0x4bc5ab[_0x40242d]['personal']=_0x11ce7f;}else _0x163f52[_0xaea421(0x16e)][_0xaea421(0x190)][_0xaea421(0x1c2)][_0xaea421(0x171)]=_0x11ce7f;}_0x94eebe&&_0x23b896(_0x94eebe,['mapId',_0xaea421(0x1e1),_0xaea421(0x1c5)]);if(_0x981177){const _0x26b3d7=_0x163f52['param']['bonusDefinitions']['perEnemy'],_0x28e2f2=_0x163f52[_0xaea421(0x16e)][_0xaea421(0x190)][_0xaea421(0x1c2)]['byWeather']=_0x163f52[_0xaea421(0x16e)]['bonusDefinitions']['default']['byWeather']||{};for(const {weatherType:_0x2d5840,minBonus:_0x26d8f6,maxBonus:_0x5c3fcc,enemyId:_0xee76a2,weatherPower:_0x2b1783}of _0x981177){if(!_0x2d5840?.[_0xaea421(0x20a)]||_0x26d8f6===''&&_0x5c3fcc==='')continue;const [_0x3e23ca,_0x35a4ed,_0x3c3c92]=_0x3b7d8c(_0x26d8f6,_0x5c3fcc);if(!_0x3c3c92||!_0x2b1783)continue;const _0x1d151f={'minBonus':_0x3e23ca,'maxBonus':_0x35a4ed},_0x5902d7=_0x58d8c6=>{for(const _0x501692 of _0x2d5840){_0x58d8c6[_0x501692]=_0x58d8c6[_0x501692]||{},_0x58d8c6[_0x501692][_0x2b1783]=_0x1d151f;}};if(_0xee76a2?.[_0xaea421(0x20a)])for(const _0x548075 of _0xee76a2){const _0x2c83b0=_0x26b3d7[_0x548075]=_0x26b3d7[_0x548075]||{},_0x2ab818=_0x2c83b0['byWeather']=_0x2c83b0[_0xaea421(0x19a)]||{};_0x5902d7(_0x2ab818);}else _0x5902d7(_0x28e2f2);}}if(_0x55a586){const _0x80c85=_0x163f52[_0xaea421(0x16e)]['bonusDefinitions']['perEnemy'];for(const {enemyId:_0x3c3380,variable:_0x3f0c11}of _0x55a586){if(!_0x3f0c11)continue;if(_0x3c3380?.[_0xaea421(0x20a)])for(const _0x55ce5d of _0x3c3380){_0x80c85[_0x55ce5d]=_0x80c85[_0x55ce5d]||{},_0x80c85[_0x55ce5d][_0xaea421(0x17c)]=_0x3f0c11;}else _0x163f52['param'][_0xaea421(0x190)][_0xaea421(0x1c2)][_0xaea421(0x17c)]=_0x3f0c11;}}if(_0x54bd89)for(const _0x48d561 of _0x54bd89){const {items:_0x3fbdcf,weapons:_0x14a543,armor:_0x35ba81,minBonus:_0x267eab,maxBonus:_0xe9723e}=_0x48d561;if(_0x3fbdcf?.[_0xaea421(0x20a)]||_0x14a543?.[_0xaea421(0x20a)]||_0x35ba81?.[_0xaea421(0x20a)]){const [_0x3d7e05,_0x2c7f86,_0x2e4561]=_0x3b7d8c(_0x267eab,_0xe9723e);if(!_0x2e4561)continue;_0x344052(_0x48d561,[_0xaea421(0x160),_0xaea421(0x158),_0xaea421(0x152)],_0x3d7e05,_0x2c7f86);}}if(_0xad17fe)for(const {classes:_0x4d6bed,minBonus:_0x2e4b93,maxBonus:_0x211f99,enemyId:_0x27139c}of _0xad17fe){if(!_0x4d6bed?.[_0xaea421(0x20a)]||_0x2e4b93===''&&_0x211f99==='')continue;const [_0x4dc858,_0x57d4cd,_0x26e181]=_0x3b7d8c(_0x2e4b93,_0x211f99);if(!_0x26e181)continue;const _0x445d77={'minBonus':_0x4dc858,'maxBonus':_0x57d4cd};if(_0x27139c?.[_0xaea421(0x20a)])for(const _0x2cd6c3 of _0x27139c){const _0x41548c=_0x163f52['param'][_0xaea421(0x190)][_0xaea421(0x1ca)][_0x2cd6c3]=_0x163f52[_0xaea421(0x16e)][_0xaea421(0x190)][_0xaea421(0x1ca)][_0x2cd6c3]||{},_0x2c522e=_0x41548c[_0xaea421(0x1f6)]=_0x41548c[_0xaea421(0x1f6)]||{};for(const _0x388139 of _0x4d6bed){_0x2c522e[_0x388139]=_0x445d77;}}else{const _0x368026=_0x163f52[_0xaea421(0x16e)]['bonusDefinitions'][_0xaea421(0x1c2)]['byClass']=_0x163f52['param']['bonusDefinitions'][_0xaea421(0x1c2)][_0xaea421(0x1f6)]||{};for(const _0x2d3aac of _0x4d6bed){_0x368026[_0x2d3aac]=_0x445d77;}}}!Object['keys'](_0x163f52['param']['bonusDefinitions'][_0xaea421(0x1c2)])['length']&&delete _0x163f52['param']['bonusDefinitions'][_0xaea421(0x1c2)],!Object[_0xaea421(0x217)](_0x163f52[_0xaea421(0x16e)][_0xaea421(0x190)][_0xaea421(0x1ca)])[_0xaea421(0x20a)]&&delete _0x163f52[_0xaea421(0x16e)][_0xaea421(0x190)]['perEnemy'];}function _0x105d3c(_0x40beaa,_0x24a4ca){for(const _0x4f7aea of _0x24a4ca)_0x40beaa=_0x40beaa[_0x4f7aea]=_0x40beaa[_0x4f7aea]||{};return _0x40beaa;}function _0x344052(_0x525706,_0x29708d,_0x12485b,_0x24c690){const _0x3c955b=_0xaea421,_0x91c31b=(_0x311386,_0x5e1062)=>{_0x311386=_0x105d3c(_0x311386,_0x5e1062),_0x311386=_0x5f425c(_0x29708d,_0x525706,_0x311386,_0x12485b,_0x24c690);},_0x2f498c=_0x163f52[_0x3c955b(0x16e)][_0x3c955b(0x190)];_0x525706['enemyId']?.[_0x3c955b(0x20a)]?_0x525706['enemyId'][_0x3c955b(0x1b1)](_0x110c42=>_0x91c31b(_0x2f498c,[_0x3c955b(0x1ca),_0x110c42,'byItem'])):_0x91c31b(_0x2f498c,[_0x3c955b(0x1c2),_0x3c955b(0x199)]);}function _0x5f425c(_0x17c16b,_0x52d3f5,_0x298a94,_0x39f646,_0x226441){const _0x244d7f=_0xaea421;for(const _0x4f7e7d of _0x17c16b){const _0x338b31=_0x52d3f5[_0x4f7e7d];if(_0x338b31?.[_0x244d7f(0x20a)]){const _0x5b9b83=_0x298a94[_0x4f7e7d]=_0x298a94[_0x4f7e7d]||{};for(const _0x2501bf of _0x338b31){_0x5b9b83[_0x2501bf]={'minBonus':_0x39f646,'maxBonus':_0x226441};}}}return _0x298a94;}function _0x23b896(_0x110216,_0x194e53){const _0x1718e4=_0xaea421,_0x2f5873=_0x163f52['param']['bonusDefinitions'];for(const _0x32f754 of _0x194e53){const _0x2d1ba6=_0x110216[_0x32f754+'Bonuses'];if(!_0x2d1ba6)continue;const _0x7f2a49='by'+_0x33849e(_0x32f754);for(const _0x37d757 of _0x2d1ba6){if(!_0x37d757[_0x32f754]?.['length']||_0x37d757[_0x1718e4(0x17e)]===''&&_0x37d757[_0x1718e4(0x1c8)]==='')continue;let [_0x9c2919,_0x293cbb]=_0x349b77(_0x37d757[_0x1718e4(0x17e)],_0x37d757[_0x1718e4(0x1c8)]);if(_0x9c2919===''||_0x293cbb===''||_0x9c2919===0x0&&_0x293cbb===0x0)continue;if(_0x37d757[_0x1718e4(0x192)]?.['length'])for(const _0x357c41 of _0x37d757['enemyId']){const _0x3890e6=_0x2f5873[_0x1718e4(0x1ca)][_0x357c41]=_0x2f5873[_0x1718e4(0x1ca)][_0x357c41]||{};for(const _0x5982c0 of _0x37d757[_0x32f754]){const _0x1de212=_0x3890e6[_0x7f2a49]=_0x3890e6[_0x7f2a49]||{};_0x1de212[_0x5982c0]={'minBonus':_0x9c2919,'maxBonus':_0x293cbb};}}else{const _0x4bf90f=_0x2f5873[_0x1718e4(0x1c2)][_0x7f2a49]=_0x2f5873[_0x1718e4(0x1c2)][_0x7f2a49]||{};for(const _0x5778c1 of _0x37d757[_0x32f754]){_0x4bf90f[_0x5778c1]={'minBonus':_0x9c2919,'maxBonus':_0x293cbb};}}}}}function _0x2bdff9(_0x5e5aee,_0x5b2822,_0x22792a,_0x237235=null){const _0x3e77f0=_0xaea421;if(!_0x5e5aee?.[_0x5b2822]?.['length']||!_0x5b2822)return;const _0x1bd42d=_0x163f52[_0x3e77f0(0x16e)],_0x1c4c95=_0x237235?[_0x3e77f0(0x1ca),_0x237235,_0x3e77f0(0x15a)]:[_0x3e77f0(0x1c2),'locationBased'],_0x5e5213=_0x105d3c(_0x1bd42d,_0x1c4c95),_0x1f36a4=(_0x5ccea0,_0x1fc229,_0x386b3d)=>{_0x5ccea0[_0x386b3d]?_0x5e5213[_0x5b2822][_0x1fc229][_0x386b3d]=_0x5ccea0[_0x386b3d]:delete _0x5e5213[_0x5b2822][_0x1fc229];};_0x5e5213[_0x5b2822]={};for(const _0x513590 of _0x5e5aee[_0x5b2822]){const _0x198efd=_0x513590[_0x3e77f0(0x206)];if(!_0x513590[_0x22792a]?.[_0x3e77f0(0x20a)]||!_0x198efd)continue;for(const _0x3e213d of _0x513590[_0x22792a]){_0x5e5213[_0x5b2822][_0x3e213d]={'levelType':_0x198efd};switch(_0x198efd){case _0x3e77f0(0x1a1):_0x1f36a4(_0x513590,_0x3e213d,_0x3e77f0(0x174));break;case _0x3e77f0(0x181):_0x1f36a4(_0x513590,_0x3e213d,'partyLevels');break;case _0x3e77f0(0x1c6):_0x1f36a4(_0x513590,_0x3e213d,_0x3e77f0(0x1c6));break;}}}}function _0x2e9e5b(_0x5c03a0,_0x3a7447=null,_0x237ff6=null){const _0x29a690=_0xaea421;if(!_0x5c03a0)return;const _0xa142a0=_0x163f52['param'],_0x54a78a=_0x3a7447?['perEnemy',_0x3a7447]:_0x237ff6!==null&&_0x237ff6!==''?[_0x29a690(0x224),_0x237ff6]:[_0x29a690(0x1c2)],_0x4abf53=_0x105d3c(_0xa142a0,_0x54a78a),{positiveVariance:_0x47696c,negativeVariance:_0x3f4c08,minLevel:_0x40bb89,maxLevel:_0x33a4e9,statIncreaseType:_0x57f69b}=_0x5c03a0;_0x4abf53[_0x29a690(0x1e6)]=+_0x47696c||0x0,_0x4abf53[_0x29a690(0x18a)]=+_0x3f4c08||0x0,_0x4abf53[_0x29a690(0x1db)]=+_0x40bb89||0x1,_0x4abf53['maxLevel']=+_0x33a4e9||0x16345785d8a0000;if(_0x4abf53[_0x29a690(0x1db)]>_0x4abf53[_0x29a690(0x229)]){const _0x134787=_0x4abf53['minLevel'];_0x4abf53[_0x29a690(0x1db)]=_0x4abf53[_0x29a690(0x229)],_0x4abf53[_0x29a690(0x229)]=_0x134787;}_0x4abf53[_0x29a690(0x22b)]=_0x57f69b;if(!_0x57f69b)return;for(const _0xa1bd9 of['relative',_0x29a690(0x18b)]){if(_0x57f69b!==_0xa1bd9&&_0x57f69b!==_0x29a690(0x15e))continue;const _0x152bd8=_0xa1bd9+_0x29a690(0x175),_0x4c3c5f=_0x5c03a0[_0x152bd8];_0x4abf53[_0x152bd8]=_0x4c3c5f?Object[_0x29a690(0x1ef)](Object[_0x29a690(0x18c)](JSON[_0x29a690(0x1eb)](_0x4c3c5f))[_0x29a690(0x1a0)](([_0x3a2009,_0x18d047])=>[_0x3a2009,+_0x18d047])):_0x1165d7;}}function _0x143be8(_0x5a66be,_0x14b1a7=null,_0x30372b=null){const _0x1507c4=_0xaea421;if(!_0x5a66be)return;const _0x1aa031=_0x163f52[_0x1507c4(0x16e)],_0x5a7fec=_0x14b1a7?[_0x1507c4(0x1ca),_0x14b1a7]:_0x30372b!==null&&_0x30372b!==''?['perEnemyInstance',_0x30372b]:['default'],_0x368238=_0x105d3c(_0x1aa031,_0x5a7fec);for(const _0x194f88 of['skills',_0x1507c4(0x164)]){const _0x3bb253=_0x194f88+'PerLevel';let _0x5943e0=_0x5a66be[_0x3bb253];if(!_0x5943e0)continue;_0x368238[_0x3bb253]={};const _0xbe0907=JSON[_0x1507c4(0x1eb)](_0x5943e0)['map'](_0x20345e=>{const _0x51f91e=_0x1507c4,_0x299cae=JSON[_0x51f91e(0x1eb)](_0x20345e);for(const _0x401360 in _0x299cae){const _0x20db70=_0x299cae[_0x401360];if(!_0x20db70)continue;_0x299cae[_0x401360]=!isNaN(_0x20db70)?+_0x20db70:JSON[_0x51f91e(0x1eb)](_0x20db70)['map'](Number);}return _0x299cae;});for(const _0x421ba7 of _0xbe0907){const {level:_0x4174f3}=_0x421ba7,_0x238ce5=_0x421ba7[_0x194f88];_0x4174f3&&_0x238ce5?.['length']&&(_0x368238[_0x3bb253][_0x4174f3]=_0x238ce5);}}}function _0xaedcf2(_0x477d2b,_0x131f1c=null,_0x3a16ba=null){const _0xb00539=_0xaea421;if(!_0x477d2b?.[_0xb00539(0x228)])return;const _0x178e74=_0x163f52['param'],_0x17a771=_0x131f1c?[_0xb00539(0x1ca),_0x131f1c]:_0x3a16ba!==null&&_0x3a16ba!==''?[_0xb00539(0x224),_0x3a16ba]:[_0xb00539(0x1c2)],_0x36da35=_0x105d3c(_0x178e74,_0x17a771),_0x44e1d2=JSON['parse'](_0x477d2b['dropsPerLevel'])[_0xb00539(0x1a0)](_0x4b8f84=>{const _0x2c7349=_0xb00539,_0x49b03b=JSON[_0x2c7349(0x1eb)](_0x4b8f84);for(const _0x242daa in _0x49b03b){const _0xe139ec=_0x49b03b[_0x242daa];if(!_0xe139ec)continue;!isNaN(_0xe139ec)?_0x49b03b[_0x242daa]=+_0xe139ec:_0x49b03b[_0x242daa]=JSON[_0x2c7349(0x1eb)](_0xe139ec)['map'](_0x1c88d2=>{const _0x21288a=_0x2c7349,_0x377b70=JSON[_0x21288a(0x1eb)](_0x1c88d2);for(const _0x54b9c7 in _0x377b70){const _0x53aeb6=_0x377b70[_0x54b9c7];if(!_0x53aeb6){_0x377b70[_0x54b9c7]=[];continue;}!isNaN(_0x53aeb6)?_0x377b70[_0x54b9c7]=+_0x53aeb6:_0x377b70[_0x54b9c7]=JSON['parse'](_0x53aeb6)[_0x21288a(0x1a0)](Number);}return _0x377b70;});}return _0x49b03b;});if(_0x44e1d2?.[_0xb00539(0x20a)]){_0x36da35[_0xb00539(0x228)]={};for(const _0x5b42c1 of _0x44e1d2){if(!_0x5b42c1[_0xb00539(0x1f2)]||!_0x5b42c1['itemsToDrop'])continue;const _0x323c5f=_0x5b42c1[_0xb00539(0x165)]['filter'](_0xb11dd3=>typeof _0xb11dd3[_0xb00539(0x150)]===_0xb00539(0x230));if(_0x323c5f[_0xb00539(0x20a)])_0x36da35['dropsPerLevel'][_0x5b42c1[_0xb00539(0x1f2)]]=_0x323c5f;}}}function _0x82a7ad(_0x44ddaf,_0x530389=null,_0x2485f5=null){const _0x2ab49e=_0xaea421;if(!_0x44ddaf?.[_0x2ab49e(0x20d)])return;const _0x4b956e=_0x163f52['param'],_0x21bf63=_0x530389?[_0x2ab49e(0x1ca),_0x530389]:_0x2485f5!==null&&_0x2485f5!==''?[_0x2ab49e(0x224),_0x2485f5]:null,_0x34b179=_0x105d3c(_0x4b956e,_0x21bf63),_0xed2903=JSON['parse'](_0x44ddaf['imagesPerLevel'])[_0x2ab49e(0x1a0)](_0x55399d=>{const _0x1ad7ec=_0x2ab49e,_0x2a5295=JSON[_0x1ad7ec(0x1eb)](_0x55399d);if(!_0x2a5295[_0x1ad7ec(0x210)])return null;_0x2a5295[_0x1ad7ec(0x210)]=+_0x2a5295[_0x1ad7ec(0x210)];const _0x5800d2=(_0x55e552,_0x57e4b0)=>_0x55e552?.[_0x1ad7ec(0x1a6)](_0x57e4b0)&&_0x55e552[_0x1ad7ec(0x20a)]>_0x57e4b0[_0x1ad7ec(0x20a)]?_0x55e552['split']('/')[_0x1ad7ec(0x207)]():'';return _0x2a5295[_0x1ad7ec(0x149)]=_0x5800d2(_0x2a5295[_0x1ad7ec(0x149)],'img/enemies/'),_0x2a5295[_0x1ad7ec(0x1f7)]=_0x5800d2(_0x2a5295[_0x1ad7ec(0x1f7)],_0x1ad7ec(0x19e)),_0x2a5295;})[_0x2ab49e(0x218)](Boolean);if(!_0xed2903['length'])return;_0x34b179[_0x2ab49e(0x20d)]={};for(const {enemyLevel:_0x115ac9,frontViewImageFile:_0x510494,sideViewImageFile:_0xa82f60}of _0xed2903){_0x115ac9&&(_0x510494||_0xa82f60)&&(_0x34b179['imagesPerLevel'][_0x115ac9]={'frontViewImageFile':_0x510494,'sideViewImageFile':_0xa82f60});}}function _0x3b7d8c(_0x5d4e33,_0x46063b){const [_0x329437,_0x5c267c]=_0x349b77(_0x5d4e33,_0x46063b),_0x59656b=_0x329437!==''&&_0x5c267c!==''&&!(_0x329437===0x0&&_0x5c267c===0x0);return[_0x329437,_0x5c267c,_0x59656b];}function _0x4d93de(_0x341cfb,_0x3cddd8,_0x1a7e6c){_0x341cfb?_0x3cddd8():delete _0x1a7e6c;};function _0x41a53f(_0x565e92){const _0x27bcc2=_0xaea421,_0x4a5dc6=$gameParty[_0x27bcc2(0x161)]()[_0x27bcc2(0x1a0)](_0xa56181=>_0xa56181[_0x27bcc2(0x1f2)]),_0x4484d0=$gameParty[_0x27bcc2(0x1b2)]()['map'](_0x756ee7=>_0x756ee7[_0x27bcc2(0x1f2)]),_0x593eb4=_0x48cba7=>Math['round'](_0x48cba7['reduce']((_0x40df48,_0x91ba89)=>_0x40df48+_0x91ba89,0x0)/_0x48cba7[_0x27bcc2(0x20a)]);switch(_0x565e92){case _0x27bcc2(0x1a3):return Math[_0x27bcc2(0x1a9)](..._0x4a5dc6);case _0x27bcc2(0x193):return _0x593eb4(_0x4a5dc6);case _0x27bcc2(0x1a2):return Math[_0x27bcc2(0x1c0)](..._0x4a5dc6);case'battlingHighest':return Math[_0x27bcc2(0x1a9)](..._0x4484d0);case'battlingAverage':return _0x593eb4(_0x4484d0);case _0x27bcc2(0x225):return Math[_0x27bcc2(0x1c0)](..._0x4484d0);default:return 0x1;}}function _0x7a1219(_0x4df930,_0x4b9969,_0x17b359){const _0x386255=_0xaea421,_0xe5d2bf=_0x4df930[_0x386255(0x15a)]?.[_0x4b9969]?.[_0x17b359],_0x4047f6=_0xe5d2bf?.[_0x386255(0x206)];if(!_0x4047f6)return;switch(_0x4047f6){case _0x386255(0x1a1):return _0xe5d2bf[_0x386255(0x174)];case _0x386255(0x181):return _0x41a53f(_0xe5d2bf['partyLevels']);case _0x386255(0x1c6):return $gameVariables['value'](_0xe5d2bf[_0x386255(0x1c6)])||0x1;default:return 0x1;}}function _0x5cf21c(_0x524298,_0x449bcf,_0x2e2670){const _0x5266e4=_0xaea421;if(!_0x2e2670['locationBased'])return 0x1;const {regionId:_0x3cca80,mapDifficulty:_0x487721,mapId:_0x219cf1}=_0x2e2670[_0x5266e4(0x15a)],_0x10b41f=$gameMap[_0x5266e4(0x1b8)](),_0x19fe9d=$dataMap[_0x5266e4(0x182)][_0x5266e4(0x22c)]||null,_0x14db50=$gameMap['regionId'](_0x524298,_0x449bcf);if(_0x3cca80?.[_0x14db50])return _0x7a1219(_0x2e2670,_0x5266e4(0x1c5),_0x14db50);else{if(_0x487721?.[_0x19fe9d])return _0x7a1219(_0x2e2670,_0x5266e4(0x1e1),_0x19fe9d);else{if(_0x219cf1?.[_0x10b41f])return _0x7a1219(_0x2e2670,_0x5266e4(0x1b8),_0x10b41f);}}return 0x1;}function _0x109f70(_0x2ddf81,_0x5b1fa5){const _0x2190c0=_0xaea421;if(_0x2ddf81>_0x5b1fa5){const _0x1e9f87=_0x2ddf81;_0x2ddf81=_0x5b1fa5,_0x5b1fa5=_0x1e9f87;}return(Math[_0x2190c0(0x208)]()*(_0x5b1fa5-_0x2ddf81+0x1)|0x0)+_0x2ddf81;}function _0xabdfe9(_0x144069,_0x138799,_0x229835,_0x2db2ee=null,_0x891faa=null){const _0x4ddd94=_0xaea421,_0x20fa21=_0x163f52[_0x4ddd94(0x16e)][_0x4ddd94(0x190)],_0x410625=_0x20fa21?.[_0x4ddd94(0x1c2)],_0x295fad=_0x20fa21?.[_0x4ddd94(0x1ca)]?.[_0x138799],_0x1180b0=_0x229835==='personal'?_0x4ddd94(0x171):_0x229835,_0x21910d=_0x295fad?.[_0x229835],_0x244b0e=_0x51c87b=>{const _0x22e5e9=_0x4ddd94;let _0x1efadb=_0x2db2ee?_0x51c87b[_0x2db2ee]:_0x51c87b;if(!_0x1efadb)return 0x0;return _0x229835===_0x22e5e9(0x19a)&&_0x891faa?_0x1efadb=_0x1efadb[_0x32621b(_0x891faa,Object['keys'](_0x1efadb))]??null:_0x1efadb=_0x891faa?_0x1efadb[_0x891faa]:_0x1efadb,_0x1efadb?_0x109f70(_0x1efadb[_0x22e5e9(0x17e)],_0x1efadb[_0x22e5e9(0x1c8)]):0x0;};let _0x2d9dfa=0x0;if(_0x229835==='byVariable'){_0x21910d&&(_0x2d9dfa=$gameVariables[_0x4ddd94(0x178)](_0x21910d));if(_0x410625?.[_0x229835]){const _0x3c8428=$gameVariables[_0x4ddd94(0x178)](_0x410625[_0x229835]);_0x2d9dfa+=_0x3c8428;}}else{_0x21910d&&(_0x2d9dfa=_0x244b0e(_0x21910d));if(_0x410625?.[_0x1180b0]){const _0xefd391=_0x244b0e(_0x410625[_0x1180b0]);_0x2d9dfa+=_0xefd391;}}return _0x144069+_0x2d9dfa;}function _0x281e6f(_0x16a88e,_0x1c6c59,_0x38c103,_0x22b3ad=null){const _0x1633f8=_0xaea421,_0x317aef=_0x163f52['param']['bonusDefinitions'],_0x1a01df=_0x317aef?.['default'],_0x505434=_0x317aef?.[_0x1633f8(0x1ca)]?.[_0x1c6c59];let _0x3701aa;const _0x4d7f32=(_0x4c7b2d,_0x4613b2,_0x25815d,_0x4e6c68)=>{const _0x512d36=_0x1633f8;let _0x408257=0x0;for(const _0x4d91d7 of Object['keys'](_0x4c7b2d)){const _0x4f88c5=+_0x4d91d7,_0x1b8f9e=_0x25815d===_0x512d36(0x215)?$gameParty[_0x512d36(0x1b5)]()[_0x512d36(0x198)](_0x1226b5=>_0x1226b5['currentClass']()['id']===_0x4f88c5):$gameParty[_0x512d36(0x197)](_0x3701aa[_0x4f88c5],!![]);let _0x2be68b;_0x4e6c68==='personal'?(_0x4613b2[_0x512d36(0x1ee)](_0x4d91d7),_0x2be68b=_0x1b8f9e):_0x2be68b=_0x1b8f9e&&!_0x4613b2[_0x512d36(0x1fd)](_0x4d91d7);if(_0x2be68b){const _0x516cf7=_0x4c7b2d[_0x4d91d7],_0x4d68bc=_0x109f70(_0x516cf7[_0x512d36(0x17e)],_0x516cf7[_0x512d36(0x1c8)]);_0x408257+=_0x4d68bc;}}return _0x408257;};let _0x3ad6d8=0x0;if(_0x38c103===_0x1633f8(0x1f6)){const _0x4880d5=[];if(_0x505434?.[_0x38c103])_0x3ad6d8+=_0x4d7f32(_0x505434[_0x38c103],_0x4880d5,_0x1633f8(0x215),_0x1633f8(0x22a));if(_0x1a01df?.[_0x38c103])_0x3ad6d8+=_0x4d7f32(_0x1a01df[_0x38c103],_0x4880d5,_0x1633f8(0x215),_0x1633f8(0x1c2));}else{switch(_0x22b3ad){case _0x1633f8(0x160):_0x3701aa=$dataItems;break;case _0x1633f8(0x158):_0x3701aa=$dataWeapons;break;case'armor':_0x3701aa=$dataArmors;break;default:_0x3701aa=[];}const _0x467e5b=[];if(_0x505434?.[_0x38c103]?.[_0x22b3ad])_0x3ad6d8+=_0x4d7f32(_0x505434[_0x38c103][_0x22b3ad],_0x467e5b,_0x1633f8(0x189),'personal');if(_0x1a01df?.[_0x38c103]?.[_0x22b3ad])_0x3ad6d8+=_0x4d7f32(_0x1a01df[_0x38c103][_0x22b3ad],_0x467e5b,_0x1633f8(0x189),'default');}return _0x16a88e+_0x3ad6d8;}function _0x57afd4(_0x42c430,_0x29ae1f,_0xc71158,_0x25c14b){const _0x36c399=_0xaea421;_0x42c430=_0xabdfe9(_0x42c430,_0x29ae1f,_0x36c399(0x22a)),_0x42c430=_0xabdfe9(_0x42c430,_0x29ae1f,_0x36c399(0x15b),$gameMap['mapId']());const _0x5b3ae3=$dataMap[_0x36c399(0x182)]['difficulty'];_0x5b3ae3&&(_0x42c430=_0xabdfe9(_0x42c430,_0x29ae1f,'byMapDifficulty',_0x5b3ae3));const _0x274702=$gameMap['regionId'](_0xc71158,_0x25c14b);if(_0x274702>0x0)_0x42c430=_0xabdfe9(_0x42c430,_0x29ae1f,'byRegionId',_0x274702);return _0x42c430=_0xabdfe9(_0x42c430,_0x29ae1f,_0x36c399(0x19a),$gameScreen[_0x36c399(0x146)](),$gameScreen['weatherPower']()),_0x42c430=_0xabdfe9(_0x42c430,_0x29ae1f,_0x36c399(0x17c)),_0x42c430=_0x281e6f(_0x42c430,_0x29ae1f,_0x36c399(0x199),_0x36c399(0x160)),_0x42c430=_0x281e6f(_0x42c430,_0x29ae1f,'byItem',_0x36c399(0x158)),_0x42c430=_0x281e6f(_0x42c430,_0x29ae1f,_0x36c399(0x199),_0x36c399(0x152)),_0x42c430=_0x281e6f(_0x42c430,_0x29ae1f,'byClass'),_0x42c430;}function _0x2165bc(_0x368e75,_0x4c55eb,_0x59876e,_0x3abc30,_0x53f077){const _0x244aae=_0xaea421;let _0x13c88c=0x1;const _0x8fe14f=_0x163f52[_0x244aae(0x16e)][_0x244aae(0x224)]?.[_0x3abc30],{levelType:_0x12c9c5,fixedLevel:_0x341c4a,partyLevels:_0xd152cb,gameVariable:_0x4fd72d,positiveVariance:_0x619611,negativeVariance:_0x26bac8,minLevel:_0x36ed51,maxLevel:_0xe671fb}=_0x8fe14f||{},{levelType:_0x3fe7b8,fixedLevel:_0x561d67,partyLevels:_0x371b86,gameVariable:_0x292b59,positiveVariance:_0x4d5a70,negativeVariance:_0x52adb4,minLevel:_0x5f27de,maxLevel:_0x25aa71}=_0x59876e||{};let _0x25aca5,_0x55b550;_0x8fe14f?(_0x25aca5=_0x12c9c5,_0x55b550=_0x244aae(0x226)):(_0x25aca5=_0x3fe7b8,_0x55b550=_0x244aae(0x200));const _0x41d16f=(_0x196837,_0x362b38,_0x12b682)=>{const _0x40dd27=_0x244aae;return _0x55b550===_0x40dd27(0x226)?_0x362b38??_0x196837:_0x12b682??_0x196837;};if(_0x25aca5){switch(_0x25aca5){case _0x244aae(0x237):break;case'fixedValue':_0x13c88c=_0x41d16f(_0x13c88c,_0x341c4a,_0x561d67);break;case _0x244aae(0x181):_0x13c88c=_0x41d16f(_0x13c88c,_0x41a53f(_0xd152cb),_0x41a53f(_0x371b86));break;case'gameVariable':_0x13c88c=_0x41d16f(_0x13c88c,$gameVariables['value'](_0x4fd72d),$gameVariables[_0x244aae(0x178)](_0x292b59));break;case _0x244aae(0x15a):_0x13c88c=_0x5cf21c(_0x368e75,_0x4c55eb,_0x59876e)||_0x13c88c;}if(_0x25aca5!=='static'){const _0x57fc65=_0x41d16f(0x0,_0x619611,_0x4d5a70),_0x5a2d5d=_0x41d16f(0x0,_0x26bac8,_0x52adb4);_0x13c88c=Math[_0x244aae(0x1a9)](0x1,Math[_0x244aae(0x157)](Math['random']()*(_0x13c88c+_0x57fc65-(_0x13c88c-_0x5a2d5d)+0x1))+(_0x13c88c-_0x5a2d5d)),_0x13c88c=_0x57afd4(_0x13c88c,_0x53f077,_0x368e75,_0x4c55eb);const _0xd225e3=_0x41d16f(0x1,_0x36ed51,_0x5f27de),_0x5355ea=_0x41d16f(0x16345785d8a0000,_0xe671fb,_0x25aa71);_0x13c88c=_0x13c88c[_0x244aae(0x1dc)](_0xd225e3,_0x5355ea);}}return _0x13c88c;}function _0x48bddc(_0x462e6d,_0x5b2ce9,_0x501852){const _0x1e1beb=_0xaea421;let _0x1902ab,_0x25b3d6;const _0x240e24=_0x163f52[_0x1e1beb(0x16e)][_0x1e1beb(0x224)]?.[_0x501852],{statIncreaseType:_0x43b2d7,flatStatIncrease:_0x176760,relativeStatIncrease:_0x2ae75c}=_0x240e24||{},{statIncreaseType:_0xf65f2c,flatStatIncrease:_0x38882d,relativeStatIncrease:_0x44ffa1}=_0x5b2ce9||{};_0x240e24?(_0x1902ab=_0x43b2d7,_0x25b3d6=_0x1e1beb(0x226)):(_0x1902ab=_0xf65f2c,_0x25b3d6=_0x1e1beb(0x200));const _0x16d9ac=(_0x34a723,_0x529b71,_0x16386e,_0x44dec1=null,_0x42fb45=null)=>{const _0x474aa5=_0x1e1beb,_0x1be8b9=_0x25b3d6===_0x474aa5(0x226)?_0x34a723||_0x1165d7:_0x529b71||_0x1165d7,_0x1090d4=_0x44dec1||_0x42fb45?_0x25b3d6===_0x474aa5(0x226)?_0x44dec1||_0x1165d7:_0x42fb45||_0x1165d7:null,_0x3eb1cd=_0x44dec1||_0x42fb45?_0x16386e==='relative'?_0x474aa5(0x18b):_0x474aa5(0x1e5):null,_0x2a8c64=Object[_0x474aa5(0x217)](_0x1be8b9),_0x4cef6d=_0x1090d4?Object[_0x474aa5(0x217)](_0x1090d4):null;for(let _0x38032a=0x0;_0x38032a<_0x462e6d[_0x474aa5(0x1bc)][_0x474aa5(0x20a)];_0x38032a++){const _0x493531=_0x1be8b9[_0x2a8c64[_0x38032a]],_0x267efe=_0x1090d4?_0x1090d4[_0x4cef6d[_0x38032a]]:null;for(let _0x1dff3b=0x0;_0x1dff3b<_0x462e6d['level']-0x1;_0x1dff3b++){_0x462e6d[_0x474aa5(0x1bc)][_0x38032a]=_0x5d81cc(_0x462e6d[_0x474aa5(0x1bc)][_0x38032a],_0x493531,_0x16386e);if(_0x1090d4)_0x462e6d[_0x474aa5(0x1bc)][_0x38032a]=_0x5d81cc(_0x462e6d['params'][_0x38032a],_0x267efe,_0x3eb1cd);}}for(let _0xc15d0=0x0;_0xc15d0<_0x462e6d['level']-0x1;_0xc15d0++){_0x462e6d[_0x474aa5(0x19f)]=_0x5d81cc(_0x462e6d[_0x474aa5(0x19f)],_0x1be8b9[_0x474aa5(0x19f)],_0x16386e),_0x462e6d[_0x474aa5(0x22d)]=_0x5d81cc(_0x462e6d[_0x474aa5(0x22d)],_0x1be8b9[_0x474aa5(0x22d)],_0x16386e),_0x1090d4&&(_0x462e6d['exp']=_0x5d81cc(_0x462e6d['exp'],_0x1090d4[_0x474aa5(0x19f)],_0x3eb1cd),_0x462e6d[_0x474aa5(0x22d)]=_0x5d81cc(_0x462e6d['gold'],_0x1090d4[_0x474aa5(0x22d)],_0x3eb1cd));}},_0x5d81cc=(_0x58c515,_0x4dbb63,_0x1affe4)=>{const _0x4f6f1e=_0x1e1beb;return _0x1affe4==='flat'?_0x58c515+_0x4dbb63:Math[_0x4f6f1e(0x1d5)](_0x58c515*(0x1+_0x4dbb63/0x64));};if(_0x1902ab){let _0x9977ed,_0x1546db;switch(_0x1902ab){case'flat':_0x16d9ac(_0x176760,_0x38882d,_0x1e1beb(0x18b));break;case _0x1e1beb(0x1e5):_0x16d9ac(_0x2ae75c,_0x44ffa1,'relative');break;case _0x1e1beb(0x15e):_0x16d9ac(_0x2ae75c,_0x44ffa1,_0x1e1beb(0x1e5),_0x176760,_0x38882d);}}return _0x462e6d;}function _0x4521b0(_0x5654ac,_0x773ea0,_0xe01e2b,_0x4fc894){const _0x2c0cc3=_0xaea421,_0x5964cd=_0x163f52['param']['perEnemyInstance']?.[_0xe01e2b],_0x3b867d=_0x5964cd?_0x5964cd[_0x4fc894+_0x2c0cc3(0x1cf)]:_0x773ea0[_0x4fc894+'PerLevel'];if(!_0x3b867d)return _0x5654ac;let _0x411aa5=[];for(let _0x8e93db=0x1;_0x8e93db<=_0x5654ac[_0x2c0cc3(0x1f2)];_0x8e93db++){if(_0x3b867d[_0x8e93db])_0x411aa5[_0x2c0cc3(0x1ee)](..._0x3b867d[_0x8e93db]);}const _0x3c5a5a=_0x4fc894===_0x2c0cc3(0x212)?_0x2c0cc3(0x1b3):_0x2c0cc3(0x164),_0x4d121b=_0x411aa5[_0x2c0cc3(0x1a0)](_0x5621d0=>_0x5654ac[_0x3c5a5a][_0x5621d0])[_0x2c0cc3(0x218)](_0x10f2a9=>_0x10f2a9);return _0x5654ac[_0x3c5a5a]=_0x4d121b,_0x5654ac;}function _0x3db8dc(_0x45d1a9,_0x588342,_0x37bc4c){const _0x44c4b1=_0xaea421,_0x21aca8=_0x163f52[_0x44c4b1(0x16e)][_0x44c4b1(0x224)]?.[_0x37bc4c],_0x3d7198=_0x21aca8?_0x21aca8[_0x44c4b1(0x228)]:_0x588342[_0x44c4b1(0x228)];if(!_0x3d7198)return _0x45d1a9;let _0xbce87d=_0x32621b(_0x45d1a9['level'],Object[_0x44c4b1(0x217)](_0x3d7198));if(!_0xbce87d)return _0x45d1a9;let _0x1e5045=[];for(const _0xfb0f6d of _0x3d7198[_0xbce87d]){const {items:_0x244de0,weapons:_0x2e61d0,armor:_0x422402,probability:_0x3ebab9}=_0xfb0f6d,_0x479ec0=[_0x244de0,_0x2e61d0,_0x422402];_0x479ec0[_0x44c4b1(0x1b1)]((_0x34209b,_0x5ab96c)=>{const _0x12b1fe=_0x44c4b1;if(_0x34209b)for(const _0x566720 of _0x34209b){_0x1e5045[_0x12b1fe(0x1ee)]({'kind':_0x5ab96c+0x1,'dataId':_0x566720,'denominator':_0x3ebab9});}});}return _0x45d1a9[_0x44c4b1(0x19d)]=_0x1e5045,_0x45d1a9;}function _0x5cdddf(_0xfbf34,_0x5538a6,_0x19cf65){const _0x134b48=_0xaea421,_0x180def=_0x163f52['param'][_0x134b48(0x224)]?.[_0x19cf65],_0x411441=_0x180def?_0x180def[_0x134b48(0x20d)]:_0x5538a6[_0x134b48(0x20d)],_0x2808e6=_0x411441&&_0x32621b(_0xfbf34[_0x134b48(0x1f2)],Object[_0x134b48(0x217)](_0x411441));if(!_0x2808e6)return _0xfbf34;const {sideViewImageFile:_0x33c64e,frontViewImageFile:_0x235dc9}=_0x411441[_0x2808e6],_0x27d5cf=$dataSystem['optSideView'];return _0xfbf34['battlerName']=_0x27d5cf&&_0x33c64e||!_0x27d5cf&&_0x235dc9||_0xfbf34[_0x134b48(0x1ed)],_0xfbf34;}function _0x5a9836(_0x4099aa,_0x3ae987){const _0x16d97c=_0xaea421,{hpThreshold:_0x4607c1,percentHpThreshold:_0x6a14f7,fixedHpThreshold:_0xbdb2db}=_0x163f52['param'][_0x16d97c(0x1dd)]||{},_0x1c9850=_0x57fd35=>{const _0xf9ad83=_0x16d97c;if(_0x57fd35[_0xf9ad83(0x204)]())return![];const {hp:_0x59241b,mhp:_0x46411e}=_0x57fd35;if(_0x4607c1===_0xf9ad83(0x1da))return _0x59241b<Math[_0xf9ad83(0x1d5)](_0x6a14f7*_0x46411e);else{if(_0x4607c1==='fixed')return _0x59241b<_0xbdb2db;}return![];},_0x1a91f6=_0x4099aa[_0x16d97c(0x1b5)]();if(_0x3ae987===_0x16d97c(0x19c))return _0x1a91f6[_0x16d97c(0x198)](_0x1c9850);else{if(_0x3ae987==='all')return _0x1a91f6[_0x16d97c(0x218)](_0x3ec16a=>!_0x3ec16a[_0x16d97c(0x204)]())[_0x16d97c(0x17d)](_0x1c9850);}return![];}function _0x32621b(_0x32e8f1,_0x43b075){let _0x4d59aa,_0xf97736=Infinity;for(let _0x314c2b of _0x43b075){_0x314c2b=+_0x314c2b,_0x314c2b<=_0x32e8f1&&_0x32e8f1-_0x314c2b<_0xf97736&&(_0x4d59aa=_0x314c2b,_0xf97736=_0x32e8f1-_0x314c2b);}return _0x4d59aa;}function _0x349b77(_0x1b4350,_0x181af5){let _0x36d454=0x0,_0x243467=0x0;if(_0x1b4350!==''||_0x181af5!==''){_0x36d454=_0x1b4350===''?0x0:_0x1b4350,_0x243467=_0x181af5===''?_0x36d454:_0x181af5;if(_0x36d454>_0x243467){const _0x537443=_0x36d454;_0x36d454=_0x243467,_0x243467=_0x537443;}}return[_0x36d454,_0x243467];}function _0x33849e(_0x92307c){const _0x221fe5=_0xaea421;return _0x92307c[_0x221fe5(0x21b)](0x0)['toUpperCase']()+_0x92307c[_0x221fe5(0x1bd)](0x1);}String[_0xaea421(0x156)][_0xaea421(0x14d)]=function(_0x52eb10){const _0x33c329=_0xaea421,_0x23fb6c=Object[_0x33c329(0x217)](_0x52eb10),_0x51721c=Object[_0x33c329(0x20e)](_0x52eb10);return new Function(..._0x23fb6c,'return\x20`'+this+'`;')(..._0x51721c);};function _0x32614e(_0x5496a3,_0x28437f,_0xabd87d,_0x1f2140=null){const _0x2e7b81=_0xaea421,_0x3edb9a=_0x163f52[_0x2e7b81(0x16e)][_0x2e7b81(0x224)]?.[_0x28437f];if(_0x3edb9a?.['levelType']===_0x2e7b81(0x237))return $dataEnemies[_0x5496a3];_0x163f52[_0x2e7b81(0x16e)]['idConversion']=_0x163f52[_0x2e7b81(0x16e)]['idConversion']||{};if(!_0xabd87d)_0xabd87d=$gameTemp[_0x2e7b81(0x18e)]||null;const _0x23a71e=_0xabd87d?$dataMap[_0x2e7b81(0x172)][_0xabd87d]:null,_0x46aab5=_0x23a71e?_0x23a71e['x']:$gamePlayer['x'],_0x317144=_0x23a71e?_0x23a71e['y']:$gamePlayer['y'];let _0x350103=JSON['parse'](JSON[_0x2e7b81(0x1e3)]($dataEnemies[_0x5496a3]));_0x350103['id']=Math[_0x2e7b81(0x1a9)](...$dataEnemies['slice'](0x1)['map'](_0x2c20da=>+_0x2c20da['id']))+0x1,_0x163f52[_0x2e7b81(0x16e)][_0x2e7b81(0x17a)][_0x350103['id']]=_0x5496a3;const _0x182153=_0x163f52['param'][_0x2e7b81(0x1ca)][_0x5496a3],_0x2b6676=_0x182153||_0x163f52[_0x2e7b81(0x16e)]['default'];_0x350103[_0x2e7b81(0x1f2)]=_0x1f2140?.[_0x2e7b81(0x1f2)]||_0x2165bc(_0x46aab5,_0x317144,_0x2b6676,_0x28437f,_0x5496a3),_0x350103=_0x48bddc(_0x350103,_0x2b6676,_0x28437f);const _0x2698e5=_0x3edb9a?.['levelType']||_0x2b6676[_0x2e7b81(0x206)];return _0x2698e5&&_0x2698e5!=='static'&&(_0x350103=_0x4521b0(_0x350103,_0x2b6676,_0x28437f,_0x2e7b81(0x212)),_0x350103=_0x4521b0(_0x350103,_0x2b6676,_0x28437f,_0x2e7b81(0x164)),_0x350103=_0x3db8dc(_0x350103,_0x2b6676,_0x28437f),(_0x2b6676===_0x182153||_0x3edb9a?.[_0x2e7b81(0x20d)])&&(_0x350103=_0x5cdddf(_0x350103,_0x2b6676,_0x28437f))),$dataEnemies[_0x350103['id']]=_0x350103,_0x350103;};function _0x59564f(_0x3d73b2){const _0x242459=_0xaea421;for(const _0x5a049c of $dataMap[_0x242459(0x172)][_0x3d73b2][_0x242459(0x1b9)]){for(const _0x19c8d1 of _0x5a049c[_0x242459(0x1ec)]){if(_0x19c8d1[_0x242459(0x177)]===0x12d)switch(_0x19c8d1['parameters'][0x0]){case 0x0:return _0x19c8d1[_0x242459(0x1d7)][0x1];case 0x1:return $gameVariables['value'](_0x19c8d1[_0x242459(0x1d7)][0x1]);case 0x2:return $gamePlayer[_0x242459(0x16b)]();}}}return null;}Object[_0xaea421(0x184)](Game_Enemy[_0xaea421(0x156)],_0xaea421(0x1f2),{'get':function(){const _0x5dfe27=_0xaea421;return this[_0x5dfe27(0x179)]===undefined&&(this[_0x5dfe27(0x179)]=0x1),this[_0x5dfe27(0x179)];},'set':function(_0x1f60c1){const _0x3c0ac2=_0xaea421;this[_0x3c0ac2(0x179)]=_0x1f60c1;},'configurable':!![]});const _0x55a9ac=Game_Interpreter['prototype'][_0xaea421(0x1b6)];Game_Interpreter['prototype'][_0xaea421(0x1b6)]=function(_0x556993,_0x5a3107){const _0xc488d=_0xaea421,_0x550ff2=_0x556993[_0xc488d(0x198)](_0x2ac9cf=>_0x2ac9cf['code']===0x12d);if(_0x550ff2)$gameTemp[_0xc488d(0x18e)]=_0x5a3107;_0x55a9ac[_0xc488d(0x222)](this,_0x556993,_0x5a3107);};const _0xa9275d=Game_Enemy[_0xaea421(0x156)][_0xaea421(0x1b6)];Game_Enemy[_0xaea421(0x156)][_0xaea421(0x1b6)]=function(_0x50a15c,_0x30662f,_0x2053b6,_0xbaeaa4=null){const _0x112404=_0xaea421,_0x2282ec=$gameMap['mapId'](),_0x4f4be3=_0xbaeaa4?.[_0x112404(0x1d2)]??$gameTroop[_0x112404(0x1d4)]['length'],_0x57215c=$gameTemp[_0x112404(0x18e)]||null;let _0xb7918=null,_0x46c4f9;if(_0x57215c)_0xb7918=_0x59564f(_0x57215c);const _0x559b77=COCOMODE[_0x112404(0x187)]?.[_0x112404(0x22f)]?.['troopMapping']?.[_0x2282ec]?.[_0x57215c]?.[_0xb7918]?.[_0x4f4be3];if(_0xb7918&&_0x559b77)_0x46c4f9=_0x559b77,$dataEnemies[_0x46c4f9['id']]=_0x46c4f9;else{_0x46c4f9=_0x32614e(_0x50a15c,_0x4f4be3,_0x57215c,_0xbaeaa4);if(_0x57215c&&COCOMODE['interPlugin']?.[_0x112404(0x1c4)]?.[_0x57215c]){const _0x240590=_0x105d3c(COCOMODE[_0x112404(0x187)],['levelTransformation',_0x112404(0x14b),_0x2282ec,_0x57215c,_0xb7918]);_0x240590[_0x112404(0x1ee)](_0x46c4f9);}}_0xa9275d[_0x112404(0x222)](this,_0x46c4f9['id'],_0x30662f,_0x2053b6),this[_0x112404(0x1f2)]=this[_0x112404(0x20f)]();if(_0xbaeaa4){const [_0x11b126,_0x1f7d44]=_0x46c4f9['params'];this[_0x112404(0x1a8)](Math[_0x112404(0x1d5)](_0xbaeaa4['hpRatio']*_0x11b126)[_0x112404(0x1dc)](0x1,_0x11b126)),this[_0x112404(0x1c1)](Math[_0x112404(0x1d5)](_0xbaeaa4[_0x112404(0x16f)]*_0x1f7d44)[_0x112404(0x1dc)](0x0,_0x1f7d44)),this['setTp'](_0xbaeaa4['tp']);}},Sprite_Battler[_0xaea421(0x156)][_0xaea421(0x18d)]=function(){const _0x266525=_0xaea421,_0x3d7ead=this[_0x266525(0x20c)];if(!_0x3d7ead||_0x3d7ead[_0x266525(0x1d6)]||_0x3d7ead[_0x266525(0x232)]<=0x0){this[_0x266525(0x1cb)]&&(this['_nameSprite'][_0x266525(0x1d8)]=![]);return;}!this[_0x266525(0x1cb)]&&(this[_0x266525(0x1cb)]=new Sprite(new Bitmap(0xc8,0x30)),this[_0x266525(0x1cb)][_0x266525(0x180)]['x']=0.5,this['_nameSprite']['anchor']['y']=0x1,SceneManager[_0x266525(0x168)]['addChild'](this[_0x266525(0x1cb)]),this[_0x266525(0x1cb)]['visible']=!![]);if(this['changeLabel']){const _0x489fff=_0x3d7ead[_0x266525(0x1f5)](),_0x1a15d9=_0x3d7ead['level'],_0x1d0b76=_0x163f52[_0x266525(0x16e)]['levelDisplayFormat'],_0x4dc2df=_0x1d0b76[_0x266525(0x1e4)](/%(\d+)/g,(_0x3be2d3,_0x53f006)=>{const _0x4bedc9=_0x266525;return _0x53f006==='1'?_0x4bedc9(0x186):_0x53f006==='2'?'${name}':_0x3be2d3;}),_0x3e4bc4=_0x4dc2df[_0x266525(0x14d)]({'level':_0x1a15d9,'name':_0x489fff}),_0x375b3a=ColorManager[_0x266525(0x1fa)]();this[_0x266525(0x1cb)][_0x266525(0x18f)][_0x266525(0x16a)](),this['_nameSprite'][_0x266525(0x18f)][_0x266525(0x219)]=_0x375b3a,this[_0x266525(0x1cb)][_0x266525(0x18f)][_0x266525(0x1ba)]=0x12,this['_nameSprite']['bitmap'][_0x266525(0x16c)](_0x3e4bc4,0x0,0x0,0xc8,0x30,_0x266525(0x20b)),this[_0x266525(0x169)]=![];}this[_0x266525(0x1cb)]['x']=this['x'],this['_nameSprite']['y']=this['y']-this[_0x266525(0x17f)]-0x14;};const _0x4af5e0=Sprite_Battler['prototype'][_0xaea421(0x1d9)];Sprite_Battler[_0xaea421(0x156)]['update']=function(){const _0x2ac559=_0xaea421;_0x4af5e0[_0x2ac559(0x222)](this);if(_0x163f52[_0x2ac559(0x16e)][_0x2ac559(0x1f8)])this[_0x2ac559(0x18d)]();};const _0xeb95cf=Sprite_Battler['prototype'][_0xaea421(0x1fe)];Sprite_Battler['prototype'][_0xaea421(0x1fe)]=function(_0x2f0db6){const _0x3e6971=_0xaea421;this['_nameSprite']&&(SceneManager[_0x3e6971(0x168)]['removeChild'](this[_0x3e6971(0x1cb)]),this['_nameSprite']=null),_0xeb95cf[_0x3e6971(0x222)](this,_0x2f0db6);};const _0x14a8f5=DataManager[_0xaea421(0x1f4)];DataManager['onLoad']=function(_0x37dde4){const _0xb093ad=_0xaea421;_0x14a8f5[_0xb093ad(0x222)](this,_0x37dde4),_0x37dde4===$dataEnemies&&(_0x163f52[_0xb093ad(0x16e)][_0xb093ad(0x1ea)]=$dataEnemies[_0xb093ad(0x1bd)](0x1)['reduce']((_0x3f9a85,_0x5b1a7a)=>{return _0x5b1a7a?Math['max'](_0x3f9a85,_0x5b1a7a['id']):_0x3f9a85;},0x0));},_Game_Troop_setup=Game_Troop['prototype']['setup'],Game_Troop[_0xaea421(0x156)][_0xaea421(0x1b6)]=function(_0xfc9fb9){const _0x1dff7e=_0xaea421;$dataEnemies=$dataEnemies[_0x1dff7e(0x1bd)](0x1)['filter'](_0x24b8f8=>_0x24b8f8['id']<=_0x163f52['param']['highestEnemyId']),$dataEnemies[_0x1dff7e(0x203)](null),_0x163f52[_0x1dff7e(0x16e)][_0x1dff7e(0x17a)]={},_Game_Troop_setup[_0x1dff7e(0x222)](this,_0xfc9fb9);};const _0x402fbe=Game_Action[_0xaea421(0x156)][_0xaea421(0x21a)];Game_Action[_0xaea421(0x156)][_0xaea421(0x21a)]=function(_0xafcac6){const _0x2dbbf6=_0xaea421,{scope:_0x93048,meta:_0x4c40dd}=this['item']();function _0x2cec39(_0x2e51ff,_0x281ee7,_0x19cf25,_0x77cb3e){const _0x1094ce=_0x3346;return _0x109f70(_0x2e51ff,_0x281ee7)[_0x1094ce(0x1dc)](_0x19cf25,_0x77cb3e);}_0x402fbe['call'](this,_0xafcac6);switch(_0x93048){case 0x1:case 0x7:this['usageLimit']=0x1;break;case 0x2:this[_0x2dbbf6(0x14c)]=0x0;for(const _0x162a08 of $gameTroop[_0x2dbbf6(0x1b5)]()){if(!_0x162a08['isHidden']())this['usageLimit']+=0x1;}}if(!_0x4c40dd['decrease\x20level']||this[_0x2dbbf6(0x1a7)]&&this['usage']>=this[_0x2dbbf6(0x14c)]||_0x93048!==0x1&&_0x93048!==0x2&&_0x93048!==0x7)return;let _0x3bbf72,_0x180a14,_0x593993=0x0,_0x530f2a=0x0,_0x5ba35d;const _0x5f0da8=[_0x2dbbf6(0x18b),_0x2dbbf6(0x1e5)][_0x2dbbf6(0x1fd)](_0x4c40dd[_0x2dbbf6(0x1c7)]?.[_0x2dbbf6(0x21c)]())?_0x4c40dd[_0x2dbbf6(0x1c7)][_0x2dbbf6(0x21c)]():null;if(_0x5f0da8===_0x2dbbf6(0x18b)&&!isNaN(_0x4c40dd[_0x2dbbf6(0x18b)]))_0x3bbf72=+_0x4c40dd[_0x2dbbf6(0x18b)];else _0x5f0da8===_0x2dbbf6(0x1e5)&&!isNaN(_0x4c40dd[_0x2dbbf6(0x1e5)])&&(_0x180a14=(+_0x4c40dd[_0x2dbbf6(0x1e5)])[_0x2dbbf6(0x1dc)](0x0,0x64));if(!isNaN(_0x4c40dd[_0x2dbbf6(0x162)]))_0x593993=+_0x4c40dd[_0x2dbbf6(0x162)];if(!isNaN(_0x4c40dd[_0x2dbbf6(0x196)]))_0x530f2a=+_0x4c40dd[_0x2dbbf6(0x196)];if(_0x4c40dd[_0x2dbbf6(0x1ac)]?.[_0x2dbbf6(0x21c)]()===_0x2dbbf6(0x1e9))_0x5ba35d=_0x4c40dd[_0x2dbbf6(0x1ac)]['trim']();if(_0x5f0da8&&(_0x3bbf72||_0x180a14)){let {level:_0x58128d,tp:_0x302272}=_0xafcac6,_0x410865=_0xafcac6['hp']/_0xafcac6[_0x2dbbf6(0x14e)],_0x21696b=_0xafcac6[_0x2dbbf6(0x183)]>0x0?_0xafcac6['mp']/_0xafcac6[_0x2dbbf6(0x183)]:0x1,_0x3fe250=_0x163f52[_0x2dbbf6(0x16e)][_0x2dbbf6(0x17a)][_0xafcac6[_0x2dbbf6(0x192)]()],_0x562ca8=$gameTroop['members']()[_0x2dbbf6(0x1bb)](_0xafcac6),_0x4ed2d1;if(_0x5f0da8===_0x2dbbf6(0x18b))_0x4ed2d1=_0x2cec39(_0x3bbf72-_0x530f2a,_0x3bbf72+_0x593993,0x0,_0x58128d-0x1);else _0x5f0da8===_0x2dbbf6(0x1e5)&&(_0x4ed2d1=Math[_0x2dbbf6(0x1e0)](_0x58128d*(_0x180a14/0x64)),_0x4ed2d1=_0x2cec39(_0x4ed2d1-_0x530f2a,_0x4ed2d1+_0x593993,0x0,_0x58128d-0x1));let _0x510b6f,_0x16070c;!_0xafcac6[_0x2dbbf6(0x1ae)]()[_0x2dbbf6(0x1b7)]&&!_0xafcac6[_0x2dbbf6(0x1ae)]()[_0x2dbbf6(0x1e8)]?(_0x58128d-=_0x4ed2d1,_0x510b6f=_0x2dbbf6(0x185),_0x16070c=_0x2dbbf6(0x201)):_0x5ba35d===_0x2dbbf6(0x1e9)?(_0x58128d+=_0x4ed2d1,_0x510b6f='increased',_0x16070c=_0x2dbbf6(0x211)):(_0x510b6f=_0x2dbbf6(0x185),_0x16070c=_0x2dbbf6(0x211),_0x4ed2d1=0x0);const _0x41f7e0={'level':_0x58128d,'hpRatio':_0x410865,'mpRatio':_0x21696b,'tp':_0x302272,'enemyIndex':_0x562ca8};_0xafcac6[_0x2dbbf6(0x1a5)](_0x2dbbf6(0x19b)),_0xafcac6['setup'](_0x3fe250,_0xafcac6['screenX'](),_0xafcac6[_0x2dbbf6(0x220)](),_0x41f7e0),setTimeout(()=>{const _0x4bc54f=_0x2dbbf6;_0xafcac6[_0x4bc54f(0x1a5)](_0x4bc54f(0x19b));},0xfa),setTimeout(()=>{const _0x5711e2=_0x2dbbf6;let _0x8a0358;for(let _0x1dc572=0x0;_0x1dc572<$spriteset[_0x5711e2(0x234)]['length'];_0x1dc572++){if($spriteset[_0x5711e2(0x234)][_0x1dc572]['_battler']===$gameTroop['members']()[_0x562ca8]){_0x8a0358=$spriteset[_0x5711e2(0x234)][_0x1dc572];break;}}let _0x433cd4=_0x16070c+'\x20'+_0xafcac6[_0x5711e2(0x1f5)]()+_0x5711e2(0x15d)+_0x510b6f+_0x5711e2(0x1be)+_0x4ed2d1+'!';_0x8a0358[_0x5711e2(0x1c3)](_0x433cd4,_0x16070c);},0x64);if(_0x59f2c8[_0x2dbbf6(0x1f8)]){const _0x53a787=$spriteset[_0x2dbbf6(0x234)][_0x2dbbf6(0x195)](_0xea3bc4=>_0xea3bc4[_0x2dbbf6(0x20c)]===_0xafcac6);_0x53a787['changeLabel']=!![];}this[_0x2dbbf6(0x1a7)]=this[_0x2dbbf6(0x1a7)]?this[_0x2dbbf6(0x1a7)]+0x1:0x1;}},_BattleManager_endBattle=BattleManager[_0xaea421(0x167)],BattleManager['endBattle']=function(_0x1e8478){const _0x38b3e3=_0xaea421;_BattleManager_endBattle['call'](this,_0x1e8478);if(_0x163f52[_0x38b3e3(0x16e)][_0x38b3e3(0x224)])_0x163f52[_0x38b3e3(0x16e)][_0x38b3e3(0x224)]=null;if(_0x163f52['param'][_0x38b3e3(0x1dd)])_0x163f52[_0x38b3e3(0x16e)][_0x38b3e3(0x1dd)]=null;};const _0x2832a3=BattleManager[_0xaea421(0x1b4)];BattleManager['startBattle']=function(){const _0x4a7fac=_0xaea421;if(_0x59f2c8[_0x4a7fac(0x1f8)])for(const _0x1dcc20 of $spriteset[_0x4a7fac(0x234)]){_0x1dcc20['changeLabel']=!![];}_0x2832a3[_0x4a7fac(0x222)](this);},Sprite_Enemy[_0xaea421(0x156)][_0xaea421(0x1c3)]=function(_0x2482da,_0x1717cd,_0x16a9f0=0xb4){const _0x145d69=_0xaea421,_0x5badbf=new Sprite(new Bitmap(0x1f4,0x30));_0x5badbf['bitmap'][_0x145d69(0x1ba)]=0x14,_0x5badbf['bitmap']['textColor']=_0x1717cd===_0x145d69(0x201)?'#00FF00':_0x145d69(0x22e),_0x5badbf[_0x145d69(0x18f)][_0x145d69(0x16c)](_0x2482da,0x0,0x0,0x1f4,0x30,'center'),_0x5badbf[_0x145d69(0x180)][_0x145d69(0x1ce)](0.5,0x1),_0x5badbf['x']=Math[_0x145d69(0x1a9)](0x96,this['x']),_0x5badbf['y']=Math['max'](0x32,this['y']-this['height']-0x28),_0x5badbf[_0x145d69(0x15c)]=function(_0x6664cb){const _0x422435=_0x145d69;this['x']=Math['max'](0x96,_0x6664cb['x']),this['y']=Math['max'](0x32,_0x6664cb['y']-_0x6664cb[_0x422435(0x17f)]-0x32);},_0x5badbf[_0x145d69(0x1d9)]=()=>_0x5badbf[_0x145d69(0x15c)](this),this[_0x145d69(0x15f)][_0x145d69(0x1df)](_0x5badbf),setTimeout(()=>{const _0x2e614b=_0x145d69;this['parent'][_0x2e614b(0x21f)](_0x5badbf),_0x5badbf[_0x2e614b(0x18f)][_0x2e614b(0x1fe)]();},_0x16a9f0*(0x3e8/0x3c));};const _0x2b6010=Game_Interpreter[_0xaea421(0x156)]['update'];Game_Interpreter[_0xaea421(0x156)]['update']=function(){const _0x3dc9d6=_0xaea421,_0x16e775=COCOMODE['interPlugin']?.[_0x3dc9d6(0x22f)],_0xb0ad76=_0x16e775?.[_0x3dc9d6(0x231)];if(_0xb0ad76?.[_0x3dc9d6(0x20a)]){const _0x341c42=_0x16e775[_0x3dc9d6(0x14b)]=_0x16e775[_0x3dc9d6(0x14b)]||{},[_0x45df18,_0x4ad126,_0x58f53c]=_0xb0ad76;if(!_0x341c42[_0x45df18]?.[_0x4ad126]?.[_0x58f53c]?.[_0x3dc9d6(0x20a)]){const _0x4da4a7=$dataTroops[_0x58f53c],_0x30e242=_0x105d3c(_0x341c42,[_0x45df18,_0x4ad126,_0x58f53c]);for(let _0x128756=0x0;_0x128756<_0x4da4a7[_0x3dc9d6(0x1b5)][_0x3dc9d6(0x20a)];_0x128756++){const _0x5c2522=_0x4da4a7[_0x3dc9d6(0x1b5)][_0x128756],_0x2b92dc=_0x32614e(_0x5c2522[_0x3dc9d6(0x192)],_0x128756,_0x4ad126,null);_0x30e242[_0x3dc9d6(0x1ee)](_0x2b92dc);}}_0x16e775[_0x3dc9d6(0x231)]=null;}_0x2b6010['call'](this);},PluginManager[_0xaea421(0x170)](_0x48cced,'enemyInstanceDefinitions',_0x39897f=>{const _0x38c966=_0xaea421;if(!_0x39897f[_0x38c966(0x159)])return;let _0x521cf7=[];try{_0x521cf7=JSON[_0x38c966(0x1eb)](_0x39897f['enemyInstanceDefinitions'])[_0x38c966(0x1a0)](_0x449989=>{const _0x21163d=_0x38c966;try{const _0x582030=JSON['parse'](_0x449989);if(!_0x582030['enemyIndex']||!_0x582030[_0x21163d(0x21e)])return null;_0x582030[_0x21163d(0x1d2)]=+_0x582030[_0x21163d(0x1d2)],_0x582030[_0x21163d(0x21e)]=JSON[_0x21163d(0x1eb)](_0x582030['enemyDefinitions']);if(!_0x582030['enemyDefinitions']||typeof _0x582030['enemyDefinitions']!==_0x21163d(0x1e7))return null;return _0x582030;}catch(_0x4db1a9){return console[_0x21163d(0x147)](_0x21163d(0x17b),_0x449989,_0x4db1a9),null;}})[_0x38c966(0x218)](_0x514f27=>_0x514f27!==null);}catch(_0x110f95){return console[_0x38c966(0x147)](_0x38c966(0x1f0),_0x39897f[_0x38c966(0x159)],_0x110f95),[];}if(!_0x521cf7['length'])return;_0x163f52[_0x38c966(0x16e)][_0x38c966(0x224)]={};const _0x1ea340=_0x163f52[_0x38c966(0x16e)][_0x38c966(0x224)];for(const _0x28a67a of _0x521cf7){if(_0x28a67a[_0x38c966(0x1d2)]==null||_0x28a67a[_0x38c966(0x1d2)]===''||!_0x28a67a[_0x38c966(0x21e)]['levelType'])continue;const _0x5bf682=_0x28a67a[_0x38c966(0x1d2)],_0x57d4c3=_0x28a67a[_0x38c966(0x21e)],{levelType:_0xf3ce63,fixedLevel:_0x5c03e2,partyLevels:_0x17ce7c,gameVariable:_0x5bbe37}=_0x57d4c3,_0x19844d=(_0x4fdfe2,_0x5c0143,_0x587acb=![])=>{_0x4fdfe2?_0x1ea340[_0x5bf682][_0x5c0143]=_0x587acb?+_0x4fdfe2:_0x4fdfe2:delete _0x1ea340[_0x5bf682];};_0x163f52['param'][_0x38c966(0x224)][_0x5bf682]={'levelType':_0xf3ce63};switch(_0xf3ce63){case _0x38c966(0x237):break;case _0x38c966(0x1a1):_0x19844d(_0x5c03e2,_0x38c966(0x174),!![]);break;case _0x38c966(0x181):_0x19844d(_0x17ce7c,'partyLevels');break;case _0x38c966(0x1c6):_0x19844d(_0x5bbe37,_0x38c966(0x1c6),!![]);break;}_0x1ea340[_0x5bf682]?.[_0x38c966(0x206)]&&_0x1ea340[_0x5bf682][_0x38c966(0x206)]!==_0x38c966(0x237)&&(_0x2e9e5b(_0x57d4c3,null,_0x5bf682),_0x143be8(_0x57d4c3,null,_0x5bf682),_0xaedcf2(_0x57d4c3,null,_0x5bf682),_0x82a7ad(_0x57d4c3,null,_0x5bf682));}!Object['keys'](_0x1ea340)[_0x38c966(0x20a)]&&delete _0x163f52[_0x38c966(0x16e)][_0x38c966(0x224)];}),PluginManager[_0xaea421(0x170)](_0x48cced,_0xaea421(0x21d),_0x31b9ae=>{const _0x8941c4=_0xaea421;if(!_0x31b9ae['changeLevelsMidBattle'])return;const _0xbb9cfa=JSON[_0x8941c4(0x1eb)](_0x31b9ae[_0x8941c4(0x21d)]);for(const _0x522c0f in _0xbb9cfa){const _0x374364=_0xbb9cfa[_0x522c0f];if(!_0x374364)continue;if(!isNaN(_0x374364))_0xbb9cfa[_0x522c0f]=+_0x374364;else typeof _0x374364===_0x8941c4(0x1f1)&&_0x374364[_0x8941c4(0x1a6)]('[')&&(_0xbb9cfa[_0x522c0f]=JSON[_0x8941c4(0x1eb)](_0x374364)['map'](Number));}const {whenToChangeLevels:_0x1f9ec5}=_0xbb9cfa;if(!_0x1f9ec5)return;const _0x333e70=_0x163f52[_0x8941c4(0x16e)][_0x8941c4(0x1dd)]={'whenToChangeLevels':_0x1f9ec5,'enemyIndices':_0xbb9cfa[_0x8941c4(0x1f9)]||[]};switch(_0x1f9ec5){case _0x8941c4(0x1fb):let [_0x14eaa1,_0x211ffd]=_0x349b77(_0xbb9cfa[_0x8941c4(0x155)],_0xbb9cfa['maxTurns']);if(_0x14eaa1<=0x0&&_0x211ffd<=0x0)return _0x163f52[_0x8941c4(0x16e)][_0x8941c4(0x1dd)]=null;if(_0x14eaa1===0x0)_0x14eaa1=0x1;_0x333e70[_0x8941c4(0x214)]=_0x109f70(_0x14eaa1,_0x211ffd);break;case _0x8941c4(0x153):case _0x8941c4(0x1aa):case _0x8941c4(0x1a4):case _0x8941c4(0x227):const {hpThreshold:_0x5358a6}=_0xbb9cfa;if(!_0x5358a6)return _0x163f52['param'][_0x8941c4(0x1dd)]=null;_0x333e70[_0x8941c4(0x235)]=_0x5358a6;if(_0x5358a6===_0x8941c4(0x1af)){let [_0x46ab2a,_0x2f3dd6]=_0x349b77(_0xbb9cfa[_0x8941c4(0x1d3)],_0xbb9cfa[_0x8941c4(0x14a)]);if(_0x46ab2a<=0x0&&_0x2f3dd6<=0x0)return _0x163f52[_0x8941c4(0x16e)][_0x8941c4(0x1dd)]=null;_0x333e70['fixedHpThreshold']=_0x109f70(_0x46ab2a,_0x2f3dd6);}else{if(_0x5358a6==='percentage'){let [_0x135fc5,_0x4143e8]=_0x349b77(_0xbb9cfa[_0x8941c4(0x239)],_0xbb9cfa['maxPercentHp']);if(_0x135fc5<=0x0&&_0x4143e8<=0x0)return _0x163f52[_0x8941c4(0x16e)][_0x8941c4(0x1dd)]=null;_0x333e70[_0x8941c4(0x1e2)]=_0x109f70(_0x135fc5,_0x4143e8)/0x64;}}break;}if(!_0x163f52[_0x8941c4(0x16e)][_0x8941c4(0x1dd)])return;_0x333e70[_0x8941c4(0x1cd)]=_0xbb9cfa['decreaseOrIncrease'];let [_0x51b02f,_0x27870b]=_0x349b77(_0xbb9cfa['minLevelChange'],_0xbb9cfa[_0x8941c4(0x1c9)]);if(_0x51b02f<=0x0&&_0x27870b<=0x0)return _0x163f52[_0x8941c4(0x16e)][_0x8941c4(0x1dd)]=null;_0x333e70[_0x8941c4(0x188)]=_0x109f70(_0x51b02f,_0x27870b);!_0x333e70['decreaseOrIncrease']||typeof _0x333e70[_0x8941c4(0x188)]!==_0x8941c4(0x230)?_0x163f52[_0x8941c4(0x16e)][_0x8941c4(0x1dd)]=null:_0x333e70['levelChanged']=![];const _0x427073=BattleManager[_0x8941c4(0x238)];BattleManager['updateTurn']=function(){const _0x4e7869=_0x8941c4;_0x427073[_0x4e7869(0x222)](this);const _0x592946=_0x163f52[_0x4e7869(0x16e)][_0x4e7869(0x1dd)]||{},{whenToChangeLevels:_0x43cda6,decreaseOrIncrease:_0x38f647,levelChange:_0x5bc74b,levelChanged:_0x126090,turnToChange:_0xd2d7b8,hpThreshold:_0x38d4e5,fixedHpThreshold:_0x109ba4,percentHpThreshold:_0x58da92,enemyIndices:_0x5606e8}=_0x592946;if(!_0x43cda6||!_0x38f647||!_0x5bc74b||_0x126090)return;let _0x3129f2=![];switch(_0x43cda6){case _0x4e7869(0x1fb):const _0x36b744=$gameTroop[_0x4e7869(0x173)]();if(_0x36b744===_0xd2d7b8)_0x3129f2=!![];break;case _0x4e7869(0x153):case _0x4e7869(0x1aa):case _0x4e7869(0x1a4):case _0x4e7869(0x227):if(_0x38d4e5===_0x4e7869(0x1af)&&_0x109ba4||_0x38d4e5===_0x4e7869(0x1da)&&_0x58da92){const _0x1d03ff=_0x43cda6['includes'](_0x4e7869(0x1cc))?$gameTroop:$gameParty,_0x5807f8=_0x43cda6[_0x4e7869(0x1a6)](_0x4e7869(0x19c))?'one':_0x4e7869(0x1d0);_0x3129f2=_0x5a9836(_0x1d03ff,_0x5807f8);}break;}if(!_0x3129f2)return;_0x592946[_0x4e7869(0x205)]=!![];const _0xab1bf=$gameTroop[_0x4e7869(0x1b5)]();if(!_0x5606e8['length'])_0x5606e8['push'](..._0xab1bf[_0x4e7869(0x1a0)]((_0x3b3c7a,_0x5312c3)=>_0x5312c3));let _0x387d4d={};for(const _0x184ec9 of _0x5606e8){const _0x1f6723=_0xab1bf[_0x184ec9];if(!_0x1f6723||_0x1f6723[_0x4e7869(0x1f3)]||_0x1f6723[_0x4e7869(0x204)]()||_0x1f6723['isDead']())continue;const _0x2f1f0f=_0x38f647===_0x4e7869(0x176)?Math[_0x4e7869(0x1a9)](0x1,_0x1f6723[_0x4e7869(0x1f2)]-_0x5bc74b):_0x1f6723[_0x4e7869(0x1f2)]+_0x5bc74b;_0x387d4d[_0x184ec9]={'changeAmount':Math[_0x4e7869(0x216)](_0x1f6723[_0x4e7869(0x1f2)]-_0x2f1f0f),'decreasedOrIncreased':_0x38f647===_0x4e7869(0x176)?_0x4e7869(0x185):_0x4e7869(0x1ab)};const _0x3f61da={'level':_0x2f1f0f,'hpRatio':_0x1f6723['hp']/_0x1f6723[_0x4e7869(0x14e)],'mpRatio':_0x1f6723[_0x4e7869(0x183)]>0x0?_0x1f6723['mp']/_0x1f6723['mmp']:0x1,'tp':_0x1f6723['tp'],'enemyIndex':_0x184ec9},_0x5d20cf=_0x163f52['param'][_0x4e7869(0x17a)][_0x1f6723[_0x4e7869(0x192)]()];_0x1f6723['requestEffect'](_0x4e7869(0x19b)),_0x1f6723[_0x4e7869(0x1b6)](_0x5d20cf,_0x1f6723['screenX'](),_0x1f6723['screenY'](),_0x3f61da),setTimeout(()=>{const _0x245445=_0x4e7869;_0x1f6723['requestEffect'](_0x245445(0x19b));},0xfa),_0x1f6723['customLevelChanged']=!![];}setTimeout(()=>{const _0x902e27=_0x4e7869;for(const _0x1939de in _0x387d4d){const _0x4461b0=$spriteset['_enemySprites']['find'](_0x58da5a=>_0x58da5a[_0x902e27(0x20c)]===_0xab1bf[_0x1939de]);if(!_0x4461b0||_0x4461b0['customChanged'])continue;const {decreasedOrIncreased:_0x2307fe,changeAmount:_0x1cbaa6}=_0x387d4d[_0x1939de],_0x22b771=_0x4461b0[_0x902e27(0x20c)][_0x902e27(0x1f5)]()+_0x902e27(0x15d)+_0x2307fe+_0x902e27(0x1be)+_0x1cbaa6+'!',_0x30ceca=_0x2307fe===_0x902e27(0x185)?'Action\x20succeeded!':_0x902e27(0x211);_0x4461b0[_0x902e27(0x1c3)](_0x22b771,_0x30ceca),_0x4461b0[_0x902e27(0x233)]=!![];if(_0x59f2c8[_0x902e27(0x1f8)])_0x4461b0['changeLabel']=!![];}},0x1f4);};});},COCOMODE[_0xf7143a(0x1d1)]();