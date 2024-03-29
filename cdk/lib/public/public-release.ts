import * as fs from 'fs';
import * as path from 'path';
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
  LinuxBuildImage,
  Project,
  Source
} from 'aws-cdk-lib/aws-codebuild';
import { RemovalPolicy } from 'aws-cdk-lib';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { name } from '../../../package.json';
import { CfnPublicRepository, Repository } from 'aws-cdk-lib/aws-ecr';

interface PublicReleaseProps {
  privateEcrRepo: Repository
}

class PublicRelease extends Construct {
  constructor (scope: Construct, props: PublicReleaseProps) {
    super(scope, 'PublicRelease');

    const { privateEcrRepo } = props;

    const publicEcrRepo = new CfnPublicRepository(this, constructId(name, 'publicEcrRepo'), {
      repositoryName: name,
      repositoryCatalogData: {
        'RepositoryDescription': 'Open source version of the ops-console-api.',
        'Architectures': [
          'ARM 64',
          'x86-64'
        ],
        'OperatingSystems': [
          'Linux'
        ],
        // 'LogoUrl': 'https://d3g9o9u8re44ak.cloudfront.net/logo/6b353252-f327-4419-8c9a-4be8eb8f7ad5/5c70ebc2-2eab-489b-9722-f83e7bc2deb1.png',
        'AboutText': fs.readFileSync(path.resolve(__dirname, '../../ABOUT.md')).toString(),
        'UsageText': fs.readFileSync(path.resolve(__dirname, '../../USAGE.md')).toString()
      }
    });

    const projectName = `${name}-public-release`;

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
      buildSpec: BuildSpec.fromSourceFilename('buildspecs/public-release.yml'),
      environment: {
        buildImage: LinuxBuildImage.fromCodeBuildImageId('aws/codebuild/standard:6.0'),
        computeType: ComputeType.SMALL,
        privileged: true,
        environmentVariables: {
          NPM_TOKEN: {
            type: BuildEnvironmentVariableType.SECRETS_MANAGER,
            value: '/CodeBuild/NPM_TOKEN'
          },
          SOURCE_TAG: {
            type: BuildEnvironmentVariableType.PLAINTEXT,
            value: 'latest'
          },
          VERSION: {
            type: BuildEnvironmentVariableType.PLAINTEXT,
            value: 'latest'
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
        branchOrRef: 'main'
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
      resources: [privateEcrRepo.repositoryArn]
    }));
    codebuildProject.addToRolePolicy(new PolicyStatement({
      actions: [
        'ecr-public:BatchGet*',
        'ecr-public:Get*',
        'ecr-public:Describe*',
        'ecr-public:List*',
        'sts:GetServiceBearerToken',
        'sts:GetCallerIdentity'
      ],
      resources: ['*']
    }));
    codebuildProject.addToRolePolicy(new PolicyStatement({
      actions: [
        'ecr-public:BatchCheckLayerAvailability',
        'ecr-public:CompleteLayerUpload',
        'ecr-public:DescribeImageTags',
        'ecr-public:DescribeImages',
        'ecr-public:GetRepositoryPolicy',
        'ecr-public:InitiateLayerUpload',
        'ecr-public:ListImages',
        'ecr-public:PutImage',
        'ecr-public:UploadLayerPart'
      ],
      resources: [publicEcrRepo.attrArn]
    }));
  }
}

export {
  PublicRelease
};