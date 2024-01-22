export interface Repo<ResourceType, ResourceSelectType> {
  // Permissions
  canUserRead<T extends ResourceType>(
    userId: string | undefined,
    resource: T,
    otherOptions?: any
  ): boolean;
  canUserUpdate<T extends ResourceType>(
    userId: string | undefined,
    resource: T,
    otherOptions?: any
  ): boolean;
  canUserDelete<T extends ResourceType>(
    userId: string | undefined,
    resource: T,
    otherOptions?: any
  ): boolean;
  // Queries
  // TODO: make this any return type more specific
  // Note: we use objects here so that the optional fields don't need to be ordered
  getOne<S extends ResourceSelectType>(options: {
    id: any;
    select: S;
    userId: string | undefined;
  }): Promise<any>;
  getManyForUser?<S extends ResourceSelectType>(options: {
    userId: string;
    // TODO: can we make this a generic enum to support any variation of "string1" | "string2"?
    query: any;
    select: S;
    extraFilters?: any;
    // TODO: make this type more specific
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
