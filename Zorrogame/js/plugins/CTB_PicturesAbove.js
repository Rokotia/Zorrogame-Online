//=============================================================================
// RPG Maker MV/MZ - CT_Bolt's Pictures Above
//=============================================================================

/*:
 * @target MZ
 * @plugindesc [RPG Maker MV/MZ] [Tier 1] [Version 1.00] [CT_Bolt - Pictures Above]
 * @author CT_Bolt
 *
 * @help
 * Script Calls:
 *  $gameScreen.addPicturesAbove(constructor name);
 *  $gameScreen.revertPicturesPlacement();
 *
 * Example:
 *  $gameScreen.addPicturesAbove('MapHUD');
 */
//=============================================================================
//=============================================================================
 
var CTB = CTB || {}; CTB.PicturesAbove  = CTB.PicturesAbove || {};
var Imported = Imported || {}; Imported["CTB_PicturesAbove"] = 1.00;

"use strict";
(($_$) => {
    const NAMESPACE   = 'PicturesAbove';
    const PLUGIN_NAME = 'CTB_' + NAMESPACE;
	
	function getPluginParameters() {var a = document.currentScript || (function() { var b = document.getElementsByTagName('script'); return b[b.length - 1]; })(); return PluginManager.parameters(a.src.substring((a.src.lastIndexOf('/') + 1), a.src.indexOf('.js')));} $_$.params = getPluginParameters();

	Game_Screen.prototype.addPicturesAbove = function(name){
		if (name){
			let index = SceneManager._scene._spriteset.children.indexOf(SceneManager._scene._spriteset._pictureContainer);
			if (index >= 0) {SceneManager._scene._spriteset._pictureContainerIndex = index;};
			SceneManager._scene.addChildAt(SceneManager._scene._spriteset._pictureContainer, SceneManager._scene.children.findIndex(v => v.constructor.name === name)+1)
		};
	};
	
	Game_Screen.prototype.revertPicturesPlacement = function(){
		let index = SceneManager._scene._spriteset._pictureContainerIndex;
		if (index && index >= 0){
			SceneManager._scene._spriteset.addChildAt(SceneManager._scene._spriteset._pictureContainer, index)	
		};		
	};

})(CTB.PicturesAbove, this);