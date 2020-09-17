export interface App {
  id: string;
  name?: string;
  urls?: { ios: string; android: string };
  client?: Client;
  builds?: Build[];
  logo?: string;
  template?: Template;
}

export enum AccountState {
  STALLED = "STALLED",
  CONFIRMING = "CONFIRMING",
  PAID = "PAID",
  BANNED = "BANNED",
}

export interface Client {
  id: string;
  name: string;
  state?: AccountState;
  apps?: App[];
  payments?: Payment[];
}

export enum BuildState {
  STALLED = "STALLED",
  QUEUED = "QUEUED",
  GENERATING = "GENERATING",
  UPLOADING = "UPLOADING",
  PUBLISHED = "PUBLISHED",
  WAITING = "WAITING",
}

export interface Build {
  id: string;
  date?: Date;
  app?: App;
  state: BuildState;
}

export interface Payment {
  id: string;
  initial: Date;
  until: Date;
  concept: string;
  quantity: number;
  confirmed: boolean;
}

export interface Template {
  id: string;
  gitUrl?: string;
  previewImg: string;
  name: string;
}