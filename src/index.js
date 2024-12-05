const core = require('@actions/core');
const exec = require('@actions/exec');
const si = require('systeminformation');
const { storeExecutionData } = require('./storage');
const { collectMetrics } = require('./metrics');
const { createExecutionContext } = require('./context');

async function run() {
  try {
    const command = core.getInput('command', { required: true });
    const workingDirectory = core.getInput('working-directory');
    const shouldCollectMetrics = core.getInput('collect-metrics') === 'true';

    const context = createExecutionContext();
    let stdout = '';
    let stderr = '';

    const startTime = new Date().toISOString();
    const startTimestamp = Date.now();

    // Collect initial metrics if enabled
    const initialMetrics = shouldCollectMetrics ? await collectMetrics() : null;

    // Execute command and capture output
    const options = {
      cwd: workingDirectory,
      listeners: {
        stdout: (data) => {
          stdout += data.toString();
        },
        stderr: (data) => {
          stderr += data.toString();
        }
      }
    };

    const status = await exec.exec(command, [], options);
    
    const endTime = new Date().toISOString();
    const duration = Date.now() - startTimestamp;

    // Collect final metrics if enabled
    const finalMetrics = shouldCollectMetrics ? await collectMetrics() : null;

    // Prepare execution data
    const executionData = {
      command,
      workingDirectory,
      stdout,
      stderr,
      status,
      startTime,
      endTime,
      duration,
      metrics: {
        initial: initialMetrics,
        final: finalMetrics
      },
      context: context.getData()
    };

    // Store execution data
    await storeExecutionData(executionData);

    // Set outputs
    core.setOutput('stdout', stdout);
    core.setOutput('stderr', stderr);
    core.setOutput('status', status);
    core.setOutput('start-time', startTime);
    core.setOutput('end-time', endTime);
    core.setOutput('duration', duration);
    core.setOutput('metrics', JSON.stringify({
      initial: initialMetrics,
      final: finalMetrics
    }));
    core.setOutput('execution-data', JSON.stringify(executionData));

  } catch (error) {
    core.setFailed(error.message);
  }
}