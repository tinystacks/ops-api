"use strict";
// import { LocalAwsProfile as LocalAwsProfileType } from '@tinystacks/ops-model';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const credential_providers_1 = require("@aws-sdk/credential-providers");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
class LocalAwsProfile {
    profileName;
    constructor(profileName) {
        this.profileName = profileName;
    }
    static fromObject(object) {
        const { profileName } = object;
        return new LocalAwsProfile(profileName);
    }
    async getV2Credentials() {
        const sharedCreds = new aws_sdk_1.default.SharedIniFileCredentials({
            profile: this.profileName
        });
        return sharedCreds;
    }
    getV3Credentials() {
        return (0, credential_providers_1.fromIni)({
            profile: this.profileName
        });
    }
}
exports.default = LocalAwsProfile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWwtYXdzLXByb2ZpbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY3JlZGVudGlhbC1wcm92aWRlcnMvbG9jYWwtYXdzLXByb2ZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLGtGQUFrRjs7Ozs7QUFFbEYsd0VBQXdEO0FBQ3hELHNEQUEwQjtBQUcxQixNQUFNLGVBQWU7SUFDbkIsV0FBVyxDQUFTO0lBRXBCLFlBQ0UsV0FBbUI7UUFFbkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7SUFDakMsQ0FBQztJQUVELE1BQU0sQ0FBQyxVQUFVLENBQUUsTUFBdUI7UUFDeEMsTUFBTSxFQUNKLFdBQVcsRUFDWixHQUFHLE1BQU0sQ0FBQztRQUNYLE9BQU8sSUFBSSxlQUFlLENBQ3hCLFdBQVcsQ0FDWixDQUFDO0lBQ0osQ0FBQztJQUVELEtBQUssQ0FBQyxnQkFBZ0I7UUFDcEIsTUFBTSxXQUFXLEdBQUcsSUFBSSxpQkFBRyxDQUFDLHdCQUF3QixDQUFDO1lBQ25ELE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVztTQUMxQixDQUFDLENBQUM7UUFDSCxPQUFPLFdBQThCLENBQUM7SUFDeEMsQ0FBQztJQUVELGdCQUFnQjtRQUNkLE9BQU8sSUFBQSw4QkFBTyxFQUFDO1lBQ2IsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXO1NBQzFCLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELGtCQUFlLGVBQWUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCB7IExvY2FsQXdzUHJvZmlsZSBhcyBMb2NhbEF3c1Byb2ZpbGVUeXBlIH0gZnJvbSAnQHRpbnlzdGFja3Mvb3BzLW1vZGVsJztcblxuaW1wb3J0IHsgZnJvbUluaSB9IGZyb20gJ0Bhd3Mtc2RrL2NyZWRlbnRpYWwtcHJvdmlkZXJzJztcbmltcG9ydCBBV1MgZnJvbSAnYXdzLXNkayc7XG5pbXBvcnQgQXdzQ3JlZGVudGlhbHNUeXBlIGZyb20gJy4uL2NyZWRlbnRpYWwtdHlwZXMvYXdzLWNyZWRlbnRpYWxzLXR5cGUnO1xuXG5jbGFzcyBMb2NhbEF3c1Byb2ZpbGUgaW1wbGVtZW50cyBBd3NDcmVkZW50aWFsc1R5cGUge1xuICBwcm9maWxlTmFtZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yIChcbiAgICBwcm9maWxlTmFtZTogc3RyaW5nXG4gICkge1xuICAgIHRoaXMucHJvZmlsZU5hbWUgPSBwcm9maWxlTmFtZTtcbiAgfVxuXG4gIHN0YXRpYyBmcm9tT2JqZWN0IChvYmplY3Q6IExvY2FsQXdzUHJvZmlsZSk6IExvY2FsQXdzUHJvZmlsZSB7XG4gICAgY29uc3Qge1xuICAgICAgcHJvZmlsZU5hbWVcbiAgICB9ID0gb2JqZWN0O1xuICAgIHJldHVybiBuZXcgTG9jYWxBd3NQcm9maWxlKFxuICAgICAgcHJvZmlsZU5hbWVcbiAgICApO1xuICB9XG5cbiAgYXN5bmMgZ2V0VjJDcmVkZW50aWFscyAoKSB7XG4gICAgY29uc3Qgc2hhcmVkQ3JlZHMgPSBuZXcgQVdTLlNoYXJlZEluaUZpbGVDcmVkZW50aWFscyh7XG4gICAgICBwcm9maWxlOiB0aGlzLnByb2ZpbGVOYW1lXG4gICAgfSk7XG4gICAgcmV0dXJuIHNoYXJlZENyZWRzIGFzIEFXUy5DcmVkZW50aWFscztcbiAgfVxuXG4gIGdldFYzQ3JlZGVudGlhbHMgKCkge1xuICAgIHJldHVybiBmcm9tSW5pKHtcbiAgICAgIHByb2ZpbGU6IHRoaXMucHJvZmlsZU5hbWVcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBMb2NhbEF3c1Byb2ZpbGU7Il19