---
title: Distributed apps with Aspire - The basics
slug: aspire-intro-1
description: Let's take a look at developing distributed applications with Aspire
date: 2026-05-29
coverImage: /images/aspire/aspire-logo-light-horizontal.svg
coverImageMedium: /images/aspire/aspire-logo-light-horizontal.svg
coverImageSmall: /images/aspire/aspire-logo-light-horizontal.svg
coverImageDescription: aspire logo
metaImage: https://bneuhausz.dev/images/bneuhausz_dev_twitter.png
metaImageDescription: bneuhausz.dev site logo
thumbnail: /images/aspire/aspire-icon-256.svg
thumbnailDescription: aspire logo
icon: /images/aspire/aspire-icon-32.svg
iconDescription: aspire logo
tags: [Aspire, dotnet]
shadowColor: aspire
draft: false
lastMod: 2026-05-30
---

# Distributed apps with Aspire - The basics

## The why

In the past, I've mostly worked on fairly basic applications. Meaning, a database and either a single app (be it desktop or web tech) or more recently, a (kinda) REST API and a client application running in browsers. Since these were fairly simple apps, at least architecturally, developing them locally was also pretty simple. Spin up a DB in Docker (or just connect to a dedicated dev server), hit Start in Visual Studio*, run `npm start` in a terminal and you're up and running. Nowadays, however, this doesn't really cut it.

> <sub>
  > <b>* We're doing all kinds of different things nowadays, but my group originated as a .NET focused team within the org. Also, most of our clients are deep into the Microsoft ecosystem, so you'll likely see me mentioning stuff like VS or IIS.</b><br>
> </sub>

Gone are the days of just enabling Windows Authentication on IIS and letting the browser (and some poor Active Directory admin) handle authentication, orgs want you to use their self-hosted Keycloak now. Your applications are expected to be part of a Kubernetes cluster, running in multiple instances, but with a shared cache, so you need something like Redis. Hell, your original API became several separate APIs now and those sit behind a reverse proxy like YARP. You're expected to serve your logs in a specific format since the ELK stack, or at least Seq, has become a staple in everyone's stack.

Developing an app like this locally can lead to a lot of tinkering in Dockerfiles and let's be honest, lots of devs absolutely hate that. That's where [Aspire](https://aspire.dev/), formerly .NET Aspire, comes into the picture.

## What is Aspire?

Aspire is a framework for developing distributed applications. Instead of managing a collection of Dockerfiles, docker-compose files and scattered environment variables, Aspire lets you wire up your entire application stack in code. It is up to you if you write it in C# or TypeScript, as both are supported. In these articles, I'll stick to C# and the .NET ecosystem.

At its core, Aspire has four main building blocks: the **AppHost**, **ServiceDefaults**, the **Developer Dashboard**, and **Integrations**. Let's walk through each of these.

## The AppHost

The [AppHost](https://aspire.dev/get-started/app-host/?lang=csharp) is where you orchestrate everything. It's just a regular .NET project ([or TypeScript](https://aspire.dev/app-host/typescript-apphost/)) where you describe your entire stack in code: which services run, how they connect to each other, and which external resources (like databases, caches or message brokers) they depend on. When you hit Start, the AppHost spins everything up.

The big win here is that service discovery and connection string management are handled for you. You define a PostgreSQL database resource, reference it from your API project, and Aspire injects the right connection string automatically. No more copying strings between appsettings files or maintaining a local .env that's somehow always out of sync with everyone else's.

```csharp
var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder.AddPostgres("db")
    .WithDataVolume()
    .WithPgWeb();

var appdataDb = postgres.AddDatabase("appdataDb");

var api = builder.AddProject<Projects.Api>("api")
    .WithReference(appdataDb)
    .WaitFor(appdataDb);

builder.Build().Run();
```

The example above is fairly minimalistic, yet more or less complete example of a development environment. We'll cover what this actually does in later articles, but for now, I'd say this is enough to demonstrate how simple Aspire makes things.

## ServiceDefaults

The ServiceDefaults project is a shared class library that gets pulled into each of your services. It handles the boring but important stuff: OpenTelemetry for distributed tracing and metrics, health checks, service discovery configuration. These are things you'd wire up manually eventually anyway, Aspire just does it upfront so you're not copy-pasting boilerplate across every microservice.

## The Dashboard

Honestly, the Developer Dashboard alone might make it worthwhile to use Aspire. When you run your AppHost, a dashboard spins up locally and gives you a live view of your whole application out of the box. Structured logs, distributed traces, metrics... all in one place. If a request hops through three services before failing, you can follow the trace through all of them without touching a log file. This is a genuine quality of life improvement if you ever had to mess with the log files of many different services to track what went wrong.

## Integrations

Aspire comes with a growing library of integrations. Microsoft provides NuGet packages for common infrastructure like Redis, PostgreSQL, RabbitMQ, Azure Service Bus, Kafka, Keycloak (in preview as of the time of writing this) and a lot more, but there are integrations created by the community too (like Mailpit or LavinMQ for example) that are marked as part of the **Community Toolkit**.

![Community Toolkit](/images/aspire/intro-1/community-toolkit.avif)

Integrations have two types. **Hosting integrations** go in the AppHost and tell Aspire how to provision and configure a resource (usually in a Docker container). **Client integrations** go in your individual services and set up the relevant client library with the correct configuration, automatically plumbed in from the AppHost. The two sides work together: you define a resource once, reference it from the services that need it, and the connection details flow through without any extra work.

What that translates to in practice is that you do not have to mess with connection strings and networking. Aspire injects the necessary info when it spins up the containers.

Connecting to the Postgres database in the AppHost example above only takes a single line (after installing the client integration package and creating the DbContext, more on that in later articles) in your application(s) `Program.cs`.

```csharp
builder.AddNpgsqlDbContext<AppdataDbContext>("appdataDb");
```

## What Aspire is not

A couple of things worth clearing up before we dive deeper. Aspire is **not** a deployment platform or a Kubernetes replacement. It's a local development and application integration framework. It makes local development much less painful and gives you a solid observability foundation from day one, but you still deploy to whatever infrastructure you were using before. Aspire does generate a deployment manifest that tools like the Azure Developer CLI can use, but that's a topic for another time.

It's also **not** something you have to adopt all at once. You can introduce Aspire into an existing solution incrementally, starting with just the AppHost and wiring in integrations as you go. 

In the following articles, we'll start developing a distributed application to explore what Aspire brings to the table.

[Read Distributed apps with Aspire - Creating a new Aspire app here.](https://bneuhausz.dev/blog/aspire-intro-2/)