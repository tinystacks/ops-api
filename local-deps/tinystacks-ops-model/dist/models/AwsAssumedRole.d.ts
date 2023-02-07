import type { AwsKeys } from './AwsKeys';
import type { LocalAwsProfile } from './LocalAwsProfile';
export type AwsAssumedRole = {
    /**
     * The IAM role to assume
     */
    roleArn: string;
    /**
     * The session name to use to assume the role
     */
    sessionName: string;
    /**
     * The profile to use to assume the target role.
     */
    primaryAwsProfileProvider: (AwsKeys | AwsAssumedRole | LocalAwsProfile);
};
