function showAlert(message, type = 'info', duration = 1500) {
  const alertContainer = document.getElementById('alertContainer');
  const alertBox = document.getElementById('alertBox');
  const alertMessage = document.getElementById('alertMessage');
  const progressBar = document.getElementById('progressBar');

  alertMessage.textContent = message;
  alertBox.className = `alert alert-${type} alert-dismissible fade show`;

  alertContainer.style.display = 'block';

  // Animação da barra de progresso
  let startTime = Date.now();
  progressBar.style.width = '0%';
  progressBar.style.backgroundColor = type === 'success' ? 'green' : type === 'danger' ? 'red' : 'blue';

  const interval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const progress = (elapsed / duration) * 100;
    progressBar.style.width = `${progress}%`;

    if (elapsed >= duration) {
      clearInterval(interval);
      alertContainer.style.display = 'none';
    }
  }, 50); // Atualização a cada 50ms
}

  