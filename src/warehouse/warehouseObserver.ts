import { Observer } from "../observers/observer";
import { Shape } from "../shapes/shape";
import { RectangleModel } from "../rectangle/rectangleModel";
import { ConeModel } from "../cone/coneModel";
import { RectangleService } from "../services/rectangleService";
import { ConeService } from "../services/coneService";
import { Warehouse } from "./warehouse";

export class WarehouseObserver implements Observer {
  public update(shape: Shape): void {
    const warehouse = Warehouse.getInstance();

    if (shape instanceof RectangleModel) {
      warehouse.set(shape.id, {
        area: RectangleService.area(shape),
        perimeter: RectangleService.perimeter(shape),
      });
      return;
    }

    if (shape instanceof ConeModel) {
      warehouse.set(shape.id, {
        surfaceArea: ConeService.surfaceArea(shape),
        volume: ConeService.volume(shape),
      });
    }
  }
}