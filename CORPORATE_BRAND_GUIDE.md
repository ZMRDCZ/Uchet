# Корпоративный бренд-гайд

## Обзор

Данный документ описывает корпоративную цветовую палитру и стили для системы учёта активности предприятия.

## Шрифт

**Основной шрифт:** Arial
- **Regular:** 400
- **Bold:** 700

```css
font-family: 'Arial', sans-serif;
font-weight: 400; /* Regular */
font-weight: 700; /* Bold */
```

## Цветовая палитра

### Основные цвета

#### 1. Основной синий (Primary Blue)
- **CMYK:** 100/85/5/35
- **RGB:** 0/38/100
- **HEX:** #002664
- **PANTONE:** 281 C
- **RAL:** 5013 Cobalt blue

#### 2. Вторичный синий (Secondary Blue)
- **RGB:** 15/77/188
- **HEX:** #0f4dbc
- **RAL:** 5010 Gentian blue

#### 3. Светло-голубой (Light Blue)
- **RGB:** 135/200/220
- **HEX:** #87c8dc

#### 4. Акцентный голубой (Accent Blue)
- **CMYK:** 45/5/10/0
- **HEX:** #87c8dc

### Серые тона с примесью голубого

#### 5. Серо-голубой светлый (Gray Blue Light)
- **RGB:** 128/143/154
- **HEX:** #808f9a

#### 6. Серо-голубой тёмный (Gray Blue Dark)
- **RGB:** 70/80/86
- **HEX:** #465056

#### 7. Серый светлый (Gray Light)
- **CMYK:** 20/0/0/50
- **HEX:** #808080

#### 8. Серый тёмный (Gray Dark)
- **CMYK:** 20/0/0/80
- **HEX:** #333333

### Дополнительные цвета для акцентов

#### 9. Акцентный оранжевый (Accent Orange)
- **CMYK:** 0/75/75/0
- **RGB:** 235/115/90
- **HEX:** #eb735a

#### 10. Акцентный красный (Accent Red)
- **CMYK:** 0/100/100/15
- **RGB:** 205/25/30
- **HEX:** #cd191e

#### 11. Акцентный бирюзовый (Accent Teal)
- **CMYK:** 75/5/45/0
- **RGB:** 0/175/165
- **HEX:** #00afa5

## CSS переменные

```css
:root {
  /* Основные цвета */
  --primary-blue: #002664;
  --secondary-blue: #0f4dbc;
  --light-blue: #87c8dc;
  --accent-blue: #87c8dc;
  
  /* Серые тона с примесью голубого */
  --gray-blue-light: #808f9a;
  --gray-blue-dark: #465056;
  --gray-light: #808080;
  --gray-dark: #333333;
  
  /* Дополнительные цвета для акцентов */
  --accent-orange: #eb735a;
  --accent-red: #cd191e;
  --accent-teal: #00afa5;
  
  /* Системные цвета */
  --success: #00afa5;
  --warning: #eb735a;
  --danger: #cd191e;
  --info: #87c8dc;
  
  /* Нейтральные цвета */
  --white: #ffffff;
  --light-gray: #f8f9fa;
  --border-color: #e9ecef;
  --text-primary: #333333;
  --text-secondary: #6c757d;
  --text-muted: #808f9a;
}
```

## Градиенты

### Основные градиенты

```css
/* Основной градиент */
--gradient-primary: linear-gradient(135deg, var(--primary-blue) 0%, var(--secondary-blue) 100%);

/* Вторичный градиент */
--gradient-secondary: linear-gradient(135deg, var(--light-blue) 0%, var(--accent-blue) 100%);

/* Градиент успеха */
--gradient-success: linear-gradient(135deg, var(--success) 0%, var(--accent-teal) 100%);

/* Градиент предупреждения */
--gradient-warning: linear-gradient(135deg, var(--warning) 0%, var(--accent-orange) 100%);

/* Градиент опасности */
--gradient-danger: linear-gradient(135deg, var(--danger) 0%, var(--accent-red) 100%);
```

## Тени

```css
--shadow-sm: 0 0.125rem 0.25rem rgba(0, 38, 100, 0.075);
--shadow: 0 0.5rem 1rem rgba(0, 38, 100, 0.15);
--shadow-lg: 0 1rem 3rem rgba(0, 38, 100, 0.175);
--shadow-primary: 0 0.5rem 1rem rgba(0, 38, 100, 0.2);
```

## Радиусы скругления

```css
--border-radius: 0.5rem;
--border-radius-lg: 1rem;
--border-radius-xl: 1.5rem;
```

## Применение цветов

### Навигация
- **Фон:** Основной градиент (`--gradient-primary`)
- **Текст:** Белый (`--white`)
- **Акценты:** Оранжевый (`--accent-orange`)

### Кнопки
- **Основная:** Основной градиент (`--gradient-primary`)
- **Вторичная:** Вторичный градиент (`--gradient-secondary`)
- **Успех:** Градиент успеха (`--gradient-success`)
- **Предупреждение:** Градиент предупреждения (`--gradient-warning`)
- **Опасность:** Градиент опасности (`--gradient-danger`)

### Карточки
- **Фон:** Белый (`--white`)
- **Заголовок:** Основной градиент (`--gradient-primary`)
- **Тень:** Стандартная тень (`--shadow`)

### Формы
- **Границы:** Серый (`--border-color`)
- **Фокус:** Основной синий (`--primary-blue`)
- **Лейблы:** Основной синий (`--primary-blue`)

### Таблицы
- **Заголовок:** Основной градиент (`--gradient-primary`)
- **Строки:** Белый (`--white`)
- **Границы:** Серый (`--border-color`)

## Типографика

### Заголовки
```css
h1, h2, h3, h4, h5, h6 {
  font-family: 'Arial', sans-serif;
  font-weight: 700;
  color: var(--primary-blue);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
```

### Основной текст
```css
p {
  font-family: 'Arial', sans-serif;
  font-weight: 400;
  color: var(--text-primary);
}
```

### Кнопки
```css
.btn {
  font-family: 'Arial', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
```

## Утилитарные классы

### Цвета текста
```css
.text-corporate-primary { color: var(--primary-blue) !important; }
.text-corporate-secondary { color: var(--secondary-blue) !important; }
.text-corporate-accent { color: var(--accent-orange) !important; }
```

### Цвета фона
```css
.bg-corporate-primary { background-color: var(--primary-blue) !important; }
.bg-corporate-secondary { background-color: var(--secondary-blue) !important; }
.bg-corporate-accent { background-color: var(--accent-orange) !important; }
```

### Границы
```css
.border-corporate-primary { border-color: var(--primary-blue) !important; }
.border-corporate-secondary { border-color: var(--secondary-blue) !important; }
```

## Корпоративные компоненты

### Корпоративный заголовок
```css
.corporate-header {
  background: var(--gradient-primary);
  color: var(--white);
  padding: 2rem 0;
  text-align: center;
}
```

### Корпоративная секция
```css
.corporate-section {
  padding: 3rem 0;
  background: var(--light-gray);
}
```

### Корпоративный акцент
```css
.corporate-accent {
  color: var(--accent-orange);
  font-weight: 700;
}
```

### Корпоративное выделение
```css
.corporate-highlight {
  background: var(--gradient-success);
  color: var(--white);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  font-weight: 700;
}
```

## Темная тема

```css
[data-theme="dark"] {
  --bs-body-bg: var(--gray-dark);
  --bs-body-color: var(--white);
  --bs-border-color: var(--gray-blue-dark);
}

[data-theme="dark"] .card {
  background-color: var(--gray-blue-dark);
  border-color: var(--gray-blue-light);
}
```

## Доступность

### Фокус
```css
.btn:focus,
.form-control:focus,
.nav-link:focus {
  outline: 2px solid var(--accent-orange);
  outline-offset: 2px;
}
```

### Контрастность
- Все цвета соответствуют стандартам WCAG 2.1 AA
- Минимальный контраст 4.5:1 для обычного текста
- Минимальный контраст 3:1 для крупного текста

## Рекомендации по использованию

1. **Основная коммуникация** всегда строится на основной цветовой гамме
2. **Дополнительные цвета** используются только для акцентов и специальных выделений
3. **Серые тона** содержат примесь голубого для гармонии с основной палитрой
4. **Градиенты** создают современный и профессиональный вид
5. **Тени** используют основной синий цвет для единообразия

## Примеры использования

### Навигационная панель
```html
<nav class="app-navbar">
  <!-- Использует --gradient-primary для фона -->
  <!-- Белый текст с оранжевыми акцентами -->
</nav>
```

### Карточка метрики
```html
<div class="metric-card">
  <div class="metric-icon">
    <!-- Иконка с --gradient-primary фоном -->
  </div>
  <div class="metric-value">
    <!-- Значение с --primary-blue цветом -->
  </div>
</div>
```

### Кнопка действия
```html
<button class="btn btn-primary">
  <!-- Использует --gradient-primary -->
  <!-- Белый текст, uppercase, letter-spacing -->
</button>
```

## Совместимость с Bootstrap

Все корпоративные цвета интегрированы с Bootstrap через CSS переменные:

```css
--bs-primary: var(--primary-blue);
--bs-secondary: var(--secondary-blue);
--bs-success: var(--success);
--bs-warning: var(--warning);
--bs-danger: var(--danger);
--bs-info: var(--info);
```

Это обеспечивает полную совместимость с существующими Bootstrap компонентами. 