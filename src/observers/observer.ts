import { Shape } from "../shapes/shape";

export interface Observer {
  update(shape: Shape): void;
}