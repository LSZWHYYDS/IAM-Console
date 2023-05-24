export type DataType = {
  password?: string;
  port?: {
    ldap?: string;
    ldaps?: string;
  };
  org?: {
    filter?: string;
    objectClass?: string;
    name?: string;
    description?: string;
    addDN?: ou = string;
  };
  host?: string;
  membership?: {
    orgUser?: string;
    userOrg?: string;
  };
  user?: {
    filter?: string;
    firstName?: string;
    lastName?: string;
    mail?: string;
    displayName?: string;
    objectClass?: string;
    name?: string;
    mobile?: string;
    dn?: string;
    addDN?: string;
    uniqueID?: string;
  };
  username?: string;
  base?: {
    baseDN?: string;
  };
};
