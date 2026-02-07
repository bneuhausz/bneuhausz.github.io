const s=`---
title: Angular signal forms - Server side error handling
slug: angular-signal-forms-applying-server-errors
description: This time, we take a look at applying server side errors after submitting our form
date: 2025-09-06
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

<h1 id="angular-signal-forms---server-side-error-handling">Angular signal forms - Server side error handling</h1>
<blockquote>
<sub>
<b>Changelog:</b><br>
<b>2025-09-09:</b> Added link to part 3 about more advanced topics.<br>
<b>2025-12-08:</b> This article has been upgraded to the released version of Angular 21.<br>
<b>2026-02-07:</b> This article has been upgraded to Angular version 21.2.0-next.2, in which the Field directive has been renamed to FormField and the error object returned by the submit method should contain a fieldTree property instead of field.<br>
</sub></blockquote>
<p>In our second, much shorter look at Angular signal forms, we&#39;ll take a look at the new <code>submit</code> function and how it enables us to apply server side validation errors to the affected inputs in a pretty neat way.</p><p>The repo that belongs to this article is the same that we used for the last post and it can be found <a href="https://github.com/bneuhausz/angular-signal-forms">here,</a> with <code>submit-form.ts</code> added to demonstrate this feature.</p><h2 id="the-new-submit-function">The new submit function</h2>
<p>So this new <code>submit</code> function accepts a <code>FieldTree</code> and an <code>action</code>. The <code>FieldTree</code> will be our entire form and <code>action</code> will be a mock HTTP request. With this, we will demonstrate how you could validate the entire form on the server side after submitting, but the errors returned by our <code>action</code> will be applied automatically to the correct sub-field.</p><p>Let&#39;s take a look at our code and it will make more sense:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">@</span><span style="color:#B392F0">Component</span><span style="color:#E1E4E8">({</span></span>
<span class="line"><span style="color:#E1E4E8">  selector: </span><span style="color:#9ECBFF">'app-submit-form'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, Field],</span></span>
<span class="line"><span style="color:#E1E4E8">  template: </span><span style="color:#9ECBFF">\`</span></span>
<span class="line"><span style="color:#E1E4E8">    &#x3C;</span><span style="color:#85E89D">form</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">      &#x3C;</span><span style="color:#85E89D">mat-form-field</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">        &#x3C;</span><span style="color:#85E89D">mat-label</span><span style="color:#E1E4E8">>Name&#x3C;/</span><span style="color:#85E89D">mat-label</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">        &#x3C;</span><span style="color:#85E89D">input</span><span style="color:#B392F0"> matInput</span><span style="color:#B392F0"> [formField]</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"f.name"</span><span style="color:#E1E4E8"> /></span></span>
<span class="line"><span style="color:#F97583">        @if</span><span style="color:#E1E4E8"> (f.</span><span style="color:#B392F0">name</span><span style="color:#E1E4E8">().</span><span style="color:#B392F0">invalid</span><span style="color:#E1E4E8">()) {</span></span>
<span class="line"><span style="color:#E1E4E8">          &#x3C;</span><span style="color:#85E89D">mat-error</span><span style="color:#E1E4E8">>{{ f.</span><span style="color:#B392F0">name</span><span style="color:#E1E4E8">().</span><span style="color:#B392F0">errors</span><span style="color:#E1E4E8">()[0].kind }}: {{ f.</span><span style="color:#B392F0">name</span><span style="color:#E1E4E8">().</span><span style="color:#B392F0">errors</span><span style="color:#E1E4E8">()[0].message }}&#x3C;/</span><span style="color:#85E89D">mat-error</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">      &#x3C;/</span><span style="color:#85E89D">mat-form-field</span><span style="color:#E1E4E8">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">      &#x3C;</span><span style="color:#85E89D">button</span><span style="color:#B392F0"> mat-button</span><span style="color:#B392F0"> type</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"button"</span><span style="color:#B392F0"> [disabled]</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"f().invalid()"</span><span style="color:#B392F0"> (click)</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"submitForm()"</span><span style="color:#E1E4E8">>Submit&#x3C;/</span><span style="color:#85E89D">button</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">    &#x3C;/</span><span style="color:#85E89D">form</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#9ECBFF">  \`</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">})</span></span>
<span class="line"><span style="color:#F97583">export</span><span style="color:#F97583"> default</span><span style="color:#F97583"> class</span><span style="color:#B392F0"> ValidatedForm</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#FFAB70">  f</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> form</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">signal</span><span style="color:#E1E4E8">({</span></span>
<span class="line"><span style="color:#E1E4E8">    name: </span><span style="color:#9ECBFF">''</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">  }), </span><span style="color:#FFAB70">p</span><span style="color:#F97583"> =></span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    required</span><span style="color:#E1E4E8">(p.name, { message: </span><span style="color:#9ECBFF">'Name is required'</span><span style="color:#E1E4E8"> });</span></span>
<span class="line"><span style="color:#E1E4E8">  });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">  submitForm</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#B392F0">    submit</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">this</span><span style="color:#E1E4E8">.f, (</span><span style="color:#FFAB70">f</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">=></span><span style="color:#79B8FF"> this</span><span style="color:#E1E4E8">.</span><span style="color:#B392F0">mockHttpRequest</span><span style="color:#E1E4E8">(f));</span></span>
<span class="line"><span style="color:#E1E4E8">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">  mockHttpRequest</span><span style="color:#E1E4E8">(</span><span style="color:#FFAB70">form</span><span style="color:#F97583">:</span><span style="color:#B392F0"> FieldTree</span><span style="color:#E1E4E8">&#x3C;{ </span><span style="color:#FFAB70">name</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> string</span><span style="color:#E1E4E8"> }>) {</span></span>
<span class="line"><span style="color:#F97583">    return</span><span style="color:#79B8FF"> Promise</span><span style="color:#E1E4E8">.</span><span style="color:#B392F0">resolve</span><span style="color:#E1E4E8">(</span></span>
<span class="line"><span style="color:#B392F0">      form</span><span style="color:#E1E4E8">().</span><span style="color:#B392F0">value</span><span style="color:#E1E4E8">().name </span><span style="color:#F97583">===</span><span style="color:#9ECBFF"> 'Bálint'</span></span>
<span class="line"><span style="color:#F97583">        ?</span><span style="color:#79B8FF"> undefined</span></span>
<span class="line"><span style="color:#F97583">        :</span><span style="color:#E1E4E8"> [{</span></span>
<span class="line"><span style="color:#E1E4E8">          fieldTree: form.name,</span></span>
<span class="line"><span style="color:#E1E4E8">          kind: </span><span style="color:#9ECBFF">'server'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">          message: </span><span style="color:#9ECBFF">'Name is not valid'</span></span>
<span class="line"><span style="color:#E1E4E8">        }]</span></span>
<span class="line"><span style="color:#E1E4E8">    );</span></span>
<span class="line"><span style="color:#E1E4E8">  }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p>We added a <code>(click)</code> listener to our button, which will invoke our <code>submitForm</code> function when it fires.</p><p>Then, we create our <code>mockHttpRequest</code>, which accepts our <code>FieldTree</code> as a parameter and it will simply return a Promise, which is enough for demonstration purposes. It&#39;s important to note that our function accepts the <code>FieldTree</code> itself, not the value inside. If our validation criteria passes, we return undefined. If it doesn&#39;t, then we have to return our error in a specific format.</p><p>We are returning an array of errors. The <code>kind</code> and <code>message</code> are pretty straightforward and we looked at those in the <a href="https://bneuhausz.dev/blog/angular-signal-forms-are-out">first post about the new signal forms.</a></p><p>The <code>fieldTree</code> property is new though. We pass the specific sub-field we want this error to be applied to. Again, we pass the field and subfield without invoking anything, so make sure it is <code>form.name</code> and not <code>form.name()</code> or anything like that. This will be used by <code>submit</code> in the background to identify which sub-field the error has to be applied to.</p><p>Now all we have left to do is to call <code>submit</code> in our <code>submitForm</code> method and pass the form and our action. Assuming we&#39;ve done everything right, after we click our button, if the validation criteria in <code>mockHttpRequest</code> does not pass, our validation kind and message will show up right under our input, inside <code>mat-form-field</code>, which only shows up if specifically the <code>name</code> input is invalid, proving that this works as we intended.</p><h2 id="documentation-issue">Documentation issue</h2>
<p>Disregard this, it has been fixed in recent versions.</p><p><del>One thing I should point out, is that at the time of writing this article, the documentation is not consistent with the actual functionality.</del></p><p><img src="/images/angular-signal-forms/signal_forms_doc_error.avif" alt="windows notification"></p><p><del>Issues are expected, as signal forms are very much experimental still, but make sure to pay attention, because the example from the documentation above tells us to return the error in a different format that will not work, as the actual definition of the ValidationError interface is this:</del></p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#6A737D">/**</span></span>
<span class="line"><span style="color:#6A737D"> * Common interface for all validation errors.</span></span>
<span class="line"><span style="color:#6A737D"> *</span></span>
<span class="line"><span style="color:#6A737D"> * Use the creation functions to create an instance (e.g. \`requiredError\`, \`minError\`, etc.).</span></span>
<span class="line"><span style="color:#6A737D"> */</span></span>
<span class="line"><span style="color:#F97583">interface</span><span style="color:#B392F0"> ValidationError</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#6A737D">  /** Identifies the kind of error. */</span></span>
<span class="line"><span style="color:#F97583">  readonly</span><span style="color:#FFAB70"> kind</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> string</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#6A737D">  /** The field associated with this error. */</span></span>
<span class="line"><span style="color:#F97583">  readonly</span><span style="color:#FFAB70"> field</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Field</span><span style="color:#E1E4E8">&#x3C;</span><span style="color:#79B8FF">unknown</span><span style="color:#E1E4E8">>;</span></span>
<span class="line"><span style="color:#6A737D">  /** Human readable error message. */</span></span>
<span class="line"><span style="color:#F97583">  readonly</span><span style="color:#FFAB70"> message</span><span style="color:#F97583">?:</span><span style="color:#79B8FF"> string</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p><del>I&#39;m sure these little errors will be fixed fairly quickly, but even with these being around, the new Angular signal forms are a huge step in the right direction. I honestly can&#39;t wait to actually start using these features in production.</del></p><p><a href="https://bneuhausz.dev/blog/angular-signal-forms-advanced">The next issue about more advanced usages of Angular signal forms is out!</a></p>`;export{s as default};
