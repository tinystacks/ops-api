import AwsAssumedRole from './credential-providers/aws-assumed-role';
import AwsKeys from './credential-providers/aws-keys';
import LocalAwsProfile from './credential-providers/local-aws-profile';
declare class AwsCredentialsProvider {
    id: string;
    credentials: AwsAssumedRole | AwsKeys | LocalAwsProfile;
    constructor(id: string, credentials: AwsAssumedRole | AwsKeys | LocalAwsProfile);
    static fromObject(object: AwsCredentialsProvider): AwsCredentialsProvider;
    getV2Credentials(): Promise<import("aws-sdk").Credentials>;
    getV3Credentials(): import("@aws-sdk/types").AwsCredentialIdentityProvider;
}
export default AwsCredentialsProvider;
