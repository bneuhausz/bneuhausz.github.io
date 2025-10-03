const s=`---
title: Angular PWA tutorial part 2 - New version notification
slug: angular-pwa-tutorial-part-2
description: In part 2 of this series, we will take a look at how you can notify your users about a new version of your app being available
date: 2025-08-25
coverImage: /images/angular_wordmark_gradient_header.avif
coverImageMedium: /images/angular_wordmark_gradient_header_medium.avif
coverImageSmall: /images/angular_wordmark_gradient_header_small.avif
coverImageDescription: angular gradient image
metaImage: https://bneuhausz.dev/images/bneuhausz_dev_twitter.png
metaImageDescription: bneuhausz.dev site logo
thumbnail: /images/angular_gradient_thumbnail.avif
thumbnailDescription: angular logo
icon: /images/angular_gradient_icon.avif
iconDescription: angular logo
tags: [JavaScript, Angular, PWA]
shadowColor: angular
draft: false
lastMod: 2025-08-27
---

<h1 id="angular-pwa-tutorial-part-2---new-version-notification">Angular PWA tutorial part 2 - New version notification</h1>
<blockquote>
<sub>
<b>Changelog:</b><br>
<b>2025-08-27:</b> Added link to GitHub and part 3.<br>
</sub></blockquote>
<p>In part 2 of this series, we will take a look at how you can notify your users about a new version of your app being available.</p><p>In case you&#39;ve missed part 1 about the setup, <a href="https://bneuhausz.dev/blog/angular-pwa-tutorial-part-1">you can get up to speed here.</a></p><h2 id="a-bit-of-styling">A bit of styling</h2>
<p>In the post about the setup, I said we will not spend much time on making the app look good. That said, we&#39;ll add a bit of VERY basic CSS, just so we won&#39;t want to crawl our eyes out every time we look at our app.</p><p>Let&#39;s add the following to <code>styles.scss</code>:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#B392F0">:root</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#FFAB70">  --background-color</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">#d7c9c9</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#FFAB70">  --primary-color</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">#071793</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#FFAB70">  --on-primary-color</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">#ffffff</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D">body</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#79B8FF">  background</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">var</span><span style="color:#E1E4E8">(</span><span style="color:#FFAB70">--background-color</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D">button</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#79B8FF">  background-color</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">var</span><span style="color:#E1E4E8">(</span><span style="color:#FFAB70">--primary-color</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#79B8FF">  color</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">var</span><span style="color:#E1E4E8">(</span><span style="color:#FFAB70">--on-primary-color</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#79B8FF">  border-radius</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">8</span><span style="color:#F97583">px</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#79B8FF">  padding</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">4</span><span style="color:#F97583">px</span><span style="color:#79B8FF"> 8</span><span style="color:#F97583">px</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#79B8FF">  margin</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">0</span><span style="color:#79B8FF"> 4</span><span style="color:#F97583">px</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p>We&#39;ve just added a bit darker background and styled our buttons a bit. It&#39;s not pretty, but at least it doesn&#39;t hurt to look at it. Moving forward, we might tweak some things here and there, but we might end up with this being our final form. We&#39;ll see.</p><h2 id="introducing-the-swupdate-service">Introducing the SwUpdate service</h2>
<p>The <code>@angular/service-worker</code> package provides us with a service called <code>SwUpdate</code>. This service lets us communicate with the service worker that is running in the background. With its help, we can subscribe to the <code>versionUpdates</code> observable and react to events emitted by it. We can also manually check for updates with the <code>checkForUpdate</code> method.</p><p>There are 5 events we can react to:</p><ul>
<li><code>VersionDetectedEvent</code></li>
<li><code>NoNewVersionDetectedEvent</code></li>
<li><code>VersionReadyEvent</code></li>
<li><code>VersionInstallationFailedEvent</code></li>
<li><code>VersionFailedEvent</code></li>
</ul>
<p><code>SwUpdate</code> checks for a new version of the app when you start your installed app from the home screen or when you navigate to your app from another address in the browser.</p><p>Right now, we are interested in <code>VersionReadyEvent</code>, but you can read a bit more about these <a href="https://angular.dev/ecosystem/service-workers/communications">here.</a></p><h2 id="handling-versionreadyevent">Handling VersionReadyEvent</h2>
<p>First thing first, I&#39;ll show the implemented code, then we will discuss the new additions to the code.</p><p>Update your <code>app.ts</code> to reflect the following:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> { Component, inject, signal } </span><span style="color:#F97583">from</span><span style="color:#9ECBFF"> '@angular/core'</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> { RouterOutlet } </span><span style="color:#F97583">from</span><span style="color:#9ECBFF"> '@angular/router'</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> { NetworkService } </span><span style="color:#F97583">from</span><span style="color:#9ECBFF"> './shared/network/network'</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> { SwUpdate, VersionReadyEvent } </span><span style="color:#F97583">from</span><span style="color:#9ECBFF"> '@angular/service-worker'</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> { filter } </span><span style="color:#F97583">from</span><span style="color:#9ECBFF"> 'rxjs'</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">@</span><span style="color:#B392F0">Component</span><span style="color:#E1E4E8">({</span></span>
<span class="line"><span style="color:#E1E4E8">  selector: </span><span style="color:#9ECBFF">'app-root'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">  imports: [RouterOutlet],</span></span>
<span class="line"><span style="color:#E1E4E8">  template: </span><span style="color:#9ECBFF">\`</span></span>
<span class="line"><span style="color:#F97583">    @if</span><span style="color:#E1E4E8"> (</span><span style="color:#B392F0">isNewVersionReady</span><span style="color:#E1E4E8">()) {</span></span>
<span class="line"><span style="color:#E1E4E8">      &#x3C;</span><span style="color:#85E89D">span</span><span style="color:#E1E4E8">>🆕 New version available! Please reload the application.&#x3C;/</span><span style="color:#85E89D">span</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">      &#x3C;</span><span style="color:#85E89D">button</span><span style="color:#B392F0"> (click)</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"reload()"</span><span style="color:#E1E4E8">>Reload&#x3C;/</span><span style="color:#85E89D">button</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">    &#x3C;</span><span style="color:#85E89D">h1</span><span style="color:#E1E4E8">>Welcome to {{ </span><span style="color:#B392F0">title</span><span style="color:#E1E4E8">() }}!!&#x3C;/</span><span style="color:#85E89D">h1</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#F97583">    @if</span><span style="color:#E1E4E8"> (network.</span><span style="color:#B392F0">isOffline</span><span style="color:#E1E4E8">()) {</span></span>
<span class="line"><span style="color:#E1E4E8">      &#x3C;</span><span style="color:#85E89D">span</span><span style="color:#E1E4E8">>🚫 Offline&#x3C;/</span><span style="color:#85E89D">span</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    &#x3C;</span><span style="color:#85E89D">router-outlet</span><span style="color:#E1E4E8"> /></span></span>
<span class="line"><span style="color:#9ECBFF">  \`</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">})</span></span>
<span class="line"><span style="color:#F97583">export</span><span style="color:#F97583"> class</span><span style="color:#B392F0"> App</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">  protected</span><span style="color:#F97583"> readonly</span><span style="color:#FFAB70"> network</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> inject</span><span style="color:#E1E4E8">(NetworkService);</span></span>
<span class="line"><span style="color:#F97583">  private</span><span style="color:#F97583"> readonly</span><span style="color:#FFAB70"> swUpdate</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> inject</span><span style="color:#E1E4E8">(SwUpdate);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">  protected</span><span style="color:#F97583"> readonly</span><span style="color:#FFAB70"> title</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> signal</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">'pwa-tutorial'</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#F97583">  protected</span><span style="color:#F97583"> readonly</span><span style="color:#FFAB70"> isNewVersionReady</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> signal</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">false</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">  constructor</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#E1E4E8"> (</span><span style="color:#79B8FF">this</span><span style="color:#E1E4E8">.swUpdate.isEnabled) {</span></span>
<span class="line"><span style="color:#79B8FF">      this</span><span style="color:#E1E4E8">.swUpdate.versionUpdates</span></span>
<span class="line"><span style="color:#E1E4E8">        .</span><span style="color:#B392F0">pipe</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">filter</span><span style="color:#E1E4E8">(</span><span style="color:#FFAB70">event</span><span style="color:#F97583"> =></span><span style="color:#E1E4E8"> event.type </span><span style="color:#F97583">===</span><span style="color:#9ECBFF"> 'VERSION_READY'</span><span style="color:#E1E4E8">))</span></span>
<span class="line"><span style="color:#E1E4E8">        .</span><span style="color:#B392F0">subscribe</span><span style="color:#E1E4E8">((</span><span style="color:#FFAB70">event</span><span style="color:#F97583">:</span><span style="color:#B392F0"> VersionReadyEvent</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">=></span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#79B8FF">          this</span><span style="color:#E1E4E8">.isNewVersionReady.</span><span style="color:#B392F0">set</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">true</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">        });</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">  protected</span><span style="color:#B392F0"> reload</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#E1E4E8">    window.location.</span><span style="color:#B392F0">reload</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">  }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span></code></pre>
<p>We&#39;ve injected the <code>SwUpdate</code> service. Also, the <code>isNewVersionReady</code> signal was added with the initial value set to false. The only purpose of this signal is to control the appearance of our new version notification in the template, which we&#39;ve also added.</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">private readonly swUpdate </span><span style="color:#F97583">=</span><span style="color:#B392F0"> inject</span><span style="color:#E1E4E8">(SwUpdate);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">protected readonly isNewVersionReady </span><span style="color:#F97583">=</span><span style="color:#B392F0"> signal</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">false</span><span style="color:#E1E4E8">);</span></span></code></pre>
<pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#F97583">@if</span><span style="color:#E1E4E8"> (</span><span style="color:#B392F0">isNewVersionReady</span><span style="color:#E1E4E8">()) {</span></span>
<span class="line"><span style="color:#E1E4E8">  &#x3C;</span><span style="color:#85E89D">span</span><span style="color:#E1E4E8">>🆕 New version available! Please reload the application.&#x3C;/</span><span style="color:#85E89D">span</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">  &#x3C;</span><span style="color:#85E89D">button</span><span style="color:#B392F0"> (click)</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"reload()"</span><span style="color:#E1E4E8">>Reload&#x3C;/</span><span style="color:#85E89D">button</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p>We&#39;ve also added the reload function, which is pretty self-explanatory, it reloads our application:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">protected </span><span style="color:#B392F0">reload</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#E1E4E8">  window.location.</span><span style="color:#B392F0">reload</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p>Now, the interesting part.</p><p>First, in the constructor, we check, if service workers are enabled. We don&#39;t want to cause errors if the user disables them in their browser. If that&#39;s the case, they should be able to use our app as a regular webapp. A PWA is still a webapp after all.</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#B392F0">constructor</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">  if</span><span style="color:#E1E4E8"> (</span><span style="color:#79B8FF">this</span><span style="color:#E1E4E8">.swUpdate.isEnabled) {</span></span>
<span class="line"><span style="color:#6A737D">    // ...</span></span>
<span class="line"><span style="color:#E1E4E8">  }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p>If this check is passed, then we subscribe to the <code>versionUpdates</code> <code>Observable</code>, but first, we filter the events so we are only reacting if the event was fired to notify us of a new version being ready:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#79B8FF">this</span><span style="color:#E1E4E8">.swUpdate.versionUpdates</span></span>
<span class="line"><span style="color:#E1E4E8">  .</span><span style="color:#B392F0">pipe</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">filter</span><span style="color:#E1E4E8">(</span><span style="color:#FFAB70">event</span><span style="color:#F97583"> =></span><span style="color:#E1E4E8"> event.type </span><span style="color:#F97583">===</span><span style="color:#9ECBFF"> 'VERSION_READY'</span><span style="color:#E1E4E8">))</span></span>
<span class="line"><span style="color:#E1E4E8">  .</span><span style="color:#B392F0">subscribe</span><span style="color:#E1E4E8">((</span><span style="color:#FFAB70">event</span><span style="color:#F97583">:</span><span style="color:#B392F0"> VersionReadyEvent</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">=></span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#79B8FF">    this</span><span style="color:#E1E4E8">.isNewVersionReady.</span><span style="color:#B392F0">set</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">true</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">  });</span></span></code></pre>
<p>If the new version is ready, we set <code>isNewVersionReady</code> to true and our template does the rest. Rebuild your app and restart the server:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#B392F0">ng</span><span style="color:#9ECBFF"> build</span></span></code></pre>
<p>then</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#B392F0">npx</span><span style="color:#9ECBFF"> http-server</span><span style="color:#79B8FF"> -p</span><span style="color:#79B8FF"> 8080</span><span style="color:#79B8FF"> -c-1</span><span style="color:#9ECBFF"> dist/pwa-tutorial/browser</span></span></code></pre>
<p>The next time you start the application from the home screen, after a few seconds, you should see the following:</p><p><img src="/images/pwa-tutorial/part-2/new_version_notification.avif" alt="in app version notification"></p><p>If the user clicks the reload button, the app will reload and they instantly have access to the new version. If they choose not to reload, the new version was still downloaded in the background and after they refresh or they open the app the next time, the new version will be loaded.</p><p>One important note is that you have to change something in your application that changes the build output to register it as a new version, so make sure something changes in your html, css and javascript before you create a new build for the notification to work.</p><p>The complete code for this chapter is available <a href="https://github.com/bneuhausz/pwa-tutorial/tree/part-2">here.</a></p><p><a href="https://bneuhausz.dev/blog/angular-pwa-tutorial-part-3">Part 3 of this series, where we implement a simple backend for push notifications has been released, you can find it here.</a></p>`;export{s as default};
