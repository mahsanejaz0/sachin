const { exec } = require('child_process');
const path = require('path');

const startProjects = () => {
  const projects = [
    { command: 'dev', directory: './moneyseekerbackend', name: 'Backend' },
    { command: 'start', directory: './moneyseekeradmin', name: 'Admin' },
    { command: 'start', directory: './moneyseekeruser', name: 'User' }
  ];

  const commands = projects.map(project => ({
    command: `npm run --prefix ${path.resolve(project.directory)} ${project.command}`,
    name: project.name
  }));

  const concatenatedCommands = commands.map(cmd => `"${cmd.command}"`).join(' ');

  const fullCommand = `npx concurrently ${concatenatedCommands}`;

  const childProcess = exec(fullCommand, (error, stdout, stderr) => {
    if (error) {
      console.error('Error running projects:', error);
    }
  });

  childProcess.stdout.pipe(process.stdout);
  childProcess.stderr.pipe(process.stderr);
};

// Call the function to start all projects
startProjects();
