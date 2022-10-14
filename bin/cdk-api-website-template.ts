#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { UsEast1 } from '../lib/stages/UsEast1';
import { awsAccount } from '../lib/config';

const app = new cdk.App();
new UsEast1(app, 'USEast1', {
  env: { account: awsAccount.id, region: 'us-east-1' }
});