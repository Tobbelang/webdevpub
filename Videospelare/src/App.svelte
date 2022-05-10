<head>
	<script src="https://kit.fontawesome.com/109fc35f63.js" crossorigin="anonymous"></script>
</head>
<link href="https://fonts.googleapis.com/css2?family=BIZ+UDGothic&family=Bebas+Neue&family=Kanit:wght@500&family=League+Spartan&family=Orelega+One&family=Oswald:wght@500&family=Press+Start+2P&family=Roboto+Flex:opsz,wght@8..144,300&family=Rokkitt&family=Rubik+Wet+Paint&display=swap" rel="stylesheet">

<script>
import { trailersWatched, timeOnSiteSeconds, video_player_is_active } from "./stores.js";
import { Button, Overlay } from "svelte-materialify";
import { videos } from "./videos.js";
import Player from "./Player.svelte";
import Thumbnail from "./Thumbnail.svelte";
import ThumbnailStyle2 from "./ThumbnailStyle2.svelte";
let showCategories = false;
let styleButtons = true;
let styleScroll = false;
let is_fullscreen = false;
let theatreMode = false;
let visaMindre = false;
let transformX = false;
let transformX2 = false;
let transformX3 = false;
let transformX4 = false;
let transformX5 = false;
let showButtonLeft1 = false;
let showButtonLeft2 = false;
let showButtonLeft3 = false;
let showButtonLeft4 = false;
let showButtonLeft5 = false;
let showButtonRight1 = true;
let showButtonRight2 = true;
let showButtonRight3 = true;
let showButtonRight4 = true;
let showButtonRight5 = true;
let minimizeBeforeClosing = false;
function check() {
	if (transformX = true) {
	showButtonLeft1 = true;
	showButtonRight1 = false;
	}
	else {
	showButtonLeft1 = false;
	showButtonRight1 = true;
	}

	if (transformX2 = true) {
	showButtonLeft2 = true;
	showButtonRight2 = false;
	}
	else {
	showButtonLeft2 = false;
	showButtonRight2 = true;
	}

	if (transformX3 = true) {
	showButtonLeft3 = true;
	showButtonRight3 = false;
	}
	else {
	showButtonLeft3 = false;
	showButtonRight3 = true;
	}

	if (transformX4 = true) {
	showButtonLeft4 = true;
	showButtonRight4 = false;
	}
	else {
	showButtonLeft4 = false;
	showButtonRight4 = true;
	}

	if (transformX5 = true) {
	showButtonLeft5 = true;
	showButtonRight5 = false;
	}
	else {
	showButtonLeft5 = false;
	showButtonRight5 = true;
	}
}
function showCategoriesON() {
	showCategories = true;
}
function showCategoriesOFF() {
	showCategories = false;
}
function minimizeBeforeClosingdone() {
	minimizeBeforeClosing = false;
}
function TranslateXtrue() {
transformX = true;
showButtonLeft1 = true;
showButtonRight1 = false;
}
function TranslateXfalse() {
transformX = false;
showButtonLeft1 = false;
showButtonRight1 = true;
}

function TranslateXtrue2() {
transformX2 = true;
showButtonLeft2 = true;
showButtonRight2 = false;
}

function TranslateXfalse2() {
transformX2 = false;
showButtonLeft2 = false;
showButtonRight2 = true;
}

function TranslateXtrue3() {
transformX3 = true;
showButtonLeft3 = true;
showButtonRight3 = false;
}
function TranslateXfalse3() {
transformX3 = false;
showButtonLeft3 = false;
showButtonRight3 = true;
}

function TranslateXtrue4() {
transformX4 = true;
showButtonLeft4 = true;
showButtonRight4 = false;
}
function TranslateXfalse4() {
transformX4 = false;
showButtonLeft4 = false;
showButtonRight4 = true;
}

function TranslateXtrue5() {
transformX5 = true;
showButtonLeft5 = true;
showButtonRight5 = false;
}
function TranslateXfalse5() {
transformX5 = false;
showButtonLeft5 = false;
showButtonRight5 = true;
}
function visaMindrefunction() {
visaMindre = true;
showCategories = false;
}
function visamerfunction() {
visaMindre = false;
}
function buttonsTrue() {
styleButtons = true;
styleScroll = false;
}
function scrollTrue() {
styleButtons = false;
styleScroll = true;
}

let documentary = ["white"]
let comedy = ["aqua"]
let horror = ["red"]
let thriller = ["maroon"]
let action = ["gold"]
let SciFI = ["lime"]
let drama = ["indigo"]
let romance = ["magenta"]
let mystery = ["seagreen"]
let fantasy = ["coral"]
let trailerWatched; 
trailersWatched.subscribe(antal => {trailerWatched = antal; });
</script>
<main>
<div class="onoff" style="display: {visaMindre ? 'none' : 'block'}">
<div class="containeronoff">
<div class="onoff-box">
<div class="onoff-text">
<i class="fa-solid fa-left-right"></i><span>Pages w/ buttons</span>
</div>
<div class="onoff-toggle">
<input type="radio" id="Pages" checked="checked" name="radio" on:click={buttonsTrue}>
<label for="Pages"></label>
</div>
</div>
<div class="onoff-box">
	<div class="onoff-text">
<i class="fa-solid fa-left-long"></i><span>Scroll</span>
</div>
<div class="onoff-toggle">
<input type="radio" id="Scroll" name="radio" on:click={scrollTrue}>
<label for="Scroll"></label>
</div>
</div> 
	<button on:click={showCategoriesON} class="revealcategories"><i class="fa-solid fa-film"></i><i class="fa-solid fa-video"></i>Catergories</button>
	<button class="arrow" on:click={showCategoriesOFF} style="display: {showCategories ? 'block' : 'none'}"><i class="fa-solid fa-arrow-up"></i></button>
	<button class="arrow" on:click={showCategoriesON} style="display: {showCategories ? 'none' : 'block'}"><i class="fa-solid fa-arrow-down"></i></button>
</div>
</div>
<button class="visamer-mindre" on:click={visaMindrefunction} style="display: {visaMindre ? 'none' : 'block'}"></button>
<button class="visamindre-mer" on:click={visamerfunction} style="display: {visaMindre ? 'block' : 'none'}"></button>
<div class="minimizetext" style="display: {minimizeBeforeClosing ? 'block' : 'none'}">
<button class="ok" on:click={minimizeBeforeClosingdone}></button>
</div>
<div class="info" style="display: {theatreMode ? 'none' : ''} ">YOU HAVE WATCHED {trailerWatched} TRAILERS THE LAST {$timeOnSiteSeconds} {$timeOnSiteSeconds <= 1 ? 'SECOND' : 'SECONDS'}</div>
<div class="stylingwbuttonsbackground" style="display: {styleButtons ? 'block' : 'none'}"></div>
<div class="categories" style="display: {showCategories ? 'block' : 'none'}">
	<div class="colorball" style="--category: var(--drama); margin-top: 30px"><p style="--category: var(--drama)">Drama</p></div>
	<div class="colorball" style="--category: var(--comedy)"><p style="--category: var(--comedy)">Comedy</p></div>
	<div class="colorball" style="--category: var(--action)"><p style="--category: var(--action)">Action</p></div>
	<div class="colorball" style="--category: var(--sci-fi)"><p style="--category: var(--sci-fi)">SciFi</p></div>
	<div class="colorball" style=" --category: var(--horror)"><p style="--category: var(--horror)">Horror</p></div>
	<div class="colorball" style="--category: var(--thriller)"><p style="--category: var(--thriller)">Thriller</p></div>
	<div class="colorball" style="--category: var(--romance)"><p style="--category: var(--romance)">Romance</p></div>
	<div class="colorball" style="--category: var(--fantasy)"><p style="--category: var(--fantasy)">Fantasy</p></div>
	<div class="colorball" style="--category: var(--mystery)"><p style="--category: var(--mystery)">Mystery</p></div>
	<div class="colorball" style=" --category: var(--documentary)"><p style="--category: var(--documentary)">Documentary</p></div>
	</div>
<div class="containeroutlinename" style="display: {styleButtons ? '' : 'none'}">
	<div id="title"><img id="HBOLOGGA" src="hbo-max-hbo.png" alt="HBOMAX LOGGA"> <img id="HBOMAXLOGGA" src="hbo-max-max.png" alt="HBOMAX LOGGA"><h1 id="titletext">MINI</h1></div>
	</div>
	<!-- Styling alternativ 1 -->
	<div class="minwidth">
<div class="stylingwbuttons" style="display: {styleButtons ? 'block' : 'none'}">
<div class="aligncenter">
<span class="textfirst">Trendar</span>
</div>
<div class="aligncenter">
<div class="page" style="background-color: {transformX ? 'rgba(255,255,255,0.3)' : 'rgba(255,0,0,0.3)'}"></div>
<div class="page" style="background-color: {transformX ? 'rgba(255,0,0,0.3)' : 'rgba(255,255,255,0.3)'}"></div>
</div>
<div class="containeroutline">
<div class="filler">
<button class="button-left" style="display: {showButtonLeft1 ? 'inline-block' : 'none'}" on:click={TranslateXfalse}>←</button>
</div>
<div class="containerfirst">
<div class="grid" style="transform: {transformX ? 'translateX(-132.8%)' : 'translateX(0%)'}">
<div class="template">
<Thumbnail video={videos[0]} --category={action}> </Thumbnail>
<div class="templatetext" style="--category: var(--action)">THE BATMAN</div>
<div class="templatetextyear" style="--category: var(--action)">2022</div>
</div>
<div class="template">
<Thumbnail video={videos[1]} --category={drama}> </Thumbnail>
<div class="templatetext" style="--category: var(--drama)">FIGHT CLUB</div>
<div class="templatetextyear" style="--category: var(--drama)">1999</div>
</div>
<div class="template">
<Thumbnail video={videos[2]} --category={SciFI}> </Thumbnail>
<div class="templatetext" style="--category: var(--sci-fi)">INTERSTELLAR</div>
<div class="templatetextyear" style="--category: var(--sci-fi)">2014</div>
</div>
<div class="template">
<Thumbnail video={videos[3]} --category={drama}> </Thumbnail>
<div class="templatetext" style="--category: var(--drama)">BOHEMIAN RHAPSODY</div>
<div class="templatetextyear" style="--category: var(--drama)">2018</div>
</div>
<div class="template">
<Thumbnail video={videos[4]} --category={SciFI}> </Thumbnail>
<div class="templatetext" style="--category: var(--sci-fi)">GODZILLA</div>
<div class="templatetextyear" style="--category: var(--sci-fi)">2021</div>
</div>
<div class="template">
<Thumbnail video={videos[5]} --category={comedy}> </Thumbnail>
<div class="templatetext" style="--category: var(--comedy)">BERT</div>
<div class="templatetextyear" style="--category: var(--comedy)">1994</div>
</div>
<div class="template">
<Thumbnail video={videos[6]} --category={comedy}> </Thumbnail>
<div class="templatetext" style="--category: var(--comedy)">RATATOUILLE</div>
<div class="templatetextyear" style="--category: var(--comedy)">2007</div>
</div>
<div class="template">
<Thumbnail video={videos[7]} --category={drama}> </Thumbnail>
<div class="templatetext" style="--category: var(--drama)">THE SHAWSHANK REDEMPTION</div>
<div class="templatetextyear" style="--category: var(--drama)">1994</div>
</div>
<div class="grid2">
<div class="template">
<Thumbnail video={videos[32]} --category={action}> </Thumbnail>
<div class="templatetext" style="--category: var(--action)">Everything Everywhere All at Once</div>
<div class="templatetextyear" style="--category: var(--action)">2022</div>
</div>
<div class="template">
<Thumbnail video={videos[33]} --category={action}> </Thumbnail>
<div class="templatetext" style="--category: var(--action)">Spider-Man: No Way Home</div>
<div class="templatetextyear" style="--category: var(--action)">2021</div>
</div>
<div class="template">
<Thumbnail video={videos[34]} --category={thriller}> </Thumbnail>
<div class="templatetext" style="--category: var(--thriller)">Parasite</div>
<div class="templatetextyear" style="--category: var(--thriller)">2019</div>
</div>
<div class="template">
<Thumbnail video={videos[35]} --category={action}> </Thumbnail>
<div class="templatetext" style="--category: var(--action)">Ford v Ferrari</div>
<div class="templatetextyear" style="--category: var(--action)">2019</div>
</div>
<div class="template">
<Thumbnail video={videos[36]} --category={drama}> </Thumbnail>
<div class="templatetext" style="--category: var(--drama)">Green Book</div>
<div class="templatetextyear" style="--category: var(--drama)">2018</div>
</div>
<div class="template">
<Thumbnail video={videos[37]} --category={SciFI}> </Thumbnail>
<div class="templatetext" style="--category: var(--sci-fi)">Inception</div>
<div class="templatetextyear" style="--category: var(--sci-fi)">2010</div>
</div>
<div class="template">
<Thumbnail video={videos[38]} --category={thriller}> </Thumbnail>
<div class="templatetext" style="--category: var(--thriller)">Joker</div>
<div class="templatetextyear" style="--category: var(--thriller)">2019</div>
</div>
<div class="template">
<Thumbnail video={videos[39]} --category={action}> </Thumbnail>
<div class="templatetext" style="--category: var(--action)">The Dark Knight Rises</div>
<div class="templatetextyear" style="--category: var(--action)">2008</div>
</div>
</div>
</div>
</div>
<div class="filler">
<button class="button-right" style="display: {showButtonRight1 ? 'inline-block' : 'none'}" on:click={TranslateXtrue}>→</button>
</div>
</div>
<div class="aligncenter" style="margin-top: 7.5%;">
<span class="textfirst">Skräckfilmer</span>
</div>
<div class="aligncenter">
<div class="page" style="background-color: {transformX2 ? 'rgba(255,255,255,0.3)' : 'rgba(255,0,0,0.3)'}"></div>
<div class="page" style="background-color: {transformX2 ? 'rgba(255,0,0,0.3)' : 'rgba(255,255,255,0.3)'}"></div>
</div>
<div class="containeroutline">
<div class="filler">
<button class="button-left" style="display: {showButtonLeft2 ? 'inline-block' : 'none'}" on:click={TranslateXfalse2}>←</button>
</div>
<div class="containerfirst">
<div class="grid" style="transform: {transformX2 ? 'translateX(-132.8%)' : 'translateX(0%)'}">
<div class="template">
<Thumbnail video={videos[8]}>--category={horror} </Thumbnail>
<div class="templatetext" style="--category: var(--horror)">HEREDITARY</div>
<div class="templatetextyear" style="--category: var(--horror)">2018</div>
</div>
<div class="template">
<Thumbnail video={videos[9]}>--category={thriller} </Thumbnail>
<div class="templatetext" style="--category: var(--thriller)">GET OUT</div>
<div class="templatetextyear" style="--category: var(--thriller)">2017</div>
</div>
<div class="template">
<Thumbnail video={videos[10]} --category={horror}> </Thumbnail>
<div class="templatetext" style="--category: var(--horror)">THE CONJURING</div>
<div class="templatetextyear" style="--category: var(--horror)">2013</div>
</div>
<div class="template">
<Thumbnail video={videos[11]} --category={horror}> </Thumbnail>
<div class="templatetext" style="--category: var(--horror)">THE CONJURING 2</div>
<div class="templatetextyear" style="--category: var(--horror)">2016</div>
</div>
<div class="template">
<Thumbnail video={videos[12]} --category={horror}> </Thumbnail>
<div class="templatetext" style="--category: var(--horror)">US</div>
<div class="templatetextyear" style="--category: var(--horror)">2019</div>
</div>
<div class="template">
<Thumbnail video={videos[13]} --category={thriller}> </Thumbnail>
<div class="templatetext" style="--category: var(--thriller)">DON'T BREATHE</div>
<div class="templatetextyear" style="--category: var(--thriller)">2016</div>
</div>
<div class="template">
<Thumbnail video={videos[14]} --category={thriller}> </Thumbnail>
<div class="templatetext" style="--category: var(--thriller)">DON'T BREATHE 2</div>
<div class="templatetextyear" style="--category: var(--thriller)">2021</div>
</div>
<div class="template">
<Thumbnail video={videos[15]} --category={horror}> </Thumbnail>
<div class="templatetext" style="--category: var(--horror)">ANNABELLE</div>
<div class="templatetextyear" style="--category: var(--horror)">2014</div>
</div>
<div class="grid2">
<div class="template">
<Thumbnail video={videos[40]} --category={horror}> </Thumbnail>
<div class="templatetext" style="--category: var(--horror)">IT</div>
<div class="templatetextyear" style="--category: var(--horror)">2017</div>
</div>
<div class="template">
<Thumbnail video={videos[41]} --category={horror}> </Thumbnail>
<div class="templatetext" style="--category: var(--horror)">Malignant</div>
<div class="templatetextyear" style="--category: var(--horror)">2021</div>
</div>
<div class="template">
<Thumbnail video={videos[42]} --category={thriller}> </Thumbnail>
<div class="templatetext" style="--category: var(--thriller)">Midsommar</div>
<div class="templatetextyear" style="--category: var(--thriller)">2019</div>
</div>
<div class="template">
<Thumbnail video={videos[43]} --category={horror}> </Thumbnail>
<div class="templatetext" style="--category: var(--horror)">Halloween Kills</div>
<div class="templatetextyear" style="--category: var(--horror)">2021</div>
</div>
<div class="template">
<Thumbnail video={videos[44]} --category={horror}> </Thumbnail>
<div class="templatetext" style="--category: var(--horror)">Goodnight Mommy</div>
<div class="templatetextyear" style="--category: var(--horror)">2014</div>
</div>
<div class="template">
<Thumbnail video={videos[45]} --category={thriller}> </Thumbnail>
<div class="templatetext" style="--category: var(--thriller)">The Invisible Man</div>
<div class="templatetextyear" style="--category: var(--thriller)">2020</div>
</div>
<div class="template">
<Thumbnail video={videos[46]} --category={horror}> </Thumbnail>
<div class="templatetext" style="--category: var(--horror)">Tusk</div>
<div class="templatetextyear" style="--category: var(--horror)">2014</div>
</div>
<div class="template">
<Thumbnail video={videos[47]} --category={thriller}> </Thumbnail>
<div class="templatetext" style="--category: var(--thriller)">Doctor Sleep</div>
<div class="templatetextyear" style="--category: var(--thriller)">2019</div>
</div>
</div>
</div>
</div>
<div class="filler">
<button class="button-right" style="display: {showButtonRight2 ? 'inline-block' : 'none'}" on:click={TranslateXtrue2}>→</button>
</div>
</div>
<div class="aligncenter" style="margin-top: 7.5%">
<span class="textfirst">Nyligen tillagda</span>
</div>
<div class="aligncenter">
<div class="page" style="background-color: {transformX3 ? 'rgba(255,255,255,0.3)' : 'rgba(255,0,0,0.3)'}"></div>
<div class="page" style="background-color: {transformX3 ? 'rgba(255,0,0,0.3)' : 'rgba(255,255,255,0.3)'}"></div>
</div>
<div class="containeroutline">
<div class="filler">
<button class="button-left" style="display: {showButtonLeft3 ? 'inline-block' : 'none'}" on:click={TranslateXfalse3}>←</button>
</div>
<div class="containerfirst">
<div class="grid" style="transform: {transformX3 ? 'translateX(-132.8%)' : 'translateX(0%)'}">
<div class="template">
<Thumbnail video={videos[16]} --category={drama}> </Thumbnail>
<div class="templatetext" style="--category: var(--drama)">12 Years A Slave</div>
<div class="templatetextyear" style="--category: var(--drama)">2013</div>
</div>
<div class="template">
<Thumbnail video={videos[17]} --category={drama}> </Thumbnail>
<div class="templatetext" style="--category: var(--drama)">438 days</div>
<div class="templatetextyear" style="--category: var(--drama)">2019</div>
</div>
<div class="template">
<Thumbnail video={videos[18]} --category={drama}> </Thumbnail>
<div class="templatetext" style="--category: var(--drama)">A Beautiful Mind</div>
<div class="templatetextyear" style="--category: var(--drama)">2001</div>
</div>
<div class="template">
<Thumbnail video={videos[19]} --category={action}> </Thumbnail>
<div class="templatetext" style="--category: var(--action)">Snabba cash</div>
<div class="templatetextyear" style="--category: var(--action)">2010</div>
</div>
<div class="template">
<Thumbnail video={videos[20]} --category={action}> </Thumbnail>
<div class="templatetext" style="--category: var(--action)">El Camino: A Breaking Bad Movie</div>
<div class="templatetextyear" style="--category: var(--action)">2019</div>
</div>
<div class="template">
<Thumbnail video={videos[21]} --category={thriller}> </Thumbnail>
<div class="templatetext" style="--category: var(--thriller)">Fresh</div>
<div class="templatetextyear" style="--category: var(--thriller)">2022</div>
</div>
<div class="template">
<Thumbnail video={videos[22]} --category={drama}> </Thumbnail>
<div class="templatetext" style="--category: var(--drama)">Inglourious Bastards</div>
<div class="templatetextyear" style="--category: var(--drama)">2009</div>
</div>
<div class="template">
<Thumbnail video={videos[23]} --category={thriller}> </Thumbnail>
<div class="templatetext" style="--category: var(--thriller)">Uncut Gems</div>
<div class="templatetextyear" style="--category: var(--thriller)">2019</div>
</div>
<div class="grid2">
<div class="template">
<Thumbnail video={videos[48]} --category={thriller}> </Thumbnail>
<div class="templatetext" style="--category: var(--thriller)">Gone Girl</div>
<div class="templatetextyear" style="--category: var(--thriller)">2014</div>
</div>
<div class="template">
<Thumbnail video={videos[49]} --category={action}> </Thumbnail>
<div class="templatetext" style="--category: var(--action)">Hacksaw Ridge</div>
<div class="templatetextyear" style="--category: var(--action)">2016</div>
</div>
<div class="template">
<Thumbnail video={videos[50]} --category={comedy}> </Thumbnail>
<div class="templatetext" style="--category: var(--comedy)">Inside Out</div>
<div class="templatetextyear" style="--category: var(--comedy)">2015</div>
</div>
<div class="template">
<Thumbnail video={videos[51]} --category={action}> </Thumbnail>
<div class="templatetext" style="--category: var(--action)">Mad Max: Fury Road </div>
<div class="templatetextyear" style="--category: var(--action)">2015</div>
</div>
<div class="template">
<Thumbnail video={videos[52]} --category={thriller}> </Thumbnail>
<div class="templatetext" style="--category: var(--thriller)">Room</div>
<div class="templatetextyear" style="--category: var(--thriller)">2015</div>
</div>
<div class="template">
<Thumbnail video={videos[53]} --category={drama}> </Thumbnail>
<div class="templatetext" style="--category: var(--drama)">Spotlight</div>
<div class="templatetextyear" style="--category: var(--drama)">2015</div>
</div>
<div class="template">
<Thumbnail video={videos[54]} --category={drama}> </Thumbnail>
<div class="templatetext" style="--category: var(--drama)">The Intouchables</div>
<div class="templatetextyear" style="--category: var(--drama)">2011</div>
</div>
<div class="template">
<Thumbnail video={videos[55]} --category={comedy}> </Thumbnail>
<div class="templatetext" style="--category: var(--comedy)">The Wolf of Wall Street</div>
<div class="templatetextyear" style="--category: var(--comedy)">2013</div>
</div>
</div>
</div>
</div>
<div class="filler">
<button class="button-right" style="display: {showButtonRight3 ? 'inline-block' : 'none'}" on:click={TranslateXtrue3}>→</button>
</div>
</div>
<div class="aligncenter" style="margin-top: 7.5%">
<span class="textfirst">Episka storfilmer</span>
</div>
<div class="aligncenter">
<div class="page" style="background-color: {transformX4 ? 'rgba(255,255,255,0.3)' : 'rgba(255,0,0,0.3)'}"></div>
<div class="page" style="background-color: {transformX4 ? 'rgba(255,0,0,0.3)' : 'rgba(255,255,255,0.3)'}"></div>
</div>
<div class="containeroutline">
<div class="filler">
<button class="button-left" style="display: {showButtonLeft4 ? 'inline-block' : 'none'}" on:click={TranslateXfalse4}>←</button>
</div>
<div class="containerfirst">
<div class="grid" style="transform: {transformX4 ? 'translateX(-132.8%)' : 'translateX(0%)'}">
<div class="template">
<Thumbnail video={videos[24]} --category={SciFI}> </Thumbnail>
<div class="templatetext" style="--category: var(--sci-fi)">The Avengers</div>
<div class="templatetextyear" style="--category: var(--sci-fi)">2012</div>
</div>
<div class="template">
<Thumbnail video={videos[25]} --category={SciFI}> </Thumbnail>
<div class="templatetext" style="--category: var(--sci-fi)">Avengers: Age of Ultron</div>
<div class="templatetextyear" style="--category: var(--sci-fi)">2015</div>
</div>
<div class="template">
<Thumbnail video={videos[26]} --category={SciFI}> </Thumbnail>
<div class="templatetext" style="--category: var(--sci-fi)">Avengers: Infinity War</div>
<div class="templatetextyear" style="--category: var(--sci-fi)">2018</div>
</div>
<div class="template">
<Thumbnail video={videos[27]} --category={SciFI}> </Thumbnail>
<div class="templatetext" style="--category: var(--sci-fi)">Avengers: Endgame </div>
<div class="templatetextyear" style="--category: var(--sci-fi)">2019</div>
</div>
<div class="template">
<Thumbnail video={videos[28]} --category={action}> </Thumbnail>
<div class="templatetext" style="--category: var(--action)">The Hunger Games</div>
<div class="templatetextyear" style="--category: var(--action)">2012</div>
</div>
<div class="template">
<Thumbnail video={videos[29]} --category={action}> </Thumbnail>
<div class="templatetext" style="--category: var(--action)">The Hunger Games: Catching Fire</div>
<div class="templatetextyear" style="--category: var(--action)">2013</div>
</div>
<div class="template">
<Thumbnail video={videos[30]} --category={action}> </Thumbnail>
<div class="templatetext" style="--category: var(--action)">The Hunger Games: Mockingjay – Part 1</div>
<div class="templatetextyear" style="--category: var(--action)">2014</div>
</div>
<div class="template">
<Thumbnail video={videos[31]} --category={action}> </Thumbnail>
<div class="templatetext" style="--category: var(--action)">The Hunger Games: Mockingjay – Part 2</div>
<div class="templatetextyear" style="--category: var(--action)">2015</div>
</div>
<div class="grid2">
<div class="template">
<Thumbnail video={videos[56]} --category={action}> </Thumbnail>
<div class="templatetext" style="--category: var(--action)">Avatar</div>
<div class="templatetextyear" style="--category: var(--action)">2009</div>
</div>
<div class="template">
<Thumbnail video={videos[57]} --category={action}> </Thumbnail>
<div class="templatetext" style="--category: var(--action)">Batman Begins</div>
<div class="templatetextyear" style="--category: var(--action)">2005</div>
</div>
<div class="template">
<Thumbnail video={videos[58]} --category={fantasy}> </Thumbnail>
<div class="templatetext" style="--category: var(--fantasy)">Doctor Strange in the Multiverse of Madness</div>
<div class="templatetextyear" style="--category: var(--fantasy)">2022</div>
</div>
<div class="template">
<Thumbnail video={videos[59]} --category={action}> </Thumbnail>
<div class="templatetext" style="--category: var(--action)">Logan</div>
<div class="templatetextyear" style="--category: var(--action)">2017</div>
</div>
<div class="template">
<Thumbnail video={videos[60]} --category={action}> </Thumbnail>
<div class="templatetext" style="--category: var(--action)">Kill Bill: Volume 1</div>
<div class="templatetextyear" style="--category: var(--action)">2003</div>
</div>
<div class="template">
<Thumbnail video={videos[61]} --category={action}> </Thumbnail>
<div class="templatetext" style="--category: var(--action)">Kill Bill: Volume 2</div>
<div class="templatetextyear" style="--category: var(--action)">2004</div>
</div>
<div class="template">
<Thumbnail video={videos[62]} --category={drama}> </Thumbnail>
<div class="templatetext" style="--category: var(--drama)">The Departed</div>
<div class="templatetextyear" style="--category: var(--drama)">2006</div>
</div>
<div class="template">
<Thumbnail video={videos[63]} --category={mystery}> </Thumbnail>
<div class="templatetext" style="--category: var(--mystery)">The Prestige</div>
<div class="templatetextyear" style="--category: var(--mystery)">2006</div>
</div>
</div>
</div>
</div>
<div class="filler">
<button class="button-right" style="display: {showButtonRight4 ? 'inline-block' : 'none'}" on:click={TranslateXtrue4}>→</button>
</div>
</div>
<div class="aligncenter" style="margin-top: 7.5%">
<span class="textfirst">Filmsamlingar</span>
</div>
<div class="aligncenter">
<div class="page" style="background-color: {transformX5 ? 'rgba(255,255,255,0.3)' : 'rgba(255,0,0,0.3)'}"></div>
<div class="page" style="background-color: {transformX5 ? 'rgba(255,0,0,0.3)' : 'rgba(255,255,255,0.3)'}"></div>
</div>
<div class="containeroutline">
<div class="filler">
<button class="button-left" style="display: {showButtonLeft5 ? 'inline-block' : 'none'}" on:click={TranslateXfalse5}>←</button>
</div>
<div class="containerfirst">
<div class="grid" style="transform: {transformX5 ? 'translateX(-132.8%)' : 'translateX(0%)'}">
<div class="template">
<Thumbnail video={videos[72]} --category={fantasy}> </Thumbnail>
<div class="templatetext" style="--category: var(--fantasy)">Harry Potter and the Sorcerer's Stone</div>
<div class="templatetextyear" style="--category: var(--fantasy)">2001</div>
</div>
<div class="template">
<Thumbnail video={videos[73]} --category={fantasy}> </Thumbnail>
<div class="templatetext" style="--category: var(--fantasy)">Harry Potter and the Chamber of Secrets</div>
<div class="templatetextyear" style="--category: var(--fantasy)">2002</div>
</div>
<div class="template">
<Thumbnail video={videos[74]} --category={fantasy}> </Thumbnail>
<div class="templatetext" style="--category: var(--fantasy)"> Harry Potter and the Prisoner of Azkaban</div>
<div class="templatetextyear" style="--category: var(--fantasy)">2004</div>
</div>
<div class="template">
<Thumbnail video={videos[75]} --category={fantasy}> </Thumbnail>
<div class="templatetext" style="--category: var(--fantasy)">Harry Potter and the Goblet of Fire</div>
<div class="templatetextyear" style="--category: var(--fantasy)">2005</div>
</div>
<div class="template">
<Thumbnail video={videos[76]} --category={fantasy}> </Thumbnail>
<div class="templatetext" style="--category: var(--fantasy)">Harry Potter and the Order of the Phoenix</div>
<div class="templatetextyear" style="--category: var(--fantasy)">2007</div>
</div>
<div class="template">
<Thumbnail video={videos[77]} --category={fantasy}> </Thumbnail>
<div class="templatetext" style="--category: var(--fantasy)">Harry Potter and the Half-Blood Prince</div>
<div class="templatetextyear" style="--category: var(--fantasy)">2009</div>
</div>
<div class="template">
<Thumbnail video={videos[78]} --category={fantasy}> </Thumbnail>
<div class="templatetext" style="--category: var(--fantasy)">Harry Potter and the Deathly Hallows: Part 1</div>
<div class="templatetextyear" style="--category: var(--fantasy)">2010</div>
</div>
<div class="template">
<Thumbnail video={videos[79]} --category={fantasy}> </Thumbnail>
<div class="templatetext" style="--category: var(--fantasy)">Harry Potter and the Deathly Hallows: Part 2</div>
<div class="templatetextyear" style="--category: var(--fantasy)">2011</div>
</div>
<div class="grid2">
<div class="template">
<Thumbnail video={videos[64]} --category={fantasy}> </Thumbnail>
<div class="templatetext" style="--category: var(--fantasy)">Thor</div>
<div class="templatetextyear" style="--category: var(--fantasy)">2011</div>
</div>
<div class="template">
<Thumbnail video={videos[65]} --category={fantasy}> </Thumbnail>
<div class="templatetext" style="--category: var(--fantasy)">Thor: The Dark World</div>
<div class="templatetextyear" style="--category: var(--fantasy)">2013</div>
</div>
<div class="template">
<Thumbnail video={videos[66]} --category={fantasy}> </Thumbnail>
<div class="templatetext" style="--category: var(--fantasy)">Thor: Ragnarok</div>
<div class="templatetextyear" style="--category: var(--fantasy)">2017</div>
</div>
<div class="template">
<Thumbnail video={videos[67]} --category={fantasy}> </Thumbnail>
<div class="templatetext" style="--category: var(--fantasy)">Thor: Love and Thunder</div>
<div class="templatetextyear" style="--category: var(--fantasy)">2022</div>
</div>
<div class="template">
<Thumbnail video={videos[68]} --category={action}> </Thumbnail>
<div class="templatetext" style="--category: var(--action)">John Wick</div>
<div class="templatetextyear" style="--category: var(--action)">2014</div>
</div>
<div class="template">
<Thumbnail video={videos[69]} --category={action}> </Thumbnail>
<div class="templatetext" style="--category: var(--action)">John Wick: Chapter 2</div>
<div class="templatetextyear" style="--category: var(--action)">2017</div>
</div>
<div class="template">
<Thumbnail video={videos[70]} --category={action}> </Thumbnail>
<div class="templatetext" style="--category: var(--action)">John Wick: Chapter 3 - Parabellum</div>
<div class="templatetextyear" style="--category: var(--action)">2019</div>
</div>
<div class="template">
<Thumbnail video={videos[71]} --category={action}> </Thumbnail>
<div class="templatetext" style="--category: var(--action)">John Wick: Chapter 4 (Upcoming)</div>
<div class="templatetextyear" style="--category: var(--action)">2023</div>
</div>
</div>
</div>
</div>
<div class="filler">
<button class="button-right" style="display: {showButtonRight5 ? 'inline-block' : 'none'}" on:click={TranslateXtrue5}>→</button>
</div>
</div>
</div>
</div>
<!-- Styling alternativ 2-->


<div class="containeroutlinenameStyle2" style="display: {styleScroll ? '' : 'none'}">
	<div id="titleStyle2"><img id="HBOLOGGAStyle2" src="hbo-max-hbo.png" alt="HBOMAX LOGGA"> <img id="HBOMAXLOGGAStyle2" src="hbo-max-max.png" alt="HBOMAX LOGGA"><h1 id="titletextStyle2">MINI</h1></div>
	</div>
<div class="stylingscroll" style="display: {styleScroll ? 'block' : 'none'}">
<div class="aligncenterStyle2">
<span class="textfirstStyle2">Trendar</span>
</div>
<div class="containeroutlineStyle2">
<div class="containerfirstStyle2">
<div class="gridStyle2">
<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[0]} --category={action}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--action)">THE BATMAN</div>
	<div class="templatetextyearStyle2" style="--category: var(--action)">2022</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[1]} --category={drama}> <div class="play"></div></ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--drama)">FIGHT CLUB</div>
	<div class="templatetextyearStyle2" style="--category: var(--drama)">1999</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[2]} --category={SciFI}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--sci-fi)">INTERSTELLAR</div>
	<div class="templatetextyearStyle2" style="--category: var(--sci-fi)">2014</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[3]} --category={drama}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--drama)">BOHEMIAN RHAPSODY</div>
	<div class="templatetextyearStyle2" style="--category: var(--drama)">2018</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[4]} --category={SciFI}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--sci-fi)">GODZILLA</div>
	<div class="templatetextyearStyle2" style="--category: var(--sci-fi)">2021</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[5]} --category={comedy}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--comedy)">BERT</div>
	<div class="templatetextyearStyle2" style="--category: var(--comedy)">1994</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[6]} --category={comedy}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--comedy)">RATATOUILLE</div>
	<div class="templatetextyearStyle2" style="--category: var(--comedy)">2007</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[7]} --category={drama}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--drama)">THE SHAWSHANK REDEMPTION</div>
	<div class="templatetextyearStyle2" style="--category: var(--drama)">1994</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[32]} --category={action}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--action)">Everything Everywhere All at Once</div>
	<div class="templatetextyearStyle2" style="--category: var(--action)">2022</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[33]} --category={action}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--action)">Spider-Man: No Way Home</div>
	<div class="templatetextyearStyle2" style="--category: var(--action)">2021</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[34]} --category={thriller}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--thriller)">Parasite</div>
	<div class="templatetextyearStyle2" style="--category: var(--thriller)">2019</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[35]} --category={action}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--action)">Ford v Ferrari</div>
	<div class="templatetextyearStyle2" style="--category: var(--action)">2019</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[36]} --category={drama}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--drama)">Green Book</div>
	<div class="templatetextyearStyle2" style="--category: var(--drama)">2018</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[37]} --category={SciFI}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--sci-fi)">Inception</div>
	<div class="templatetextyearStyle2" style="--category: var(--sci-fi)">2010</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[38]} --category={thriller}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--thriller)">Joker</div>
	<div class="templatetextyearStyle2" style="--category: var(--thriller)">2019</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[39]} --category={action}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--action)">The Dark Knight Rises</div>
	<div class="templatetextyearStyle2" style="--category: var(--action)">2008</div>
	</div>
	</div>
	</div>
	</div>
	<div class="aligncenterStyle2" style="margin-top: 7.5%;">
	<span class="textfirstStyle2">Skräckfilmer</span>
	</div>
	<div class="containeroutlineStyle2">
	<div class="containerfirstStyle2">
	<div class="gridStyle2">
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[8]}>--category={horror} </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--horror)">HEREDITARY</div>
	<div class="templatetextyearStyle2" style="--category: var(--horror)">2018</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[9]}>--category={thriller} </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--thriller)">GET OUT</div>
	<div class="templatetextyearStyle2" style="--category: var(--thriller)">2017</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[10]} --category={horror}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--horror)">THE CONJURING</div>
	<div class="templatetextyearStyle2" style="--category: var(--horror)">2013</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[11]} --category={horror}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--horror)">THE CONJURING 2</div>
	<div class="templatetextyearStyle2" style="--category: var(--horror)">2016</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[12]} --category={horror}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--horror)">US</div>
	<div class="templatetextyearStyle2" style="--category: var(--horror)">2019</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[13]} --category={thriller}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--thriller)">DON'T BREATHE</div>
	<div class="templatetextyearStyle2" style="--category: var(--thriller)">2016</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[14]} --category={thriller}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--thriller)">DON'T BREATHE 2</div>
	<div class="templatetextyearStyle2" style="--category: var(--thriller)">2021</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[15]} --category={horror}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--horror)">ANNABELLE</div>
	<div class="templatetextyearStyle2" style="--category: var(--horror)">2014</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[40]} --category={horror}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--horror)">IT</div>
	<div class="templatetextyearStyle2" style="--category: var(--horror)">2017</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[41]} --category={horror}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--horror)">Malignant</div>
	<div class="templatetextyearStyle2" style="--category: var(--horror)">2021</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[42]} --category={thriller}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--thriller)">Midsommar</div>
	<div class="templatetextyearStyle2" style="--category: var(--thriller)">2019</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[43]} --category={horror}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--horror)">Halloween Kills</div>
	<div class="templatetextyearStyle2" style="--category: var(--horror)">2021</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[44]} --category={horror}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--horror)">Goodnight Mommy</div>
	<div class="templatetextyearStyle2" style="--category: var(--horror)">2014</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[45]} --category={thriller}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--thriller)">The Invisible Man</div>
	<div class="templatetextyearStyle2" style="--category: var(--thriller)">2020</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[46]} --category={horror}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--horror)">Tusk</div>
	<div class="templatetextyearStyle2" style="--category: var(--horror)">2014</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[47]} --category={thriller}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--thriller)">Doctor Sleep</div>
	<div class="templatetextyearStyle2" style="--category: var(--thriller)">2019</div>
	</div>
	</div>
	</div>
	</div>
	<div class="aligncenterStyle2" style="margin-top: 7.5%">
	<span class="textfirstStyle2">Nyligen tillagda</span>
	</div>
	<div class="containeroutlineStyle2">
	<div class="containerfirstStyle2">
	<div class="gridStyle2">
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[16]} --category={drama}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--drama)">12 Years A Slave</div>
	<div class="templatetextyearStyle2" style="--category: var(--drama)">2013</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[17]} --category={drama}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--drama)">438 days</div>
	<div class="templatetextyearStyle2" style="--category: var(--drama)">2019</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[18]} --category={drama}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--drama)">A Beautiful Mind</div>
	<div class="templatetextyearStyle2" style="--category: var(--drama)">2001</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[19]} --category={action}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--action)">Snabba cash</div>
	<div class="templatetextyearStyle2" style="--category: var(--action)">2010</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[20]} --category={action}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--action)">El Camino: A Breaking Bad Movie</div>
	<div class="templatetextyearStyle2" style="--category: var(--action)">2019</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[21]} --category={thriller}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--thriller)">Fresh</div>
	<div class="templatetextyearStyle2" style="--category: var(--thriller)">2022</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[22]} --category={drama}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--drama)">Inglourious Bastards</div>
	<div class="templatetextyearStyle2" style="--category: var(--drama)">2009</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[23]} --category={thriller}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--thriller)">Uncut Gems</div>
	<div class="templatetextyearStyle2" style="--category: var(--thriller)">2019</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[48]} --category={thriller}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--thriller)">Gone Girl</div>
	<div class="templatetextyearStyle2" style="--category: var(--thriller)">2014</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[49]} --category={action}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--action)">Hacksaw Ridge</div>
	<div class="templatetextyearStyle2" style="--category: var(--action)">2016</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[50]} --category={comedy}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--comedy)">Inside Out</div>
	<div class="templatetextyearStyle2" style="--category: var(--comedy)">2015</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[51]} --category={action}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--action)">Mad Max: Fury Road </div>
	<div class="templatetextyearStyle2" style="--category: var(--action)">2015</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[52]} --category={thriller}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--thriller)">Room</div>
	<div class="templatetextyearStyle2" style="--category: var(--thriller)">2015</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[53]} --category={drama}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--drama)">Spotlight</div>
	<div class="templatetextyearStyle2" style="--category: var(--drama)">2015</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[54]} --category={drama}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--drama)">The Intouchables</div>
	<div class="templatetextyearStyle2" style="--category: var(--drama)">2011</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[55]} --category={comedy}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--comedy)">The Wolf of Wall Street</div>
	<div class="templatetextyearStyle2" style="--category: var(--comedy)">2013</div>
	</div>
	</div>
	</div>
	</div>
	<div class="aligncenterStyle2" style="margin-top: 7.5%">
		<span class="textfirstStyle2">Episka storfilmer</span>
	</div>
	<div class="containeroutlineStyle2">
	<div class="containerfirstStyle2">
	<div class="gridStyle2">
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[24]} --category={SciFI}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--sci-fi)">The Avengers</div>
	<div class="templatetextyearStyle2" style="--category: var(--sci-fi)">2012</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[25]} --category={SciFI}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--sci-fi)">Avengers: Age of Ultron</div>
	<div class="templatetextyearStyle2" style="--category: var(--sci-fi)">2015</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[26]} --category={SciFI}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--sci-fi)">Avengers: Infinity War</div>
	<div class="templatetextyearStyle2" style="--category: var(--sci-fi)">2018</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[27]} --category={SciFI}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--sci-fi)">Avengers: Endgame </div>
	<div class="templatetextyearStyle2" style="--category: var(--sci-fi)">2019</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[28]} --category={action}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--action)">The Hunger Games</div>
	<div class="templatetextyearStyle2" style="--category: var(--action)">2012</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[29]} --category={action}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--action)">The Hunger Games: Catching Fire</div>
	<div class="templatetextyearStyle2" style="--category: var(--action)">2013</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[30]} --category={action}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--action)">The Hunger Games: Mockingjay – Part 1</div>
	<div class="templatetextyearStyle2" style="--category: var(--action)">2014</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[31]} --category={action}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--action)">The Hunger Games: Mockingjay – Part 2</div>
	<div class="templatetextyearStyle2" style="--category: var(--action)">2015</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[56]} --category={action}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--action)">Avatar</div>
	<div class="templatetextyearStyle2" style="--category: var(--action)">2009</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[57]} --category={action}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--action)">Batman Begins</div>
	<div class="templatetextyearStyle2" style="--category: var(--action)">2005</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[58]} --category={fantasy}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--fantasy)">Doctor Strange in the Multiverse of Madness</div>
	<div class="templatetextyearStyle2" style="--category: var(--fantasy)">2022</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[59]} --category={action}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--action)">Logan</div>
	<div class="templatetextyearStyle2" style="--category: var(--action)">2017</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[60]} --category={action}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--action)">Kill Bill: Volume 1</div>
	<div class="templatetextyearStyle2" style="--category: var(--action)">2003</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[61]} --category={action}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--action)">Kill Bill: Volume 2</div>
	<div class="templatetextyearStyle2" style="--category: var(--action)">2004</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[62]} --category={drama}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--drama)">The Departed</div>
	<div class="templatetextyearStyle2" style="--category: var(--drama)">2006</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[63]} --category={mystery}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--mystery)">The Prestige</div>
	<div class="templatetextyearStyle2" style="--category: var(--mystery)">2006</div>
	</div>
	</div>
	</div>
	</div>
	<div class="aligncenterStyle2" style="margin-top: 7.5%">
	<span class="textfirstStyle2">Filmsamlingar</span>
	</div>
	<div class="containeroutlineStyle2">
	<div class="containerfirstStyle2">
	<div class="gridStyle2">
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[72]} --category={fantasy}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--fantasy)">Harry Potter and the Sorcerer's Stone</div>
	<div class="templatetextyearStyle2" style="--category: var(--fantasy)">2001</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[73]} --category={fantasy}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--fantasy)">Harry Potter and the Chamber of Secrets</div>
	<div class="templatetextyearStyle2" style="--category: var(--fantasy)">2002</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[74]} --category={fantasy}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--fantasy)"> Harry Potter and the Prisoner of Azkaban</div>
	<div class="templatetextyearStyle2" style="--category: var(--fantasy)">2004</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[75]} --category={fantasy}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--fantasy)">Harry Potter and the Goblet of Fire</div>
	<div class="templatetextyearStyle2" style="--category: var(--fantasy)">2005</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[76]} --category={fantasy}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--fantasy)">Harry Potter and the Order of the Phoenix</div>
	<div class="templatetextyearStyle2" style="--category: var(--fantasy)">2007</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[77]} --category={fantasy}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--fantasy)">Harry Potter and the Half-Blood Prince</div>
	<div class="templatetextyearStyle2" style="--category: var(--fantasy)">2009</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[78]} --category={fantasy}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--fantasy)">Harry Potter and the Deathly Hallows: Part 1</div>
	<div class="templatetextyearStyle2" style="--category: var(--fantasy)">2010</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[79]} --category={fantasy}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--fantasy)">Harry Potter and the Deathly Hallows: Part 2</div>
	<div class="templatetextyearStyle2" style="--category: var(--fantasy)">2011</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[64]} --category={fantasy}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--fantasy)">Thor</div>
	<div class="templatetextyearStyle2" style="--category: var(--fantasy)">2011</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[65]} --category={fantasy}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--fantasy)">Thor: The Dark World</div>
	<div class="templatetextyearStyle2" style="--category: var(--fantasy)">2013</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[66]} --category={fantasy}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--fantasy)">Thor: Ragnarok</div>
	<div class="templatetextyearStyle2" style="--category: var(--fantasy)">2017</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[67]} --category={fantasy}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--fantasy)">Thor: Love and Thunder</div>
	<div class="templatetextyearStyle2" style="--category: var(--fantasy)">2022</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[68]} --category={action}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--action)">John Wick</div>
	<div class="templatetextyearStyle2" style="--category: var(--action)">2014</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[69]} --category={action}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--action)">John Wick: Chapter 2</div>
	<div class="templatetextyearStyle2" style="--category: var(--action)">2017</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[70]} --category={action}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--action)">John Wick: Chapter 3 - Parabellum</div>
	<div class="templatetextyearStyle2" style="--category: var(--action)">2019</div>
	</div>
	<div class="templateStyle2">
	<ThumbnailStyle2 video={videos[71]} --category={action}> </ThumbnailStyle2>
	<div class="templatetextStyle2" style="--category: var(--action)">John Wick: Chapter 4 (Upcoming)</div>
	<div class="templatetextyearStyle2" style="--category: var(--action)">2023</div>
</div>
</div>
</div>
</div>
</div>
<Overlay
opacity={is_fullscreen ? 1 : 0.3}
color="#0c1445"
active={$video_player_is_active}
on:click={() => {
$video_player_is_active = false;
}}
>
<div
id="video"
class:fullscreen={is_fullscreen == true}
on:click={(e) => {
e.stopPropagation();
}}
>
<div id="close">
<Button
class="error-color"
size="small"
on:click={() => {
$video_player_is_active = false,
check(),
visaMindre = false,
theatreMode = false;
}}
>
Close
</Button>
</div>
<div id="fullscreen">
<Button
size="small"
class="primary-color"
on:click={() => {
is_fullscreen = !is_fullscreen, 
showButtonLeft1 = false,
showButtonLeft2 = false,
showButtonLeft3 = false,
showButtonLeft4 = false,
showButtonLeft5 = false,
showButtonRight1 = false,
showButtonRight2 = false,
showButtonRight3 = false,
showButtonRight4 = false,
showButtonRight5 = false,
visaMindre = true,
showCategories = false;
theatreMode = true;

// do not focus the fullscreenbutton if clicked
// this is because otherwise clicking space will cause
// the video player to maximize/minimize instead of pause/play
// when space is clicked
if (document.activeElement != document.body)
document.activeElement.blur();
}}
>
{is_fullscreen ? "Minimize" : "Theatre Mode"}
</Button>
</div>

{#if is_fullscreen}
<div id="close">
	<Button
	class="error-color"
	size="small"
	on:click={() => {minimizeBeforeClosing = true}}>
	Close
	</Button>
</div>
<div id="gigascreen">
<Button
size="small"
class="secondary-color"
on:click={() => {
// do not focus the fullscreenbutton if clicked
// this is because otherwise clicking space will cause
// the video player to maximize/minimize instead of pause/play
// when space is clicked
if (document.activeElement != document.body)
document.activeElement.blur();

let div = document.getElementById("vid");
if (div.requestFullscreen) div.requestFullscreen();
else if (div.webkitRequestFullscreen)
div.webkitRequestFullscreen();
else if (div.msRequestFullScreen) div.msRequestFullScreen();
}}
>
{"Gigascreen"}
</Button>
</div>
{/if}

<Player />
</div>
</Overlay>

<src />
</main>
<style>
	:global(:root) {
	--documentary: white;
	--comedy: aqua;
	--horror: red;
	--thriller: maroon;
	--action: gold;
	--sci-fi: lime;
	--drama: indigo;
	--romance: magenta;
	--mystery: seagreen;
	--fantasy: coral;
}
:global(body) {
padding: 0;
margin: 0;
}
* {
box-sizing: border-box;
}
main {
min-height: 100%;
height: 100%;
width: 100%;
/* bakgrunden är ifrån: https://www.gradientmagic.com/collection/complexcircles/gradient/1584217947897 */
background-image: radial-gradient(circle at 47% 14%, rgba(205, 205, 205,0.04) 0%, rgba(205, 205, 205,0.04) 43%,transparent 43%, transparent 100%),radial-gradient(circle at 35% 12%, rgba(215, 215, 215,0.04) 0%, rgba(215, 215, 215,0.04) 4%,transparent 4%, transparent 100%),radial-gradient(circle at 1% 35%, rgba(24, 24, 24,0.04) 0%, rgba(24, 24, 24,0.04) 37%,transparent 37%, transparent 100%),radial-gradient(circle at 21% 1%, rgba(0, 0, 0,0.04) 0%, rgba(0, 0, 0,0.04) 26%,transparent 26%, transparent 100%),radial-gradient(circle at 23% 82%, rgba(249, 249, 249,0.04) 0%, rgba(249, 249, 249,0.04) 60%,transparent 60%, transparent 100%),radial-gradient(circle at 11% 54%, rgba(251, 251, 251,0.04) 0%, rgba(251, 251, 251,0.04) 23%,transparent 23%, transparent 100%),radial-gradient(circle at 69% 68%, rgba(234, 234, 234,0.04) 0%, rgba(234, 234, 234,0.04) 10%,transparent 10%, transparent 100%),linear-gradient(90deg, rgb(228, 46, 222),rgb(63, 61, 215));
overflow-x: hidden;
overflow-y: scroll;
}
.info {
	position: absolute;
	color: white;
	font-size: 20px;
	right: 0%;
	font-family: 'Bebas Neue', cursive;
	background-color: rgba(0,0,0,0.25);
	border: 0.1px solid white;
	z-index: 999999999;
}
.stylingwbuttonsbackground {
	min-height: 0%;
height: 0%;
width: 0%;
background: transparent;
background-color: transparent;
}
.stylingwbuttons {
	display: none;
}
.revealcategories {
	position: static;
	height: 48px;
	width: 200px;
	font-size: 0.96em;
	font-family: 'Orelega One', cursive;
	background-color: rgba(5,255,255,0.3);
	border-radius: 10px;
	text-align: center;
	padding: 6px;
}
.revealcategories i {
	margin-left: 5px;
	margin-right: 5px;
}
.categories {
	position: absolute;
	background-color: rgba(5,255,255,0.5);
	border-radius: 0px 20px 20px 20px;
	width: 210px;
	height: 360px;
	left: 0%;
	top: 184px;
	border-bottom: 3px solid rgba(5,255,255,0.3);
	border-left: 3px solid rgba(5,255,255,0.3);
	border-right: 3px solid rgba(5,255,255,0.3);
	z-index: 999999;
}
.arrow {
	position: absolute;
	background-color: black;
	border: 1px solid white;
	color: white;
	font-size: 0.7em;
	height: 25px;
	width: 25px;
	border-radius: 50%;
	top: 80%;
	right: 25%;
	text-align: center;
}
.colorball {
	position: relative;
	width: 20px;
	height: 20px;
	background-color: var(--category);
	border: 0.5px solid white;
	border-radius: 50%;
	margin-top: 10px;
}
p {
	font-size: 1.4em;
	bottom: -130%;
	left: 120%;
	position: absolute;
	font-family: 'Rubik Wet Paint', cursive;
	color: var(--category);
}
.template {
height: 310px;
width: 200px;
border: 1px solid transparent;
text-align: center;

}
.template .templatetext { 
position: static;
font-size: 0.9em;
font-weight: bold;
font-family: 'Orelega One', cursive;
color: var(--category);
}
.templatetextyear {
font-size: 0.7em;
color: var(--category);
}
#video {
position: fixed;
transition: all 0.3s ease-out;
left: 15%;
right: 15%;
top: 15%;
bottom: 15%;
z-index: 999;
}
#video.fullscreen {
left: 0%;
right: 0%;
top: 0%;
bottom: 0%;
z-index: 999;
}
#video.fullscreen #gigascreen {
position: absolute;
top: 10px; /* position the top  edge of the element at the middle of the parent */
left: 50%; /* position the left edge of the element at the middle of the parent */
transform: translate(-50%, 0);
z-index: 999;
}
#video #close {
position: absolute;
top: -10px;
right: -10px;
z-index: 999;
}
.minimizetext {
	position: absolute;
	height: 15%;
	width: 60%;
	border-radius: 20px;
	border: 3px solid gray;
	background-color: white;
	top: 40%;
	left: 50%;
	transform: translate(-50%, -40%);
  -ms-transform: translate(-50%, -40%);
	z-index: 1000;
	text-align: center;
	box-shadow: red -1px -1px 30px 1px;
	font-size: 1.5em;
}
.minimizetext::after {
	content: 'PRESS "Minimize" BEFORE CLOSING THE VIDEOPLAYER';
	color: red;
	z-index: 1000;
	font-family: 'Kanit', sans-serif;
}
.ok {
	background-color: green;
	border: 1px solid white;
	height: 35px;
	width: 50px;
	position: absolute;
  left: 50%;
  transform: translate(-50%, -130%);
  -ms-transform: translate(-50%, -130%);
	top: 130%;
	text-align: center;
	font-size: 0.65em;
}
.ok::after {
	content: 'OK';
	color: white;
	font-family: 'Press Start 2P', cursive;
}
#video #fullscreen {
position: absolute;
top: -10px;
left: -10px;
z-index: 999;
}
#video.fullscreen #close {
position: absolute;
top: 10px;
right: 10px;
z-index: 999;
}
#video.fullscreen #fullscreen {
position: absolute;
top: 10px;
left: 10px;
z-index: 999;
}
.textfirst {
font-family: 'League Spartan', sans-serif;
color: white;
font-size: 1.5em;
position: static;
padding-left: 10px;
padding-right: 10px;
border-radius: 5px;
border: 1px solid black;
background: rgba(255,255,255, 0.3);
}
.containerfirst {
height: 100%; 
width: 85.5%;
border: 1px solid transparent;
}
.containeroutline {
display: flex;
align-items: center;
height: 340px;
width: 100%;
}
.containeroutlineStyle2 {
display: flex;
align-items: center;
height: 380px;
width: 100%;
}
.containeroutlinename {
display: flex;
justify-content: center;
align-items: center;
height: 200px;
width: 100%;
border: 1px solid transparent;
}
.containeroutlinenameStyle2 {
display: flex;
justify-content: center;
align-items: center;
height: 200px;
width: 100%;
border: 1px solid transparent;
}
.grid {
margin-top: 10px;
display: flex;
position: relative;
width: 100%;
grid-row-gap: 50px;
grid-column-gap: auto;
grid-template-columns: auto auto auto auto auto;
border: 1px solid transparent;
}
.grid2 {
display: flex;
position: absolute;
width: 100%;
grid-row-gap: 50px;
margin-left: 133%;
grid-column-gap: auto;
grid-template-columns: auto auto auto auto auto;
border: 1px solid transparent;
}
#title {
display: flex;
position: relative;
align-items: center;
width: 340px;
height: 125px;
background-color: rgba(210, 232, 235, 0.3);
border-bottom: 3px solid silver;
border-right: 3px solid silver;
border-radius: 30px;
}
#titletext {
font-size: 2.7em;
font-family: 'Kanit', sans-serif;
font-weight: bold; 
color: rgb(0, 153, 255);
margin-top: 5%;
left: 14%;
position: relative;
text-shadow:2px 2px rgb(110, 191, 244);
z-index: 2;
}
#title:hover {
background-image: linear-gradient(145deg, rgba(247,60,245,1) 0%, rgba(9,9,121,1) 33%, rgba(6,70,143,1) 51%, rgba(191,4,163,1) 68%, rgba(184,4,151,1) 100%);;
}
#HBOLOGGA {
height: 165px;
width: 150px;
position: relative;
margin-left: 2%;
margin-top: 6%;
}
#HBOLOGGA:hover {
box-shadow: 0px 0px 0px 0px;
position: relative;
}
#HBOMAXLOGGA {
height: 165px;
width: 170px;
position: absolute;
margin-left: 46%;
filter:blur(4px);
margin-top: 10px;
z-index: 1;
}
#HBOMAXLOGGA:hover {
box-shadow: 0px 0px 0px 0px;
}
#titleStyle2 {
display: flex;
position: relative;
align-items: center;
width: 340px;
height: 125px;
background-color: rgba(210, 232, 235, 0.3);
border-bottom: 3px solid silver;
border-right: 3px solid silver;
border-radius: 30px;
}
#titletextStyle2 {
font-size: 2.7em;
font-family: 'Kanit', sans-serif;
font-weight: bold; 
color: rgb(0, 153, 255);
margin-top: 5%;
left: 14%;
position: relative;
text-shadow:2px 2px rgb(110, 191, 244);
z-index: 2;
}
#titleStyle2:hover {
background-image: linear-gradient(145deg, rgba(247,60,245,1) 0%, rgba(9,9,121,1) 33%, rgba(6,70,143,1) 51%, rgba(191,4,163,1) 68%, rgba(184,4,151,1) 100%);;
}
#HBOLOGGAStyle2 {
height: 165px;
width: 150px;
position: relative;
margin-left: 2%;
margin-top: 6%;
}
#HBOLOGGAStyle2:hover {
box-shadow: 0px 0px 0px 0px;
position: relative;
}
#HBOMAXLOGGAStyle2 {
height: 165px;
width: 170px;
position: absolute;
margin-left: 46%;
filter:blur(4px);
margin-top: 10px;
z-index: 1;
}
#HBOMAXLOGGAStyle2:hover {
box-shadow: 0px 0px 0px 0px;
}
.button-right {
width: 50px;
height: 50px;
border-radius: 50%;
color: white;
background-color: rgba(255,255,255,0.3);
position: static;
z-index: -1; 
font-size: 1em;
}
.filler {
width: 20%;
height: 100%;
z-index: 999;
display: flex;
align-items: center;
justify-content: center;
}
.button-left {
width: 50px;
height: 50px;
border-radius: 50%;
color: white;
position: static;
background-color: rgba(255,255,255,0.3);
z-index: -1;
font-size: 1em;
}
.page {
width: 45px;
height: 15px;
border-radius: 10px;
border: 0.1px solid white;
margin-top: 2px;
}
.aligncenter {
width: 100%;
height: auto;
display: flex;
align-items: center;
justify-content: center;
}
.onoff {
font-family: 'Rokkitt', serif;
position: absolute;
margin: 0;
width: 280px;
height: 210px;
display: flex;
justify-content: left;
align-items: left;
font-size: 17px;
border: 0.1px solid white;
border-radius: 0px 0px 30% 0px;
background-color: rgba(96, 150, 177, 0.3);
z-index: 9999;
}
.containeronoff {
width: 200px;
height: 200px;
display: flex;
flex-wrap: wrap;
justify-content: left;
align-items: left;
border: 1px solid transparent;
}
.onoff-box {
display: flex;
height: 60px;
width: 250px;
padding: 10px 20px;
border-radius: 10px;
box-shadow: -8px -8px 15px rgba(255,255,255,.15),
10px 10px 10px rgba(0,0,0, .3);
border: 1px solid white;
justify-content: center;
align-items: center;
}
.onoff-text {
width: 160px;
}
.onoff-text i {
margin-right: 5%;
}
.onoff-toggle {
height: 65%;
padding-bottom: 40px;

}
.onoff-toggle input[type="radio"] {
position: absolute;
opacity: 0;
z-index: -2;
}
.onoff-toggle input[type="radio"] + label {
position: relative;
display: inline-block;
width: 100px;
height: 40px;
border-radius: 20px;
margin: 0;
cursor: pointer;
box-shadow: inset -8px -8px 15px rgba(255,255,255,0.2),
inset 10px 10px 10px rgba(0,0,0, .25);
padding-bottom: 30px;
}
.onoff-toggle input[type="radio"] + label::before {
position: absolute;
content: 'OFF';
font-size: 13px;
text-align: center;
line-height: 25px;
top: 20%;
left: 7%;
width: 45px;
height: 25px;
border-radius: 20px;
background-color: #d1dad3;
transition: .3s ease-in-out;
}
.visamer-mindre {
display: flex;
position: absolute;
align-items: center;
align-content: center;
height: 60px;
width: 40px;
background-color: rgba(96, 150, 177, 0.3);
border-right: 0.1px solid white;
border-top: 0.1px solid white;
border-bottom: 0.1px solid white;
border-radius: 0px 30px 30px 0px;
margin-left: 280px;
z-index: 9999;
}
.visamer-mindre:before {
content: "⇽";
font-size: 2em;
font-weight: bold;
color: white;
}
.visamindre-mer {
display: flex;
position: absolute;
align-items: center;
align-content: center;
height: 60px;
width: 40px;
background-color: rgba(96, 150, 177, 0.3);
border-right: 0.1px solid white;
border-top: 0.1px solid white;
border-bottom: 0.1px solid white;
border-radius: 0px 30px 30px 0px;
z-index: 9999;
}
.visamindre-mer:before {
content: "⇾";
font-size: 2em;
font-weight: bold;
color: white;
}
.onoff-toggle input[type="radio"]:checked + label::before {
left: 50%;
content: 'ON';
color: white;
background-color: #00b33c;
}
.templateStyle2 {
height: 341px;
width: 220px;
text-align: center;
scroll-snap-align: start;
}
.templateStyle2 .templatetextStyle2 { 
position: static;
font-size: 0.9em;
font-weight: bold;
font-family: 'Orelega One', cursive;
color: var(--category);
}
.templatetextyearStyle2 {
font-size: 0.7em;
color: var(--category);
}
.textfirstStyle2 {
font-family: 'League Spartan', sans-serif;
color: white;
font-size: 1.5em;
position: static;
padding-left: 10px;
padding-right: 10px;
border-radius: 5px;
border: 1px solid black;
background: rgba(255,255,255, 0.3);
}
.containerfirstStyle2 {
height: 100%; 
width: 100%;
border: 1px solid transparent;
overflow-x: scroll;
overflow-y: hidden;
scroll-snap-type: x mandatory;
-ms-overflow-style: none;
border: 1px solid orange;
flex-shrink: 0;
scrollbar-width: none;
border: 1px solid transparent;
}
.containerfirstStyle2::-webkit-scrollbar { 
display: none;
}
.gridStyle2 {
margin-top: 10px;
display: flex;
position: relative;
width: 100%;
grid-row-gap: 5px;
grid-column-gap: auto;
grid-template-columns: auto auto auto auto auto auto auto auto;
border: 1px solid transparent;
}
.aligncenterStyle2 {
width: 100%;
height: auto;
display: flex;
align-items: center;
justify-content: center;
border: 1px solid transparent;
}




/* Endast media queries nedan */
@media screen and (max-width: 1733px) {
img {
height: 243px; 
width: 162px;
}
img:hover {
height: 270px;
width: 180px;
box-shadow: 0px 0px 27px 0.9px;
}
.containeroutline {
height: 306px; 
}
.template .templatetext { 
font-size: 0.81em;
}
.templatetextyear {
font-size: 0.63em;
}
.containeroutlinename {
height: 180px;
}
#title {
width: 306px;
height: 112.5px;
border-bottom: 2.7px solid silver;
border-right: 2.7px solid silver;
border-radius: 27px;
}
#titletext {
font-size: 2.43em;
text-shadow:1.8px 1.8px rgb(110, 191, 244);
}
#title:hover {
border-bottom: 2.7px solid white;
border-right: 2.7px solid white;
}
#HBOLOGGA {
height: 148.5px;
width: 135px;
}
#HBOMAXLOGGA {
height: 148.5px;
width: 153px;
}
.button-right {
width: 45px;
height: 45px;
font-size: 0.9em;
}
.button-left {
width: 45px;
height: 45px;
font-size: 0.9em;
}
.page {
width: 40.5px;
height: 13.5px;
border-radius: 9px;
}
.textfirst {
font-size: 1.35em;
padding-left: 9px;
padding-right: 9px;
border-radius: 4.5px;
border: 0.9px solid black;
}
}
@media screen and (max-width: 1561px) {
	.info {
	font-size: 18px;
}
img {
height: 227.7px; 
width: 145.8px;
}
img:hover {
height: 243px;
width: 162px;
box-shadow: 0px 0px 24.3px 0.8px;
}
.containeroutline {
height: 275.4px; 
}
.template .templatetext { 
font-size: 0.729em;
}
.templatetextyear {
font-size: 0.567em;
}
.containeroutlinename {
height: 162px;
}
#title {
width: 275.4px;
height: 101.25px;
border-bottom: 2.43px solid silver;
border-right: 2.43px solid silver;
border-radius: 24.3px;
}
#titletext {
font-size: 2.187em;
text-shadow:1.62px 1.62px rgb(110, 191, 244);
}
#title:hover {
border-bottom: 2.43px solid white;
border-right: 2.43px solid white;
}
#HBOLOGGA {
height: 133.65px;
width: 121.5px;
}
#HBOMAXLOGGA {
height: 133.65px;
width: 137.7px;
}
.button-right {
width: 40.5px;
height: 40.5px;
font-size: 0.81em;
}
.button-left {
width: 40.5px;
height: 40.5px;
font-size: 0.81em;
}
.page {
width: 36.45px;
height: 12.15px;
border-radius: 8.1px;
}
.textfirst {
font-size: 1.215em;
padding-left: 8.1px;
padding-right: 8.1px;
border-radius: 4.05px;
border: 0.81px solid black;
}
}
@media screen and (max-width: 1408px) {
img {
height: 204.93px; 
width: 131.22px;
}
img:hover {
height: 227.7px;
width: 145.8px;
box-shadow: 0px 0px 21.87px 0.7px;
}
.containeroutline {
height: 247.86px; 
}
.template .templatetext { 
font-size: 0.6561em;
}
.templatetextyear {
font-size: 0.5103em;
}
.containeroutlinename {
height: 145.8px;
}
#title {
width: 247.86px;
height: 91.125px;
border-bottom: 2.187px solid silver;
border-right: 2.187px solid silver;
border-radius: 21.87px;
}
#titletext {
font-size: 1.9683em;
text-shadow:1.458px 1.458px rgb(110, 191, 244);
}
#title:hover {
border-bottom: 2.187px solid white;
border-right: 2.187px solid white;
}
#HBOLOGGA {
height: 120.285px;
width: 109.35px;
}
#HBOMAXLOGGA {
height: 120.285px;
width: 123.93px;
}
.button-right {
width: 36.45px;
height: 36.45px;
font-size: 0.729em;
}
.button-left {
width: 36.45px;
height: 36.45px;
font-size: 0.729em;
}
.page {
width: 32.805px;
height: 10.935px;
border-radius: 7.29px;
}
.textfirst {
font-size: 1.0935em;
padding-left: 7.29px;
padding-right: 7.29px;
border-radius: 3.645px;
border: 0.729px solid black;
}
}
@media screen and (max-width: 1270px) {
	.info {
	font-size: 16px;
}
img {
height: 184.437px; 
width: 118.098px;
}
img:hover {
height: 204.93px;
width: 131.22px;
box-shadow: 0px 0px 19.683px 0.7px;
}
.containeroutline {
height: 223.074px; 
}
.template .templatetext { 
font-size: 0.59049em;
}
.templatetextyear {
font-size: 0.45927em;
}
.containeroutlinename {
height: 131.22px;
}
#title {
width: 223.074px;
height: 82.0125px;
border-bottom: 1.9683px solid silver;
border-right: 1.9683px solid silver;
border-radius: 19.683px;
}
#titletext {
font-size: 1.77147em;
text-shadow:1.3122px 1.3122px rgb(110, 191, 244);
}
#title:hover {
border-bottom: 1.9683px solid white;
border-right: 1.9683px solid white;
}
#HBOLOGGA {
height: 108.2565px;
width: 98.415px;
}
#HBOMAXLOGGA {
height: 108.2565px;
width: 111.537px;
}
.button-right {
width: 32.805px;
height: 32.805px;
font-size: 0.6561em;
}
.button-left {
width: 32.805px;
height: 32.805px;
font-size: 0.6561em;
}
.page {
width: 29.5245px;
height: 9.8415px;
border-radius: 6.561px;
}
.textfirst {
font-size: 0.98415em;
padding-left: 6.561px;
padding-right: 6.561px;
border-radius: 6.561px;
border: 0.6561px solid black;
}
}
@media screen and (max-width: 1145px) {
img {
height: 165.9933px; 
width: 106.2882px;
}
img:hover {
height: 184.437px;
width: 118.098px;
box-shadow: 0px 0px 17.7147px 0.6px;
}
.containeroutline {
height: 200.7666px; 
}
.template .templatetext { 
font-size: 0.531441em;
}
.templatetextyear {
font-size: 0.413343em;
}
.containeroutlinename {
height: 118.098px;
}
#title {
width: 200.7666px;
height: 73.81125px;
border-bottom: 1.77147px solid silver;
border-right: 1.77147px solid silver;
border-radius: 17.7147px;
}
#titletext {
font-size: 1.594323em;
text-shadow:1.18098px 1.18098px rgb(110, 191, 244);
}
#title:hover {
border-bottom: 1.77147px solid white;
border-right: 1.77147px solid white;
}
#HBOLOGGA {
height: 97.43085px;
width: 88.5735px;
}
#HBOMAXLOGGA {
height: 97.43085px;
width: 100.3833px;
}
.button-right {
width: 29.5245px;
height: 29.5245px;
font-size: 0.59049em;
}
.button-left {
width: 29.5245px;
height: 29.5425px;
font-size: 0.59049em;
}
.page {
width: 26.57205px;
height: 8.85735px;
border-radius: 5.9049px;
}
.textfirst {
font-size: 0.885735em;
padding-left: 5.9049px;
padding-right: 5.9049px;
border-radius: 5.9049px;
border: 0.59049px solid black;
}
}
@media screen and (max-width: 1031px) {
img {
height: 149.39397px; 
width: 95.65938px;
}
img:hover {
height: 165.9933px; 
width: 106.2882px;
box-shadow: 0px 0px 15.94323px 0.5px;
}
.containeroutline {
height: 180.68994px; 
}
.template .templatetext { 
font-size: 0.4782969em;
}
.templatetextyear {
font-size: 0.3720087em;
}
.containeroutlinename {
height: 106.2882px;
}
#title {
width: 180.68994px;
height: 66.430125px;
border-bottom: 1.594323px solid silver;
border-right: 1.594323px solid silver;
border-radius: 15.94323px;
}
#titletext {
font-size: 1.4348907em;
text-shadow:1.062882px 1.062882px rgb(110, 191, 244);
}
#title:hover {
border-bottom: 1.594323px solid white;
border-right: 1.594323px solid white;
}
#HBOLOGGA {
height: 87.687765px;
width: 79.71615px;
}
#HBOMAXLOGGA {
height: 87.687765px;
width: 90.34497px;
}
.button-right {
width: 26.57205px;
height: 26.57205px;
font-size: 0.531441em;
}
.button-left {
width: 26.57205px;
height: 26.57205px;
font-size: 0.531441em;
}
.page {
width: 23.914845px;
height: 7.971615px;
border-radius: 5.31441px;
}
.textfirst {
font-size: 0.7971615em;
padding-left: 5.31441px;
padding-right: 5.31441px;
border-radius: 5.31441px;
border: 0.531441px solid black;
}
}
@media screen and (max-width: 953px) {
	.info {
	font-size: 14px;
}
img {
height: 134.454573px; 
width: 86.093442px;
}
img:hover {
height: 149.39397px; 
width: 95.65938px;
box-shadow: 0px 0px 12.9140163px 0.3px;
}
.containeroutline {
height: 162.620946px; 
}
.template .templatetext { 
font-size: 0.43046721em;
}
.templatetextyear {
font-size: 0.33480783em;
}
.containeroutlinename {
height: 95.65938px;
}
#title {
width: 162.620946px;
height: 59.7871125px;
border-bottom: 1.4348907px solid silver;
border-right: 1.4348907px solid silver;
border-radius: 14.348907px;
}
#titletext {
font-size: 1.29140163em;
text-shadow:0.9565938px 0.9565938px rgb(110, 191, 244);
}
#title:hover {
border-bottom: 1.4348907px solid white;
border-right: 1.4348907px solid white;
}
#HBOLOGGA {
height: 78.9189885px;
width: 71.744535px;
}
#HBOMAXLOGGA {
height: 78.9189885px;
width: 81.310473px;
}
.button-right {
width: 23.914845px;
height: 23.914845px;
font-size: 0.4782969em;
}
.button-left {
width: 23.914845px;
height: 23.914845px;
font-size: 0.4782969em;
}
.page {
width: 21.5233605px;
height: 7.1744535px;
border-radius: 4.782969px;
}
.textfirst {
font-size: 0.71744535em;
padding-left: 4.782969px;
padding-right: 4.782969px;
border-radius: 4.782969x;
border: 0.4782969px solid black;
}
}
@media screen and (max-width: 872px) {
img {
height: 121.0091157px; 
width: 77.4840978px;
}
img:hover {
height: 134.454573px; 
width: 86.093442px;
box-shadow: 0px 0px 11.62261467px 0.2px;
}
.containeroutline {
height: 146.3588514px; 
}
.template .templatetext { 
font-size: 0.38742049em;
}
.templatetextyear {
font-size: 0.30132705em;
}
.containeroutlinename {
height: 86.093442px;
}
#title {
width: 146.358851px;
height: 53.8084012px;
border-bottom: 1.29140163px solid silver;
border-right: 1.29140163px solid silver;
border-radius: 12.9140163px;
}
#titletext {
font-size: 1.16226147em;
text-shadow:0.86093442px 0.86093442px rgb(110, 191, 244);
}
#title:hover {
border-bottom: 1.29140163px solid white;
border-right: 1.29140163px solid white;
}
#HBOLOGGA {
height: 71.0270896px;
width: 64.5700815px;
}
#HBOMAXLOGGA {
height: 71.0270896px;
width: 73.1794257px;
}
.button-right {
width: 21.5233605px;
height: 21.5233605px;
font-size: 0.43046721em;
}
.button-left {
width: 21.5233605px;
height: 21.5233605px;
font-size: 0.43046721em;
}
.page {
width: 19.3710244px;
height: 6.45700815px;
border-radius: 4.3046721px;
}
.textfirst {
font-size: 0.64570082em;
padding-left: 4.3046721px;
padding-right: 4.3046721px;
border-radius: 4.3046721px;
border: 0.43046721px solid black;
}
}
@media screen and (max-width: 760px) {
img {
height: 108.90820413px; 
width: 69.73568802px;
}
img:hover {
height: 121.0091157px; 
width: 77.4840978px;
box-shadow: 0px 0px 11.62261467px 0.2px;
}
.containeroutline {
height: 131.72296626px; 
}
.template .templatetext { 
font-size: 0.348678441em;
}
.templatetextyear {
font-size: 0.271194345em;
}
.containeroutlinename {
height: 77.4840978px;
}
#title {
width: 131.7229659px;
height: 48.42756108px;
border-bottom: 1.162261467px solid silver;
border-right: 1.162261467px solid silver;
border-radius: 11.62261467px;
}
#titletext {
font-size: 1.0460353203em;
text-shadow: 0.774840978px 0.774840978px rgb(110, 191, 244);
}
#title:hover {
border-bottom: 1.162261467px solid white;
border-right: 1.162261467px solid white;
}
#HBOLOGGA {
height: 63.92438064px;
width: 58.11307335px;
}
#HBOMAXLOGGA {
height: 63.92438064px;
width: 65.86148313px;
}
.button-right {
width: 19.37102445px;
height: 19.37102445px;
font-size: 0.38742049em;
}
.button-left {
width: 19.37102445px;
height: 19.37102445px;
font-size: 0.38742049em;
}
.page {
width: 17.433922px;
height: 5.81130734px;
border-radius: 3.8742049px;
}
.textfirst {
font-size: 0.58113073em;
padding-left: 3.87420489px;
padding-right: 3.87420489px;
border-radius: 3.87420489px;
border: 0.387420489px solid black;
}
}
@media screen and (max-width: 687px) {
img {
height: 98.017383717px; 
width: 62.762119218px;
}
img:hover {
height: 108.90820413px; 
width: 69.73568802px;
box-shadow: 0px 0px 11.62261467px 0.2px;
}
.containeroutline {
height: 118.550669634px; 
}
.template .templatetext { 
font-size: 0.3138105969em;
}
.templatetextyear {
font-size: 0.2440749105em;
}
.containeroutlinename {
height: 69.73568802px;
}
#title {
width: 118.55066931px;
height: 43.584804972px;
border-bottom: 1.0460353203px solid silver;
border-right: 1.0460353203px solid silver;
border-radius: 10.460353203px;
}
#titletext {
font-size: 0.94143178827em;
text-shadow:0.6973568802px 0.6973568802px rgb(110, 191, 244);
}
#title:hover {
border-bottom: 1.0460353203px solid white;
border-right: 1.0460353203px solid white;
}
#HBOLOGGA {
height: 57.531942576px;
width: 52.301766015px;
}
#HBOMAXLOGGA {
height: 57.531942576px;
width: 59.275334817px;
}
.button-right {
width: 17.433922px;
height: 17.433922px;
font-size: 0.34867844em;
}
.button-left {
width: 17.433922px;
height: 17.433922px;
font-size: 0.34867844em;
}
.page {
width: 15.6905298px;
height: 5.2301766px;
border-radius: 3.4867844px;
}
.textfirst {
font-size: 0.52301766em;
padding-left: 3.4867844px;
padding-right: 3.4867844px;
border-radius: 3.4867844px;
border: 0.34867844px solid black;
}
}
.minimizetext::after {
	font-size: 0.8em;
}
@media screen and (max-width: 608px) {
img {
height: 88.2156453453px; 
width: 56.4859072962px;
}
img:hover {
height: 98.017383717px; 
width: 62.762119218px;
box-shadow: 0px 0px 11.62261467px 0.2px;
}
.containeroutline {
height: 106.6956026706px; 
}
.template .templatetext { 
font-size: 0.28242953721em;
}
.templatetextyear {
font-size: 0.21966741945em;
}
.containeroutlinename {
height: 62.762119219px;
}
#title {
width: 106.695602379px;
height: 39.2263244748px;
border-bottom: 0.94143178827px solid silver;
border-right: 0.94143178827px solid silver;
border-radius: 9.4143178827px;
}
#titletext {
font-size: 0.847288609443em;
text-shadow:0.62762119218px 0.62762119218px rgb(110, 191, 244);
}
#title:hover {
border-bottom: 0.94143178827px solid white;
border-right: 0.94143178827px solid white;
}
#HBOLOGGA {
height: 51.7787483184px;
width: 47.0715894135px;
}
#HBOMAXLOGGA {
height: 51.7787483184px;
width: 53.3478013353px;
}
.button-right {
width: 15.6905298px;
height: 15.6905298px;
font-size: 0.3138106em;
}
.button-left {
width: 15.6905298px;
height: 15.6905298px;
font-size: 0.3138106em;
}
.page {
width: 14.1214768px;
height: 4.70715894px;
border-radius: 3.138106px;
}
.textfirst {
font-size: 0.47071589em;
padding-left: 3.13810596px;
padding-right: 3.13810596px;
border-radius: 3.13810596px;
border: 0.313810596px solid black;
}
}
@media screen and (max-width: 545px) {
	.stylingwbuttonsbackground {
	position: absolute;
height: 100%;
width: 100%;
background: red;
text-align: center;
overflow: hidden;
}
.stylingwbuttonsbackground::after {
	position: absolute;
	content: 'Byt till andra stylingen om du vill ha denna skärmbredd';
	font-size:2em;
	color: white;
	font-family: 'Roboto Flex', sans-serif;
	top: 45%;
	left: 0%;
}
.minwidth {
	display: none;
}
}
</style>