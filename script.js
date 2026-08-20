const button = document.getElementById('action-btn');
const message = document.getElementById('message');

button.addEventListener('click', () => {
  message.textContent = 'Merhaba! Sayfa çalışıyor 🎉';
});
