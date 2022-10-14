import {
  App,
  GitHubSourceCodeProvider,
  IApp,
  RedirectStatus,
} from "@aws-cdk/aws-amplify-alpha";
import { SecretValue, Stack, StackProps } from "aws-cdk-lib";
import { BuildSpec } from "aws-cdk-lib/aws-codebuild";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import { Repository } from "aws-cdk-lib/aws-ecr";
import { Cluster } from "aws-cdk-lib/aws-ecs";
import { Construct } from "constructs";

export interface CommonProps extends StackProps {
  appName: string;
  frontend: {
    sourceCodeOwner: string;
    sourceCodeRepository: string;
    ghTokenSecret: string;
    environment: { [key: string]: string };
  };
}

export class Common extends Stack {
  public readonly vpc: Vpc;
  public readonly repository: Repository;
  public readonly cluster: Cluster;
  public readonly amplifyApp: IApp;

  constructor(scope: Construct, id: string, props: CommonProps) {
    super(scope, id, props);

    const resourcesNamePrefix = `${props.appName}`;

    // VPC
    this.vpc = new Vpc(this, `${resourcesNamePrefix}-Vpc`);

    // ECR Repository
    this.repository = new Repository(
      this,
      `${resourcesNamePrefix}-Repository`,
      {
        repositoryName: `${resourcesNamePrefix}`.toLowerCase(),
      }
    );

    // Amplify App
    this.amplifyApp = new App(this, `${resourcesNamePrefix}-Amplify-App`, {
      appName: `${resourcesNamePrefix}-App`,
      buildSpec: BuildSpec.fromObject({
        version: 1,
        frontend: {
          phases: {
            preBuild: {
              commands: ["npm install"],
            },
            build: {
              commands: ["npm run build"],
            },
          },
          artifacts: {
            baseDirectory: "build",
            files: ["**/*"],
          },
          cache: {
            paths: ["node_modules/**/*"],
          },
        },
      }),
      sourceCodeProvider: new GitHubSourceCodeProvider({
        owner: props.frontend.sourceCodeOwner,
        repository: props.frontend.sourceCodeRepository,
        oauthToken: SecretValue.secretsManager(props.frontend.ghTokenSecret),
      }),
      customRules: [
        {
          source: String.raw`</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json)$)([^.]+$)/>`,
          target: "/index.html",
          status: RedirectStatus.REWRITE,
        },
      ],
      environmentVariables: {
        ...props.frontend.environment,
      },
    });
  }
}
