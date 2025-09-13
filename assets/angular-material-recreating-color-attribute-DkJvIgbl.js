const s=`---
title: Angular Material 20 - Recreating the [color] attribute
slug: angular-material-recreating-color-attribute
description: In this post we'll recreate [color] attribute in Angular Material 20
date: 2025-08-17
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
tags: [JavaScript, Angular, Angular Material, Theming]
shadowColor: angular
draft: false
lastMod: 2025-08-25
---

<h1 id="angular-material-20---recreating-the-color-attribute">Angular Material 20 - Recreating The [color] Attribute</h1>
<blockquote>
<sub>
<b>Changelog:</b><br>
<b>2025-08-25:</b> Made the toolbar example a bit more clear.<br>
</sub></blockquote>
<h2 id="the-color-attribute">The [color] attribute</h2>
<p>In older versions of Angular Material, several components came with a built in <code>[color]</code> attribute (in one form or another), which enabled easily setting the design of the given component, as long as you were fine with using some predefined styles.</p><p>Let&#39;s take a look at <a href="https://v16.material.angular.dev/components/button/overview">Angular Material v16&#39;s button</a> component for example:</p><p><img src="/images/angular-material/angular-material-v16-buttons.avif" alt="Angular Material v16 buttons overview"></p><p>You could put <code>color="primary"</code> on a button or a toolbar for example, and the component would be istantly set to the primary colors of your theme. Same with <code>color="accent"</code> or <code>color="warn"</code>.</p><p>As of Angular Material 18 however, the color attribute only has an effect on the older, M2 themes and does nothing when it comes to M3. The new overview of the button component looks quite bleak. Without further context, if you were working with Angular Material and looked at the <a href="https://v20.material.angular.dev/components/button/overview">v20 overview page</a>, which is the newest version at the time of writing this, you&#39;d probably be really surprised.</p><p><img src="/images/angular-material/angular-material-v20-buttons.avif" alt="Angular Material v20 buttons overview"></p><h2 id="customizing-the-button-in-v20">Customizing the button in v20</h2>
<p>I&#39;ve wrote, at length, about how customizing and theming works in newer versions of Angular Material, so I&#39;ll not go into that here and just leave a <a href="https://bneuhausz.dev/blog/angular-material-20-theming">link</a> to that post instead.</p><p>Anyway, bringing back the old <code>color</code> attribute&#39;s functionality is surprisingly easy using the new mixins. All you have to do to achieve that, assuming you use the prebuilt color palettes and the azure palette is your primary palette, is defining some rules in your <code>styles.scss</code>:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#F97583">@use</span><span style="color:#9ECBFF"> '@angular/material'</span><span style="color:#F97583"> as</span><span style="color:#FFAB70"> mat</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">[</span><span style="color:#B392F0">color</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">accent</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">] {</span></span>
<span class="line"><span style="color:#F97583">  @include</span><span style="color:#FFAB70"> mat</span><span style="color:#E1E4E8">.</span><span style="color:#B392F0">theme</span><span style="color:#E1E4E8">((</span></span>
<span class="line"><span style="color:#79B8FF">    color</span><span style="color:#E1E4E8">: </span><span style="color:#FFAB70">mat</span><span style="color:#E1E4E8">.</span><span style="color:#FFAB70">$rose-palette</span></span>
<span class="line"><span style="color:#E1E4E8">  ))</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">[</span><span style="color:#B392F0">color</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">warn</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">] {</span></span>
<span class="line"><span style="color:#F97583">  @include</span><span style="color:#FFAB70"> mat</span><span style="color:#E1E4E8">.</span><span style="color:#B392F0">theme</span><span style="color:#E1E4E8">((</span></span>
<span class="line"><span style="color:#79B8FF">    color</span><span style="color:#E1E4E8">: </span><span style="color:#FFAB70">mat</span><span style="color:#E1E4E8">.</span><span style="color:#FFAB70">$red-palette</span></span>
<span class="line"><span style="color:#E1E4E8">  ))</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p>Then you can just add the following buttons to your HTML:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">&#x3C;</span><span style="color:#85E89D">button</span><span style="color:#B392F0"> matButton</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">  Primary</span></span>
<span class="line"><span style="color:#E1E4E8">&#x3C;/</span><span style="color:#85E89D">button</span><span style="color:#E1E4E8">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">&#x3C;</span><span style="color:#85E89D">button</span><span style="color:#B392F0"> matButton</span><span style="color:#B392F0"> color</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"accent"</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">  Accent</span></span>
<span class="line"><span style="color:#E1E4E8">&#x3C;/</span><span style="color:#85E89D">button</span><span style="color:#E1E4E8">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">&#x3C;</span><span style="color:#85E89D">button</span><span style="color:#B392F0"> matButton</span><span style="color:#B392F0"> color</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"warn"</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">  Warn</span></span>
<span class="line"><span style="color:#E1E4E8">&#x3C;/</span><span style="color:#85E89D">button</span><span style="color:#E1E4E8">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">&#x3C;</span><span style="color:#85E89D">br</span><span style="color:#E1E4E8">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">&#x3C;</span><span style="color:#85E89D">button</span><span style="color:#B392F0"> matButton</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"filled"</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">  Primary</span></span>
<span class="line"><span style="color:#E1E4E8">&#x3C;/</span><span style="color:#85E89D">button</span><span style="color:#E1E4E8">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">&#x3C;</span><span style="color:#85E89D">button</span><span style="color:#B392F0"> matButton</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"filled"</span><span style="color:#B392F0"> color</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"accent"</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">  Accent</span></span>
<span class="line"><span style="color:#E1E4E8">&#x3C;/</span><span style="color:#85E89D">button</span><span style="color:#E1E4E8">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">&#x3C;</span><span style="color:#85E89D">button</span><span style="color:#B392F0"> matButton</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"filled"</span><span style="color:#B392F0"> color</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"warn"</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">  Warn</span></span>
<span class="line"><span style="color:#E1E4E8">&#x3C;/</span><span style="color:#85E89D">button</span><span style="color:#E1E4E8">></span></span></code></pre>
<p>And you should get this outcome:</p><p><img src="/images/angular-material/color-attribute-buttons.avif" alt="Angular Material v20 buttons with color attribute"></p><p>The colors do not exactly match the old ones, but you can create your own custom themes with the old colors or do it in a lot more finegrained way if you wish:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">[</span><span style="color:#B392F0">matButton</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">filled</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">][</span><span style="color:#B392F0">color</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">accent</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">] {</span></span>
<span class="line"><span style="color:#F97583">  @include</span><span style="color:#FFAB70"> mat</span><span style="color:#E1E4E8">.</span><span style="color:#B392F0">button-overrides</span><span style="color:#E1E4E8">((</span></span>
<span class="line"><span style="color:#E1E4E8">    filled</span><span style="color:#79B8FF">-</span><span style="color:#E1E4E8">container</span><span style="color:#79B8FF">-</span><span style="color:#E1E4E8">color: </span><span style="color:#79B8FF">green</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    filled</span><span style="color:#79B8FF">-</span><span style="color:#E1E4E8">label</span><span style="color:#79B8FF">-</span><span style="color:#E1E4E8">text</span><span style="color:#79B8FF">-</span><span style="color:#E1E4E8">color: </span><span style="color:#79B8FF">white</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">  ));</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p>This approach will apply your specific colors to every <code>filled</code>material button that has the <code>accent</code> color applied to it. However, one advantage of the approach above, is that it not only applies to your buttons, but to everything that supports the material theming. Meaning, if you want to create a toolbar that has the <code>warn</code> color, you can just create a fairly basic setup that uses the <code>mat.toolbar-overrides</code> mixin to set up the <code>mat-toolbar</code> to utilize the color variables and it works automatically. So soemthing like:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#B392F0">:root</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">  @include</span><span style="color:#FFAB70"> mat</span><span style="color:#E1E4E8">.</span><span style="color:#B392F0">theme</span><span style="color:#E1E4E8">((</span></span>
<span class="line"><span style="color:#79B8FF">    color</span><span style="color:#E1E4E8">: </span><span style="color:#FFAB70">mat</span><span style="color:#E1E4E8">.</span><span style="color:#FFAB70">$azure-palette</span></span>
<span class="line"><span style="color:#E1E4E8">  ));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">  @include</span><span style="color:#FFAB70"> mat</span><span style="color:#E1E4E8">.</span><span style="color:#B392F0">toolbar-overrides</span><span style="color:#E1E4E8">((</span></span>
<span class="line"><span style="color:#E1E4E8">    container</span><span style="color:#79B8FF">-</span><span style="color:#E1E4E8">background</span><span style="color:#79B8FF">-</span><span style="color:#E1E4E8">color: </span><span style="color:#79B8FF">var</span><span style="color:#E1E4E8">(</span><span style="color:#FFAB70">--mat-sys-primary</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">    container</span><span style="color:#79B8FF">-</span><span style="color:#E1E4E8">text</span><span style="color:#79B8FF">-</span><span style="color:#E1E4E8">color: </span><span style="color:#79B8FF">var</span><span style="color:#E1E4E8">(</span><span style="color:#FFAB70">--mat-sys-on-primary</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#E1E4E8">  ));</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">[</span><span style="color:#B392F0">color</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">warn</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">] {</span></span>
<span class="line"><span style="color:#F97583">  @include</span><span style="color:#FFAB70"> mat</span><span style="color:#E1E4E8">.</span><span style="color:#B392F0">theme</span><span style="color:#E1E4E8">((</span></span>
<span class="line"><span style="color:#79B8FF">    color</span><span style="color:#E1E4E8">: </span><span style="color:#FFAB70">mat</span><span style="color:#E1E4E8">.</span><span style="color:#FFAB70">$red-palette</span></span>
<span class="line"><span style="color:#E1E4E8">  ))</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span></code></pre>
<pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">&#x3C;</span><span style="color:#85E89D">mat-toolbar</span><span style="color:#B392F0"> color</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"warn"</span><span style="color:#E1E4E8">>&#x3C;/</span><span style="color:#85E89D">mat-toolbar</span><span style="color:#E1E4E8">></span></span></code></pre>
<p>This way, the default colors for the toolbars globally become the <code>--mat-sys-primary</code> and <code>mat-sys-on-primary</code> colors, but you can easily change it any time you want to by adding the <code>color</code> attribute.</p>`;export{s as default};
