const CACHE_NAME = 'task-pwa-cache-v3';
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/push.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-tasks-reminder') {
    event.waitUntil(checkUncompletedTasks());
  }
});

async function checkUncompletedTasks() {
  const clientsList = await clients.matchAll({ includeUncontrolled: true });
  for (const client of clientsList) {
    client.postMessage({ type: 'check-uncompleted-tasks' });
  }
}

self.addEventListener('message', (event) => {
  if (event.data.type === 'trigger-reminder') {
    self.registration.showNotification('Напоминание о задачах', {
      body: 'У вас есть невыполненные задачи!',
      icon: '/icons/icon-192.png',
      vibrate: [200, 100, 200]
    });
  }
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(res => res || fetch(event.request))
  );
});

self.addEventListener('push', event => {
  let data = { title: 'Новое уведомление', body: 'У вас новое сообщение' };
  
  try {
    data = event.data.json();
  } catch (e) {
    console.log('Push данные не в JSON формате', e);
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      vibrate: [200, 100, 200],
      data: { url: data.url || '/' }
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
