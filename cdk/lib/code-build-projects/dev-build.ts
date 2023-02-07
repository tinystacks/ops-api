import { Construct } from 'constructs';
import {
  constructId,
  generateName,
  Casing
} from '@tinystacks/iac-utils';
import {
  LogGroup,
  RetentionDays
} from 'aws-cdk-lib/aws-logs';
import {
  BuildEnvironmentVariableType,
  BuildSpec,
  ComputeType,
  EventAction,
  FilterGroup,
  LinuxBuildImage,
  Project,
  Source
} from 'aws-cdk-lib/aws-codebuild';
import { RemovalPolicy } from 'aws-cdk-lib';
import { name } from '../../../package.json';
import { Repository, TagStatus } from 'aws-cdk-lib/aws-ecr';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

class DevBuild extends Construct {
  constructor (scope: Construct) {
    super(scope, 'DevBuild');

    const ecrRepo = new Repository(this, constructId(name, 'devRepo'), {
      repositoryName: name,
      removalPolicy: RemovalPolicy.DESTROY,
      imageScanOnPush: true
    });
    ecrRepo.addLifecycleRule({
      tagStatus: TagStatus.UNTAGGED,
      maxImageCount: 25 
    });

    const projectName = `${name}-dev-build`;

    const logGroupName = generateName({
      identifiers: [projectName, 'logs'],
      casing: Casing.KEBAB
    });
    const logGroup = new LogGroup(this, constructId(logGroupName), {
      logGroupName,
      retention: RetentionDays.TWO_WEEKS,
      removalPolicy: RemovalPolicy.DESTROY
    });

    const codebuildProject = new Project(this, constructId(projectName), {
      projectName,
      buildSpec: BuildSpec.fromSourceFilename('buildspecs/dev-build.yml'),
      environment: {
        buildImage: LinuxBuildImage.fromCodeBuildImageId('aws/codebuild/standard:6.0'),
        computeType: ComputeType.SMALL,
        privileged: true,
        environmentVariables: {
          NPM_TOKEN: {
            type: BuildEnvironmentVariableType.SECRETS_MANAGER,
            value: '/CodeBuild/NPM_TOKEN'
          }
        }
      },
      logging: {
        cloudWatch: {
          logGroup
        }
      },
      source: Source.gitHub({
        owner: 'tinystacks',
        repo: 'ops-api',
        branchOrRef: 'main',
        webhook: true,
        webhookFilters: [
          FilterGroup
            .inEventOf(EventAction.PUSH)
            .andBranchIs('main')
        ]
      })
    });

    codebuildProject.addToRolePolicy(new PolicyStatement({
      actions: [
        'ecr:BatchGet*',
        'ecr:Get*',
        'ecr:Describe*',
        'ecr:List*',
        'ecr:GetAuthorizationToken',
        'sts:GetServiceBearerToken',
        'sts:GetCallerIdentity'
      ],
      resources: ['*']
    }));
    codebuildProject.addToRolePolicy(new PolicyStatement({
      actions: [
        'ecr:BatchCheckLayerAvailability',
        'ecr:CompleteLayerUpload',
        'ecr:InitiateLayerUpload',
        'ecr:ListImages',
        'ecr:PutImage',
        'ecr:UploadLayerPart'
      ],
      resources: [ecrRepo.repositoryArn]
    }));
  }
}

export {
  DevBuild
};