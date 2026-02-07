const s=`---
title: Angular PWA tutorial part 8 - Adding our own install button
slug: angular-pwa-tutorial-part-8
description: In part 8 of this series, we will create our own install button
date: 2025-09-20
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
lastMod: 2025-09-20
---

<h1 id="angular-pwa-tutorial-part-8---adding-our-own-install-button">Angular PWA tutorial part 8 - Adding our own install button</h1>
<p>Today, we will create our own install button, but this article builds on the earlier pieces of this series. In case you are new here, make sure to catch up on them:</p><ul>
<li><a href="https://bneuhausz.dev/blog/angular-pwa-tutorial-part-1">Setup</a></li>
<li><a href="https://bneuhausz.dev/blog/angular-pwa-tutorial-part-2">New version notification</a></li>
<li><a href="https://bneuhausz.dev/blog/angular-pwa-tutorial-part-3">Node backend for sending push notifications</a></li>
<li><a href="https://bneuhausz.dev/blog/angular-pwa-tutorial-part-4">Push notification frontend implementation</a></li>
<li><a href="https://bneuhausz.dev/blog/angular-pwa-tutorial-part-5">Controlling appearance and installability</a></li>
<li><a href="https://bneuhausz.dev/blog/angular-pwa-tutorial-part-6">Let&#39;s talk caching</a></li>
<li><a href="https://bneuhausz.dev/blog/angular-pwa-tutorial-part-7">Deploying our apps to GitHub Pages and Render</a></li>
</ul>
<p>As always, the complete source code will be available <a href="https://github.com/bneuhausz/pwa-tutorial/tree/part-8">here.</a></p><h2 id="installing-a-pwa">Installing a PWA</h2>
<p>We can install PWAs to our home screen, which is great. However, if your users are not developers or tech-savvy people themselves, this may be a pretty big barrier to entry. They might not know about the possibility of installing a PWA to begin with. Even if they do, they might not notice the small icon in the browser&#39;s address bar and installing the app through the share submenu is inconvenient, to say the least. So let&#39;s take a look at implementing our own install button, that prompts our users to install the app.</p><p>As a sidenote, there are ways to get your PWA to app stores, like <a href="https://developers.google.com/codelabs/pwa-in-play#0">Bubblewrap when it comes to Google Play</a>, but that is out of scope, at least in this specific article.</p><h2 id="prompting-our-users">Prompting our users</h2>
<p>We&#39;ll create a service that will handle the prompting. In <code>src/app/shared</code>, create an <code>install</code> folder and add <code>install.ts</code> with the following content:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> { Injectable, signal } </span><span style="color:#F97583">from</span><span style="color:#9ECBFF"> "@angular/core"</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">@</span><span style="color:#B392F0">Injectable</span><span style="color:#E1E4E8">({</span></span>
<span class="line"><span style="color:#E1E4E8">  providedIn: </span><span style="color:#9ECBFF">'root'</span></span>
<span class="line"><span style="color:#E1E4E8">})</span></span>
<span class="line"><span style="color:#F97583">export</span><span style="color:#F97583"> class</span><span style="color:#B392F0"> InstallService</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#FFAB70">  #deferredPrompt</span><span style="color:#F97583">?:</span><span style="color:#79B8FF"> any</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FFAB70">  canInstall</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> signal</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">false</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">  constructor</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#E1E4E8">    window.</span><span style="color:#B392F0">addEventListener</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">'beforeinstallprompt'</span><span style="color:#E1E4E8">, (</span><span style="color:#FFAB70">e</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">=></span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">      e.</span><span style="color:#B392F0">preventDefault</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#79B8FF">      this</span><span style="color:#E1E4E8">.#deferredPrompt </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> e;</span></span>
<span class="line"><span style="color:#79B8FF">      this</span><span style="color:#E1E4E8">.canInstall.</span><span style="color:#B392F0">set</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">true</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    });</span></span>
<span class="line"><span style="color:#E1E4E8">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">  promptToInstall</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> void</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#E1E4E8"> (</span><span style="color:#F97583">!</span><span style="color:#79B8FF">this</span><span style="color:#E1E4E8">.#deferredPrompt) {</span></span>
<span class="line"><span style="color:#F97583">      return</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF">    this</span><span style="color:#E1E4E8">.#deferredPrompt.</span><span style="color:#B392F0">prompt</span><span style="color:#E1E4E8">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF">    this</span><span style="color:#E1E4E8">.#deferredPrompt.userChoice.</span><span style="color:#B392F0">then</span><span style="color:#E1E4E8">(() </span><span style="color:#F97583">=></span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#79B8FF">      this</span><span style="color:#E1E4E8">.#deferredPrompt </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> null</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#79B8FF">      this</span><span style="color:#E1E4E8">.canInstall.</span><span style="color:#B392F0">set</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">false</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    });</span></span>
<span class="line"><span style="color:#E1E4E8">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">  public</span><span style="color:#B392F0"> isSafari</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    const</span><span style="color:#79B8FF"> userAgent</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> window.navigator.userAgent.</span><span style="color:#B392F0">toLowerCase</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#F97583">    return</span><span style="color:#9ECBFF"> /</span><span style="color:#DBEDFF">iphone</span><span style="color:#F97583">|</span><span style="color:#DBEDFF">ipad</span><span style="color:#F97583">|</span><span style="color:#DBEDFF">ipod</span><span style="color:#9ECBFF">/</span><span style="color:#E1E4E8">.</span><span style="color:#B392F0">test</span><span style="color:#E1E4E8">(userAgent) </span><span style="color:#F97583">&#x26;&#x26;</span><span style="color:#F97583"> !</span><span style="color:#9ECBFF">/</span><span style="color:#DBEDFF">crios</span><span style="color:#F97583">|</span><span style="color:#DBEDFF">fxios</span><span style="color:#F97583">|</span><span style="color:#DBEDFF">edgios</span><span style="color:#9ECBFF">/</span><span style="color:#E1E4E8">.</span><span style="color:#B392F0">test</span><span style="color:#E1E4E8">(userAgent);</span></span>
<span class="line"><span style="color:#E1E4E8">  }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p>Let&#39;s explain things. First, let&#39;s talk about the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeinstallprompt_event">beforeinstallprompt event</a>. This event fires when the browser has detected that the opened website can be installed as a PWA. It should be noted, that this is NOT supported in Safari and Firefox, so in case your users are likely to use those browsers, you need to handle those cases separately. Sadly, in those browsers, you can&#39;t add your own install button, so you would likely have to create some guides about how installing the app works and show that instead.</p><p>You can check if the app is running in a certain environment. I&#39;ve added the <code>isSafari</code> helper as an example, but from now on, we&#39;ll base everything on the assumption that we are working with a Chromium based browser, like Chrome, Edge or Opera, because only those are relevant for us here.</p><p>Either way, in the constructor of our service, we add a listener to the <code>beforeinstallprompt</code> event. When it fires, we do two things. We set our <code>canInstall</code> signal to true, which will be important when it comes to the UI, and after preventing the default functionality, we store the prompt in our <code>#deferredPrompt</code> variable. We&#39;ll use this variable later, to open a dialog that let&#39;s the user to install the app. It&#39;s the same functionality that happens, when you click the small install button in the address bar in the desktop version of Chrome.</p><p>Notice, that <code>#deferredPrompt</code> is of type <code>any</code>. We&#39;ll use <code>any</code>, because <code>BeforeInstallPromptEvent</code> is not baseline due to, as I mentioned, Safari and Firefox not supporting it. You can define your own interface and inherit most of it from <a href="https://developer.mozilla.org/en-US/docs/Web/API/Event">Event</a> if you wish, but for now it really doesn&#39;t matter.</p><p>This leaves us with the <code>promptToInstall</code> function, which is pretty self-explanatory. We will use this function when our user clicks our install button, and it handles the actual prompting.</p><h2 id="handling-the-ui">Handling the UI</h2>
<p>With our service created, let&#39;s start working on <code>app.ts</code>. Before we do anything else, we have to inject <code>InstallService</code> and define some signals:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">protected readonly install </span><span style="color:#F97583">=</span><span style="color:#B392F0"> inject</span><span style="color:#E1E4E8">(InstallService);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">readonly #isInstalled </span><span style="color:#F97583">=</span><span style="color:#B392F0"> signal</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">false</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">protected readonly showInstallButton </span><span style="color:#F97583">=</span><span style="color:#B392F0"> computed</span><span style="color:#E1E4E8">(() </span><span style="color:#F97583">=></span><span style="color:#F97583"> !</span><span style="color:#79B8FF">this</span><span style="color:#E1E4E8">.</span><span style="color:#B392F0">#isInstalled</span><span style="color:#E1E4E8">() </span><span style="color:#F97583">&#x26;&#x26;</span><span style="color:#79B8FF"> this</span><span style="color:#E1E4E8">.install.</span><span style="color:#B392F0">canInstall</span><span style="color:#E1E4E8">());</span></span></code></pre>
<p>Then, we have to check in the <code>constructor</code>, if the app is already installed:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#B392F0">constructor</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">  //...</span></span>
<span class="line"><span style="color:#6A737D">  // the original code before this remains the same</span></span>
<span class="line"><span style="color:#B392F0">  afterNextRender</span><span style="color:#E1E4E8">(() </span><span style="color:#F97583">=></span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">    const</span><span style="color:#79B8FF"> isRunningAsApp</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> (window.</span><span style="color:#B392F0">matchMedia</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">'(display-mode: standalone)'</span><span style="color:#E1E4E8">).matches) </span><span style="color:#F97583">||</span><span style="color:#E1E4E8"> (window.</span><span style="color:#B392F0">matchMedia</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">'(display-mode: minimal-ui)'</span><span style="color:#E1E4E8">).matches);</span></span>
<span class="line"><span style="color:#79B8FF">    this</span><span style="color:#E1E4E8">.#isInstalled.</span><span style="color:#B392F0">set</span><span style="color:#E1E4E8">(isRunningAsApp);</span></span>
<span class="line"><span style="color:#E1E4E8">  });</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p>We check if the app is running in <code>standalone</code> or <code>minimal-ui</code> mode, so we can hide our install button if there is no need to show it. The good thing about <code>afterNextRender</code> - compared to <code>ngOnInit</code> - is that it only runs in a browser environment, so accessing <code>window</code> in it does not cause issues. If <code>isRunningAsApp</code> evaluates to true, we set <code>#isInstalled</code> to true, which we use when we determine if the install button should be rendered. The <code>showInstallButton</code> computed signal will be true, if our app is not yet installed (or at least isn&#39;t running in <code>standalone</code> or <code>minimal-ui</code> mode) and the <code>beforeinstallprompt</code> event has fired and we&#39;ve set <code>canInstall</code> in our service to true.</p><p>After this, all we have to do is add the install button to our template:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#F97583">@if</span><span style="color:#E1E4E8"> (</span><span style="color:#B392F0">showInstallButton</span><span style="color:#E1E4E8">()) {</span></span>
<span class="line"><span style="color:#E1E4E8">  &#x3C;</span><span style="color:#85E89D">button</span><span style="color:#B392F0"> (click)</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"install.promptToInstall()"</span><span style="color:#E1E4E8">>Install App&#x3C;/</span><span style="color:#85E89D">button</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p>If everything went right, after the next time you run your app, assuming it is not yet installed or you uninstalled it, you should see our install button on the screen:</p><p><img src="/images/pwa-tutorial/part-8/install_button.png" alt="install button"></p><p><a href="https://bneuhausz.dev/pwa-tutorial/">The live demo of this application can be accessed here.</a></p>`;export{s as default};
