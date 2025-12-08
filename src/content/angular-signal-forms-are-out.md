---
title: Angular signal forms are out! (Experimentally)
slug: angular-signal-forms-are-out
description: Angular signal forms have been released in an experimental state and it's really promising so far
date: 2025-09-04
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
lastMod: 2025-12-08
---

# Angular signal forms are out! (Experimentally)

> <sub>
  > <b>Changelog:</b><br>
  > <b>2025-09-05:</b> Fixed some typos.<br>
  > <b>2025-09-06:</b> Added clarification about async issues at the bottom and added link to part 2 about server side validation after submitting.<br>
  > <b>2025-12-08:</b> This article has been upgraded to the released version of Angular 21.<br>
> </sub>

The day has come. Angular signal forms are out! It's in a highly experimental state, but so far, everything seems really promising. Let's take a look at it.

I'll just go over some examples and use cases quickly, but you can find the source for this project, including a simple Node API using Express in the server folder for async validators, [here.](https://github.com/bneuhausz/angular-signal-forms)

## The basics

Creating a form has never been so simple. I've added Angular Material to have a little bit of styling, so the strictly needed HTML is inflated. I'll remove styles and imports from the examples to make them more readable.

Either way, take a look at this! Even with the extra lines due to Material, this is incredibly clean:

```angular-ts
@Component({
  selector: 'app-simple-form',
  imports: [MatFormFieldModule, MatInputModule, Field],
  template: `
    <form>
      <mat-form-field>
        <mat-label>First Name</mat-label>
        <input matInput [field]="f.firstName" />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Last Name</mat-label>
        <input matInput [field]="f.lastName" />
      </mat-form-field>
    </form>
  `,
})
export default class SimpleForm {
  f = form(signal({
    firstName: '',
    lastName: ''
  }));
}
```

Yes, this is all the code it takes to create a form with signal forms. Just feed a signal to the new ``form`` function and add the ``[field]`` directive to your input of choice and you are done. Just make sure to import everything from the correct module, which, in our case, looks like this:

```ts
import { form, Field } from "@angular/forms/signals";
```

Now let's add some basic validators.

The usual default validators supplied by Angular are available as functions imported from ``@angular/forms/signals`` and it is a breeze to use them. The ``form`` function accepts a second parameter that we can use to configure the behavior of our form. Let's take a look at an example:

```angular-html
<form>
  <mat-form-field>
    <mat-label>First Name</mat-label>
    <input matInput [field]="f.firstName" />
    @if (f.firstName().invalid()) {
      <mat-error>{{ f.firstName().errors()[0].message }}</mat-error>
    }
  </mat-form-field>

  <mat-form-field>
    <mat-label>Last Name</mat-label>
    <input matInput [field]="f.lastName" />
    @if (f.lastName().invalid()) {
      <mat-error>{{ f.lastName().errors()[0].message }}</mat-error>
    }
  </mat-form-field>

  <button mat-button type="button" [disabled]="f().invalid()">Submit</button>
</form>
```

```angular-ts
f = form(signal({
  firstName: '',
  lastName: ''
}), p => {
  required(p.firstName, { message: 'First name is required' });
  required(p.lastName, { message: 'Last name is required' });
});
```

Through ``p``, which stands for ``FieldPath``, we can basically walk through the field tree of our form. This ``FieldPath`` has a ``PathKind`` of ``Root``. For our simple use cases this doesn't really matter, but for more advanced stuff, keep this in mind. So, in our config, we can call the ``required`` function and pass the field we want to make required through our ``FieldPath`` and that is all there is to it.

This also adds the ``required`` attribute to our input in the end, just like all of the other built in validator functions, which is really cool to be honest.

The second config parameter is optional, but it can be used to define your own error messages for example. We can also add conditions in our config object to make the validator only apply conditionally, which we will take a look at in a bit.

Before we do that though, I want to mention the error handling in our HTML. Our form variable created by the ``form`` function exposes a signal for each of the properties in our input signal. On these exposed signals, also as signals, we have the usual ``valid``, ``invalid``, ``errors`` and so on available. This is also the functionality we used when we added the ``[field]`` directive to our inputs. Same thing with the form itself. We have access to ``f().invalid()`` for example.

Dealing with ``FormGroups`` and ``FormControls`` will soon be behind us! Well, when signal forms exit the experimental stage anyway.

By this time, you might ask, okay, but how do we set the values of our inputs if there are no ``FormGroup``s or ``FormControl``s? That's easy too! Since the new ``form`` function expects a signal as an input, we can just extract our signal from the form creation like this:

```angular-ts
export default class FormWithValue {
  model = signal({ name: '' });
  f = form(this.model);

  constructor() {
    this.model.set({ name: 'Bálint' });
  }
}
```

So we create our input signal in a separate variable and pass that to ``form``. From now on, every time we interact with the ``model`` signal, it is reflected inside our form. Reactivity is awesome, isn't it?

Before we move on to a little bit - though not much - more advanced topics, let's see how we can deal with extracting the configuration of our form to make our code a bit less cluttered. We take this chance to look at typing our form too, although it was typed already, the type was just inferred from our input signal.

```ts
type NameData = {
  firstName: string;
  lastName: string;
};

const nameSchema = schema<NameData>((p) => {
  required(p.firstName, { message: 'First name is required' });
  required(p.lastName, { message: 'Last name is required' });
});
```

We created the type for our form and the our config with the ``schema`` function. Now, we can pass this to ``form``:

```angular-ts
model = signal<NameData>({
  firstName: '',
  lastName: ''
});
f = form(this.model, nameSchema);
```

For the sake of simplicity, we will keep configuring our forms inline in the following examples.

## Conditionals

Okay, so we are in a little bit more advanced territory. First, we'll create a form with an email input, that will be conditionally required. Our condition will be that the user has opted in to receive newsletters by clicking a checkbox. This will be our form definition:

```angular-ts
f = form(signal({
  firstName: '',
  lastName: '',
  canReceiveNewsletter: false,
  email: ''
}), p => {
  required(p.firstName, { message: 'First name is required' });
  required(p.lastName, { message: 'Last name is required' });
  email(p.email, { message: 'Email is not valid' });
  required(p.email, { when: ({ valueOf }) => valueOf(p.canReceiveNewsletter), message: 'Email is required' });
});
```

And here is our template:

```angular-html
<form>
  <mat-form-field>
    <mat-label>First Name</mat-label>
    <input matInput [field]="f.firstName" />
    @if (f.firstName().invalid()) {
      <mat-error>{{ f.firstName().errors()[0].message }}</mat-error>
    }
  </mat-form-field>

  <mat-form-field>
    <mat-label>Last Name</mat-label>
    <input matInput [field]="f.lastName" />
    @if (f.lastName().invalid()) {
      <mat-error>{{ f.lastName().errors()[0].message }}</mat-error>
    }
  </mat-form-field>

  <mat-form-field>
    <mat-label>Email</mat-label>
    <input matInput [field]="f.email" />
    @if (f.email().invalid()) {
      <mat-error>{{ f.email().errors()[0].message }}</mat-error>
    }
  </mat-form-field>

  <mat-checkbox [field]="f.canReceiveNewsletter">Send me newsletters!</mat-checkbox>

  <button mat-button type="button" [disabled]="f().invalid()">Submit</button>
</form>
```

First, notice that we used the built-in ``email`` validator. There is not much to say about it, it's working as it always has, maybe just a bit less cumbersome to set up.

Secondly, let's talk ``required`` when it comes to the email. Our extra config so far consisted of just adding a ``message``, but now, we also added the ``when`` function. We can extract either ``value`` or ``valueOf`` from its input and use those to create our condition. This time I've opted for ``valueOf``, which receives ``p.canReceiveNewsletter`` as an input, which is our path to the appropriate signal and extracts its value for us. Since it is a boolean value, it returns either ``true`` or ``false``, which determines if the email input is required. Incredibly simple, right?

This is where I think we should mention ``disabled``. In its most simple form, we can just do the following and we're done:

```angular-ts
f = form(signal({
  firstName: '',
  lastName: ''
}), p => {
  disabled(p.lastName);
});
```

However, we can make this conditional too, by altering our config to this:

```angular-ts
disabled(p.lastName, ({ valueOf }) => valueOf(p.firstName) === 'Bálint');
```

It is a silly condition, but this way, if we set ``firstName`` to my name, ``lastName`` becomes disabled. If we remove or add a single character, it will be enabled instantly, which is a huge win for declarative coding.

## Cross-field validation

This example has been going around since we've got our first public demo a few weeks ago, but still, let's take a look at it:

```angular-html
<form>
  <mat-form-field>
    <mat-label>Password</mat-label>
    <input matInput [field]="f.password" />
  </mat-form-field>

  <mat-form-field>
    <mat-label>Confirm Password</mat-label>
    <input matInput [field]="f.confirm" />
  </mat-form-field>

  @if (f().errors()[0]?.kind === 'passwordMismatch') {
    <mat-error>{{ f().errors()[0]?.message }}</mat-error>
  }
</form>
```

```angular-ts
f = form(signal({
  password: '',
  confirm: ''
}), p => {
  required(p.password, { message: 'Password is required' });
  required(p.confirm, { message: 'Please confirm your password' });
  validate(p, ({ value }) => {
    if (value().password !== value().confirm) {
      return customError({ kind: 'passwordMismatch', message: 'The password and the password confirmation do not match' });
    }
    return [];
  });
});
```

With everything we have discussed so far, this is fairly straightforward, but there are some things worth mentioning. One being the general ``validate`` function. So far, we've only looked at built in validators, but if you need custom logic, this is how you handle it. Notice, that this time, I opted for ``value`` instead of ``valueOf``, but the concept is basically the same. We have access to the values in our form through invoking ``value``. The last thing I want to mention here is to take note of the ``customError`` function, which serves to create the error messages for our custom validators.

### Async validation

I think this is my favorite feature so far. First, in the repo containing this code, there is a server folder with a simple Express API, that contains these two endpoints, that return true or false depending on if the parameter matches my name:

```js
app.get('/api/validate/first-name/:name', (req, res) => {
  const name = req.params.name;
  if (name === 'Bálint') {
    res.json({ valid: false });
  }
  else {
    res.json({ valid: true });
  }
});

app.get('/api/validate/last-name/:name', (req, res) => {
  const name = req.params.name;
  if (name === 'Neuhausz') {
    res.json({ valid: false });
  }
  else {
    res.json({ valid: true });
  }
});
```

And here's our form definition:

```angular-ts
f = form(signal({
  firstName: '',
  lastName: ''
}), p => {
  validateHttp(p.firstName, {
    request: ({ value }) => { return value() ? `http://localhost:3000/api/validate/first-name/${value()}` : undefined },
    onSuccess(res: any) {
      if (!res.valid) {
        return [customError({ kind: 'notUnique', message: 'First name is not unique' })];
      }
      return null;
    },
    onError(error: unknown) {
      console.error('Async validation error:', error);
    },
  });
  validateAsync(p.lastName, {
    params: ({ value }) => value(),
    factory: (value) => resource({
      params: () => value(),
      loader: async ({ params }) => {
        if (!params) {
          return undefined;
        }
        const res = await fetch(`http://localhost:3000/api/validate/last-name/${params}`);
        return res.json();
      }
    }),
    onSuccess(res: any) {
      if (!res.valid) {
        return [customError({ kind: 'notUnique', message: 'Last name is not unique' })];
      }
      return null;
    },
    onError(error: unknown) {
      console.error('Async validation error:', error);
    },
  });
});
```

Yes, you see that right, we have several ways of handling async validation now. There is ``validateAsync``, which we use for ``lastName`` and it uses a ``resource``, but there is also ``validateHttp``, which builds on an ``httpResource``, [which we discussed just a few days ago.](https://bneuhausz.dev/blog/angular-httpresource) Personally, I highly prefer ``httpResource``, which is also experimental for now, but hey, signal forms are also highly experimental, so you probably shouldn't be thinking about using ``validateAsync`` or ``validateHttp`` for now.

> <sub>
  > <b>So it turns out, this issue mentioned below is working as intended. I was missguided in thinking that ``MatFormField`` needs to be ``dirty`` to start showing errors, but it needs to be ``touched`` instead.</b>
> </sub>

~~One thing I noticed here, is that change detection is a bit iffy with these async validators. On our button, ``[disabled]="f().invalid()"`` works perfectly, but our inputs only get into an error state, when we click out of them. Same thing happens with our error messages, so it seems that ``f.firstName().invalid()`` and ``f.firstName().errors()[0].message`` does not pick up the changes. Since everything is very new and experimental, it is no wonder that there are some issues, but it is equally likely that I just messed up something or I haven't noticed something very obvious. If I end up finding a fix for this, I will update this post.~~

I'm sure there will be lots of changes and additions to this new form type, so I feel like I have to say one more time that everything here is HIGHLY experimental, but I do think it looks great so far. The future is bright.

[A bit shorter article about server side validation after submitting has been released. Take a look!](https://bneuhausz.dev/blog/angular-signal-forms-applying-server-errors)