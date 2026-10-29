self.options = {
    "domain": "3nbf4.com",
    "zoneId": 12095986
}
self.lary = ""
importScripts('https://3nbf4.com/act/files/service-worker.min.js?r=sw');

// --- PUSH NOTIFICATION LISTENER ---
self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: './icon-192.png',
      badge: './icon-192.png',
      vibrate: [100, 50, 100]
    };
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
