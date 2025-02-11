export enum StateEvent {
  GetAddress = 'GetAddress',
  ActivityStats = 'ActivityStats',
  GetTokenPortfolio = 'GetTokenPortfolio',
  GetNftPortfolio = 'GetNftPortfolio',
  GetTokenActivity = 'GetTokenActivity',
  GetNftActivity = 'GetNftActivity',
  GetTalentScore = 'GetTalentScore',
}

export enum BinaryState {
  True = 'True',
  False = 'False',
}

export enum ThreeStageState {
  Idle = 'Idle',
  InProgress = 'InProgress',
  Finished = 'Finished',
}

export type StateOption = BinaryState | ThreeStageState;

export type StateEventRegistry = Partial<Record<StateEvent, StateOption>>;

export interface Toastable<T> {
  toast?: string;
  value: T;
}
