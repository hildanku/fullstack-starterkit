export interface BaseRepository<T> {
    create(data: Partial<T>): Promise<T>
    read(id: number): Promise<T | null>
    update(id: number, data: Partial<T>): Promise<T>
    delete(id: number): Promise<boolean>
    list(): Promise<T[]>
}