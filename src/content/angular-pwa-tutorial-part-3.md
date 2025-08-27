---
title: Angular PWA tutorial part 3 - Node backend for sending push notifications
slug: angular-pwa-tutorial-part-3
description: In part 3 of this series, we will implement a simple node backend to be able to send push notifications
date: 2025-08-27
coverImage: /images/node_js_header.svg
coverImageMedium: /images/node_js_header.svg
coverImageSmall: /images/node_js_header.svg
coverImageDescription: nodejs image
metaImage: https://bneuhausz.dev/images/bneuhausz_dev.png
metaImageDescription: bneuhausz.dev site logo
thumbnail: /images/node_js_icon.svg
thumbnailDescription: Node.js logo
icon: /images/node_js_icon.svg
iconDescription: Node.js logo
tags: [PWA, Node.js, Express]
shadowColor: nodejs
draft: false
---

# Angular PWA tutorial part 3 - Node backend for sending push notifications

Sending push notifications is a bit more complex than what we've dealt with before in this series and it requires a separate backend to provide security and reliability. In part 3 of this series, we will set up a very simple backend using Node.js and Express that will be more than enough for learning purposes.

You can find part 1 about the basic setup [here](https://bneuhausz.dev/blog/angular-pwa-tutorial-part-1) and part 2 about notifying your users about a new version of your application being available [here.](https://bneuhausz.dev/blog/angular-pwa-tutorial-part-2)

## Introducing VAPID

VAPID stands for Voluntary Application Server Identification. It is a security standard that allows push services to verify that the notification is coming from a legitimate application server and the server has permission to send messages to a specific user.

VAPID works using a public/private key pair. The public key can be safely shared with the client application, but the private key should be kept secret. The backend application will use the private key to sign the push requests you send and the push service will use the public key to verify the signature, to guarantee that:
- the request was sent by the authorized server
- the message has not been tampered with

Push services are provided by the browsers and their publishers (so Google or Mozilla for example), but in the past, if you wanted to send push notifications from a PWA, you had to register your app with each specific browser's push service to get an API key. VAPID enabled the standardization of this process.

This is likely more than enough to know about it, but in case you are interested, you can dive deeper [here.](https://datatracker.ietf.org/doc/html/draft-ietf-webpush-vapid-01)

## Generating your VAPID keys

Later, we'll use the [web-push](https://github.com/web-push-libs/web-push) package to send notifications, but we also need it to generate our VAPID keys, so let's install it:

```bash
npm install web-push -g
```

Then, to generate our key pair, let's run the following:

```bash
web-push generate-vapid-keys --json
```

The output should look something like this, obviously with different values:

```json
{"publicKey":"BFFkuSKeFvS13nlWyD...","privateKey":"52igq5YWuyXCaXls..."}
```

For now, we can put our keys aside, but do save them somewhere, because we will need them in a bit.

## Creating our Node.js application

First, for the sake of simplicity, in the root folder of our application, create a folder named ``push-notification-server``, open your terminal inside it and run the following:

```bash
npm init -y
```

This will initialize a Node.js project with default values. You should now see a ``package.json`` file in your folder, more or less with these contents:

```json
{
  "name": "push-notification-server",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": ""
}
```

If that is done, create a file named ``index.js`` inside the ``push-notification-server`` folder.

Now we'll install some packages we will use in our application:

```bash
npm install express web-push body-parser dotenv cors
```

With that, our basic setup is mostly done, let's get to the implementation.

## Setting up the environment

First things first, let's set up ``dotenv``. We've already installed the package in the last section. Now, let's create a file in the ``push-notification-server`` folder and name it ``.env``. In the GitHub repo for this project, you'll find a ``.env-example`` file with the following content:

```dotenv
VAPID_PUBLIC_KEY=DUMMY PUBLIC KEY
VAPID_PRIVATE_KEY=DUMMY PRIVATE KEY
```

Add this to your ``.env`` file and replace the dummy data with your generated VAPID keys. If you're done with that, let's get to ``index.js``.

## Writing the application logic

To get it out of the way, add the following to the top of ``index.js``:

```js
import express from 'express';
import webpush from 'web-push';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
```

After this, we will have access to the packages we've already installed. Now, to finish our environment setup and load the contents of the ``.env`` file into our application's environment, add the following line:

```js
dotenv.config();
```

Then, to set up ``web-push`` with our VAPID keys:

```js
webpush.setVapidDetails(
  'mailto:example@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);
```

The ``setVapidDetails`` function accepts 3 parameters. The public and private keys are self-explanatory, but it also expects a ``subject`` parameter. For learning purposes, this is mostly irrelevant, so you can just add the dummy address I did, but in a production environment, you should set it up with a real email or a contact form you can be reached at. It accepts a ``mailto:`` or an ``https:`` URL and it is used by push services to contact you in case of technical issues or if your private key got leaked and somebody is abusing it for example.

Now add the skeleton of our Express API:

```js
const app = express();
const port = 3000;
let subscription;

app.use(cors({
  origin: 'http://localhost:8080'
}));
app.use(bodyParser.json());

app.post('/subscribe', (req, res) => {
  console.log('Subscription received:', req.body);
  subscription = req.body;
  res.status(201).json({ message: 'subscription created' });
});

app.post('/notify', (req, res) => {
  console.log('Current subscription:', subscription);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
```

Let me explain this. With the ``express`` function, we create our Express application, that we can access through the ``app`` variable. We set the ``port`` variable to 3000, which is a fairly standard port when developing Express applications.

The ``subscription`` variable will be used to store our active subscription. This is sufficient for learning, but the data will be lost every time our application is restarted, so make sure to use some kind of persistent storage in a production environment. Also, this approach handles only 1 subscriber at a time, so keep that in mind.

With the ``cors`` package, we configure our Express app to allow requests from the port 8080, where our client application runs. This can look wildly different depending on your production environment, but CORS is entirely out of scope of this tutorial. If you are interested, you can read about it [here.](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)

Then, we configure our app to use ``body-parser`` to automatically parse incoming requests with a JSON body and make the data available in ``req.body``.

We've added two ``POST`` endpoints to our application, namely ``/subscribe`` and ``/notify``. These are just dummy endpoints for now, but we will expand on these in a moment, to handle our subscription and notification logic.

Finally, with ``app.listen``, we set our application to listen on port 3000.

With all this set up, you can run your application with

```bash
node index.js
```

Make sure to run this command in the ``push-notification-server`` folder. If everything works correctly, you should see ``Server is running at http://localhost:3000`` on your terminal.

While our app is running, we can send ``POST`` requests with Postman or the tool of your choice and we should see something like this as the output:

```bash
Server is running at http://localhost:3000
Subscription received: { test: 'test' }
Current subscription: [ { test: 'test' } ]
```

## Implementing subscription

The subscription logic is very simple, we just add the incoming request body to our ``subscription`` variable. We will discuss the data we receive in the next post, when we will implement the frontend for this feature.

```js
app.post('/subscribe', (req, res) => {
  subscription = req.body;
  res.status(201).send();
});
```

As you can see, the final code is functionally the same as before, we've just cleaned it up a little.

## Sending notifications

Since we have a very basic setup, this also becomes a fairly simple process. First, here is the complete endpoint:

```js
app.post('/notify', (req, res) => {
  const payload = {
    notification: {
      title: 'Test notification'
    }
  };

  webpush.sendNotification(subscription, JSON.stringify(payload))
    .then(() => res.status(204).send())
    .catch(err => {
      console.error('Error sending notification:', err);
      res.sendStatus(500);
    });
});
```

We have to create a notification. The only required field is the title, so we will go with that here, but you can set lots of things, like an icon or vibration patterns for example. You can read more about that [here.](https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification)

Then, we call ``sendNotification`` with our ``subscription`` and the stringified payload. That is literally all there is to it. Our application is ready to send notifications.

Again, we will discuss the contents of the ``subscription`` in the next part, when we implement the frontend, but until then, the complete code for this chapter is available [here.](https://github.com/bneuhausz/pwa-tutorial/tree/part-3)