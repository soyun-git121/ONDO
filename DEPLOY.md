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

## 6. Cloudflare R2 — 업로드 이미지 영구 저장

Render 무료 티어는 재배포마다 디스크가 초기화되어 업로드한 이미지가 전부 사라진다.
R2(S3 호환, 10GB 무료·트래픽 무료)에 저장하면 재배포와 무관하게 유지된다.

**설정하지 않아도 서비스는 그대로 돈다** — R2 값이 없으면 기존처럼 로컬 디스크에 저장한다.
그래서 로컬 개발에는 아무 설정도 필요 없다.

1. [dash.cloudflare.com](https://dash.cloudflare.com) 가입 → 왼쪽 메뉴 **R2 Object Storage**
   - R2 활성화 시 카드 등록을 요구할 수 있다. 무료 한도(10GB) 안에서는 청구되지 않는다.
2. **Create bucket** → 이름 `ondo-uploads`, 위치는 자동(Automatic)
3. 버킷 → **Settings → Public access → R2.dev subdomain** 활성화
   → `https://pub-xxxxxxxx.r2.dev` 주소가 나온다. 이게 `R2_PUBLIC_BASE_URL`.
4. R2 첫 화면 우측 **Manage R2 API Tokens → Create API token**
   - Permissions: **Object Read & Write**, 대상 버킷: `ondo-uploads`
   - 발급되는 **Access Key ID / Secret Access Key**와 **엔드포인트**(`https://<account-id>.r2.cloudflarestorage.com`)를 복사.
     Secret은 이때만 보이므로 바로 저장할 것.
5. Render **Environment** 탭에 5개 추가 → Save (자동 재시작):

| Key | 값 |
|---|---|
| `R2_ENDPOINT` | `https://<account-id>.r2.cloudflarestorage.com` |
| `R2_ACCESS_KEY` | Access Key ID |
| `R2_SECRET_KEY` | Secret Access Key |
| `R2_BUCKET` | `ondo-uploads` |
| `R2_PUBLIC_BASE_URL` | `https://pub-xxxxxxxx.r2.dev` |

6. 확인: Render 로그에 `이미지 저장소: Cloudflare R2 (bucket=...)`가 찍히면 적용된 것.
   관리자에서 이미지를 하나 올려보고, 반환된 주소가 `https://pub-...`로 시작하면 성공.

> 이미 DB에 저장된 예전 `/uploads/...` 경로는 R2로 옮겨지지 않는다(파일 자체가 이미 사라진 상태).
> 해당 이미지는 관리자에서 다시 업로드해야 한다.
>
> 로컬에서 R2를 테스트하려면 위 5개를 `backend/.env`(gitignored)에 넣고 `./gradlew bootRun`.

---

## 알아둘 점

- **콜드 스타트**: Render 무료는 15분 미접속 시 잠든다. 다음 방문자가 깨우는 데 30~60초 걸린다(Java라 느린 편).
- **업로드 이미지**: R2를 설정하지 않으면 Render 재배포마다 사라진다 (위 6번 참고).
- **DB 백업**: Aiven 무료 플랜도 자동 백업이 있다. 콘솔에서 확인.
- **코드 수정 후 재배포**: GitHub에 push하면 Render·Vercel이 자동으로 다시 배포한다.

## 로컬 개발은 그대로

로컬은 `VITE_API_BASE_URL`을 설정하지 않는다 — vite 프록시(`/api` → localhost:8080)로 동작하므로
CORS 설정도 필요 없다. 자세한 실행 방법은 [README.md](README.md) 참고.
