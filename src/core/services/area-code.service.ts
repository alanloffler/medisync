import type { IAreaCode } from '@core/interfaces/area-code.interface';
import type { IResponse } from '@core/interfaces/response.interface';

export class AreaCodeService {
  public static async findAll(): Promise<IResponse<IAreaCode[]>> {
    const AREA_CODE = [
      {
        id: 1,
        code: '54',
        abbreviation: 'AR',
        icon: 'argentina',
        label: 'Argentina',
        lang: 'es',
      },
      {
        id: 2,
        code: '55',
        abbreviation: 'BR',
        icon: 'brazil',
        label: 'Brasil',
        lang: 'pt',
      },
      {
        id: 3,
        code: '595',
        abbreviation: 'PY',
        icon: 'paraguay',
        label: 'Paraguay',
        lang: 'es',
      },
      {
        id: 4,
        code: '1',
        abbreviation: 'US',
        icon: 'united-states',
        label: 'United States',
        lang: 'en',
      },
    ];
    // const AREA_CODE2: IAreaCode[] = [];
    // if (AREA_CODE2.length === 0) throw new Error('Empty area codes');
    // throw new Error('Error fetching area codes');
    // return { statusCode: 200, message: 'Area codes loaded', data: AREA_CODE };
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ statusCode: 200, message: 'Area codes loaded', data: AREA_CODE });
      }, 2000);
    });
  }
}
