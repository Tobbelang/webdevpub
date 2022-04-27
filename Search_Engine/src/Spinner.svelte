 <!-- https://loading.io/css/ -->
<link href="https://fonts.googleapis.com/css2?family=Montserrat&family=Oswald:wght@200;700&family=PT+Serif&display=swap" rel="stylesheet">

<div class="lds-roller">
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
</div>

<style>
    .lds-roller {
        display: inline-block;
        position: absolute;
        width: 80px;
        height: 80px;
        left: 48%;
        bottom: 80px;
        background-color:rgba(199,199,199,0.5);
        border-radius: 50%;
    }
    .lds-roller::after {
        content: 'Searching...';
        top: 100%;
        position: absolute;
        background-color: rgba(199,199,199,0.2);
        color: white;
        font-family: Oswald, sans-serif;
        width: 100%;
        height: 20px;
        text-align: center;

    }
    .lds-roller div {
        animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        transform-origin: 40px 40px;
    }
    .lds-roller div:after {
        content: " ";
        display: block;
        position: absolute;
        width: 3.5px;
        height: 3.5px;
        border-radius: 50%;
        background: #fff;
        margin: -4px 0 0 -4px;
    }
    .lds-roller div:nth-child(1) {
        animation-delay: -0.036s;
    }
    .lds-roller div:nth-child(1):after {
        top: 63px;
        left: 63px;
    }
    .lds-roller div:nth-child(2) {
        animation-delay: -0.072s;
    }
    .lds-roller div:nth-child(2):after {
        top: 68px;
        left: 56px;
    }
    .lds-roller div:nth-child(3) {
        animation-delay: -0.108s;
    }
    .lds-roller div:nth-child(3):after {
        top: 71px;
        left: 48px;
    }
    .lds-roller div:nth-child(4) {
        animation-delay: -0.144s;
    }
    .lds-roller div:nth-child(4):after {
        top: 72px;
        left: 40px;
    }
    .lds-roller div:nth-child(5) {
        animation-delay: -0.18s;
    }
    .lds-roller div:nth-child(5):after {
        top: 71px;
        left: 32px;
    }
    .lds-roller div:nth-child(6) {
        animation-delay: -0.216s;
    }
    .lds-roller div:nth-child(6):after {
        top: 68px;
        left: 24px;
    }
    .lds-roller div:nth-child(7) {
        animation-delay: -0.252s;
    }
    .lds-roller div:nth-child(7):after {
        top: 63px;
        left: 17px;
    }
    .lds-roller div:nth-child(8) {
        animation-delay: -0.288s;
    }
    .lds-roller div:nth-child(8):after {
        top: 56px;
        left: 12px;
    }
    @keyframes lds-roller {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>