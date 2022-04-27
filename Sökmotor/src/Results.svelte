<link href="https://fonts.googleapis.com/css2?family=Montserrat&family=Oswald:wght@200;700&family=PT+Serif&family=Poppins:wght@300&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital@1&display=swap" rel="stylesheet">
<script>
    export let json;
    let visaBeskrivninginnan = true;
    let visaBeskrivning = false;
    function visamer() {
        visaBeskrivninginnan = false;
        visaBeskrivning = true;
    }
    let mycket = { Text: true };
</script>
{#if json && "data" in json && "items" in json.data && json.data.items.length > 0}
    <div class="bakgrundtop">
            <div class="background">
            <div class="sökmotorlogga">
            <span class="loggafont" style="transform:translate(32.8px, 2px)">S</span>
                <div class="search">
                <div class="search-scope"></div>
                <div class="line-scope"></div>
            </div>
                <div class="loggafont">KMOTOR</div>
                </div>	
        </div>
    </div>    
<div id = "item-holder">
        {#each json.data.items as item}
        {#if item.type == "dataverse"}   
        <div id = "item">
                <p> <a href="{item.url}"> {item.url}</p>
                <div class="itemname"> <a href="{item.url}"> {item.name}</div>
                    {#if item.descripion = undefined}
                    <h4>No desciption found.</h4>
                {:else}
                <h4 id="beskrivninginnan" style="display: {visaBeskrivninginnan ? 'block' : 'none'}">{item.description}</h4>
                <h4 id="beskrivning" style="display: {visaBeskrivning ? 'block' : 'none'}">{item.description}</h4>
                {/if} 
                {#if mycket.Text}
                <form>
                    <input type="button" class="visamerstyling" on:click={visamer} value="▼ Visa all text"><h4 id="datum">{item.published_at}</h4>
                </form>
                {/if}
            </div>
            {/if}
        {/each}
    </div>
{:else if json}
 <div class="bakgrundtop">
            <div class="background">
            <div class="sökmotorlogga">
            <span class="loggafont" style="transform:translate(32.8px, 2px)">S</span>
                <div class="search">
                <div class="search-scope"></div>
                <div class="line-scope"></div>
            </div>
                <div class="loggafont">KMOTOR</div>
                </div>	
        </div>
    </div>    
<div class="animation">
	<div class="outline">
			<div class="triangle">
		</div>
	</div>
			<div class="exclamation-mark">
	<div class="top-mark"></div>
	<div class="bottom-mark"></div>
	</div>	
	<div class="textholder">
	<div>
	<span class="invalid-search">INVALID SEARCH</span>
  </div>
	<div>
	<div class="invalid-search" style="transform:translate(64px, 0px)">TERM</div>
	</div>
</div>
</div>
<form>
<input class="återställ" type="submit" value="Try again">
</form>
{/if}
<style>
    .animation {
        overflow:hidden;
        animation: blinkande 5s infinite;
        top: 40%;
        position: absolute;
}
	@keyframes blinkande {
  0%    { opacity: 1; }
  50%   { opacity: 0; }
  80%  { opacity: 1; }
}
	.triangle {
		height: 176px;
		width: 176px;
		background-color: rgba(255,0,0);
		clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
		transform:translate(4.8%, 6%)
	}
	.outline {
		transform: translate(10px, 0px);
		height: 192px;
		width: 192px;
		background-color: rgba(0,0,0);
		clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
	}
	.exclamation-mark {
		transform:translate(88px,-132px);
	}
	.textholder {
		transform:translate(0px, -120px);
		height: 80px;
		width: 208px;
		background-color: rgba(255,255,0,0.5);
		border-radius: 0px 0px 50% 50%
	}
	.top-mark {
		width: 20px;
		height: 80px;
		background-color: rgba(0,0,0,9);
		margin: 8px;
	}
	.bottom-mark {
		width: 20px;
		height: 20px;
		background-color: rgba(0,0,0,9);
		clip-path: circle(50% at 50% 50%);
		margin: 8px;
	}
	    .invalid-search {
        font-size: 1.6em;
        font-family: 'PT Serif', serif;
        color: red;
    }
    .visamerstyling {
        border: 0;
    line-height: 2.5;
    padding: 0 20px;
    font-size: 1rem;
    text-align: center;
    color: #fff;
    text-shadow: 1px 1px 1px #000;
    border-radius: 10px;
    background-color: rgb(238, 49, 159);
    background-image:rgba(0, 0, 0, .2);
    box-shadow: inset 2px 2px 3px rgba(255, 255, 255, .6),
                inset -2px -2px 3px rgba(0, 0, 0, .6);
    }
    .visamerstyling:hover {
    background-color: rgb(185, 70, 137);
}

.visamerstyling:active {
    box-shadow: inset -2px -2px 3px rgba(255, 255, 255, .6),
                inset 2px 2px 3px rgba(0, 0, 0, .6);
}
.background {
			width: 246.4px;
			height: 64px;
			border: 1px solid black;
			border-radius: 50%;
            position: absolute;
            left: 5%;
            top: 27%;
		}
.bakgrundtop {
    width: 700px;
    height: 150px;
    right: 0%;
    top: 0%;
    border-top-left-radius: 50%;
    border-bottom-left-radius: 50%;
    border: 1px solid white;
    background-color: rgba(192,192,192, 0.2);
    position: fixed;
}
.sökmotorlogga {
        animation: text-shadow 14s ease infinite;
        position: absolute;
    }
    @keyframes text-shadow {
        0% { 
        text-shadow: 2px 2px 4px blue;
    }
    12.5% { 
        text-shadow: 2px 2px 4px red;
    }
    25% { 
        text-shadow: 2px 2px 4px yellow;
    }
    37.5% { 
        text-shadow: 2px 2px 4px blue;
    }
    50% { 
        text-shadow: 2px 2px 4px green;
    }
    62.5% { 
        text-shadow: 2px 2px 4px red;
    }
    75% {
        text-shadow: 2px 2px 4px blue;
    }
    87.5% {
        text-shadow: 2px 2px 4px yellow;
    }
    100% {
        text-shadow: 2px 2px 4px blue; 
    }
}
    .loggafont {
        font-size: 2.4em;
        font-family: 'Oswald', sans-serif;
        color: black;
        position: absolute;
        transform:translate(96.8px, 2px)
        
    }
	.line-scope {
		width: 2.24px;
		height: 38.4px;
		background-color: black;
		transform: translate(84px, 22.8px)rotate(135deg);
        position: absolute;
	}
	.search {
        transform:translate(14.4px, 17.6px)
    }
    .search-scope {
		width: 32px;
		height: 32px;
		background-color: transparent;
		border: 1.2px solid black;
		border-radius: 50%;
        position: absolute;
        transform:translate(41.6px, 0px)
	}
    ::placeholder {
        color: white;
    }
    #beskrivninginnan {
 white-space: nowrap;
 overflow: hidden;
 text-overflow: ellipsis;
    }
    .itemname {
        font-size: 2em;
    }
    .itemname:hover {
        font-size: 2.2em;
        transition: 250ms;
    }
    a {
        color: rgb(0,0,200);
    }
    a:hover {
        color: rgb(0,0,255);
    }
    #datum {
        overflow: hidden;
        -webkit-line-clamp: 1;
        white-space: nowrap;
        -webkit-box-orient: vertical;
        max-width: 5.9rem;
        border: 0.5px solid purple;
        background: rgb(237, 131, 232);
        color: white;
        padding: 0.4px;
        border-radius: 8.5px;
    }
    .återställ {
			background: rgba(255,0,0,0.6);
			border: 1px solid rgb(255, 0, 125);
			border-radius: 15px;
			color: white;
            font-family: 'Roboto Condensed', sans-serif;
            font-size: 2em;
            position: absolute;
            top: 80%;
            width: 40%;
            left: 30%;
            border: 2px solid white;
		}
    #item-holder {
        display: flex;
        justify-content: start;
        align-items: center;
        flex-direction: column;
        overflow-y: scroll;
        box-sizing: border-box;
        padding-left: 10%;
        padding-right: 10%;
        width: 100%;
        row-gap: 20px;
        color: black;
    }

    #item {
        border-radius: 25px;
        background-color: rgb(243, 177, 240);
        border: 1.75px solid #5e0270;
        padding: 20px;
        width: 100%;
        box-sizing: border-box;
        word-wrap: break-word;
    }


    /** https://onaircode.com/html-css-custom-scrollbar-examples/ */
    ::-webkit-scrollbar {
        width: 15px;
        height: 15px;
    }
    ::-webkit-scrollbar-track {
        border-radius: 10px;
        background-color: rgba(255, 255, 255, 0.1);
    }
    ::-webkit-scrollbar-thumb {
        background-image: linear-gradient(45deg, #00aeff, #a68eff);
        border-radius: 10px;
        -webkit-box-shadow: rgba(0, 0, 0, 0.12) 0 3px 13px 1px;
    } 
    @media screen and (max-width: 705px) {
		.bakgrundtop {
    width: 100%;
    height: 175px;
    border-top-right-radius: 0%;
    border-bottom-right-radius: 0%;
    border-top-left-radius: 0%;
    border-bottom-left-radius: 0%;
    border: 1px solid white;
    background-color: rgba(192,192,192, 0.2);
    position: absolute;
}
}
</style>