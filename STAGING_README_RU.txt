SPOTLIGHT 5–7 · STAGING v0.6.5

НАЗНАЧЕНИЕ
Безопасно проверить новый трёхэтажный интерфейс 5/6/7 до изменения production CLEAN.

КАК РАБОТАЕТ
1. Пользователь сначала входит в текущий production CLEAN на dreamteamenglish.github.io.
2. Staging находится на том же origin и видит уже сохранённую CLEAN-сессию в localStorage.
3. Staging НЕ доверяет ей сам: access token отправляется в Yandex Content Gateway через X-Lesson-Token.
4. Gateway повторно спрашивает существующий Supabase Gate о FULL-доступе.
5. Только после valid_full=true браузер получает короткие подписанные ссылки и скачивает 210 уроков + Activities напрямую из Yandex Object Storage.
6. Supabase не проксирует FULL-контент.

ВАЖНО
- В staging-пакете нет 210 FULL уроков и полного GOLD-слоя.
- В staging-пакете нет S3 secret key.
- Кнопка выхода из staging НЕ удаляет общую CLEAN-сессию; она возвращает в production CLEAN.
- Если CLEAN-сессии нет/она истекла, staging не откроется.

РЕКОМЕНДУЕМОЕ ИМЯ ВРЕМЕННОГО РЕПОЗИТОРИЯ
Lesson_Constructor-SpL-5-7-STAGING
