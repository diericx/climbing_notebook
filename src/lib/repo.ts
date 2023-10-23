export interface Repo<ResourceType, ResourceSelectType> {
  // Permissions
  canUserRead<T extends ResourceType>(userId: string | undefined, resource: T): boolean;
  canUserUpdate<T extends ResourceType>(userId: string | undefined, resource: T): boolean;
  canUserDelete<T extends ResourceType>(userId: string | undefined, resource: T): boolean;
  // Queries
  // TODO: make this any return type more specific
  // Note: we use objects here so that the optional fields don't need to be ordered
  getOne<S extends ResourceSelectType>(options: {
    id: number | string;
    select: S;
    userId: string | undefined;
  }): Promise<any>;
  getManyForUser<S extends ResourceSelectType>(options: {
    userId: string;
    query: string;
    select: S;
    extraFilters?: any;
  }): Promise<any[]>;
  // Actions
  update(data: any, id: number | string, ownerId: string): any;
  delete(id: number | string, ownerId: string): any;
}
