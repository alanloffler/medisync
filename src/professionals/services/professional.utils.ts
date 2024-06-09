import { IProfessionalForm } from '../interfaces/professional.interface';

export class ProfessionalUtils {
  public static lowercaseFormItems(items: IProfessionalForm): IProfessionalForm {
    const mutableItems = { ...items };

    for (const [key, value] of Object.entries(mutableItems)) {
      if (typeof value === 'string') {
        mutableItems[key as keyof IProfessionalForm] = value.toLowerCase() as never;
      }
    }
    return mutableItems;
  }
}
