const path = require('path');
const core = require('@actions/core');
const { ECS, waitUntilServicesStable, waitUntilTasksStopped } = require('@aws-sdk/client-ecs');
const yaml = require('yaml');
const fs = require('fs');
const crypto = require('crypto');
const MAX_WAIT_MINUTES = 360;  // 6 hours
const WAIT_DEFAULT_DELAY_SEC = 15;

// Attributes that are returned by DescribeTaskDefinition, but are not valid RegisterTaskDefinition inputs
const IGNORED_TASK_DEFINITION_ATTRIBUTES = [
  'compatibilities',
  'taskDefinitionArn',
  'requiresAttributes',
  'revision',
  'status',
  'registeredAt',
  'deregisteredAt',
  'registeredBy'
];

async function run() {
  try {
    const ecs = new ECS({ customUserAgent: 'amazon-ecs-download-task-definition-for-github-actions' });

    // Get inputs
    const taskDefinition = core.getInput('task-definition', { required: true });
    const outputFile = core.getInput('output-file', { required: false }) || "task-definition.json";

    // Download the task definition
    core.debug('Downloading the task definition');
    const taskDefPath = path.isAbsolute(outputFile) ? outputFile : path.join(process.env.GITHUB_WORKSPACE, outputFile);

    let registerResponse;
    try {
      // console.log("taskDefinition", taskDefinition);
      registerResponse = await ecs.describeTaskDefinition({ taskDefinition });
      // console.log("registerResponse", registerResponse);
    } catch (error) {
      core.setFailed("Failed to download task definition in ECS: " + error.message);
      // console.error(error);
      throw (error);
    }
    const taskDefArn = registerResponse.taskDefinition.taskDefinitionArn;
    core.setOutput('task-definition-arn', taskDefArn);

    const json = JSON.parse(JSON.stringify(registerResponse.taskDefinition));
    for (const key of IGNORED_TASK_DEFINITION_ATTRIBUTES) {
      delete json[key];
    }
    fs.writeFileSync(taskDefPath, JSON.stringify(json, null, 4));
    // console.log(taskDefPath);
    
  } catch (error) {
    core.setFailed(error.message);
    core.debug(error.stack);
    // console.error(error);
  }
}

module.exports = run;

/* istanbul ignore next */
if (require.main === module) {
  run();
}
