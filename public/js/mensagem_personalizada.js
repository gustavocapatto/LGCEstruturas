function showAlert(message, type = 'info', duration = 1500) {
  const alertContainer = document.getElementById('alertContainer');
  const alertBox = document.getElementById('alertBox');
  const alertMessage = document.getElementById('alertMessage');
  const progressBar = document.getElementById('progressBar');

  alertMessage.textContent = message;
  alertBox.className = `alert alert-${type} fade show shadow-lg rounded`;

  alertContainer.style.display = 'block';
  alertContainer.classList.add('animate__animated', 'animate__fadeInDown');

  // Animação da barra de progresso
  let startTime = Date.now();
  progressBar.style.width = '0%';
  progressBar.style.backgroundColor = type === 'success' ? '#28a745' : type === 'danger' ? '#dc3545' : '#007bff';

  const interval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const progress = (elapsed / duration) * 100;
    progressBar.style.width = `${progress}%`;

    if (elapsed >= duration) {
      clearInterval(interval);
      alertContainer.classList.add('animate__fadeOutUp');
      setTimeout(() => alertContainer.style.display = 'none', 500); // Espera o tempo da animação
    }
  }, 50); // Atualização a cada 50ms
}
