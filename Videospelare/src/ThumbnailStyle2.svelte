<link href="https://fonts.googleapis.com/css2?family=BIZ+UDGothic&family=Bebas+Neue&family=Kanit:wght@500&family=League+Spartan&family=Orelega+One&family=Oswald:wght@500&family=Press+Start+2P&family=Roboto+Flex:opsz,wght@8..144,300&family=Rokkitt&family=Rubik+Wet+Paint&display=swap" rel="stylesheet">
<script>
    export let video;
    import { chosen_video, video_player_is_active, trailersWatched } from "./stores.js";
    function trailersWatch() {
	return trailersWatched.update(n => n +1)
}
</script>

<div
class="grid-item" on:click={trailersWatch}
style="background-image: url({video.poster});"
on:click={() => {
  $chosen_video = video;
  $video_player_is_active = true;
}}
><div class="play"><i class="fa-solid fa-play"></i></div></div>

<style>

.grid-item {
    cursor: pointer;
	height: 300px;
	width: 200px;
	background-size: cover;
	z-index: 1;
	box-shadow: none;
	border-radius: 0px;
    margin-left: 10px;
    margin-right: 10px;
    border-bottom: 3px solid var(--category);
    opacity: 1;
}

.grid-item:hover {
	opacity: 0.8;
}
.play {
  opacity: 0;
  position: relative;
  top: 125px;
  left: 75px;
  width: 50px;
  height: 50px;


}
.play i {
    position: absolute;
    font-size: 50px;
    top: 0%;
    left: 6px;
    opacity: 0;
    color: white;

}
.grid-item:hover .play {
    opacity: 1;
}
.grid-item:hover .play i {
    opacity: 1;
}

</style>