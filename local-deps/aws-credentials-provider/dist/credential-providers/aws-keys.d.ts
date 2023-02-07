import AWS from 'aws-sdk';
import AwsCredentialsTypeV2 from '../credential-types/aws-credentials-type-v2';
declare class AwsKeys implements AwsCredentialsTypeV2 {
    AwsAccessKeyId: string;
    AwsSecretAccessKey: string;
    AwsSessionToken?: string;
    constructor(AwsAccessKeyId: string, AwsSecretAccessKey: string, AwsSessionToken?: string);
    static fromObject(object: AwsKeys): AwsKeys;
    getV2Credentials(): Promise<AWS.Credentials>;
}
export default AwsKeys;
