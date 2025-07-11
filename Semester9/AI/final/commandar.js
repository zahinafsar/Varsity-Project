const { program } = require('commander');

program
  .version('1.0.0')
  .option('-n, --name <type>', 'Your name')
  .option('-a, --age <number>', 'Your age', parseInt)
  .parse(process.argv);

const options = program.opts();
console.log(`Name: ${options.name}, Age: ${options.age}`);