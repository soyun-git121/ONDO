import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminArtisans, adminNews } from "../../api/admin";
import { useAdminData } from "../../hooks/useAdminData";
import { useToast } from "../../components/admin/Feedback";
import {
  Checkbox,
  EnumSelect,
  Field,
  FormSection,
  FullWidth,
  Input,
  Select,
  Textarea,
} from "../../components/admin/Form";
import { FormShell } from "../../components/admin/FormShell";
import { ImageField } from "../../components/admin/ImageFields";
import { LoadingNotice, PageHeader } from "../../components/admin/Ui";
import type { NewsCreateRequest } from "../../types/admin";
import { NEWS_CATEGORY_LABEL } from "../../types/news";
import type { NewsCategory, NewsType } from "../../types/news";

const TYPE_LABEL: Record<NewsType, string> = {
  ORIGINAL: "자체 작성 (본문 직접 작성)",
  CURATED: "외부 링크 (기사 큐레이션)",
};

const EMPTY: NewsCreateRequest = {
  title: "",
  thumbnailUrl: null,
  type: "ORIGINAL",
  content: null,
  externalUrl: null,
  sourceName: null,
  category: "ONDO_NEWS",
  artisanId: null,
  published: false,
  publishedAt: null,
};

/** LocalDateTime("2026-07-01T09:00:00") ↔ datetime-local 입력값("2026-07-01T09:00") 변환. */
const toInput = (v: string | null) => (v ? v.slice(0, 16) : "");
const fromInput = (v: string) => (v ? `${v}:00` : null);

export default function NewsForm() {
  const { id } = useParams();
  const isEdit = id !== undefined;
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState<NewsCreateRequest>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const artisans = useAdminData(() => adminArtisans.list({ page: 0, size: 100 }), []);
  const { data, loading } = useAdminData(
    () => (isEdit ? adminNews.get(Number(id)) : Promise.resolve(null)),
    [id],
  );

  useEffect(() => {
    if (!data) return;
    setForm({
      title: data.title,
      thumbnailUrl: data.thumbnailUrl,
      type: data.type,
      content: data.content,
      externalUrl: data.externalUrl,
      sourceName: data.sourceName,
      category: data.category,
      artisanId: data.artisanId,
      published: data.published,
      publishedAt: data.publishedAt,
    });
  }, [data]);

  const set = <K extends keyof NewsCreateRequest>(key: K, value: NewsCreateRequest[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // db_schema.md §7: 이 검증은 DB가 아니라 애플리케이션 책임이다.
    if (form.type === "ORIGINAL" && !form.content?.trim()) {
      setError("자체 작성 뉴스는 본문이 필요합니다.");
      return;
    }
    if (form.type === "CURATED" && !form.externalUrl?.trim()) {
      setError("외부 링크 뉴스는 원문 URL이 필요합니다.");
      return;
    }

    setSaving(true);
    try {
      if (isEdit) {
        const { published: _published, ...body } = form;
        await adminNews.update(Number(id), body);
        toast.success("뉴스를 저장했습니다.");
      } else {
        await adminNews.create(form);
        toast.success("뉴스를 등록했습니다.");
      }
      navigate("/admin/news");
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (isEdit && loading) return <LoadingNotice />;

  return (
    <>
      <PageHeader
        title={isEdit ? "뉴스 수정" : "뉴스 작성"}
        description={isEdit ? "공개 여부는 목록에서 전환합니다." : undefined}
      />

      <FormShell
        onSubmit={submit}
        backTo="/admin/news"
        submitLabel={isEdit ? "저장" : "등록"}
        saving={saving}
        error={error}
      >
        <FormSection title="기본 정보">
          <FullWidth>
            <Field label="제목" required>
              <Input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                required
                maxLength={200}
              />
            </Field>
          </FullWidth>
          <Field label="유형" required>
            <EnumSelect<NewsType>
              value={form.type}
              onChange={(v) => set("type", v)}
              options={TYPE_LABEL}
            />
          </Field>
          <Field label="분류" required>
            <EnumSelect<NewsCategory>
              value={form.category}
              onChange={(v) => set("category", v)}
              options={NEWS_CATEGORY_LABEL}
            />
          </Field>
          <Field label="연결 보유자" hint="선택하면 해당 보유자 랜딩에도 노출됩니다.">
            <Select
              value={form.artisanId ?? ""}
              onChange={(e) => set("artisanId", e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">연결 안 함</option>
              {artisans.data?.content.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="발행일시" hint="목록 정렬 기준입니다.">
            <Input
              type="datetime-local"
              value={toInput(form.publishedAt)}
              onChange={(e) => set("publishedAt", fromInput(e.target.value))}
            />
          </Field>
        </FormSection>

        {form.type === "ORIGINAL" ? (
          <FormSection title="본문" description="마크다운으로 작성합니다." columns={1}>
            <Field label="본문" required>
              <Textarea
                value={form.content ?? ""}
                onChange={(e) => set("content", e.target.value || null)}
                rows={14}
              />
            </Field>
          </FormSection>
        ) : (
          <FormSection title="외부 기사">
            <FullWidth>
              <Field label="원문 URL" required>
                <Input
                  value={form.externalUrl ?? ""}
                  onChange={(e) => set("externalUrl", e.target.value || null)}
                  placeholder="https://..."
                />
              </Field>
            </FullWidth>
            <Field label="출처" hint="연합뉴스 등">
              <Input
                value={form.sourceName ?? ""}
                onChange={(e) => set("sourceName", e.target.value || null)}
              />
            </Field>
          </FormSection>
        )}

        <FormSection title="이미지·노출" columns={1}>
          <ImageField
            label="썸네일"
            value={form.thumbnailUrl}
            onChange={(url) => set("thumbnailUrl", url)}
            onError={toast.error}
          />
          {!isEdit && (
            <Checkbox
              label="바로 공개"
              hint="끄면 비공개로 저장되고, 목록에서 언제든 전환할 수 있습니다."
              checked={form.published}
              onChange={(v) => set("published", v)}
            />
          )}
        </FormSection>
      </FormShell>
    </>
  );
}
