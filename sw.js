importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');

if (workbox) {
    console.log(`Yay! Workbox is loaded 🎉`);
} else {
    console.log(`Boo! Workbox didn't load 😬`);
}

workbox.precaching.precacheAndRoute([
    'index.html',
    'assets/imgs/island-one.jpg'
])

workbox.routing.registerRoute(/.*\.css/, workbox.strategies.staleWhileRevalidate({
    name: 'css-cache'
}))
workbox.routing.registerRoute(/.*\.js/, workbox.strategies.staleWhileRevalidate({
    name: 'js-cache'
}))
