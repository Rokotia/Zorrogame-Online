//=============================================================================
// Drag_Debugger.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Spacebar mash challenge with picture display and looping text interrupt. Picture appears 7 times; space must be pressed 5 times to win.
 *
 * @help
 * HOW TO USE:
 * 1. Add this plugin to your Plugin Manager.
 * 2. Create a Switch (e.g., ID 1) called "TextLoopActive".
 * 3. Make a Common Event that loops your scrolling text while that switch is ON (set it as Parallel).
 * 4. Use a Plugin Command: StartSpacebarMashChallenge to begin the challenge.
 * 5. The plugin automatically disables "TextLoopActive" when the challenge ends.
 *
 * Place your picture in the img/pictures folder.
 */

(() => {
  const pluginName = "SpacebarMashChallenge";

  PluginManager.registerCommand(pluginName, "StartSpacebarMashChallenge", () => {
    const pictureId = 1; // ID for picture display
    const pictureName = "YourPicture"; // Replace with your picture filename (no extension)
    const displayTime = 60; // How long picture stays (in frames)
    const totalDisplays = 7; // How many times picture appears
    const requiredPresses = 5; // How many space presses needed to win

    const switchId = 1; // ID of "TextLoopActive" switch (adjust if needed)

    let displayCount = 0;
    let pressCount = 0;
    let challengeActive = true;

    Input.clear();

    const updateChallenge = () => {
      if (!challengeActive) return;

      if (displayCount < totalDisplays) {
        $gameScreen.showPicture(pictureId, pictureName, 1, 0, 0, 100, 100, 255, 0);

        setTimeout(() => {
          $gameScreen.erasePicture(pictureId);
          displayCount++;

          const randomInterval = Math.floor(Math.random() * 60) + 30; // 30–90 frames
          setTimeout(updateChallenge, randomInterval * 16.67);

        }, displayTime * 16.67);
      } else {
        challengeActive = false;

        if (pressCount >= requiredPresses) {
          $gameMessage.add("Success!");
        } else {
          $gameMessage.add("Try again!");
        }

        // Stop the text loop
        $gameSwitches.setValue(switchId, false);
      }
    };

    // Spacebar press detection
    const onKeyDown = (event) => {
      if (!challengeActive) return;
      if (event.code === "Space") {
        pressCount++;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    updateChallenge();
  });
})();
