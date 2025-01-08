## Amazon ECS "Download Task Definition" Action for GitHub Actions

Downloads an Amazon ECS task definition json file


## Usage

```yaml
    - name: Download Amazon ECS Task Definition JSON
      uses: aws-actions/amazon-ecs-deploy-task-definition@v2
      with:
        task-definition: task-definition
```

See [action.yml](action.yml) for the full documentation for this action's inputs and outputs.
In most cases when running a one-off task, subnet ID's, subnet groups, and assign public IP will be required. 
Assign public IP will only be applied when a subnet or security group is defined. 

## License Summary

This code is made available under the MIT license.

