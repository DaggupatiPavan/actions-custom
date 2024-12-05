const si = require('systeminformation');

async function collectMetrics() {
  const metrics = {
    timestamp: new Date().toISOString(),
    cpu: await si.currentLoad(),
    memory: await si.mem(),
    disk: await si.fsSize(),
    network: await si.networkStats(),
    processes: await si.processes()
  };

  return metrics;
}

module.exports = {
  collectMetrics
};