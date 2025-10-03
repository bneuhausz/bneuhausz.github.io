const s=`---
title: AMQP 1.0 Messaging in .NET with Apache Artemis - Part 2
slug: dotnet-activemq-artemis-part-2
description: In this edition, we'll take a look at sending messages to an address we set up in Artemis
date: 2025-10-01
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
lastMod: 2025-10-03
---

<h1 id="amqp-10-messaging-in-net-with-apache-artemis---part-2">AMQP 1.0 Messaging in .NET with Apache Artemis - Part 2</h1>
<blockquote>
<sub>
<b>Changelog:</b><br>
<b>2025-10-03:</b> Added link to part 3.<br>
</sub></blockquote>
<p>In <a href="https://bneuhausz.dev/blog/dotnet-activemq-artemis-part-1">part 1 of this series</a>, we&#39;ve created a dockerized Artemis instance and our starting .NET application. This time, we&#39;ll take a look at creating an address on the Artemis console and sending a message to it.</p><p><a href="https://github.com/bneuhausz/dotnet-amqp-messaging/tree/part-2">The source code for this article can be found here.</a></p><h2 id="creating-the-address">Creating the address</h2>
<p>First, make sure that your Artemis container is up and running, then navigate to <a href="http://localhost:8161">http://localhost:8161</a> to access the Artemis console. After logging in with the credentials we&#39;ve set up in our <code>docker-compose.yml</code> file, you should find yourself on the dashboard&#39;s Status tab. Right now, we are interested in the Addresses tab, so let&#39;s navigate there.</p><p><img src="/images/dotnet-artemis/part-2/create_address_1.avif" alt="addresses tab"></p><p>Once you&#39;re there, you&#39;ll see the list of the default addresses, but also, you&#39;ll see the Create Address button.</p><p><img src="/images/dotnet-artemis/part-2/create_address_2.avif" alt="create address"></p><p>If you click on it, the Create Address modal will pop up. For this demo, we&#39;ll add the demo-target name to our address and set it to Anycast, then click the Create Address button.</p><p><img src="/images/dotnet-artemis/part-2/create_address_3.avif" alt="create address modal"></p><p>Sadly, the Artemis console is not refreshing automatically, so you&#39;ll have to do that yourself to see our new address. After you did it, you should see something like this:</p><p><img src="/images/dotnet-artemis/part-2/create_address_4.avif" alt="create address"></p><p>As you can see, our demo-target address has been created and the Queue Count and Message Count values are 0. If you want to manually create a queue for this address, you can do so by clicking the three dots icon at the end of the row, but we&#39;ll let Artemis deal with that automatically for this simple demo. When we send our first message, a queue will be created for us.</p><h3 id="a-small-note-about-routing-type---anycast-vs-multicast">A small note about Routing Type - Anycast vs Multicast</h3>
<p>In ActiveMQ Artemis, an address is a logical destination where the messages are sent. When creating the address, you have to decide what routing type you want to use. The options are anycast and multicast.</p><p>A deep dive is out of scope here, but in short, anycast, or in other words, point-to-point, is basically a traditional queue. When a message arrives, the broker will distribute the message to a single consumer out of the available consumers. This effectively works as a load balancer.</p><p>On the other hand, multicast is a topic. When a message arrives to a multicast address, Artemis delivers that message to every single consumer. It basically follows the pub/sub model.</p><h2 id="sending-a-message">Sending a message</h2>
<p>It&#39;s time to set up our .net application to be able to send messages. First, let&#39;s create a new file, <code>AmqpSender.cs</code> with the following content:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#F97583">using</span><span style="color:#B392F0"> Amqp</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">namespace</span><span style="color:#B392F0"> dotnet_amqp_messaging</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">public</span><span style="color:#F97583"> class</span><span style="color:#B392F0"> AmqpSender</span></span>
<span class="line"><span style="color:#E1E4E8">{</span></span>
<span class="line"><span style="color:#F97583">    public</span><span style="color:#F97583"> async</span><span style="color:#B392F0"> Task</span><span style="color:#B392F0"> SendMessageAsync</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">string</span><span style="color:#B392F0"> messageBody</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">    {</span></span>
<span class="line"><span style="color:#B392F0">        Connection</span><span style="color:#E1E4E8">? </span><span style="color:#B392F0">connection</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> null</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">        try</span></span>
<span class="line"><span style="color:#E1E4E8">        {</span></span>
<span class="line"><span style="color:#B392F0">            Address</span><span style="color:#B392F0"> address</span><span style="color:#F97583"> =</span><span style="color:#F97583"> new</span><span style="color:#B392F0"> Address</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"localhost"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">5672</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"admin"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"admin"</span><span style="color:#E1E4E8">, </span><span style="color:#B392F0">scheme</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"amqp"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">            connection </span><span style="color:#F97583">=</span><span style="color:#F97583"> await</span><span style="color:#E1E4E8"> Connection.Factory.</span><span style="color:#B392F0">CreateAsync</span><span style="color:#E1E4E8">(address);</span></span>
<span class="line"><span style="color:#F97583">            var</span><span style="color:#B392F0"> session</span><span style="color:#F97583"> =</span><span style="color:#F97583"> new</span><span style="color:#B392F0"> Session</span><span style="color:#E1E4E8">(connection);</span></span>
<span class="line"><span style="color:#F97583">            var</span><span style="color:#B392F0"> sender</span><span style="color:#F97583"> =</span><span style="color:#F97583"> new</span><span style="color:#B392F0"> SenderLink</span><span style="color:#E1E4E8">(session, </span><span style="color:#9ECBFF">"demo-sender"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"demo-target"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">            var</span><span style="color:#B392F0"> message</span><span style="color:#F97583"> =</span><span style="color:#F97583"> new</span><span style="color:#B392F0"> Message</span><span style="color:#E1E4E8">(messageBody);</span></span>
<span class="line"><span style="color:#F97583">            await</span><span style="color:#E1E4E8"> sender.</span><span style="color:#B392F0">SendAsync</span><span style="color:#E1E4E8">(message);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">            Console.</span><span style="color:#B392F0">WriteLine</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Message sent to AMQP topic"</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">            await</span><span style="color:#E1E4E8"> sender.</span><span style="color:#B392F0">CloseAsync</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#F97583">            await</span><span style="color:#E1E4E8"> session.</span><span style="color:#B392F0">CloseAsync</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#F97583">        catch</span><span style="color:#E1E4E8"> (</span><span style="color:#B392F0">Exception</span><span style="color:#B392F0"> ex</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">        {</span></span>
<span class="line"><span style="color:#E1E4E8">            Console.</span><span style="color:#B392F0">WriteLine</span><span style="color:#E1E4E8">(ex.Message);</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#F97583">        finally</span></span>
<span class="line"><span style="color:#E1E4E8">        {</span></span>
<span class="line"><span style="color:#F97583">            if</span><span style="color:#E1E4E8"> (connection </span><span style="color:#F97583">!=</span><span style="color:#79B8FF"> null</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">            {</span></span>
<span class="line"><span style="color:#F97583">                await</span><span style="color:#E1E4E8"> connection.</span><span style="color:#B392F0">CloseAsync</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">            }</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p>Make sure the <code>using Amqp</code> statement is present, so you can access the <a href="https://www.nuget.org/packages/AMQPNetLite.Core/">AMQPNetLite.Core package</a>, that we&#39;ve already installed.</p><p>Our method accepts a single <code>string</code> parameter, that will be the content of the message we want to send. We create an <code>Address</code> instance with the necessary information for the Artemis connection. Obviously, you should not handle your config, especially your secrets, like we do it here, but proper configuration is not our scope in this series.</p><p>Then, we use <code>Connection.Factory.CreateAsync</code> with our address passed to it to create our <code>Connection</code> instance. After that, we can create a <code>Session</code> instance, which our connection is supplied to. The last piece of the plumbing work is creating a <code>SenderLink</code>, which receives our session, a unique name for the link, and lastly, the target address.</p><p>It is very important that the target address we pass to <code>new SenderLink()</code> matches the name of the address we&#39;ve created in Artemis.</p><p>With these done, all we have left to do is creating a <code>Message</code> instance, call <code>SendAsync</code> and close our connection.</p><p>This is all of the logic we need to send messages, so let&#39;s use it. Replace the contents of <code>Program.cs</code> with this:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#F97583">using</span><span style="color:#B392F0"> dotnet_amqp_messaging</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">var</span><span style="color:#B392F0"> sender</span><span style="color:#F97583"> =</span><span style="color:#F97583"> new</span><span style="color:#B392F0"> AmqpSender</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#F97583">await</span><span style="color:#E1E4E8"> sender.</span><span style="color:#B392F0">SendMessageAsync</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"demo message"</span><span style="color:#E1E4E8">);</span></span></code></pre>
<p>Now we are ready to run our application. If we&#39;ve done everything correctly, after running our program, the output should be something like this:</p><p><img src="/images/dotnet-artemis/part-2/program_output.avif" alt="output"></p><p>After the program has executed successfully and we check the Addresses tab, the automatic queue for our address should be created and Message Count should be 1 too.</p><p><img src="/images/dotnet-artemis/part-2/message_sent_1.avif" alt="address message count increased"></p><p>If we navigate to the Queues tab, we should see the demo-target queue with a Message Count of 1.</p><p><img src="/images/dotnet-artemis/part-2/message_sent_2.avif" alt="queue created"></p><p>Clicking the name of the queue lets us checking what&#39;s inside:</p><p><img src="/images/dotnet-artemis/part-2/message_sent_3.avif" alt="browse queue contents"></p><p>Now let&#39;s click on the Message ID to see the message content:</p><p><img src="/images/dotnet-artemis/part-2/message_sent_4.avif" alt="message content"></p><p>And we&#39;re done! Our AmqpSender is fully functional. Next time we&#39;ll take a look at receiving messages sent by Artemis.</p><p><a href="https://bneuhausz.dev/blog/dotnet-activemq-artemis-part-3">Part 3, covering actually receiving messages from Artemis is out. Take a look!</a></p>`;export{s as default};
