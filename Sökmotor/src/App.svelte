<link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@1,300&family=Montserrat&family=Oswald:wght@200;700&family=PT+Serif&family=Poppins:wght@300&display=swap" rel="stylesheet"> 
<link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital@1&display=swap" rel="stylesheet">
<script>
	import { sökningar } from './stores.js';
    import Spinner from "./Spinner.svelte";
    import Results from "./Results.svelte";
    import Search from "./Search.svelte";
    import { promise } from "./stores.js";
	let sökninggånger;
	sökningar.subscribe(gånger => {sökninggånger = gånger; });

</script>

<main>
<div class="sökt">Du har gjort {sökninggånger} sökningar!</div>
    <Search/>

    {#await $promise}
        <Spinner />
    {:then result}
        <Results json={result} />
    {:catch error}
    <div class="background">
		<div class="stav">		
	<div class="boom"></div>
	</div>                  
<div class="bollbox">
								<div class="row">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>
									</div>
	<div class="row2">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:1050ms"></div><div class="bollröd" style="animation-delay:1050ms"></div><div class="bollröd" style="animation-delay:1050ms"></div><div class="bollröd" style="animation-delay:1050ms"></div><div class="bollröd" style="animation-delay:1050ms"></div><div class="bollröd" style="animation-delay:1050ms"></div><div class="bollröd" style="animation-delay:1050ms"></div><div class="bollröd" style="animation-delay:1050ms"></div><div class="bollröd" style="animation-delay:1050ms"></div><div class="bollröd" style="animation-delay:1050ms"></div><div class="bollröd" style="animation-delay:1050ms"></div><div class="bollröd" style="animation-delay:1050ms"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>									
	</div>
	<div class="row3">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:1100ms"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:1100ms"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>									
	</div>
	<div class="row4">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:1150ms"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:1150ms"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>									
	</div>
	<div class="row5">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:1200ms"></div><div class="bollröd" style="animation-delay:1200ms"></div><div class="bollröd" style="animation-delay:1200ms"></div><div class="bollröd" style="animation-delay:1200ms"></div><div class="bollröd" style="animation-delay:1200ms"></div><div class="bollröd" style="animation-delay:1200ms"></div><div class="bollröd" style="animation-delay:1200ms"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>
									</div>
	<div class="row6">
		<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:1250ms"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:1250ms"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:1250ms"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>
									</div>
	<div class="row7">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:1300ms"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:1300ms"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:1300ms"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>
									</div>
	<div class="row8">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:1350ms"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:1350ms"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>
									</div>
	<div class="row9">
		<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>

									</div>
	<div class="row10">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:1450ms"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>
									</div>
	<div class="row11">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:1500ms"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>
									</div>
	<div class="row12">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:1550ms"></div><div class="bollröd" style="animation-delay:1550ms"></div><div class="bollröd" style="animation-delay:1550ms"></div><div class="bollröd" style="animation-delay:1550ms"></div><div class="bollröd" style="animation-delay:1550ms"></div><div class="bollröd" style="animation-delay:1550ms"></div><div class="bollröd" style="animation-delay:1550ms"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>
									</div>
	<div class="row13">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:1600ms"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>
									</div>
	<div class="row14">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:1650ms"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>
									</div>
	<div class="row15">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>
									</div>
	<div class="row16">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:1750ms"></div><div class="bollröd" style="animation-delay:1750ms"></div><div class="bollröd" style="animation-delay:1750ms"></div><div class="bollröd" style="animation-delay:1750ms"></div><div class="bollröd" style="animation-delay:1750ms"></div><div class="bollröd" style="animation-delay:1750ms"></div><div class="bollröd" style="animation-delay:1750ms"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>
									</div>
	<div class="row17">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:1800ms"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:1800ms"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>
									</div>
	<div class="row18">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:1850ms"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:1850ms"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>
									</div>
	<div class="row19">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>
									</div>
	<div class="row20">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:1950ms"></div><div class="bollröd" style="animation-delay:1950ms"></div><div class="bollröd" style="animation-delay:1950ms"></div><div class="bollröd" style="animation-delay:1950ms"></div><div class="bollröd" style="animation-delay:1950ms"></div><div class="bollröd" style="animation-delay:1950ms"></div><div class="bollröd" style="animation-delay:1950ms"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>
									</div>
	<div class="row21">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:2000ms"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>
									</div>
	<div class="row22">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:2050ms"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>
									</div>
	<div class="row23">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:2100ms"></div><div class="bollröd" style="animation-delay:2100ms"></div><div class="bollröd" style="animation-delay:2100ms"></div><div class="bollröd" style="animation-delay:2100ms"></div><div class="bollröd" style="animation-delay:2100ms"></div><div class="bollröd" style="animation-delay:2100ms"></div><div class="bollröd" style="animation-delay:2100ms"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>
									</div>
	<div class="row24">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>
									</div>
	<div class="row25">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:2200ms"></div><div class="boll"></div><div class="bollröd" style="animation-delay:2200ms"></div><div class="bollröd" style="animation-delay:2200ms"></div><div class="bollröd" style="animation-delay:2200ms"></div><div class="bollröd" style="animation-delay:2200ms"></div><div class="bollröd" style="animation-delay:2200ms"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>
									</div>
	<div class="row26">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>
									</div>
	<div class="row27">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:2300ms"></div><div class="bollröd" style="animation-delay:2300ms"></div><div class="bollröd" style="animation-delay:2300ms"></div><div class="bollröd" style="animation-delay:2300ms"></div><div class="bollröd" style="animation-delay:2300ms"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>
									</div>
	<div class="row28">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:2350ms"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>
									</div>
	<div class="row29">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:2400ms"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>
									</div>
	<div class="row30">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:2450ms"></div><div class="bollröd" style="animation-delay:2450ms"></div><div class="bollröd" style="animation-delay:2450ms"></div><div class="bollröd" style="animation-delay:2450ms"></div><div class="bollröd" style="animation-delay:2450ms"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>
									</div>
	<div class="row31">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>
									</div>
	<div class="row32">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:2550ms"></div><div class="bollröd" style="animation-delay:2550ms"></div><div class="bollröd" style="animation-delay:2550ms"></div><div class="bollröd" style="animation-delay:2550ms"></div><div class="bollröd" style="animation-delay:2550ms"></div><div class="bollröd" style="animation-delay:2550ms"></div><div class="bollröd" style="animation-delay:2550ms"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>

									</div>
	<div class="row33">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:2600ms"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:2600ms"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>

									</div>
	<div class="row34">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:2650ms"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:2650ms"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:2650ms"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>

									</div>
	<div class="row35">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:2700ms"></div><div class="boll"></div><div class="boll"></div><div class="bollröd" style="animation-delay:2700ms"></div><div class="bollröd" style="animation-delay:2700ms"></div><div class="bollröd" style="animation-delay:2700ms"></div><div class="bollröd" style="animation-delay:2700ms"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>
									</div>
	<div class="row36">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>
									</div>
	<div class="row37">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="bollröd-punkt" style="animation-delay:2800ms"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>
									</div>
	<div class="row38">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>
									</div>
	<div class="row39">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="bollröd-punkt" style="animation-delay:2900ms"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>
									</div>
	<div class="row40">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>
									</div>
	<div class="row41">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="bollröd-punkt" style="animation-delay:3000ms"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>
									</div>
	<div class="row42">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>
									</div>
	<div class="row43">
<div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div><div class="boll"></div>
									</div>
                </div>
				<div class="alternativ-text"> Failed to Fetch.
		<form>
			<input class="återställ-alternativ" type="submit" value="Try again">
			</form>
		</div>
	</div>
<div class="bollbox failedfetchtext">	Failed to Fetch.
<form>
<input class="återställ" type="submit" value="Try again">
</form>
	</div>
    {/await}
</main>

<style>
    :global(body) {
        padding: 0;
        margin: 0;
    }
	.sökt {
		font-size: 2rem;
		font-family: 'Roboto Condensed', sans-serif;
		color: silver;
		background: rgba(255,255,255,0.3);
		border-top-right-radius: 10px;
		border-top-left-radius: 10px;
		padding: 10px;
		text-shadow: 1px 1px #FF0000;
		text-align: center;
		align-items: center;
		bottom: 0%;
		position: absolute;
	}
    .background {
        height: 100%;
        width: 100%;
        background-color: gray;
        position:absolute;
        top: 0px;

    }
	.stav {
		width: 200px;
		height: 15px;
		background-color: purple;
		border: 0.5px solid purple;
		position: absolute;
		border-radius: 5px;
		top: 50%;
        left: -300%;
        animation: transformera 1.75s linear;
	}
    @keyframes transformera {
        0% {
            left: -30%;
        }
        100% {
            left: 40%;
        }
    }
    .boom {
        height:300px;
        width: 300px;
        background: linear-gradient(-135deg, red,blue,green,orange,white,black,yellow,purple,silver,brown,gray,pink,olive,maroon,violet,#36454F,magenta,#CD7F32,#FFFDD0,gold,tan,teal,#FFDB58,#000080,coral,#800020,lavender,#E0B0FF,#FFE5B4,#B7410E,indigo,#E0115F,cyan);
        border: 1px solid purple;
        border-radius:50%;
        position: absolute;
        top: -150px;
        left: 180px;
			animation: 0.01s virvel linear;
			animation-iteration-count: 175;
    }
	@keyframes virvel {
		0% {
			background: linear-gradient(-135deg, red,blue,green,orange,white,black,yellow,purple,silver,brown,gray,pink,olive,maroon,violet,#36454F,magenta,#CD7F32,#FFFDD0,gold,tan,teal,#FFDB58,#000080,coral,#800020,lavender,#E0B0FF,#FFE5B4,#B7410E,indigo,#E0115F,cyan);
		}
		100% {
			background: linear-gradient(135deg, red,blue,green,orange,white,black,yellow,purple,silver,brown,gray,pink,olive,maroon,violet,#36454F,magenta,#CD7F32,#FFFDD0,gold,tan,teal,#FFDB58,#000080,coral,#800020,lavender,#E0B0FF,#FFE5B4,#B7410E,indigo,#E0115F,cyan);
		}
	}
	
	div.row > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 1000ms;
	}
	div.row2 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 1050ms;
	}
	div.row3 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 1100ms;
	}
	div.row4 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 1150ms;
	}
	div.row5 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 1200ms;
	}
	div.row6 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 1250ms;
	}
	div.row7 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 1300ms;
	}
	div.row8 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 1350ms;
	}
	div.row9 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 1450ms;
	}
	div.row10 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 1500ms;
	}
	div.row11 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 1550ms;
	}
	div.row12 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 1600ms;
	}
	div.row13 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 1650ms;
	}
	div.row14 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 1700ms;
	}
	div.row15 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 1750ms;
	}
	div.row16 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 1800ms;
	}
	div.row17 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 1850ms;
	}
	div.row18 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 1900ms;
	}
	div.row19 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 1950ms;
	}
	div.row20 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 2000ms;
	}
	div.row21 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 2050ms;
	}
	div.row22 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 2100ms;
	}
	div.row23 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 2150ms;
	}
	div.row24 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 2200ms;
	}
	div.row25 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 2250ms;
	}
	div.row26 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 2300ms;
	}
	div.row27 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 2350ms;
	}
	div.row28 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 2400ms;
	}
	div.row29 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 2450ms;
	}
	div.row30 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 2500ms;
	}
	div.row31 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 2550ms;
	}
	div.row32 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 2600ms;
	}
	div.row33 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 2650ms;
	}
	
	div.row34 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 2700ms;
	}
	
	div.row35 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 2750ms;
	}
	div.row36 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 2800ms;
	}
	div.row37 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 2850ms;
	}

	div.row38 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 2900ms;
	}
	div.row39 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 2950ms;
	}
		div.row40 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 3000ms;
	}
	div.row41 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 3050ms;
	}
	div.row42 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 3100ms;
	}
		div.row43 > .boll {
						animation: display-row 2000s linear infinite;
		animation-delay: 3150ms;
	}
	@keyframes display-row { /*0.050 = 1 sek*/
		0% {
			background-color: transparent;
		}
		0.025% {
			background-color: rgba(255,255,255,0.6);
		}
		0.175% { 
			background-color: rgba(255,255,255,0.6);
		}
		0.2% {
			background-color: transparent;
		}
		100% {
		background-color: transparent;
		}
	}
    .bollbox {
		height: 400px;
		width: 860px;
		position: relative;
		animation: failed-fetch 1000s ease infinite;
        top: 30%;
        left: 25%;
	}
		.återställ {
		animation: återställ 1000s ease infinite;
			background: rgba(255,255,255,0.6);
			border: 1px solid gray;
			border-radius: 15px;
			color: gray;
		}
			
        @keyframes återställ {
		0% {
			background: transparent;
				border: transparent;
			color: transparent;
		}
				0.7%{
						background: transparent;
				border: transparent;
			color: transparent;
				}
		0.9% {
			background: rgba(255,255,255,0.6);
			border: 1px solid gray;
			border-radius: 15px;
			color: gray;
            font-size: 0.5em;
		}
		100% {
			background: transparent;
		}
	}
	@keyframes failed-fetch {
		0% {
			background: gray;
				border:1px solid black;
		}
        0.08% {
            background: gray;
				border:1px solid black;
        }
        0.09% {
            border: 1px solid red;
        }
		1.5% {
			background: gray;
			border: gray;
		}
		100% {
			background: transparent;
		}
	}
	.bollbox.failedfetchtext {
		font-size: 5em;
		font-family: 'Josefin Sans', sans-serif;
		position: absolute;
		color: transparent;
		animation: visatext 1000s ease infinite;
        top: 40%;
        left: 25%;
        text-align: center;
	}
	.alternativ-text {
		display: flex;
		font-size: 4rem;
		font-family: 'Josefin Sans', sans-serif;
		text-align: center;
		top: 40%;
		color: white;
		display: none;
		position: relative;
	}
	.återställ-alternativ {
			display: flex;
			background: rgba(255,255,255,0.6);
			border: 1px solid gray;
			border-radius: 15px;
			font-size: 0.5em;
			left: 40%;
			height: 10%;
			width: 20%;
			color: gray;
			display: none;
			position: relative;
			text-align: center;
		}
	@keyframes visatext {
		0% {
			color: transparent;
			background: transparent;
			border: transparent;
		}
		0.7% {
			color: transparent;
		}
		0.9% {
			color: silver;
		}
		100% {
			color: silver;
		}
	}
	.row {
		top:0%;
		left: 0px;
		position: absolute;
	}
	.row2 {
		top:0%;
		left: 20px;
		position: absolute;
	}
	.row3 {
		top:0%;
		left: 40px;
		position: absolute;
	}
	.row4 {
		top:0%;
		left: 60px;
		position: absolute;
	}
		.row5 {
		top:0%;
		left: 80px;
		position: absolute;
	}
	.row6 {
		top:0%;
		left: 100px;
		position: absolute;
	}
	.row7 {
		top:0%;
		left: 120px;
		position: absolute;
	}
	.row8 {
		top:0%;
		left: 140px;
		position: absolute;
	}
	.row9 {
		top:0%;
		left: 160px;
		position: absolute;
	}
	.row10 {
		top:0%;
		left: 180px;
		position: absolute;
	}
	.row11 {
		top:0%;
		left: 200px;
		position: absolute;
	}
	.row12 {
		top:0%;
		left: 220px;
		position: absolute;
	}
	.row13 {
		top:0%;
		left: 240px;
		position: absolute;
	}	
	.row14 {
		top:0%;
		left: 260px;
		position: absolute;
	}
	.row15 {
		top:0%;
		left: 280px;
		position: absolute;
	}
	.row16 {
		top:0%;
		left: 300px;
		position: absolute;
	}
	.row17 {
		top:0%;
		left: 320px;
		position: absolute;
	}
		.row18 {
		top:0%;
		left: 340px;
		position: absolute;
	}
	.row19 {
		top:0%;
		left: 360px;
		position: absolute;
	}
	.row20 {
		top:0%;
		left: 380px;
		position: absolute;
	}
	.row21 {
		top:0%;
		left: 400px;
		position: absolute;
	}
	.row22 {
		top:0%;
		left: 420px;
		position: absolute;
	}
	.row23 {
		top:0%;
		left: 440px;
		position: absolute;
	}
	.row24 {
		top:0%;
		left: 460px;
		position: absolute;
	}
	.row25 {
		top:0%;
		left: 480px;
		position: absolute;
	}
	.row26 {
		top:0%;
		left: 500px;
		position: absolute;
	}
	.row27 {
		top:0%;
		left: 520px;
		position: absolute;
	}
	.row28 {
		top:0%;
		left: 540px;
		position: absolute;
	}
	.row29 {
		top:0%;
		left: 560px;
		position: absolute;
	}
	.row30 {
		top:0%;
		left: 580px;
		position: absolute;
	}
	.row31 {
		top:0%;
		left: 600px;
		position: absolute;
	}
	.row32 {
		top:0%;
		left: 620px;
		position: absolute;
	}	
	.row33 {
		top:0%;
		left: 640px;
		position: absolute;
	}
	.row34 {
		top:0%;
		left: 660px;
		position: absolute;
	}
	.row35 {
		top:0%;
		left: 680px;
		position: absolute;
	}
	.row36 {
		top:0%;
		left: 700px;
		position: absolute;
	}
		.row37 {
		top:0%;
		left: 720px;
		position: absolute;
	}
	.row38 {
		top:0%;
		left: 740px;
		position: absolute;
	}
	.row39 {
		top:0%;
		left: 760px;
		position: absolute;
	}
	.row40 {
		top:0%;
		left: 780px;
		position: absolute;
	}
	.row41 {
		top:0%;
		left: 800px;
		position: absolute;
	}
	.row42 {
		top:0%;
		left: 820px;
		position: absolute;
	}
	.row43 {
		top:0%;
		left: 840px;
		position: absolute;
	}
	
	.boll {
		height: 20px;
		width: 20px;
		border-radius: 50%;
		position: relative;
	}
		.bollröd {
		height: 20px;
		width: 20px;
		border-radius: 50%;
		position: relative;
		animation: bollröd 2000s linear infinite;
	}
	@keyframes bollröd { /*0.050 = 1 sek*/
		0% {
			background-color: transparent;
		}
		0.025% {
			background: rgb(255,0,0);
		}
		0.175% { 
			background: rgb(255,0,0);
		}
		0.2% {
			background-color: transparent;
		}
		100% {
			background-color: transparent;
		}
	}
		.bollröd-punkt {
		height: 20px;
		width: 20px;
		border-radius: 50%;
		position: relative;
		animation: punkt 2000s linear infinite;
		background-color: transparent;
	}
	@keyframes punkt { /*0.050 = 1 sek*/
		0% {
			background-color: transparent;
		}
		0.020% {
			background-color: rgba(255,255,255,0.6);
		}
		0.025% {
			background: rgb(255,0,0);
		}
		0.035% {
			background-color: rgba(255,255,255,0.6);
		}
		0.045% {
			background: rgb(255,0,0);
		}
		0.055% {
			background-color: rgba(255,255,255,0.6);
		}
		0.065% {
			background: rgb(255,0,0);
		}
		0.075% {
			background-color: rgba(255,255,255,0.6);
		}
		0.085% {
			background: rgb(255,0,0);
		}
			0.095% {
			background-color: rgba(255,255,255,0.6);
		}
		0.105% {
			background: rgb(255,0,0);
		}
		0.115% {
			background-color: rgba(255,255,255,0.6);
		}
		0.125% {
			background: rgb(255,0,0);
		}
		0.135% {
			background-color: rgba(255,255,255,0.6);
		}
		0.145% {
			background: rgb(255,0,0);
		}
		0.155% {
			background-color: rgba(255,255,255,0.6);
		}
		0.165% {
			background: rgb(255,0,0);
		}
		0.175% {
			background-color: rgba(255,255,255,0.6);
		}
		0.185% {
			background: rgb(255,0,0);
		}
		0.195% {
			background-color: transparent;
			background: transparent;
		}
		100% {
			background-color: transparent;
			background: transparent;
		}
}
main {
        height: 100%;
        width: 100%;
        background: linear-gradient(-180deg, #3770dbc2, #d400ff);
        overflow: hidden; 
        display: flex;
        justify-content: start;
        align-items: center;
        flex-direction: column;
        gap: 50px;
        padding-top: 50px;
		padding-bottom: 60px;
        box-sizing: border-box;
    }
	@media screen and (max-width: 769px) {
	.återställ-alternativ {
		font-size: 0.3em;
		}
	}
	@media screen and (max-width: 475px) {
	.återställ-alternativ {
		font-size: 0.2em;
		}
	}
	@media screen and (max-width: 1436px) {
		.background {
			display: block;
		}
		.bollbox.failedfetchtext {
			display: none;
		}
		.bollbox {
		display: none;
	}
	.stav {
		display: none;
	}
		.alternativ-text {
		display: block;
	}
	.återställ-alternativ {
		display: block;
	}
}
</style>