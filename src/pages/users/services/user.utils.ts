import { IUserForm } from '../interfaces/user.interface';

export class UserUtils {
  public static lowercaseFormItems(items: IUserForm): IUserForm {
    const mutableItems = { ...items };

    for (const [key, value] of Object.entries(mutableItems)) {
      if (typeof value === 'string') {
        mutableItems[key as keyof IUserForm] = value.toLowerCase() as never;
      }
    }
    return mutableItems;
  }
}
