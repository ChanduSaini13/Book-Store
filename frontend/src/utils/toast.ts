let toastTimeout: ReturnType<typeof setTimeout>;

const removeToast = (element: HTMLElement) => {
  element.classList.add('opacity-0', 'translate-y-2');
  setTimeout(() => element.remove(), 300);
};

export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 3000) => {
  clearTimeout(toastTimeout);

  const container = document.getElementById('toast-container') || (() => {
    const div = document.createElement('div');
    div.id = 'toast-container';
    div.className = 'fixed top-4 right-4 z-50 space-y-2 pointer-events-none';
    document.body.appendChild(div);
    return div;
  })();

  const toast = document.createElement('div');
  const bgColor =
    type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  const icon =
    type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';

  toast.className = `${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between gap-3 opacity-100 translate-y-0 transition-all duration-300 pointer-events-auto`;
  
  const content = document.createElement('div');
  content.className = 'flex items-center gap-2';
  content.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'text-white hover:opacity-75 transition-opacity flex-shrink-0';
  closeBtn.innerHTML = '×';
  closeBtn.style.fontSize = '20px';
  closeBtn.style.border = 'none';
  closeBtn.style.background = 'none';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.padding = '0';
  closeBtn.onclick = () => removeToast(toast);

  toast.appendChild(content);
  toast.appendChild(closeBtn);
  container.appendChild(toast);

  toastTimeout = setTimeout(() => removeToast(toast), duration);
};
