import type { AwsAssumedRole } from './AwsAssumedRole';
import type { AwsKeys } from './AwsKeys';
import type { LocalAwsProfile } from './LocalAwsProfile';
import type { Provider } from './Provider';
export type AwsProfileProvider = (Provider & {
    credentials: (AwsKeys | AwsAssumedRole | LocalAwsProfile);
});
