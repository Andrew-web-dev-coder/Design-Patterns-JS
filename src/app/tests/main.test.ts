import { readFile } from "node:fs/promises";

import { main } from "../main";
import { Logger } from "../../common/logging/logger";


jest.mock("node:fs/promises", () => ({
  readFile: jest.fn(),
}));

const readFileMock = readFile as unknown as jest.Mock;

describe("main.ts (smoke)", () => {
  beforeEach(() => {
    jest.spyOn(Logger, "info").mockImplementation(() => {});
    jest.spyOn(Logger, "success").mockImplementation(() => {});
    jest.spyOn(Logger, "warn").mockImplementation(() => {});
    jest.spyOn(Logger, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    readFileMock.mockReset();
  });

  test("main should create cones for valid lines and skip invalid lines", async () => {
   
    readFileMock.mockResolvedValueOnce("0 0 0 5 10\na b c d e\n1 2 3 4 5\n");

    await main();

    
    expect(Logger.success).toHaveBeenCalledTimes(2);
    expect(Logger.warn).toHaveBeenCalledTimes(1);

    
    expect(Logger.info).toHaveBeenCalled();
  });

  test("main should log fatal error if file cannot be read", async () => {
    readFileMock.mockRejectedValueOnce(new Error("ENOENT"));

    await main();

    expect(Logger.error).toHaveBeenCalledTimes(1);
    expect(Logger.success).not.toHaveBeenCalled();
  });
});