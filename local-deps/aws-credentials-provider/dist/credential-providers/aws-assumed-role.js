"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const credential_providers_1 = require("@aws-sdk/credential-providers");
const ROLE_SESSION_DURATION_SECONDS = 3600;
class AwsAssumedRole {
    roleArn;
    sessionName;
    region;
    duration;
    primaryCredentials;
    stsClient;
    stsCreds;
    constructor(args) {
        const { roleArn, sessionName, region, duration, primaryCredentials } = args;
        this.roleArn = roleArn;
        this.sessionName = sessionName;
        this.duration = duration || ROLE_SESSION_DURATION_SECONDS;
        this.region = region;
        this.stsClient = new aws_sdk_1.default.STS({ region });
        this.primaryCredentials = primaryCredentials;
    }
    static fromObject(object) {
        const { roleArn, sessionName, region, duration, primaryCredentials } = object;
        return new AwsAssumedRole({
            roleArn,
            sessionName,
            region,
            duration,
            primaryCredentials
        });
    }
    credsWillExpireInSession() {
        const credsExist = !!this.stsCreds;
        if (!credsExist) {
            return true;
        }
        // TODO: simplify the statements below
        const timeSinceCredsWereSet = this.stsCreds.Expiration.getTime() - new Date().getTime();
        const serviceCredsWillExpireInSession = timeSinceCredsWereSet < this.duration * 1000;
        return serviceCredsWillExpireInSession;
    }
    mapStsCredsToGenericCreds() {
        if (!this.stsCreds) {
            throw new Error('STS creds do not exist!');
        }
        return new aws_sdk_1.default.Credentials({
            accessKeyId: this.stsCreds.AccessKeyId,
            secretAccessKey: this.stsCreds.SecretAccessKey,
            sessionToken: this.stsCreds.SessionToken
        });
    }
    async getV2Credentials() {
        // if sts creds exist and have not expired, return them as generic creds
        if (!this.credsWillExpireInSession()) {
            const genericCreds = this.mapStsCredsToGenericCreds();
            return genericCreds;
        }
        if (this.primaryCredentials) {
            const creds = await this.primaryCredentials.getV2Credentials();
            this.stsClient = new aws_sdk_1.default.STS({
                accessKeyId: creds.accessKeyId,
                secretAccessKey: creds.secretAccessKey,
                sessionToken: creds.sessionToken,
                region: this.region
            });
        }
        const res = await this.stsClient.assumeRole({
            RoleArn: this.roleArn,
            RoleSessionName: this.sessionName,
            DurationSeconds: this.duration
        }).promise();
        this.stsCreds = res.Credentials;
        const genericCreds = this.mapStsCredsToGenericCreds();
        return genericCreds;
    }
    getV3Credentials() {
        let creds;
        try {
            if (this.primaryCredentials) {
                creds = this.primaryCredentials.getV3Credentials();
            }
        }
        catch (error) {
            throw new Error('Failed to get V3 credentials for the provided primaryCredentials. V3 credentials are not supported by all credential types');
        }
        return (0, credential_providers_1.fromTemporaryCredentials)({
            params: {
                RoleArn: this.roleArn,
                RoleSessionName: this.sessionName,
                DurationSeconds: this.duration
            },
            clientConfig: {
                region: this.region
            },
            ...(creds && { masterCredentials: creds })
        });
    }
}
exports.default = AwsAssumedRole;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzLWFzc3VtZWQtcm9sZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jcmVkZW50aWFsLXByb3ZpZGVycy9hd3MtYXNzdW1lZC1yb2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0RBQTBCO0FBQzFCLHdFQUF5RTtBQUt6RSxNQUFNLDZCQUE2QixHQUFHLElBQUksQ0FBQztBQUUzQyxNQUFNLGNBQWM7SUFDbEIsT0FBTyxDQUFTO0lBQ2hCLFdBQVcsQ0FBUztJQUNwQixNQUFNLENBQVM7SUFDZixRQUFRLENBQVU7SUFDbEIsa0JBQWtCLENBQTZDO0lBQ3ZELFNBQVMsQ0FBVTtJQUNuQixRQUFRLENBQXNCO0lBRXRDLFlBQWEsSUFNWjtRQUNDLE1BQU0sRUFDSixPQUFPLEVBQ1AsV0FBVyxFQUNYLE1BQU0sRUFDTixRQUFRLEVBQ1Isa0JBQWtCLEVBQ25CLEdBQUcsSUFBSSxDQUFDO1FBQ1QsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLElBQUksNkJBQTZCLENBQUM7UUFDMUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLGlCQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsa0JBQWtCLENBQUM7SUFDL0MsQ0FBQztJQUVELE1BQU0sQ0FBQyxVQUFVLENBQUUsTUFBc0I7UUFDdkMsTUFBTSxFQUNKLE9BQU8sRUFDUCxXQUFXLEVBQ1gsTUFBTSxFQUNOLFFBQVEsRUFDUixrQkFBa0IsRUFDbkIsR0FBRyxNQUFNLENBQUM7UUFDWCxPQUFPLElBQUksY0FBYyxDQUFDO1lBQ3hCLE9BQU87WUFDUCxXQUFXO1lBQ1gsTUFBTTtZQUNOLFFBQVE7WUFDUixrQkFBa0I7U0FDbkIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLHdCQUF3QjtRQUM5QixNQUFNLFVBQVUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUNuQyxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2YsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUNELHNDQUFzQztRQUN0QyxNQUFNLHFCQUFxQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDeEYsTUFBTSwrQkFBK0IsR0FBRyxxQkFBcUIsR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUNyRixPQUFPLCtCQUErQixDQUFDO0lBQ3pDLENBQUM7SUFFTyx5QkFBeUI7UUFDL0IsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbEIsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1NBQzVDO1FBQ0QsT0FBTyxJQUFJLGlCQUFHLENBQUMsV0FBVyxDQUFDO1lBQ3pCLFdBQVcsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVc7WUFDdEMsZUFBZSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZTtZQUM5QyxZQUFZLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZO1NBQ3pDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxLQUFLLENBQUMsZ0JBQWdCO1FBQ3BCLHdFQUF3RTtRQUN4RSxJQUFJLENBQUMsSUFBSSxDQUFDLHdCQUF3QixFQUFFLEVBQUU7WUFDcEMsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7WUFDdEQsT0FBTyxZQUFZLENBQUM7U0FDckI7UUFDRCxJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtZQUMzQixNQUFNLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1lBQy9ELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxpQkFBRyxDQUFDLEdBQUcsQ0FBQztnQkFDM0IsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO2dCQUM5QixlQUFlLEVBQUUsS0FBSyxDQUFDLGVBQWU7Z0JBQ3RDLFlBQVksRUFBRSxLQUFLLENBQUMsWUFBWTtnQkFDaEMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO2FBQ3BCLENBQUMsQ0FBQztTQUNKO1FBQ0QsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztZQUMxQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87WUFDckIsZUFBZSxFQUFFLElBQUksQ0FBQyxXQUFXO1lBQ2pDLGVBQWUsRUFBRSxJQUFJLENBQUMsUUFBUTtTQUMvQixDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUM7UUFDaEMsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7UUFDdEQsT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQztJQUVELGdCQUFnQjtRQUNkLElBQUksS0FBb0MsQ0FBQztRQUN6QyxJQUFJO1lBQ0YsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEVBQUU7Z0JBQzNCLEtBQUssR0FBSSxJQUFJLENBQUMsa0JBQXlDLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQzthQUM1RTtTQUNGO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxNQUFNLElBQUksS0FBSyxDQUFDLDRIQUE0SCxDQUFDLENBQUM7U0FDL0k7UUFFRCxPQUFPLElBQUEsK0NBQXdCLEVBQUM7WUFDOUIsTUFBTSxFQUFFO2dCQUNOLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztnQkFDckIsZUFBZSxFQUFFLElBQUksQ0FBQyxXQUFXO2dCQUNqQyxlQUFlLEVBQUUsSUFBSSxDQUFDLFFBQVE7YUFDL0I7WUFDRCxZQUFZLEVBQUU7Z0JBQ1osTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO2FBQ3BCO1lBQ0QsR0FBRyxDQUFDLEtBQUssSUFBSSxFQUFFLGlCQUFpQixFQUFFLEtBQUssRUFBRSxDQUFDO1NBQzNDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELGtCQUFlLGNBQWMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBV1MgZnJvbSAnYXdzLXNkayc7XG5pbXBvcnQgeyBmcm9tVGVtcG9yYXJ5Q3JlZGVudGlhbHMgfSBmcm9tICdAYXdzLXNkay9jcmVkZW50aWFsLXByb3ZpZGVycyc7XG5pbXBvcnQgeyBBd3NDcmVkZW50aWFsSWRlbnRpdHlQcm92aWRlciB9IGZyb20gJ0Bhd3Mtc2RrL3R5cGVzJztcbmltcG9ydCBBd3NDcmVkZW50aWFsc1R5cGUgZnJvbSAnLi4vY3JlZGVudGlhbC10eXBlcy9hd3MtY3JlZGVudGlhbHMtdHlwZSc7XG5pbXBvcnQgQXdzQ3JlZGVudGlhbHNUeXBlVjIgZnJvbSAnLi4vY3JlZGVudGlhbC10eXBlcy9hd3MtY3JlZGVudGlhbHMtdHlwZS12Mic7XG5cbmNvbnN0IFJPTEVfU0VTU0lPTl9EVVJBVElPTl9TRUNPTkRTID0gMzYwMDtcblxuY2xhc3MgQXdzQXNzdW1lZFJvbGUgaW1wbGVtZW50cyBBd3NDcmVkZW50aWFsc1R5cGUge1xuICByb2xlQXJuOiBzdHJpbmc7XG4gIHNlc3Npb25OYW1lOiBzdHJpbmc7XG4gIHJlZ2lvbjogc3RyaW5nO1xuICBkdXJhdGlvbj86IG51bWJlcjtcbiAgcHJpbWFyeUNyZWRlbnRpYWxzPzogQXdzQ3JlZGVudGlhbHNUeXBlVjIgfCBBd3NDcmVkZW50aWFsc1R5cGU7XG4gIHByaXZhdGUgc3RzQ2xpZW50OiBBV1MuU1RTO1xuICBwcml2YXRlIHN0c0NyZWRzOiBBV1MuU1RTLkNyZWRlbnRpYWxzO1xuXG4gIGNvbnN0cnVjdG9yIChhcmdzOiB7XG4gICAgcm9sZUFybjogc3RyaW5nLFxuICAgIHNlc3Npb25OYW1lOiBzdHJpbmcsXG4gICAgcmVnaW9uOiBzdHJpbmcsXG4gICAgZHVyYXRpb24/OiBudW1iZXIsXG4gICAgcHJpbWFyeUNyZWRlbnRpYWxzPzogQXdzQ3JlZGVudGlhbHNUeXBlVjIgfCBBd3NDcmVkZW50aWFsc1R5cGU7XG4gIH0pIHtcbiAgICBjb25zdCB7XG4gICAgICByb2xlQXJuLFxuICAgICAgc2Vzc2lvbk5hbWUsXG4gICAgICByZWdpb24sXG4gICAgICBkdXJhdGlvbixcbiAgICAgIHByaW1hcnlDcmVkZW50aWFsc1xuICAgIH0gPSBhcmdzO1xuICAgIHRoaXMucm9sZUFybiA9IHJvbGVBcm47XG4gICAgdGhpcy5zZXNzaW9uTmFtZSA9IHNlc3Npb25OYW1lO1xuICAgIHRoaXMuZHVyYXRpb24gPSBkdXJhdGlvbiB8fCBST0xFX1NFU1NJT05fRFVSQVRJT05fU0VDT05EUztcbiAgICB0aGlzLnJlZ2lvbiA9IHJlZ2lvbjtcbiAgICB0aGlzLnN0c0NsaWVudCA9IG5ldyBBV1MuU1RTKHsgcmVnaW9uIH0pO1xuICAgIHRoaXMucHJpbWFyeUNyZWRlbnRpYWxzID0gcHJpbWFyeUNyZWRlbnRpYWxzO1xuICB9XG5cbiAgc3RhdGljIGZyb21PYmplY3QgKG9iamVjdDogQXdzQXNzdW1lZFJvbGUpOiBBd3NBc3N1bWVkUm9sZSB7XG4gICAgY29uc3Qge1xuICAgICAgcm9sZUFybixcbiAgICAgIHNlc3Npb25OYW1lLFxuICAgICAgcmVnaW9uLFxuICAgICAgZHVyYXRpb24sXG4gICAgICBwcmltYXJ5Q3JlZGVudGlhbHNcbiAgICB9ID0gb2JqZWN0O1xuICAgIHJldHVybiBuZXcgQXdzQXNzdW1lZFJvbGUoe1xuICAgICAgcm9sZUFybixcbiAgICAgIHNlc3Npb25OYW1lLFxuICAgICAgcmVnaW9uLFxuICAgICAgZHVyYXRpb24sXG4gICAgICBwcmltYXJ5Q3JlZGVudGlhbHNcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlZHNXaWxsRXhwaXJlSW5TZXNzaW9uICgpIHtcbiAgICBjb25zdCBjcmVkc0V4aXN0ID0gISF0aGlzLnN0c0NyZWRzO1xuICAgIGlmICghY3JlZHNFeGlzdCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8vIFRPRE86IHNpbXBsaWZ5IHRoZSBzdGF0ZW1lbnRzIGJlbG93XG4gICAgY29uc3QgdGltZVNpbmNlQ3JlZHNXZXJlU2V0ID0gdGhpcy5zdHNDcmVkcy5FeHBpcmF0aW9uLmdldFRpbWUoKSAtIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIGNvbnN0IHNlcnZpY2VDcmVkc1dpbGxFeHBpcmVJblNlc3Npb24gPSB0aW1lU2luY2VDcmVkc1dlcmVTZXQgPCB0aGlzLmR1cmF0aW9uICogMTAwMDtcbiAgICByZXR1cm4gc2VydmljZUNyZWRzV2lsbEV4cGlyZUluU2Vzc2lvbjtcbiAgfVxuXG4gIHByaXZhdGUgbWFwU3RzQ3JlZHNUb0dlbmVyaWNDcmVkcyAoKSB7XG4gICAgaWYgKCF0aGlzLnN0c0NyZWRzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NUUyBjcmVkcyBkbyBub3QgZXhpc3QhJyk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgQVdTLkNyZWRlbnRpYWxzKHtcbiAgICAgIGFjY2Vzc0tleUlkOiB0aGlzLnN0c0NyZWRzLkFjY2Vzc0tleUlkLFxuICAgICAgc2VjcmV0QWNjZXNzS2V5OiB0aGlzLnN0c0NyZWRzLlNlY3JldEFjY2Vzc0tleSxcbiAgICAgIHNlc3Npb25Ub2tlbjogdGhpcy5zdHNDcmVkcy5TZXNzaW9uVG9rZW5cbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGdldFYyQ3JlZGVudGlhbHMgKCkge1xuICAgIC8vIGlmIHN0cyBjcmVkcyBleGlzdCBhbmQgaGF2ZSBub3QgZXhwaXJlZCwgcmV0dXJuIHRoZW0gYXMgZ2VuZXJpYyBjcmVkc1xuICAgIGlmICghdGhpcy5jcmVkc1dpbGxFeHBpcmVJblNlc3Npb24oKSkge1xuICAgICAgY29uc3QgZ2VuZXJpY0NyZWRzID0gdGhpcy5tYXBTdHNDcmVkc1RvR2VuZXJpY0NyZWRzKCk7XG4gICAgICByZXR1cm4gZ2VuZXJpY0NyZWRzO1xuICAgIH1cbiAgICBpZiAodGhpcy5wcmltYXJ5Q3JlZGVudGlhbHMpIHtcbiAgICAgIGNvbnN0IGNyZWRzID0gYXdhaXQgdGhpcy5wcmltYXJ5Q3JlZGVudGlhbHMuZ2V0VjJDcmVkZW50aWFscygpO1xuICAgICAgdGhpcy5zdHNDbGllbnQgPSBuZXcgQVdTLlNUUyh7XG4gICAgICAgIGFjY2Vzc0tleUlkOiBjcmVkcy5hY2Nlc3NLZXlJZCxcbiAgICAgICAgc2VjcmV0QWNjZXNzS2V5OiBjcmVkcy5zZWNyZXRBY2Nlc3NLZXksXG4gICAgICAgIHNlc3Npb25Ub2tlbjogY3JlZHMuc2Vzc2lvblRva2VuLFxuICAgICAgICByZWdpb246IHRoaXMucmVnaW9uXG4gICAgICB9KTtcbiAgICB9XG4gICAgY29uc3QgcmVzID0gYXdhaXQgdGhpcy5zdHNDbGllbnQuYXNzdW1lUm9sZSh7XG4gICAgICBSb2xlQXJuOiB0aGlzLnJvbGVBcm4sXG4gICAgICBSb2xlU2Vzc2lvbk5hbWU6IHRoaXMuc2Vzc2lvbk5hbWUsXG4gICAgICBEdXJhdGlvblNlY29uZHM6IHRoaXMuZHVyYXRpb25cbiAgICB9KS5wcm9taXNlKCk7XG4gICAgdGhpcy5zdHNDcmVkcyA9IHJlcy5DcmVkZW50aWFscztcbiAgICBjb25zdCBnZW5lcmljQ3JlZHMgPSB0aGlzLm1hcFN0c0NyZWRzVG9HZW5lcmljQ3JlZHMoKTtcbiAgICByZXR1cm4gZ2VuZXJpY0NyZWRzO1xuICB9XG5cbiAgZ2V0VjNDcmVkZW50aWFscyAoKSB7XG4gICAgbGV0IGNyZWRzOiBBd3NDcmVkZW50aWFsSWRlbnRpdHlQcm92aWRlcjtcbiAgICB0cnkge1xuICAgICAgaWYgKHRoaXMucHJpbWFyeUNyZWRlbnRpYWxzKSB7XG4gICAgICAgIGNyZWRzID0gKHRoaXMucHJpbWFyeUNyZWRlbnRpYWxzIGFzIEF3c0NyZWRlbnRpYWxzVHlwZSkuZ2V0VjNDcmVkZW50aWFscygpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZhaWxlZCB0byBnZXQgVjMgY3JlZGVudGlhbHMgZm9yIHRoZSBwcm92aWRlZCBwcmltYXJ5Q3JlZGVudGlhbHMuIFYzIGNyZWRlbnRpYWxzIGFyZSBub3Qgc3VwcG9ydGVkIGJ5IGFsbCBjcmVkZW50aWFsIHR5cGVzJyk7XG4gICAgfVxuICAgXG4gICAgcmV0dXJuIGZyb21UZW1wb3JhcnlDcmVkZW50aWFscyh7XG4gICAgICBwYXJhbXM6IHtcbiAgICAgICAgUm9sZUFybjogdGhpcy5yb2xlQXJuLFxuICAgICAgICBSb2xlU2Vzc2lvbk5hbWU6IHRoaXMuc2Vzc2lvbk5hbWUsXG4gICAgICAgIER1cmF0aW9uU2Vjb25kczogdGhpcy5kdXJhdGlvblxuICAgICAgfSxcbiAgICAgIGNsaWVudENvbmZpZzoge1xuICAgICAgICByZWdpb246IHRoaXMucmVnaW9uXG4gICAgICB9LFxuICAgICAgLi4uKGNyZWRzICYmIHsgbWFzdGVyQ3JlZGVudGlhbHM6IGNyZWRzIH0pXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXdzQXNzdW1lZFJvbGU7Il19