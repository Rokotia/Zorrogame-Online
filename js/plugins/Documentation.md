### Installation

Install the plugin by adding the `NIJI_VideoPlayer.js` file to your game's plugin folder and enabling it inside the plugin manager.

### Usage

#### Plugin Commands

* `load` - load video into memory and set an `id` for it.
* `play` - play a video by id.
* `stop` - stop a playing video by id.
* `pause` - pause a video by id.
* `resume` - resume a video by id.
* `mute` - mute a video by id.
* `unmute` - unmute a video by id.
* `volume` - set video volume by id.
* `move` - move a video by id.
* `scale` - scale a video by id.
* `unload` - remove video from memory.

#### Script Functions

* **Niji.Video.load(id, filename, config)**
    * Cache video in memory and set an identifier for it
        * `id` - (string) Unique video identifier, used in other commands.
        * `filename` - (string) Video filename inside the `movies/` directory (video.webm)
        * `config` - (object) Video configuration.
            * `volume` - (number) Initial volume of the video (0 - 100).
            * `shouldMute` - (boolean) Should the video be muted?
            * `shouldLoop` - (boolean) Should the video loop?
            * `shouldAutoUnload` - (boolean) Should the video automatically unload after it finishes playing?
* **Niji.Video.get(from, id)**
    * Get video by identifier
        * `from` - (string) Call location, this can be whatever you want. Used for logging purposes.
        * `id` - (string) Video Identifier.
* **Niji.Video.play(id)**
    * Play video by identifier
        * `id` - (string) Video Identifier.
* **Niji.Video.stop(id)**
    * Stop video by identifier
        * `id` - (string) Video Identifier.
* **Niji.Video.pause(id)**
    * Pause video by identifier
        * `id` - (string) Video Identifier.
* **Niji.Video.resume(id)**
    * Resume video by identifier
        * `id` - (string) Video Identifier.
* **Niji.Video.mute(id)**
    * mute video by identifier
        * `id` - (string) Video Identifier.
* **Niji.Video.unmute(id)**
    * unmute video by identifier
        * `id` - (string) Video Identifier.
* **Niji.Video.volume(id, volume)**
    * volume video by identifier
        * `id` - (string) Video Identifier.
        * `volume` - (number) Volume of the video (0 - 100).
* **Niji.Video.unload(id)**
    * Unload video by identifier
        * `id` - (string) Video Identifier.
* **Niji.Video.setAutoUnload(id)**
    * Set video to auto unload after it finishes playing
        * `id` - (string) Video Identifier.
* **Niji.Video.setLoop(id)**
    * Set video to loop by identifier
        * `id` - (string) Video Identifier.
* **Niji.Video.center(id)**
    * center video by identifier
        * `id` - (string) Video Identifier.
* **Niji.Video.flipH(id)**
    * flipH video by identifier
        * `id` - (string) Video Identifier.
* **Niji.Video.flipV(id)**
    * flipV video by identifier
        * `id` - (string) Video Identifier.
* **Niji.Video.move(id, x, y)**
    * Move video around scene by identifier
        * `id` - (string) Video Identifier.
        * `x` - (number) X Coordinate
        * `y` - (number) Y Coordinate
* **Niji.Video.scale(id, x, y)**
    * Scale video size by identifier
        * `id` - (string) Video Identifier.
        * `x` - (number) X scale (between 0 and 1)
        * `y` - (number) Y scale (between 0 and 1)
* **Niji.Video.opacity(id, opacity)**
    * Change video opacity by identifier
        * `id` - (string) Video Identifier.
        * `opacity` - (number) Video opacity (between 0 and 1)
* **Niji.Video.centerAnim(id, duration)**
    * Change video opacity by identifier
        * `id` - (string) Video Identifier.
        * `duration` - (number) How long animation should last
* **Niji.Video.moveAnim(id, x, y, duration)**
    * Scale video around scene over time by identifier
        * `id` - (string) Video Identifier.
        * `x` - (number) Target X Coordinate
        * `y` - (number) Target Y Coordinate
        * `duration` - (number) How long animation should last
* **Niji.Video.scaleAnim(id, x, y, duration)**
    * Scale video around scene over time by identifier
        * `id` - (string) Video Identifier.
        * `x` - (number) X scale (between 0 and 1)
        * `y` - (number) Y scale (between 0 and 1)
        * `duration` - (number) How long animation should last
* **Niji.Video.opacityAnim(id, opacity, duration)**
    * Change video opacity over time by identifier
        * `id` - (string) Video Identifier.
        * `opacity` - (number) Video opacity (between 0 and 1)
        * `duration` - (number) How long animation should last
* **Niji.Video.animate(id, animations)**
    * Change video opacity over time by identifier
        * `id` - (string) Video Identifier.
        * `animations` - (animations\[\]) Array of animations (see below)

### Animations

Using functions are recommended because you get the ability to use animations.

Some basic animations are the helper functions like moveAnim, scaleAnim, and opacityAnim. These functions do not run in parallel, but they do use the same animation system which supports parallel animations.

To create parallel animations like scaling and moving at the same time you need to use the **animate** function:

```js
    // Load the video
    Niji.Video.load("VIDEO_001", "VIDEO_001.webm");
    
    // Here we will register animations on the video
    // Add animation to move the video and change opacity
    Niji.Video.animate("VIDEO_001", [
      { type: 'move', x: 100, y: 100, duration: 60 },
      { type: 'opacity', opacity: 0.1, duration: 60 },
    ]);
    
    // Move the video back to 0,0 and scale to 0.5, and change opacity to 1
    Niji.Video.animate("VIDEO_001", [
      { type: 'move', x: 0, y: 0, duration: 60 },
      { type: 'scale', x: 0.5, y: 0.5, duration: 60 },
      { type: 'opacity', opacity: 1, duration: 60 },
    ]);
    
    // Move the video again to 100, 100 and scale to 0.2, while also changing opacity to 0.5
    Niji.Video.animate("VIDEO_001", [
      { type: 'move', x: 100, y: 100, duration: 60 },
      { type: 'scale', x: 0.2, y: 0.2, duration: 60 },
      { type: 'opacity', opacity: 0.5, duration: 60 },
    ]);
    
    // Then, move the video to 200, 100 (instantly)
    Niji.Video.animate("VIDEO_001", [
      { type: 'move', x: 200, y: 100, duration: 1 },
    ]);
    
    // Play the video (and animations)
    Niji.Video.play("VIDEO_001");
```

#### Animation Array

The **animate** function takes an Animation Array of objects. Each object in the array is an Animation Object as seen in the example above and below:

```js
    Niji.Video.animate("VIDEO_001", [
        { type: 'move', x: 200, y: 100, duration: 60 },
        { type: 'opacity', x: 200, y: 100, duration: 60 },
    ]);
```

There is **no limit** to the number of Animation Arrays or Animation Objects per array:

```js
    Niji.Video.animate("VIDEO_001", [
        { type: 'move', x: 200, y: 100, duration: 60 },
        ... 999 rows later ...
        { type: 'opacity', x: 200, y: 100, duration: 60 },
    ]);
```

You may also stack as many types as you want in the same array.

```js
    Niji.Video.animate("VIDEO_001", [
        { type: 'move', x: 200, y: 100, duration: 60 },
        { type: 'move', x: 100, y: 200, duration: 60 },
    ]);
```

#### Animation Object

The animation object looks like the one seen above:

```js
    { type: 'move', x: 200, y: 100, duration: 1 }
```

Each animation object has a **type**, **duration** and **additional properties**.

Note: setting duration to **1** will make it instant and only last for one frame. This is not how the static functions move, scale, and opacity work.

Next we will go over the types.

#### Animation Types

* Type: **move**
    * Move the video around the scene over time
        * `x` - (number) Target X Coordinate
        * `y` - (number) Target Y Coordinate
        * `duration` - (number) How long animation should last
* Type: **scale**
    * Scale video around scene over time
        * `x` - (number) X scale (between 0 and 1)
        * `y` - (number) Y scale (between 0 and 1)
        * `duration` - (number) How long animation should last
* Type: **opacity**
    * Change video opacity over time
        * `opacity` - (number) Video opacity (between 0 and 1)
        * `duration` - (number) How long animation should last

### Class Mode

You may optionally use the Video class to chain:

```js
    new Niji
      .Video("VIDEO_001", "transparent-video.webm", true)
      .scale(0.2, 0.2)
      .animate([
        { type: 'move', x: 100, y: 100, duration: 60 },
        { type: 'opacity', opacity: 0.1, duration: 60 },
      ])
      .animate([
        { type: 'move', x: 0, y: 0, duration: 60 },
        { type: 'scale', x: 1, y: 1, duration: 60 },
        { type: 'opacity', opacity: 1, duration: 60 },
      ])
      .animate([
        { type: 'move', x: 100, y: 100, duration: 60 },
        { type: 'scale', x: 0.2, y: 0.2, duration: 60 },
        { type: 'opacity', opacity: 0.5, duration: 60 },
      ])
      .animate([
        { type: 'move', x: 200, y: 100, duration: 1 },
      ])
      .play();
```
      

FAQ:
----

* **Why do my videos not play instantly?**
    * Large videos may not load instantly and require more time to load. You may check whether your videos are loaded through the Niji.Video.isReady() function or individually by obtaining the Video Object through Niji.Video.get(id).\_loaded.

* **Why does sound start but no video?**
    * Generally this can happen when you attempt to load a `.gif` or another unsupported video file.