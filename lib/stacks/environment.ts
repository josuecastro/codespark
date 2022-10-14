import { Branch, IApp } from "@aws-cdk/aws-amplify-alpha";
import {
  Cpu,
  EcrSource,
  Memory,
  Service,
  VpcConnector,
} from "@aws-cdk/aws-apprunner-alpha";
import { Stack, StackProps } from "aws-cdk-lib";
import {
  InstanceClass,
  InstanceSize,
  InstanceType,
  Peer,
  Vpc,
} from "aws-cdk-lib/aws-ec2";
import { Repository } from "aws-cdk-lib/aws-ecr";
import {
  Credentials,
  DatabaseInstance,
  DatabaseInstanceEngine,
  IInstanceEngine,
  PostgresEngineVersion,
} from "aws-cdk-lib/aws-rds";
import { Construct } from "constructs";

export interface EnvironmentProps extends StackProps {
  vpc: Vpc;
  repository: Repository;
  appName: string;
  envName: string;
  amplifyApp: IApp;
  backend?: {
    cpu?: Cpu;
    port?: number;
    memory?: Memory;
    environment?: { [key: string]: string };
  };
  database: {
    dbName: string;
    username: string;
    instanceClass?: InstanceClass;
    instanceSize?: InstanceSize;
    engine?: IInstanceEngine;
  };
  frontend?: {
    environmentVariables?: { [key: string]: string };
  };
}

export class Environment extends Stack {
  constructor(scope: Construct, id: string, props: EnvironmentProps) {
    super(scope, id, props);

    const resourcesNamePrefix = `${props.envName}-${props.appName}`;

    // Frontend Amplify Branch
    new Branch(this, `${resourcesNamePrefix}-Branch`, {
      app: props.amplifyApp,
      branchName: props.envName,
      pullRequestPreview: true,
      environmentVariables: { ...props.frontend?.environmentVariables },
    });

    // Database
    const db = new DatabaseInstance(this, `${resourcesNamePrefix}-Database`, {
      engine:
        props.database.engine ??
        DatabaseInstanceEngine.postgres({
          version: PostgresEngineVersion.VER_13_4,
        }),
      credentials: Credentials.fromGeneratedSecret(props.database.username),
      instanceType: InstanceType.of(
        props.database.instanceClass ?? InstanceClass.BURSTABLE3,
        props.database.instanceSize ?? InstanceSize.MICRO
      ),
      vpc: props.vpc,
      databaseName: props.database.dbName,
      instanceIdentifier: `${resourcesNamePrefix}-database`.toLowerCase(),
    });
    db.connections.allowDefaultPortFrom(Peer.ipv4(props.vpc.vpcCidrBlock));

    // App Runner ECR Source
    const ecrSource = new EcrSource({
      repository: props.repository,
      imageConfiguration: {
        environment: {
          ...props.backend?.environment,
          DB_PASSWORD: db.secret!.secretValueFromJson("password").unsafeUnwrap().toString(),
          DB_USER: db.secret!.secretValueFromJson("username").unsafeUnwrap().toString(),
          DB_PORT: db.secret!.secretValueFromJson("port").unsafeUnwrap().toString(),
          DB_HOST: db.secret!.secretValueFromJson("host").unsafeUnwrap().toString(),
          DB_NAME: db.secret!.secretValueFromJson("dbname").unsafeUnwrap().toString(),
          DB_TYPE: db.secret!.secretValueFromJson("engine").unsafeUnwrap().toString(),
        },
        port: props.backend?.port ?? 3000,
      },
      tagOrDigest: props.envName,
    });

    // App Runner Service
    new Service(this, `${resourcesNamePrefix}-Api-Service`, {
      source: ecrSource,
      cpu: props.backend?.cpu ?? Cpu.ONE_VCPU,
      memory: props.backend?.memory ?? Memory.TWO_GB,
      serviceName: `${resourcesNamePrefix}-Api-Service`,
      vpcConnector: new VpcConnector(
        this,
        `${resourcesNamePrefix}-Vpc-Connector`,
        {
          vpc: props.vpc,
        }
      ),
    });
  }
}
