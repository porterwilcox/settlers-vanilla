importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

workbox.precaching.precacheAndRoute([
    'index.html',
    'app/main.js',
    'assets/style.css',
    'assets/imgs/island-one.jpg'
])

// workbox.routing.registerRoute(
//     new RegExp('.*\.js'),
//     workbox.strategies.networkFirst()
//   );

//   workbox.routing.registerRoute(/.*\.css/, workbox.strategies.staleWhileRevalidate({
//       name: 'css-cache'
//   }))