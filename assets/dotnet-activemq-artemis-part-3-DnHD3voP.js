const s=`---
title: AMQP 1.0 Messaging in .NET with Apache Artemis - Part 3
slug: dotnet-activemq-artemis-part-3
description: In today's post, we'll take a look at receiving messages sent by Artemis
date: 2025-10-03
coverImage: /images/activemq/activemq-2.svg
coverImageMedium: /images/activemq/activemq-2.svg
coverImageSmall: /images/activemq/activemq-2.svg
coverImageDescription: apache activemq artemis logo
metaImage: https://bneuhausz.dev/images/bneuhausz_dev_twitter.png
metaImageDescription: bneuhausz.dev site logo
thumbnail: /images/dotnet/dotnet-logo.svg
thumbnailDescription: dotnet logo
icon: /images/dotnet/dotnet-logo.svg
iconDescription: dotnet logo
tags: [dotnet, AMQP, ActiveMQ, Artemis]
shadowColor: dotnet
draft: false
---

<h1 id="amqp-10-messaging-in-net-with-apache-artemis---part-3">AMQP 1.0 Messaging in .NET with Apache Artemis - Part 3</h1>
<p>In <a href="https://bneuhausz.dev/blog/dotnet-activemq-artemis-part-1">part 1 of this series</a>, we&#39;ve created a dockerized Artemis instance and our starting .NET application.</p><p>In <a href="https://bneuhausz.dev/blog/dotnet-activemq-artemis-part-2">part 2</a>, we&#39;ve configured an Address on Artemis and created our <code>AmqpSender</code>.</p><p>This time, we&#39;ll take a look at receiving messages from Artemis.</p><p><a href="https://github.com/bneuhausz/dotnet-amqp-messaging/tree/part-3">The source code for this article can be found here.</a></p><h2 id="lets-create-our-receiver">Let&#39;s create our receiver</h2>
<p>Our first step is creating <code>AmqpReceiver.cs</code> with the following content:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#F97583">using</span><span style="color:#B392F0"> Amqp</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">namespace</span><span style="color:#B392F0"> dotnet_amqp_messaging</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">public</span><span style="color:#F97583"> class</span><span style="color:#B392F0"> AmqpReceiver</span></span>
<span class="line"><span style="color:#E1E4E8">{</span></span>
<span class="line"><span style="color:#F97583">    public</span><span style="color:#F97583"> async</span><span style="color:#B392F0"> Task</span><span style="color:#B392F0"> StartListeningAsync</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">CancellationToken</span><span style="color:#B392F0"> cancellationToken</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">    {</span></span>
<span class="line"><span style="color:#F97583">        var</span><span style="color:#B392F0"> brokerUrl</span><span style="color:#F97583"> =</span><span style="color:#9ECBFF"> "amqp://admin:admin@localhost:5672"</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">        var</span><span style="color:#B392F0"> addressName</span><span style="color:#F97583"> =</span><span style="color:#9ECBFF"> "demo-target"</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">        Connection</span><span style="color:#E1E4E8">? </span><span style="color:#B392F0">connection</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> null</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">        try</span></span>
<span class="line"><span style="color:#E1E4E8">        {</span></span>
<span class="line"><span style="color:#E1E4E8">            connection </span><span style="color:#F97583">=</span><span style="color:#F97583"> await</span><span style="color:#E1E4E8"> Connection.Factory.</span><span style="color:#B392F0">CreateAsync</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">new</span><span style="color:#B392F0"> Address</span><span style="color:#E1E4E8">(brokerUrl));</span></span>
<span class="line"><span style="color:#F97583">            var</span><span style="color:#B392F0"> session</span><span style="color:#F97583"> =</span><span style="color:#F97583"> new</span><span style="color:#B392F0"> Session</span><span style="color:#E1E4E8">(connection);</span></span>
<span class="line"><span style="color:#F97583">            var</span><span style="color:#B392F0"> receiver</span><span style="color:#F97583"> =</span><span style="color:#F97583"> new</span><span style="color:#B392F0"> ReceiverLink</span><span style="color:#E1E4E8">(session, </span><span style="color:#9ECBFF">"demo-receiver"</span><span style="color:#E1E4E8">, addressName);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">            Console.</span><span style="color:#B392F0">WriteLine</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">$"Receiver attached to address '{</span><span style="color:#E1E4E8">addressName</span><span style="color:#9ECBFF">}'. Waiting for messages..."</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">            while</span><span style="color:#E1E4E8"> (</span><span style="color:#F97583">!</span><span style="color:#E1E4E8">cancellationToken.IsCancellationRequested)</span></span>
<span class="line"><span style="color:#E1E4E8">            {</span></span>
<span class="line"><span style="color:#F97583">                var</span><span style="color:#B392F0"> message</span><span style="color:#F97583"> =</span><span style="color:#F97583"> await</span><span style="color:#E1E4E8"> receiver.</span><span style="color:#B392F0">ReceiveAsync</span><span style="color:#E1E4E8">(TimeSpan.</span><span style="color:#B392F0">FromSeconds</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">                if</span><span style="color:#E1E4E8"> (message </span><span style="color:#F97583">!=</span><span style="color:#79B8FF"> null</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">                {</span></span>
<span class="line"><span style="color:#E1E4E8">                    Console.</span><span style="color:#B392F0">WriteLine</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">$"Received Message: '{</span><span style="color:#E1E4E8">message</span><span style="color:#9ECBFF">.</span><span style="color:#E1E4E8">Body</span><span style="color:#9ECBFF">}'"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">                    receiver.</span><span style="color:#B392F0">Accept</span><span style="color:#E1E4E8">(message);</span></span>
<span class="line"><span style="color:#E1E4E8">                }</span></span>
<span class="line"><span style="color:#E1E4E8">            }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">            await</span><span style="color:#E1E4E8"> receiver.</span><span style="color:#B392F0">CloseAsync</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#F97583">            await</span><span style="color:#E1E4E8"> session.</span><span style="color:#B392F0">CloseAsync</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#F97583">        catch</span><span style="color:#E1E4E8"> (</span><span style="color:#B392F0">Exception</span><span style="color:#B392F0"> ex</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">        {</span></span>
<span class="line"><span style="color:#E1E4E8">            Console.</span><span style="color:#B392F0">WriteLine</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">$"Error: {</span><span style="color:#E1E4E8">ex</span><span style="color:#9ECBFF">.</span><span style="color:#E1E4E8">Message</span><span style="color:#9ECBFF">}"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#F97583">        finally</span></span>
<span class="line"><span style="color:#E1E4E8">        {</span></span>
<span class="line"><span style="color:#F97583">            if</span><span style="color:#E1E4E8"> (connection </span><span style="color:#F97583">!=</span><span style="color:#79B8FF"> null</span><span style="color:#F97583"> &#x26;&#x26;</span><span style="color:#F97583"> !</span><span style="color:#E1E4E8">connection.IsClosed)</span></span>
<span class="line"><span style="color:#E1E4E8">            {</span></span>
<span class="line"><span style="color:#F97583">                await</span><span style="color:#E1E4E8"> connection.</span><span style="color:#B392F0">CloseAsync</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">                Console.</span><span style="color:#B392F0">WriteLine</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Connection closed."</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">            }</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p>This time, we&#39;ve opted to supply the broker&#39;s URL as a string to our <code>Address</code>, but the basic concepts are the same as before, when creating <code>AmqpSender</code>. The only difference in the basic setup is that this time, instead of creating a <code>SenderLink</code>, we need to create a <code>ReceiverLink</code>.</p><p>Obviously, in a production app, you don&#39;t want to hard code your URLs and credentials like this, but as I mentioned before, proper config and secret handling is not the point here.</p><p>With our connection being set up, we utilize a <code>while</code> loop and a <code>CancellationToken</code> to keep our application running. We&#39;ve opted for a very simple console app with no other responsibilities for demo purposes, but in a prod system, you&#39;d likely set your app up as some kind of a background service. For this brief demonstration, this is fine.</p><p>Inside the loop, we call <code>ReceiveAsync</code> on our receiver instance and pass <code>TimeSpan.FromSeconds(1)</code> to it. This is important for our setup. This way, the loop waits for a message or 1 second to pass, then it continues. We could technically pass <code>TimeSpan.MaxValue</code> or <code>Timeout.InfiniteTimeSpan</code> and make our code wait infinitely, but that would break our cancellation logic, because it could only check if the token was cancelled after a message was received.</p><p>When the cancellation arrives from outside, we just have to close our receiver, session and connection, just like we did with <code>AmqpSender</code>.</p><p>I want to note that this time, we&#39;ve set up a receiver on the same <code>Address</code> we are sending messages to, so <code>demo-target</code>. This is just to make our life easier for this demo, but generally, even if you have a use case where you both send/receive messages to/from a message broker, you&#39;d likely receive messages from a different address than the one you&#39;re sending messages to.</p><h2 id="time-to-listen">Time to listen</h2>
<p>To start our receiver, we have to change <code>Program.cs</code> to reflect the following:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#F97583">using</span><span style="color:#B392F0"> dotnet_amqp_messaging</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">Console.</span><span style="color:#B392F0">WriteLine</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Demo started. Press Ctrl+C to exit."</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">var</span><span style="color:#B392F0"> sender</span><span style="color:#F97583"> =</span><span style="color:#F97583"> new</span><span style="color:#B392F0"> AmqpSender</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#F97583">await</span><span style="color:#E1E4E8"> sender.</span><span style="color:#B392F0">SendMessageAsync</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"demo message"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">var</span><span style="color:#B392F0"> cts</span><span style="color:#F97583"> =</span><span style="color:#F97583"> new</span><span style="color:#B392F0"> CancellationTokenSource</span><span style="color:#E1E4E8">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">Console.CancelKeyPress </span><span style="color:#F97583">+=</span><span style="color:#E1E4E8"> (</span><span style="color:#B392F0">sender</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">eventArgs</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">=></span></span>
<span class="line"><span style="color:#E1E4E8">{</span></span>
<span class="line"><span style="color:#E1E4E8">    eventArgs.Cancel </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> true</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">    cts.</span><span style="color:#B392F0">Cancel</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">    Console.</span><span style="color:#B392F0">WriteLine</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Shutting down..."</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">var</span><span style="color:#B392F0"> receiver</span><span style="color:#F97583"> =</span><span style="color:#F97583"> new</span><span style="color:#B392F0"> AmqpReceiver</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#F97583">await</span><span style="color:#E1E4E8"> receiver.</span><span style="color:#B392F0">StartListeningAsync</span><span style="color:#E1E4E8">(cts.Token);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">Console.</span><span style="color:#B392F0">WriteLine</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Application has shut down."</span><span style="color:#E1E4E8">);</span></span></code></pre>
<p>We still have the message sending logic like before, but we create a <code>CancellationTokenSource</code> and add an event handler to the <code>Console</code>&#39;s <code>CancelKeyPress</code> event, which calls the <code>Cancel()</code> method on our token source. This way, when we want to cancel, we just have to press Ctrl+C (on Windows) and our app stops gracefully, after every connection has been closed. Until we trigger <code>CancelKeyPress</code>, our app will keep listening to messages.</p><p>After setting this cancel functionality up, all we have to do left is instantiate an <code>AmqpReceiver</code> and call <code>StartListeningAsync</code> with the <code>CancallationToken</code> being passed to it.</p><p>These are all the changes we had to make to our code, so let&#39;s test it!</p><h2 id="running-the-app">Running the app</h2>
<p>As always, make sure the Artemis container is running and the <code>demo-target</code> address has been set up. If you&#39;ve done everything like I did in <a href="https://bneuhausz.dev/blog/dotnet-activemq-artemis-part-1">part 1</a>, you just have to run <code>docker compose up</code> in the folder that contains our <code>docker-compose.yml</code> file.</p><p>With this out of the way, let&#39;s start our application! If we haven&#39;t done any mistakes, this should be the output:</p><p><img src="/images/dotnet-artemis/part-3/1-application-started.avif" alt="app running"></p><p>As you can see, on startup, the demo message has been sent to Artemis, then our application subscribed to the queue and instantly received the message. If you started the app for the first time, you might&#39;ve received multiple messages, because the queue had no consumers until now, so every message you might&#39;ve sent while testing our program while following <a href="https://bneuhausz.dev/blog/dotnet-activemq-artemis-part-2">part 2</a> was sitting right there. Given, that you&#39;ve set up Artemis with some kind of persistent storage, like the volume in our <code>docker-compose.yml</code>.</p><p>To further prove that we are receiving the messages, let&#39;s go to the Artemis console at <a href="http://localhost:8161">http://localhost:8161</a>, click the Addresses tab, then the three dots icon in the row of demo-target. You should see a Send Message option, which opens a pop-up window. Keep our app running though!</p><p><img src="/images/dotnet-artemis/part-3/2-send-message-manually-1.avif" alt="addresses tab"></p><p>There are some options you can play around with in that window, but for sending a message with an empty string as the body, just click the Send button.</p><p><img src="/images/dotnet-artemis/part-3/3-send-message-manually-2.avif" alt="send message pop-up"></p><p>After clicking Send, you should see something like this as our app&#39;s output:</p><p><img src="/images/dotnet-artemis/part-3/4-message-received.avif" alt="message received"></p><h2 id="conclusion">Conclusion</h2>
<p>With this post, this series is likely over, but as you can see, setting up AMQP in .net is really easy, both on the sending and receiving end. I hope it was helpful for someone out there!</p>`;export{s as default};
