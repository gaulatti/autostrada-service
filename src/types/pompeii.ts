export type GetFeaturesByApplicationRequest = {
  slug: string;
};

export type GetFeaturesByApplicationResponse = {
  features: Feature[];
};

export type Identity = {
  dateCreated: string;
  userId: string;
  providerName: string;
  providerType: string;
  issuer: string;
  primary: string;
};

export type UserIdentity = {
  at_hash: string;
  sub: string;
  cognito_groups: string[];
  email_verified: boolean;
  iss: string;
  cognito_username: string;
  given_name: string;
  picture: string;
  origin_jti: string;
  aud: string;
  identities: Identity[];
  token_use: string;
  auth_time: number;
  exp: number;
  iat: number;
  family_name: string;
  jti: string;
  email: string;
  key: string;
};

export type Login = {
  id: number;
  user_id: number;
  provider: string;
  sub: string;
  created_at: string;
};

export type User = {
  id: number;
  email: string;
  slug: string;
  name: string;
  last_name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  logins: Login[];
};

export type Feature = {
  name: string;
  slug: string;
  default_value: string;
};

export type UserContext = {
  me: User;
  features: Feature[];
};
