import { useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { createInquiry } from "../api/inquiries";
import { getProjects } from "../api/projects";
import { useFetch } from "../hooks/useFetch";
import Container from "../components/layout/Container";
import Button from "../components/ui/Button";
import EmptyBlock from "../components/ui/EmptyBlock";
import ProjectCard from "../components/cards/ProjectCard";
import SectionHeading from "../components/ui/SectionHeading";
import { ApiError } from "../api/client";
import { INQUIRY_TYPE_LABEL, type InquiryType } from "../types/inquiry";

const TYPES = Object.keys(INQUIRY_TYPE_LABEL) as InquiryType[];

const FIELDS = [
  { name: "companyName", label: "회사·기관명 (필수)", type: "text", required: true },
  { name: "contactName", label: "담당자 이름 (필수)", type: "text", required: true },
  { name: "email", label: "이메일 (필수)", type: "email", required: true },
  { name: "phone", label: "연락처 (필수)", type: "tel", required: true },
] as const;

/**
 * 협업문의 — architecture.md §5: 유형 선택 폼 + featured 실적 섹션(설득 자료).
 * Inquiry.type은 수익원 분류와 동일 (claude.md).
 */
export default function Collaboration() {
  const [params] = useSearchParams();
  const initialType = (params.get("type") as InquiryType) ?? "B2B_GIFT";
  const [type, setType] = useState<InquiryType>(
    TYPES.includes(initialType) ? initialType : "B2B_GIFT",
  );
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [doneId, setDoneId] = useState<number | null>(null);

  const { data: featured } = useFetch(() => getProjects({ featured: true, size: 3 }));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    // honeypot — 봇이 채우면 조용히 무시 (api.md 스팸 방지)
    if (String(form.get("website") ?? "").length > 0) return;

    const nextErrors: Record<string, string> = {};
    for (const f of FIELDS) {
      if (f.required && !String(form.get(f.name) ?? "").trim()) {
        nextErrors[f.name] = "필수 입력 항목입니다.";
      }
    }
    if (!String(form.get("message") ?? "").trim()) {
      nextErrors.message = "문의 내용을 입력해 주세요.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const firstKey = [...FIELDS.map((f) => f.name), "message"].find((k) => nextErrors[k]);
      if (firstKey) document.getElementById(`inquiry-${firstKey}`)?.focus();
      return;
    }

    setSubmitting(true);
    setServerError(null);
    try {
      const res = await createInquiry({
        type,
        companyName: String(form.get("companyName")),
        contactName: String(form.get("contactName")),
        email: String(form.get("email")),
        phone: String(form.get("phone")),
        message: String(form.get("message")),
      });
      setDoneId(res.id);
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : "문의 접수에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <section className="py-8 lg:py-9">
        <Container>
          <h1 className="font-display text-2xl font-bold leading-tight tracking-[-0.02em] lg:text-display">
            전통과 함께할
            <br />
            파트너를 찾습니다
          </h1>
          <p className="mt-6 max-w-2xl text-md text-text-muted">
            기업 선물, 콜라보, 체험·강연, 공공 협력까지 — 보유자와 함께 만들 수 있는 일을
            제안해 주세요.
          </p>
        </Container>
      </section>

      {/* 문의 폼 */}
      <section className="pb-8 lg:pb-9">
        <Container className="max-w-2xl">
          {doneId ? (
            <div className="rounded-md border border-border-base bg-surface p-7 text-center">
              <h2 className="font-display text-xl font-bold">문의가 접수되었습니다</h2>
              <p className="mt-3 text-base text-text-muted">
                접수 번호 {doneId} — 담당자가 확인 후 이메일로 회신드립니다.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
              {/* 유형 선택 */}
              <fieldset>
                <legend className="mb-3 text-sm font-medium">문의 유형 (필수)</legend>
                <div className="flex flex-wrap gap-2">
                  {TYPES.map((t) => (
                    <label
                      key={t}
                      className={`inline-flex min-h-[44px] cursor-pointer items-center rounded-pill border px-4 text-sm transition-colors duration-fast ${
                        type === t
                          ? "border-text-primary bg-primary"
                          : "border-border-base hover:border-text-primary"
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={t}
                        checked={type === t}
                        onChange={() => setType(t)}
                        className="sr-only"
                      />
                      {INQUIRY_TYPE_LABEL[t]}
                    </label>
                  ))}
                </div>
              </fieldset>

              {FIELDS.map((f) => (
                <div key={f.name} className="flex flex-col gap-2">
                  <label htmlFor={`inquiry-${f.name}`} className="text-sm font-medium">
                    {f.label}
                  </label>
                  <input
                    id={`inquiry-${f.name}`}
                    name={f.name}
                    type={f.type}
                    aria-describedby={errors[f.name] ? `inquiry-${f.name}-error` : undefined}
                    aria-invalid={errors[f.name] ? true : undefined}
                    className={`min-h-[44px] rounded-sm border bg-surface px-3 py-3 transition-colors duration-fast focus:border-text-primary ${
                      errors[f.name] ? "border-error" : "border-border-base"
                    }`}
                  />
                  {errors[f.name] && (
                    <p id={`inquiry-${f.name}-error`} className="text-xs text-error">
                      {errors[f.name]}
                    </p>
                  )}
                </div>
              ))}

              <div className="flex flex-col gap-2">
                <label htmlFor="inquiry-message" className="text-sm font-medium">
                  문의 내용 (필수)
                </label>
                <textarea
                  id="inquiry-message"
                  name="message"
                  rows={6}
                  aria-describedby={errors.message ? "inquiry-message-error" : undefined}
                  aria-invalid={errors.message ? true : undefined}
                  className={`rounded-sm border bg-surface px-3 py-3 transition-colors duration-fast focus:border-text-primary ${
                    errors.message ? "border-error" : "border-border-base"
                  }`}
                />
                {errors.message && (
                  <p id="inquiry-message-error" className="text-xs text-error">
                    {errors.message}
                  </p>
                )}
              </div>

              {/* honeypot — 시각적으로 숨김 */}
              <div aria-hidden="true" className="absolute -left-[9999px]">
                <label htmlFor="inquiry-website">웹사이트</label>
                <input id="inquiry-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              {serverError && (
                <p role="alert" className="rounded-sm border border-error/40 bg-surface px-4 py-3 text-sm text-error">
                  {serverError}
                </p>
              )}

              <Button type="submit" variant="primary" loading={submitting}>
                협업 문의하기
              </Button>
            </form>
          )}
        </Container>
      </section>

      {/* featured 실적 — 설득 자료 */}
      <section className="pb-8 lg:pb-9">
        <Container>
          <SectionHeading title="온도가 만들어온 협업" to="/projects" linkLabel="전체 실적 보기" />
          {featured && featured.content.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {featured.content.map((p) => (
                <ProjectCard
                  key={p.slug}
                  slug={p.slug}
                  title={p.title}
                  type={p.type}
                  resultMetric={p.resultMetric}
                  thumbnailUrl={p.thumbnailUrl}
                  clientName={p.clientName}
                />
              ))}
            </div>
          ) : (
            <EmptyBlock label="대표 실적 준비 중" className="h-48" />
          )}
        </Container>
      </section>

      {/* 선행 사례 — 원고 확정 전 빈칸 */}
      <section className="pb-8 lg:pb-9">
        <Container>
          <SectionHeading title="전통 협업의 가능성" />
          <EmptyBlock label="선행 사례 콘텐츠 준비 중 (예올×샤넬 등)" className="h-40" />
        </Container>
      </section>
    </main>
  );
}
