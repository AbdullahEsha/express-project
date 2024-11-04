import { UUID } from "crypto";

export type userType = {
  id: string | UUID;
  name: string;
  email: string;
  role: string;
  refresh_token?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
