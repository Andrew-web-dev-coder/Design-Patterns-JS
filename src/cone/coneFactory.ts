import { Point3D } from "../geometry/point3D";
import { ConeModel } from "./coneModel";
import { ConeValidator } from "../validators/coneValidator";

export class ConeFactory {

    
    public static fromNumbers(values: number[]): ConeModel {
        ConeValidator.validateNumeric(values);

        const [cx, cy, cz, radius, height] = values;
        const center = new Point3D(cx, cy, cz);

        return new ConeModel(center, radius, height);
    }

    
    public static fromTextLine(line: string): ConeModel | null {
        try {
            const nums = ConeValidator.validateTextLine(line);
            return ConeFactory.fromNumbers(nums);
        } catch {
            return null;
        }
    }
}
