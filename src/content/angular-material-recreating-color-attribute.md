---
title: Angular Material 20 - Recreating the [color] attribute
slug: angular-material-recreating-color-attribute
description: In this post we'll recreate [color] attribute in Angular Material 20
date: 2025-08-17
coverImage: /images/angular_wordmark_gradient_header.avif
coverImageMedium: /images/angular_wordmark_gradient_header_medium.avif
coverImageSmall: /images/angular_wordmark_gradient_header_small.avif
coverImageDescription: angular gradient image
thumbnail: /images/angular_gradient_thumbnail.avif
thumbnailDescription: angular logo
tags: [Angular, Angular Material, Theming]
shadowColor: angular
draft: false
---

# Angular Material 20 - Recreating The \[color\] Attribute

## The \[color\] attribute

In older versions of Angular Material, several components came with a built in ``[color]`` attribute (in one form or another), which enabled easily setting the design of the given component, as long as you were fine with using some predefined styles.

Let's take a look at [Angular Material v16's button](https://v16.material.angular.dev/components/button/overview) component for example:

![Angular Material v16 buttons overview](/images/angular-material/angular-material-v16-buttons.avif)

You could put ``color="primary"`` on a button or a toolbar for example, and the component would be istantly set to the primary colors of your theme. Same with ``color="accent"`` or ``color="warn"``.

As of Angular Material 18 however, the color attribute only has an effect on the older, M2 themes and does nothing when it comes to M3. The new overview of the button component looks quite bleak. Without further context, if you were working with Angular Material and looked at the [v20 overview page](https://v20.material.angular.dev/components/button/overview), which is the newest version at the time of writing this, you'd probably be really surprised.

![Angular Material v20 buttons overview](/images/angular-material/angular-material-v20-buttons.avif)

## Customizing the button in v20

I've wrote, at length, about how customizing and theming works in newer versions of Angular Material, so I'll not go into that here and just leave a [link](https://bneuhausz.dev/blog/customizing-angular-material-20) to that post instead.

Anyway, bringing back the old ``color`` attribute's functionality is surprisingly easy using the new mixins. All you have to do to achieve that, assuming you use the prebuilt color palettes and the azure palette is your primary palette, is defining some rules in your ``styles.scss``:

```scss
@use '@angular/material' as mat;

[color="accent"] {
  @include mat.theme((
    color: mat.$rose-palette
  ))
}

[color="warn"] {
  @include mat.theme((
    color: mat.$red-palette
  ))
}
```

Then you can just add the following buttons to your HTML:

```html
<button matButton>
  Primary
</button>

<button matButton color="accent">
  Accent
</button>

<button matButton color="warn">
  Warn
</button>

<br>

<button matButton="filled">
  Primary
</button>

<button matButton="filled" color="accent">
  Accent
</button>

<button matButton="filled" color="warn">
  Warn
</button>
```

And you should get this outcome:

![Angular Material v20 buttons with color attribute](/images/angular-material/color-attribute-buttons.avif)

The colors do not exactly match the old ones. You can do it a lot more finegrained if you wish:

```scss
[matButton="filled"][color="accent"] {
  @include mat.button-overrides((
    filled-container-color: green,
    filled-label-text-color: white,
  ));
}
```

This approach will apply your specific colors to every ``filled``material button that has the ``accent`` color applied to it. However, one advantage of the approach above, is that it not only applies to your buttons, but to everything that supports the material theming. Meaning, if you want to create a toolbar that has the ``warn`` color, you can just add the html below and it works automatically:

```html
<mat-toolbar color="warn"></mat-toolbar>
```