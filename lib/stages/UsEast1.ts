import { Cpu, Memory } from "@aws-cdk/aws-apprunner-alpha";
import { StackProps, Stage } from "aws-cdk-lib";
import { Construct } from "constructs";
import { appConfig, awsAccount } from "../config";
import { Common } from "../stacks/common";
import { Environment } from "../stacks/environment";
import { Params } from "../stacks/params";
import { Users } from "../stacks/users";

export class UsEast1 extends Stage {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const { accountName } = awsAccount;
    const { appName, frontend } = appConfig;

    // IAM Users
    new Users(scope, `${accountName}-IAM-Users-Stack`, {});

    // Params
    new Params(scope, `${accountName}-Params-Stack`, {});

    // Common Resources
    const resources = new Common(scope, `${accountName}-Common-Stack`, {
      appName,
      frontend: {
        sourceCodeOwner: frontend.sourceCodeOwner,
        sourceCodeRepository: frontend.sourceCodeRepository,
        ghTokenSecret: frontend.ghTokenSecret,
        environment: frontend.environment,
      },
    });

    // ***** Environments ***** //

    // Development
    new Environment(scope, `${accountName}-Dev-Stack`, {
      appName,
      // the envName will drive the amplify branch and 
      // the api container tag to deploy
      envName: "develop",
      vpc: resources.vpc,
      repository: resources.repository,
      amplifyApp: resources.amplifyApp,
      database: {
        dbName: "test",
        username: "test",
      },
      backend: {
        cpu: Cpu.ONE_VCPU,
        port: 3000,
        memory: Memory.TWO_GB,
        environment: {},
      },
      frontend: {
        // specific environment variables for this branch
        environmentVariables: {},
      },
    });
  }
}
