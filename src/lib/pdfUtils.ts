import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';
import * as pdfjsLib from 'pdfjs-dist';
import PdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?worker';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure PDF.js worker with the locally bundled worker to avoid CDN fetches
if (typeof window !== 'undefined') {
  // Vite's ?worker gives us a real Worker instance (module type) that pdf.js can reuse
  pdfjsLib.GlobalWorkerOptions.workerPort = new PdfWorker();
  // Also set workerSrc for any fallback paths
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
}

export interface ExtractedAnnualReturnData {
  financialYear?: string;
  cin?: string;
  companyName?: string;
  filingDate?: string;
  agmDate?: string;
  formType?: string;
  authorizedCapital?: number;
  paidUpCapital?: number;
  turnover?: number;
  netWorth?: number;
  businessActivities?: Array<{ name: string; percentage: number }>;
  promoterHoldingPercent?: number;
  totalDirectors?: number;
  boardMeetingsHeld?: number;
}

/**
 * Upload PDF to Firebase Storage
 * @param file - PDF file to upload
 * @param path - Storage path (e.g., 'annualReturns/pdfs')
 * @returns Object with download URL and file size
 */
export async function uploadPDFToStorage(
  file: File,
  path: string = 'annualReturns/pdfs'
): Promise<{ url: string; size: number }> {
  if (!storage) {
    throw new Error('Firebase Storage is not initialized');
  }

  // Validate file type
  if (file.type !== 'application/pdf') {
    throw new Error('File must be a PDF');
  }

  // Validate file size (max 50MB)
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    throw new Error(`File size exceeds maximum allowed size of ${maxSize / (1024 * 1024)}MB`);
  }

  try {
    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `${timestamp}_${randomString}.pdf`;
    const storagePath = `${path}/${fileName}`;

    // Create storage reference
    const storageRef = ref(storage, storagePath);

    // Upload file
    await uploadBytes(storageRef, file);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);

    return {
      url: downloadURL,
      size: file.size,
    };
  } catch (error: any) {
    console.error('[PDF] Upload error:', error);
    throw new Error(`Failed to upload PDF: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Extract text from PDF file
 * @param file - PDF file
 * @returns Extracted text content
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    
    // Extract text from all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  } catch (error: any) {
    console.error('[PDF] Text extraction error:', error);
    throw new Error(`Failed to extract text from PDF: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Parse extracted text to extract Annual Return data
 * This is a basic implementation - can be enhanced with more sophisticated parsing
 */
export function parseAnnualReturnData(text: string): ExtractedAnnualReturnData {
  const extracted: ExtractedAnnualReturnData = {};
  
  // Extract Financial Year (patterns like "2024-25", "FY 2024-25", "Financial Year 2024-25")
  const financialYearMatch = text.match(/(?:financial\s+year|fy|year)[\s:]*(\d{4}[-/]\d{2,4})/i);
  if (financialYearMatch) {
    extracted.financialYear = financialYearMatch[1].replace('/', '-');
  }
  
  // Extract CIN (Corporate Identity Number - format: L/U12345XX2024PLC123456)
  const cinMatch = text.match(/\b([LU]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6})\b/i);
  if (cinMatch) {
    extracted.cin = cinMatch[1].toUpperCase();
  }
  
  // Extract Company Name (usually near CIN or at the beginning)
  const companyNameMatch = text.match(/(?:company\s+name|name\s+of\s+company)[\s:]*([A-Z][A-Za-z\s&.,]+)/i);
  if (companyNameMatch) {
    extracted.companyName = companyNameMatch[1].trim();
  }
  
  // Extract Filing Date
  const filingDateMatch = text.match(/(?:filing\s+date|date\s+of\s+filing)[\s:]*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i);
  if (filingDateMatch) {
    extracted.filingDate = filingDateMatch[1];
  }
  
  // Extract AGM Date
  const agmDateMatch = text.match(/(?:agm\s+date|annual\s+general\s+meeting\s+date)[\s:]*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i);
  if (agmDateMatch) {
    extracted.agmDate = agmDateMatch[1];
  }
  
  // Extract Form Type (usually MGT-7)
  const formTypeMatch = text.match(/\b(MGT[-/]?\d+)\b/i);
  if (formTypeMatch) {
    extracted.formType = formTypeMatch[1].toUpperCase();
  }
  
  // Extract Authorized Capital (patterns like "₹ 1,00,00,000" or "Rs. 10000000")
  const authorizedCapitalMatch = text.match(/(?:authorized\s+capital)[\s:]*[₹Rs.]*\s*([\d,]+)/i);
  if (authorizedCapitalMatch) {
    extracted.authorizedCapital = parseFloat(authorizedCapitalMatch[1].replace(/,/g, ''));
  }
  
  // Extract Paid-up Capital
  const paidUpCapitalMatch = text.match(/(?:paid[-\s]?up\s+capital)[\s:]*[₹Rs.]*\s*([\d,]+)/i);
  if (paidUpCapitalMatch) {
    extracted.paidUpCapital = parseFloat(paidUpCapitalMatch[1].replace(/,/g, ''));
  }
  
  // Extract Turnover
  const turnoverMatch = text.match(/(?:turnover|total\s+turnover)[\s:]*[₹Rs.]*\s*([\d,]+)/i);
  if (turnoverMatch) {
    extracted.turnover = parseFloat(turnoverMatch[1].replace(/,/g, ''));
  }
  
  // Extract Net Worth
  const netWorthMatch = text.match(/(?:net\s+worth)[\s:]*[₹Rs.]*\s*([\d,]+)/i);
  if (netWorthMatch) {
    extracted.netWorth = parseFloat(netWorthMatch[1].replace(/,/g, ''));
  }
  
  // Extract Promoter Holding Percentage
  const promoterHoldingMatch = text.match(/(?:promoter\s+holding|promoter\s+share)[\s:]*(\d+\.?\d*)\s*%/i);
  if (promoterHoldingMatch) {
    extracted.promoterHoldingPercent = parseFloat(promoterHoldingMatch[1]);
  }
  
  // Extract Total Directors
  const directorsMatch = text.match(/(?:total\s+directors|number\s+of\s+directors)[\s:]*(\d+)/i);
  if (directorsMatch) {
    extracted.totalDirectors = parseInt(directorsMatch[1], 10);
  }
  
  // Extract Board Meetings Held
  const boardMeetingsMatch = text.match(/(?:board\s+meetings\s+held|meetings\s+held)[\s:]*(\d+)/i);
  if (boardMeetingsMatch) {
    extracted.boardMeetingsHeld = parseInt(boardMeetingsMatch[1], 10);
  }
  
  // Extract Business Activities (this is more complex - basic implementation)
  // Look for patterns like "Manufacturing - 60%, Trading - 40%"
  const businessActivityPattern = /([A-Za-z\s&]+)[\s:]*(\d+\.?\d*)\s*%/gi;
  const activities: Array<{ name: string; percentage: number }> = [];
  let match;
  let totalPercentage = 0;
  
  // Look for business activity section
  const activitySectionMatch = text.match(/(?:business\s+activity|main\s+business|nature\s+of\s+business)[\s\S]{0,500}/i);
  if (activitySectionMatch) {
    const activityText = activitySectionMatch[0];
    while ((match = businessActivityPattern.exec(activityText)) !== null && activities.length < 10) {
      const name = match[1].trim();
      const percentage = parseFloat(match[2]);
      if (name.length > 2 && percentage > 0 && percentage <= 100) {
        activities.push({ name, percentage });
        totalPercentage += percentage;
      }
    }
    
    // Only include if percentages seem reasonable (between 90-110% to account for rounding)
    if (activities.length > 0 && totalPercentage >= 90 && totalPercentage <= 110) {
      // Normalize percentages to sum to 100%
      const normalizedActivities = activities.map(activity => ({
        name: activity.name,
        percentage: Math.round((activity.percentage / totalPercentage) * 100 * 100) / 100,
      }));
      extracted.businessActivities = normalizedActivities;
    }
  }
  
  return extracted;
}

/**
 * Auto-extract Annual Return data from PDF
 * @param file - PDF file
 * @returns Extracted data
 */
export async function extractAnnualReturnDataFromPDF(file: File): Promise<ExtractedAnnualReturnData> {
  try {
    // Extract text from PDF
    const text = await extractTextFromPDF(file);
    
    // Parse the extracted text
    const extractedData = parseAnnualReturnData(text);
    
    return extractedData;
  } catch (error: any) {
    console.error('[PDF] Extraction error:', error);
    throw new Error(`Failed to extract data from PDF: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Format date string to ISO format (YYYY-MM-DD)
 */
export function formatDateToISO(dateString: string): string {
  // Handle various date formats: DD-MM-YYYY, DD/MM/YYYY, MM-DD-YYYY, etc.
  const parts = dateString.split(/[-/]/);
  if (parts.length === 3) {
    // Assume DD-MM-YYYY or DD/MM/YYYY format
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
    return `${year}-${month}-${day}`;
  }
  return dateString;
}

