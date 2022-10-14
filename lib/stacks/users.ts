import { Stack, StackProps } from "aws-cdk-lib";
import { ManagedPolicy, User } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export interface UsersStackProps extends StackProps {}

export class Users extends Stack {
  constructor(scope: Construct, id: string, props: UsersStackProps) {
    super(scope, id, props);

    // Website Email Sender User
    // new User(this, "EmailSenderUser", {
    //   userName: "Email_Sender",
    //   managedPolicies: [
    //     ManagedPolicy.fromManagedPolicyArn(
    //       this,
    //       "Access-To-SES-Policy",
    //       "arn:aws:iam::aws:policy/AmazonSESFullAccess"
    //     ),
    //   ],
    // });
  }
}
