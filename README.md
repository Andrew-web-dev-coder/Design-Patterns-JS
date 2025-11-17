# Design-Patterns-JS

Design Patterns Practice — Variant: Rectangle & Cone
📁 Project Structure
src/
├─ geometry/
│  ├─ point2D.ts
│  ├─ point3D.ts
│
├─ shapes/
│  ├─ shape.ts
│  ├─ rectangle.ts
│
├─ cone/
│  ├─ coneModel.ts
│
├─ factories/
│  ├─ rectangleFactory.ts
│  ├─ coneFactory.ts
│
├─ validators/
│  ├─ RectangleValidator.ts
│  ├─ ConeValidator.ts
│
├─ services/
│  ├─ rectangleService.ts
│  ├─ coneService.ts
│
├─ common/
│  ├─ errors/
│  │  ├─ RectangleValidationError.ts
│  │  ├─ ConeValidationError.ts
│  │  ├─ ShapeValidationError.ts
│  ├─ logging/
│     ├─ logger.ts
│
├─ index.ts

🎯 Implemented Functionality
Rectangle

Calculates area and perimeter

Validates if four points form a proper rectangle
(checks collinearity, convexity)

Determines whether the rectangle is a:

square

rhombus

trapezoid

Checks if the rectangle intersects only one coordinate axis

Cone

Calculates:

surface area

volume

Determines if the object is a cone

Computes volume slice ratio
(ratio of upper and lower volumes when cut by a coordinate plane)

Checks whether the cone’s base lies on any coordinate plane

Generates a random point inside the cone

🧪 Testing

Run unit tests and generate coverage:

npm run test


Coverage is collected for all modules, including factories, validators, services, geometry, shapes, and cone models.

📥 Input Data

Figures are loaded from:

./data/rectangles.txt

./data/cones.txt

Each line contains numeric parameters; invalid lines are skipped and logged.

✏ Input Format
Rectangle
x1 y1 x2 y2 x3 y3 x4 y4


Where:

Points must form a valid convex quadrilateral

Order is not guaranteed — service resolves proper arrangement

Validation removes invalid numeric entries

Cone
centerX centerY centerZ radius height


Where:

Radius > 0

Height > 0

All numeric values must be valid finite numbers

Invalid lines are skipped and logged

🗂 Example Files
rectangles.txt
0 0 4 0 4 3 0 3
1 1 2 2 3 3 4 4     # invalid (collinear)

cones.txt
0 0 0 5 10
1 2 3 -4 8          # invalid radius

🧱 Factories

Both entities use Factory Method Pattern:

RectangleFactory

ConeFactory

Factories validate parameters and construct entity objects.

🧹 Validators
Input Data Validators

Validate numeric input

Reject invalid lines, values, or formats

Throw custom errors

RectangleValidator

Validates:

Length = 4 coordinate pairs (8 numbers)

Non-collinearity

Numeric correctness

ConeValidator

Validates:

Five numeric values

Positive radius / height

Finite numbers

🧱 Error Handling

Custom exceptions:

RectangleValidationError

ConeValidationError

ShapeValidationError

All errors are caught at the service layer and logged using pino.

📊 Logging

Using pino:

Logs to console

Logs to logs/app.log

Logs invalid input lines + warnings

