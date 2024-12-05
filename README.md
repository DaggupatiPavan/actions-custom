# Execution Tracker Action

This GitHub Action tracks command execution details, stores performance metrics, and facilitates inter-action communication.

## Features

- Executes commands and captures stdout/stderr
- Records execution start time, end time, and duration
- Collects system metrics (CPU, memory, disk, network)
- Stores execution data for post-mortem analysis
- Facilitates inter-action communication through environment variables
- Maintains execution context and metadata

## Usage

```yaml
- uses: your-org/execution-tracker-action@v1
  with:
    command: 'npm run build'
    working-directory: './frontend'
    collect-metrics: 'true'
```

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `command` | Command to execute | Yes | N/A |
| `working-directory` | Directory to execute the command in | No | '.' |
| `collect-metrics` | Whether to collect system metrics | No | 'true' |

## Outputs

| Output | Description |
|--------|-------------|
| `stdout` | Command standard output |
| `stderr` | Command standard error |
| `status` | Exit status code |
| `start-time` | Execution start time |
| `end-time` | Execution end time |
| `duration` | Execution duration in milliseconds |
| `metrics` | Collected system metrics |
| `execution-data` | Complete execution data as JSON |

## Example Workflow

```yaml
name: Build and Test
on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Application
        uses: your-org/execution-tracker-action@v1
        id: build
        with:
          command: 'npm run build'
          
      - name: Use Build Output
        run: |
          echo "Build took ${{ steps.build.outputs.duration }}ms"
          echo "Build status: ${{ steps.build.outputs.status }}"
```

## Data Storage

Execution data is stored in `.github/execution-data` directory with timestamps for post-mortem analysis. Data is also available through GitHub Actions environment variables for inter-action communication.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request