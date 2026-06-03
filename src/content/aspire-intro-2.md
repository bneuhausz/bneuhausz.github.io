---
title: Distributed apps with Aspire - Creating a new Aspire app
slug: aspire-intro-2
description: In this article, we'll start developing our distributed app
date: 2026-05-30
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
lastMod: 2026-06-03
---

# Distributed apps with Aspire - Creating a new Aspire app

If you're new here, make sure to check out the [previous article of this series.](https://bneuhausz.dev/blog/aspire-intro-1/)

## Prerequisites

There are a few things you'll need to install before getting started with Aspire. The docs have a pretty good write-up of the [prerequisites](https://aspire.dev/get-started/prerequisites/), but we'll quickly go over them here.

### Language

First, you'll need to decide between creating a C# or a TypeScript AppHost. In this series, we'll stick with C#, so in our case, the [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0) will be needed. Aspire is able to run applications targeting .NET 8 or later, but .NET 10 is a strict requirement for the C# AppHost itself.

### Container runtime

Then, you have to install an [Open Container Initiative (OCI)](https://opencontainers.org/) container runtime. The recommended default is Docker Desktop, but Podman is also officially supported, with Rancher Desktop having community support too.

### IDE

Now you have to choose an IDE to use. In case you chose to go with a TypeScript AppHost, Visual Studio Code is the recommended path to take. On the C# route however, Visual Studio and Rider are also great options.
Since I'm a regular user of Visual Studio 2026, I'll stick to it this time too, but feel free to explore the other options.

### Aspire CLI

In case you chose Visual Studio to develop, you can do most things in the IDE itself. However, the [Aspire CLI](https://aspire.dev/get-started/install-cli/) is a great tool to have and it is a requirement for the VSC extension in case you picked that option, so make sure to install the CLI.

In Bash, you can just run:

```bash
curl -sSL https://aspire.dev/install.sh | bash
```

or in PowerShell:

```powershell
irm https://aspire.dev/install.ps1 | iex
```

If you decided to go that route, installing the CLI can also be done via the [VSC Aspire extension](https://aspire.dev/get-started/aspire-vscode-extension/) itself with `Aspire: New Aspire project` from the Command Palette. In this case, it is also recommended to install the [official C# extension](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp) for language support.

You can validate the installation by running:

```bash
aspire --version
```

![Aspire CLI version](/images/aspire/intro-2/aspire-version.avif)

At the time of writing this article, I use version 13.3.5.

## Creating a project

Since I decided to go with Visual Studio, I'll just use that to create a project, but you can do the same thing with the CLI by running the `aspire new` command or using the `Aspire: New Aspire project` command provided by the VSC extension.

Either way, in Visual Studio, just create a new project, filter for Aspire and there will be several types of templates you can choose from. We'll choose the empty app now and we'll build on it ourselves.

![Aspire templates in Visual Studio 2026](/images/aspire/intro-2/aspire-projects.avif)

In the next window, give a name to your solution and select a location. I picked the name `AspireIntro` here.

![Next step](/images/aspire/intro-2/aspire-create-1.avif)

In the last step, we'll leave the .NET version on 10 and the Aspire version on 13, but I'll unclick the `Configure for HTTPS` option for several reasons. For one, we'll likely put our services behind a reverse proxy later, and two, HTTPS is not in the scope of this walkthrough anyway.

![Last step](/images/aspire/intro-2/aspire-create-2.avif)

If you followed what I've been doing, then your new solution probably looks like this now:

![Created solution](/images/aspire/intro-2/aspire-solution.avif)

## A bit of housekeeping

As you can see, the **ServiceDefaults** project has some warnings, so first we'll take care of those. It's due to some of the default OpenTelemetry packages having vulnerabilities at the time of creating the project, but those are patched already, so you can just right-click the **ServiceDefaults** project, click **Manage NuGet Packages**, go to the **Updates** tab and update all of the packages that have a new version.

![Updating the OpenTelemetry packages](/images/aspire/intro-2/aspire-warnings.avif)

I also just noticed, that Visual Studio created the project with the 13.0.2 version of the Aspire packages. Likely a missing update on my part. You can't fix it with a single click in Visual Studio, but as I said earlier, the CLI can come in clutch. You can just run the update command to fix it:

```powershell
aspire update
```

When prompted if you want to perform the updates to 13.3.5, press `y` and you should see something like this:

![Updating Aspire packages](/images/aspire/intro-2/aspire-update.avif)

One last thing we have to do since we decided not to deal with HTTPS, is to set `ASPIRE_ALLOW_UNSECURED_TRANSPORT` to `true` in the **AppHost** project's **launchSettings.json** file, so it should look something like this.

![launchSettings.json](/images/aspire/intro-2/aspire-launchSettings.avif)

```json
{
  "$schema": "https://json.schemastore.org/launchsettings.json",
  "profiles": {
    "http": {
      "commandName": "Project",
      "dotnetRunMessages": true,
      "launchBrowser": true,
      "applicationUrl": "http://localhost:15163",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development",
        "DOTNET_ENVIRONMENT": "Development",
        "ASPIRE_DASHBOARD_OTLP_ENDPOINT_URL": "http://localhost:19205",
        "ASPIRE_DASHBOARD_MCP_ENDPOINT_URL": "http://localhost:18031",
        "ASPIRE_RESOURCE_SERVICE_ENDPOINT_URL": "http://localhost:20131",
        "ASPIRE_ALLOW_UNSECURED_TRANSPORT": "true"
      }
    }
  }
}
```

With everything done, after starting the project, the Aspire Dashboard should be opened:

![Aspire Dashboard](/images/aspire/intro-2/aspire-empty-dashboard.avif)

## Next steps

This is where we stop for now, but in the next article, we'll take a look at what's in our newly created Aspire application, adding an API to our **AppHost** and the dashboard itself, so make sure to tune in next time.

The GitHub repo with the code for this project can be found [here.](https://github.com/bneuhausz/aspire-intro)

[Read Distributed apps with Aspire - Adding our first service here.](https://bneuhausz.dev/blog/aspire-intro-3/)