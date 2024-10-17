export interface Repo<ResourceType, ResourceSelectType> {
  // Permissions
  canUserRead<T extends ResourceType>(
    userId: string | undefined,
    resource: T,
    otherOptions?: any,
  ): boolean;
  canUserUpdate<T extends ResourceType>(
    userId: string | undefined,
    resource: T,
    otherOptions?: any,
  ): boolean;
  canUserDelete<T extends ResourceType>(
    userId: string | undefined,
    resource: T,
    otherOptions?: any,
  ): boolean;
  // Queries
  // Note: we use objects here so that the optional fields don't need to be ordered
  getOne<S extends ResourceSelectType>(options: {
    id: any; // any because it can either be a number or string
    select: S;
    userId: string | undefined;
  }): Promise<any>;
  getManyForUser?<S extends ResourceSelectType>(options: {
    userId: string;
    // Any because it is generally a string but is an enum style string to
    // add code completion.
    query: any;
    select: S;
    extraFilters?: any;
    where: any;
  }): Promise<any[]>;
  getMany?<S extends ResourceSelectType>(options: {
    userId: string;
    query: string;
    select: S;
    extraFilters?: any;
  }): Promise<any[]>;
  // Actions
  update(data: any, id: any, ownerId: string): any;
  delete(id: any, ownerId: string): any;
}
