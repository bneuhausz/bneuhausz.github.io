---
title: Angular CLI Project Creation
slug: angular-project-creation
description: Just an easily bookmarkable note to myself
date: 2025-06-27
coverImage: /images/angular_wordmark_gradient_resized_header.png
coverImageDescription: angular gradient image
thumbnail: /images/angular_gradient_resized_thumbnail.png
thumbnailDescription: angular logo
tags: [ANGULAR]
shadowColor: angular
draft: false
---

# Angular CLI project creation

This is just quick, easily bookmarkable note to myself for the `ng new` command.
There is nothing special about it, it just sets some useful defaults for the CLI.
I, more often than not, default to just create my files manually, but in canse I end up generating something, this is handy.
Obviously, depending on context, skipping tests might not be a good idea, but I use this mostly for hobby projects and learning purposes, so the spec files would serve no purpose other being clutter.

```bash
ng new new-app --defaults --style=scss --inline-template --inline-style --skip-tests
```

If, for whatever reason, you find this page, this command is the exact same Josh Morony uses in his course [Angular start](https://angularstart.com/), which I wholeheartedly recommend to anyone who is not a seasoned veteran in declarative programming, regardless of general developer experience, or even experience in Angular itself.
