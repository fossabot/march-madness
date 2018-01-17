# March Madness: DP18

Sample Custom App that creates Head 2 Head scenarios to help you build your 2018 bracket. We've provided
a base, working app that demonstrates the use of Webpack to bundle your assets. During the course we will work
on adding more advanced features. Please refer to the links below for a state of the app at the end of each
milestone.

## Milestones

### [User Configuration](tree/feat/configuration)

```git checkout feat/configuration```

Demonstrates how to leverage a Domo dataset as your user configuration, enabling your app to be
easily configured without hard-coding parameters in your app.

### [Handling Data Updates](tree/feat/on-data-update)

```git checkout feat/on-data-update```

Domo Apps behave just like standard Domo cards when data is updated, they are reloaded. Learn
how to handle these events to prevent unwanted reloads when your user is in the middle of an operation.

### [Full Screen](tree/feat/fullscreen)

```git checkout feat/fullscreen```

Sometimes your app use case calls for a fullscreen display (think an app on a wall display) and you'd 
like to go from the standard page-view straight to fullscreen without going through the nested
context menus.

### [Navigation](tree/feat/domo-navigation)

```git checkout feat/domo-navigation```

How do Domo Apps handle navigation to internal pages and external websites? 

### [Persistent State](tree/feat/persist-state)

```git checkout feat/persist-state```

Your app is a super app that allows data selection and filtering. Your user takes 10 minutes 
slicing and dicing the data to get to the perfect view - and then has to leave the page...

Will your user have to reselect all of those options again?

### [All Features](tree/feat/all)

```git checkout feat/all```

Showing the app with all of these features combined.

## Technologies Uses

* Webpack Bundles
* Domo Query Library
* ES6+ support via Babel
* Sass style sheets

## Scripts

* `npm start` or `yarn start` will start a local development server that proxies data requests to your Domo instance
* `npm run build` or `yarn build` will bundle your `src` files into a single `bundle.js` using Webpack
* `npm run upload` or `yarn upload` will build your app and publish it to your Domo instance.


