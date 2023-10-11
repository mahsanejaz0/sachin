const { exec } = require('child_process');
const path = require('path');

const startProjects = () => {
  const projects = [
    { command: 'dev', directory: './nodebackend', name: 'Backend' },
    { command: 'start', directory: './adminpanel', name: 'Admin' },
    { command: 'start', directory: './userpanel', name: 'User' }
  ];

  const commands = projects.map(project => ({
    command: 'npm run ' + project.command,
    name: project.name,
    cwd: path.resolve(project.directory)
  }));

  const childProcesses = commands.map(cmd => {
    const childProcess = exec(cmd.command, { cwd: cmd.cwd }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error running ${cmd.name} project:`, error);
      }
    });

    childProcess.stdout.pipe(process.stdout);
    childProcess.stderr.pipe(process.stderr);

    return childProcess;
  });

  // Wait for all child processes to complete
  Promise.all(childProcesses.map(cp => new Promise(resolve => cp.on('close', resolve))))
    .then(() => {
      console.log('All projects have finished.');
    })
    .catch(err => {
      console.error('Error waiting for projects to finish:', err);
    });
};

// Call the function to start all projects
startProjects();
