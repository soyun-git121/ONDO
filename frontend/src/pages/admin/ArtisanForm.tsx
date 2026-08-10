import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminArtisans } from "../../api/admin";
import { useAdminData } from "../../hooks/useAdminData";
import { useToast } from "../../components/admin/Feedback";
import {
  Checkbox,
  EnumSelect,
  Field,
  FormSection,
  FullWidth,
  Input,
  Textarea,
} from "../../components/admin/Form";
import { FormShell, KeyValueField } from "../../components/admin/FormShell";
import { GalleryField, ImageField } from "../../components/admin/ImageFields";
import { LoadingNotice, PageHeader } from "../../components/admin/Ui";
import type { AdminImageItem, ArtisanCreateRequest } from "../../types/admin";
import { DESIGNATION_LABEL } from "../../types/artisan";
import type { Designation } from "../../types/artisan";

const EMPTY: ArtisanCreateRequest = {
  slug: "",
  name: "",
  title: "",
  designation: "HOLDER",
  shortIntro: "",
  story: null,
  profileImageUrl: null,
  coverImageUrl: null,
  videoUrl: null,
  snsLinks: {},
  displayOrder: 0,
  published: false,
  images: [],
};

export default function ArtisanForm() {
  const { id } = useParams();
  const isEdit = id !== undefined;
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState<ArtisanCreateRequest>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data, loading } = useAdminData(
    () => (isEdit ? adminArtisans.get(Number(id)) : Promise.resolve(null)),
    [id],
  );

  useEffect(() => {
    if (!data) return;
    setForm({
      slug: data.slug,
      name: data.name,
      title: data.title,
      designation: data.designation,
      shortIntro: data.shortIntro,
      story: data.story,
      profileImageUrl: data.profileImageUrl,
      coverImageUrl: data.coverImageUrl,
      videoUrl: data.videoUrl,
      snsLinks: data.snsLinks ?? {},
      displayOrder: data.displayOrder,
      published: data.published,
      images: data.images,
    });
  }, [data]);

  const set = <K extends keyof ArtisanCreateRequest>(key: K, value: ArtisanCreateRequest[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      if (isEdit) {
        const { slug: _slug, ...body } = form;
        await adminArtisans.update(Number(id), body);
        toast.success("보유자를 저장했습니다.");
      } else {
        await adminArtisans.create(form);
        toast.success("보유자를 등록했습니다.");
      }
      navigate("/admin/artisans");
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (isEdit && loading) return <LoadingNotice />;

  return (
    <>
      <PageHeader title={isEdit ? `보유자 수정 — ${form.name}` : "보유자 등록"} />

      <FormShell
        onSubmit={submit}
        backTo="/admin/artisans"
        submitLabel={isEdit ? "저장" : "등록"}
        saving={saving}
        error={error}
      >
        <FormSection title="기본 정보">
          <Field label="이름" required>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} required />
          </Field>
          <Field label="종목" required hint="악기장, 나전장 등">
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </Field>
          <Field
            label="slug"
            required
            hint={isEdit ? "식별자라 수정할 수 없습니다." : "URL에 쓰입니다. 예: yoon-jongguk"}
          >
            <Input
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              onBlur={(e) => set("slug", e.target.value.trim())}
              disabled={isEdit}
              required
              pattern="[a-z0-9-]+"
              placeholder="yoon-jongguk"
            />
          </Field>
          <Field label="지정 구분" required>
            <EnumSelect<Designation>
              value={form.designation}
              onChange={(v) => set("designation", v)}
              options={DESIGNATION_LABEL}
            />
          </Field>
          <FullWidth>
            <Field label="한 줄 소개" required hint="목록 카드에 노출됩니다.">
              <Input
                value={form.shortIntro}
                onChange={(e) => set("shortIntro", e.target.value)}
                required
                maxLength={200}
              />
            </Field>
          </FullWidth>
          <FullWidth>
            <Field label="소개 본문" hint="마크다운으로 작성합니다. 보유자 랜딩에 노출됩니다.">
              <Textarea
                value={form.story ?? ""}
                onChange={(e) => set("story", e.target.value || null)}
                rows={10}
              />
            </Field>
          </FullWidth>
        </FormSection>

        <FormSection title="이미지·영상">
          <ImageField
            label="프로필 이미지"
            value={form.profileImageUrl}
            onChange={(url) => set("profileImageUrl", url)}
            onError={toast.error}
          />
          <ImageField
            label="커버 이미지"
            value={form.coverImageUrl}
            onChange={(url) => set("coverImageUrl", url)}
            onError={toast.error}
          />
          <FullWidth>
            <Field label="영상 URL" hint="유튜브 embed 주소">
              <Input
                value={form.videoUrl ?? ""}
                onChange={(e) => set("videoUrl", e.target.value || null)}
                placeholder="https://www.youtube.com/embed/..."
              />
            </Field>
          </FullWidth>
          <FullWidth>
            <GalleryField
              label="갤러리"
              images={form.images}
              onChange={(images: AdminImageItem[]) => set("images", images)}
              onError={toast.error}
            />
          </FullWidth>
        </FormSection>

        <FormSection title="링크·노출" columns={1}>
          <KeyValueField
            label="SNS 링크"
            hint="키는 instagram, youtube처럼 소문자로 씁니다."
            value={form.snsLinks}
            onChange={(v) => set("snsLinks", v)}
          />
          <Field label="정렬 순서" hint="숫자가 작을수록 목록에서 앞에 옵니다.">
            <Input
              type="number"
              value={form.displayOrder}
              onChange={(e) => set("displayOrder", Number(e.target.value))}
              className="max-w-[160px]"
            />
          </Field>
          <Checkbox
            label="공개"
            hint="끄면 공개 사이트에 노출되지 않습니다."
            checked={form.published}
            onChange={(v) => set("published", v)}
          />
        </FormSection>
      </FormShell>
    </>
  );
}
