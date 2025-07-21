const e=`---
title: Angular CLI Project Creation
slug: 2025-06-27-angular-project-creation
description: Just an easily bookmarkable note to myself
coverImage: /images/angular_wordmark_gradient_resized_header.png
coverImageDescription: angular gradient image
thumbnail: /images/angular_gradient_resized_thumbnail.png
thumbnailDescription: angular logo
tags: [Angular]
shadowColor: angular
---

<h1 id="angular-cli-project-creation">Angular CLI project creation</h1>
<p>This is just quick, easily bookmarkable note to myself for the <code>ng new</code> command.
There is nothing special about it, it just sets some useful defaults for the CLI.
I, more often than not, default to just create my files manually, but in canse I end up generating something, this is handy.
Obviously, depending on context, skipping tests might not be a good idea, but I use this mostly for hobby projects and learning purposes, so the spec files would serve no purpose other being clutter.</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#B392F0">ng</span><span style="color:#9ECBFF"> new</span><span style="color:#9ECBFF"> new-app</span><span style="color:#79B8FF"> --defaults</span><span style="color:#79B8FF"> --style=scss</span><span style="color:#79B8FF"> --inline-template</span><span style="color:#79B8FF"> --inline-style</span><span style="color:#79B8FF"> --skip-tests</span></span></code></pre>
<p>If, for whatever reason, you find this page, this command is the exact same Josh Morony uses in his course <a href="https://angularstart.com/">Angular start</a>, which I wholeheartedly recommend to anyone who is not a seasoned veteran in declarative programming, regardless of general developer experience, or even experience in Angular itself.</p>`;export{e as default};
