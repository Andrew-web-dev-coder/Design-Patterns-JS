import { RectangleValidator } from "../../validators/rectangleValidator";
import { RectangleFactory } from "../rectangleFactory";
import { RectangleModel } from "../rectangleModel";
import { RectangleValidationError } from "../../common/errors/RectangleValidationError";
import { RectangleService } from "../../services/rectangleService";
import { FileReadError } from "../../common/errors/FileReadError";



describe("Rectangle module tests", () => {

   

    test("Validator should parse valid line correctly", () => {
        const nums = RectangleValidator.validateTextLine("0 0 10 20");
        expect(nums).toEqual([0, 0, 10, 20]);
    });

    test("Validator should throw error on invalid numeric values", () => {
        expect(() => RectangleValidator.validateTextLine("0 A 10 20"))
            .toThrow(RectangleValidationError);
    });

    test("Validator should throw error on wrong number of values", () => {
        expect(() => RectangleValidator.validateTextLine("1 2 3"))
            .toThrow(RectangleValidationError);
    });

   

    test("Factory should create RectangleModel object", () => {
        const nums = [0, 0, 10, 20];
        const rectangle = RectangleFactory.fromNumbers(nums);

        expect(rectangle).toBeInstanceOf(RectangleModel);
        expect(rectangle.width).toBe(10);
        expect(rectangle.height).toBe(20);
    });

    test("Factory.fromTextLine should create RectangleModel from valid line", () => {
        const rect = RectangleFactory.fromTextLine("0 0 10 20");
        expect(rect).toBeInstanceOf(RectangleModel);
    });

    test("Factory.fromTextLine should return null on invalid line", () => {
        const res = RectangleFactory.fromTextLine("invalid");
        expect(res).toBeNull();
    });

   

    test("RectangleModel should calculate area", () => {
        const rect = new RectangleModel(0, 0, 10, 20);
        expect(rect.area()).toBe(200);
    });

    test("RectangleModel should calculate perimeter", () => {
        const rect = new RectangleModel(0, 0, 10, 20);
        expect(rect.perimeter()).toBe(60);
    });

    test("RectangleModel should calculate diagonal", () => {
        const rect = new RectangleModel(0, 0, 3, 4);
        expect(rect.diagonal()).toBe(5);
    });

   
    test("Service: sortByArea should sort rectangles ascending", () => {
        const r1 = new RectangleModel(0, 0, 2, 2);  // area 4
        const r2 = new RectangleModel(0, 0, 3, 3);  // area 9
        const r3 = new RectangleModel(0, 0, 1, 10); // 10

        const sorted = RectangleService.sortByArea([r1, r2, r3]);

        expect(sorted.map(r => r.area())).toEqual([4, 9, 10]);
    });

    test("Service: maxArea should return rectangle with largest area", () => {
        const r1 = new RectangleModel(0, 0, 2, 2);
        const r2 = new RectangleModel(0, 0, 3, 3);
        const r3 = new RectangleModel(0, 0, 1, 10);

        const max = RectangleService.maxArea([r1, r2, r3]);
        expect(max?.area()).toBe(10);
    });

    test("Service: minArea should return rectangle with smallest area", () => {
        const r1 = new RectangleModel(0, 0, 2, 2);
        const r2 = new RectangleModel(0, 0, 3, 3);

        const min = RectangleService.minArea([r1, r2]);
        expect(min?.area()).toBe(4);
    });

    

    test("Service.loadFromFile should load rectangles from valid file", () => {
        const rects = RectangleService.loadFromFile("data/sample_rectangles.txt");
        expect(rects.length).toBeGreaterThan(0);
        rects.forEach(r => expect(r).toBeInstanceOf(RectangleModel));
    });

    test("Service.loadFromFile should skip invalid lines", () => {
        const rects = RectangleService.loadFromFile("data/sample_rectangles.txt");
       
        expect(rects.length).toBeGreaterThanOrEqual(1);
    });

    test("Service.loadFromFile should throw FileReadError for missing file", () => {
        expect(() =>
            RectangleService.loadFromFile("data/NOFILE.txt")
        ).toThrow(FileReadError);
    });

    test("Service.totalArea should work on file-loaded rectangles", () => {
        const rects = RectangleService.loadFromFile("data/sample_rectangles.txt");
        const total = RectangleService.totalArea(rects);
        expect(total).toBeGreaterThan(0);
    });

    test("Service.maxArea should work on file-loaded rectangles", () => {
        const rects = RectangleService.loadFromFile("data/sample_rectangles.txt");
        const max = RectangleService.maxArea(rects);
        expect(max).not.toBeNull();
    });

    test("Service.minArea should work on file-loaded rectangles", () => {
        const rects = RectangleService.loadFromFile("data/sample_rectangles.txt");
        const min = RectangleService.minArea(rects);
        expect(min).not.toBeNull();
    });

  

    test("RectangleModel.touchesAxis returns true when touching X-axis only", () => {
        
        const r = new RectangleModel(10, -5, 10, 10);
        expect(r.touchesAxis()).toBe(true);
    });

    test("RectangleModel.touchesAxis returns true when touching Y-axis only", () => {
        
        const r = new RectangleModel(-5, 10, 10, 10);
        expect(r.touchesAxis()).toBe(true);
    });

    test("RectangleModel.touchesAxis returns true when touching BOTH axes", () => {
       
        const r = new RectangleModel(-5, -5, 10, 10);
        expect(r.touchesAxis()).toBe(true);
    });

    test("RectangleModel.touchesAxis returns false when touching NEITHER axis", () => {
        const r = new RectangleModel(5, 5, 10, 10);
        expect(r.touchesAxis()).toBe(false);
    });

    test("RectangleModel constructor should throw when width or height <= 0", () => {
        expect(() => new RectangleModel(0, 0, 0, 5)).toThrow();
        expect(() => new RectangleModel(0, 0, 5, 0)).toThrow();
        expect(() => new RectangleModel(0, 0, -1, 5)).toThrow();
    });


});
