const { spawnSync } = require('child_process');

const forwardedArgs = process.argv.slice(2).filter((arg) => !arg.startsWith('--project='));
const commandArgs = ['ng', 'run', 'app:ionic-cordova-build', ...forwardedArgs];

const result = spawnSync('npx', commandArgs, {
  stdio: 'inherit',
  shell: true
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status === null ? 1 : result.status);
