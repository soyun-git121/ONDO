import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminArtisans, adminProjects } from "../../api/admin";
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
import { GalleryField, ImageField } from "../../components/admin/ImageFields";
import { LoadingNotice, PageHeader } from "../../components/admin/Ui";
import type { ProjectCreateRequest } from "../../types/admin";
import { PROJECT_TYPE_LABEL } from "../../types/project";
import type { ProjectType } from "../../types/project";

const EMPTY: ProjectCreateRequest = {
  slug: "",
  title: "",
  type: "B2B_GIFT",
  clientName: null,
  summary: null,
  description: null,
  resultMetric: null,
  thumbnailUrl: null,
  projectDate: new Date().toISOString().slice(0, 10),
  showOnHome: false,
  showOnCollaboration: false,
  displayOrder: 0,
  published: false,
  images: [],
  artisans: [],
};

export default function ProjectForm() {
  const { id } = useParams();
  const isEdit = id !== undefined;
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState<ProjectCreateRequest>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const artisans = useAdminData(() => adminArtisans.list({ page: 0, size: 100 }), []);
  const { data, loading } = useAdminData(
    () => (isEdit ? adminProjects.get(Number(id)) : Promise.resolve(null)),
    [id],
  );

  useEffect(() => {
    if (!data) return;
    setForm({
      slug: data.slug,
      title: data.title,
      type: data.type,
      clientName: data.clientName,
      summary: data.summary,
      description: data.description,
      resultMetric: data.resultMetric,
      thumbnailUrl: data.thumbnailUrl,
      projectDate: data.projectDate,
      showOnHome: data.showOnHome,
      showOnCollaboration: data.showOnCollaboration,
      displayOrder: data.displayOrder,
      published: data.published,
      images: data.images,
      artisans: data.artisans.map((a) => ({ artisanId: a.artisanId, role: a.role })),
    });
  }, [data]);

  const set = <K extends keyof ProjectCreateRequest>(key: K, value: ProjectCreateRequest[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.artisans.some((a) => a.artisanId === 0)) {
      setError("참여 보유자를 선택하거나 해당 줄을 삭제해 주세요.");
      return;
    }
    setSaving(true);
    try {
      if (isEdit) {
        const { slug: _slug, ...body } = form;
        await adminProjects.update(Number(id), body);
        toast.success("실적을 저장했습니다.");
      } else {
        await adminProjects.create(form);
        toast.success("실적을 등록했습니다.");
      }
      navigate("/admin/projects");
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (isEdit && loading) return <LoadingNotice />;

  return (
    <>
      <PageHeader title={isEdit ? `실적 수정 — ${form.title}` : "실적 등록"} />

      <FormShell
        onSubmit={submit}
        backTo="/admin/projects"
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
                placeholder="OO기업 명절 선물 패키지 500세트"
              />
            </Field>
          </FullWidth>
          <Field
            label="slug"
            required
            hint={
              isEdit
                ? "식별자라 수정할 수 없습니다."
                : "URL에 쓰입니다. 영문 소문자·숫자·하이픈만 — 예: bulguksa-limited"
            }
          >
            <Input
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              onBlur={(e) => set("slug", e.target.value.trim())}
              disabled={isEdit}
              required
              pattern="[a-z0-9-]+"
              placeholder="bulguksa-limited"
            />
          </Field>
          <Field label="유형" required>
            <EnumSelect<ProjectType>
              value={form.type}
              onChange={(v) => set("type", v)}
              options={PROJECT_TYPE_LABEL}
            />
          </Field>
          <Field label="협업사" hint="비공개면 '국내 대기업 A사'처럼 적습니다.">
            <Input
              value={form.clientName ?? ""}
              onChange={(e) => set("clientName", e.target.value || null)}
            />
          </Field>
          <Field label="진행 일자" required hint="타임라인 정렬 기준입니다.">
            <Input
              type="date"
              value={form.projectDate}
              onChange={(e) => set("projectDate", e.target.value)}
              required
            />
          </Field>
          <FullWidth>
            <Field label="요약" hint="목록 카드에 노출됩니다.">
              <Input
                value={form.summary ?? ""}
                onChange={(e) => set("summary", e.target.value || null)}
                maxLength={300}
              />
            </Field>
          </FullWidth>
          <FullWidth>
            <Field label="성과 한 줄" hint="'펀딩률 9,800%', '완판' 등 — 카드·상세에 강조됩니다.">
              <Input
                value={form.resultMetric ?? ""}
                onChange={(e) => set("resultMetric", e.target.value || null)}
                maxLength={200}
              />
            </Field>
          </FullWidth>
          <FullWidth>
            <Field label="상세 설명" hint="마크다운. 배경 → 진행 → 결과 순으로 씁니다.">
              <Textarea
                value={form.description ?? ""}
                onChange={(e) => set("description", e.target.value || null)}
                rows={12}
              />
            </Field>
          </FullWidth>
        </FormSection>

        <FormSection
          title="참여 보유자"
          description="ONDO 자체 프로젝트라면 비워 둡니다."
          columns={1}
        >
          <div className="flex flex-col gap-2">
            {form.artisans.length === 0 ? (
              <p className="rounded-sm border border-dashed border-border-base px-3 py-4 text-center text-xs text-text-muted">
                참여 보유자가 없습니다.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {form.artisans.map((a, i) => (
                  <li key={i} className="flex gap-2">
                    <Select
                      aria-label="참여 보유자"
                      value={a.artisanId || ""}
                      onChange={(e) => {
                        const next = [...form.artisans];
                        next[i] = { ...a, artisanId: Number(e.target.value) };
                        set("artisans", next);
                      }}
                      className="max-w-[220px]"
                    >
                      <option value="" disabled>
                        보유자 선택
                      </option>
                      {artisans.data?.content.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.name} ({opt.title})
                        </option>
                      ))}
                    </Select>
                    <Input
                      aria-label="참여 역할"
                      value={a.role ?? ""}
                      onChange={(e) => {
                        const next = [...form.artisans];
                        next[i] = { ...a, role: e.target.value || null };
                        set("artisans", next);
                      }}
                      placeholder="역할 (예: 전통 북 제작)"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        set(
                          "artisans",
                          form.artisans.filter((_, idx) => idx !== i),
                        )
                      }
                      aria-label="참여 보유자 삭제"
                      className="rounded-sm border border-border-base px-2 text-xs text-error"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              onClick={() => set("artisans", [...form.artisans, { artisanId: 0, role: null }])}
              className="self-start rounded-sm border border-border-base px-3 py-1 text-xs"
            >
              보유자 추가
            </button>
          </div>
        </FormSection>

        <FormSection title="이미지" columns={1}>
          <ImageField
            label="대표 이미지"
            value={form.thumbnailUrl}
            onChange={(url) => set("thumbnailUrl", url)}
            onError={toast.error}
          />
          <GalleryField
            label="상세 이미지"
            images={form.images}
            onChange={(images) => set("images", images)}
            onError={toast.error}
          />
        </FormSection>

        <FormSection
          title="노출"
          description="'공개'를 켜야 어디에든 보입니다. 공개된 실적은 Project 목록에 항상 나오고, 홈·협업문의는 아래에서 따로 고릅니다."
          columns={1}
        >
          <Checkbox
            label="공개"
            hint="끄면 공개 사이트 어디에도 노출되지 않습니다 — 아래 노출 위치를 켜도 마찬가지입니다."
            checked={form.published}
            onChange={(v) => set("published", v)}
          />
          <Checkbox
            label="홈에 노출"
            hint="홈 상단 실적 슬롯(최대 4칸)에 노출됩니다."
            checked={form.showOnHome}
            onChange={(v) => set("showOnHome", v)}
          />
          <Checkbox
            label="협업문의 페이지에 노출"
            hint="협업문의 페이지 하단 'PROOF — 온도가 만들어온 협업'에 노출됩니다."
            checked={form.showOnCollaboration}
            onChange={(v) => set("showOnCollaboration", v)}
          />
          <Field label="정렬 순서" hint="숫자가 작을수록 앞에 옵니다. 홈·협업문의 노출 순서에 쓰입니다.">
            <Input
              type="number"
              value={form.displayOrder}
              onChange={(e) => set("displayOrder", Number(e.target.value))}
              className="max-w-[160px]"
            />
          </Field>
        </FormSection>
      </FormShell>
    </>
  );
}
