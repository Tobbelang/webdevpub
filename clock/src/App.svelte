<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Kanit:wght@500&family=Open+Sans:wght@300&display=swap" rel="stylesheet">
<script>
    import { Clock } from "./clock.js";
    import { fly } from "svelte/transition";
    let clock = new Clock(22,34,34); //timme, minut, sekund
    let minute = clock.timeMinute
    let hour = clock.timeHour
    let second = clock.timeSecond
    let alarmONOFF = true;
    let setAlarm;
    function setTime() {
        clock.setTime();
    }

    function tick() {
        clock.tick();
        clock = clock;
        if (setAlarm <=  clock.timeHour + ':' + clock.timeMinute + ':' + clock.timeSecond) {
            alarmONOFF = true;
        } else {
            alarmONOFF = false;
        }
        clock = clock;
    }
    tick();
    setInterval(tick, 1000);
	function spola() {
        clock.spola();
        clock = clock;
    }
    </script>
    
    <style>
        label {
            font-family: 'Kanit', sans-serif;
        }

        .flex   {
            height: 100%;
            width: 100%;
            position: relative;
            display: flex;
            box-sizing: border-box;
            justify-content: space-around;
            align-items: center;
        }

        .container   {
            position: absolute;
            box-sizing: border-box;
            width: 100%;
            top: 70%;
        }

        .background {
            height: 100%;
            width: 100%;
            position: relative;
            box-sizing: border-box;
            justify-content: space-around;
            align-items: center;
        }

        body {
            background: radial-gradient(#16ecb6, #0b0c46);
            text-align: center;
            color: white;
            overflow: hidden;
            position: relative; 
        }

        .digitalKlocka {
            font-size: 4em;
            font-family: 'Bebas Neue', cursive;
            text-shadow: 0 5px 5px black;
        }

        .digitalKlockaStyling {
            padding: 4em 2em;
            background-image: linear-gradient(45deg, #16ecb6, #696bd3);
            border-radius: 20% 80% 80% 20% / 20% 30% 70% 70%;
            animation: digitalKlockaAnimation 20s infinite 1s;
            border: 1px solid white;
            margin: 30px;
        }
        @keyframes digitalKlockaAnimation {
            0% {
                border-radius: 20% 80% 80% 20% / 20% 30% 70% 70%;
                border: 1px solid white;
            }
            12.5% {
                border-radius: 35% 65% 65% 35% / 35% 45% 55% 55%;
                border: 1px solid white;
            }
            25% {
                border-radius: 50% 50% 50% 50% / 50% 50% 50% 50%;
                border: 1px solid white;
            }
            37.5% {
                border-radius: 65% 35% 35% 65% / 65% 80% 35% 35%;
                border: 1px solid white;
            }
            50% {
                border-radius: 80% 20% 20% 80% / 70% 70% 40% 60%;
                border: 1px solid white;
            }
            62.5% {
                border-radius: 65% 35% 35% 65% / 55% 55% 45% 35%;
                border: 1px solid white;
            }
            75% {
                border-radius: 50% 50% 50% 50% / 50% 50% 50% 50%;
                border: 1px solid white;
            }
            87.5% {
                border-radius: 35% 65% 65% 35% / 35% 45% 55% 55%;
                border: 1px solid white;
            }
        }

        .box {
		height: 250px;
		width: 250px;
		background: linear-gradient(180deg, #82CAFF 50%, #1d1f2f 50%);
		background-color: transparent;
		border: 1px solid black;
		position: relative;
		border-radius: 50%;
	}
	.box .dag {
		height: 125px;
		width: 250px;
		background-color: transparent;
		position: absolute;
	}
	.box .dag2 {
		height: 250px;
		width: 125px;
		background-color: transparent;
		position: absolute;
		left: 125px;
	}
	.box .natt {
		height: 125px;
		width: 250px;
		background-color: transparent;
		position: absolute;
		top: 125px;
	}
	.stjärnor {
		width: 15px;
		height: 15px;
		background-color: yellow;
		position: absolute;
		clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
		transform: translate(var(--placering))
		
	}
	.box .natt2 {
		height: 250px;
		width: 125px;
		background-color: transparent;
		position: absolute;
	}
	.overlay {
		height: 50px;
		width: 50px;
		border-radius: 50%;
		background-color: transparent;
		position: relative;
		top: 100px;
		left: 100px;
	}
	.seconds {
	width: 2px;
	height: 75px;
	background-color: transparent;
	position:absolute;
	transform-origin: bottom;
	left: 25%;
	top: 25%;
	transform-origin: top;
	}
    .ring--seconds {
    	fill: rgb(255,255,0);
        stroke: transparent; 
        stroke-width: 2.5;
        stroke-dasharray: 0.1 0.9;
        stroke-dashoffset: 0.05;
		z-index: 999;
			box-shadow: 20px 20px yellow;
		/* clip-path: polygon(100% 0%,100% 60%,0% 60%,0% 0%); */
	}

    .ring--hours {
    fill: transparent;
    stroke: yellow; 
    stroke-width: 5;
    stroke-dasharray: 0.125 0.425;
	z-index: 999;
	}
	   .ring--seconds.night {
        fill: whitesmoke; 
    }
			.shadow {
  -webkit-filter: drop-shadow( 3px 3px 2px rgba(255, 255, 0, .9));
  filter: drop-shadow( 3px 3px 2px rgba(255, 255, 0, .9));
}
						.shadow.night {
  -webkit-filter: drop-shadow( 2px 2px 1px rgba(255,255,255));
  filter: drop-shadow( 2px 2px 10px rgba(255,255,255));
}
	.minutes {
	width: 2px;
	height: 75px;
	background-color: transparent;
	position:absolute;
	left: 25%;
	top: 25%;
	transform-origin: top;
	transform: rotate(var(--rotate));
	}
	.hours {
	width: 2px;
	height: 75px;
	background-color: transparent;
	position:absolute;
	left: 25%;
	top: 25%;
	transform-origin: top;
	transform: rotate(var(--rotate));
	}
	#cloud-circle {
    width: 75px;
    height: 26.75px;
    border-radius: 50%;
    filter: url(#filter);
    box-shadow: 100px 200px 15px 0px #fff;
    position: absolute;
    top: -125px;
    left: -67.5px;
}
#cloud-circle2 {
    width: 60px;
    height: 15px;
    border-radius: 50%;
    filter: url(#filter);
    box-shadow: 50px 200px 15px 0px #fff;
    position: absolute;
    top: -150px;
    left: 52.5px;
}
#cloud-circle3 {
    width: 60px;
    height: 15px;
    border-radius: 50%;
    filter: url(#filter);
    box-shadow: 100px 200px 15px 0px #fff;
    position: absolute;
    top: -125px;
    left: 70px;
}

    .animeradKlocka {
        height: 210px;
        width:400px;
        position: relative;
        background-color: transparent;
        border: 1px solid black;
        font-family: 'Open Sans Condensed', sans-serif;
        text-shadow: 0 2px 2px black;
        overflow: hidden;
    }

    .box1 {
        height: 70px;
        width:400px;
        background-color: #16ecb6;
        border: 0.1px solid black;
    }

    .box2 {
        height: 70px;
        width:400px;
        background-color: #3382e9;
        position: relative;
        border: 0.1px solid black;
    }

    .box3 {
        height: 70px;
        width:400px;
        background-color: #0b0c46;
        position: relative;
        border: 0.1px solid black;
    }

    .alarmTriggatAnimation {
        height: 175px;
        width: 400px;
        background: linear-gradient(135deg, #14ffe9, #ffeb3b, #ff00e0);
        position: absolute;
        z-index: 9999;
        border-radius: 10px;
        animation: alarmAnimation 1.5s linear infinite;

    }
    .alarmTriggatAnimation .alarmTriggat {
        height: 125px;
        width: 350px;
        border: 1px solid white;
        background-color: white;
        position: relative;
        z-index: 9999;
        transform:translate(7%, 18%);
        border-radius: 6px;
    }
    .alarmTriggatAnimation .alarmTriggat .alarmText {
        background: linear-gradient(135deg, #14ffe9, #ffeb3b, #ff00e0);
        font-size: 4em;
        position: absolute;
        transform:translate(31%,15%);
        font-family: 'Kanit', sans-serif;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    @keyframes alarmAnimation {
        100%{
            filter: hue-rotate(360deg);
        }
    }
    @media (max-width: 1080px) {
        
        .flex {
    display: flex;
    flex-direction: column;
    height: auto;
    width: auto;
    }
    .background {
        overflow: scroll;
        justify-content: space-evenly;
    }
    .container   {
        position: absolute;
        left: 0%;
        top: 105%;
    }
    .digitalKlocka {
        font-size: 3.5em;
        overflow: hidden;
    }
    .digitalKlockaStyling {
        overflow: hidden;
    }

    .animeradKlocka {
        overflow: hidden;
        height: 90%;
        width: 270px;
    }
    .box {
        overflow: visible;
        top: 10px;
    }
    .ring--seconds {
        overflow: visible;
	}

    .ring--hours {
        overflow: visible;
	}
}
@media (max-width: 350px) {

        .flex {
    display: flex;
    flex-direction: column;
    height: auto;
    width: auto;
    }
    .container   {
        position: absolute;
        left: 0%;
        top: 105%;
    }
    .digitalKlocka {
        font-size: 3em;
        overflow: hidden;
    }
    .digitalKlockaStyling {
        overflow: hidden;
        padding: 3em 1.5em;
    }

    .animeradKlocka {
        overflow: hidden;
        height: 90%;
        width: 270px;
    }
    .box {
        overflow: visible;
        top: 10px;
    }
    .ring--seconds {
        overflow: visible;
	}

    .ring--hours {
        overflow: visible;
	}
    .alarmTriggatAnimation {
        height: 82.5px;
        width: 200px;
    }
    .alarmTriggatAnimation .alarmTriggat {
        height: 62.5px;
        width: 175px;
    }
    .alarmTriggatAnimation .alarmTriggat .alarmText {
        font-size: 2em;
    }
}
    </style>
    <body>
        <div class="background">
            <div class="flex">
			
            <div class="digitalKlockaStyling">
            <div class="digitalKlocka">
    {#key hour}
	<span style="display: inline-block" in:fly={{ y: -22 }}>{clock.timeHour} :</span>
{/key} 
    {#key minute}
	<span style="display: inline-block" in:fly={{ y: -22 }}>{clock.timeMinute} :</span>
{/key} 
    {#key second}
	<span style="display: inline-block" in:fly={{ y: -22 }}>{clock.timeSecond}</span>
{/key}
                </div>
        </div>
        <div class="alarmTriggatAnimation" style="display: {alarmONOFF ? 'block' : 'none'}">
            <div class="alarmTriggat">
                <div class="alarmText">ALARM</div>
            </div>
        </div>
        <div class="animeradKlocka">
        <div class="box1"style:width={clock.timeSecond * 1.666666666666667}%>
        {clock.timeSecond} Sekunder
        </div>
        <div class="box2"style:width={clock.timeMinute * 1.666666666666667}%>
        {clock.timeMinute} Minuter</div>
        <div class="box3"style:width={clock.timeHour * 4.166666666666667}%>
        {clock.timeHour} Timmar</div>
        </div>
        <div class="container">
            <label class="fontLabel" for="alarmTid">Sätt alarm</label>
            <form>
            <input type="time" id="alarmTid" bind:value={setAlarm} style:width="170px" step="2">
            <input type="submit" value="återställ">
            <input type="button" on:click={spola} value="+1 timma">
        </form>
        </div>
        <div class="box">
            <div class="dag"></div>
            <div class="natt"></div>
            <div class="stjärnor" style:transform=translate(50px,162.5px)></div>
            <div class="stjärnor" style:transform=translate(72.5px,200px)></div>
            <div class="stjärnor" style:transform=translate(100px,162.5px)></div>
            <div class="stjärnor" style:transform=translate(152.5px,162.5px)></div>
            <div class="stjärnor" style:transform=translate(172.5px,200px)></div>
            <div class="stjärnor" style:transform=translate(200px,162.5px)></div>
            <div class="stjärnor" style:transform=translate(122.5px,200px)></div>		
            <div class="dag2"></div>
            <div class="natt2"></div>
            <div class="overlay">
                <div class="seconds" style:transform={"rotate("+ (clock.timeSecond / 60 * 360 -180).toString() + "deg)"}></div>
                <div class="minutes"style:transform={"rotate(" + (clock.timeMinute / 60 * 360 -180).toString() + "deg)"}></div>
                <div class="hours" style:transform={"rotate(" + (clock.timeHour / 24 * 360 -83).toString() + "deg)"}>
                <svg width="150" height="150" viewbox="-25 -50 100 100"  class="shadow" class:night={clock.timeHour < 12} style='transform:translate(-25%);'>
                                      <circle class="ring--seconds"  class:night={clock.timeHour < 12}  cx="0" cy="0" r="12.5"/>
                    {#if clock.timeHour >= 12}
                    <circle class="ring--hours" cx="0" cy="0" r="17.5" pathlength="12"/>

                    {/if}
            </div>
        </div>
        <div id="cloud-circle"></div>
        <div id="cloud-circle2"></div>
        <div id="cloud-circle3"></div>
        <svg width="0" height="0"> 
        <svg width="0" height="0">
        <svg width="0" height="0">
          <filter id="filter">
            <feTurbulence type="fractalNoise" baseFrequency=".01" numOctaves="10" />
            <feDisplacementMap in="SourceGraphic" scale="180" />
          </filter>
      </svg>
    </div>
    </div>
</div>
    </body>
