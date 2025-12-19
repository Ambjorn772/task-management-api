# GitHub Actions Workflows

Ця директорія містить workflows для CI/CD pipeline проекту.

## Workflows

### 1. `ci.yml` - Continuous Integration

Запускається при:
- Push в `main` або `develop`
- Створенні Pull Request

**Перевірки:**
- Lint and Format Check
- Test Suite (unit, integration, e2e)
- Build Verification
- Commit Message Validation (для PR)

### 2. `cd.yml` - Continuous Deployment

Запускається при:
- Push в `main`
- Manual trigger

**Дії:**
- Запуск тестів
- Збірка проекту
- Розгортання на Stage сервер

### 3. `full-ci-cd.yml` - Full Pipeline

Комплексний pipeline, який об'єднує всі перевірки та розгортання в одному workflow.

## Налаштування

Детальні інструкції дивіться в [CI/CD Setup Guide](../../docs/CI_CD_SETUP.md).

## Branch Protection

Для забезпечення якості коду, налаштуйте Branch Protection Rules для гілки `main`:
- Require status checks to pass before merging
- Require pull request reviews before merging
- Do not allow bypassing the above settings


