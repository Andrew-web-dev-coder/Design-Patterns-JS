import { ConeValidator } from "../validators/coneValidator";
import { ConeFactory } from "../cone/coneFactory";
import { Logger } from "../common/logging/logger";

export function runExample(): void {
    Logger.info("Starting cone validation...");

    try {
        const nums = ConeValidator.validateTextLine("0 0 0 5 10");
        const cone = ConeFactory.fromNumbers(nums);

        Logger.success(`Cone created: radius=${cone.radius}, height=${cone.height}`);
    } catch (err) {
        Logger.error("Failed to process input", err);
    }
}
