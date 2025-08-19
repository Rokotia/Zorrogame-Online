/*:
 * @plugindesc A system plugin for spotlight effects
 * @author OtterScribe
 * 
 * This plugin is owned by [OtterScribe], and modification or redistribution without permission is prohibited.
 * Unauthorized modification or redistribution is prohibited.
 *
 * @help
 * This plugin displays an overlay image on the entire screen and creates a circular spotlight effect at a specified position.  
 * The inside of the spotlight remains transparent, while the outside retains the overlay image.  
 * The opacity of the outer area can also be adjusted.  
 * Additionally, the plugin can be toggled ON or OFF.
 *
 * Available Plugin Commands:
 * - SetOverlay imageName radius opacity outerOpacity : Sets the overlay image, spotlight size, transparency, and outer opacity
 * - SetOuterOpacity opacity : Changes the opacity of the outer overlay image
 * - EnableSpotlight : Activates the plugin
 * - DisableSpotlight : Deactivates the plugin
 * - ToggleSpotlight : Toggles the plugin ON/OFF
 *
 * @command SetOverlay
 * @text Set Overlay and Spotlight
 * @desc Applies an overlay image to the entire screen and enables the spotlight effect.
 * @arg image
 * @type file
 * @dir img/system/
 * @default Fog
 * @text Image Name
 * @desc The filename of the image located in the img/system folder.
 * @arg radius
 * @type number
 * @default 100
 * @text Radius
 * @desc The radius size of the spotlight.
 * @arg opacity
 * @type number
 * @min 0
 * @max 255
 * @default 255
 * @text Opacity
 * @desc The opacity of the overlay image (0: fully transparent, 255: fully opaque).
 * @arg outerOpacity
 * @type number
 * @min 0
 * @max 255
 * @default 255
 * @text Outer Opacity
 * @desc The opacity of the overlay image outside the spotlight (0: fully transparent, 255: fully opaque).
 *
 * @command SetOuterOpacity
 * @text Change Outer Opacity
 * @desc Adjusts the opacity of the overlay image outside the spotlight.
 * @arg opacity
 * @type number
 * @min 0
 * @max 255
 * @default 255
 * @text Outer Opacity
 * @desc 0 (fully transparent) ~ 255 (fully opaque).
 *
 * @command EnableSpotlight
 * @text Enable Spotlight
 * @desc Activates the plugin and displays the overlay.
 *
 * @command DisableSpotlight
 * @text Disable Spotlight
 * @desc Deactivates the plugin and removes all overlays.
 *
 * @command ToggleSpotlight
 * @text Toggle Spotlight ON/OFF
 * @desc Toggles the plugin ON or OFF.
 */


(() => {
    let spotlightEnabled = true; 
    let outerOpacity = 255; 

    
    PluginManager.registerCommand("OS_Spotlight", "SetOverlay", args => {
        if (spotlightEnabled) {
            SpotlightManager.setOverlay(
                args.image,
                Number(args.radius),
                Number(args.opacity),
                Number(args.outerOpacity)
            );
        }
    });

    PluginManager.registerCommand("OS_Spotlight", "SetOuterOpacity", args => {
        if (spotlightEnabled) {
            outerOpacity = Number(args.opacity);
        }
    });

    PluginManager.registerCommand("OS_Spotlight", "EnableSpotlight", () => {
        spotlightEnabled = true;
    });

    PluginManager.registerCommand("OS_Spotlight", "DisableSpotlight", () => {
        spotlightEnabled = false;
        SpotlightManager.clearOverlay();
    });

    PluginManager.registerCommand("OS_Spotlight", "ToggleSpotlight", () => {
        spotlightEnabled = !spotlightEnabled;
        if (!spotlightEnabled) {
            SpotlightManager.clearOverlay();
        }
    });

    
    const SpotlightManager = {
        _overlaySprite: null,
        _overlayBitmap: null,

        setOverlay(imageName, radius, opacity, outerOpacityValue) {
            if (!spotlightEnabled) return;
            
            outerOpacity = outerOpacityValue; 

            if (!this._overlaySprite) {
                this._overlaySprite = new Sprite();
                this._overlaySprite.z = 10; 
                SceneManager._scene.addChild(this._overlaySprite);
            }
            if (!this._overlayBitmap) {
                this._overlayBitmap = new Bitmap(Graphics.width, Graphics.height);
                this._overlaySprite.bitmap = this._overlayBitmap;
            }

            const bitmap = ImageManager.loadSystem(imageName);
            bitmap.addLoadListener(() => {
                this._overlayBitmap.clear();
                this._updateOverlay(bitmap, radius, opacity);
            });

            
            this._overlaySprite.update = () => {
                if (!spotlightEnabled) {
                    this.clearOverlay();
                    return;
                }
                const player = $gamePlayer;
                const x = player.screenX();
                const y = player.screenY();
                this._updateOverlay(bitmap, radius, opacity, x, y);
            };
        },

        _updateOverlay(bitmap, radius, opacity, x = 320, y = 240) {
            if (!spotlightEnabled) return;

            const context = this._overlayBitmap.context;
            context.clearRect(0, 0, Graphics.width, Graphics.height);

            
            context.globalAlpha = outerOpacity / 255;
            this._overlayBitmap.blt(bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0, Graphics.width, Graphics.height);

            
            context.globalCompositeOperation = 'destination-out';
            context.globalAlpha = 1.0;
            context.beginPath();
            context.arc(x, y, radius, 0, Math.PI * 2);
            context.fill();
            context.globalCompositeOperation = 'source-over';
            context.globalAlpha = 1.0;
            this._overlayBitmap._baseTexture.update();
        },

        clearOverlay() {
            if (this._overlayBitmap) {
                this._overlayBitmap.clear();
                this._overlayBitmap._baseTexture.update();
            }
        }
    };
})();
