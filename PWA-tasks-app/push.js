const VAPID_PUBLIC_KEY = 'BMg07c1DpUCDWQBih3x53_UF-GJm0b3ObsXZGEUkIPIDBKSgz7QQryuL-4wOmVURPJIF9d08Ozm2NOAzuaBM4qc'; // Замените на реальный ключ
const notifyBtn = document.getElementById('notify-btn');
const statusEl = document.getElementById('notification-status');

console.log('Initializing notification service...');

function checkNotificationSupport() {
  console.log('Checking notification support...');
  
  if (!('Notification' in window)) {
    console.warn('Browser does not support Notifications');
    statusEl.textContent = 'Браузер не поддерживает уведомления';
    notifyBtn.disabled = true;
    return false;
  }
  
  if (!('serviceWorker' in navigator)) {
    console.warn('Browser does not support Service Workers');
    statusEl.textContent = 'Service Worker не поддерживается';
    notifyBtn.disabled = true;
    return false;
  }
  
  if (!('PushManager' in window)) {
    console.warn('Browser does not support Push API');
    statusEl.textContent = 'Push API не поддерживается';
    notifyBtn.disabled = true;
    return false;
  }
  
  console.log('All required APIs are supported');
  return true;
}

async function initializeNotifications() {
  console.log('Initializing notifications...');
  
  if (!checkNotificationSupport()) return;

  try {
    console.log('Requesting notification permission...');
    const permission = await Notification.requestPermission();
    console.log('Notification permission status:', permission);
    
    console.log('Getting service worker registration...');
    const reg = await navigator.serviceWorker.ready;
    
    console.log('Checking existing subscription...');
    const subscription = await reg.pushManager.getSubscription();

    if (subscription) {
      console.log('Existing subscription found:', subscription);
      updateUI(true);
    } else {
      console.log('No existing subscription found');
      updateUI(false);
    }
  } catch (error) {
    console.error('Error during initialization:', error);
  }
}

function updateUI(isSubscribed) {
  console.log(`Updating UI. Subscribed: ${isSubscribed}`);
  
  if (isSubscribed) {
    notifyBtn.textContent = 'Отключить уведомления';
    statusEl.textContent = 'Уведомления включены';
    statusEl.style.color = 'green';
  } else {
    notifyBtn.textContent = 'Включить уведомления';
    statusEl.textContent = 'Уведомления отключены';
    statusEl.style.color = 'red';
  }
}

async function subscribeToPush() {
  console.log('Attempting to subscribe to push notifications...');
  
  try {
    const reg = await navigator.serviceWorker.ready;
    console.log('ServiceWorker registration ready');
    
    console.log('Subscribing to push service...');
    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });

    console.log('Push subscription successful:', subscription);
    return true;
  } catch (error) {
    console.error('Push subscription failed:', error);
    return false;
  }
}

async function unsubscribeFromPush() {
  console.log('Attempting to unsubscribe from push notifications...');
  
  try {
    const reg = await navigator.serviceWorker.ready;
    console.log('ServiceWorker registration ready');
    
    console.log('Getting current subscription...');
    const subscription = await reg.pushManager.getSubscription();
    
    if (subscription) {
      console.log('Found existing subscription, unsubscribing...');
      await subscription.unsubscribe();
      console.log('Unsubscription successful');
      return true;
    }
    
    console.log('No subscription found to unsubscribe from');
    return false;
  } catch (error) {
    console.error('Unsubscription failed:', error);
    return false;
  }
}

notifyBtn.addEventListener('click', async () => {
  console.log('Notification button clicked');
  
  try {
    const reg = await navigator.serviceWorker.ready;
    console.log('ServiceWorker registration ready');
    
    const subscription = await reg.pushManager.getSubscription();
    console.log('Current subscription:', subscription);

    if (subscription) {
      console.log('Existing subscription found, attempting to unsubscribe...');
      const success = await unsubscribeFromPush();
      if (success) {
        console.log('Unsubscribe successful, updating UI...');
        updateUI(false);
      }
    } else {
      console.log('No subscription found, requesting permission...');
      const permission = await Notification.requestPermission();
      console.log('Permission result:', permission);
      
      if (permission === 'granted') {
        console.log('Permission granted, attempting to subscribe...');
        const success = await subscribeToPush();
        if (success) {
          console.log('Subscribe successful, updating UI...');
          updateUI(true);
        }
      } else {
        console.log('Permission not granted:', permission);
      }
    }
  } catch (error) {
    console.error('Error in button click handler:', error);
  }
});

function showNotification(title, body) {
  console.log(`Attempting to show notification: ${title} - ${body}`);
  
  if (Notification.permission === 'granted') {
    console.log('Permission granted, showing notification...');
    navigator.serviceWorker.ready.then(reg => {
      reg.showNotification(title, { 
        body,
        icon: '/icons/icon-192.png',
        vibrate: [200, 100, 200]
      });
      console.log('Notification shown successfully');
    }).catch(error => {
      console.error('Error showing notification:', error);
    });
  } else {
    console.log('Cannot show notification - permission not granted');
  }
}

function urlBase64ToUint8Array(base64String) {
  console.log('Converting VAPID public key...');
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  console.log('Key conversion complete');
  return outputArray;
}

window.addEventListener('load', () => {
  console.log('Window loaded, initializing notifications...');
  initializeNotifications().catch(error => {
    console.error('Initialization error:', error);
  });
});

function hasUncompletedTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  return tasks.some(task => !task.completed);
}

async function startTaskReminders() {
  if (!('serviceWorker' in navigator)) return;
  if (!('PeriodicSyncManager' in window)) {
    console.warn('Periodic Sync API не поддерживается, используем интервалы');
    // Fallback для браузеров без PeriodicSync API
    setInterval(() => {
      if (hasUncompletedTasks()) {
        showReminderNotification();
      }
    }, 2 * 60 * 60 * 1000); // 2 часа
    return;
  }

  try {
    const reg = await navigator.serviceWorker.ready;
    try {
      await reg.periodicSync.register('check-tasks-reminder', {
        minInterval: 2 * 60 * 60 * 1000 // 2 часа
      });
      console.log('Периодические напоминания зарегистрированы');
    } catch (error) {
      console.error('Ошибка регистрации периодических напоминаний:', error);
    }
  } catch (error) {
    console.error('Ошибка доступа к Service Worker:', error);
  }
}

function showReminderNotification() {
  if (Notification.permission !== 'granted') return;
  
  const tasks = JSON.parse(localStorage.getItem('tasks') || []);
  const uncompletedCount = tasks.filter(task => !task.completed).length;
  
  if (uncompletedCount > 0) {
    navigator.serviceWorker.ready.then(reg => {
      reg.showNotification('Невыполненные задачи', {
        body: `У вас ${uncompletedCount} невыполненных задач`,
        icon: '/icons/icon-192.png',
        vibrate: [200, 100, 200]
      });
    });
  }
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data.type === 'check-uncompleted-tasks') {
      if (hasUncompletedTasks()) {
        showReminderNotification();
      }
    }
  });
}

window.addEventListener('load', () => {
  loadTasks();
  updateOnlineStatus();
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        console.log('SW registered');
        startTaskReminders();
      })
      .catch(err => console.log('SW registration failed: ', err));
  }
});
