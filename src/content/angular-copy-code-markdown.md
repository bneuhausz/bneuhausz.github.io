---
title: Markdown copy code button in Angular
slug: angular-copy-code-markdown
description: We'll implement an Angular directive that adds a copy button to code blocks in markdown, utilizing Analog, Tailwind CSS and daisyUI
date: 2025-08-21
coverImage: /images/angular_wordmark_gradient_header.avif
coverImageMedium: /images/angular_wordmark_gradient_header_medium.avif
coverImageSmall: /images/angular_wordmark_gradient_header_small.avif
coverImageDescription: angular gradient image
metaImage: https://bneuhausz.dev/images/bneuhausz_dev.png
metaImageDescription: bneuhausz.dev site logo
thumbnail: /images/angular_gradient_thumbnail.avif
thumbnailDescription: angular logo
icon: /images/angular_gradient_icon.avif
iconDescription: angular logo
tags: [Angular, Analog, Tailwind CSS, daisyUI]
shadowColor: angular
draft: false
---

# Markdown copy code button in Angular

## Basic Setup

This app you're browsing right now is built with Analog, Tailwind CSS and daisyUI. The attribute we will take a look at is part of this app, so we will take the usage of the above technologies a given, but the actual use case is not technology specific, so you may still find it useful. A complete, working example can be found in the [source code of this site.](https://github.com/bneuhausz/bneuhausz.github.io)

## The code of the directive

First, I'll show you the complete code of this attribute, then we'll go through it together.

```ts
import { Directive, ElementRef, AfterViewInit, Renderer2, inject } from '@angular/core';
import { isBrowser } from '../utils/browser.utils';

@Directive({
  selector: '[appCodeCopyButton]',
})
export class CodeCopyButtonDirective implements AfterViewInit {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  ngAfterViewInit(): void {
    if (!isBrowser()) return;

    const observer = new MutationObserver(() => {
      const preElements = this.el.nativeElement.querySelectorAll('pre');
      if (preElements.length === 0) return;

      preElements.forEach((pre: HTMLPreElement) => {
        if (pre.querySelector('button')) return;

        this.renderer.setAttribute(pre, 'class', 'relative pt-8');

        const button = this.renderer.createElement('button');
        this.renderer.setAttribute(
          button,
          'class',
          'btn btn-xs btn-ghost absolute top-1 right-2 z-10'
        );
        this.renderer.setProperty(button, 'textContent', 'Copy');

        this.renderer.appendChild(pre, button);

        this.renderer.listen(button, 'click', () => this.handleCopyButtonClick(pre, button));
      });

      observer.disconnect();
    });

    observer.observe(this.el.nativeElement, {
      childList: true,
      subtree: true,
    });
  }

  private handleCopyButtonClick(pre: HTMLPreElement, button: HTMLButtonElement): void {
    const code = pre.querySelector('code')?.textContent ?? '';
    navigator.clipboard.writeText(code);
    button.textContent = 'Copied!';
    this.resetButtonText(button);
  }

  private resetButtonText(button: HTMLButtonElement): void {
    setTimeout(() => {
      button.textContent = 'Copy';
    }, 2000);
  }
}
```

## Explanation

Now let's break this all down. Well, most of it anyway.

### Directive decorator

```ts
@Directive({
  selector: '[appCodeCopyButton]',
})
```

There is nothing exciting going on here, it's just a standard Angular directive utilizing an attribute selector, which enables the usage of this directive as follows:

```html
<div appCodeCopyButton>
  <analog-markdown [content]="post.content" />
</div>
```

### Class definition

```ts
export class CodeCopyButtonDirective implements AfterViewInit {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  ngAfterViewInit(): void { }
}
```

Again, this is fairly basic. Our class implements the ``AfterViewInit`` interface and uses this lifecycle hook provided by Angular. Basically, everything inside ``ngAfterViewInit`` will run once, after Angular finished initialaizing the views of the component and its children.

We inject ``ElementRef`` to get access to the host HTML element our directibe is attached to. In our case, it's the div element:

```html
<div appCodeCopyButton>
  <analog-markdown [content]="post.content" />
</div>
```

We'll allso need to inject ``Renderer2``. No, it is not a typo, it really is called ``Renderer2``. It is a service provided by Angular that provides a safe way to manipulate DOM elements, regardless of the environment.

### The actual logic

#### Big picture view

The logic inside ``ngAfterViewInit`` starts with this line:

```ts
if (!isBrowser()) return;
```

This is just a handy utility function that you can straight up ignore if you are not using server side rendering. This line basically stops execution, if the ``window`` or ``document`` objects are undefined, meaning, the app is not running in a browser.

```ts
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}
```

Then, we have our ``MutationObserver`` setup:

```ts
const observer = new MutationObserver(() => {
  // logic to add buttons, we'll discuss this in a moment
  observer.disconnect();
});

observer.observe(this.el.nativeElement, {
  childList: true,
  subtree: true,
});
```

``MutationObserver`` is a browser API that provides the ability to watch for changes being made to the DOM tree. You can read more about it [here.](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) It is used here, because depending on how you handle loading the markdown content, it might be loaded asynchronously, after ``ngAfterViewInit`` has already fired.

First, we set up a callback function, that runs when the ``MutationObserver`` detects a change. We'll go over the details soon. For now, let's just focus on the last line inside the callback, ``observer.disconnect()``. This line tells the ``MutationObserver`` that it is done, we don't need to be watching for changes anymore. In our case, the markdown content is loaded all at once, so disconnecting after the initial load is fine. It's encouraged even. If your usecase is different, this is something you may need to change.

Then, after the callback function's setup is done, we call ``observer.observe`` and pass the ``nativeElement`` contained by our ``ElementRef`` instance. We also pass a second, optional ``options`` parameter of type ``MutationObserverInit``. For us, only the ``childList`` and ``subtree`` options are relevant, but there are some more you might want to know about. Read more about what options are availabe [here.](https://dom.spec.whatwg.org/#interface-mutationobserver)

With our setup, we tell the ``MutationObserver`` to watch for changes of not just the host element, but its children too. Setting ``subtree: true`` makes this work on all descendants at any level, not just on direct children of the host element.

#### Contents of the callback function

This is the part that runs when changes are detected by ``MutationObserver``.

```ts
const preElements = this.el.nativeElement.querySelectorAll('pre');
if (preElements.length === 0) return;
```

So far, it is pretty self-explanatory. We look up all the ``pre`` elements inside our host element. In markdown output, code blocks are wrapped in these typically. In case there are none, we are done here, there is no need to execute the rest of the logic.

```ts
preElements.forEach((pre: HTMLPreElement) => {
  if (pre.querySelector('button')) return;
  // rest of the logic, we'll look at it in a second
});
```

We need to add a copy button to each ``pre`` element, so we'll loop through them. We added a check here, to avoid adding multiple buttons if, for some reason, our observer fires multiple times. We only want to add a single copy button, but if you would want to do more complex logic, this might need to be adjusted a bit.

```ts
this.renderer.setAttribute(pre, 'class', 'relative pt-8');
```

This line is greatly dependent on the tech you use, but this is just the styling part. Since we are using ``Tailwind CSS``, we just add the ``relative`` and ``pt-8`` utility classes to our ``pre`` element.

```ts
const button = this.renderer.createElement('button');
this.renderer.setAttribute(
  button,
  'class',
  'btn btn-xs btn-ghost absolute top-1 right-2 z-10'
);
this.renderer.setProperty(button, 'textContent', 'Copy');

this.renderer.appendChild(pre, button);

this.renderer.listen(button, 'click', () => this.handleCopyButtonClick(pre, button));
```

Here we see probably the most important part. Through our ``Renderer2`` instance, we create a new button and design it. Again, these classes are ``Tailwind CSS``, and in this case, ``daisyUI`` dependent, so your solution might look different, but this is just styling.

Then, we set the ``textContent`` property of the button, in this case, to "Copy". With this step, our button instance is done, so we can add it to our ``pre`` element with our renderer instance's ``appendChild`` method. There is nothing more to do, than adding a ``click`` listener to our button, again, utilizin our renderer instance, but this time we use its ``listen`` method.

With this step completed, all we have left to do is to implement ``handleCoppyButtonClick``.

#### Handling the button click

This should be fairly straightforward.

```ts
handleCopyButtonClick(pre: HTMLPreElement, button: HTMLButtonElement): void {
  const code = pre.querySelector('code')?.textContent ?? '';
  navigator.clipboard.writeText(code);
  button.textContent = 'Copied!';
  this.resetButtonText(button);
}

resetButtonText(button: HTMLButtonElement): void {
  setTimeout(() => {
    button.textContent = 'Copy';
  }, 2000);
}
```

We pass our ``HTMLPreElement`` and ``HTMLButtonElement`` instances. These are the ``pre`` element our loop is working on right now and the button we created in it. We read the ``textContent`` of the ``code`` block inside our ``pre`` element and add it to the clipboard through ``navigator.clipboard``. Being able to do this so easily is due to the browser provided ``Navigator`` API, which you can look up [here.](https://developer.mozilla.org/en-US/docs/Web/API/Navigator)

Once we are done with writing to the clipboard, we add a bit of interactivity and change the ``textContent`` of our button to "Copied!", then we start a timer with ``setTimeout`` and after 2 seconds, we change it back to the original "Copy" text.

You might need to do some more styling, depending on your choice of tech, but this is basically it. It is a fairly straightforward process and in the end, the outcome should be something similar to, at least in functionality, to the copy buttons you can find in the code blocks all over this site, or even this article itself.