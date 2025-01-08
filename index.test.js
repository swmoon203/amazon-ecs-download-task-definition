const run = require('.');
const core = require('@actions/core');
const { ECS, waitUntilServicesStable } = require('@aws-sdk/client-ecs');
const fs = require('fs');
const path = require('path');

jest.mock('@actions/core');
// jest.mock('fs', () => ({
//     promises: { access: jest.fn() },
//     readFileSync: jest.fn(),
//     constants: {
//         O_CREATE: jest.fn()
//     }
// }));

const mockRunTask = jest.fn();
const config = {
    region: () => Promise.resolve('fake-region'),
};

// jest.mock('@aws-sdk/client-ecs');


describe('Download ECS Task Definition', () => {

    const mockEcsClient = {
        config,
        runTask: mockRunTask,
    };

    beforeEach(() => {
        jest.clearAllMocks();

        core.getInput = jest
            .fn()
            .mockReturnValueOnce('escore-batch') // task-definition

        process.env = Object.assign(process.env, { GITHUB_WORKSPACE: __dirname });

        // fs.readFileSync.mockImplementation((pathInput, encoding) => {
        //     if (encoding != 'utf8') {
        //         throw new Error(`Wrong encoding ${encoding}`);
        //     }

        //     if (pathInput == path.join(process.env.GITHUB_WORKSPACE, 'appspec.yaml')) {
        //         return `
        //         Resources:
        //         - TargetService:
        //             Type: AWS::ECS::Service
        //             Properties:
        //               TaskDefinition: helloworld
        //               LoadBalancerInfo:
        //                 ContainerName: web
        //                 ContainerPort: 80`;
        //     }

        //     if (pathInput == path.join(process.env.GITHUB_WORKSPACE, 'task-definition.json')) {
        //         return JSON.stringify({ family: 'task-def-family' });
        //     }

        //     throw new Error(`Unknown path ${pathInput}`);
        // });

        // mockRunTask.mockImplementation(
        //     () => Promise.resolve({
        //         failures: [],
        //         tasks: [
        //             {
        //                 containers: [
        //                     {
        //                         lastStatus: "RUNNING",
        //                         exitCode: 0,
        //                         reason: '',
        //                         taskArn: "arn:aws:ecs:fake-region:account_id:task/arn"
        //                     }
        //                 ],
        //                 desiredStatus: "RUNNING",
        //                 lastStatus: "RUNNING",
        //                 taskArn: "arn:aws:ecs:fake-region:account_id:task/arn"
        //                 // taskDefinitionArn: "arn:aws:ecs:<region>:<aws_account_id>:task-definition/amazon-ecs-sample:1"
        //             }
        //         ]
        //     }));


        // ECS.mockImplementation(() => mockEcsClient);
    });

    test('download the task definition contents', async () => {
        await run();
        expect(core.setFailed).toHaveBeenCalledTimes(0);
        // expect(mockEcsRegisterTaskDef).toHaveBeenNthCalledWith(1, { family: 'task-def-family' });
        // expect(core.setOutput).toHaveBeenNthCalledWith(1, 'task-definition-arn', 'task:def:arn');
        // expect(mockEcsDescribeServices).toHaveBeenNthCalledWith(1, {
        //     cluster: 'cluster-789',
        //     services: ['service-456']
        // });
        // expect(mockEcsUpdateService).toHaveBeenNthCalledWith(1, {
        //     cluster: 'cluster-789',
        //     service: 'service-456',
        //     taskDefinition: 'task:def:arn',
        //     forceNewDeployment: false,
        //     enableECSManagedTags: null,
        //     propagateTags: 'NONE'
        // });
        // expect(waitUntilServicesStable).toHaveBeenCalledTimes(0);
        // expect(core.info).toBeCalledWith("Deployment started. Watch this deployment's progress in the Amazon ECS console: https://fake-region.console.aws.amazon.com/ecs/v2/clusters/cluster-789/services/service-456/events?region=fake-region");
    });

    // test('registers the task definition contents and updates the service if deployment controller type is ECS', async () => {
    //     mockEcsDescribeServices.mockImplementation(
    //         () => Promise.resolve({
    //             failures: [],
    //             services: [{
    //                 status: 'ACTIVE',
    //                 deploymentController: {
    //                     type: 'ECS'
    //                 }
    //             }]
    //         })
    //     );

    //     await run();
    //     expect(core.setFailed).toHaveBeenCalledTimes(0);
    //     expect(mockEcsRegisterTaskDef).toHaveBeenNthCalledWith(1, { family: 'task-def-family' });
    //     expect(core.setOutput).toHaveBeenNthCalledWith(1, 'task-definition-arn', 'task:def:arn');
    //     expect(mockEcsDescribeServices).toHaveBeenNthCalledWith(1, {
    //         cluster: 'cluster-789',
    //         services: ['service-456']
    //     });
    //     expect(mockEcsUpdateService).toHaveBeenNthCalledWith(1, {
    //         cluster: 'cluster-789',
    //         service: 'service-456',
    //         taskDefinition: 'task:def:arn',
    //         forceNewDeployment: false,
    //         enableECSManagedTags: null,
    //         propagateTags: 'NONE'
    //     });
    //     expect(waitUntilServicesStable).toHaveBeenCalledTimes(0);
    //     expect(core.info).toBeCalledWith("Deployment started. Watch this deployment's progress in the Amazon ECS console: https://fake-region.console.aws.amazon.com/ecs/v2/clusters/cluster-789/services/service-456/events?region=fake-region");
    // });

    // test('prints Chinese console domain for cn regions', async () => {
    //     const originalRegion = config.region;
    //     config.region = () => Promise.resolve('cn-fake-region');
    //     await run();

    //     expect(core.info).toBeCalledWith("Deployment started. Watch this deployment's progress in the Amazon ECS console: https://cn-fake-region.console.amazonaws.cn/ecs/v2/clusters/cluster-789/services/service-456/events?region=cn-fake-region");

    //     // reset
    //     config.region = originalRegion;
    // });


    // test('cleans empty strings and objects out of the task definition contents', async () => {
    //     fs.readFileSync.mockImplementation((pathInput, encoding) => {
    //         if (encoding != 'utf8') {
    //             throw new Error(`Wrong encoding ${encoding}`);
    //         }

    //         return `
    //         {
    //             "memory": "",
    //             "containerDefinitions": [ {
    //                 "name": "sample-container",
    //                 "logConfiguration": {},
    //                 "repositoryCredentials": { "credentialsParameter": "" },
    //                 "command": [
    //                     ""
    //                 ],
    //                 "environment": [
    //                     {
    //                         "name": "hello",
    //                         "value": "world"
    //                     },
    //                     {
    //                         "name": "test",
    //                         "value": ""
    //                     },
    //                     {
    //                         "name": "",
    //                         "value": ""
    //                     }
    //                 ],
    //                 "secretOptions": [ {
    //                     "name": "",
    //                     "valueFrom": ""
    //                 } ],
    //                 "cpu": 0,
    //                 "essential": false
    //             } ],
    //             "requiresCompatibilities": [ "EC2" ],
    //             "registeredAt": 1611690781,
    //             "family": "task-def-family"
    //         }
    //         `;
    //     });

    //     await run();
    //     expect(core.setFailed).toHaveBeenCalledTimes(0);
    //     expect(mockEcsRegisterTaskDef).toHaveBeenNthCalledWith(1, {
    //         family: 'task-def-family',
    //         containerDefinitions: [
    //             {
    //                 name: 'sample-container',
    //                 cpu: 0,
    //                 essential: false,
    //                 environment: [{
    //                     name: 'hello',
    //                     value: 'world'
    //                 }, {
    //                     "name": "test",
    //                     "value": ""
    //                 }]
    //             }
    //         ],
    //         requiresCompatibilities: ['EC2']
    //     });
    // });

    // test('maintains empty keys in proxyConfiguration.properties for APPMESH', async () => {
    //     fs.readFileSync.mockImplementation((pathInput, encoding) => {
    //         if (encoding != 'utf8') {
    //             throw new Error(`Wrong encoding ${encoding}`);
    //         }

    //         return `
    //         {
    //             "memory": "",
    //             "containerDefinitions": [ {
    //                 "name": "sample-container",
    //                 "logConfiguration": {},
    //                 "repositoryCredentials": { "credentialsParameter": "" },
    //                 "command": [
    //                     ""
    //                 ],
    //                 "environment": [
    //                     {
    //                         "name": "hello",
    //                         "value": "world"
    //                     },
    //                     {
    //                         "name": "",
    //                         "value": ""
    //                     }
    //                 ],
    //                 "secretOptions": [ {
    //                     "name": "",
    //                     "valueFrom": ""
    //                 } ],
    //                 "cpu": 0,
    //                 "essential": false
    //             } ],
    //             "requiresCompatibilities": [ "EC2" ],
    //             "registeredAt": 1611690781,
    //             "family": "task-def-family",
    //             "proxyConfiguration": {
    //                 "type": "APPMESH",
    //                 "containerName": "envoy",
    //                 "properties": [
    //                     {
    //                         "name": "ProxyIngressPort",
    //                         "value": "15000"
    //                     },
    //                     {
    //                         "name": "AppPorts",
    //                         "value": "1234"
    //                     },
    //                     {
    //                         "name": "EgressIgnoredIPs",
    //                         "value": "169.254.170.2,169.254.169.254"
    //                     },
    //                     {
    //                         "name": "IgnoredGID",
    //                         "value": ""
    //                     },
    //                     {
    //                         "name": "EgressIgnoredPorts",
    //                         "value": ""
    //                     },
    //                     {
    //                         "name": "IgnoredUID",
    //                         "value": "1337"
    //                     },
    //                     {
    //                         "name": "ProxyEgressPort",
    //                         "value": "15001"
    //                     },
    //                     {
    //                         "value": "some-value"
    //                     }
    //                 ]
    //             }
    //         }
    //         `;
    //     });

    //     await run();
    //     expect(core.setFailed).toHaveBeenCalledTimes(0);
    //     expect(mockEcsRegisterTaskDef).toHaveBeenNthCalledWith(1, {
    //         family: 'task-def-family',
    //         containerDefinitions: [
    //             {
    //                 name: 'sample-container',
    //                 cpu: 0,
    //                 essential: false,
    //                 environment: [{
    //                     name: 'hello',
    //                     value: 'world'
    //                 }]
    //             }
    //         ],
    //         requiresCompatibilities: ['EC2'],
    //         proxyConfiguration: {
    //             type: "APPMESH",
    //             containerName: "envoy",
    //             properties: [
    //                 {
    //                     name: "ProxyIngressPort",
    //                     value: "15000"
    //                 },
    //                 {
    //                     name: "AppPorts",
    //                     value: "1234"
    //                 },
    //                 {
    //                     name: "EgressIgnoredIPs",
    //                     value: "169.254.170.2,169.254.169.254"
    //                 },
    //                 {
    //                     name: "IgnoredGID",
    //                     value: ""
    //                 },
    //                 {
    //                     name: "EgressIgnoredPorts",
    //                     value: ""
    //                 },
    //                 {
    //                     name: "IgnoredUID",
    //                     value: "1337"
    //                 },
    //                 {
    //                     name: "ProxyEgressPort",
    //                     value: "15001"
    //                 },
    //                 {
    //                     name: "",
    //                     value: "some-value"
    //                 }
    //             ]
    //         }
    //     });
    // });

    // test('cleans invalid keys out of the task definition contents', async () => {
    //     fs.readFileSync.mockImplementation((pathInput, encoding) => {
    //         if (encoding != 'utf8') {
    //             throw new Error(`Wrong encoding ${encoding}`);
    //         }

    //         return '{ "compatibilities": ["EC2"], "taskDefinitionArn": "arn:aws...:task-def-family:1", "family": "task-def-family", "revision": 1, "status": "ACTIVE" }';
    //     });

    //     await run();
    //     expect(core.setFailed).toHaveBeenCalledTimes(0);
    //     expect(mockEcsRegisterTaskDef).toHaveBeenNthCalledWith(1, { family: 'task-def-family' });
    // });

    // test('registers the task definition contents at an absolute path', async () => {
    //     core.getInput = jest.fn().mockReturnValueOnce('/hello/task-definition.json');
    //     fs.readFileSync.mockImplementation((pathInput, encoding) => {
    //         if (encoding != 'utf8') {
    //             throw new Error(`Wrong encoding ${encoding}`);
    //         }

    //         if (pathInput == '/hello/task-definition.json') {
    //             return JSON.stringify({ family: 'task-def-family-absolute-path' });
    //         }

    //         throw new Error(`Unknown path ${pathInput}`);
    //     });

    //     await run();
    //     expect(core.setFailed).toHaveBeenCalledTimes(0);

    //     expect(mockEcsRegisterTaskDef).toHaveBeenNthCalledWith(1, { family: 'task-def-family-absolute-path' });
    //     expect(core.setOutput).toHaveBeenNthCalledWith(1, 'task-definition-arn', 'task:def:arn');
    // });


    // test('run task', async () => {
    //     core.getInput = jest
    //         .fn()
    //         .mockReturnValueOnce('task-definition.json')  // task-definition
    //         .mockReturnValueOnce('')                      // service
    //         .mockReturnValueOnce('')                      // cluster
    //         .mockReturnValueOnce('')                      // wait-for-service-stability
    //         .mockReturnValueOnce('')                      // wait-for-minutes
    //         .mockReturnValueOnce('')                      // enable-ecs-managed-tags
    //         .mockReturnValueOnce('')                      // propagate-tags
    //         .mockReturnValueOnce('')                      // force-new-deployment
    //         .mockReturnValueOnce('')                      // desired-count
    //         .mockReturnValueOnce('true');                 // run-task

    //     await run();
    //     expect(core.setFailed).toHaveBeenCalledTimes(0);

    //     expect(mockEcsRegisterTaskDef).toHaveBeenNthCalledWith(1, { family: 'task-def-family' });
    //     expect(core.setOutput).toHaveBeenNthCalledWith(1, 'task-definition-arn', 'task:def:arn');
    //     expect(mockRunTask).toHaveBeenCalledTimes(1);
    //     expect(mockRunTask).toHaveBeenNthCalledWith(1,{
    //         startedBy: 'GitHub-Actions',
    //         cluster: 'default',
    //         capacityProviderStrategy: null,
    //         launchType: 'FARGATE',
    //         taskDefinition: 'task:def:arn',
    //         overrides: {"containerOverrides": []},
    //         networkConfiguration: null,
    //         enableECSManagedTags: null,
    //         tags: []
    //     });

    //     expect(core.setOutput).toHaveBeenNthCalledWith(2, 'run-task-arn', ["arn:aws:ecs:fake-region:account_id:task/arn"]);
    // });

    // test('run task with options', async () => {
    //     core.getInput = jest
    //         .fn()
    //         .mockReturnValueOnce('task-definition.json')  // task-definition
    //         .mockReturnValueOnce('')                      // service
    //         .mockReturnValueOnce('somecluster')           // cluster
    //         .mockReturnValueOnce('')                      // wait-for-service-stability
    //         .mockReturnValueOnce('')                      // wait-for-minutes
    //         .mockReturnValueOnce('')                      // force-new-deployment
    //         .mockReturnValueOnce('')                      // desired-count
    //         .mockReturnValueOnce('false')                 // enable-ecs-managed-tags
    //         .mockReturnValueOnce('')                      // propagate-tags
    //         .mockReturnValueOnce('true')                  // run-task
    //         .mockReturnValueOnce('false')                 // wait-for-task-stopped
    //         .mockReturnValueOnce('someJoe')               // run-task-started-by
    //         .mockReturnValueOnce('EC2')                   // run-task-launch-type
    //         .mockReturnValueOnce('a,b')                   // run-task-subnet-ids
    //         .mockReturnValueOnce('c,d')                   // run-task-security-group-ids
    //         .mockReturnValueOnce(JSON.stringify([{ name: 'someapp', command: 'somecmd' }])) // run-task-container-overrides
    //         .mockReturnValueOnce('')                      // run-task-assign-public-IP
    //         .mockReturnValueOnce('[{"key": "project", "value": "myproject"}]'); // run-task-tags

    //     await run();
    //     expect(core.setFailed).toHaveBeenCalledTimes(0);

    //     expect(mockEcsRegisterTaskDef).toHaveBeenNthCalledWith(1, { family: 'task-def-family' });
    //     expect(core.setOutput).toHaveBeenNthCalledWith(1, 'task-definition-arn', 'task:def:arn');
    //     expect(mockRunTask).toHaveBeenCalledWith({
    //         startedBy: 'someJoe',
    //         cluster: 'somecluster',
    //         capacityProviderStrategy: null,
    //         launchType: 'EC2',
    //         taskDefinition: 'task:def:arn',
    //         overrides: { containerOverrides: [{ name: 'someapp', command: 'somecmd' }] },
    //         networkConfiguration: { awsvpcConfiguration: { subnets: ['a', 'b'], securityGroups: ['c', 'd'], assignPublicIp: "DISABLED" } },
    //         enableECSManagedTags: false,
    //         tags: [{"key": "project", "value": "myproject"}]
    //     });
    //     expect(core.setOutput).toHaveBeenNthCalledWith(2, 'run-task-arn', ["arn:aws:ecs:fake-region:account_id:task/arn"]);
    // });

    // test('run task with capacity provider strategy', async () => {
    //     core.getInput = jest
    //         .fn()
    //         .mockReturnValueOnce('task-definition.json')  // task-definition
    //         .mockReturnValueOnce('')                      // service
    //         .mockReturnValueOnce('somecluster')           // cluster
    //         .mockReturnValueOnce('')                      // wait-for-service-stability
    //         .mockReturnValueOnce('')                      // wait-for-minutes
    //         .mockReturnValueOnce('')                      // force-new-deployment
    //         .mockReturnValueOnce('')                      // desired-count
    //         .mockReturnValueOnce('false')                 // enable-ecs-managed-tags
    //         .mockReturnValueOnce('')                      // propagate-tags
    //         .mockReturnValueOnce('true')                  // run-task
    //         .mockReturnValueOnce('false')                 // wait-for-task-stopped
    //         .mockReturnValueOnce('someJoe')               // run-task-started-by
    //         .mockReturnValueOnce('')                      // run-task-launch-type
    //         .mockReturnValueOnce('a,b')                   // run-task-subnet-ids
    //         .mockReturnValueOnce('c,d')                   // run-task-security-group-ids
    //         .mockReturnValueOnce(JSON.stringify([{ name: 'someapp', command: 'somecmd' }])) // run-task-container-overrides
    //         .mockReturnValueOnce('')                      // run-task-assign-public-IP
    //         .mockReturnValueOnce('[{"key": "project", "value": "myproject"}]') // run-task-tags
    //         .mockReturnValueOnce('[{"capacityProvider":"FARGATE_SPOT","weight":1}]'); // run-task-capacity-provider-strategy

    //     await run();
    //     expect(core.setFailed).toHaveBeenCalledTimes(0);

    //     expect(mockEcsRegisterTaskDef).toHaveBeenNthCalledWith(1, { family: 'task-def-family' });
    //     expect(core.setOutput).toHaveBeenNthCalledWith(1, 'task-definition-arn', 'task:def:arn');
    //     expect(mockRunTask).toHaveBeenCalledWith({
    //         startedBy: 'someJoe',
    //         cluster: 'somecluster',
    //         capacityProviderStrategy: [{"capacityProvider":"FARGATE_SPOT","weight":1}],
    //         launchType: null,
    //         taskDefinition: 'task:def:arn',
    //         overrides: { containerOverrides: [{ name: 'someapp', command: 'somecmd' }] },
    //         networkConfiguration: { awsvpcConfiguration: { subnets: ['a', 'b'], securityGroups: ['c', 'd'], assignPublicIp: "DISABLED" } },
    //         enableECSManagedTags: false,
    //         tags: [{"key": "project", "value": "myproject"}],
    //     });
    //     expect(core.setOutput).toHaveBeenNthCalledWith(2, 'run-task-arn', ["arn:aws:ecs:fake-region:account_id:task/arn"]);
    // });

    // test('run task and service ', async () => {
    //     core.getInput = jest
    //         .fn()
    //         .mockReturnValueOnce('task-definition.json')  // task-definition
    //         .mockReturnValueOnce('service-456')           // service
    //         .mockReturnValueOnce('somecluster')           // cluster
    //         .mockReturnValueOnce('true')                  // wait-for-service-stability
    //         .mockReturnValueOnce('')                      // wait-for-minutes
    //         .mockReturnValueOnce('')                      // force-new-deployment
    //         .mockReturnValueOnce('')                      // desired-count
    //         .mockReturnValueOnce('')                      // enable-ecs-managed-tags
    //         .mockReturnValueOnce('')                      // propagate-tags
    //         .mockReturnValueOnce('true')                  // run-task
    //         .mockReturnValueOnce('false')                 // wait-for-task-stopped
    //         .mockReturnValueOnce('someJoe')               // run-task-started-by
    //         .mockReturnValueOnce('EC2')                   // run-task-launch-type
    //         .mockReturnValueOnce('a,b')                   // run-task-subnet-ids
    //         .mockReturnValueOnce('c,d')                   // run-task-security-group-ids
    //         .mockReturnValueOnce(JSON.stringify([{ name: 'someapp', command: 'somecmd' }])); // run-task-container-overrides
 
    //     await run();
    //     expect(core.setFailed).toHaveBeenCalledTimes(0);

    //     expect(mockEcsRegisterTaskDef).toHaveBeenNthCalledWith(1, { family: 'task-def-family' });
    //     expect(core.setOutput).toHaveBeenNthCalledWith(1, 'task-definition-arn', 'task:def:arn');
    //     expect(mockEcsDescribeServices).toHaveBeenNthCalledWith(1, {
    //         cluster: 'somecluster',
    //         services: ['service-456']
    //     });
    //     expect(mockEcsUpdateService).toHaveBeenNthCalledWith(1, {
    //         cluster: 'somecluster',
    //         service: 'service-456',
    //         taskDefinition: 'task:def:arn',
    //         forceNewDeployment: false,
    //         enableECSManagedTags: null,
    //         propagateTags: 'NONE',
    //     });
    //     expect(mockRunTask).toHaveBeenCalledWith({
    //         startedBy: 'someJoe',
    //         cluster: 'somecluster',
    //         taskDefinition: 'task:def:arn',
    //         capacityProviderStrategy: null,
    //         launchType: 'EC2',
    //         overrides: { containerOverrides: [{ name: 'someapp', command: 'somecmd' }] },
    //         networkConfiguration: { awsvpcConfiguration: { subnets: ['a', 'b'], securityGroups: ['c', 'd'], assignPublicIp: "DISABLED" } },
    //         enableECSManagedTags: null,
    //         tags: []
    //     });
    //     expect(core.setOutput).toHaveBeenNthCalledWith(2, 'run-task-arn', ["arn:aws:ecs:fake-region:account_id:task/arn"]);
    // });

    // test('run task and wait for it to stop', async () => {
    //     core.getInput = jest
    //         .fn()
    //         .mockReturnValueOnce('task-definition.json')  // task-definition
    //         .mockReturnValueOnce('')                      // service
    //         .mockReturnValueOnce('somecluster')           // cluster
    //         .mockReturnValueOnce('')                      // wait-for-service-stability
    //         .mockReturnValueOnce('')                      // wait-for-minutes
    //         .mockReturnValueOnce('')                      // force-new-deployment
    //         .mockReturnValueOnce('')                      // desired-count
    //         .mockReturnValueOnce('')                      // enable-ecs-managed-tags
    //         .mockReturnValueOnce('')                      // propagate-tags
    //         .mockReturnValueOnce('true')                  // run-task
    //         .mockReturnValueOnce('true');                 // wait-for-task-stopped

    //     await run();
    //     expect(core.setFailed).toHaveBeenCalledTimes(0);

    //     expect(mockEcsRegisterTaskDef).toHaveBeenNthCalledWith(1, { family: 'task-def-family' });
    //     expect(core.setOutput).toHaveBeenNthCalledWith(1, 'task-definition-arn', 'task:def:arn');
    //     expect(mockRunTask).toHaveBeenCalledTimes(1);
    //     expect(core.setOutput).toHaveBeenNthCalledWith(2, 'run-task-arn', ["arn:aws:ecs:fake-region:account_id:task/arn"]);
    //     expect(waitUntilTasksStopped).toHaveBeenCalledTimes(1);
    // });

    // test('run task in bridge network mode', async () => {
    //     core.getInput = jest
    //         .fn()
    //         .mockReturnValueOnce('task-definition.json')  // task-definition
    //         .mockReturnValueOnce('service-456')           // service
    //         .mockReturnValueOnce('somecluster')           // cluster
    //         .mockReturnValueOnce('true')                  // wait-for-service-stability
    //         .mockReturnValueOnce('')                      // wait-for-minutes
    //         .mockReturnValueOnce('')                      // enable-ecs-managed-tags
    //         .mockReturnValueOnce('')                      // force-new-deployment
    //         .mockReturnValueOnce('')                      // desired-count
    //         .mockReturnValueOnce('')                      // propagate-tags
    //         .mockReturnValueOnce('true')                  // run-task
    //         .mockReturnValueOnce('true')                  // wait-for-task-stopped
    //         .mockReturnValueOnce('someJoe')               // run-task-started-by
    //         .mockReturnValueOnce('EC2')                   // run-task-launch-type
    //         .mockReturnValueOnce('')                      // run-task-subnet-ids
    //         .mockReturnValueOnce('')                      // run-task-security-group-ids
    //         .mockReturnValueOnce('')                      // run-task-container-overrides
    //         .mockReturnValueOnce('')                      // run-task-assign-public-IP

    //     await run();
    //     expect(mockRunTask).toHaveBeenCalledWith({
    //         startedBy: 'someJoe',
    //         cluster: 'somecluster',
    //         taskDefinition: 'task:def:arn',
    //         capacityProviderStrategy: null,
    //         launchType: 'EC2',
    //         overrides: { containerOverrides: [] },
    //         networkConfiguration: null,
    //         enableECSManagedTags: null,
    //         tags: []
    //     });
    // });
    
    // test('run task with setting true to enableECSManagedTags', async () => {
    //     core.getInput = jest
    //         .fn()
    //         .mockReturnValueOnce('task-definition.json')  // task-definition
    //         .mockReturnValueOnce('')                      // service
    //         .mockReturnValueOnce('somecluster')           // cluster
    //         .mockReturnValueOnce('')                      // wait-for-service-stability
    //         .mockReturnValueOnce('')                      // wait-for-minutes
    //         .mockReturnValueOnce('')                      // force-new-deployment
    //         .mockReturnValueOnce('')                      // desired-count
    //         .mockReturnValueOnce('true')                  // enable-ecs-managed-tags
    //         .mockReturnValueOnce('')                      // propagate-tags
    //         .mockReturnValueOnce('true');                 // run-task

    //     await run();
    //     expect(mockRunTask).toHaveBeenCalledWith({
    //         startedBy: 'GitHub-Actions',
    //         cluster: 'somecluster',
    //         taskDefinition: 'task:def:arn',
    //         capacityProviderStrategy: null,
    //         launchType: 'FARGATE',
    //         overrides: { containerOverrides: [] },
    //         networkConfiguration: null,
    //         enableECSManagedTags: true,
    //         tags: []
    //     });
    // });
    
    // test('run task with setting false to enableECSManagedTags', async () => {
    //     core.getInput = jest
    //         .fn()
    //         .mockReturnValueOnce('task-definition.json')  // task-definition
    //         .mockReturnValueOnce('')                      // service
    //         .mockReturnValueOnce('somecluster')           // cluster
    //         .mockReturnValueOnce('')                      // wait-for-service-stability
    //         .mockReturnValueOnce('')                      // wait-for-minutes
    //         .mockReturnValueOnce('')                      // force-new-deployment
    //         .mockReturnValueOnce('')                      // desired-count
    //         .mockReturnValueOnce('false')                 // enable-ecs-managed-tags
    //         .mockReturnValueOnce('')                      // propagate-tags
    //         .mockReturnValueOnce('true');                 // run-task

    //     await run();
    //     expect(mockRunTask).toHaveBeenCalledWith({
    //         startedBy: 'GitHub-Actions',
    //         cluster: 'somecluster',
    //         taskDefinition: 'task:def:arn',
    //         capacityProviderStrategy: null,
    //         launchType: 'FARGATE',
    //         overrides: { containerOverrides: [] },
    //         networkConfiguration: null,
    //         enableECSManagedTags: false,
    //         tags: []
    //     });
    // });

    // test('error is caught if run task fails with (wait-for-task-stopped: true)', async () => {
    //     core.getInput = jest
    //     .fn()
    //     .mockReturnValueOnce('task-definition.json')  // task-definition
    //     .mockReturnValueOnce('')                      // service
    //     .mockReturnValueOnce('somecluster')           // cluster
    //     .mockReturnValueOnce('')                      // wait-for-service-stability
    //     .mockReturnValueOnce('')                      // wait-for-minutes
    //     .mockReturnValueOnce('')                      // force-new-deployment
    //     .mockReturnValueOnce('')                      // desired-count
    //     .mockReturnValueOnce('')                      // enable-ecs-managed-tags
    //     .mockReturnValueOnce('')                      // propagate-tags
    //     .mockReturnValueOnce('true')                  // run-task
    //     .mockReturnValueOnce('true');                 // wait-for-task-stopped

    //     mockRunTask.mockImplementation(
    //         () => Promise.resolve({
    //             failures: [{
    //                 reason: 'TASK_FAILED',
    //                 arn: "arn:aws:ecs:fake-region:account_id:task/arn"
    //             }],
    //             tasks: [
    //                 {
    //                     containers: [
    //                         {
    //                             lastStatus: "RUNNING",
    //                             exitCode: 0,
    //                             reason: '',
    //                             taskArn: "arn:aws:ecs:fake-region:account_id:task/arn"
    //                         }
    //                     ],
    //                     desiredStatus: "RUNNING",
    //                     lastStatus: "STOPPED",
    //                     taskArn: "arn:aws:ecs:fake-region:account_id:task/arn"
    //                 }
    //             ]
    //         })
    //     );

    //     await run();
    //     expect(core.setFailed).toBeCalledWith("arn:aws:ecs:fake-region:account_id:task/arn is TASK_FAILED");
    // });

    // test('error is caught if run task fails with (wait-for-task-stopped: false) and with service', async () => {
    //     core.getInput = jest
    //     .fn()
    //     .mockReturnValueOnce('task-definition.json')  // task-definition
    //     .mockReturnValueOnce('')                      // service
    //     .mockReturnValueOnce('somecluster')           // cluster
    //     .mockReturnValueOnce('')                      // wait-for-service-stability
    //     .mockReturnValueOnce('')                      // wait-for-minutes
    //     .mockReturnValueOnce('')                      // force-new-deployment
    //     .mockReturnValueOnce('')                      // desired-count
    //     .mockReturnValueOnce('')                      // enable-ecs-managed-tags
    //     .mockReturnValueOnce('')                      // propagate-tags
    //     .mockReturnValueOnce('true')                  // run-task
    //     .mockReturnValueOnce('false');                // wait-for-task-stopped
        
    //     mockRunTask.mockImplementation(
    //         () => Promise.resolve({
    //             failures: [{
    //                 reason: 'TASK_FAILED',
    //                 arn: "arn:aws:ecs:fake-region:account_id:task/arn"
    //             }],
    //             tasks: [
    //                 {
    //                     containers: [
    //                         {
    //                             lastStatus: "RUNNING",
    //                             exitCode: 0,
    //                             reason: '',
    //                             taskArn: "arn:aws:ecs:fake-region:account_id:task/arn"
    //                         }
    //                     ],
    //                     desiredStatus: "RUNNING",
    //                     lastStatus: "STOPPED",
    //                     taskArn: "arn:aws:ecs:fake-region:account_id:task/arn"
    //                 }
    //             ]
    //         })
    //     );

    //     await run();
    //     expect(core.setFailed).toBeCalledWith("arn:aws:ecs:fake-region:account_id:task/arn is TASK_FAILED");
    // });

    // test('error caught if AppSpec file is not formatted correctly', async () => {
    //     mockEcsDescribeServices.mockImplementation(
    //         () => Promise.resolve({
    //             failures: [],
    //             services: [{
    //                 status: 'ACTIVE',
    //                 deploymentController: {
    //                     type: 'CODE_DEPLOY'
    //                 }
    //             }]
    //         })
    //     );
    //     fs.readFileSync.mockReturnValue("hello: world");

    //     await run();

    //     expect(core.setFailed).toBeCalledWith("AppSpec file must include property 'resources'");
    // });

    // test('error is caught if service does not exist', async () => {
    //     mockEcsDescribeServices.mockImplementation(
    //         () => Promise.resolve({
    //             failures: [{
    //                 reason: 'MISSING',
    //                 arn: 'hello'
    //             }],
    //             services: []
    //         })
    //     );

    //     await run();

    //     expect(core.setFailed).toBeCalledWith('hello is MISSING');
    // });

    // test('error is caught if service is inactive', async () => {
    //     mockEcsDescribeServices.mockImplementation(
    //         () => Promise.resolve({
    //             failures: [],
    //             services: [{
    //                 status: 'INACTIVE'
    //             }]
    //         })
    //     );

    //     await run();

    //     expect(core.setFailed).toBeCalledWith('Service is INACTIVE');
    // });

    // test('error is caught if service uses external deployment controller', async () => {
    //     mockEcsDescribeServices.mockImplementation(
    //         () => Promise.resolve({
    //             failures: [],
    //             services: [{
    //                 status: 'ACTIVE',
    //                 deploymentController: {
    //                     type: 'EXTERNAL'
    //                 }
    //             }]
    //         })
    //     );

    //     await run();

    //     expect(core.setFailed).toBeCalledWith('Unsupported deployment controller: EXTERNAL');
    // });

    // test('error is caught if task def registration fails', async () => {
    //     mockEcsRegisterTaskDef.mockImplementation(() => {
    //         throw new Error("Could not parse");
    //     });

    //     await run();

    //     expect(core.setFailed).toHaveBeenCalledTimes(2);
    //     expect(core.setFailed).toHaveBeenNthCalledWith(1, 'Failed to register task definition in ECS: Could not parse');
    //     expect(core.setFailed).toHaveBeenNthCalledWith(2, 'Could not parse');
    // });

    
});
