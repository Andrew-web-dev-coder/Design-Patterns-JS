# Лабораторная работа №4
## Вариант 11  
### Паттерны: Factory Method, Composite, Chain of Responsibility

# Архитектура решения

## Factory Method

Позволяет создавать разные типы задач без прямого использования `new` в клиентском коде.

### Продукты (Tasks):
- `BugTask`
- `FeatureTask`
- `DocumentationTask`

### Абстрактная фабрика:
- `TaskFactory`

### Конкретные фабрики:
- `BugFactory`
- `FeatureFactory`
- `DocumentationFactory`

Таким образом, создание задач инкапсулировано внутри фабрик.

---

## Composite

Позволяет объединять задачи в древовидную структуру.

### Компонент:
- `TaskComponent`

### Лист:
- `Task`

### Составной объект:
- `Epic`

`Epic` может содержать несколько задач и вычислять суммарную сложность.

# Структура проекта

src/
tasks.ts // Task + Epic (Composite)
factory.ts // Factory Method
chain.ts // Chain of Responsibility
index.ts // Демонстрация работы

Программа:

1. Создаёт задачи разных типов через Factory Method.
2. Объединяет их в Epic (Composite).
3. Вычисляет общую сложность задач.
4. Передаёт задачи по цепочке обработчиков (Chain of Responsibility).
5. Выводит в консоль информацию об обработке задач.