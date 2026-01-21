import { useCallback } from 'react';
import { pixelsToRem } from '@utils/Text';

/**
 * This describes the mouse props
 *
 * @typeParam width: number - Width on pixels for define size of window
 * @typeParam height: number - Height on pixels for define size of window
 * @typeParam idContainer: string - Id container to print
 * @typeParam styleContainer: string -  Optional styles to set in Container
 * @typeParam fileName?: string - Optional prop for pdf name
 */
interface IUsePrintWindowOptions {
    width: number;
    height: number;
    idContainer: string;
    styleContainer?: string;
    fileName?: string;
}

/**
 * Provides a custom hook to open a new printing window with specific content and styles.
 * This function prepares a new browser window, injects HTML content with styles, and handles the printing process.
 *
 * @typeParam width - number - The width of the printing window in pixels.
 * @typeParam height - number - The height of the printing window in pixels.
 * @typeParam idContainer - string - The ID of the HTML element whose contents will be printed.
 * @typeParam styleContainer - string - Additional CSS styles to apply to the print container.
 * @returns () => Promise<void> A function that, when executed, opens the print window, handles the printing, and then closes the window.
 */
export const usePrintWindow = ({
    width,
    height,
    idContainer,
    styleContainer,
    fileName,
}: IUsePrintWindowOptions): (() => Promise<void>) => {
    const printContent = useCallback((): Promise<void> => {
        return new Promise<void>(resolve => {
            const content = document.getElementById(idContainer);
            const borderColor = '#D9D9D9';
            if (!content) {
                alert('No se encontró el contenido a imprimir.');
                return;
            }
            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleString('es', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
            });

            const windowFeatures = `left=0,top=0,width=${width},height=${height},toolbar=0,scrollbars=0,status=0`;
            const printWindow = window.open('', '', windowFeatures);

            if (!printWindow) {
                alert('La ventana de impresión no se pudo abrir. Por favor, verifica las configuraciones de tu navegador.');
                return;
            }

            const html = `
      <html>
        <head>
          <title>${fileName}</title>
          ${Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
              .map(style => style.outerHTML)
              .join('')}
          <style>
            @page { size: landscape; margin-top: 2.375rem; }
            body { width: ${pixelsToRem(width)}rem; height: ${pixelsToRem(
                height
            )}rem; transform: scale(1); transform-origin: top left; overflow: hidden; background-color: #fff; margin: 0; padding-top:2.375rem;  }
            * {
            box-shadow: none !important; 
            text-shadow: none !important; 
            }
            .card {
                border: 0.0625rem solid ${borderColor} !important;
                overflow: hidden !important;
            }
            .bread-crumb{ margin-top: -1.25rem}
            html { overflow: hidden; }
            .print-container { ${styleContainer} }
            .print-header {
                text-align: center;
                font-size: 0.75rem;
                color: #0B2C4C;
                font: aller;
              }
            .print-margin { margin-right:6.25rem; }
            .print-justify { justify-content:start !important; }
         
             .recharts-surface {
                max-height: 60% !important;
                max-width: 60% !important;
             }
          </style>
        </head>
        <body >
            <div class="print-container">
            ${content.innerHTML}
            </div>
        </body>
      </html>
    `;

            printWindow.document.write(html);
            printWindow.document.close();

            const checkLoaded = (): void => {
                const isComplete = Array.from(printWindow.document.images).every(img => img.complete);
                const allElementsReady = printWindow.document.readyState === 'complete';

                if (isComplete && allElementsReady) {
                    printWindow.onload = null;
                    const printDate = printWindow.document.getElementById('downloadDate');
                    if (printDate) printDate.textContent = `Día de descarga: ${formattedDate}`;
                    printWindow.print();
                    printWindow.close();
                    resolve();
                } else {
                    setTimeout(checkLoaded, 500);
                }
            };

            printWindow.onload = checkLoaded;
        });
    }, [width, height, idContainer, styleContainer]);

    return printContent;
};
