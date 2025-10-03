const e=`---
title: AMQP 1.0 Messaging in .NET with Apache Artemis - Part 1
slug: dotnet-activemq-artemis-part-1
description: In this series, we will look at implementing AMQP 1.0 in .NET with Apache ActiveMQ Artemis.
date: 2025-09-27
coverImage: /images/activemq/activemq-2.svg
coverImageMedium: /images/activemq/activemq-2.svg
coverImageSmall: /images/activemq/activemq-2.svg
coverImageDescription: apache activemq artemis logo
metaImage: https://bneuhausz.dev/images/bneuhausz_dev_twitter.png
metaImageDescription: bneuhausz.dev site logo
thumbnail: /images/activemq/activemq-3.svg
thumbnailDescription: apache activemq artemis logo
icon: /images/activemq/activemq-3.svg
iconDescription: apache activemq artemis logo
tags: [dotnet, AMQP, ActiveMQ, Artemis]
shadowColor: dotnet
draft: false
lastMod: 2025-10-01
---

<h1 id="amqp-10-messaging-in-net-with-apache-artemis---part-1">AMQP 1.0 Messaging in .NET with Apache Artemis - Part 1</h1>
<blockquote>
<sub>
<b>Changelog:</b><br>
<b>2025-10-01:</b> Added link to part 2.<br>
</sub></blockquote>
<p>In this series, we will look at using AMQP 1.0 in .NET. We will use a dockerized instance of Apache&#39;s ActiveMQ Artemis as our message broker. We&#39;ll briefly discuss AMQP 1.0, but a deep dive is beyond the scope of this article. In this first post, we will look at setting up Artemis and creating our .NET application.</p><h2 id="what-is-amqp-10">What is AMQP 1.0?</h2>
<p>Advanced Message Queuing Protocol (AMQP) 1.0 is one of the most flexible and powerful messaging protocols out there- It aims to make interapplication communication reliable, regardless of the technology used to create them. Think along the lines of connecting microservices, procssing IoT data streams or ensuring financial transactions are never lost. At its core, this protocol defines how clients can connect to and communicate with a message broker.</p><p><a href="https://www.oasis-open.org/committees/tc_home.php?wg_abbrev=amqp">If you want to dive deep into AMQP itself, here&#39;s the specification.</a></p><h2 id="how-does-artemis-come-into-the-picture">How does Artemis come into the picture?</h2>
<p>Apache&#39;s ActiveMQ Artemis is an open-source, high-performance message broker that fluently speaks AMQP 1.0, among other protocols like MQTT. Our .NET application will use the AMQP 1.0 protocol to send messages to Artemis, and Artemis is responsible for distributing those messages to one or more receivers. We&#39;ll later look at using both queues and topics, but for now, think of Artemis as the middleman that receives and distributes our messages. Think of it like a post office.</p><h2 id="setting-up-our-artemis-instance-with-the-help-of-docker">Setting up our Artemis instance with the help of Docker</h2>
<p><a href="https://hub.docker.com/r/apache/activemq-artemis">The official Artemis image, maintained by The Apache Software Foundation, can be found on Docker Hub.</a> We&#39;ll use this image for our local instance. Let&#39;s set up our <code>docker-compose.yml</code> file:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#85E89D">services</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#85E89D">  artemis</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#85E89D">    image</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">apache/activemq-artemis:latest-alpine</span></span>
<span class="line"><span style="color:#85E89D">    container_name</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">artemis</span></span>
<span class="line"><span style="color:#85E89D">    ports</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#E1E4E8">      - </span><span style="color:#9ECBFF">"8161:8161"</span></span>
<span class="line"><span style="color:#E1E4E8">      - </span><span style="color:#9ECBFF">"5672:5672"</span></span>
<span class="line"><span style="color:#85E89D">    environment</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#E1E4E8">      - </span><span style="color:#9ECBFF">ARTEMIS_USER=admin</span></span>
<span class="line"><span style="color:#E1E4E8">      - </span><span style="color:#9ECBFF">ARTEMIS_PASSWORD=admin</span></span>
<span class="line"><span style="color:#85E89D">    volumes</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#E1E4E8">      - </span><span style="color:#9ECBFF">dotnet-artemis:/var/lib/artemis-instance</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D">volumes</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#85E89D">  dotnet-artemis</span><span style="color:#E1E4E8">:</span></span></code></pre>
<p>This is fairly straightforward, but let&#39;s run through the important parts. We use <code>apache/activemq-artemis:latest-alpine</code> as our base image and set <code>artemis</code> as the name ouf our container, which is totally optional.</p><p>We expose ports <code>8161</code> abd <code>5672</code> available. After starting our container, the Artemis Console will be available at the <a href="http://localhost:8161">http://localhost:8161</a>, and <code>5672</code> is the default AMQP port, which we will also need to access.</p><p>Then we set up a user with the username and password of <code>admin</code>. It goes without saying that you should not do this in a production environment.</p><p>As a last step, we set up a named volume to make our data persistent.</p><p>If you open a terminal in the folder that containes this <code>docker-compose.yml</code> file, you just have to run</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#B392F0">docker</span><span style="color:#9ECBFF"> compose</span><span style="color:#9ECBFF"> up</span></span></code></pre>
<p>whenever you want to start our Artemis instance and</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#B392F0">docker</span><span style="color:#9ECBFF"> compose</span><span style="color:#9ECBFF"> down</span></span></code></pre>
<p>whenever you want to stop it.</p><p>If you&#39;ve done it right, you should see something like this when you navigate to <a href="http://localhost:8161">http://localhost:8161</a></p><p><img src="/images/dotnet-artemis/part-1/artemis-console.avif" alt="Artemis Console login page"></p><h2 id="setting-up-our-net-app">Setting up our .NET app</h2>
<p>For this demo, let&#39;s just create a basic console application. In this demo, I&#39;ll use .NET 8 and Visual Studio 2022.</p><p><img src="/images/dotnet-artemis/part-1/create-console-app.avif" alt="Creating a console app in Visual Studio 2022"></p><p>Our starting code is this simple line:</p><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">Console.</span><span style="color:#B392F0">WriteLine</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Hello, World!"</span><span style="color:#E1E4E8">);</span></span></code></pre>
<p>In the following articles, we&#39;ll talk a lot more about the .NET application itself, but in this first part, we&#39;ll leave it as it is.</p><h2 id="enabling-amqp-10-communication">Enabling AMQP 1.0 communication</h2>
<p>The last thing I want to cover in this article is installing the <a href="https://www.nuget.org/packages/AMQPNetLite.Core/">AMQPNetLite.Core package</a>. This package is maintained by the Microsoft Azure team and it includes both a client and a listener, so it enables both peer to peer and broker based messaging. We&#39;ll utilize this package to both send/receive messages to/from Artemis, so let&#39;s add it through NuGet:</p><p><img src="/images/dotnet-artemis/part-1/installing-amqpnetlite-core.avif" alt="Installing AMQPNetLite.Core"></p><p>With this, the basic building blocks are in place, so I&#39;ll end this article here. In the following posts, we&#39;ll start talking about more practical things, like setting up our queues/topics and sending messages to them, so stay tuned!</p><p><a href="https://github.com/bneuhausz/dotnet-amqp-messaging/tree/part-1">The source code for this article can be found here.</a></p><p><a href="https://bneuhausz.dev/blog/dotnet-activemq-artemis-part-2">Part 2, covering actually sending a message to Artemis is out. Take a look!</a></p>`;export{e as default};
