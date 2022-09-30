export interface SyncHandler {
  insert(dryRun: boolean): void
  clean(): void
}
