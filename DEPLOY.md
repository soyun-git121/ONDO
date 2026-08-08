# ONDO 배포 가이드 — Oracle Cloud 무료 VM

서버 1대에 docker-compose로 사이트 전체(프론트+백엔드+MySQL)를 올린다.
프론트는 백엔드 jar에 번들되어 **한 주소(포트 80)**로 서비스된다 — CORS 설정이 필요 없다.

로컬에서 운영 이미지 빌드·기동·업로드 영속까지 검증 완료된 구성이다.

---

## 0. 준비물

- Oracle Cloud 계정 (무료, 카드는 본인확인용 — 무료 자원은 과금 안 됨)
- 이 저장소 주소 (GitHub)

## 1. Oracle Cloud VM 만들기

1. [cloud.oracle.com](https://cloud.oracle.com) 가입 → 콘솔 로그인
2. **Compute → Instances → Create Instance**
3. 설정:
   - **Image**: Ubuntu 22.04 (또는 24.04)
   - **Shape**: `VM.Standard.A1.Flex` (Ampere ARM, **Always Free**) — OCPU 2, 메모리 12GB 정도로. (이 Shape가 무료 한도 안에서 가장 넉넉하다. 안 잡히면 리전을 바꿔 재시도)
   - **SSH 키**: "Generate a key pair" 선택 → **개인키 다운로드**(로그인에 필요, 잘 보관)
4. Create → 몇 분 뒤 인스턴스의 **Public IP** 확인 (예: `140.238.x.x`)

## 2. 포트 80 열기 (두 군데 다 해야 함 — Oracle의 대표적 함정)

### (a) OCI 보안 목록
- 인스턴스 → **Virtual Cloud Network → Security Lists → Default Security List**
- **Add Ingress Rule**:
  - Source CIDR: `0.0.0.0/0`
  - IP Protocol: TCP, Destination Port: `80`

### (b) 인스턴스 내부 방화벽 (Ubuntu는 iptables가 기본 차단)
서버에 SSH 접속(아래 3번) 후:
```bash
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo netfilter-persistent save
```

## 3. 서버 접속 & Docker 설치

로컬 터미널에서 (다운로드한 개인키로):
```bash
ssh -i <개인키경로> ubuntu@<Public-IP>
```

접속 후 Docker 설치:
```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker ubuntu
exit
```
(그룹 적용을 위해 한 번 나갔다) 다시 접속:
```bash
ssh -i <개인키경로> ubuntu@<Public-IP>
docker --version   # 확인
```

## 4. 코드 내려받기

```bash
git clone <이-저장소-URL> ondo
cd ondo
```

## 5. 환경변수 파일 만들기

```bash
cp .env.prod.example .env
nano .env
```
값을 채운다 (특히 아래 4개는 필수):
```
MYSQL_ROOT_PASSWORD=<강한 비번>
MYSQL_PASSWORD=<강한 비번>
JWT_SECRET=<아래 명령으로 생성>
ADMIN_PASSWORD=admin2580
```
JWT_SECRET 생성 (서버에서 바로):
```bash
openssl rand -base64 48
```
나온 값을 `.env`의 `JWT_SECRET=`에 붙여넣고 저장(nano: Ctrl+O, Enter, Ctrl+X).

> `.env`는 서버에만 두고 절대 커밋하지 않는다(이미 gitignore됨).

## 6. 실행

```bash
docker compose -f docker-compose.prod.yml up -d --build
```
- 첫 빌드는 몇 분 걸린다(프론트+백엔드 빌드). ARM 서버에서 네이티브로 빌드된다.
- 진행 확인: `docker compose -f docker-compose.prod.yml logs -f backend`
  `Started OndoApplication` 나오면 완료.

## 7. 접속

- 사이트: `http://<Public-IP>/`
- 관리자: `http://<Public-IP>/admin` (admin / `.env`의 ADMIN_PASSWORD)

운영 DB는 시드가 없어 처음엔 콘텐츠가 비어 있다. **관리자 화면에서 보유자·상품·뉴스·실적을 등록**하면 사이트에 노출된다.

---

## 운영 명령 모음

```bash
# 상태
docker compose -f docker-compose.prod.yml ps

# 로그
docker compose -f docker-compose.prod.yml logs -f backend

# 코드 업데이트 후 재배포 (git pull → 재빌드)
git pull
docker compose -f docker-compose.prod.yml up -d --build

# 중지 / 재시작
docker compose -f docker-compose.prod.yml stop
docker compose -f docker-compose.prod.yml up -d
```

- 업로드 이미지·DB는 Docker 볼륨(`ondo-prod_ondo-uploads`, `ondo-prod_ondo-mysql-data`)에 남아 재배포해도 유지된다.
- **DB 백업**: `docker exec ondo-mysql-prod mysqldump -u root -p<루트비번> ondo > backup-$(date +%F).sql`

## 다음 단계 (지금은 선택)

- **도메인 연결**: 도메인을 사서 A 레코드를 Public IP로 지정.
- **HTTPS**: 도메인 연결 후 Caddy나 nginx+Let's Encrypt로 443 인증서. (필요할 때 구성 도와줄 수 있음)
