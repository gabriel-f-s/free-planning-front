import {Occupation} from '../enums/occupation.enum';

export interface User {
  id: string;
  name: string;
  email: string;
  occupation: Occupation;
}
