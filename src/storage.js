const fs = require('fs').promises;
const path = require('path');

async function storeExecutionData(data) {
  try {
    // Use environment variable for data directory, fall back to workspace directory
    const baseDir = process.env.EXECUTION_DATA_PATH || process.env.GITHUB_WORKSPACE;
    const dataDir = path.join(baseDir, 'execution-data');
    
    // Create timestamp-based filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `execution-${timestamp}.json`;
    
    // Ensure directory exists
    await fs.mkdir(dataDir, { recursive: true });
    
    // Full path for the data file
    const filePath = path.join(dataDir, filename);
    
    // Store execution data with pretty formatting
    await fs.writeFile(
      filePath,
      JSON.stringify(data, null, 2)
    );

    // Store reference in environment for other actions
    const envPath = process.env.GITHUB_ENV;
    if (envPath) {
      await fs.appendFile(
        envPath,
        `LAST_EXECUTION_DATA=${JSON.stringify(data)}\n` +
        `LAST_EXECUTION_FILE=${filePath}\n`
      );
    }

    // Log storage location for debugging
    console.log(`Execution data stored at: ${filePath}`);
    
    return filePath;
  } catch (error) {
    console.error('Error storing execution data:', error);
    throw error;
  }
}

module.exports = {
  storeExecutionData
};