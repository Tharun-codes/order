(() => {
  if (window.showPopup) return;

  const defaultTitles = {
    success: 'Success',
    error: 'Something went wrong',
    warning: 'Check this',
    info: 'Notice'
  };

  const stack = document.createElement('div');
  stack.className = 'popup-stack';
  document.body.appendChild(stack);

  const overlay = document.createElement('div');
  overlay.className = 'popup-overlay';
  overlay.innerHTML = `
    <div class="confirm-popup" role="dialog" aria-modal="true" aria-labelledby="confirmTitle">
      <h4 id="confirmTitle"></h4>
      <p id="confirmMessage"></p>
      <div class="popup-actions">
        <button type="button" class="cancel">Cancel</button>
        <button type="button" class="confirm">Confirm</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const confirmTitle = overlay.querySelector('#confirmTitle');
  const confirmMessage = overlay.querySelector('#confirmMessage');
  const cancelBtn = overlay.querySelector('.cancel');
  const confirmBtn = overlay.querySelector('.confirm');

  function removeToast(el) {
    if (!el) return;
    el.classList.remove('show');
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 250);
  }

  window.showPopup = function (message, type = 'info', options = {}) {
    if (typeof message === 'object') {
      options = message;
      message = options.message || '';
      type = options.type || 'info';
    }
    const title = options.title || defaultTitles[type] || defaultTitles.info;
    const duration = options.duration === undefined ? (type === 'error' ? 4500 : 3200) : options.duration;

    const popup = document.createElement('div');
    popup.className = `app-popup ${type}`;
    popup.innerHTML = `
      <button class="popup-close" aria-label="Close">&times;</button>
      <h4>${title}</h4>
      <p>${message}</p>
    `;

    popup.querySelector('.popup-close').addEventListener('click', () => removeToast(popup));
    stack.appendChild(popup);

    requestAnimationFrame(() => popup.classList.add('show'));

    if (duration !== null) {
      setTimeout(() => removeToast(popup), duration);
    }
    return popup;
  };

  window.showConfirmPopup = function ({
    title = 'Please confirm',
    message = 'Are you sure?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'confirm'
  } = {}) {
    return new Promise((resolve) => {
      confirmTitle.textContent = title;
      confirmMessage.textContent = message;
      cancelBtn.textContent = cancelText;
      confirmBtn.textContent = confirmText;

      confirmBtn.classList.remove('danger');
      if (variant === 'danger') {
        confirmBtn.classList.add('danger');
      }

      overlay.classList.add('show');

      function cleanup(result) {
        overlay.classList.remove('show');
        cancelBtn.onclick = null;
        confirmBtn.onclick = null;
        overlay.onclick = null;
        resolve(result);
      }

      cancelBtn.onclick = () => cleanup(false);
      confirmBtn.onclick = () => cleanup(true);
      overlay.onclick = (e) => {
        if (e.target === overlay) cleanup(false);
      };
    });
  };
})();



