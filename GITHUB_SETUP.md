# Инструкция по созданию репозитория на GitHub

## Шаг 1: Создание репозитория на GitHub

1. Перейдите на [GitHub.com](https://github.com) и войдите в свой аккаунт
2. Нажмите кнопку **"+"** в правом верхнем углу → **"New repository"**
3. Заполните форму:
   - **Repository name**: `task-management-api` (или любое другое имя)
   - **Description**: `Мікросервісна архітектура для управління завданнями`
   - **Visibility**: выберите **Public** или **Private**
   - **НЕ** отмечайте "Initialize this repository with a README" (у нас уже есть README)
   - **НЕ** добавляйте .gitignore или license (у нас уже есть .gitignore)
4. Нажмите **"Create repository"**

## Шаг 2: Подключение локального репозитория к GitHub

После создания репозитория GitHub покажет инструкции. Выполните следующие команды:

```bash
cd C:\Users\Admin\source\repos\nodejs-project

# Добавьте remote (замените YOUR_USERNAME на ваш GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/task-management-api.git

# Переименуйте ветку в main (если нужно)
git branch -M main

# Отправьте код на GitHub
git push -u origin main
```

## Альтернативный способ (через SSH)

Если у вас настроен SSH ключ:

```bash
git remote add origin git@github.com:YOUR_USERNAME/task-management-api.git
git branch -M main
git push -u origin main
```

## Проверка

После выполнения команд проверьте, что репозиторий доступен по адресу:
`https://github.com/YOUR_USERNAME/task-management-api`

