---
title: Customizing Angular Material 20
slug: angular-material-20-theming
description: Some notes about customization and theming in Angular Material 20
date: 2025-08-16
coverImage: /images/angular_wordmark_gradient_resized_header.png
coverImageDescription: angular gradient image
thumbnail: /images/angular_gradient_resized_thumbnail.png
thumbnailDescription: angular logo
tags: [ANGULAR, ANGULAR MATERIAL, THEMING]
shadowColor: angular
draft: false
---

# Customizing Angular Material 20

Again, this is just a quick write up for myself, but if for some reason you get here, you're very welcome to use it. You're not likely to find anything you wouldn't find in the [official documentation](https://v20.material.angular.dev/) though. The purpose of this is mostly just to have some notes that are specifically relevant to me in one place. Anyway, let's get into it.

## Some general thoughts

So Angular Material, at least in recent versions, heavily builds on CSS variables and Sass mixins. This greatly reduces the pain customizing older versions caused for many of us.

The Angular material theme defines system variables, that you can easily override, both on the ``:root`` scope or scoped to anything you want to.

You can customize components through tokens they expose. These tokens often rely on a system variable, so changing those might be enough to get the effect you want, but through the supported mixins you can set these tokens to whatever you want to.

### Applying a theme

Since we are using Angular Material, the assumption will obviously be that we are talking about an Angular application, so unless you want to handle things is a more finegrained way, at least for demonstration purposes, everything can be put into ``styles.scss``.

```scss
@use '@angular/material' as mat;

:root {
  @include mat.theme((
    color: (
      primary: mat.$azure-palette,
      tertiary: mat.$blue-palette
    ),
    typography: Roboto,
    density: -5
  ));
}
```

This is a fairly basic example, but covers most of what you'll likely need.

This example uses the prebuilt azure and blue palettes provided by Angular Material as its primary and tertiary colors, respectively. The tertiary pallet is special, as it is rarely used by the built in components and it is meant to serve as a distinct, accent color. If the tertiary palette is not provided, Angular Material will use the primary palette in place of the tertiary palette too.

Typography is also set to Roboto here, meaning, your components will use that as their font. If you want to change the font to something else globally, you can do that here.

Density controls the spacing withing the components. Acceptable values are 0 to -5, 0 being the default. The lower the value is, the less padding there is within components. Not every component is affected by this, but this is a very useful setting to be aware of if you need to show a lot of data on a page, as it greatly reduces the space needed by your table rows, toolbars, even your buttons in some cases.

The minimum setup to make this work with a single palette and default values is the following:

```scss
@use '@angular/material' as mat;

:root {
  @include mat.theme((
    color: mat.$azure-palette
  ));
}
```

## System variables

These variables cover colors, typography and elevation. The official documentation with the complete list of available variables can be found [here.](https://material.angular.dev/guide/system-variables)

### Colors

Angular Material uses many color variables, so I'll not cover them all, only the most important ones and some basic concepts about their usage.

Probably the most important variables, or more accurately, pair of variables, are ``--mat-sys-primary`` and ``--mat-sys-on-primary``. The dominant color of your app, other than possibly the background color itself will likely be ``--mat-sys-primary``. If you use a prebuilt theme or you use the Angular CLI and create your own theme (more on this later) through its ``@angular/material:theme-color`` schematic, ``--mat-sys-primary`` and some other variables, like ``--mat-sys-error`` for example, will be used to calculate their pair color for optimal accessibility and legibility.

Meaning, whenever you use ``--mat-sys-primary`` as the background color of a component, its pair ``--mat-sys-on-primary`` should be used as the color of text, icons, or anything else really, that should be visible on it. The concept is exactly the same when it comes to ``--mat-sys-error`` and ``--mat-sys-on-error``, ``--mat-sys-secondary`` and ``--mat-sys-secondary`` and a few more variables you can look up in the documentation.

There are some special color variables when it comes to dark mode. We will talk about implementing dark mode later, but for now, let's just note that the color variables that contain "fixed" in their name are special colors that are not changed based on the application using light or dark mode. Some examples of these are ``--mat-sys-primary-fixed`` and ``mat-sys-primary-fixed-dim``.

### Typography

These variables, not surprisingly, are meant to control how your fonts behave.

Angular Material provides these variables in 5 categories: 
- body
- display
- headline
- label
- title

Each category has 3 sizes defined:
- small
- medium
- large

An example for a variable like this is ``--mat-sys-body-medium``. These variables can be applied to the ``font`` css property like this:

```css
.example-class {
  font: var(--mat-sys-body-medium)
}
```

The default definition of a variable like this might look like ``--mat-sys-body-medium: 400 0.875rem / 1.25rem Roboto, sans-serif;``. Angular Material lets you access parts of this separately by appending certain keywords.

Assuming ``--mat-sys-body-medium`` has the value from the example above, it would be equivalent to the following:

```css
.example-class {
  --mat-sys-body-medium-font: Roboto, sans-serif;
  --mat-sys-body-medium-line-height: 1.25rem;
  --mat-sys-body-medium-size: 0.875rem;
  --mat-sys-body-medium-tracking: 0.016rem;
  --mat-sys-body-medium-weight: 400;
}
```

### Elevation

These variables are basically serve to control box-shadow, effectively giving a bit of a 3D look to certain components, making them appear a bit closer to you. Angular Material provides 6 of these variables, from ``mat-sys-level0`` to ``mat-sys-level5``, level0 meaning no box shadow at all and level5 having the most prominent visuals.

These variables can be applied to the ``box-shadow`` css property like ``box-shadow: var(mat-sys-level0)``

### Overriding system variables

System variabled can be overridden through the ``mat.theme-overrides`` mixin. Let's say you want to override the primary color variable for whatever reason. This is as simple as this:

```scss
@use '@angular/material' as mat;

@include mat.theme-overrides((
  primary: #ffffff,
));
```

You can do this on any scope, but we will talk about scoping later. Notice that, inside the mixin, you have to omit the ``mat-sys`` prefix from the name of the variables you want to override.

## Dark mode

Newer versions of Angular Material use the ``light-dark()`` css function to calculate color by default. The browser support is growing, [it is 83.26% at the time of writing this,](https://caniuse.com/mdn-css_types_color_light-dark) so you should be fine when it comes to creating new applications, but keep that in mind. Setting up dark mode support in older versions is a bit more complicated, so unless you have very good reasons to opt for the legacy way of handling it, you probably shouldn't.

Either way, in newer versions, Angular Material themes contain automatically calculated dark mode colors for your default colors. What that means for us is that, for example, the ``--mat-sys-primary`` system variable is defined like ``--mat-sys-primary: light-dark(hex-code-of-primary-color, hex-code-of-automatically-calculated-dark-mode-color)``.

You can control the state of using light or dark mode by setting the ``color-scheme`` css attribute on the body element for example.

Some of the possible values are:
- ``light`` - forcing light mode
- ``dark`` - forcing dark mode
- ``light dark`` - letting the browser decide based on the users settings.

A bit more finegrained control can be achieved, but that's not really relevant for us here. More can be found about that [here.](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme)

## Styling components

We will use the ``mat-toolbar`` and ``mat-button`` components as examples, because noth are staples in any kind of application. The toolbar seems like the more complex component, but as you will see, surprisingly, the button offers a lot more customizability.

By introducing system variables, override mixins and design tokens, Angular Material became a lot less opinionated, or at the very least, a lot more customizable. [A new tab labeled styling](https://material.angular.dev/components/toolbar/styling) showed up in the documentation of the components. This tab provides a list of mixins and design tokens avaialble for the given component. You can also find out here if a token is based on a system token.

Tokens can be provided in 4 categories:
- Color
- Typography
- Density
- Base

The first 3 are fairly self explanatory. The base category is, well, for everything else. For example, you could control the shape of a filled button with the ``filled-container-shape`` token. More on that later.

A component might only offer a single mixin with a few tokens, as is the case with ``mat-toolbar``, or it might offer multiple mixins with a ton of tokens, like the ``mat-button`` component.

Anyway, let's jump into it through an example. The ``mat-toolbar`` can be overridden by a single mixing, ``mat.toolbar-overrides``. Let's say you want to override every single toolbar component in your application. In that case, all you have to do is to add this to your ``styles.scss`` file:

```scss
@use '@angular/material' as mat;

:root {
  @include mat.toolbar-overrides((
    container-background-color: var(--mat-sys-primary),
    container-text-color: var(--mat-sys-on-primary),
    title-text-size: var(--mat-sys-label-large),
  ));
}
```

This is all fairly self explanatory, but basically, if you include this snippet in your global css, every single ``mat-toolbar`` in your application will have your ``--mat-sys-primary``color as its background color, text on it will be rendered in your ``--mat-sys-on-primary`` color and the font on it will be set to ``--mat-sys-label-large``. These colors make your toolbar stand out from the background and sets the text size to a smaller value. You might not want this by default, but with ``density: -5`` being set on the theme, this makes the text's size more in line with the toolbar itself.

Now let's talk a bit about ``mat-button``. If you think about it, a button can take up a lot of forms, so it's not really that surprising that it is the more complex component of the two from a design perspective.

Angular Material separates buttons in three distinct categories (fab, icon, everything else) to begin with and offers 3 mixins because of that:
- ``fab-overrides``
- ``icon-button-overrides``
- ``button-overrides``

Within these mixins, dozens of design tokens are available. At the time of writing this, ``fab-overrides`` offers 31 tokens only in the ``Color`` category and we didn't even mention the other mixins. The ``mat-toolbar`` didn't offer any tokens that were based on system tokens, but ``mat-button`` is different in this aspect too. For example, the ``disabled-state-container-color`` token within the ``fab-overrides`` mixin is based on the ``--mat-sys-on-surface`` token, meaning, if you change the value of that system variable, you can control how the fab button looks in disabled state.

That said, we've talked about color tokens in the toolbar example, so let's look at soemthing from the ``Base`` category here, since no token is available from this category on the toolbar. Let's say you want a button that looks like a primary button from the Material 2 times. You would start with ``<button matButton="filled">Basic</button>`` as the filled button already has the primary coloring by default. To achieve the classic, less rounded, Material 2 look, you just have to add:

```scss
@use '@angular/material' as mat;

:root {
  @include mat.button-overrides((
    filled-container-shape: 4px,
  ));
}
```

Just like that, all of your filled buttons have the distinct Material 2 look.

## Scoping

Now let's talk about scoping. Everything we've done so far was on the ``:root`` scope, which is great, if you want to have a default design for each occurance of a certain type of component in your app. However, even withing these basic examples we've covered, there might be need for scoped definitions. Let's say you want to add a ``matIconButton`` to your toolbar. Well, by default, the icon on the buttons has a color that is distinct on the surface colors. However, that might not be very visible on your primary color. In the example above, the toolbar is using the prebuilt azure palette's primary color, which is a dark blue, while the icons are pretty dark grey by default. That is obviously not too visible. However, if you globally change the icon color to ``--mat-sys-on-primary``, which is white in this case, it won't be visible on surfaces that are not set to have the primary background color, like tables for example.

How do you fix that? Easily!

```scss
mat-toolbar {
  @include mat.toolbar-overrides((
    container-background-color: var(--mat-sys-primary),
    container-text-color: var(--mat-sys-on-primary),
    title-text-size: var(--mat-sys-label-large),
  ));

  @include mat.icon-button-overrides((
    icon-color: var(--mat-sys-on-primary),
  ));
}
```

In this example, assuming this is in your ``styles.scss``, we've set up every single occurance of ``mat-toolbar`` in your application to have the same config we previously used and we've also set the ``icon-color`` token of every ``matIconButton`` that is inside a ``mat-toolbar``. However, we did not alter the design of the ``matIconButton`` occurances that are outside of a ``mat-toolbar``.

In a similar vein, you can set up entirely different themes in different scopes.

```scss
@use '@angular/material' as mat;

:root {
  @include mat.theme((
    color: (
      primary: mat.$azure-palette,
      tertiary: mat.$blue-palette,
    ),
    typography: Roboto,
    density: -5
  ));
}

mat-toolbar {
  @include mat.theme((
    color: mat.$orange-palette
  ));

  @include mat.toolbar-overrides((
    container-background-color: var(--mat-sys-primary),
    container-text-color: var(--mat-sys-on-primary),
    title-text-size: var(--mat-sys-label-large),
  ));

  @include mat.icon-button-overrides((
    icon-color: var(--mat-sys-on-primary),
  ));
}
```

Notice the usage of the ``mat.theme`` mixin inside the ``mat-toolbar`` tag. With this setup, the entire application will use the azure palette, except every single ``mat-toolbar`` in your application, which will default to the orange palette. If you need even more scoped designe that that, you can just use the ``mat.theme`` mixin inside your Angular component and the usual rules regarding Angular styles and scoping will apply.

## Creating a custom theme

The Angular CLI offers a schematic for generating your custom theme. All you have to do is add Angular Material:

```bash
ng add @angular/material
```

Then you can just run the following command:

```bash
ng generate @angular/material:theme-color
```

The CLI will guide you through the process, but basically the minimum you need to provide is the hex code of the color you want to use as your primary color.
You can read about it more [here.](https://github.com/angular/components/blob/main/src/material/schematics/ng-generate/theme-color/README.md)