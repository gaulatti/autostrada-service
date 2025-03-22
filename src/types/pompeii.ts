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

export type Permission = {
  id: number;
  feature_id: number;
  membership_id: number;
  level?: 'C' | 'T1' | 'T2' | 'T3';
};

export type Team = {
  id: number;
  name: string;
  slug: string;
  // Optionally, if teams also list memberships:
  memberships?: Membership[];
};

export type Membership = {
  id: number;
  users_id: number;
  teams_id: number;
  role: number;
  permissions?: Permission[];
  team?: Team;
};

export type User = {
  id: number;
  email: string;
  slug: string;
  name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  memberships?: Membership[];
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
