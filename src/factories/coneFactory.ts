import { Point3D } from "../geometry/point3D";
import { ConeModel } from "../cone/coneModel";
import { ConeValidator } from "../validators/coneValidator";
import { Logger } from "../common/logging/logger";

const DEFAULT_CONE_NAME = "cone";

function generateId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  const stamp = Date.now().toString(36);
  return `${prefix}-${stamp}-${rand}`;
}

export class ConeFactory {
  public static fromNumbers(values: number[], name: string = DEFAULT_CONE_NAME): ConeModel {
    ConeValidator.validateNumeric(values);

    const [cx, cy, cz, radius, height] = values;
    const center = new Point3D(cx, cy, cz);

    // ВАЖНО: под новый ConeModel (params-object)
    return new ConeModel({
      id: generateId("cone"),
      name,
      center,
      radius,
      height,
    });
  }

  public static fromTextLine(line: string, name: string = DEFAULT_CONE_NAME): ConeModel | null {
    try {
      const nums = ConeValidator.validateTextLine(line);
      return ConeFactory.fromNumbers(nums, name);
    } catch (err) {
      Logger.warn(`Invalid cone line skipped: "${line}"`, err);
      return null;
    }
  }
}