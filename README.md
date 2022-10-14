# Website + Api infrastructure CDK code

## Useful general commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

## Not so very quick-start

1. Create a frontend repository and push it to github
2. Create a api repository and push it to github
3. Generate a gh token. [creating-a-personal-access-token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
4. Login to your AWS and save the gh token in the Secrets Manager. [creating-a-secret](https://docs.aws.amazon.com/secretsmanager/latest/userguide/create_secret.html)
5. Create a new repository from this template
6. Go to lib/config/index.ts
7. Change the config properties 
8. Open the terminal
9. Install the dependencies
10. Synthetize the Cloud Formation templates: `cdk synth`
11. Deploy the common stack: `cdk deploy ${appName}-Common-Stack --profile ${MyProfile}`
12. Go to your backend repository
13. Build your image and push it to the ECR registry created. [pushing-an-image](https://docs.amazonaws.cn/en_us/AmazonECR/latest/userguide/docker-push-ecr-image.html)
14. Go to your cdk code
15. Deploy the environment stack: `cdk deploy ${appName}-Dev-Stack --profile ${MyProfile}`
