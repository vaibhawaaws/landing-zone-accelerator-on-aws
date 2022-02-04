/**
 *  Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import { throttlingBackOff } from '@aws-accelerator/utils';
import { UpdateAccountPasswordPolicyCommand, IAMClient } from '@aws-sdk/client-iam';

/**
 * update-account-password-policy - lambda handler
 *
 * @param event
 * @returns
 */
export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent): Promise<
  | {
      PhysicalResourceId: string | undefined;
      Status: string;
    }
  | undefined
> {
  switch (event.RequestType) {
    case 'Create':
    case 'Update':
      const iamClient = new IAMClient({});
      await throttlingBackOff(() =>
        iamClient.send(
          new UpdateAccountPasswordPolicyCommand({
            AllowUsersToChangePassword: event.ResourceProperties['allowUsersToChangePassword'] === 'true',
            HardExpiry: event.ResourceProperties['hardExpiry'] === 'true',
            RequireUppercaseCharacters: event.ResourceProperties['requireUppercaseCharacters'] === 'true',
            RequireLowercaseCharacters: event.ResourceProperties['requireLowercaseCharacters'] === 'true',
            RequireSymbols: event.ResourceProperties['requireSymbols'] === 'true',
            RequireNumbers: event.ResourceProperties['requireNumbers'] === 'true',
            MinimumPasswordLength: event.ResourceProperties['minimumPasswordLength'],
            PasswordReusePrevention: event.ResourceProperties['passwordReusePrevention'],
            MaxPasswordAge: event.ResourceProperties['maxPasswordAge'],
          }),
        ),
      );

      return {
        PhysicalResourceId: 'update-account-password-policy',
        Status: 'SUCCESS',
      };

    case 'Delete':
      // Do Nothing
      return {
        PhysicalResourceId: event.PhysicalResourceId,
        Status: 'SUCCESS',
      };
  }
}
