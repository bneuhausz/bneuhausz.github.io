---
title: Angular - Beyond httpResource
slug: angular-beyond-httpresource
description: Let's take a step back from httpResource and dive into resource and rxResource
date: 2025-09-15
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

# Angular - Beyond httpResource

[We've talked about httpResource extensively,](https://bneuhausz.dev/blog/angular-httpresource) but often it's not the right tool for a task. Maybe you have to work with a package like [angularfire](https://github.com/angular/angularfire) that exposes Observables to you. Maybe you're working with the [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction) and you have to work with Promises. Maybe you have full control over your backend, but you decide to use some OpenAPI generator package that abstracts away the HTTP calls and gives you either Observables or Promises depending on your generator of choice. In these situations, ``resource`` and ``rxResource`` are here to the rescue.

The source code can be found [here,](https://github.com/bneuhausz/angular-beyond-httpresource) and the demo application can be found [here.](https://bneuhausz.dev/angular-beyond-httpresource)

## The setup

For demo purposes, we'll use this simple service:

```ts
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";

export interface Post {
  id: number;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  posts: Post[] =
    [
      {
        id: 1,
        title: 'Post 1',
      },
      {
        id: 2,
        title: 'Post 2',
      },
    ];

  getFilteredPosts(searchTerm: string): Promise<Post[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        const term = searchTerm.toLowerCase();
        const filteredPosts = this.posts.filter(post =>
          post.title.toLowerCase().includes(term)
        );
        resolve(filteredPosts);
      }, 1000);
    });
  }

  getFilteredPostsObservable(searchTerm: string): Observable<Post[]> {
    const term = searchTerm.toLowerCase();
    const filteredPosts = this.posts.filter(post =>
      post.title.toLowerCase().includes(term)
    );
    return of(filteredPosts).pipe(delay(1000));
  }
}
```

We have a basic ``Post`` interface, we have some dummy data in our ``posts`` variable and we have two functions that do the same thing in the end. Both are filtering our dummy data by ``searchTerm`` and returning it after a second, to mimic an actual HTTP call through the network, but one is ``Observable`` and the other is ``Promise`` based. We'll use ``getFilteredPosts`` to demonstrate ``resource`` and ``getFilteredPostsObservable`` to demonstrate ``rxResource``.

## The basics

We went into detail about some of the benefits of using the resource API when [we've talked about httpResource,](https://bneuhausz.dev/blog/angular-httpresource) so I don't want to spend too much time on it, but in a few words, it gives us a signal based way of handling some async stuff. We can register certain signals and our resources will listen to their changes. When that change happens, it triggers our resource to fire whatever it is configured to do. The resource we create exposes a bit of a state for us in the form of signals like ``value``, ``error`` and ``isLoading`` for example. A lot of what we've talked about when it comes to ``httpResource`` is also true for ``resource`` and ``rxResource``, but in this post, we'll mainly focus on how you can use the resource API with whatever that returns a ``Promise`` or an ``Observable``.

## The simple resource

First, let's take a look at our basic component:

```angular-ts
@Component({
  selector: 'app-posts-resource',
  imports: [FormsModule],
  template: `
    <h2>Posts with Resource</h2>

    <input [(ngModel)]="searchTerm" />
    <button (click)="this.searchTerm.set('')">Clear filter</button>
    <button (click)="reload()">Reload posts</button>

    @if (posts.isLoading()) {
      <p>Loading posts...</p>
    }
    @else if (posts.error()) {
      <p>Error loading posts: {{ posts.error()?.message }}</p>
    }
    @else {
      <ul>
        @for (post of posts.value(); track $index) {
          <li>{{ post.title }}</li>
        }
      </ul>
    }
  `
})
export default class PostsResourceComponent {
  postsService = inject(PostService);

  searchTerm = model('');

  posts = resource({
    // we'll get to this in a sec...
  });

  reload() {
    this.posts.reload();
  }
}
```

We have a ``model`` signal for our ``searchTerm`` with a default value of an empty string. This is bound to a simple input with ``ngModel``, so make sure to import ``FormsModule``. We have two buttons, one for clearing the filter and one for reloading the data. After these, we render our posts, but we leverage the signals our ``posts`` resource exposes for us. This is pretty straightforward, but if you've read the post about ``httpResource``, this will definitely make sense.

Now we are at the fun part. Let's take a look at our resource:

```ts
posts = resource({
  params: () => this.searchTerm(),
  loader: ({ params }) => this.postsService.getFilteredPosts(params),
  defaultValue: [],
});
```

We pass a function that invokes our ``searchTerm`` signal and returns the value to ``params``. Any time the value of ``searchTerm`` changes, the ``posts`` resource will fire and run the logic defined in ``loader``, which will have access to the data passed by the function defined in ``params``. In our case, we call ``getFilteredPosts``, which returns a ``Promise``, at the beginning with an empty string in ``searchTerm``, so we'll get all of our posts. I also added an empty array to ``defaultValue``, so while our resource is working, none of our logic that is based on the value of our resource breaks, but this is not mandatory.

One thing to note here, is that ``params`` is optional, but that way our resource will no longer be reactive, so we lose a lot of the benefits. Either way, this is totally valid:

```ts
posts = resource({
  loader: () => this.postsService.getFilteredPosts(''),
});
```

Now back to our original example. If you type something in our input, our ``resource`` fires and the data is reloaded. You might say great, but what if I need to do some extra work on that data? Easy!

```ts
alteredPosts = resource({
  params: () => this.searchTerm(),
  loader: ({ params }) => {
    return this.postsService
      .getFilteredPosts(params)
      .then(posts => posts.map(post => ({ ...post, title: post.title.toUpperCase() })));
  },
  defaultValue: [],
});
```

You can just use ``then`` on the returned ``Promise`` and modify the data or chain your async calls and callbacks (please don't do this though) to your hearts content. In this case, we just turned the titles of our posts to upper case. You prefer async/await syntax? Say no more!

```ts
alteredPostsAsync = resource({
  params: () => this.searchTerm(),
  loader: async ({ params }) => {
    const posts = await this.postsService.getFilteredPosts(params);
    return posts.map(post => ({ ...post, title: post.title.toUpperCase() }));
  },
  defaultValue: [],
});
```

Just pass an ``async`` function to ``loader`` and ``await`` becomes available to you.

## You like the sound of the word "declarative"? Me too!

You may think okay, this looks pretty good, but we're working with Angular here, I want nothing to do with a ``Promise``, give me my ``Observable`` back. That's where ``rxResource`` enters the picture.

```ts
posts = rxResource({
  params: () => this.searchTerm(),
  stream: ({ params }) => {
    return this.postsService
      .getFilteredPostsObservable(params);
  },
  defaultValue: [],
});
```

The only difference here is that we switched to ``rxResource`` and we call ``getFilteredPostsObservable`` this time, which returns an ``Observable``. Okay, there is one more tiny difference, instead of ``loader``, we define ``stream``, but conceptually, this works the same way. We define what we want to react to in ``params`` and we define what that reaction should be in ``stream``.

Transforming our titles to upper case is just plain RxJS from now:

```ts
alteredPosts = rxResource({
    params: () => this.searchTerm(),
    stream: ({ params }) => {
      return this.postsService
        .getFilteredPostsObservable(params)
        .pipe(
          map(posts => posts.map(post => ({ ...post, title: post.title.toUpperCase() })))
        );
    },
    defaultValue: [],
  });
```

## Let's talk debouncing

To better align the UI and what's happening behind the scenes, we'll use a bit of sorcery and create a helper method to debounce or signals even before we fire the logic we've defined in ``stream``. We'll build our helper method step by step, so let's start with the function definition:

```ts
return toSignal(toObservable(signal));
```

The backbone of our helper will be ``toObservable`` and ``toSignal``, which are helper methods supplied by ``@angular/core/rxjs-interop`` to make interoperability between RxJS and the new signal ecosystem easier. This line in itself doesn't really make sense, as we just convert our signal into an Observable, then back to a signal, but, this way, we can pipe our RxJS operators as usual. Let's add debouncing:

```ts
return toSignal(toObservable(signal)
    .pipe(
      debounceTime(500)
    )
  );
```

This is the barebones setup we need, but in case there are some operators you commonly use together, like ``debounceTime`` and ``distinctUntilChanged``, then you might want to create a bit more complex helper method:

```ts
return toSignal(toObservable(signal)
    .pipe(
      debounceTime(500),
      distinctUntilChanged()
    )
  );
```

One more thing we should do, is add an initial value to ``toSignal``. Right now, our helper would resolve to undefined the first time it runs, which would prevent the loading of our data when the page loads initially. To prevent that, we invoke the signal we'll pass as a parameter, the same we passed to ``toObservable``, and set it to ``initialValue``. This results in the same initial functioning as before, as in, when the page loads, our resource fires with an empty string as the filter. When we put all of this together, here is what our helper functions looks like:

```ts
export function debouncedAndDistinctSignal<T>(signal: Signal<T>) {
  return toSignal(toObservable(signal)
    .pipe(
      debounceTime(500),
      distinctUntilChanged()
    ), { initialValue: signal() }
  );
}
```

The ``toObservable`` helper can only be used in injection context, so let's add a new class member and alter our ``rxResource`` definitions:

```ts
debouncedSearchTerm = debouncedAndDistinctSignal(this.searchTerm);

posts = rxResource({
  params: () => this.debouncedSearchTerm(),
  stream: ({ params }) => {
    return this.postsService
      .getFilteredPostsObservable(params);
  },
  defaultValue: [],
});

alteredPosts = rxResource({
  params: () => this.debouncedSearchTerm(),
  stream: ({ params }) => {
    return this.postsService
      .getFilteredPostsObservable(params)
      .pipe(
        map(posts => posts.map(post => ({ ...post, title: post.title.toUpperCase() })))
      );
  },
  defaultValue: [],
});
```

And that's it, we have a fully functioning, debounced resource, powered by RxJS. It's important to note here, that this debouncing black magic does not only work with ``rxResource``, but with the simple ``resource`` too, so this is also totally valid:

```ts
debouncedSearchTerm = debouncedAndDistinctSignal(this.searchTerm);

alteredPostsAsync = resource({
  params: () => this.debouncedSearchTerm(),
  loader: async ({ params }) => {
    const posts = await this.postsService.getFilteredPosts(params);
    return posts.map(post => ({ ...post, title: post.title.toUpperCase() }));
  },
  defaultValue: [],
  });
```

The resource API is still experimental, so there might be small changes, but it is definitely here to stay, and personally, I'm here for it! Make sure to take into consideration their experimental status when deciding to use them in production, but these have been here for a while and even the [new signal forms](https://bneuhausz.dev/blog/angular-signal-forms-are-out) api is building on these when it comes to async validation, so this is likely a future of Angular.