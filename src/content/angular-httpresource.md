---
title: Angular httpResource is awesome!
slug: angular-httpresource
description: I've been a huge fan of the new httpResource since it was released. Let's take a look why!
date: 2025-08-31
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
tags: [JavaScript, Angular, Node.js, Express]
shadowColor: angular
draft: false
---

# Angular httpResource is awesome!

I've been a huge fan of the new [httpResource](https://angular.dev/api/common/http/httpResource) since release. It is still in experimental stage, but it was introduced in Angular 19.2 and it received a lot of love since then. Taking into account the direction Angular has been taking with embracing the signal way, I'm confident ``httpResource`` is here to stay. That said, I often see discussion that indicates many devs are not yet familiar with this new ecosystem, so I thought I'd throw out my thoughts to the wind. Maybe it helps someone out there.

Originally, I wanted to use [JSONPlaceholder](https://jsonplaceholder.typicode.com/) for this demo. I highly recommend it if you need a free mock API to play around with, but this time, I decided to go with a simple Express API to have more control over the responses for demonstration purposes. However, we will use the ``Todo`` type from JSONPlaceholder for demo purposes.

The source code can be found [here.](https://github.com/bneuhausz/angular-httpresource-demo)

## The basics

So ``httpResource<T>`` accepts a ``url`` or a ``request`` as the first parameter and an optional ``options`` parameter as the second. Then, it creates a [Resource](https://angular.dev/api/core/Resource) that, behind the scenes, uses ``HttpClient`` to fetch data with a ``GET`` request to the url we supplied. At least if not configured otherwise. It is important to note, that in the ``url`` or ``request`` parameter, ``httpResource`` expects a function that resolves to ``string | undefined`` or ``HttpResourceRequest | undefined`` respectively. We'll take a look at why later, but for now, just keep that in mind.

The ``httpResource<T>`` function returns an ``HttpResourceRef``. We'll discuss some of it here, but in case you want to read the complete documentation, [here you go.](https://angular.dev/api/common/http/HttpResourceRef)

Either way, ``HttpResourceRef`` exposes info about the HTTP request as signals, so in a reactive way. You get access to signals like:
- ``headers`` 
- ``statusCode`` 
- ``progress`` 
- ``value`` 
- ``status``
- ``error``
- ``isLoading``

Yes, you see that right. Using ``httpResource`` comes with the benefit of a fairly basic state management system built in. A bit more on that later.

On top of these, you get access to some functions:
- ``hasValue()``
- ``destroy()``
- ``set(value: T)``
- ``update((value: T) => T)``
- ``asReadonly()``
- ``reload()``

One thing to note is that, as I've mentioned earlier, ``httpResource`` uses ``HttpClient`` in the background, so everything that applies to ``HttpClient`` applies to your resources created by ``httpResource``. For example, if you set up interceptors in ``provideHttpClient``, then those take effect when your resources fire too. Also, it is getting changed in future versions, but for now, you have to add ``provideHttpClient`` to your ``app.config.ts`` for this to work.

## Let's put it in practice

### Plumbing

So we just discussed this, but make sure your ``ApplicationConfig`` has ``provideHttpClient`` in its providers.

Our very basic backend setup, at least when starting out is the following:

```js
import express from 'express';
import cors from 'cors';
import { todos } from './todos.js';

const app = express();
const port = 3000;

app.use(cors({
  origin: 'http://localhost:4200'
}));

app.get('/api/todos', (req, res) => {
  res.json(todos);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
```

```js
export const todos = [
  {
    "userId": 1,
    "id": 1,
    "title": "delectus aut autem",
    "completed": false
  },
  {
    "userId": 1,
    "id": 2,
    "title": "quis ut nam facilis et officia qui",
    "completed": false
  },
  {
    "userId": 1,
    "id": 3,
    "title": "fugiat veniam minus",
    "completed": false
  },
  {
    "userId": 1,
    "id": 4,
    "title": "et porro tempora",
    "completed": true
  },
  {
    "userId": 1,
    "id": 5,
    "title": "laboriosam mollitia et enim quasi adipisci quia provident illum",
    "completed": false
  }
];
```

For simplicity's sake, I added the ``cors`` package to avoid setting up a proxy in our Angular app.

Also, we have our ``Todo`` definition:

```ts
export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}
```

For some of the examples, I'll likely create separate components, but that is pretty straightforward, so I won't spend much time explaining it, if any.

### The simplest way of using httpResource

Now let's take a look at a minimalist example:

```angular-ts
import { httpResource } from "@angular/common/http";
import { Component } from "@angular/core";
import { Todo } from "../shared/todo";

@Component({
  selector: 'app-todos',
  template: `
    <ul>
      @for (todo of todos.value(); track todo.id) {
        <li>
          {{ todo.title }}
        </li>
      }
    </ul>
  `,
})
export default class Todos {
  readonly todos = httpResource<Todo[]>(() => 'http://localhost:3000/api/todos');
}
```

As you can see, we just have to define our ``todos`` resource and easy access to everything ``HttpResourceRef`` gives us in our template. There are no observables, no subscriptions, no ``async`` pipes or... well, nothing. This is all we have to do to fire an HTTP request and work with the response. We can just access the data from the response through ``todos.value()`` and everything else is handled for us automatically.

You need to show a loading indicator? Easy! I'll keep this bare bones, but feel free to fire up your loading indicator of choice:

```angular-html
@if (todos.isLoading()) {
  <p>Loading...</p>
}
@else {
  <ul>
    @for (todo of todos.value(); track todo.id) {
      <li>
        {{ todo.title }}
      </li>
    }
  </ul>
}
```

I also altered our backend to delay the response a bit, so our loading indicator is visible:

```js
app.get('/api/todos', (req, res) => {
  setTimeout(() => {
    res.json(todos);
  }, 2000);
});
```

Yes, it's that easy. You just have to check the ``isLoading`` signal in the template, without altering anything in our TypeScript or managing any kind of state ourselves.

Since we are working with signals, another cool thing we can do is use ``computed`` or ``effect`` with them. As an example, let's take a look at ``computed`` and create the ``completedCount`` signal:

```ts
export default class Todos {
  readonly todos = httpResource<Todo[]>(() => 'http://localhost:3000/api/todos');
  readonly completedCount = computed(() => this.todos.value()?.filter(todo => todo.completed).length);
}
```

Then add it to our template under our list of todos:

```angular-html
<p>Total Completed Todos: {{ completedCount() }}</p>
```

Now every time the value of our initial resource changes, we get the count of completed todos for free. This is really cool even now, but keep this in mind for later, when we look at the reactivity of the resources itself.

### Handling errors

We should probably check if we received a success response, right? Well, obviously. How do we do that? Again, easily! Let's alter our API to simulate an error:

```js
app.get('/api/todos', (req, res) => {
  res.status(500).send();
  /*setTimeout(() => {
    res.json(todos);
  }, 2000);*/
});
```

And alter our template like so:

```angular-html
@if (todos.error()) {
  <p>Something went wrong when loading todos...</p>
}
@else {
  @if (todos.isLoading()) {
    <p>Loading...</p>
  }
  @else {
    <ul>
      @for (todo of todos.value(); track todo.id) {
        <li>
          {{ todo.title }}
        </li>
      }
    </ul>
  }
}
```

Yep, that's it! Again, interceptors do work with our resource here, so if you have a global exception handler defined, that will catch the errors too. Just for demonstration, I created a dummy error interceptor:

```ts
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      console.error('Error occurred:', error);
      return EMPTY;
    }),
  );
};
```

And added it to ``provideHttpClient``:

```ts
provideHttpClient(withInterceptors([httpErrorInterceptor]))
```

After this, the errors get logged to the console too.

### Let's talk about options

The second, optional parameter ``httpResource`` accepts is an ``HttpResourceOptions``. We will take a look at some of the stuff it offers, but for the full capabilities, read [this.](https://angular.dev/api/common/http/HttpResourceOptions)

First of all, you can add a default value, that will be instantly available, while we wait for the response.

```angular-ts
readonly todosWithDefaultValue = httpResource<Todo[]>(
  () => 'http://localhost:3000/api/todos',
  {
    defaultValue: [{ userId: 0, id: 0, title: 'Default Todo', completed: false }],
  }
);
```

```angular-html
<ul>
  @for (todo of todosWithDefaultValue.value(); track todo.id) {
    <li>
      {{ todo.title }}
    </li>
  }
</ul>
```

With this setup, instead of showing a loading indicator, we can instantly render a default list of todos.

Another interesting option is ``parse``. With this, we can either validate or transform the data we received in the response. First, let's look at a simple transformation:

```angular-ts
readonly todosTransformed = httpResource<string[]>(
  () => 'http://localhost:3000/api/todos',
  {
    parse: (todos) => (todos as Todo[]).map(todo => todo.title),
  }
);
```

If we only need the title from our todos, then it is this simple to transform our data. This is obviously a dummy case, but for example, this can be really useful when working with Dates for example.

Another use case for ``parse`` is schema validation. You can use Zod, or the validation library of choice, in combination with ``httpResource``. Let's define our schema:

```ts
const todoSchema = z.array(z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  completed: z.boolean()
}));
```

Then we can simply create our resource like this:

```ts
readonly todosWithSchemaValidation = httpResource(
  () => 'http://localhost:3000/api/todos',
  {
    parse: todoSchema.parse,
  }
);
```

If we go with this approach, if the schema validation is successful, then the resource will be typed the same as we defined in our schema. If the validation fails, our resource will be in an error state.

### Reloading our data

You might say okay, great, but what if I want to send our request again, because let's say we need to poll our backend periodically. Well, that's easy too. You can just use the ``reload`` function on ``HttpResourceRef``. For demo purposes, let's add a button to our template like this and we are done:

```angular-html
<button (click)="todos.reload()">Reload</button>
```

### Reactivity

A really cool thing about ``httpResource`` is that it neatly fits into the reactive approach of the signal ecosystem. Earlier, when we talked about ``computed``, I mentioned that it is really cool that we can react to the changes of our resource. Here is why. As we have seen in every example so far, the first parameter of ``httpResource`` is a function, that returns a URL, at least in our case. Well, if there are signals that change in this function, our resource will react to those changes and automatically fire the HTTP request. Let's look at an example.

Add a new endpoint to our backend, that receives a todo id as a parameter and returns the todo with that id:

```js
app.get('/api/todos/:id', (req, res) => {
  const id = req.params.id;
  const todo = todos.find(t => String(t.id) === id);
  if (todo) {
    res.json(todo);
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});
```

I also added a new component with a route because our original component was getting a bit too messy. There is a bit of config change too, so we can access our route parameters as signals. Here's our altered ``provideRouter`` in ``app.config.ts``:

```ts
provideRouter(routes, withComponentInputBinding()),
```

Here's our new route definition:

```ts
{
  path: 'todos/:id',
  loadComponent: () => import('./todo-details/todo-details'),
},
```

I altered our original list of todos in ``todos.ts`` and added links to our list items:

```angular-html
<li>
  <a [routerLink]="['/todos', todo.id]">{{ todo.title }}</a>
</li>
```

And here's our new component, that we load when we navigate to this route:

```angular-ts
import { httpResource } from "@angular/common/http";
import { Component, input } from "@angular/core";
import { Todo } from "../shared/todo";

@Component({
  selector: 'app-todo',
  template: `
    <p>Todo Details for ID: {{ id() }}</p>
    <p>Todo Title: {{ todo.value()?.title }}</p>
  `
})
export default class TodoDetails {
  readonly id = input.required<number>();
  readonly todo = httpResource<Todo>(() => `http://localhost:3000/api/todos/${this.id()}`)
}
```

In this simple example, we receive our todo id as an ``input`` and our resource will send the request based on the value of our ``id`` signal. This is a fairly straight forward case, so let's dig deeper and create a new resource, a new signal and a way to change that signal:

```ts
readonly changingId = signal<number>(1);
readonly changingTodo = httpResource<Todo>(() => `http://localhost:3000/api/todos/${this.changingId()}`);

changeId() {
  const randomId = Math.floor(Math.random() * 5) + 1;
  this.changingId.set(randomId);
}
```

Then add the following to our template:

```angular-html
<button (click)="changeId()">Change ID</button>
<p>Todo Details for changing ID: {{ changingId() }}</p>
<p>Todo Title: {{ changingTodo.value()?.title }}</p>
```

Our ``changingId`` defaults to 1 and our ``changingTodo`` loads the todo with the id of 1 when the page loads. However, every time we click the "Change ID" button, we generate a random number from 1 to 5 and set our ``changingId`` signal's value to it. When our ``changingId`` is changed, our resource automatically fires a new request and everything reacts to it automatically. Well, kinda. If you try this, you will notice, that a new request only runs, if the value of ``changingId`` is different. This is pretty damn awesome, isn't it?

### What you can, but probably shouldn't do

As we've discussed in the beginning, the function received by ``httpResource``, on top of a URL, can return an ``HttpResourceRequest`` too. That means, we have access to lots of options, like ``method``, ``body`` and much more. [Here's the exhaustive list of options.](https://angular.dev/api/common/http/HttpResourceRequest)

It's not pretty, but for one reason or another, many old APIs tend to expose ``POST`` endpoints that really should be ``GET``, or possibly [QUERY](https://httpwg.org/http-extensions/draft-ietf-httpbis-safe-method-w-body.html) in the future. The default method of a resource created with ``httpResource`` is ``GET``, but if you end up with a case like I just mentioned, you can override that behavior. Here's how.

First, add a ``POST`` endpoint to our API, that receives the todo id in the body and returns the correct todo:

```js
app.use(express.json());

app.post('/api/todos', (req, res) => {
  const { id } = req.body;
  const todo = todos.find(t => String(t.id) === String(id));
  if (todo) {
    res.json(todo);
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});
```

Then define our new resource, that will send a ``POST`` request:

```angular-ts
readonly postTodo = httpResource<Todo>(() => {
  const todoId = this.id();

  return {
    method: 'POST',
    url: `http://localhost:3000/api/todos`,
    body: { id: todoId }
  };
});
```

Add this to our template:

```angular-html
<p>Post Todo Details for ID: {{ id() }}</p>
<p>Todo Title: {{ postTodo.value()?.title }}</p>
```

And BAM, we've just created a resource that sends ``POST`` requests, even though we probably shouldn't have.

All in all, I instantly fell in love with ``httpResource`` when I started using it and I'm not planning on looking back. It was a huge quality of life improvement considering the DX of Angular. I can't wait for the new signal forms that should be introduced soon in an experimental state, so you can expect a similar write-up about it in the near future too. I hope you're as excited as I am!