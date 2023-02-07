import AWS from 'aws-sdk';
import { AwsCredentialIdentityProvider } from '@aws-sdk/types';
import AwsCredentialsType from '../credential-types/aws-credentials-type';
import AwsCredentialsTypeV2 from '../credential-types/aws-credentials-type-v2';
declare class AwsAssumedRole implements AwsCredentialsType {
    roleArn: string;
    sessionName: string;
    region: string;
    duration?: number;
    primaryCredentials?: AwsCredentialsTypeV2 | AwsCredentialsType;
    private stsClient;
    private stsCreds;
    constructor(args: {
        roleArn: string;
        sessionName: string;
        region: string;
        duration?: number;
        primaryCredentials?: AwsCredentialsTypeV2 | AwsCredentialsType;
    });
    static fromObject(object: AwsAssumedRole): AwsAssumedRole;
    private credsWillExpireInSession;
    private mapStsCredsToGenericCreds;
    getV2Credentials(): Promise<AWS.Credentials>;
    getV3Credentials(): AwsCredentialIdentityProvider;
}
export default AwsAssumedRole;
