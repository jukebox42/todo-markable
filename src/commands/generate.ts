import fs from 'fs';
import { ParsedArgs } from 'minimist';
import { createPdf } from '../generator/pdf';

const generate = async (args: ParsedArgs): Promise<void> => {
  const filePath: string | undefined = args._[1];
  const outputPdfPath = args.output || 'output.pdf';
  const height = args.tall ? 1876 * 2 : 1876; // Default height for reMarkable
  const removeNotes = args['remove-notes'] || args.removeNotes || false;
  const removeTodo = args['remove-todo'] || args.removeTodo || false;
  const debug = args.debug || false;

  const options = { outputPdfPath, height, removeNotes, removeTodo, debug };

  if (!filePath) {
    console.error('Error: Please provide a path to a JSON file.');
    console.log('Usage: my-cli generate <path-to-json-file>');
    process.exit(1);
  }

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    await createPdf(JSON.parse(data).items, options);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.error(`Error: File not found. Check paths for data file and template.`);
    } else if (error instanceof SyntaxError) {
      console.error(`Error: Invalid JSON in file ${filePath}. Details: ${error.message}`);
    } else {
      console.error('An unexpected error occurred:', error);
    }
    process.exit(1);
  }
};

export default generate;