/* eslint-disable @typescript-eslint/no-explicit-any */
import { IProfessionalForm } from '../interfaces/professional.interface';
import { ProfessionalUtils } from './professional.utils';
import { SortingState } from '@tanstack/react-table';

export class ProfessionalApiService {
  private static readonly API_URL = import.meta.env.VITE_API_URL;

  public static async findAll(search: string, sorting: SortingState, skip: number, limit: number) {
    const url: string = `${this.API_URL}/professionals?search=${search}&skip=${skip}&limit=${limit}&sk=${sorting[0].id}&sv=${sorting[0].desc ? 'desc' : 'asc'}`;

    try {
      const query: Response = await fetch(url, {
        method: 'GET',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
      });

      return await query.json();
    } catch (error) {
      return error;
    }
  }

  public static async findAllActive() {
    const url: string = `${this.API_URL}/professionals/active`;

    try {
      const query: Response = await fetch(url, {
        method: 'GET',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
      });

      return await query.json();
    } catch (error) {
      return error;
    }
  }

  public static async findBySpecialization(id: string, skip: number, limit: number) {
    const url: string = `${this.API_URL}/professionals/specialization?id=${id}&limit=${limit}&skip=${skip}`;

    try {
      const query: Response = await fetch(url, {
        method: 'GET',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
      });

      return await query.json();
    } catch (error) {
      return error;
    }
  }

  public static async create(data: IProfessionalForm) {
    const transformedData = ProfessionalUtils.lowercaseFormItems(data);
    const url: string = `${this.API_URL}/professionals`;

    try {
      const query = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify(transformedData),
      });

      return await query.json();
    } catch (error) {
      return error;
    }
  }

  public static async findOne(id: string) {
    const url: string = `${this.API_URL}/professionals/${id}`;

    try {
      const query: Response = await fetch(url, {
        method: 'GET',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
      });

      return await query.json();
    } catch (e) {
      return e;
    }
  }
  // TODO FORMATTED DATA TO LOWER CASE INPUTS
  public static async update(id: string, data: IProfessionalForm) {
    const url: string = `${this.API_URL}/professionals/${id}`;

    try {
      const query: Response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify(data),
      });

      return await query.json();
    } catch (e) {
      return e;
    }
  }

  public static async remove(id: string) {
    const url: string = `${this.API_URL}/professionals/${id}`;
    try {
      const query: Response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
      });

      return await query.json();
    } catch (error) {
      return error;
    }
  }
}

// App
// import { IUserCreate } from '@/lib/interfaces/user.interface';
// import { store } from './store.services';
// import { Roles } from '@/lib/constants';
// // Service class
// export class UsersServices {
// 	static readonly #API_URL = import.meta.env.VITE_REACT_BACKEND_API;

// 	static async create(data: IUserCreate) {
// 		try {
// 			const token = store.getState().authToken;
// 			const query: Response = await fetch(`${UsersServices.#API_URL}/auth/register`, {
// 				method: 'POST',
// 				headers: {
// 					'content-type': 'application/json;charset=UTF-8',
// 					Authorization: `Bearer ${token}`
// 				},
// 				body: JSON.stringify(data)
// 			});
// 			return await query.json();
// 		} catch (e) {
// 			return e;
// 		}
// 	}

// 	static async getAll() {
// 		try {
// 			const token = store.getState().authToken;
// 			const query: Response = await fetch(`${UsersServices.#API_URL}/users`, {
// 				method: 'GET',
// 				headers: {
// 					'content-type': 'application/json;charset=UTF-8',
// 					Authorization: `Bearer ${token}`
// 				}
// 			});
// 			return await query.json();
// 		} catch (e) {
// 			return e;
// 		}
// 	}

// 	static async findOne(id: number) {
// 		try {
// 			const token = store.getState().authToken;
// 			let url: string = '';
// 			if (store.getState().role === Roles.ADMIN) {
// 				url = `${UsersServices.#API_URL}/users/${id}/withDeleted`;
// 			} else {
// 				url = `${UsersServices.#API_URL}/users/${id}`;
// 			}
// 			const query: Response = await fetch(url, {
// 				method: 'GET',
// 				headers: {
// 					'content-type': 'application/json;charset=UTF-8',
// 					Authorization: `Bearer ${token}`
// 				}
// 			});
// 			return await query.json();
// 		} catch (e) {
// 			return e;
// 		}
// 	}

// 	static async update(id: number, data: IUserCreate) {
// 		try {
// 			const token = store.getState().authToken;
// 			const query: Response = await fetch(`${UsersServices.#API_URL}/users/${id}`, {
// 				method: 'PATCH',
// 				headers: {
// 					'content-type': 'application/json;charset=UTF-8',
// 					Authorization: `Bearer ${token}`
// 				},
// 				body: JSON.stringify(data)
// 			});
// 			return await query.json();
// 		} catch (e) {
// 			return e;
// 		}
// 	}

// 	static async restore(id: number) {
// 		try {
// 			const token = store.getState().authToken;
// 			const query: Response = await fetch(`${UsersServices.#API_URL}/users/${id}/restore`, {
// 				method: 'PATCH',
// 				headers: {
// 					'content-type': 'application/json;charset=UTF-8',
// 					Authorization: `Bearer ${token}`
// 				}
// 			});
// 			return await query.json();
// 		} catch (e) {
// 			return e;
// 		}
// 	}

// 	static async removeSoft(id: number) {
// 		try {
// 			const token = store.getState().authToken;
// 			const query: Response = await fetch(`${UsersServices.#API_URL}/users/${id}/soft`, {
// 				method: 'DELETE',
// 				headers: {
// 					'content-type': 'application/json;charset=UTF-8',
// 					Authorization: `Bearer ${token}`
// 				}
// 			});
// 			return await query.json();
// 		} catch (e) {
// 			return e;
// 		}
// 	}

// 	static async remove(id: number) {
// 		try {
// 			const token = store.getState().authToken;
// 			const query: Response = await fetch(`${UsersServices.#API_URL}/users/${id}`, {
// 				method: 'DELETE',
// 				headers: {
// 					'content-type': 'application/json;charset=UTF-8',
// 					Authorization: `Bearer ${token}`
// 				}
// 			});
// 			return await query.json();
// 		} catch (e) {
// 			return e;
// 		}
// 	}
// }
