import { Stack, StackProps } from "aws-cdk-lib";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";
import { awsAccount } from "../config";

export interface ParamsProps extends StackProps {}

export class Params extends Stack {
  constructor(scope: Construct, id: string, props: ParamsProps) {
    super(scope, id, props);
    const { accountName } = awsAccount

    // Version tag for example.com
    // new StringParameter(this,  `${accountName}-Website-Version-Tag-Parameter`, {
    //   description: "Version Tag for example.com",
    //   parameterName: `/${accountName}/Website/VersionTag`,
    //   stringValue: "1.0.63",
    // });
  }
}