export type AwsKeys = {
    AwsAccessKeyId: string;
    AwsSecretAccessKey: string;
    /**
     * Optional - specify this if you're using temporary credentials or an assumed role
     */
    AwsSessionToken?: string;
};
