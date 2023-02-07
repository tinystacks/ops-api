import AWS from 'aws-sdk';
import AwsCredentialsType from '../credential-types/aws-credentials-type';
declare class LocalAwsProfile implements AwsCredentialsType {
    profileName: string;
    constructor(profileName: string);
    static fromObject(object: LocalAwsProfile): LocalAwsProfile;
    getV2Credentials(): Promise<AWS.Credentials>;
    getV3Credentials(): import("@aws-sdk/types").AwsCredentialIdentityProvider;
}
export default LocalAwsProfile;
