# ONDO 배포 가이드 — Vercel + Render + Aiven

프론트/백엔드/DB를 각각 무료 서비스에 올린다. 서버 관리(SSH·방화벽)가 없다.

| 구성 | 서비스 | 비고 |
|---|---|---|
| 프론트 (React) | **Vercel** | 정적 배포, 빠름 |
| 백엔드 (Spring Boot) | **Render** | 무료, 15분 미접속 시 잠듦(다음 접속 30~60초) |
| DB (MySQL) | **Aiven** | 항상 무료 1GB |

> 한 서버에 전부 올리는 방식(Oracle VM 등)을 원하면 루트의 `Dockerfile` +
> `docker-compose.prod.yml`을 쓰면 된다. 그 경우 프론트가 백엔드에 번들되어 CORS 설정이 필요 없다.

---

## 1. Aiven — MySQL 만들기

1. [aiven.io](https://aiven.io) 가입 (카드 불필요)
2. **Create service → MySQL → Free plan** 선택, 리전은 아무거나(가까운 곳)
3. 생성 후 **Connection information**에서 아래 값을 복사해 둔다:
   - Host, Port, Database, User, Password

JDBC URL은 이렇게 조립한다 (Aiven은 SSL 필수):
```
jdbc:mysql://<HOST>:<PORT>/<DATABASE>?serverTimezone=Asia/Seoul&characterEncoding=UTF-8&sslMode=REQUIRED
```

## 2. Render — 백엔드 배포

1. [render.com](https://render.com) 가입 → GitHub 연결
2. **New → Web Service** → 이 저장소 선택
3. 설정:
   - **Root Directory**: `backend`
   - **Runtime**: `Docker` (backend/Dockerfile 자동 인식)
   - **Instance Type**: Free
4. **Environment** 탭에서 환경변수 추가:

| Key | Value |
|---|---|
| `DB_URL` | 위에서 조립한 JDBC URL |
| `DB_USERNAME` | Aiven User |
| `DB_PASSWORD` | Aiven Password |
| `JWT_SECRET` | 아래 명령으로 생성 |
| `ADMIN_PASSWORD` | 관리자 로그인 비밀번호 |
| `CORS_ALLOWED_ORIGINS` | (3번 후) Vercel 주소, 예: `https://ondo.vercel.app` |

JWT_SECRET 생성 (Windows PowerShell):
```powershell
$bytes = New-Object byte[] 48; [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes); [Convert]::ToBase64String($bytes)
```

5. Deploy → 완료되면 주소가 나온다 (예: `https://ondo-api.onrender.com`)
   - 확인: `https://<render주소>/api/health` → `{"status":"UP"...}`

## 3. Vercel — 프론트 배포

1. [vercel.com](https://vercel.com) 가입 → GitHub 연결
2. **Add New → Project** → 이 저장소 선택
3. 설정:
   - **Root Directory**: `frontend` (반드시 지정)
   - Framework는 Vite로 자동 인식 (`frontend/vercel.json`이 SPA 라우팅까지 처리)
4. **`frontend/vercel.json`의 백엔드 주소를 자기 Render 주소로 바꾼다** (rewrites 2곳).

5. Deploy → 주소가 나온다 (예: `https://ondo.vercel.app`)

## 4. API 연결 방식 — Vercel 리라이트 프록시

`frontend/vercel.json`이 `/api/*`와 `/uploads/*` 요청을 Render로 대신 전달한다:

```json
{ "source": "/api/:path*", "destination": "https://<render주소>/api/:path*" }
```

이 방식을 쓰는 이유:

- **CORS 설정이 필요 없다** — 브라우저에는 프론트와 같은 도메인으로 보인다.
- **빌드 시점 환경변수가 필요 없다** — Vite는 `VITE_*`를 빌드할 때 코드에 박아 넣기 때문에,
  값을 나중에 추가하면 재배포(캐시 미사용)를 해야만 반영된다. 이 함정을 아예 없앤다.
- 업로드 이미지도 같은 경로로 해결된다.

> 백엔드 주소가 바뀌면 `vercel.json`만 고치면 된다.
> (`VITE_API_BASE_URL`을 설정하면 그 값이 우선하지만, 이 구성에서는 설정하지 않는다.)

## 5. 접속

- 사이트: `https://<vercel주소>/`
- 관리자: `https://<vercel주소>/admin` (admin / `ADMIN_PASSWORD`에 넣은 값)

운영 DB는 시드가 없어 처음엔 비어 있다. **관리자 화면에서 콘텐츠를 등록**하면 사이트에 노출된다.

---

## 알아둘 점

- **콜드 스타트**: Render 무료는 15분 미접속 시 잠든다. 다음 방문자가 깨우는 데 30~60초 걸린다(Java라 느린 편).
- **업로드 이미지가 사라진다**: Render 무료는 디스크가 재배포마다 초기화된다. 관리자에서 파일 업로드 대신
  **이미지 URL 붙여넣기**를 쓰는 것을 권장. (영구 저장이 필요해지면 Cloudflare R2 등 외부 스토리지 연동)
- **DB 백업**: Aiven 무료 플랜도 자동 백업이 있다. 콘솔에서 확인.
- **코드 수정 후 재배포**: GitHub에 push하면 Render·Vercel이 자동으로 다시 배포한다.

## 로컬 개발은 그대로

로컬은 `VITE_API_BASE_URL`을 설정하지 않는다 — vite 프록시(`/api` → localhost:8080)로 동작하므로
CORS 설정도 필요 없다. 자세한 실행 방법은 [README.md](README.md) 참고.
