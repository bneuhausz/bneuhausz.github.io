const e=`---
title: Angular PWA tutorial part 5 - Controlling appearance and installability
slug: angular-pwa-tutorial-part-5
description: In part 5 of this series, we will take a look at controlling the appearance and installability of our app through the manifest file
date: 2025-08-30
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

<h1 id="angular-pwa-tutorial-part-5---controlling-appearance-and-installability">Angular PWA tutorial part 5 - Controlling appearance and installability</h1>
<blockquote>
<sub>
<b>Changelog:</b><br>
<b>2025-09-01:</b> Added link to part 6.<br>
<b>2025-09-20:</b> Fixed icons in manifest.<br>
</sub></blockquote>
<p>In the first post of this series, <a href="https://bneuhausz.dev/blog/angular-pwa-tutorial-part-1">we&#39;ve created and installed our PWA app</a>. In the second, <a href="https://bneuhausz.dev/blog/angular-pwa-tutorial-part-2">we&#39;ve notified our users about a new version being available</a>. In part 3 and 4 we implemented the <a href="https://bneuhausz.dev/blog/angular-pwa-tutorial-part-3">backend</a> and <a href="https://bneuhausz.dev/blog/angular-pwa-tutorial-part-4">frontend</a> for the web push notification feature.</p><p>In this edition, we will take a look at how we can take a bit more control about the appearance and installability of our application with the help of the <code>manifest.webmanifest</code> file.</p><p>As always, the complete source code will be available <a href="https://github.com/bneuhausz/pwa-tutorial/tree/part-5">here.</a></p><h2 id="high-level-view-of-the-manifest">High level view of the manifest</h2>
<p>When you manually create a PWA, this file will be in the center of your attention much earlier, as it is not an Angular specific concept, but as we discussed it in <a href="https://bneuhausz.dev/blog/angular-pwa-tutorial-part-1">part 1 of this series</a>, the <code>@angular/pwa</code> schematic of the Angular CLI took care of the basic setup for us. It created the <code>manifest.webmanifest</code> file in the <code>public</code> folder of our application, so it gets copied into the built application, next to <code>index.html</code>.</p><p>Also, it added a <code>link</code> tag to the <code>head</code> of the <code>index.html</code> file, like this:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">&#x3C;</span><span style="color:#85E89D">link</span><span style="color:#B392F0"> rel</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"manifest"</span><span style="color:#B392F0"> href</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"manifest.webmanifest"</span><span style="color:#E1E4E8">></span></span></code></pre>
<p>The presence of a <code>link</code> tag with <code>rel="manifest"</code> set and that is what triggers the browser to prompt the user to install the application to their home screen. We can have some control over the installation process through the linked manifest file, which holds a simple <code>JSON</code> object.</p><p>You can read about all the members and the possible values you can set in the manifest file <a href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest">here</a>, but we will take a look at some of them together.</p><h2 id="explaining-the-manifest-in-its-current-state">Explaining the manifest in it&#39;s current state</h2>
<p>So right now, our <code>manifest.webmanifest</code> file looks like this:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">{</span></span>
<span class="line"><span style="color:#79B8FF">  "name"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"pwa-tutorial"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">  "short_name"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"pwa-tutorial"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">  "display"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"standalone"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">  "scope"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"./"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">  "start_url"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"./"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">  "icons"</span><span style="color:#E1E4E8">: [</span></span>
<span class="line"><span style="color:#E1E4E8">    {</span></span>
<span class="line"><span style="color:#79B8FF">      "src"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"icons/icon-72x72.png"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">      "sizes"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"72x72"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">      "type"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"image/png"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">      "purpose"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"maskable any"</span></span>
<span class="line"><span style="color:#E1E4E8">    },</span></span>
<span class="line"><span style="color:#6A737D">    // ...</span></span>
<span class="line"><span style="color:#E1E4E8">    {</span></span>
<span class="line"><span style="color:#79B8FF">      "src"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"icons/icon-512x512.png"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">      "sizes"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"512x512"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">      "type"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"image/png"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">      "purpose"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"maskable any"</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">  ]</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p>The <code>name</code> and <code>short_name</code> members specify the name for your app that will be shown to the users in places like the label for the icon on the home screen or the task manager. By default, <code>name</code> will be used, but if defined, <code>short_name</code> may take precedent when limited spaces is available. By default, the Angular CLI has set up the project name for both of these members.</p><p>With the <code>display</code> member, you can control if you want to show some parts of the browser UI to the user or make your app look like a native app. By default, this is set to <code>standalone</code>, so we don&#39;t show any browser UI at all, but you can set it to <code>browser</code> if you want to show the entire browser UI or <code>minimal-ui</code> if you want to show a limited set of browser controls.</p><p>The <code>scope</code> sets the top-level URL path that contains your PWA. If the user navigates to a URL that is out of the defined scope, the browser will show its own controls, notifying the user that they navigated out of the scope of your application.</p><p>That brings us to <code>start_url</code>, which is fairly self-explanatory. This is the URL that will load when the user starts the already installed PWA from their home screen.</p><p>Finally, let&#39;s look at the <code>icons</code> member. The configuration here tells the browser what icons can it use and the context the icons can be used in. The minimum required setup for <code>icons</code> is the following:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#9ECBFF">"icons"</span><span style="color:#E1E4E8">: [</span></span>
<span class="line"><span style="color:#E1E4E8">  {</span></span>
<span class="line"><span style="color:#79B8FF">    "src"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"icons/icon-72x72.png"</span></span>
<span class="line"><span style="color:#E1E4E8">  }</span></span>
<span class="line"><span style="color:#E1E4E8">]</span></span></code></pre>
<p>However, the Angular CLI has set us up with a lot more than that, so let&#39;s take a look at it.</p><h2 id="icons">Icons</h2>
<p>So the <code>icons</code> member contains an array and you can add several icons with their own configuration.</p><p>An icon object has four properties:</p><ul>
<li><code>src</code>: the path to the icon file.</li>
<li><code>sizes</code>: a space separated list of (width in pixels)x(height in pixels) format, which specifies at what sizes the icon should be used. If omitted or no size fits what the browser wants, the selection of the used icon will vary depending on the specific browser&#39;s implementation.</li>
<li><code>type</code>: a string specifying the MIME type of the image. If omitted, browsers infer the type, but specifying it can lead to performance improvements, because the browser can automatically ignore unsupported formats instead of trying to use its resources to infer the MIME type.</li>
<li><code>purpose</code>: this is also a space separated list of strings that specify in what context the icon can be used. Valid values are <code>monochrome</code>, <code>maskable</code> and <code>any</code> with <code>any</code> being the default value.</li>
</ul>
<p>The Angular CLI added the Angular icon in 8 different sizes to the <code>icons</code> member, with all of the mentioned properties specified, and it added the icon files to <code>public/icons</code>. The only part that is not necessarily self explanatory is the <code>maskable</code> value set to <code>purpose</code>. It means that the icon was designed with icon masks and safe zone in mind, which is mostly a concern when it comes to Android&#39;s adaptive icons feature. Basically, this tells the browser that the essential part of the logo is contained within a circular area at the center of the image, so the non-essential parts, like the edges, can be trimmed.</p><p><a href="https://maskable.app/">Maskable</a> is a handy tool to visualize and play around with the concept.</p><h2 id="some-other-interesting-manifest-members">Some other interesting manifest members</h2>
<p>This is a non-exhaustive list of possible manifest members that I think you might want to take a look at:</p><ul>
<li><code>theme_color</code>: allows you to specify the default color of the web app&#39;s user interface.</li>
<li><code>description</code>, <code>categories</code>, <code>screenshots</code>: these allow you to control the info shown about your app in app stores if you end up releasing it.</li>
<li><code>orientation</code>: enables you to control the default orientation with values like <code>landscape</code> and <code>portrait</code>. This is obviously most relevant on mobile devices.</li>
</ul>
<p>And there are much more that you can dive deep into <a href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest">here.</a></p><h2 id="lets-modify-our-own-manifest">Let&#39;s modify our own manifest!</h2>
<p>First of all, let&#39;s take a look at our current state. Our current icon for our application looks like this:</p><p><img src="/images/pwa-tutorial/part-5/pwa_icon_old.png" alt="old icon"></p><p>And here&#39;s our application in its current state:</p><p><img src="/images/pwa-tutorial/part-5/pwa_original.avif" alt="old app"></p><p>Now let&#39;s change some stuff! I&#39;ve renamed the application, changed the <code>display</code> member to <code>minimal-ui</code>, added the color of our buttons to the <code>theme_color</code> member, and replaced the Angular icon with my own:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">{</span></span>
<span class="line"><span style="color:#79B8FF">  "name"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"my-awesome-pwa"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">  "short_name"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"my-awesome-pwa"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">  "display"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"minimal-ui"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">  "theme_color"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"#071793"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">  "scope"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"./"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">  "start_url"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"./"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">  "icons"</span><span style="color:#E1E4E8">: [</span></span>
<span class="line"><span style="color:#E1E4E8">    {</span></span>
<span class="line"><span style="color:#79B8FF">      "src"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"icons/nb-logo-original.png"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">      "type"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"image/png"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">      "sizes"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"144x144"</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">  ]</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p>Changes in the manifest do not take effect immediately. Browsers check periodically, if changes were made and apply them eventually, but if you want to instantly see our changes, you have to reinstall our application. First, you will have to remove our current installation. You can do that by starting our app and clicking on the 3 dots icon in the toolbar, then select the &quot;uninstall pwa-tutorial&quot; option. This is how you do it on Windows with Chrome, but it might differ based on browser and operating system. It should be very similar and straight-forward though.</p><p><img src="/images/pwa-tutorial/part-5/pwa_uninstall.png" alt="uninstall steps"></p><p>Secondly, let&#39;s rebuild and run it with <code>http-server</code> as usual:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#B392F0">ng</span><span style="color:#9ECBFF"> build</span></span></code></pre>
<pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#B392F0">npx</span><span style="color:#9ECBFF"> http-server</span><span style="color:#79B8FF"> -p</span><span style="color:#79B8FF"> 8080</span><span style="color:#79B8FF"> -c-1</span><span style="color:#9ECBFF"> dist/pwa-tutorial/browser</span></span></code></pre>
<p>If our new app is running, navigate to <a href="https://localhost:8080">https://localhost:8080</a> in your browser. Now, since we just removed our application, the browser might not prompt you immediately to install it again, since it assumes you removed it for a good reason. Don&#39;t worry, it will prompt again, if it determines the user actually want to use it, because it visits it repeatedly and interacts with the app. Either way, you will have to install the app through the browsers menu. Here&#39;s how in Chrome:</p><p><img src="/images/pwa-tutorial/part-5/pwa_install_chrome_1.png" alt="install step 1"></p><p><img src="/images/pwa-tutorial/part-5/pwa_install_chrome_2.png" alt="install step 2"></p><p>After you&#39;re done, our new icon with the new name should show up on the home screen:</p><p><img src="/images/pwa-tutorial/part-5/pwa_icon_new.png" alt="new icon"></p><p>When it opens, you should see our app with some browser controls, our new icon and our new name in the toolbar, with the toolbar&#39;s color being set to the same blue our buttons are:</p><p><img src="/images/pwa-tutorial/part-5/pwa_colored.png" alt="new icon"></p><p><a href="https://bneuhausz.dev/blog/angular-pwa-tutorial-part-6">Part 6 of this series, where we take a look at the role of the ngsw-config.json file is out. Take a look at it here!</a></p>`;export{e as default};
