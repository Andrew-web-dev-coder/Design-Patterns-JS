import { RectangleValidator } from "../validators/rectangleValidator";

import { RectangleModel } from "./rectangleModel";


export class RectangleFactory {

    /** Create Rectangle from array: [x, y, width, height] */
    public static fromNumbers(values: number[]): RectangleModel {
        RectangleValidator.validateNumeric(values);

        const [x, y, width, height] = values;

        return new RectangleModel(x, y, width, height);
    }

    /** Create Rectangle from text line: "x y width height" */
    public static fromTextLine(line: string): RectangleModel | null {
        try {
            const nums = RectangleValidator.validateTextLine(line);
            return RectangleFactory.fromNumbers(nums);
        } catch {
            return null;
        }
    }
}

