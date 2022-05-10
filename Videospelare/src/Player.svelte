<!-- 

	Video player INSPIRED BY AND IMPROVED FROM https://svelte.dev/tutorial/media-elements

 -->
 <link href="https://fonts.googleapis.com/css2?family=BIZ+UDGothic&family=Bebas+Neue&family=Kanit:wght@500&family=League+Spartan&family=Orelega+One&family=Oswald:wght@500&family=Press+Start+2P&family=Roboto+Flex:opsz,wght@8..144,300&family=Rokkitt&family=Rubik+Wet+Paint&display=swap" rel="stylesheet">
 <script>

    import { chosen_video } from "./stores.js";


	// These values are bound to properties of the video
	let time = 0;
	let duration;
	let paused = true;

	let showControls = true;
	let showControlsTimeout;

	// Used to track time of last mouse down event
	let lastMouseDown;

	function handleMove(e) {
		// Make the controls visible, but fade out after
		// 2.5 seconds of inactivity
		clearTimeout(showControlsTimeout);
		showControlsTimeout = setTimeout(() => (showControls = false), 2500);
		showControls = true;

		if (!duration) return; // video not loaded yet
		if (e.type !== "touchmove" && !(e.buttons & 1)) return; // mouse not down

		const clientX =
			e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
		const { left, right } = this.getBoundingClientRect();
		time = (duration * (clientX - left)) / (right - left);
	}
	
	// we can't rely on the built-in click event, because it fires
	// after a drag — we have to listen for clicks ourselves
	function handleMousedown(e) {
		lastMouseDown = new Date();
	}

	function handleMouseup(e) {
		if (new Date() - lastMouseDown < 300) {
			if (paused) e.target.play();
			else e.target.pause();
		}
	}

	function handleKeyDown(e) {
		let video = document.getElementById("vid");
		if (e && e.key == " ") {
			if (paused) video.play();
			else video.pause();
		}
	}

	function format(seconds) {
		if (isNaN(seconds)) return "...";

		const minutes = Math.floor(seconds / 60);
		seconds = Math.floor(seconds % 60);
		if (seconds < 10) seconds = "0" + seconds;

		return `${minutes}:${seconds}`;
	}
</script>

<svelte:window on:keydown|preventDefault={handleKeyDown} />
<div class="alignimgcenteroutline">
<div class="alignimgcenter">
<div id="container">
	<video
		id="vid"
		poster={$chosen_video.poster}
		src={$chosen_video.src}
		on:mousedown|preventDefault|stopPropagation={handleMousedown}
		on:mouseup|preventDefault|stopPropagation={handleMouseup}
		bind:currentTime={time}
		bind:duration
		bind:paused
	>
		<track kind="captions" />
	</video>
</div>
</div>
	<div
		class="controls"
		style="opacity: {duration && showControls ? 1 : 0}"
		on:mousemove|preventDefault|stopPropagation={handleMove}
		on:touchmove|preventDefault|stopPropagation={handleMove}
		on:mousedown|preventDefault|stopPropagation={handleMove}
		on:mouseup|preventDefault|stopPropagation={handleMove}
	>
		<div class="info">
			<span class="timepast">{format(time)}</span>
			<span>
				<span class="timetotal">{format(duration)}</span>
			</span>
		</div>
		<progress value={time / duration || 0} />
	</div>
</div>

<style>
	#container {
cursor: pointer;
border: 0.1px solid transparent;
border-radius: 10px;
width: 100%;
height: 100%;
background-size: cover; /* Resize the background image to cover the entire container */
z-index: 1;
background-color: black;
position: absolute;
	}
	.alignimgcenter {
		display: flex;
		width: 100%;
		height: 100%;
		align-items: center;
		justify-content: center;
		background-color: black;
		border-radius: 0px;
	}
	.alignimgcenteroutline {
		position: absolute;
		width: 100%;
		height: 100%;
		align-items: center;
		justify-content: center;
		border-radius: 10px;
		border: 10px solid white;
	}
	.controls {
cursor: pointer;
border: 0.1px solid transparent;
border-radius: 10px;
width: 100%;
height: 10%;
background-size: cover; /* Resize the background image to cover the entire container */
z-index: 3;
bottom: 10%;
	}

	.info {
		display: inline-block;
		position: absolute;
cursor: pointer;
border: 0.1px solid transparent;
border-radius: 10px;
width: 100%;
height: 10%;
background-size: cover; /* Resize the background image to cover the entire container */
z-index: 1;
bottom: 0%;
	}

	span {
		text-shadow: 0 0 8px black;
		font-size: 1.4em;
		opacity: 0.7;
	}
	.timepast {
		width: 3em;
		font-family: 'Roboto Flex', sans-serif;
		color: red;
		position: absolute;
		text-align: left;
		bottom: 24%;
		left: 0.5%;

	}

	.timetotal {
		position: absolute;
		text-align: right;
		width: 3em;
		font-family: 'Roboto Flex', sans-serif;
		color: white;
		right: 1%;
		bottom: 20%;
	}

	progress {
		display: inline-block;
		position: absolute;
		width: 100%;
		height: 20px;
		-webkit-appearance: none;
		appearance: none;
		bottom: 0%;
		background-color: rgba(255, 255, 255, 0.6);
		z-index: 999;
	}

	progress::-webkit-progress-bar {
		background-color: rgba(0, 0, 0, 0.2);
	}

	progress::-webkit-progress-value {
		background-color: red;
	}

	video {
cursor: pointer;
border: 0.1px solid transparent;
border-radius: 10px;
width: 100%;
height: 100%;
background-size: cover; /* Resize the background image to cover the entire container */
z-index: 1;
position: relative;
	}
</style>