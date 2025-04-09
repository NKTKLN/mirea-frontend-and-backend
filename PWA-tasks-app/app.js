const input = document.getElementById('note-input');
const addButton = document.getElementById('add-note');
const notesList = document.getElementById('notes-list');

function loadNotes() {
  const notes = JSON.parse(localStorage.getItem('notes') || '[]');
  notesList.innerHTML = '';
  notes.forEach((note, index) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${note}</span><button onclick="deleteNote(${index})">Удалить</button>`;
    notesList.appendChild(li);
  });
}

function addNote() {
  const text = input.value.trim();
  if (!text) return;
  const notes = JSON.parse(localStorage.getItem('notes') || '[]');
  notes.push(text);
  localStorage.setItem('notes', JSON.stringify(notes));
  input.value = '';
  loadNotes();
}

function deleteNote(index) {
  const notes = JSON.parse(localStorage.getItem('notes') || '[]');
  notes.splice(index, 1);
  localStorage.setItem('notes', JSON.stringify(notes));
  loadNotes();
}

addButton.addEventListener('click', addNote);
window.addEventListener('load', () => {
  loadNotes();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
});

function updateOnlineStatus() {
  const banner = document.getElementById('offline-indicator');
  banner.style.display = navigator.onLine ? 'none' : 'block';
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
updateOnlineStatus();
