export const printAscii = async () => {
  try {
    const response = await fetch(process.env.PUBLIC_URL + '/ascii/doll-life.txt');
    const text = await response.text();
    
    // Сохраняем оригинальный заголовок
    const originalTitle = document.title;
    
    // Создаем контейнер для печати
    const printContainer = document.createElement('div');
    printContainer.id = 'ascii-print-container';
    printContainer.style.cssText = 'display: none;';
    printContainer.innerHTML = text;
    document.body.appendChild(printContainer);

    // Добавляем стили для печати
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        /* Скрываем все, кроме контейнера ASCII */
        body > *:not(#ascii-print-container) {
          display: none !important;
        }
        
        /* Показываем и стилизуем контейнер ASCII */
        #ascii-print-container {
          display: block !important;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          padding: 20px;
          margin: 0;
          font-family: monospace;
          white-space: pre;
          font-size: 12px;
          line-height: 1;
          background: white;
          color: black;
          z-index: 9999;
        }
      }
    `;
    document.head.appendChild(style);

    // Изменяем заголовок для печати
    document.title = 'Amygdala Damage';

    // Печать и очистка
    window.print();
    
    // Удаляем элементы и восстанавливаем заголовок после закрытия диалога печати
    setTimeout(() => {
      document.body.removeChild(printContainer);
      document.head.removeChild(style);
      document.title = originalTitle;
    }, 0);
  } catch (error) {
    console.error('Error printing ASCII:', error);
  }
}; 