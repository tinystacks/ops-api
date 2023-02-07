import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DevBuild } from './code-build-projects/dev-build';
// import { PublicRelease } from './code-build-projects/public-release';

export class CdkStack extends cdk.Stack {
  constructor (scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new DevBuild(this);
    // new PublicRelease(this);
  }
}