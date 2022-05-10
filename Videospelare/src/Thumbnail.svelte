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
/>

<style>
:global(body) {
padding: 0;
margin: 0;
}
* {
box-sizing: border-box;
}
.grid-item {
display: inline-block;
cursor: pointer;
border-radius: 10px;
width: 180px;
height: 270px;
max-width: 200px;
max-height: 300px;
background-size: cover; /* Resize the background image to cover the entire container */
z-index: 1;
border-bottom: 3px solid var(--category);

}
.grid-item:hover {
transition-delay: 100ms;
height: 300px;
width: 200px;
margin: 0px;
padding: 0px;
box-shadow: 0px 0px 30px 1px;
}
@media screen and (max-width: 1733px) {
.grid-item {
height: 243px; 
width: 162px;
}
.grid-item:hover {
height: 270px;
width: 180px;
box-shadow: 0px 0px 27px 0.9px;
}
}
@media screen and (max-width: 1561px) {
.grid-item {
height: 227.7px; 
width: 145.8px;
}
.grid-item:hover {
height: 243px;
width: 162px;
box-shadow: 0px 0px 24.3px 0.8px;
}
}
@media screen and (max-width: 1408px) {
.grid-item {
height: 204.93px; 
width: 131.22px;
}
.grid-item:hover {
height: 227.7px;
width: 145.8px;
box-shadow: 0px 0px 21.87px 0.7px;
}
}
@media screen and (max-width: 1270px) {
.grid-item {
height: 184.437px; 
width: 118.098px;
}
.grid-item:hover {
height: 204.93px;
width: 131.22px;
box-shadow: 0px 0px 19.683px 0.7px;
}
}
@media screen and (max-width: 1145px) {
.grid-item {
height: 165.9933px; 
width: 106.2882px;
}
.grid-item:hover {
height: 184.437px;
width: 118.098px;
box-shadow: 0px 0px 17.7147px 0.6px;
}
}
@media screen and (max-width: 1031px) {
.grid-item {
height: 149.39397px; 
width: 95.65938px;
}
.grid-item:hover {
height: 165.9933px; 
width: 106.2882px;
box-shadow: 0px 0px 15.94323px 0.5px;
}
}
@media screen and (max-width: 953px) {
.grid-item {
height: 134.454573px; 
width: 86.093442px;
}
.grid-item:hover {
height: 149.39397px; 
width: 95.65938px;
box-shadow: 0px 0px 12.9140163px 0.3px;
}
}
@media screen and (max-width: 872px) {
.grid-item {
height: 121.0091157px; 
width: 77.4840978px;
}
.grid-item:hover {
height: 134.454573px; 
width: 86.093442px;
box-shadow: 0px 0px 11.62261467px 0.2px;
}
}
@media screen and (max-width: 760px) {
.grid-item {
height: 108.90820413px; 
width: 69.73568802px;
}
.grid-item:hover {
height: 121.0091157px; 
width: 77.4840978px;
box-shadow: 0px 0px 11.62261467px 0.2px;
}
}
@media screen and (max-width: 687px) {
.grid-item {
height: 98.017383717px; 
width: 62.762119218px;
}
.grid-item:hover {
height: 108.90820413px; 
width: 69.73568802px;
box-shadow: 0px 0px 11.62261467px 0.2px;
}
}
@media screen and (max-width: 608px) {
.grid-item {
height: 88.2156453453px; 
width: 56.4859072962px;
}
.grid-item:hover {
height: 98.017383717px; 
width: 62.762119218px;
box-shadow: 0px 0px 11.62261467px 0.2px;
}
}
</style>