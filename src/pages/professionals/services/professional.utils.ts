import type { IProfessionalForm } from '@/pages/professionals/interfaces/professional.interface';

export class ProfessionalUtils {
  public static lowercaseFormItems(items: IProfessionalForm): IProfessionalForm {
    const mutableItems = { ...items };
    const { description } = mutableItems;

    for (const [key, value] of Object.entries(mutableItems)) {
      if (typeof value === 'string') {
        mutableItems[key as keyof IProfessionalForm] = value.toLowerCase() as never;
      }
    }

    mutableItems.description = description;
    return mutableItems;
  }
}
