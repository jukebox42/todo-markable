import parseArgs from 'minimist';
import generate from './commands/generate';

const helpMessage = `
Usage:
  my-cli <command> [options]

Commands:
  generate <path>    Generates content from a JSON file at the specified path.
  help               Shows this help message.
`;

export function cli(args: string[]) {
    const argv = parseArgs(args.slice(2));
    const command: string = argv._[0];

    if (command === 'generate') {
        generate(argv);
    } else {
      console.log(helpMessage);
    }
}