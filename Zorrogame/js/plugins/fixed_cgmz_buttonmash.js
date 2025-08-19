/*:
 * @author Casper Gaming
 * @url https://www.caspergaming.com/plugins/cgmz/buttonmash/
 * @target MZ
 * @base CGMZ_Core
 * @orderAfter CGMZ_Core
 * @plugindesc Mash a button to fill a bar, for use in eventing
 * @help
 * ============================================================================
 * For terms and conditions using this plugin in your game please visit:
 * https://www.caspergaming.com/terms-of-use/
 * ============================================================================
 * Become a Patron to get access to beta/alpha plugins plus other goodies!
 * https://www.patreon.com/CasperGamingRPGM
 * ============================================================================
 * Version: Alpha R2
 * ----------------------------------------------------------------------------
 * Compatibility: Only tested with my CGMZ plugins.
 * Made for RPG Maker MZ 1.9.0
 * ----------------------------------------------------------------------------
 * Description: Mash a button to fill a bar, for use in eventing. The result
 * is provided to a variable for use in your events. You determine which
 * button or key needs to be pressed and how difficult the bar is to fill in
 * a time limit. You can also display a short text above the bar.
 * ----------------------------------------------------------------------------
 * Documentation:
 * ---------------------------Alpha Notes--------------------------------------
 * This plugin has many planned improvements over the course of its alpha
 * stage, including:
 *
 * 1) Make the button mash work in battle
 * 2) Allow infinite time with a cancel button if too hard for player
 * 3) Touch UI support
 * 4) Statistics tracking for things like events passed / attempted, etc.
 * 5) Variances for button mash settings
 * ------------------------------Set Up----------------------------------------
 * Set up your button mash events in the Events parameter, and note down the id
 * you assign to your button mash event. Then, use the Plugin Command "Start"
 * to start a button mash. Provide the id to your plugin command, and it will
 * start that id's button mash event.
 *
 * After the button mash ends, the result will be stored in the result variable
 * for use in eventing. The event commands will pick up after the plugin
 * command.
 * ----------------------------Text Codes--------------------------------------
 * This plugin allows the use of a few text codes within the button mash
 * window progress bar strings. They are as follows:
 *
 * %flash% - Will be replaced with the flashing icon
 * %percent% - Shows the current percent filled
 * %progress% - Shows the current amount of raw progress units
 * %total% - Shows the total raw progress units required for completion
 * -------------------------Plugin Commands------------------------------------
 * The following plugin commands are supported:
 * 
 * • Start
 * Starts a button mash event. Set the various properties up in the plugin
 * parameters first, as this plugin command only accepts an id.
 * ------------------------------Saved Games-----------------------------------
 * This plugin is fully compatible with saved games. This means you can:
 *
 * ✓ Add this plugin to a saved game and it will work as expected
 * ✓ Change any plugin params and changes will be reflected in saved games
 * ✓ Remove the plugin with no issue to save data
 * -----------------------------Filename---------------------------------------
 * The filename for this plugin MUST remain CGMZ_ButtonMash.js
 * This is what it comes as when downloaded. The filename is used to load
 * parameters and execute plugin commands. If you change it, things will begin
 * behaving incorrectly and your game will probably crash. Please do not
 * rename the js file.
 * --------------------------Latest Version------------------------------------
 * Hi all, this latest version adds sound effects for your button mash events.
 * You can now set a sound effect that will be played each time the player
 * presses the button. This sound effect can have both a starting and ending
 * volume, pitch, and pan. It will use linear interpolation to change the SE
 * settings by the percentage the bar is filled. This means you can have a
 * rising pitch as the bar gets closer to completion.
 *
 * I also added the option to start with the button mash event already having
 * some progress. This option was added to the plugin command to start a
 * button mash, so you will need to make sure each of your plugin commands
 * includes this value even if it is 0.
 *
 * A bug with the background type parameter was fixed. You should now be
 * able to set the background type for the button mash progress window.
 *
 * Version Alpha R2
 * - Added sound effect option on button press, with escalating pitch/pan/vol
 * - Added option to change starting amount of progress
 * - Fix bug with background type parameter not working
 *
 * @command Start
 * @desc Start a button mash event
 *
 * @arg Id
 * @desc The id from the events plugin parameters to use for the bar
 *
 * @arg Prefill
 * @type number
 * @default 0
 * @desc Pre-fill the progress bar by an amount? (in progress units not percentage)
 *
 * @param Mandatory Setup
 *
 * @param Events
 * @parent Mandatory Setup
 * @type struct<Event>[]
 * @default []
 * @desc Set up button mash event properties throughout your game, re-usable by id
 *
 * @param Defaults
 *
 * @param Windowskin
 * @parent Defaults
 * @type file
 * @dir img
 * @desc Windowskin to use, set blank to use default
 *
 * @param Padding
 * @parent Defaults
 * @type number
 * @min -1
 * @desc Window padding. Set to -1 for default
 * @default -1
 *
 * @param Back Opacity
 * @parent Defaults
 * @type number
 * @min -1
 * @max 255
 * @desc Window back opacity. Set to -1 for default
 * @default -1
 *
 * @param Tone
 * @parent Defaults
 * @type struct<Tone>
 * @default {"Red":"-256","Green":"0","Blue":"0"}
 * @desc Windowskin tone. Set red to -256 to not use.
 *
 * @param Background Type
 * @parent Defaults
 * @type select
 * @option Window
 * @value 0
 * @option Dim
 * @value 1
 * @option Transparent
 * @value 2
 * @default 0
 * @desc The background type of the window
*/
/*~struct~Event:
 * @param Id
 * @desc The id of the button mash event
 *
 * @param Controls
 *
 * @param Key
 * @parent Controls
 * @default z
 * @desc The keyboard button that needs to be pressed for progress
 *
 * @param Gamepad
 * @parent Controls
 * @type select
 * @option A
 * @value 0
 * @option B
 * @value 1
 * @option X
 * @value 2
 * @option Y
 * @value 3
 * @option LB
 * @value 4
 * @option RB
 * @value 5
 * @option LT
 * @value 6
 * @option RT
 * @value 7
 * @option Back / Select
 * @value 8
 * @option Start
 * @value 9
 * @option Left Stick
 * @value 10
 * @option Right Stick
 * @value 11
 * @option Dpad Up
 * @value 12
 * @option Dpad Down
 * @value 13
 * @option Dpad Left
 * @value 14
 * @option Dpad Right
 * @value 15
 * @default 0
 * @desc The gamepad button that needs to be pressed for progress
 *
 * @param Mechanics
 *
 * @param Total
 * @parent Mechanics
 * @type number
 * @default 100
 * @desc The total progress needed to finish the event
 *
 * @param Press Value
 * @parent Mechanics
 * @type number
 * @default 10
 * @desc The amount added to the progress value when the button is pressed once
 *
 * @param Decline Speed
 * @parent Mechanics
 * @type number
 * @default 2
 * @desc How many frames until the Decline Value is subtracted from the progress? (60f = 1sec)
 *
 * @param Decline Value
 * @parent Mechanics
 * @type number
 * @default 2
 * @desc The amount subtracted from the progress value over time
 *
 * @param Time Limit
 * @parent Mechanics
 * @type number
 * @default 10
 * @desc The amount (in seconds) that the player gets to fill the bar
 *
 * @param Result Variable
 * @parent Mechanics
 * @type variable
 * @default 0
 * @desc The variable to store the result in
 *
 * @param Customization
 *
 * @param Show Timer
 * @parent Customization
 * @type boolean
 * @default true
 * @desc Show a game timer while the button mash is active?
 *
 * @param Color 1
 * @p