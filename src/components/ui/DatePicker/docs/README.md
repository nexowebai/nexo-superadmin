# DatePicker Component

A modular and clean date picker component following the project's premium styling.

## 🏗️ Architecture

- **DatePicker.jsx**: Main entry point handling UI orchestration and field status.
- **hooks/useDatePicker.js**: Business logic for date selection, month navigation, and position tracking.
- **components/DatePickerDropdown.jsx**: The calendar UI rendered in a portal.
- **styles/DatePicker.css**: Component-specific styles.

## 📂 Features

- **Portal Rendering**: Prevents overflow issues in containers.
- **Dynamic Positioning**: Adjusts based on the trigger's location.
- **Min/Max Support**: Disable specific date ranges.
- **Animated Interactions**: Smooth transitions using CSS.

## 📦 Usage

```jsx
<DatePicker
  label="Start Date"
  value={date}
  onChange={handleDateChange}
  minDate="2024-01-01"
/>
```
