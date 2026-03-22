# Contributing to IT ticketing tool

Thank you for your interest in contributing to IT ticketing tool! This document provides guidelines and best practices to ensure code quality, consistency, and maintainability across the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Best Practices](#best-practices)
- [Git Workflow](#git-workflow)
- [Testing](#testing)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Review Checklist](#code-review-checklist)

---

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please be respectful and professional when interacting with other contributors.

---

## Getting Started

### Prerequisites

- **Node.js**: v20.x or higher
- **pnpm**: v8.x or higher (package manager)
- **Git**: Latest version

### Installation

```bash
# Clone the repository
git clone https://github.com/22yards/play-with-22yards.git
cd play-with-22yards

# Install dependencies
pnpm install

# Create a branch for your feature
git checkout -b feature/your-feature-name

# Start the development server
pnpm run dev
```

---

## Project Structure

```
src/
├── pages/              # Page components (HomePage, LoginPage, etc.)
├── components/         # Reusable UI components
│   └── ui/            # Base UI components (buttons, cards, etc.)
├── hooks/             # Custom React hooks
├── context/           # React context providers
├── services/          # API services and external integrations
├── types/             # TypeScript type definitions
├── lib/               # Utility functions
├── i18n/              # Internationalization (locales, translations)
│   └── locales/      # Translation files (en.json, hi.json)
├── router/            # Route definitions and guards
├── data/              # Static data files
├── assets/            # Images, icons, fonts
├── App.tsx            # Main app component
└── main.tsx           # Application entry point

public/                # Static assets
dist/                  # Build output (generated)
```

---

## Development Setup

### Available Scripts

```bash
# Start development server
pnpm run dev

# Build for production
pnpm run build

# Run TypeScript type checking
pnpm run tsc

# Lint code using ESLint
pnpm run lint

# Auto-fix linting issues
pnpm run lint:fix

# Preview production build locally
pnpm run preview
```

### Environment Configuration

Create `.env.local` in the root directory for local environment variables:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=22Yards
```

---

## Coding Standards

### TypeScript

- **Always use TypeScript** - Avoid `any` type unless absolutely necessary
- **Strict mode enabled** - All files must be type-safe
- **Use proper type definitions**:

```typescript
// ✅ Good
interface User {
  id: string;
  firstName: string;
  email: string;
}

const getUser = (id: string): Promise<User> => {
  // implementation
};

// ❌ Avoid
const getUser = (id: any): any => {
  // implementation
};
```

### Component Guidelines

#### Functional Components Only

```typescript
// ✅ Use functional components with hooks
import { useState } from 'react';

export default function MyComponent() {
  const [state, setState] = useState(0);
  
  return <div>{state}</div>;
}

// ❌ Avoid class components
class MyComponent extends React.Component {
  // ...
}
```

#### Component Naming

- **Files**: PascalCase (e.g., `UserProfile.tsx`, `LoginForm.tsx`)
- **Directories**: kebab-case (e.g., `user-profile/`, `login-form/`)
- **Exports**: Default export for page/route components

```typescript
// src/pages/UserProfilePage.tsx
export default function UserProfilePage() {
  return <div>User Profile</div>;
}

// src/components/UserCard.tsx
export default function UserCard() {
  return <div>User Card</div>;
}
```

#### Props Interface Pattern

```typescript
interface UserCardProps {
  userId: string;
  showEmail?: boolean;
  onUpdate?: (user: User) => void;
}

export default function UserCard({
  userId,
  showEmail = false,
  onUpdate,
}: UserCardProps) {
  // implementation
}
```

### Code Formatting

- **Indentation**: 2 spaces
- **Line length**: Max 100 characters (soft limit)
- **Quotes**: Double quotes for JSX attributes, single quotes for strings
- **Semicolons**: Always use semicolons

```typescript
// ✅ Good
const name: string = "John";
const element = <input type="text" className="input" />;

// ❌ Avoid
const name: string = 'John'
const element = <input type='text' className='input' />
```

### Import Organization

Organize imports in the following order:

1. React and third-party libraries
2. Type imports
3. Internal components and utilities
4. Relative imports (if necessary, use `@/` alias)

```typescript
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { User } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
```

### File Organization

Keep files focused on a single responsibility:

```typescript
// ✅ Good: Single responsibility
// src/hooks/useAuthMutations.ts
export const useSaveProfile = () => {
  // only profile mutation logic
};

// ❌ Avoid: Multiple concerns in one file
// src/hooks/useAll.ts
export const useSaveProfile = () => {};
export const useLoginUser = () => {};
export const useLogoutUser = () => {};
```

---

## Best Practices

### React Best Practices

#### 1. Proper Hook Usage

```typescript
// ✅ Good: Hooks at top level
export default function MyComponent() {
  const [count, setCount] = useState(0);
  const { t } = useTranslation();
  
  useEffect(() => {
    // side effect
  }, []);
  
  return <div>{count}</div>;
}

// ❌ Avoid: Conditional hook calls
if (condition) {
  const [count, setCount] = useState(0);
}
```

#### 2. Memoization When Needed

```typescript
// ✅ Use useMemo for expensive computations
const expensiveValue = useMemo(() => {
  return complexCalculation(data);
}, [data]);

// ✅ Use useCallback for callback functions
const handleClick = useCallback(() => {
  doSomething(value);
}, [value]);
```

#### 3. Dependency Arrays

```typescript
// ✅ Always include all dependencies
useEffect(() => {
  fetchData(userId);
}, [userId]); // userId is a dependency

// ❌ Don't omit dependencies
useEffect(() => {
  fetchData(userId); // userId is used but not in deps
}, []);
```

### State Management

- **Use React Context** for global state (authentication, theme)
- **Use React Query** for server state (data fetching)
- **Use useState** for local component state
- **Keep state as close as possible** to where it's used

```typescript
// ✅ Good: Server state with React Query
const { data: users, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
});

// ✅ Good: Global state with Context
const { user, login } = useAuth();

// ✅ Good: Local state with useState
const [formData, setFormData] = useState({});
```

### Error Handling

```typescript
// ✅ Good: Proper error handling
const handleSubmit = async () => {
  try {
    const result = await saveProfile(data);
    showSuccess('Profile saved successfully');
  } catch (error) {
    const message = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred';
    showError(message);
  }
};

// ❌ Avoid: Ignoring errors
const handleSubmit = async () => {
  const result = await saveProfile(data);
};
```

### Performance Optimization

#### 1. Code Splitting

```typescript
// ✅ Use React.lazy for route-based code splitting
const HomePage = lazy(() => import('@/pages/HomePage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));

// Use with Suspense
<Suspense fallback={<Loading />}>
  <Outlet />
</Suspense>
```

#### 2. Image Optimization

```typescript
// ✅ Use optimized image sizes
<img 
  src="image.jpg" 
  alt="Description"
  width={400}
  height={300}
  loading="lazy"
/>
```

#### 3. Bundle Analysis

Run `pnpm run build` and analyze bundle size using tools like `webpack-bundle-analyzer`.

### Localization (i18n)

#### Adding New Translations

1. **Always add to both English and Hindi locales**:

```json
// src/i18n/locales/en.json
{
  "feature": {
    "title": "Feature Title",
    "description": "Feature description"
  }
}

// src/i18n/locales/hi.json
{
  "feature": {
    "title": "फीचर शीर्षक",
    "description": "फीचर विवरण"
  }
}
```

2. **Use translation keys in components**:

```typescript
// ✅ Good
const { t } = useTranslation();
<h1>{t('feature.title')}</h1>

// ❌ Avoid: Hardcoded strings
<h1>Feature Title</h1>
```

### Styling

- **Use Tailwind CSS** for styling
- **Use CSS variables** for theme consistency
- **Use `cn()` utility** for conditional classes

```typescript
// ✅ Good: Using Tailwind with cn utility
import { cn } from "@/lib/utils";

export default function Button({ disabled, className }) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-lg font-medium",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      Click me
    </button>
  );
}

// ❌ Avoid: String concatenation
className={`px-4 py-2 ${disabled ? 'opacity-50' : ''}`}
```

---

## Git Workflow

### Branch Naming Convention

- **Feature branches**: `feature/short-description` (e.g., `feature/user-authentication`)
- **Bug fix branches**: `bugfix/issue-description` (e.g., `bugfix/login-validation`)
- **Hotfix branches**: `hotfix/issue-description` (e.g., `hotfix/payment-processing`)
- **Refactor branches**: `refactor/component-name` (e.g., `refactor/navbar-component`)

### Branch Protection Rules

- All branches must pass CI/CD checks before merging
- At least one approval required for PR merge
- All conversations must be resolved

---

## Testing

### Testing Standards

- **Test coverage target**: 80% for critical paths
- **Unit tests** for utilities and hooks
- **Integration tests** for user flows
- **E2E tests** for critical features

```bash
# Run tests (when testing setup is configured)
pnpm run test

# Run tests with coverage
pnpm run test:coverage
```

### Testing Example

```typescript
// ✅ Good: Clear test names and assertions
describe('useAuth', () => {
  it('should return authenticated user after login', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.login('token', mockUser);
    });
    
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

---

## Commit Guidelines

### Commit Message Format

Use conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring without feature changes
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Build, dependency, or tooling changes

### Examples

```bash
# Feature
git commit -m "feat(auth): add two-factor authentication"

# Bug fix
git commit -m "fix(login): resolve email validation issue"

# Documentation
git commit -m "docs(contributing): add testing guidelines"

# Refactor
git commit -m "refactor(navbar): extract navigation logic to custom hook"
```

### Commit Best Practices

- **One logical change per commit** - Keep commits focused
- **Write meaningful messages** - Describe what and why, not how
- **Reference issues** - Use "Fixes #123" or "Relates to #456"

```bash
# ✅ Good commit with issue reference
git commit -m "fix(profile): prevent profile save with invalid email

- Add email validation before API call
- Show error message to user
- Add test case for invalid email scenario

Fixes #789"

# ❌ Avoid vague commits
git commit -m "fix stuff"
git commit -m "updates"
```

---

## Pull Request Process

### Before Creating a PR

1. **Ensure your code passes all checks**:
   ```bash
   pnpm run lint:fix
   pnpm run build
   pnpm run tsc
   ```

2. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature
   ```

3. **Make meaningful commits** following the commit guidelines

4. **Keep your branch updated** with latest changes:
   ```bash
   git fetch origin
   git rebase origin/main
   ```

### PR Title Format

Follow the same format as commits:

```
feat(auth): add password reset functionality
fix(dashboard): resolve chart rendering issue
refactor(api): simplify error handling
```

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Documentation update

## Changes
- List key changes made

## Testing Done
- Describe how you tested the changes
- Include steps to reproduce if it's a bug fix

## Screenshots (if applicable)
- Add screenshots for UI changes

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented complex logic
- [ ] I have updated relevant documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing tests pass locally
- [ ] I have not introduced breaking changes
```

---

## Code Review Checklist

### For Authors

- [ ] Code follows project style guidelines
- [ ] No linting errors (`pnpm run lint`)
- [ ] TypeScript compilation passes (`pnpm run tsc`)
- [ ] All imports are organized correctly
- [ ] No console logs or debugging code left
- [ ] Error handling is implemented
- [ ] Localization strings are added to both locales
- [ ] Comments are clear and concise
- [ ] Tests are added/updated (if applicable)

### For Reviewers

- [ ] Code is understandable and well-structured
- [ ] No security vulnerabilities introduced
- [ ] No performance regressions
- [ ] Error handling is appropriate
- [ ] Tests cover new functionality
- [ ] Documentation is updated if needed
- [ ] Localization is properly implemented
- [ ] No hardcoded strings or magic numbers
- [ ] Consistent with existing code patterns
- [ ] No unnecessary dependencies added

---

## Common Issues and Solutions

### Issue: ESLint Errors

```bash
# Auto-fix most issues
pnpm run lint:fix

# Check specific issues
pnpm run lint
```

### Issue: Import Path Errors

Use the `@/` alias instead of relative paths:

```typescript
// ✅ Good
import { useAuth } from "@/context/AuthContext";

// ❌ Avoid
import { useAuth } from "../../../context/AuthContext";
```

### Issue: Type Errors

Always provide proper types:

```typescript
// ✅ Good
const users: User[] = [];
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {};

// ❌ Avoid
const users: any = [];
const handleClick = (e: any) => {};
```

### Issue: Unused Imports

Remove unused imports or prefix with `_`:

```typescript
// ✅ Good
import { useCallback } from 'react';

// Unused parameter
const handleClick = (_event: React.MouseEvent) => {
  // ...
};

// ❌ Avoid
import { useCallback, useState } from 'react'; // useState not used
```

---

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [i18next Documentation](https://www.i18next.com)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## Questions or Need Help?

- Open an issue for bug reports
- Use discussions for questions
- Review existing issues before creating new ones
- Reach out to maintainers for clarification

**Happy coding! 🚀**
