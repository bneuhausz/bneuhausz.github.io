const s=`---
title: Angular signal forms - Advanced features
slug: angular-signal-forms-advanced
description: Let's take a look at more complex features of the new Angular signal forms
date: 2025-09-09
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
tags: [JavaScript, Angular]
shadowColor: angular
draft: false
lastMod: 2026-02-07
---

<h1 id="angular-signal-forms---advanced-features">Angular signal forms - Advanced features</h1>
<blockquote>
<sub>
<b>Changelog:</b><br>
<b>2025-12-08:</b> This article has been upgraded to the released version of Angular 21.<br>
<b>2026-02-07:</b> This article has been upgraded to Angular version 21.2.0-next.2, in which the Field directive has been renamed to FormField.<br>
</sub></blockquote>
<p>This time around, we&#39;ll take a look at more advanced features of the newly released, experimental signal forms. If you are not up to speed, make sure to take a look at the previous issues:</p><ul>
<li><a href="https://bneuhausz.dev/blog/angular-signal-forms-are-out">Angular signal forms are out! (Experimentally)</a></li>
<li><a href="https://bneuhausz.dev/blog/angular-signal-forms-applying-server-errors">Angular signal forms - Server side error handling</a></li>
</ul>
<p>The repo is the same and it can be found <a href="https://github.com/bneuhausz/angular-signal-forms">here,</a> but as of the release of this article, <a href="https://bneuhausz.dev/angular-signal-forms/">the live demo is also up on this site, here.</a></p><h2 id="custom-form-control">Custom form control</h2>
<p>I can&#39;t believe I can finally say this, but we might be done with ControlValueAccessor. What used to be a rather cumbersome API is now replaced with a simple <code>model</code> named <code>value</code> inside any component we want to use as a custom control. It really is that simple.</p><p>First of all, let&#39;s create our custom control:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> { Component, model } </span><span style="color:#F97583">from</span><span style="color:#9ECBFF"> "@angular/core"</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">@</span><span style="color:#B392F0">Component</span><span style="color:#E1E4E8">({</span></span>
<span class="line"><span style="color:#E1E4E8">  selector: </span><span style="color:#9ECBFF">'app-custom-control'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">  template: </span><span style="color:#9ECBFF">\`</span></span>
<span class="line"><span style="color:#E1E4E8">      &#x3C;</span><span style="color:#85E89D">div</span><span style="color:#B392F0"> [style.backgroundColor]</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"value()"</span><span style="color:#B392F0"> (click)</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"changeColor()"</span><span style="color:#E1E4E8">>Click Me!&#x3C;/</span><span style="color:#85E89D">div</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#9ECBFF">    \`</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">  styles: </span><span style="color:#9ECBFF">\`</span></span>
<span class="line"><span style="color:#B392F0">    :host</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#79B8FF">      display</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">flex</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#79B8FF">      justify-content</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">center</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D">    div</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#79B8FF">      width</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">100</span><span style="color:#F97583">px</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#79B8FF">      height</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">100</span><span style="color:#F97583">px</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#79B8FF">      display</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">flex</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#79B8FF">      justify-content</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">center</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#79B8FF">      align-items</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">center</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#9ECBFF">  \`</span></span>
<span class="line"><span style="color:#E1E4E8">})</span></span>
<span class="line"><span style="color:#F97583">export</span><span style="color:#F97583"> class</span><span style="color:#B392F0"> CustomControl</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#FFAB70">  value</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> model</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">''</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FFAB70">  colors</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> [</span><span style="color:#9ECBFF">'red'</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">'green'</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">'blue'</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">'yellow'</span><span style="color:#E1E4E8">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">  changeColor</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#F97583">    const</span><span style="color:#79B8FF"> randomIndex</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> Math.</span><span style="color:#B392F0">floor</span><span style="color:#E1E4E8">(Math.</span><span style="color:#B392F0">random</span><span style="color:#E1E4E8">() </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> this</span><span style="color:#E1E4E8">.colors.</span><span style="color:#79B8FF">length</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#79B8FF">    this</span><span style="color:#E1E4E8">.value.</span><span style="color:#B392F0">set</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">this</span><span style="color:#E1E4E8">.colors[randomIndex]);</span></span>
<span class="line"><span style="color:#E1E4E8">  }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p>Yes, this is the entire code of our control and most of it is fluff. All we really need to make this a custom form control is this single line:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">value </span><span style="color:#F97583">=</span><span style="color:#B392F0"> model</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">''</span><span style="color:#E1E4E8">);</span></span></code></pre>
<p>The rest is just some styling and logic to visualize things, but basically, every time we click on our div, its background color changes randomly and <code>value</code> will be set to the random color.</p><p>Using this is also really simple:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">@</span><span style="color:#B392F0">Component</span><span style="color:#E1E4E8">({</span></span>
<span class="line"><span style="color:#E1E4E8">  template: </span><span style="color:#9ECBFF">\`</span></span>
<span class="line"><span style="color:#E1E4E8">    &#x3C;</span><span style="color:#85E89D">form</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">      &#x3C;</span><span style="color:#85E89D">app-custom-control</span><span style="color:#B392F0"> [formField]</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"f.color"</span><span style="color:#E1E4E8">>&#x3C;/</span><span style="color:#85E89D">app-custom-control</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">    &#x3C;/</span><span style="color:#85E89D">form</span><span style="color:#E1E4E8">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    &#x3C;</span><span style="color:#85E89D">span</span><span style="color:#E1E4E8">>Form value: {{ </span><span style="color:#B392F0">f</span><span style="color:#E1E4E8">().</span><span style="color:#B392F0">value</span><span style="color:#E1E4E8">() </span><span style="color:#F97583">|</span><span style="color:#B392F0"> json</span><span style="color:#E1E4E8"> }}&#x3C;/</span><span style="color:#85E89D">span</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#9ECBFF">  \`</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">})</span></span>
<span class="line"><span style="color:#F97583">export</span><span style="color:#F97583"> default</span><span style="color:#F97583"> class</span><span style="color:#B392F0"> CustomControlForm</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#FFAB70">  f</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> form</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">signal</span><span style="color:#E1E4E8">({</span></span>
<span class="line"><span style="color:#E1E4E8">    color: </span><span style="color:#9ECBFF">''</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">  }));</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p><img src="/images/angular-signal-forms/custom_control.avif" alt="custom form control in action"></p><p>I left out some things like styling and imports to make it more readable, but this is more or less everything there is to this. This is a huge win for Angular&#39;s DX!</p><h2 id="multiple-schemas">Multiple schemas</h2>
<p>You wonder how you can deal with complex forms in smaller chunks to make it more maintainable? Luckily, that&#39;s incredibly easy too!</p><p>First things first, let&#39;s define our types and schemas:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#F97583">type</span><span style="color:#B392F0"> NameSchema</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#FFAB70">  firstName</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> string</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#FFAB70">  lastName</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> string</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">type</span><span style="color:#B392F0"> AddressSchema</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#FFAB70">  street</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> string</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#FFAB70">  city</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> string</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">type</span><span style="color:#B392F0"> Person</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#FFAB70">  name</span><span style="color:#F97583">:</span><span style="color:#B392F0"> NameSchema</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#FFAB70">  address</span><span style="color:#F97583">:</span><span style="color:#B392F0"> AddressSchema</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">const</span><span style="color:#79B8FF"> nameSchema</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> schema</span><span style="color:#E1E4E8">&#x3C;</span><span style="color:#B392F0">NameSchema</span><span style="color:#E1E4E8">>((</span><span style="color:#FFAB70">p</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">=></span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">  required</span><span style="color:#E1E4E8">(p.firstName, { message: </span><span style="color:#9ECBFF">'First name is required'</span><span style="color:#E1E4E8"> });</span></span>
<span class="line"><span style="color:#B392F0">  required</span><span style="color:#E1E4E8">(p.lastName, { message: </span><span style="color:#9ECBFF">'Last name is required'</span><span style="color:#E1E4E8"> });</span></span>
<span class="line"><span style="color:#E1E4E8">});</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">const</span><span style="color:#79B8FF"> addressSchema</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> schema</span><span style="color:#E1E4E8">&#x3C;</span><span style="color:#B392F0">AddressSchema</span><span style="color:#E1E4E8">>((</span><span style="color:#FFAB70">p</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">=></span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">  required</span><span style="color:#E1E4E8">(p.street, { message: </span><span style="color:#9ECBFF">'Street is required'</span><span style="color:#E1E4E8"> });</span></span>
<span class="line"><span style="color:#B392F0">  required</span><span style="color:#E1E4E8">(p.city, { message: </span><span style="color:#9ECBFF">'City is required'</span><span style="color:#E1E4E8"> });</span></span>
<span class="line"><span style="color:#E1E4E8">});</span></span></code></pre>
<p>We&#39;ve created a <code>Person</code> type that also has complex types inside. <code>NameSchema</code> and <code>AddressSchema</code> will be used to create the schemas based on those.</p><p>Our form definition is still really simple:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">model </span><span style="color:#F97583">=</span><span style="color:#B392F0"> signal</span><span style="color:#E1E4E8">&#x3C;</span><span style="color:#B392F0">Person</span><span style="color:#E1E4E8">>({</span></span>
<span class="line"><span style="color:#E1E4E8">  name: {</span></span>
<span class="line"><span style="color:#E1E4E8">    firstName: </span><span style="color:#9ECBFF">''</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    lastName: </span><span style="color:#9ECBFF">''</span></span>
<span class="line"><span style="color:#E1E4E8">  },</span></span>
<span class="line"><span style="color:#E1E4E8">  address: {</span></span>
<span class="line"><span style="color:#E1E4E8">    street: </span><span style="color:#9ECBFF">''</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    city: </span><span style="color:#9ECBFF">''</span></span>
<span class="line"><span style="color:#E1E4E8">  }</span></span>
<span class="line"><span style="color:#E1E4E8">});</span></span>
<span class="line"><span style="color:#E1E4E8">f </span><span style="color:#F97583">=</span><span style="color:#B392F0"> form</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">this</span><span style="color:#E1E4E8">.model, </span><span style="color:#FFAB70">p</span><span style="color:#F97583"> =></span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">  apply</span><span style="color:#E1E4E8">(p.name, nameSchema);</span></span>
<span class="line"><span style="color:#B392F0">  apply</span><span style="color:#E1E4E8">(p.address, addressSchema);</span></span>
<span class="line"><span style="color:#E1E4E8">});</span></span></code></pre>
<p>Now, instead of directly passing a schema to the <code>form</code> function like we did in the example with the basic schema definition, we use <code>FieldPath</code> and the <code>apply</code> function to, well, apply the schemas to their respective &quot;groups&quot; in our form.</p><p>The only thing we need to change in our template is that from now on, we can access firstName like <code>f.name.firstName</code> instead of <code>f.firstName</code>. For example:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">&#x3C;</span><span style="color:#85E89D">mat-form-field</span><span style="color:#E1E4E8">>angular-signal-forms-advanced</span></span>
<span class="line"><span style="color:#E1E4E8">  &#x3C;</span><span style="color:#85E89D">mat-label</span><span style="color:#E1E4E8">>First Name&#x3C;/</span><span style="color:#85E89D">mat-label</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">  &#x3C;</span><span style="color:#85E89D">input</span><span style="color:#B392F0"> matInput</span><span style="color:#B392F0"> [formField]</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"f.name.firstName"</span><span style="color:#E1E4E8"> /></span></span>
<span class="line"><span style="color:#F97583">  @if</span><span style="color:#E1E4E8"> (f.name.</span><span style="color:#B392F0">firstName</span><span style="color:#E1E4E8">().</span><span style="color:#B392F0">invalid</span><span style="color:#E1E4E8">()) {</span></span>
<span class="line"><span style="color:#E1E4E8">    &#x3C;</span><span style="color:#85E89D">mat-error</span><span style="color:#E1E4E8">>{{ f.name.</span><span style="color:#B392F0">firstName</span><span style="color:#E1E4E8">().</span><span style="color:#B392F0">errors</span><span style="color:#E1E4E8">()[0].message }}&#x3C;/</span><span style="color:#85E89D">mat-error</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">  }</span></span>
<span class="line"><span style="color:#E1E4E8">&#x3C;/</span><span style="color:#85E89D">mat-form-field</span><span style="color:#E1E4E8">></span></span></code></pre>
<h2 id="conditional-schema">Conditional schema</h2>
<p>Taking the multiple schemas example a bit further, we&#39;ll apply schemas conditionally too!</p><p>We alter our <code>Person</code> type and add <code>canReceiveNewspaper</code>:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#F97583">type</span><span style="color:#B392F0"> Person</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#FFAB70">  name</span><span style="color:#F97583">:</span><span style="color:#B392F0"> NameSchema</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#FFAB70">  address</span><span style="color:#F97583">:</span><span style="color:#B392F0"> AddressSchema</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#FFAB70">  canReceiveNewspaper</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> boolean</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p>Our schema definitions remain the same and the only change we have to make to our template is adding a checkbox to our form:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">&#x3C;</span><span style="color:#85E89D">mat-checkbox</span><span style="color:#B392F0"> [formField]</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"f.canReceiveNewspaper"</span><span style="color:#E1E4E8">>Send me newspapers!&#x3C;/</span><span style="color:#85E89D">mat-checkbox</span><span style="color:#E1E4E8">></span></span></code></pre>
<p>The form definition largely remains the same, but this is where it gets interesting:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">model </span><span style="color:#F97583">=</span><span style="color:#B392F0"> signal</span><span style="color:#E1E4E8">&#x3C;</span><span style="color:#B392F0">Person</span><span style="color:#E1E4E8">>({</span></span>
<span class="line"><span style="color:#E1E4E8">  name: {</span></span>
<span class="line"><span style="color:#E1E4E8">    firstName: </span><span style="color:#9ECBFF">''</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    lastName: </span><span style="color:#9ECBFF">''</span></span>
<span class="line"><span style="color:#E1E4E8">  },</span></span>
<span class="line"><span style="color:#E1E4E8">  address: {</span></span>
<span class="line"><span style="color:#E1E4E8">    street: </span><span style="color:#9ECBFF">''</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    city: </span><span style="color:#9ECBFF">''</span></span>
<span class="line"><span style="color:#E1E4E8">  },</span></span>
<span class="line"><span style="color:#E1E4E8">  canReceiveNewspaper: </span><span style="color:#79B8FF">false</span></span>
<span class="line"><span style="color:#E1E4E8">});</span></span>
<span class="line"><span style="color:#E1E4E8">f </span><span style="color:#F97583">=</span><span style="color:#B392F0"> form</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">this</span><span style="color:#E1E4E8">.model, </span><span style="color:#FFAB70">p</span><span style="color:#F97583"> =></span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">  apply</span><span style="color:#E1E4E8">(p.name, nameSchema);</span></span>
<span class="line"><span style="color:#B392F0">  applyWhen</span><span style="color:#E1E4E8">(p.address, ({ </span><span style="color:#FFAB70">valueOf</span><span style="color:#E1E4E8"> }) </span><span style="color:#F97583">=></span><span style="color:#B392F0"> valueOf</span><span style="color:#E1E4E8">(p.canReceiveNewspaper), addressSchema);</span></span>
<span class="line"><span style="color:#E1E4E8">});</span></span></code></pre>
<p>Notice, that we&#39;ve added <code>canReceiveNewspaper</code> to our model signal. Other than that, the only change is that we use <code>applyWhen</code> for the address schema, which accepts a function as its second parameter, that returns true when the schema should be applied. In our example the logic is very simple, we make the address controls required if the person opts in to receive newspapers, but you can go wild to your heart&#39;s contents with this!</p><h2 id="replacing-formarray">Replacing FormArray</h2>
<p>Our last example brings us to handling what used to be a <code>FormArray</code>, which has been a major pain point when it came to DX. For this example, we also have to change the definition of our <code>Person</code> type:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#F97583">type</span><span style="color:#B392F0"> Person</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#FFAB70">  name</span><span style="color:#F97583">:</span><span style="color:#B392F0"> NameSchema</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#FFAB70">  addresses</span><span style="color:#F97583">:</span><span style="color:#B392F0"> AddressSchema</span><span style="color:#E1E4E8">[];</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p>As you can see, we removed the boolean and changed <code>address: AddressSchema</code> to an array of multiple <code>AddressSchema</code> instances.</p><p>We add an &quot;Add Address&quot; button to our template and from now on, we iterate through <code>f.addresses</code> to render our address controls:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#F97583">@for</span><span style="color:#E1E4E8"> (address </span><span style="color:#F97583">of</span><span style="color:#E1E4E8"> f.addresses; track $index) {</span></span>
<span class="line"><span style="color:#E1E4E8">  &#x3C;</span><span style="color:#85E89D">mat-form-field</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">    &#x3C;</span><span style="color:#85E89D">mat-label</span><span style="color:#E1E4E8">>Street&#x3C;/</span><span style="color:#85E89D">mat-label</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">    &#x3C;</span><span style="color:#85E89D">input</span><span style="color:#B392F0"> matInput</span><span style="color:#B392F0"> [formField]</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"address.street"</span><span style="color:#E1E4E8"> /></span></span>
<span class="line"><span style="color:#F97583">    @if</span><span style="color:#E1E4E8"> (address.</span><span style="color:#B392F0">street</span><span style="color:#E1E4E8">().</span><span style="color:#B392F0">invalid</span><span style="color:#E1E4E8">()) {</span></span>
<span class="line"><span style="color:#E1E4E8">      &#x3C;</span><span style="color:#85E89D">mat-error</span><span style="color:#E1E4E8">>{{ address.</span><span style="color:#B392F0">street</span><span style="color:#E1E4E8">().</span><span style="color:#B392F0">errors</span><span style="color:#E1E4E8">()[0].message }}&#x3C;/</span><span style="color:#85E89D">mat-error</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">  &#x3C;/</span><span style="color:#85E89D">mat-form-field</span><span style="color:#E1E4E8">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">  &#x3C;</span><span style="color:#85E89D">mat-form-field</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">    &#x3C;</span><span style="color:#85E89D">mat-label</span><span style="color:#E1E4E8">>City&#x3C;/</span><span style="color:#85E89D">mat-label</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">    &#x3C;</span><span style="color:#85E89D">input</span><span style="color:#B392F0"> matInput</span><span style="color:#B392F0"> [formField]</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"address.city"</span><span style="color:#E1E4E8"> /></span></span>
<span class="line"><span style="color:#F97583">    @if</span><span style="color:#E1E4E8"> (address.</span><span style="color:#B392F0">city</span><span style="color:#E1E4E8">().</span><span style="color:#B392F0">invalid</span><span style="color:#E1E4E8">()) {</span></span>
<span class="line"><span style="color:#E1E4E8">      &#x3C;</span><span style="color:#85E89D">mat-error</span><span style="color:#E1E4E8">>{{ address.</span><span style="color:#B392F0">city</span><span style="color:#E1E4E8">().</span><span style="color:#B392F0">errors</span><span style="color:#E1E4E8">()[0].message }}&#x3C;/</span><span style="color:#85E89D">mat-error</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">  &#x3C;/</span><span style="color:#85E89D">mat-form-field</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">&#x3C;</span><span style="color:#85E89D">button</span><span style="color:#B392F0"> mat-button</span><span style="color:#B392F0"> type</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"button"</span><span style="color:#B392F0"> (click)</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"addAddress()"</span><span style="color:#E1E4E8">>Add Address&#x3C;/</span><span style="color:#85E89D">button</span><span style="color:#E1E4E8">></span></span></code></pre>
<p>As for the actual logic:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#F97583">export</span><span style="color:#F97583"> default</span><span style="color:#F97583"> class</span><span style="color:#B392F0"> FormWithArray</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#FFAB70">  model</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> signal</span><span style="color:#E1E4E8">&#x3C;</span><span style="color:#B392F0">Person</span><span style="color:#E1E4E8">>({</span></span>
<span class="line"><span style="color:#E1E4E8">    name: {</span></span>
<span class="line"><span style="color:#E1E4E8">      firstName: </span><span style="color:#9ECBFF">''</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">      lastName: </span><span style="color:#9ECBFF">''</span></span>
<span class="line"><span style="color:#E1E4E8">    },</span></span>
<span class="line"><span style="color:#E1E4E8">    addresses: [{</span></span>
<span class="line"><span style="color:#E1E4E8">      street: </span><span style="color:#9ECBFF">''</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">      city: </span><span style="color:#9ECBFF">''</span></span>
<span class="line"><span style="color:#E1E4E8">    }],</span></span>
<span class="line"><span style="color:#E1E4E8">  });</span></span>
<span class="line"><span style="color:#FFAB70">  f</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> form</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">this</span><span style="color:#E1E4E8">.model, </span><span style="color:#FFAB70">p</span><span style="color:#F97583"> =></span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    apply</span><span style="color:#E1E4E8">(p.name, nameSchema);</span></span>
<span class="line"><span style="color:#B392F0">    applyEach</span><span style="color:#E1E4E8">(p.addresses, addressSchema);</span></span>
<span class="line"><span style="color:#E1E4E8">  });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">  addAddress</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#79B8FF">    this</span><span style="color:#E1E4E8">.model.</span><span style="color:#B392F0">update</span><span style="color:#E1E4E8">(</span><span style="color:#FFAB70">m</span><span style="color:#F97583"> =></span><span style="color:#E1E4E8"> ({</span></span>
<span class="line"><span style="color:#F97583">      ...</span><span style="color:#E1E4E8">m,</span></span>
<span class="line"><span style="color:#E1E4E8">      addresses: [</span><span style="color:#F97583">...</span><span style="color:#E1E4E8">m.addresses, { street: </span><span style="color:#9ECBFF">''</span><span style="color:#E1E4E8">, city: </span><span style="color:#9ECBFF">''</span><span style="color:#E1E4E8"> }]</span></span>
<span class="line"><span style="color:#E1E4E8">    }));</span></span>
<span class="line"><span style="color:#E1E4E8">  }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p>We apply the changes of the <code>Person</code> type to our model signal, turning <code>address</code> into <code>addresses</code>. The <code>addAddress()</code> method is pretty straightforward, it adds a new <code>AddressSchema</code> to our <code>addresses</code> array. The key thing you should pay attention to here is that we used <code>applyEach</code> this time, which applies our schema definition to every element that gets added to <code>addresses</code>.</p><h2 id="conclusion">Conclusion</h2>
<p>All of these features are major pain points when working with Reactive Forms in Angular. The fact that these can be demonstrated through these very simple examples tells us all we have to know about how big of a win this is for Angular&#39;s DX.</p><p>Obviously, like everything else regarding signal forms, all of these are still experimental features, so make sure to consider that before you start using these in production grade applications, but this is clearly the - I hope very near - future of Angular.</p>`;export{s as default};
