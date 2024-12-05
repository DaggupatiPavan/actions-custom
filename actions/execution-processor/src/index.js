const core = require('@actions/core');
const fs = require('fs').promises;
const path = require('path');

async function run() {
  try {
    const executionData = JSON.parse(core.getInput('execution-data'));
    const dataDir = core.getInput('data-dir');

    // Ensure data directory exists
    await fs.mkdir(dataDir, { recursive: true });

    // Create summary file
    const summaryPath = path.join(dataDir, 'summary.json');
    const summary = {
      startTime: executionData.startTime,
      endTime: executionData.endTime,
      duration: executionData.duration,
      status: executionData.status,
      workingDirectory: executionData.workingDirectory,
      dataPath: dataDir,
      command: executionData.command,
      metrics: executionData.metrics,
      runId: process.env.GITHUB_RUN_ID,
      repository: process.env.GITHUB_REPOSITORY,
      workflow: process.env.GITHUB_WORKFLOW
    };

    // Write summary file
    await fs.writeFile(
      summaryPath,
      JSON.stringify(summary, null, 2)
    );

    // Store detailed execution data
    const detailsPath = path.join(dataDir, `execution-${Date.now()}.json`);
    await fs.writeFile(
      detailsPath,
      JSON.stringify(executionData, null, 2)
    );

    // Set outputs
    core.setOutput('summary-path', summaryPath);

    // Create execution report
    console.log('::group::Execution Summary');
    console.log(`Start Time: ${summary.startTime}`);
    console.log(`End Time: ${summary.endTime}`);
    console.log(`Duration: ${summary.duration}ms`);
    console.log(`Exit Status: ${summary.status}`);
    console.log(`Data Location: ${dataDir}`);
    console.log('::endgroup::');

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();