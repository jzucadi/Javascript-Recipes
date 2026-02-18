<p align="center">
<img src="https://github.com/user-attachments/assets/8ddd0b7d-c9b0-4975-baa9-271bfe97c272" width="75%">
</p>


A curated collection of TypeScript/JavaScript/CoffeeScript design patterns, utilities, and overall tooling for common programming scenarios.  This repository serves as a practical reference for developers looking for battle-tested solutions to everyday coding challenges.

### Design Patterns

#### **Builder Pattern** (`builder.ts`)
Implements the Builder design pattern for constructing complex request objects with a fluent API.

```typescript
const request = new RequestBuilder()
  .forUrl('https://api.example.com')
  .useMethod('POST')
  .setPayload({ data: 'value' })
  .build();
```

#### **Singleton Pattern** (`singleton.coffee`)
Classic singleton implementation in CoffeeScript for ensuring a class has only one instance.

#### **Chain of Responsibility** (`chain-of-resp.coffee`)
Pattern for passing requests along a chain of handlers, written in CoffeeScript.

#### **Prototype Pattern** (`prototype.coffee`)
Demonstrates object creation through prototypal inheritance. 

### UI & DOM Utilities

#### **Table Sorter** (`Sort.ts`)
A modern, feature-rich table sorting utility with: 
- Click headers to sort columns (toggles ascending/descending)
- Stable sorting algorithm
- Per-column type support (number, string, date)
- Automatic type inference
- Full accessibility support (ARIA, keyboard navigation)
- Multiple tbody support
- Customizable indicators and styling

```typescript
const sorter = new TableSorter('#my-table', { 
  indicatorAsc: '▲', 
  indicatorDesc: '▼' 
});
sorter.sortBy(0, 'asc');
```

#### **Multiple Event Listeners** (`add-multiple-listeners.ts`)
Utility for attaching multiple event listeners to DOM elements efficiently.

```typescript
addMultipleListeners(
  element,
  ['click', 'touchstart', 'keydown'],
  handleEvent,
  false,
  [arg1, arg2]
);
```

#### **Class Swapper** (`swap-class.ts`)
Fluent API for swapping CSS classes on elements.

```typescript
utils.swapClass(element, 'old-class').forClass('new-class');
```

#### **Mouse Events** (`mouseover/mouseout-events.ts`)
Handles mouseover and mouseout event patterns. 

### Helper Functions

#### **Descendant Checker** (`is-descendant.js`)
Checks if a DOM element is a descendant of another element.

#### **Fold Utility** (`fold.js`)
Functional programming fold/reduce operation implementation.

#### **Key Checker** (`key-check.js`)
Utility for keyboard event handling and key validation.

## Usage

Each file is self-contained and can be used independently.  Simply import the utility or pattern you need:

```typescript
// ES6 Modules
import { TableSorter } from './Sort';
import { addMultipleListeners } from './add-multiple-listeners';
import RequestBuilder from './builder';

// CommonJS
const { swapClass } = require('./swap-class');
```

## Features

- **Modern TypeScript**:  Fully typed with comprehensive interfaces
- **Accessibility First**: ARIA support and keyboard navigation where applicable
- **Flexible**: Customizable options and extensible patterns
- **Well Documented**:  Inline comments and JSDoc documentation
- **Production Ready**: Error handling and edge case coverage

## Installation

Clone the repository and use the patterns in your projects:

```bash
git clone https://github.com/jzucadi/Typescript-Recipes. git
```

