class ExecutionContext {
  constructor() {
    this.data = {
      repository: process.env.GITHUB_REPOSITORY,
      workflow: process.env.GITHUB_WORKFLOW,
      action: process.env.GITHUB_ACTION,
      actor: process.env.GITHUB_ACTOR,
      runId: process.env.GITHUB_RUN_ID,
      runNumber: process.env.GITHUB_RUN_NUMBER,
      sha: process.env.GITHUB_SHA,
      ref: process.env.GITHUB_REF,
      environment: {}
    };
  }

  addData(key, value) {
    this.data.environment[key] = value;
  }

  getData() {
    return this.data;
  }
}

function createExecutionContext() {
  return new ExecutionContext();
}

module.exports = {
  createExecutionContext
};