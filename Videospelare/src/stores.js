import { writable, derived, readable } from 'svelte/store';

export const trailersWatched = writable(0);

export const time = readable(new Date(), function start(set) {
    const interval = setInterval(() => {
        set(new Date());
    }, 1000);

    return function stop() {
        clearInterval(interval);
    };
});
const start = new Date();

export const timeOnSiteSeconds = derived(
    time,
    $time => Math.round(($time - start) / 1000)
);

export const chosen_video = writable();

export const video_player_is_active = writable(false);