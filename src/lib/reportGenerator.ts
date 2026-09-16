import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

export const exportDashboardToPDF = async (elementId: string, filename: string = 'DVAN-AI-Report.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    toast.error('Could not find dashboard to export.');
    return;
  }

  const toastId = toast.loading('Generating PDF report...');

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution
      useCORS: true,
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(filename);
    
    toast.success('Report downloaded successfully!', { id: toastId });
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error('Failed to generate PDF report.', { id: toastId });
  }
};
