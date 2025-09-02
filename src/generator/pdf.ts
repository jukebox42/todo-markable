import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import puppeteer from 'puppeteer';

Handlebars.registerHelper('eq', (a: number, b: number) => a === b);
Handlebars.registerHelper('toAnchor', (item: string) => item.replace(/\s+/g, '-').toLowerCase());

type Data = {
  [key: string]: any
}

type PdfOptions = {
  height: number;
  outputPdfPath: string;
  removeNotes: boolean;
  removeTodo: boolean;
  debug: boolean;
}

const getImageDataUri = (imagePath: string): string => {
  if (!fs.existsSync(imagePath)) {
    throw new Error(`Image file not found at ${imagePath}`);
  }
  const imageBase64 = fs.readFileSync(imagePath, 'base64');
  console.log(`- ✅ Image read.`);
  return `data:image/png;base64,${imageBase64}`;
}

const parseTemplate = (templateName: string, data: Data): string => {
  const templatePath = path.join(__dirname, '..', 'assets', templateName);
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template file not found at ${templatePath}`);
  }
  const templateFile = fs.readFileSync(templatePath, 'utf8');
  const parsedTemplate = Handlebars.compile(templateFile);
  const result = parsedTemplate(data);
  console.log(`- ✅ Template ${templateName} parsed.`);
  return result;
}

/**
 * Saves the PDF pages to a single PDF file.
 */
export const savePdf = async (html: string, options: PdfOptions) => {
  console.log(`Saving PDF to ${options.outputPdfPath}...`);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({
    printBackground: true,
    width: "1404px",
    height: `${options.height}px`,
    margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
  });

  await browser.close();

  fs.writeFileSync(options.outputPdfPath, pdfBuffer);
  console.log(`- ✅ PDF successfully generated at ${options.outputPdfPath}`);
}

/**
 * Creates a PDF from an array of items.
 */
export const createPdf = async (items: string[], options: PdfOptions) => {
  console.log("Creating PDF pages...");
  const fullItems = [...items];
  if (!options.removeTodo) {
    fullItems.unshift('Todo');
  }
  if (!options.removeNotes) {
    fullItems.push('Notes');
  }
  const pages = fullItems.map((_, index) => {
    const data: Data = {
      items: fullItems,
      activeIndex: index,
    };
    return parseTemplate('page.handlebars', data);
  });
  console.log(`- ✅ Created pages: ${pages.length}`);

  console.log("Compiling template...");

  // Read the background image and convert it to a data URI
  const bgImageDataUri = getImageDataUri(path.join(__dirname, '..', 'assets', 'bg.png'));

  // Read the CSS file
  const colors: Data = {
    background: '#FFFFFF',
    primary: '#000000',
    secondary: '#666666',
  }
  const css = parseTemplate('style.css.handlebars', { bgImageDataUri, colors, height: options.height });

  // Read and compile the main template
  const html = parseTemplate('template.handlebars', { pages, css });
  
  if (options.debug) {
    fs.writeFileSync('debug.html', html);
    console.log("✅ Final HTML output written to debug.html for inspection.");
  }

  savePdf(html, options);
}

