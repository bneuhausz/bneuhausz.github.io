---
title: Lift Recorder is out on Google Play!
slug: lift-recorder-is-out
description: A free Android app that records your lifts without pausing Spotify or YouTube Music — video-only, saved to your gallery, no account needed.
date: 2026-08-18
coverImage: /images/lift-recorder-og.png
coverImageMedium: /images/lift-recorder-og.png
coverImageSmall: /images/lift-recorder-og.png
coverImageDescription: Lift Recorder — record your lifts without pausing your music
metaImage: https://bneuhausz.dev/images/lift-recorder-og.png
metaImageDescription: Lift Recorder — record your lifts without pausing your music
thumbnail: /images/lift-recorder-logo.png
thumbnailDescription: Lift Recorder app icon
icon: /images/lift-recorder-logo.png
iconDescription: Lift Recorder app icon
tags: [Android, Lift Recorder]
shadowColor: default
draft: false
lastMod: 2026-08-18
---

# Lift Recorder is out on Google Play!

For a while now, I've been building a small Android app on the side, and the day has come: it's live on Google Play! It's called Lift Recorder, and it does exactly one thing well: it films your sets at the gym without pausing your music.

<p class="not-prose my-8 flex justify-center">
  <a href="https://play.google.com/store/apps/details?id=dev.bneuhausz.liftrecorder" target="_blank" rel="noopener">
    <img src="/images/google-play-badge.png" alt="Get it on Google Play" width="646" height="250" class="h-auto w-52" />
  </a>
</p>

Or take a look at the [Lift Recorder page](/apps/lift-recorder) first, if you want the full rundown.

## Why recording video pauses your music on Android

If you record your lifts — for your own form checks or to send to your coach — you already know the problem. You open the camera, hit record, and Spotify goes silent mid-song. Every set turns into a little ritual of restarting your playlist.

The reason is a mechanism called audio focus. Most camera apps open the microphone when they record video, and the moment they do, they request audio focus so the mic audio comes out clean. Android hands focus over and pauses whatever you were listening to. Reasonable behavior for a video app. Very annoying between heavy sets.

Lift Recorder sidesteps the whole problem: it records **video only** and never opens the microphone, so Android has no reason to stop your playlist. Spotify, YouTube Music, whatever you train to — it just keeps playing.

<figure class="not-prose my-10 flex flex-col items-center gap-3">
  <img src="/images/lift-recorder/screenshot-2.jpg" alt="Recording in progress, with the elapsed time counting up at the top of the screen" width="540" height="1080" loading="lazy" class="w-56 rounded-2xl border border-amber-100/20 shadow-sm" />
  <figcaption class="text-center text-sm text-amber-200/70">Seven seconds into a set — and whatever was playing is still playing.</figcaption>
</figure>

To be honest, dropping the audio track is an easy trade. Your coach cares about your movement and your form, not gym noise. As a bonus, no copyrighted gym music ends up baked into a clip you might want to share.

## What it does

The app is intentionally tiny. You open it, you record, and every clip lands straight in your normal device gallery, ready to review or send to your coach with the tools you already use.

<figure class="not-prose my-10 flex flex-col items-center gap-3">
  <div class="mx-auto grid max-w-md grid-cols-2 gap-4">
    <img src="/images/lift-recorder/screenshot-1.jpg" alt="The camera view, ready to record" width="540" height="1080" loading="lazy" class="w-full rounded-2xl border border-amber-100/20 shadow-sm" />
    <img src="/images/lift-recorder/screenshot-3.jpg" alt="The Your clips screen, a grid of recorded clips with their durations" width="540" height="1080" loading="lazy" class="w-full rounded-2xl border border-amber-100/20 shadow-sm" />
  </div>
  <figcaption class="text-center text-sm text-amber-200/70">The whole app: a camera, and the clips you filmed with it.</figcaption>
</figure>

You can also trim clips right in the app. Drag two handles to pick where a clip starts and ends — the preview jumps to that exact frame as you go — and save. The original stays untouched, and the trimmed cut is written to your gallery as a new clip. Trimming runs on your device too, with your music still playing.

<figure class="not-prose my-10 flex flex-col items-center gap-3">
  <img src="/images/lift-recorder/screenshot-4.jpg" alt="The trim screen, with two handles marking a four second selection on the timeline" width="540" height="1080" loading="lazy" class="w-56 rounded-2xl border border-amber-100/20 shadow-sm" />
  <figcaption class="text-center text-sm text-amber-200/70">Four seconds selected out of six — the original clip stays where it is.</figcaption>
</figure>

That's it. No feature bloat, no workout tracker bolted on. It records your lifts and stays out of your way.

## Everything stays on your phone

There is no cloud and no server ever sees your videos. Every clip is recorded and stored locally, and nothing is uploaded anywhere.

There is also no account, no sign-up, and no profile. You shouldn't have to hand over personal data just to film a set. The full details of what is and isn't collected are in the [privacy policy](/apps/lift-recorder/privacy).

## Free, with an optional one-time upgrade

Lift Recorder is free and shows a small banner ad served by Google AdMob. If the banner bothers you, a one-time in-app purchase removes ads permanently — and once it's active, the ads code is not even loaded.

## Try it

If you film your sets and you're tired of your camera app fighting your playlist, give it a try. It's free, it's tiny, and it does what it says.

<p class="not-prose my-8 flex justify-center">
  <a href="https://play.google.com/store/apps/details?id=dev.bneuhausz.liftrecorder" target="_blank" rel="noopener">
    <img src="/images/google-play-badge.png" alt="Get it on Google Play" width="646" height="250" class="h-auto w-52" />
  </a>
</p>

If you run into a bug or have an idea that would make it better, [send me a message](/contact) — I'd love to hear how it holds up in your gym.
