const s=`---
title: Visualizing Angular's dependency injection
slug: angular-visualizing-di
description: Dependency Injection can be confusing. Let's visualize it!
date: 2025-09-12
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
---

<h1 id="visualizing-angulars-dependency-injection">Visualizing Angular&#39;s dependency injection</h1>
<p>Dependency injection (DI) is an incredibly powerful concept that is heavily relied on in the enterprise space, yet, it is often mentioned as a drawback to using Angular in general web development circles. Some people say it is convoluted or straight up overengineering.</p><p>Let&#39;s try to make it a bit more clear by visualizing it.</p><h2 id="what-is-di">What is DI?</h2>
<p>Basically, dependency injection is a design pattern where a class receives its dependencies from an external source instead of creating them itself. An often used example to make it a bit more relatable is that of a cook working in a kitchen. Instead of having to go to the store and buying the ingredients himself, the chef just writes a list of what he needs for the day and it is the job of someone else to get the ingredients. In this example, a component can be the chef and Angular, the framework itself, is the one responsible to get what the component needs.</p><p>Using DI has great benefits when it comes to unit testing, so keep that in mind, but it is outside of the scope of this article, so we won&#39;t talk about it further.</p><h2 id="basic-example">Basic example</h2>
<p>Before we get into the visualization, let&#39;s cover some theory and take a look at a very simple service definition:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">@</span><span style="color:#B392F0">Injectable</span><span style="color:#E1E4E8">({</span></span>
<span class="line"><span style="color:#E1E4E8">  providedIn: </span><span style="color:#9ECBFF">'root'</span></span>
<span class="line"><span style="color:#E1E4E8">})</span></span>
<span class="line"><span style="color:#F97583">export</span><span style="color:#F97583"> class</span><span style="color:#B392F0"> GlobalService</span><span style="color:#E1E4E8"> { }</span></span></code></pre>
<p>In this case, <code>GlobalService</code> is called &quot;Global&quot; for a very good reason. The <code>@Injectable()</code> decorator specifies that Angular can use this class in the DI system and ensures that the compiler will generate all the metadata the framework needs to create the class&#39; dependencies when it gets injected. Since we added <code>providedIn: 'root'</code>, Angular will make this service available - or in other words, it will provide it - to our entire application. The framework will create an instance of this class the first time we inject it anywhere, and by default, it will share the same instance with anything that requests it.</p><h2 id="injecting-a-service">Injecting a service</h2>
<p>The modern approach is to use the <code>inject</code> function like this:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">@</span><span style="color:#B392F0">Component</span><span style="color:#E1E4E8">({</span></span>
<span class="line"><span style="color:#E1E4E8">  selector: </span><span style="color:#9ECBFF">'app-dummy-component'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">  template: </span><span style="color:#9ECBFF">\`\`</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">})</span></span>
<span class="line"><span style="color:#F97583">export</span><span style="color:#F97583"> default</span><span style="color:#F97583"> class</span><span style="color:#B392F0"> DummyComponent</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#FFAB70">  globalService</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> inject</span><span style="color:#E1E4E8">(GlobalService);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p>However, in older projects, you might see the old approach too, constructor based injection:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">@</span><span style="color:#B392F0">Component</span><span style="color:#E1E4E8">({</span></span>
<span class="line"><span style="color:#E1E4E8">  selector: </span><span style="color:#9ECBFF">'app-dummy-component'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">  template: </span><span style="color:#9ECBFF">\`\`</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">})</span></span>
<span class="line"><span style="color:#F97583">export</span><span style="color:#F97583"> default</span><span style="color:#F97583"> class</span><span style="color:#B392F0"> DummyComponent</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">  constructor</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">private</span><span style="color:#FFAB70"> globalService</span><span style="color:#F97583">:</span><span style="color:#B392F0"> GlobalService</span><span style="color:#E1E4E8">) { }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p>Why does this matter? Well, it will start to make a lot more sense as your dependency hierarchy grows, but let&#39;s create an example. Let&#39;s say we have the same setup as above, but we we want to avoid DI and we create our dependencies manually. Since <code>GlobalService</code> is just a class in the end of the day, we can use the <code>new</code> keyword:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">@</span><span style="color:#B392F0">Component</span><span style="color:#E1E4E8">({</span></span>
<span class="line"><span style="color:#E1E4E8">  selector: </span><span style="color:#9ECBFF">'app-dummy-component'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">  template: </span><span style="color:#9ECBFF">\`\`</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">})</span></span>
<span class="line"><span style="color:#F97583">export</span><span style="color:#F97583"> default</span><span style="color:#F97583"> class</span><span style="color:#B392F0"> DummyComponent</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#FFAB70">  globalService</span><span style="color:#F97583"> =</span><span style="color:#F97583"> new</span><span style="color:#B392F0"> GlobalService</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p>It&#39;s not that bad, right? Well, yes, but what if <code>GlobalService</code> has dependencies of its own? With this approach, we need to be aware of all of those and supply them when creating our instance of it.</p><p>Let&#39;s say <code>GlobalService</code> looks like this:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#F97583">export</span><span style="color:#F97583"> class</span><span style="color:#B392F0"> GlobalService</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">  constructor</span><span style="color:#E1E4E8">(</span></span>
<span class="line"><span style="color:#F97583">    private</span><span style="color:#FFAB70"> logger</span><span style="color:#F97583">:</span><span style="color:#B392F0"> LoggerService</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#F97583">    private</span><span style="color:#FFAB70"> userStore</span><span style="color:#F97583">:</span><span style="color:#B392F0"> UserStore</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#F97583">    private</span><span style="color:#FFAB70"> preferencesStore</span><span style="color:#F97583">:</span><span style="color:#B392F0"> PreferencesStore</span></span>
<span class="line"><span style="color:#E1E4E8">  ) { }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p>Then, our component has to create all of the dependencies of <code>GlobalService</code> before it can create an instance of <code>GlobalService</code> itself.</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">@</span><span style="color:#B392F0">Component</span><span style="color:#E1E4E8">({</span></span>
<span class="line"><span style="color:#E1E4E8">  selector: </span><span style="color:#9ECBFF">'app-dummy-component'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">  template: </span><span style="color:#9ECBFF">\`\`</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">})</span></span>
<span class="line"><span style="color:#F97583">export</span><span style="color:#F97583"> default</span><span style="color:#F97583"> class</span><span style="color:#B392F0"> DummyComponent</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#FFAB70">  globalService</span><span style="color:#F97583"> =</span><span style="color:#F97583"> new</span><span style="color:#B392F0"> GlobalService</span><span style="color:#E1E4E8">(</span></span>
<span class="line"><span style="color:#F97583">    new</span><span style="color:#B392F0"> LoggerService</span><span style="color:#E1E4E8">(),</span></span>
<span class="line"><span style="color:#F97583">    new</span><span style="color:#B392F0"> UserStore</span><span style="color:#E1E4E8">(),</span></span>
<span class="line"><span style="color:#F97583">    new</span><span style="color:#B392F0"> PreferencesStore</span><span style="color:#E1E4E8">()</span></span>
<span class="line"><span style="color:#E1E4E8">  );</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p>If we take this a step further, what if we have to send our logs to a third party service through the network for analytics purposes, so <code>LoggerService</code> has dependencies of its own? What if a dependency of <code>LoggerService</code> has dependencies too? Obviously, there are methods to prevent things to get out of control, but if we are using DI, then regardless of the complexity of the dependency tree, we just have to do this:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">@</span><span style="color:#B392F0">Component</span><span style="color:#E1E4E8">({</span></span>
<span class="line"><span style="color:#E1E4E8">  selector: </span><span style="color:#9ECBFF">'app-dummy-component'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">  template: </span><span style="color:#9ECBFF">\`\`</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">})</span></span>
<span class="line"><span style="color:#F97583">export</span><span style="color:#F97583"> default</span><span style="color:#F97583"> class</span><span style="color:#B392F0"> DummyComponent</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#FFAB70">  globalService</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> inject</span><span style="color:#E1E4E8">(GlobalService);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p>Yes, even if <code>GlobalService</code> has the same dependencies as above.</p><h2 id="providing-a-service-on-the-component-level">Providing a service on the component level</h2>
<p>So we&#39;ve discussed that by default, using <code>providedIn: 'root'</code> results in a single instance of our service being shared by the entire application. What if we need more finegrained control than that and we need a new instance of it in every component that requests one? That&#39;s what the <code>provicers</code> array in the <code>@Component()</code> decorator is for.</p><p>Let&#39;s say, on top of our <code>GlobalService</code> and <code>DummyComponent</code>, we also have a <code>DummyService</code>. This time, we do not provide it on the root level:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">@</span><span style="color:#B392F0">Injectable</span><span style="color:#E1E4E8">()</span></span>
<span class="line"><span style="color:#F97583">export</span><span style="color:#F97583"> class</span><span style="color:#B392F0"> GlobalService</span><span style="color:#E1E4E8"> { }</span></span></code></pre>
<p>Then, in <code>DummyComponent</code>, we add it to providers:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">@</span><span style="color:#B392F0">Component</span><span style="color:#E1E4E8">({</span></span>
<span class="line"><span style="color:#E1E4E8">  selector: </span><span style="color:#9ECBFF">'app-dummy-component'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">  providers: [DummyService],</span></span>
<span class="line"><span style="color:#E1E4E8">  template: </span><span style="color:#9ECBFF">\`\`</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">})</span></span>
<span class="line"><span style="color:#F97583">export</span><span style="color:#F97583"> default</span><span style="color:#F97583"> class</span><span style="color:#B392F0"> DummyComponent</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#FFAB70">  globalService</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> inject</span><span style="color:#E1E4E8">(GlobalService);</span></span>
<span class="line"><span style="color:#FFAB70">  dummyService</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> inject</span><span style="color:#E1E4E8">(DummyService);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p>This will result in <code>DummyComponent</code> sharing a single instance of <code>GlobalService</code> with everything else in our application, but every instance of <code>DummyComponent</code> will receive a new instance of <code>DummyService</code>. If <code>DummyComponent</code> has child components, those children will receive the same instance of <code>DummyService</code> their parent has, unless a child adds the service to its own providers. In the latter case, the child receives an entirely new instance too. If this sounds a bit confusing, don&#39;t worry, it will make a lot more sense in a bit, when we get to visualizing this.</p><p>One caveat here, is that you can combine the two approaches. Let&#39;s say we create a new component:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">@</span><span style="color:#B392F0">Component</span><span style="color:#E1E4E8">({</span></span>
<span class="line"><span style="color:#E1E4E8">  selector: </span><span style="color:#9ECBFF">'app-dummy-component'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">  providers: [GlobalService],</span></span>
<span class="line"><span style="color:#E1E4E8">  template: </span><span style="color:#9ECBFF">\`\`</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">})</span></span>
<span class="line"><span style="color:#F97583">export</span><span style="color:#F97583"> default</span><span style="color:#F97583"> class</span><span style="color:#B392F0"> VeryDumbComponent</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#FFAB70">  globalService</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> inject</span><span style="color:#E1E4E8">(GlobalService);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p>We added <code>GlobalService</code> to the providers of <code>VeryDumbComponent</code>, which results in an entirely new instance of <code>GlobalService</code> being created specifically for an instance of <code>VeryDumbComponent</code> and its children.</p><p>Sometimes you may want that, but if that is the case, then you likely should refactor your code. If you start providing services, that are provided on the root level, on the component level too, it might lead to unexpected behavior, if someone takes a look at the service definition and sees that it is supposed to be a globally available instance.</p><p>I hope this explanation somewhat cleared up how this all works, but in case it didn&#39;t, let&#39;s visualize it.</p><h2 id="visualization">Visualization</h2>
<h3 id="the-setup">The setup</h3>
<p>We will take a look at several examples, but all of them will be based on these two services:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">@</span><span style="color:#B392F0">Injectable</span><span style="color:#E1E4E8">({</span></span>
<span class="line"><span style="color:#E1E4E8">  providedIn: </span><span style="color:#9ECBFF">'root'</span></span>
<span class="line"><span style="color:#E1E4E8">})</span></span>
<span class="line"><span style="color:#F97583">export</span><span style="color:#F97583"> class</span><span style="color:#B392F0"> GlobalService</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#FFAB70">  serviceName</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> signal</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">'GlobalService - '</span><span style="color:#F97583"> +</span><span style="color:#E1E4E8"> Math.</span><span style="color:#B392F0">random</span><span style="color:#E1E4E8">().</span><span style="color:#B392F0">toString</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">36</span><span style="color:#E1E4E8">).</span><span style="color:#B392F0">substring</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">6</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">@</span><span style="color:#B392F0">Injectable</span><span style="color:#E1E4E8">()</span></span>
<span class="line"><span style="color:#F97583">export</span><span style="color:#F97583"> class</span><span style="color:#B392F0"> ProductService</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#FFAB70">  serviceName</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> signal</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">'ProductService - '</span><span style="color:#F97583"> +</span><span style="color:#E1E4E8"> Math.</span><span style="color:#B392F0">random</span><span style="color:#E1E4E8">().</span><span style="color:#B392F0">toString</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">36</span><span style="color:#E1E4E8">).</span><span style="color:#B392F0">substring</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">6</span><span style="color:#E1E4E8">));</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p>Both services will have a <code>serviceName</code> that gets randomly generated when an instance of the service is created. We have this because we will show these names on our screen, so we can easily determine if we see a single instance or multiple instances of the same service on our screen.</p><p><code>GlobalService</code> is provided on the root level, but we will provide <code>ProductService</code> depending on our needs at the given example. I named our service <code>Product</code> and later we will talk about <code>Parent</code> and <code>Details</code> components, but these names don&#39;t really mean anything, giving them a name just makes it easier to talk about them.</p><p><a href="https://github.com/bneuhausz/angular-services-demo">The source code of the example app used for this demonstration can be found here.</a></p><p><a href="https://bneuhausz.dev/angular-services-demo">The live demo application can also be seen here.</a></p><h3 id="single-instance-down-the-tree">Single instance down the tree</h3>
<p>First, take a look at our main component for the example:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">@</span><span style="color:#B392F0">Component</span><span style="color:#E1E4E8">({</span></span>
<span class="line"><span style="color:#E1E4E8">  selector: </span><span style="color:#9ECBFF">'app-product-single-service'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">  imports: [ProductSingleServiceDetailsComponent, ProductSingleServiceParentComponent],</span></span>
<span class="line"><span style="color:#E1E4E8">  providers: [ProductService],</span></span>
<span class="line"><span style="color:#E1E4E8">  template: </span><span style="color:#9ECBFF">\`</span></span>
<span class="line"><span style="color:#9ECBFF">    &#x3C;main></span></span>
<span class="line"><span style="color:#9ECBFF">      &#x3C;h1>Product - Single Service&#x3C;/h1></span></span>
<span class="line"><span style="color:#9ECBFF">      &#x3C;p>{{ globalService.serviceName() }}&#x3C;/p></span></span>
<span class="line"><span style="color:#9ECBFF">      &#x3C;p>{{ productService.serviceName() }}&#x3C;/p></span></span>
<span class="line"><span style="color:#9ECBFF">      &#x3C;app-product-single-service-details /></span></span>
<span class="line"><span style="color:#9ECBFF">      &#x3C;app-product-single-service-parent /></span></span>
<span class="line"><span style="color:#9ECBFF">    &#x3C;/main></span></span>
<span class="line"><span style="color:#9ECBFF">  \`</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">  styles: </span><span style="color:#9ECBFF">\`</span></span>
<span class="line"><span style="color:#9ECBFF">    main {</span></span>
<span class="line"><span style="color:#9ECBFF">      height: 565px;</span></span>
<span class="line"><span style="color:#9ECBFF">      width: 405px;</span></span>
<span class="line"><span style="color:#9ECBFF">      border: 5px solid black;</span></span>
<span class="line"><span style="color:#9ECBFF">      text-align: center;</span></span>
<span class="line"><span style="color:#9ECBFF">    }</span></span>
<span class="line"><span style="color:#9ECBFF">  \`</span></span>
<span class="line"><span style="color:#E1E4E8">})</span></span>
<span class="line"><span style="color:#F97583">export</span><span style="color:#F97583"> default</span><span style="color:#F97583"> class</span><span style="color:#B392F0"> ProductSingleServiceComponent</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#FFAB70">  globalService</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> inject</span><span style="color:#E1E4E8">(GlobalService);</span></span>
<span class="line"><span style="color:#FFAB70">  productService</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> inject</span><span style="color:#E1E4E8">(ProductService);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p>So far, this is fairly straightforward based on the explanation above. At least I hope so. We inject both of our services in our component and show their generated names on our screen. Notice, that we added <code>ProductService</code> to the <code>providers</code> array. However, we have two more components embedded:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">@</span><span style="color:#B392F0">Component</span><span style="color:#E1E4E8">({</span></span>
<span class="line"><span style="color:#E1E4E8">  selector: </span><span style="color:#9ECBFF">'app-product-single-service-details'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">  template: </span><span style="color:#9ECBFF">\`</span></span>
<span class="line"><span style="color:#9ECBFF">    &#x3C;main></span></span>
<span class="line"><span style="color:#9ECBFF">      &#x3C;h1>Details&#x3C;/h1></span></span>
<span class="line"><span style="color:#9ECBFF">      &#x3C;p>{{ globalService.serviceName() }}&#x3C;/p></span></span>
<span class="line"><span style="color:#9ECBFF">      &#x3C;p>{{ productService.serviceName() }}&#x3C;/p></span></span>
<span class="line"><span style="color:#9ECBFF">    &#x3C;/main></span></span>
<span class="line"><span style="color:#9ECBFF">  \`</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">  styles: </span><span style="color:#9ECBFF">\`</span></span>
<span class="line"><span style="color:#9ECBFF">    main {</span></span>
<span class="line"><span style="color:#9ECBFF">      height: 200px;</span></span>
<span class="line"><span style="color:#9ECBFF">      width: 400px;</span></span>
<span class="line"><span style="color:#9ECBFF">      border: 5px solid black;</span></span>
<span class="line"><span style="color:#9ECBFF">      text-align: center;</span></span>
<span class="line"><span style="color:#9ECBFF">    }</span></span>
<span class="line"><span style="color:#9ECBFF">  \`</span></span>
<span class="line"><span style="color:#E1E4E8">})</span></span>
<span class="line"><span style="color:#F97583">export</span><span style="color:#F97583"> class</span><span style="color:#B392F0"> ProductSingleServiceDetailsComponent</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#FFAB70">  globalService</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> inject</span><span style="color:#E1E4E8">(GlobalService);</span></span>
<span class="line"><span style="color:#FFAB70">  productService</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> inject</span><span style="color:#E1E4E8">(ProductService);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">@</span><span style="color:#B392F0">Component</span><span style="color:#E1E4E8">({</span></span>
<span class="line"><span style="color:#E1E4E8">  selector: </span><span style="color:#9ECBFF">'app-product-single-service-parent'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">  template: </span><span style="color:#9ECBFF">\`</span></span>
<span class="line"><span style="color:#9ECBFF">    &#x3C;main></span></span>
<span class="line"><span style="color:#9ECBFF">      &#x3C;h1>Parent&#x3C;/h1></span></span>
<span class="line"><span style="color:#9ECBFF">      &#x3C;p>{{ globalService.serviceName() }}&#x3C;/p></span></span>
<span class="line"><span style="color:#9ECBFF">      &#x3C;p>{{ productService.serviceName() }}&#x3C;/p></span></span>
<span class="line"><span style="color:#9ECBFF">    &#x3C;/main></span></span>
<span class="line"><span style="color:#9ECBFF">  \`</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">  styles: </span><span style="color:#9ECBFF">\`</span></span>
<span class="line"><span style="color:#9ECBFF">    main {</span></span>
<span class="line"><span style="color:#9ECBFF">      height: 200px;</span></span>
<span class="line"><span style="color:#9ECBFF">      width: 400px;</span></span>
<span class="line"><span style="color:#9ECBFF">      border: 5px solid black;</span></span>
<span class="line"><span style="color:#9ECBFF">      text-align: center;</span></span>
<span class="line"><span style="color:#9ECBFF">    }</span></span>
<span class="line"><span style="color:#9ECBFF">  \`</span></span>
<span class="line"><span style="color:#E1E4E8">})</span></span>
<span class="line"><span style="color:#F97583">export</span><span style="color:#F97583"> class</span><span style="color:#B392F0"> ProductSingleServiceParentComponent</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#FFAB70">  globalService</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> inject</span><span style="color:#E1E4E8">(GlobalService);</span></span>
<span class="line"><span style="color:#FFAB70">  productService</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> inject</span><span style="color:#E1E4E8">(ProductService);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p>In case of this specific example, the two components are exactly the same. What should be noted however, is that neither has a <code>providers</code> array of their own. This means, that both of these components will share the <code>ProductService</code> instance with the component that these are embedded in.</p><p>If you run the demo, your uniquely generated names should be different, but you should see something like this:</p><p><img src="/images/angular-di-visualization/single_service.png" alt="single service shared by all components"></p><p>As you can see, all three components share the same instances of both <code>GlobalService</code> and <code>ProductService</code>.</p><h3 id="unique-instance-for-all-components">Unique instance for all components</h3>
<p>In this example, the embedding component is more or less the same:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">@</span><span style="color:#B392F0">Component</span><span style="color:#E1E4E8">({</span></span>
<span class="line"><span style="color:#E1E4E8">  selector: </span><span style="color:#9ECBFF">'app-product-unique-service-for-each'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">  imports: [ProductUniqueServiceForEachDetailsComponent, ProductUniqueServiceForEachParentComponent],</span></span>
<span class="line"><span style="color:#E1E4E8">  providers: [ProductService],</span></span>
<span class="line"><span style="color:#E1E4E8">  template: </span><span style="color:#9ECBFF">\`</span></span>
<span class="line"><span style="color:#9ECBFF">    &#x3C;main></span></span>
<span class="line"><span style="color:#9ECBFF">      &#x3C;h1>Product - Unique Service&#x3C;/h1></span></span>
<span class="line"><span style="color:#9ECBFF">      &#x3C;p>{{ globalService.serviceName() }}&#x3C;/p></span></span>
<span class="line"><span style="color:#9ECBFF">      &#x3C;p>{{ productService.serviceName() }}&#x3C;/p></span></span>
<span class="line"><span style="color:#9ECBFF">      &#x3C;app-product-unique-service-for-each-details /></span></span>
<span class="line"><span style="color:#9ECBFF">      &#x3C;app-product-unique-service-for-each-parent /></span></span>
<span class="line"><span style="color:#9ECBFF">    &#x3C;/main></span></span>
<span class="line"><span style="color:#9ECBFF">  \`</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">  styles: </span><span style="color:#9ECBFF">\`</span></span>
<span class="line"><span style="color:#9ECBFF">    main {</span></span>
<span class="line"><span style="color:#9ECBFF">      height: 565px;</span></span>
<span class="line"><span style="color:#9ECBFF">      width: 405px;</span></span>
<span class="line"><span style="color:#9ECBFF">      border: 5px solid black;</span></span>
<span class="line"><span style="color:#9ECBFF">      text-align: center;</span></span>
<span class="line"><span style="color:#9ECBFF">    }</span></span>
<span class="line"><span style="color:#9ECBFF">  \`</span></span>
<span class="line"><span style="color:#E1E4E8">})</span></span>
<span class="line"><span style="color:#F97583">export</span><span style="color:#F97583"> default</span><span style="color:#F97583"> class</span><span style="color:#B392F0"> ProductUniqueServiceForEachComponent</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#FFAB70">  globalService</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> inject</span><span style="color:#E1E4E8">(GlobalService);</span></span>
<span class="line"><span style="color:#FFAB70">  productService</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> inject</span><span style="color:#E1E4E8">(ProductService);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p>The embedded components however, have their own instance of <code>ProductService</code> provided to them:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">@</span><span style="color:#B392F0">Component</span><span style="color:#E1E4E8">({</span></span>
<span class="line"><span style="color:#E1E4E8">  selector: </span><span style="color:#9ECBFF">'app-product-unique-service-for-each-details'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">  providers: [ProductService],</span></span>
<span class="line"><span style="color:#E1E4E8">  template: </span><span style="color:#9ECBFF">\`</span></span>
<span class="line"><span style="color:#9ECBFF">    &#x3C;main></span></span>
<span class="line"><span style="color:#9ECBFF">      &#x3C;h1>Details&#x3C;/h1></span></span>
<span class="line"><span style="color:#9ECBFF">      &#x3C;p>{{ globalService.serviceName() }}&#x3C;/p></span></span>
<span class="line"><span style="color:#9ECBFF">      &#x3C;p>{{ productService.serviceName() }}&#x3C;/p></span></span>
<span class="line"><span style="color:#9ECBFF">    &#x3C;/main></span></span>
<span class="line"><span style="color:#9ECBFF">  \`</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">  styles: </span><span style="color:#9ECBFF">\`</span></span>
<span class="line"><span style="color:#9ECBFF">    main {</span></span>
<span class="line"><span style="color:#9ECBFF">      height: 200px;</span></span>
<span class="line"><span style="color:#9ECBFF">      width: 400px;</span></span>
<span class="line"><span style="color:#9ECBFF">      border: 5px solid black;</span></span>
<span class="line"><span style="color:#9ECBFF">      text-align: center;</span></span>
<span class="line"><span style="color:#9ECBFF">    }</span></span>
<span class="line"><span style="color:#9ECBFF">  \`</span></span>
<span class="line"><span style="color:#E1E4E8">})</span></span>
<span class="line"><span style="color:#F97583">export</span><span style="color:#F97583"> class</span><span style="color:#B392F0"> ProductUniqueServiceForEachDetailsComponent</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#FFAB70">  globalService</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> inject</span><span style="color:#E1E4E8">(GlobalService);</span></span>
<span class="line"><span style="color:#FFAB70">  productService</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> inject</span><span style="color:#E1E4E8">(ProductService);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">@</span><span style="color:#B392F0">Component</span><span style="color:#E1E4E8">({</span></span>
<span class="line"><span style="color:#E1E4E8">  selector: </span><span style="color:#9ECBFF">'app-product-unique-service-for-each-parent'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">  providers: [ProductService],</span></span>
<span class="line"><span style="color:#E1E4E8">  template: </span><span style="color:#9ECBFF">\`</span></span>
<span class="line"><span style="color:#9ECBFF">    &#x3C;main></span></span>
<span class="line"><span style="color:#9ECBFF">      &#x3C;h1>Parent&#x3C;/h1></span></span>
<span class="line"><span style="color:#9ECBFF">      &#x3C;p>{{ globalService.serviceName() }}&#x3C;/p></span></span>
<span class="line"><span style="color:#9ECBFF">      &#x3C;p>{{ productService.serviceName() }}&#x3C;/p></span></span>
<span class="line"><span style="color:#9ECBFF">    &#x3C;/main></span></span>
<span class="line"><span style="color:#9ECBFF">  \`</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">  styles: </span><span style="color:#9ECBFF">\`</span></span>
<span class="line"><span style="color:#9ECBFF">    main {</span></span>
<span class="line"><span style="color:#9ECBFF">      height: 200px;</span></span>
<span class="line"><span style="color:#9ECBFF">      width: 400px;</span></span>
<span class="line"><span style="color:#9ECBFF">      border: 5px solid black;</span></span>
<span class="line"><span style="color:#9ECBFF">      text-align: center;</span></span>
<span class="line"><span style="color:#9ECBFF">    }</span></span>
<span class="line"><span style="color:#9ECBFF">  \`</span></span>
<span class="line"><span style="color:#E1E4E8">})</span></span>
<span class="line"><span style="color:#F97583">export</span><span style="color:#F97583"> class</span><span style="color:#B392F0"> ProductUniqueServiceForEachParentComponent</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#FFAB70">  globalService</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> inject</span><span style="color:#E1E4E8">(GlobalService);</span></span>
<span class="line"><span style="color:#FFAB70">  productService</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> inject</span><span style="color:#E1E4E8">(ProductService);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p>Our application confirms this is the case, because, while every component shares a single <code>GlobalService</code> instance, all of them has a unique instance of our <code>ProductService</code>:</p><p><img src="/images/angular-di-visualization/unique_service.png" alt="unique service for all components"></p><p>Notice, that the name of the global service is the same as it was in the last example, assuming you didn&#39;t reload the application, confirming, that this instance is truly global.</p><h3 id="lets-mix-things-up">Let&#39;s mix things up</h3>
<p>For our final example, we&#39;ll take a look at mixing things up. Our base component remains the same:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">@</span><span style="color:#B392F0">Component</span><span style="color:#E1E4E8">({</span></span>
<span class="line"><span style="color:#E1E4E8">  selector: </span><span style="color:#9ECBFF">'app-product-mixed'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">  imports: [ProductMixedDetailsComponent, ProductMixedParentComponent],</span></span>
<span class="line"><span style="color:#E1E4E8">  providers: [ProductService],</span></span>
<span class="line"><span style="color:#E1E4E8">  template: </span><span style="color:#9ECBFF">\`</span></span>
<span class="line"><span style="color:#9ECBFF">    &#x3C;main></span></span>
<span class="line"><span style="color:#9ECBFF">      &#x3C;h1>Product - Mixed&#x3C;/h1></span></span>
<span class="line"><span style="color:#9ECBFF">      &#x3C;p>{{ globalService.serviceName() }}&#x3C;/p></span></span>
<span class="line"><span style="color:#9ECBFF">      &#x3C;p>{{ productService.serviceName() }}&#x3C;/p></span></span>
<span class="line"><span style="color:#9ECBFF">      &#x3C;app-product-mixed-details /></span></span>
<span class="line"><span style="color:#9ECBFF">      &#x3C;app-product-mixed-parent /></span></span>
<span class="line"><span style="color:#9ECBFF">    &#x3C;/main></span></span>
<span class="line"><span style="color:#9ECBFF">  \`</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">  styles: </span><span style="color:#9ECBFF">\`</span></span>
<span class="line"><span style="color:#9ECBFF">    main {</span></span>
<span class="line"><span style="color:#9ECBFF">      height: 565px;</span></span>
<span class="line"><span style="color:#9ECBFF">      width: 405px;</span></span>
<span class="line"><span style="color:#9ECBFF">      border: 5px solid black;</span></span>
<span class="line"><span style="color:#9ECBFF">      text-align: center;</span></span>
<span class="line"><span style="color:#9ECBFF">    }</span></span>
<span class="line"><span style="color:#9ECBFF">  \`</span></span>
<span class="line"><span style="color:#E1E4E8">})</span></span>
<span class="line"><span style="color:#F97583">export</span><span style="color:#F97583"> default</span><span style="color:#F97583"> class</span><span style="color:#B392F0"> ProductMixedComponent</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#FFAB70">  globalService</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> inject</span><span style="color:#E1E4E8">(GlobalService);</span></span>
<span class="line"><span style="color:#FFAB70">  productService</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> inject</span><span style="color:#E1E4E8">(ProductService);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p><code>ProductMixedDetailsComponent</code> does not have its own providers, so it will share <code>ProductService</code> with the base component and it will receive the <code>GlobalService</code> instance all of our application is using.</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">@</span><span style="color:#B392F0">Component</span><span style="color:#E1E4E8">({</span></span>
<span class="line"><span style="color:#E1E4E8">  selector: </span><span style="color:#9ECBFF">'app-product-mixed-details'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">  template: </span><span style="color:#9ECBFF">\`</span></span>
<span class="line"><span style="color:#9ECBFF">    &#x3C;main></span></span>
<span class="line"><span style="color:#9ECBFF">      &#x3C;h1>Details&#x3C;/h1></span></span>
<span class="line"><span style="color:#9ECBFF">      &#x3C;p>{{ globalService.serviceName() }}&#x3C;/p></span></span>
<span class="line"><span style="color:#9ECBFF">      &#x3C;p>{{ productService.serviceName() }}&#x3C;/p></span></span>
<span class="line"><span style="color:#9ECBFF">    &#x3C;/main></span></span>
<span class="line"><span style="color:#9ECBFF">  \`</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">  styles: </span><span style="color:#9ECBFF">\`</span></span>
<span class="line"><span style="color:#9ECBFF">    main {</span></span>
<span class="line"><span style="color:#9ECBFF">      height: 200px;</span></span>
<span class="line"><span style="color:#9ECBFF">      width: 400px;</span></span>
<span class="line"><span style="color:#9ECBFF">      border: 5px solid black;</span></span>
<span class="line"><span style="color:#9ECBFF">      text-align: center;</span></span>
<span class="line"><span style="color:#9ECBFF">    }</span></span>
<span class="line"><span style="color:#9ECBFF">  \`</span></span>
<span class="line"><span style="color:#E1E4E8">})</span></span>
<span class="line"><span style="color:#F97583">export</span><span style="color:#F97583"> class</span><span style="color:#B392F0"> ProductMixedDetailsComponent</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#FFAB70">  globalService</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> inject</span><span style="color:#E1E4E8">(GlobalService);</span></span>
<span class="line"><span style="color:#FFAB70">  productService</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> inject</span><span style="color:#E1E4E8">(ProductService);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p><code>ProductMixedParentComponent</code> however, has both <code>ProductService</code> and <code>GlobalService</code> in its providers:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">@</span><span style="color:#B392F0">Component</span><span style="color:#E1E4E8">({</span></span>
<span class="line"><span style="color:#E1E4E8">  selector: </span><span style="color:#9ECBFF">'app-product-mixed-parent'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">  providers: [ProductService, GlobalService],</span></span>
<span class="line"><span style="color:#E1E4E8">  template: </span><span style="color:#9ECBFF">\`</span></span>
<span class="line"><span style="color:#9ECBFF">    &#x3C;main></span></span>
<span class="line"><span style="color:#9ECBFF">      &#x3C;h1>Parent&#x3C;/h1></span></span>
<span class="line"><span style="color:#9ECBFF">      &#x3C;p>{{ globalService.serviceName() }}&#x3C;/p></span></span>
<span class="line"><span style="color:#9ECBFF">      &#x3C;p>{{ productService.serviceName() }}&#x3C;/p></span></span>
<span class="line"><span style="color:#9ECBFF">    &#x3C;/main></span></span>
<span class="line"><span style="color:#9ECBFF">  \`</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">  styles: </span><span style="color:#9ECBFF">\`</span></span>
<span class="line"><span style="color:#9ECBFF">    main {</span></span>
<span class="line"><span style="color:#9ECBFF">      height: 200px;</span></span>
<span class="line"><span style="color:#9ECBFF">      width: 400px;</span></span>
<span class="line"><span style="color:#9ECBFF">      border: 5px solid black;</span></span>
<span class="line"><span style="color:#9ECBFF">      text-align: center;</span></span>
<span class="line"><span style="color:#9ECBFF">    }</span></span>
<span class="line"><span style="color:#9ECBFF">  \`</span></span>
<span class="line"><span style="color:#E1E4E8">})</span></span>
<span class="line"><span style="color:#F97583">export</span><span style="color:#F97583"> class</span><span style="color:#B392F0"> ProductMixedParentComponent</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#FFAB70">  globalService</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> inject</span><span style="color:#E1E4E8">(GlobalService);</span></span>
<span class="line"><span style="color:#FFAB70">  productService</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> inject</span><span style="color:#E1E4E8">(ProductService);</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p>This results in a mix of our previous approaches:</p><p><img src="/images/angular-di-visualization/mixed_service.png" alt="mixed approach"></p><p>As you can see, the base and the details component shares our services, but the parent component received a new instance of both <code>ProductService</code>, but more importantly, <code>GlobalService</code> too.</p>`;export{s as default};
