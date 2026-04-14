# API documentation (OpenAPI / Swagger)

## Swagger UI (interactive)

- **Swagger UI**: `http://localhost:4040/swagger-ui.html` (may redirect to `/swagger-ui/index.html`)
- **OpenAPI JSON**: `http://localhost:4040/v3/api-docs`

For secured endpoints, use **Authorize** in Swagger UI with:

- `Bearer <token>`

where `<token>` comes from `POST /auth/login` (field `token`).

## Generate `openapi.json` into `docs/`

1. Start the backend:

```powershell
cd Backend
.\mvnw.cmd spring-boot:run
```

2. In another terminal, download the OpenAPI JSON:

```powershell
Invoke-WebRequest "http://localhost:4040/v3/api-docs" -OutFile "..\\docs\\openapi.json"
```

