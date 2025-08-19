Scene_Map.prototype.mapNameWindowRect = function() {
    const wx = Math.floor((Graphics.boxWidth - Graphics.width) / 2); // x position
    const wy = 0; // y position
    const ww = 360; // width
    const nLines = 1; // number of lines
    const wh = this.calcWindowHeight(nLines, false);
    return new Rectangle(wx, wy, ww, wh);
};