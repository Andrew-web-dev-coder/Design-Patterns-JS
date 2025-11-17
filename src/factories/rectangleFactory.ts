import { RectangleModel } from "../rectangle/rectangleModel";
import { RectangleValidator } from "../validators/rectangleValidator";

export class RectangleFactory {
    /** Создать RectangleModel из массива чисел: [x, y, width, height] */
    public static fromNumbers(values: number[]): RectangleModel {
        RectangleValidator.validateNumeric(values);

        const [x, y, width, height] = values;

        return new RectangleModel(x, y, width, height);
    }

    /** Создать RectangleModel из строки: "x y width height" */
    public static fromTextLine(line: string): RectangleModel | null {
        try {
            const nums = RectangleValidator.validateTextLine(line);
            return RectangleFactory.fromNumbers(nums);
        } catch {
            // Некорректные строки удобно отфильтровывать выше по стеку
            return null;
        }
    }
}
