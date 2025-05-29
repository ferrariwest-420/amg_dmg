export const printAscii = async () => {
  try {
    const response = await fetch(process.env.PUBLIC_URL + '/ascii/doll-life.txt');
    const text = await response.text();
    
    // Save original title
    const originalTitle = document.title;
    
    // Create print-only container
    const printContainer = document.createElement('div');
    printContainer.id = 'ascii-print-container';
    printContainer.style.cssText = 'display: none;';
    printContainer.innerHTML = text;
    document.body.appendChild(printContainer);

    // Add print styles
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        /* Hide everything except our ASCII container */
        body > *:not(#ascii-print-container) {
          display: none !important;
        }
        
        /* Show and style ASCII container */
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

    // Change title for printing
    document.title = 'Amygdala Damage';

    // Print and cleanup
    window.print();
    
    // Remove elements and restore title after print dialog closes
    setTimeout(() => {
      document.body.removeChild(printContainer);
      document.head.removeChild(style);
      document.title = originalTitle;
    }, 0);
  } catch (error) {
    console.error('Error printing ASCII:', error);
  }
}; 