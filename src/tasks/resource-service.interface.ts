import { DeleteResult, FindOptionsWhere, UpdateResult } from "typeorm";

export default interface IResourceService<T> {
  /**
   * Asserts the existence of a resource with the given ID.
   * @param id - The ID of the resource.
   * @returns A Promise that resolves when the existence is asserted.
   */
  assertExistence?(id: string): Promise<void>;

  /**
   * Fetches a resource by the given ID.
   * @param id - The ID of the resource.
   * @returns A Promise that resolves with the fetched resource.
   */
  fetchOne?(id: string): Promise<T | null>;

  /**
   * Fetches a resource by the given ID or throws an error if not found.
   * @param id - The ID of the resource.
   * @returns A Promise that resolves with the fetched resource.
   * @throws An error if the resource is not found.
   */
  fetchOneOrThrow?(id: string): Promise<T>;

  /**
   * Fetches a single resource based on the provided WHERE conditions.
   * @param where - The WHERE conditions to customize the fetch operation.
   * @returns A Promise that resolves with the fetched resource.
   */
  fetchOneWhere?(where: FindOptionsWhere<T>): Promise<T | null>;

  /**
   * Fetches a single resource based on the provided WHERE conditions or throws an error if not found.
   * @param where - The WHERE conditions to customize the fetch operation.
   * @returns A Promise that resolves with the fetched resource.
   * @throws An error if no resource is found.
   */
  fetchOneWhereOrThrow?(where: FindOptionsWhere<T>): Promise<T>;

  /**
   * Fetches multiple resources based on additional arguments.
   * @param args - Additional arguments to customize the fetch operation.
   * @returns A Promise that resolves with an array of fetched resources.
   */
  fetchMany?(...args: unknown[]): Promise<T[] | object>;

  /**
   * Fetches multiple resources based on the provided WHERE conditions.
   * @param where - The WHERE conditions to customize the fetch operation.
   * @returns A Promise that resolves with an array of fetched resources.
   */
  fetchManyWhere?(where: FindOptionsWhere<T>): Promise<T[]>;

  /**
   * Creates a new resource based on additional arguments.
   * @param args - Additional arguments to customize the creation operation.
   * @returns A Promise that resolves with the created resource.
   */
  createOne?(...args: unknown[]): Promise<T>;

  /**
   * Deletes a resource by the given ID.
   * @param args - Additional arguments to customize the creation operation.
   * @returns A Promise that resolves with the delete result or the deleted resource.
   */
  deleteOne?(...args: unknown[]): Promise<DeleteResult | T>;

  /**
   * Deletes multiple resources.
   * @param ids - An array of IDs for the resources to delete.
   * @returns A Promise that resolves with an array of delete results or deleted resources.
   */
  deleteMany?(ids: Array<string>): Promise<DeleteResult | T>;

  /**
   * Updates a resource by the given ID.
   * @param args - Additional arguments to customize the update operation.
   * @returns A Promise that resolves with the update result or the updated resource.
   */
  updateOne?(...args: unknown[]): Promise<UpdateResult | T>;

  /**
   * Updates multiple resources.
   * @param updates - An array of update objects specifying the ID and updated properties for each resource.
   * @returns A Promise that resolves with an array of updated resources.
   */
  updateMany?(updates: Array<{ id: string; update: Partial<T> }>): Promise<UpdateResult>;

  /**
   * Counts the total number of resources.
   * @returns A Promise that resolves with the count of resources.
   */
  count?(): Promise<number>;
}
