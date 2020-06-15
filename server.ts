import 'zone.js/dist/zone-node';
import { enableProdMode } from '@angular/core';
// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

import * as express from 'express';
import { join } from 'path';
import * as bodyParser from 'body-parser';

import fetch from 'node-fetch';

// add Gzip
const compression = require('compression');

// const yes = require('yes-https'); // force https
const domino = require('domino');
const fs = require('fs');
const webpush = require('web-push');
const template = fs
  .readFileSync(join(process.cwd(), 'dist/browser/index.html'))
  .toString();

const win = domino.createWindow(template);

win.fetch = fetch;
global['window'] = win;
global['Event'] = win.Event;
global['Event']['prototype'] = win.Event.prototype;
global['document'] = win.document;
// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
export const app = express();
// app.use(yes()); // apply https
const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist/browser');
// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const {
  AppServerModuleNgFactory,
  LAZY_MODULE_MAP
} = require('./dist/server/main');

const rendertron = require('rendertron-middleware');
const botUserAgents = [
  'Baiduspider',
  'bingbot',
  'Embedly',
  'facebookexternalhit',
  'LinkedInBot',
  'outbrain',
  'pinterest',
  'quora link preview',
  'rogerbot',
  'showyoubot',
  'Slackbot',
  'TelegramBot',
  'Twitterbot',
  'vkShare',
  'W3C_Validator',
  'WhatsApp',
  'googlebot',
  'iframely',
  'opengraphcheck',
  'facebook'
];
const BOTS = rendertron.botUserAgents.concat(botUserAgents);
const BOT_UA_PATTERN = new RegExp(BOTS.join('|'), 'i');
// console.log('BOT_UA_PATTERN', BOT_UA_PATTERN);

const usersSub = {};
const unknownUserId = '0';
const vapidKeys = {
  publicKey:
    'BHOA3CKDQm81Wjwpr-BfUceN_hPI1YsuK9jTo_k4F1yZ9N4hXUS4YFwn4RzJkevA6BXYGmUfpMojWp0V12duoW8',
  privateKey: 'ZeakEq1SRhsTjqDS2utLxqOHRAda1XARSw-FBJxEwJs'
};

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine(
  'html',
  ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [provideModuleMap(LAZY_MODULE_MAP)]
  })
);

app.use(bodyParser.json());

// user Gzip
app.use(compression());

app.get('/api/admin/login', (req, res) => {
  res.status(201).redirect(301, 'https://leads.ourbetterworld.org/user/login');
});

app.post('/logout', (req, res) => {
  const userId = req.body.id;
  const subs = usersSub[userId];
  // console.log('[logout] subs', subs);
  console.log('[logout] userId', userId);
  console.log('[logout] usersSub', usersSub);

  if (userId === '0') {
    res.status(401).json({ message: 'User id 0 is not accepted' });
    return;
  }

  res.set('Content-Type', 'application/json');
  webpush.setVapidDetails(
    'mailto:storyteller@ourbetterworld.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );

  const notificationPayload = JSON.stringify({
    notification: {
      title: 'User logout',
      body: 'Your account has been logged out',
      type: 'logout'
    }
  });

  if (subs && subs.length > 0) {
    Promise.all(
      subs.map(sub => {
        // console.log('[logout] endpoint', sub.endpoint);
        webpush.sendNotification(sub, notificationPayload);
      })
    )
      .then(() => {
        usersSub[userId] = [];
        if (subs && subs.length > 1) {
          usersSub[unknownUserId].push(...subs);
        }
        // console.log('[logout] usersSub after delete', usersSub);
        res
          .status(200)
          .json({ message: `User with id ${userId} has been logged out` });
      })
      .catch(err => {
        console.error('Error sending notification, reason: ', err);
        res.sendStatus(500);
      });
  } else {
    res.status(404).json({ message: `There are no users have id ${userId}` });
  }
});

app.post('/profile', (req, res) => {
  const userId = req.body.id;
  const subs = usersSub[userId];

  // if (userId === '0') {
  //   res.status(401).json({ message: 'User id 0 is not accepted' });
  //   return;
  // }

  res.set('Content-Type', 'application/json');
  webpush.setVapidDetails(
    'mailto:storyteller@ourbetterworld.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );

  const notificationPayload = JSON.stringify({
    notification: {
      title: 'User profile',
      body: 'Your profile has been changed',
      type: 'update_profile'
    }
  });

  if (subs && subs.length > 0) {
    Promise.all(
      subs.map(sub => {
        webpush.sendNotification(sub, notificationPayload);
      })
    )
      .then(() => {
        res.status(200).json({
          message: `User's profile with id ${userId} has been changed`
        });
      })
      .catch(err => {
        console.error('Error sending notification, reason: ', err);
        res.sendStatus(500);
      });
  } else {
    res.status(404).json({ message: `There are no users have id ${userId}` });
  }
});

app.post('/subscribe', (req, res) => {
  const userId = req.body.id === unknownUserId ? unknownUserId : req.body.id;
  const sub = req.body.sub;

  if (!usersSub[userId]) {
    usersSub[userId] = [];
  }
  if (!(sub in usersSub[userId])) {
    usersSub[userId].push(sub);
  }

  console.log('[subscribe] userId:', userId);
  // console.log('[subscribe] usersSub:', Object.keys(usersSub));
  console.log('[subscribe] usersSub:', usersSub);
  // console.log('[subscribe] sub', sub);

  res.set('Content-Type', 'application/json');
  webpush.setVapidDetails(
    'mailto:storyteller@ourbetterworld.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );

  Promise.resolve(webpush.sendNotification(sub))
    .then(() =>
      res.status(200).json({
        message: 'Notification sent'
      })
    )
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
});

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

// Example Express Rest API endpoints
// app.get('/api/**', (req, res) => { });
// Serve static files from /browser
app.get(
  '*.*',
  express.static(DIST_FOLDER, {
    maxAge: '1y'
  })
);

// // force https by function
// app.use(function(request, response) {
//   if (!request.secure) {
//     response.redirect('https://' + request.headers.host + request.url);
//   }
// });

app.use(
  rendertron.makeMiddleware({
    proxyUrl: 'https://seo-dot-obw-platform.appspot.com/render',
    userAgentPattern: BOT_UA_PATTERN
  })
);

// All regular routes use the Universal engine
// app.get('*', (req, res) => {
//   res.render('index', {req, res}, (err, html) => {
//     console.log(req.originalUrl);
//     if (html) {
//       console.log(req.originalUrl);
//       //res.send(JSON.stringify(req.rawHeaders));
//       res.send(html);
//     }
//   });
// });
app.get('*', (req, res) => {
  res.render(join(DIST_FOLDER, 'index.html'), { req });
});

// // Start up the Node server
// app.listen(PORT, () => {
//   console.log(`Node server listening on http://localhost:${PORT}`);
// });
