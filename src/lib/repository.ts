export interface BaseRepository<TEntity, TCreate = Partial<TEntity>, TUpdate = Partial<TEntity>> {
    create(data: TCreate): Promise<TEntity>
    read(id: number): Promise<TEntity | null>
    update(id: number, data: TUpdate): Promise<TEntity>
    delete(id: number): Promise<boolean>
    list(): Promise<TEntity[]>
}
