var tetra = require('tetra'),
  program = require('commander'),
  version = require('./package.json').version;

program
  .version(version)
  .option('-p, --port [port]', 'Port for the application', 3000)
  .option('-dp, --debugPort [debugPort]', 'Port to open for debugging', 5858)
  .option('-d, --debug', 'Launch in debug mode')
  .option('-a, --address [address]', 'Address to bind to', '0.0.0.0')
  .parse(process.argv);

var
options = {
  port: program.port,
  address: program.address
};

if (program.debug)
{
  options.debug = true;
  options.debugPort = program.debugPort;
}

tetra.server(process.cwd(), options);
