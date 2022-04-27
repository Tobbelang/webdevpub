<link href="https://fonts.googleapis.com/css2?family=Montserrat&family=Oswald:wght@200;700&family=PT+Serif&family=Poppins:wght@300&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital@1&display=swap" rel="stylesheet">
<script>
    import { promise } from "./stores.js";
	import { sökningar } from './stores.js';
    let question;
    let innansökning = true;
    async function search() {
        const res = await fetch(
            'https://demo.dataverse.org/api/search?q=' + question + "&per_page=50"
        );
        const json = await res.json();

         if (res.ok) {
            return sökningar.update(n => n + 1), innansökning = false, json; 
        } else {
            throw new Error(json);
        } 
    }
</script>
<div class="background-utemal" style="display: {innansökning ? 'absolute' : 'none'}">
	<div class="background-ute">
	</div>
	<div class="background-inne"></div>
		<div class="background-sokmotor">
		</div>
		<div class="sökmotorlogga">
		<span class="loggafont">S</span>
		<div class="search" style="transform:translate(0px, 5px)">
		<div class="search-scope2"></div>
		<div class="top-mark2"></div>
    </div>
		<div class="loggafont">KMOTOR</div>
		</div>
		<div class="osynligstart" style="animation-iteration-count:1;"> 
			<!--animation-iteration-count(n-1) * 052631578947368 + n + 1 vid varje steg -->
			<div class="transformera" style="animation-delay:11.4s">
				<div class="rotate" style="animation-delay:11.4s">	
					<div class="search-scope">
		<div class="emoji-eyes"></div>
			<div class="emoji-eyes2"></div>
			<div class="emoji-mouth"></div>
						<div class="top-mark" style="animation-delay:11.4s"></div>	
			</div>
			</div>
			</div>
		</div>
		<div class="osynligstart" style="animation-iteration-count: 2.052631578947368;">
			<div class="transformera" style="animation-delay:23.4s">
				<div class="rotate" style="animation-delay:23.4s">	
					<div class="search-scope">
		<div class="emoji-eyes"></div>
			<div class="emoji-eyes2"></div>
			<div class="emoji-mouth"></div>
						<div class="top-mark" style="animation-delay:23.4s"></div>	
			</div>
			</div>
			</div>
		</div>
		<div class="osynligstart" style="animation-iteration-count: 3.105263157894737;">
			<div class="transformera" style="animation-delay:35.4s">
				<div class="rotate" style="animation-delay:35.4s">	
					<div class="search-scope">
		<div class="emoji-eyes"></div>
			<div class="emoji-eyes2"></div>
			<div class="emoji-mouth"></div>
						<div class="top-mark" style="animation-delay:35.4s"></div>	
			</div>
			</div>
			</div>
		</div>
		<div class="osynligstart" style="animation-iteration-count: 4.157894736842104">
			<div class="transformera" style="animation-delay:47.4s">
				<div class="rotate" style="animation-delay:47.4s">	
					<div class="search-scope">
		<div class="emoji-eyes"></div>
			<div class="emoji-eyes2"></div>
			<div class="emoji-mouth"></div>
						<div class="top-mark" style="animation-delay:47.4s"></div>	
			</div>
			</div>
			</div>
		</div>
		<div class="osynligstart" style="animation-iteration-count: 5.210526315789472;">
			<div class="transformera" style="animation-delay:59.4s">
				<div class="rotate" style="animation-delay:59.4s">
					<div class="search-scope">
		<div class="emoji-eyes"></div>
			<div class="emoji-eyes2"></div>
			<div class="emoji-mouth"></div>
						<div class="top-mark" style="animation-delay:59.4s"></div>	
			</div>
			</div>
			</div>
		</div>
    </div>
        <form
            on:submit|preventDefault={() => {
                $promise = search();
            }}
        >
            <input class="ejsökt" placeholder="Sök..." bind:value={question} style="display: {innansökning ? 'block' : 'none'}">
        </form>
		<form 
		 on:submit|preventDefault={() => {
			$promise = search();
		}}
		>
		<input class="sökt" placeholder="Sök..." bind:value={question} style="display: {innansökning ? 'none' : 'block'}">
	</form >
		<div class="information-box" style="display: {innansökning ? 'absolute' : 'none'}">
            <div class="information-mark">
            <div class="top-i"></div>
                <div class="bottom-i"></div>
            </div>
        </div>
<style>
	* {
	margin: auto;
	display: flex;
	}
		.sökmotorlogga {
        transform:translate(110px, 0px);
        animation: text-shadow 6s ease infinite;
				position: absolute;
    }
    @keyframes text-shadow {
        0% { 
        text-shadow: 2px 2px 4px blue;
    }
    33.3% { 
        text-shadow: 2px 2px 4px red;
    }
    66.6% {
        text-shadow: 2px 2px 4px purple; 
    }
    100% {
        text-shadow: 2px 2px 4px blue; 
    }
}
    .loggafont {
        font-size: 5.5em;
        font-family: 'Oswald', sans-serif;
        color: black;
    }
		.background-utemal {
		width: 600px;
		height: 300px;
		border: 1px solid transparent;
		position: absolute;
		align-items: center;
		top: 30%;

	}
	.top-mark2 {
		width: 5.075px;
		height: 81px;
		background-color: black;
		transform: translate(87px, 50px)rotate(135deg);
        position: absolute;
	}
	.top-mark2::after {
		content: '';
		height:10px;
		width: 10px;
		background-color: black;
		position: absolute;
		border-radius: 50%;
		right: -3px;
		top: 90%;
		animation: droppe 12s linear infinite;
	}
	@keyframes droppe {
		0% {
			background-color: black;
		}
		10% {
			background-color: rgba(255,255,255,0.0);
		}
		20% {
			background-color: black;
		}
		30% {
			background-color: rgba(255,255,255,0.0);
		}
		40% {
			background-color: black;
		}
		50% {
			background-color: rgba(255,255,255,0.0);
		}
		60% {
			background-color: black;
		}
		70% {
			background-color: rgba(255,255,255,0.0);
			top: -1%;
			right: -3px;
		}
		80% {
			background-color: black;
		}
		90% {
			background-color: black;
		}
		95% {
			top: -40%;
		right: -24px;
		}
		100% {
			top: -40%;
		right: -24px;
		}
	}
	.search-scope2 {
		width: 68px;
		height: 68px;
		background-color: transparent;
		border: 3px solid black;
		border-radius: 50%;
	}

	.background-inne {
		width: 80%;
		height: 60%;
		border: 1px solid black;
		border-radius: 50%;
		position: absolute;
		transform:translate(60px);
	}
	.background-sokmotor {
		width: 80%;
		height: 60%;
		border: 60px solid rgba(255,255,255,0.2);
		border-radius: 50%;
		position: absolute;
		transform:translate(0px);
	}
	.background-ute {
		width: 100%;
		height: 100%;
		border: 1px solid black;
		border-radius: 50%;
		position: absolute;
		align-items: center;
		
	}
		.search-scope {
		width: 25px;
		height: 25px;
		background-color: transparent;
		border: 1.5px solid black;
		border-radius: 50%;
	} 
		.top-mark {
		width: 6%;
		height: 85%;
		background-color: black;
		transform: translate(30px, 20px)rotate(135deg);
     position: absolute;
		animation: längd 60s linear infinite;
	}
	@keyframes längd {
		0% {
			width: 6%;
		height: 0%;
		transform: translate(21px, 20px)rotate(135deg);
		}
		1% {
			width: 6%;
		height: 85%;
		transform: translate(30px, 20px)rotate(135deg);
		}
		99% {
			width: 6%;
		height: 85%;
		transform: translate(30px, 20px)rotate(135deg);
		}
		100% {
			width: 6%;
		height: 0%;
		transform: translate(21px, 20px)rotate(135deg);
		
		}
	}
	.emoji-eyes {
		height: 6px;
		width: 1px;
		background-color: black;
		position: absolute;	
		transform:translate(8px, 5px);
	}
	.emoji-eyes2 {
		height: 6px;
		width: 1px;
		background-color: black;
		position: absolute;	
		transform:translate(16px, 5px);
	}
	.emoji-mouth {
    width: 10px;
    height: 5px;
    background-color: transparent;
    border-bottom-left-radius: 110px;
    border-bottom-right-radius: 110px;
    border: 1.5px solid black;
    border-top: 0px;
		position: absolute;
		transform:translate(5.5px, 14px)
}
	.osynligstart {
		animation-name: osynlig;
  animation-duration: 11.4s;
	}
	@keyframes osynlig {
		0% {
			visibility: hidden;
		}
		100% {
			visibility: hidden;
		}
	}
	.rotate {
		animation: rotera360 60s linear infinite;
		position: absolute;
	}
	
	.transformera {
	animation: transformera 60s linear infinite;
	position: absolute;
	left: 55%;
	top: 96%;
	transform:rotate(150deg);
	}
 	@keyframes transformera {
		0% {
			left: 51.1%;
			top: 93.7%;
		}
		1% {
			left: 55%;
			top: 96%;
		}
		2% {
			left: 58%;
			top: 97%;
		}
	12.5% {
			left: 85%;
			top: 85%;
		}
		25% {
			left: 101.2%;
			top: 50%;
		}
	37.5% {
			left: 95%;
			top: 30%;
	}
		50% {
			left: 50%;
			top: 11%;
	}
		62.5% {
			left: 17.5%;
			top: 27.5%;
		}
		67.5% {
			left: 12.5%;
			top: 30%;
		}
		75% {
			left: 6%;
			top: 45%;
		}
		87.5% {
			left: 20%;
			top: 84%;
		}
		99% {
				left: 41.5%;
				top: 86%;
		}
		100% {
			left: 45.7%;
			top: 82.7%;
		}
} 

	@keyframes rotera360 {
		0% {
			transform:rotate(0deg);
		}
		5% {
			transform:rotate(0deg);
		}
		12.5% {
			transform:rotate(35deg);
		}
		25% {
			transform:rotate(-90deg);
		}
	50% {
	transform:rotate(-240deg);
	}
		55% {
			transform:rotate(-174deg);
		}
		67.5% {
			transform:rotate(-253deg);
		}
		75% {
			transform:rotate(-90deg);
		}
		90% {
			transform:rotate(-190deg);
		}
		99% {
			transform:rotate(-218deg);
		}
		100% {
			transform:rotate(-218deg);
			
		}
	}
    .information-box {
        width: 30px;
        height: 30px;
        background: linear-gradient(#3770dbc2, #d400ff);
        border-radius: 50%;
        border: 1px solid gray;
        position: absolute;
        bottom: 20.6%;
        left: 71.5%;


    }
    .information-box:hover::after {
        content: 'INFO: För att göra en godkänd sökterm bör du använda riktiga ord. Sökning med slumpmässiga bokstäver kommer mest troligen ge ett error meddelande.';
        font-family: 'Poppins', sans-serif;
        font-weight: bold;
        text-align: center;
        position: absolute;
        width: 240px;
        height: 145px;
        background: rgba(211,211,211,0.3);
		color: white;
        border: 0.1px solid white;
        border-radius: 10px 10px 10px 0px;
        left: 40px;
        bottom: 10px;
        padding: 5px;

    }
    .information-mark {
        position: absolute;
    }
    .bottom-i {
        width: 4px;
        height: 12px;
        background-color: rgba(255,255,255);
        position: absolute;
        left: 13px;
        top: 13px;
    }
    .top-i {
        width: 5px;
        height: 5px;
        background-color: rgba(255,255,255);
        clip-path: circle(50% at 50% 50%);
        position: absolute;
        left: 13px;
        top: 3.25px;
    }
    ::placeholder {
        color: white;
    }
	 
	form {
		background-color: transparent;
		width: 100%;
	}
	.ejsökt {
        background-color: transparent;
        border: 1px solid black;
        border-radius: 15px;
        color: white;
        box-shadow: 0px 0px 15px 1px purple; outline:none;
        width: 42%;
		height: 40px;
		position: absolute;
		empty-cells: show;
		left: 28.5%;
		bottom: 20%;
    }
	.sökt {
		background-color: transparent;
        border: 1px solid black;
        border-radius: 15px;
        color: white;
        box-shadow: 0px 0px 6px 0.2px white;
		outline:none;
        width: 330px;
		height: 30px;
		position: fixed;
		right: 30px;
		top: 57px;
		empty-cells: show;
		z-index: 3;
	}
	@media screen and (max-width: 1030px) {
		.information-box {
        background: linear-gradient(#3770dbc2, #d400ff);
        position: absolute;
        bottom: 20.6%;
        left: 72%;


    }
		.information-box:hover::after {
        width: 220px;
        height: 100px;
		font-size: 0.8em;
		background: rgba(211,211,211,0.3);
		color: white;
		left: 40px;
    }
}
	@media screen and (max-width: 975px) {
		.ejsökt {
			width: 40%;
			height: 40px;
			font-size: 1em;
			bottom: 28%;
		}
		
		.information-box {
        background: linear-gradient(#3770dbc2, #d400ff);
        position: absolute;
        bottom: 28.5%;
        left: 70%;
    }
		.information-box:hover::after {
        width: 170px;
        height: 145px;
		font-size: 0.8em;
		background: rgba(211,211,211,0.3);
		color: white;
		left: 40px;
    }
		.background-utemal {
			width: 450px;
			height: 225px;
		}
		.sökmotorlogga{
			transform: translate(82.5px);
		}
		.search-scope {
			width: 18.75px;
			height: 18.75px;
			border: 1.125px solid black;
		}
		.top-mark {
			transform: translate(22.5px, 15px);
		}
		.top-mark {
		width: 6%;
		height: 85%;
		background-color: black;
		transform: translate(30px, 20px)rotate(135deg);
     position: absolute;
		animation: längd 60s linear infinite;
	}
	@keyframes längd {
		0% {
			width: 6%;
		height: 0%;
		transform: translate(13.5px, 15px)rotate(135deg);
		}
		1% {
			width: 6%;
		height: 85%;
		transform: translate(22.5px, 15px)rotate(135deg);
		}
		99% {
			width: 6%;
		height: 85%;
		transform: translate(22.5px, 15px)rotate(135deg);
		}
		100% {
			width: 6%;
		height: 0%;
		transform: translate(13.5px, 15px)rotate(135deg);
		
		}
	}
		.top-mark2::after {
		content: '';
		height:7.5px;
		width: 7.5px;
		right: -2.25px;
	}
	@keyframes droppe {
		0% {
			background-color: black;
		}
		10% {
			background-color: rgba(255,255,255,0.0);
		}
		20% {
			background-color: black;
		}
		30% {
			background-color: rgba(255,255,255,0.0);
		}
		40% {
			background-color: black;
		}
		50% {
			background-color: rgba(255,255,255,0.0);
		}
		60% {
			background-color: black;
		}
		70% {
			background-color: rgba(255,255,255,0.0);
			top: -1%;
			right: -2.25px;
		}
		80% {
			background-color: black;
		}
		90% {
			background-color: black;
		}
		95% {
			top: -40%;
		right: -18px;
		}
		100% {
			top: -40%;
		right: -18px;
		}
	}
		.search-scope2 {
			height: 51px;
			width: 51px;
			border: 2.25px solid black;
		}
		.top-mark2 {
			width: 3.80625px;
			height: 60.75px;
			transform: translate(65.25px, 37.5px)rotate(135deg);
		}
		.emoji-eyes {
		height: 4.5px;
		width: 0.75px;
		transform:translate(6px, 3.75px);
	}
	.emoji-eyes2 {
		height: 4.5px;
		width: 0.75px;
		transform:translate(12px, 3.75px);
	}
	.emoji-mouth {
    width: 7.5px;
    height: 3.75px;
    border: 1.125px solid black;
	transform:translate(4.125px, 10.5px)
}
		.background-sokmotor {
			border: 45px solid rgba(255,255,255,0.2)
		}
		.background-inne {
			transform:translate(45px);
		}
		.loggafont {
			font-size: 4.125em;
		}
    }
	@media screen and (max-height: 777px) {
	.ejsökt {
		bottom: 20%;
	} 
	.information-box {	
		bottom: 20%;
	}
	.information-box:hover::after {
        width: 70px;
        height: 90px;
		font-size: 0.4em;
		background: rgba(211,211,211,0.3);
		color: white;
		left: 40px;
    }
	}
	@media screen and (max-width: 700px) {
		.background-utemal {
			width: 450px;
			height: 225px;
		}
		.sökmotorlogga{
			transform: translate(82.5px);
		}
		.search-scope {
			width: 18.75px;
			height: 18.75px;
			border: 1.125px solid black;
		}
		.top-mark {
			transform: translate(22.5px, 15px);
		}
	@keyframes längd {
		0% {
			width: 6%;
		height: 0%;
		transform: translate(13.5px, 15px)rotate(135deg);
		}
		1% {
			width: 6%;
		height: 85%;
		transform: translate(22.5px, 15px)rotate(135deg);
		}
		99% {
			width: 6%;
		height: 85%;
		transform: translate(22.5px, 15px)rotate(135deg);
		}
		100% {
			width: 6%;
		height: 0%;
		transform: translate(13.5px, 15px)rotate(135deg);
		
		}
	}
		.top-mark2::after {
		content: '';
		height:7.5px;
		width: 7.5px;
		right: -2.25px;
	}
	@keyframes droppe {
		0% {
			background-color: black;
		}
		10% {
			background-color: rgba(255,255,255,0.0);
		}
		20% {
			background-color: black;
		}
		30% {
			background-color: rgba(255,255,255,0.0);
		}
		40% {
			background-color: black;
		}
		50% {
			background-color: rgba(255,255,255,0.0);
		}
		60% {
			background-color: black;
		}
		70% {
			background-color: rgba(255,255,255,0.0);
			top: -1%;
			right: -2.25px;
		}
		80% {
			background-color: black;
		}
		90% {
			background-color: black;
		}
		95% {
			top: -40%;
		right: -16px;
		}
		100% {
			top: -40%;
		right: -16px;
		}
	}
		.search-scope2 {
			height: 51px;
			width: 51px;
			border: 2.25px solid black;
		}
		.top-mark2 {
			width: 3.80625px;
			height: 60.75px;
			transform: translate(65.25px, 37.5px)rotate(135deg);
		}
		.emoji-eyes {
		height: 4.5px;
		width: 0.75px;
		transform:translate(6px, 3.75px);
	}
	.emoji-eyes2 {
		height: 4.5px;
		width: 0.75px;
		transform:translate(12px, 3.75px);
	}
	.emoji-mouth {
    width: 7.5px;
    height: 3.75px;
    border: 1.125px solid black;
	transform:translate(4.125px, 10.5px)
}
		.background-sokmotor {
			border: 45px solid rgba(255,255,255,0.2)
		}
		.background-inne {
			transform:translate(45px);
		}
		.loggafont {
			font-size: 4.125em;
		}
    }
	@media screen and (max-width: 745px) {
		.information-box:hover::after {
        width: 100px;
        height: 120px;
		font-size: 0.6em;
		background: rgba(211,211,211,0.3);
		color: white;
		left: 40px;
    }
	}

	@media screen and (max-width: 545px) {
		.ejsökt {
			height: 25px;
			width: 35%;
			font-size: 0.7em;
			bottom: 35%;
			left: 30.5%;
	} 
	.information-box {	
		bottom: 35%;
		width: 20px;
        height: 20px;
	}
	.bottom-i {
        width: 2.66666px;
        height: 7.9999px;
        left: 8.66658px;
        top: 8.66658px;
    }
    .top-i {
        width: 3.3333px;
        height: 3.3333px;
        left: 8.38858px;
        top: 2.16645px;
    }
	.information-box:hover::after {
        width: 56px;
        height: 90px;
		font-size: 0.3em;
		background: rgba(211,211,211,0.3);
		color: white;
		left: 30px;
    }
		.background-utemal {
			width: 337.5px;
			height: 168.75px;
		}
		.sökmotorlogga{
			transform: translate(61.875px);
		}
		.search-scope {
			width: 14.0625px;
			height: 14.0625px;
			border: 0.84375px solid black;
		}
		.top-mark {
			transform: translate(16.875px, 11.25px);
		}
	@keyframes längd {
		0% {
			width: 6%;
		height: 0%;
		transform: translate(10.125px, 11.25px)rotate(135deg);
		}
		1% {
			width: 6%;
		height: 85%;
		transform: translate(16.875px, 11.25px)rotate(135deg);
		}
		99% {
			width: 6%;
		height: 85%;
		transform: translate(16.875px, 11.25px)rotate(135deg);
		}
		100% {
			width: 6%;
		height: 0%;
		transform: translate(10.125px, 11.25px)rotate(135deg);
		
		}
	}
		.top-mark2::after {
		content: '';
		height:5.625px;
		width: 5.625px;
		right: -1.6875px;
	}
	@keyframes droppe {
		0% {
			background-color: black;
		}
		10% {
			background-color: rgba(255,255,255,0.0);
		}
		20% {
			background-color: black;
		}
		30% {
			background-color: rgba(255,255,255,0.0);
		}
		40% {
			background-color: black;
		}
		50% {
			background-color: rgba(255,255,255,0.0);
		}
		60% {
			background-color: black;
		}
		70% {
			background-color: rgba(255,255,255,0.0);
			top: -1%;
			right: -1.6875px;
		}
		80% {
			background-color: black;
		}
		90% {
			background-color: black;
		}
		95% {
			top: -40%;
		right: -11.5px;
		}
		100% {
			top: -40%;
		right: -11.5px;
		}
	}
		.search-scope2 {
			height: 38.25px;
			width: 38.25px;
			border: 1.6875px solid black;
		}
		.top-mark2 {
			width: 2.8546875px;
			height: 45.5625px;
			transform: translate(48.9375px, 28.125px)rotate(135deg);
		}
		.emoji-eyes {
		height: 3.375px;
		width: 0.5625px;
		transform:translate(4.5px, 2.8125px);
	}
	.emoji-eyes2 {
		height: 3.375px;
		width: 0.5625px;
		transform:translate(9px, 2.8125px);
	}
	.emoji-mouth {
    width: 5.625px;
    height: 2.8125px;
    border: 0.84375px solid black;
	transform:translate(3.09375px, 7.875px)
}
		.background-sokmotor {
			border: 33.75px solid rgba(255,255,255,0.2)
		}
		.background-inne {
			transform:translate(33.75px);
		}
		.loggafont {
			font-size: 3.09375em;
		}
	}
	@media screen and (max-width: 705px) {
		.sökt {
    top: 125px;
	width: 200px;
    position: fixed;
}
}
@media screen and (max-width: 405px) {
		.sökt {
    left: 10%;
}
}
	@media screen and (max-width: 345px) {
		.ejsökt {
			width: 35%;
			height: 20px;
			font-size: 0.525em;
			bottom: 35%;
			left: 30.5%;
	} 
	.information-box {	
		bottom: 35%;
		width: 15px;
        height: 15px;
	}
	.bottom-i {
        width: 1.95px;
        height: 6px;
        left: 6.495px;
        top: 6.495px;
    }
    .top-i {
        width: 2.49975px;
        height: 2.49975px;
        left: 6.291px;
        top: 1.625px;
    }
	.information-box:hover::after {
        width: 42px;
        height: 120.5px;
		font-size: 0.225em;
		background: rgba(211,211,211,0.3);
		color: white;
		left: 30px;
    }
		.background-utemal {
			width: 253.125px;
			height: 126.5625px;
		}
		.sökmotorlogga{
			transform: translate(46.40625px);
		}
		.search-scope {
			width: 10.546875px;
			height: 10.546875px;
			border: 0.6328125px solid black;
		}
		.top-mark {
			transform: translate(12.65625px, 8.4375px);
		}
	@keyframes längd {
		0% {
			width: 6%;
		height: 0%;
		transform: translate(7.59375px, 8.4375px)rotate(135deg);
		}
		1% {
			width: 6%;
		height: 85%;
		transform: translate(12.65625px, 8.4375px)rotate(135deg);
		}
		99% {
			width: 6%;
		height: 85%;
		transform: translate(12.65625px, 8.4375px)rotate(135deg);
		}
		100% {
			width: 6%;
		height: 0%;
		transform: translate(7.59375px, 8.4375px)rotate(135deg);
		
		}
	}
		.top-mark2::after {
		content: '';
		height:4.21875px;
		width: 4.21875px;
		right: -1.265625px;
	}
	@keyframes droppe {
		0% {
			background-color: black;
		}
		10% {
			background-color: rgba(255,255,255,0.0);
		}
		20% {
			background-color: black;
		}
		30% {
			background-color: rgba(255,255,255,0.0);
		}
		40% {
			background-color: black;
		}
		50% {
			background-color: rgba(255,255,255,0.0);
		}
		60% {
			background-color: black;
		}
		70% {
			background-color: rgba(255,255,255,0.0);
			top: -1%;
			right: -1.265625px;
		}
		80% {
			background-color: black;
		}
		90% {
			background-color: black;
		}
		95% {
			top: -40%;
		right: -8.625px;
		}
		100% {
			top: -40%;
		right: -8.625px;
		}
	}
		.search-scope2 {
			height: 28.6875px;
			width: 28.6875px;
			border: 1.265625px solid black;
		}
		.top-mark2 {
			width: 2.141015625px;
			height: 32.171875px;
			transform: translate(36.703125px, 21.09375px)rotate(135deg);
		}
		.emoji-eyes {
		height: 2.53125px;
		width: 0.421875px;
		transform:translate(3.375px, 2.109375px);
	}
	.emoji-eyes2 {
		height: 2.53125px;
		width: 0.421875px;
		transform:translate(6.75px, 2.109375px);
	}
	.emoji-mouth {
    width: 4.21875px;
    height: 2.109375px;
    border: 0.6328125px solid black;
	transform:translate(2.3203125px, 5.90625px)
}
		.background-sokmotor {
			border: 25.3125px solid rgba(255,255,255,0.2)
		}
		.background-inne {
			transform:translate(25.3125px);
		}
		.loggafont {
			font-size: 2.3203125em;
		}
	}
	</style>
    