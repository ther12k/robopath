export interface LocalDiagnostics {
  runsStarted: number;
  editsMade: number;
  hintsViewed: number;
  retriesEncountered: number;
}

class DiagnosticsTracker {
  private enabled = false;
  private data: LocalDiagnostics = {
    runsStarted: 0,
    editsMade: 0,
    hintsViewed: 0,
    retriesEncountered: 0,
  };

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public recordRun(): void {
    if (this.enabled) this.data.runsStarted++;
  }

  public recordEdit(): void {
    if (this.enabled) this.data.editsMade++;
  }

  public recordHint(): void {
    if (this.enabled) this.data.hintsViewed++;
  }

  public recordRetry(): void {
    if (this.enabled) this.data.retriesEncountered++;
  }

  public exportDiagnostics(): string {
    return JSON.stringify(
      {
        app: 'robo-paths',
        purpose: 'local-usability-diagnostics',
        collectedLocallyAt: new Date().toISOString(),
        metrics: this.data,
      },
      null,
      2,
    );
  }

  public reset(): void {
    this.data = {
      runsStarted: 0,
      editsMade: 0,
      hintsViewed: 0,
      retriesEncountered: 0,
    };
  }
}

export const diagnostics = new DiagnosticsTracker();
