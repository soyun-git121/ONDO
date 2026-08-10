import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminArtisans, adminProducts } from "../../api/admin";
import { useAdminData } from "../../hooks/useAdminData";
import { useToast } from "../../components/admin/Feedback";
import {
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
import type { ProductCreateRequest } from "../../types/admin";
import { PRODUCT_CATEGORY_LABEL, PRODUCT_STATUS_LABEL } from "../../types/product";
import type { ProductCategory, ProductStatus } from "../../types/product";

const EMPTY: ProductCreateRequest = {
  artisanId: 0,
  slug: "",
  name: "",
  category: "GOODS",
  price: 0,
  summary: null,
  description: null,
  thumbnailUrl: null,
  stockQuantity: 0,
  status: "ON_SALE",
  externalUrl: null,
  images: [],
};

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = id !== undefined;
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState<ProductCreateRequest>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 상품은 반드시 보유자에 속한다 (db_schema.md §3) — 선택지를 먼저 불러온다.
  const artisans = useAdminData(() => adminArtisans.list({ page: 0, size: 100 }), []);
  const { data, loading } = useAdminData(
    () => (isEdit ? adminProducts.get(Number(id)) : Promise.resolve(null)),
    [id],
  );

  useEffect(() => {
    if (!data) return;
    setForm({
      artisanId: data.artisanId,
      slug: data.slug,
      name: data.name,
      category: data.category,
      price: data.price,
      summary: data.summary,
      description: data.description,
      thumbnailUrl: data.thumbnailUrl,
      stockQuantity: data.stockQuantity,
      status: data.status,
      externalUrl: data.externalUrl,
      images: data.images,
    });
  }, [data]);

  // 신규 등록에서 보유자가 한 명뿐이면 미리 골라 준다.
  useEffect(() => {
    if (isEdit || form.artisanId !== 0) return;
    const first = artisans.data?.content[0];
    if (first) setForm((prev) => ({ ...prev, artisanId: first.id }));
  }, [artisans.data, isEdit, form.artisanId]);

  const set = <K extends keyof ProductCreateRequest>(key: K, value: ProductCreateRequest[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.artisanId === 0) {
      setError("보유자를 선택해 주세요. 보유자가 없으면 먼저 등록해야 합니다.");
      return;
    }
    setSaving(true);
    try {
      if (isEdit) {
        const { slug: _slug, ...body } = form;
        await adminProducts.update(Number(id), body);
        toast.success("상품을 저장했습니다.");
      } else {
        await adminProducts.create(form);
        toast.success("상품을 등록했습니다.");
      }
      navigate("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (isEdit && loading) return <LoadingNotice />;

  return (
    <>
      <PageHeader title={isEdit ? `상품 수정 — ${form.name}` : "상품 등록"} />

      <FormShell
        onSubmit={submit}
        backTo="/admin/products"
        submitLabel={isEdit ? "저장" : "등록"}
        saving={saving}
        error={error}
      >
        <FormSection title="기본 정보">
          <Field label="상품명" required>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} required />
          </Field>
          <Field
            label="slug"
            required
            hint={isEdit ? "식별자라 수정할 수 없습니다." : "URL에 쓰입니다. 예: mini-buk-object"}
          >
            <Input
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              onBlur={(e) => set("slug", e.target.value.trim())}
              disabled={isEdit}
              required
              pattern="[a-z0-9-]+"
              placeholder="mini-buk-object"
            />
          </Field>
          <Field label="보유자" required hint="상품은 반드시 보유자에 속합니다.">
            <Select
              value={form.artisanId || ""}
              onChange={(e) => set("artisanId", Number(e.target.value))}
              required
            >
              <option value="" disabled>
                {artisans.loading ? "불러오는 중…" : "보유자 선택"}
              </option>
              {artisans.data?.content.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.title})
                </option>
              ))}
            </Select>
          </Field>
          <Field label="분류" required>
            <EnumSelect<ProductCategory>
              value={form.category}
              onChange={(v) => set("category", v)}
              options={PRODUCT_CATEGORY_LABEL}
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
            <Field label="상세 설명" hint="마크다운으로 작성합니다.">
              <Textarea
                value={form.description ?? ""}
                onChange={(e) => set("description", e.target.value || null)}
                rows={10}
              />
            </Field>
          </FullWidth>
        </FormSection>

        <FormSection title="판매 정보">
          <Field label="가격 (원)" required hint="문의 전용 상품은 0으로 둡니다.">
            <Input
              type="number"
              min={0}
              value={form.price}
              onChange={(e) => set("price", Number(e.target.value))}
              required
            />
          </Field>
          <Field label="재고 수량" required>
            <Input
              type="number"
              min={0}
              value={form.stockQuantity}
              onChange={(e) => set("stockQuantity", Number(e.target.value))}
              required
            />
          </Field>
          <Field label="판매 상태" required>
            <EnumSelect<ProductStatus>
              value={form.status}
              onChange={(v) => set("status", v)}
              options={PRODUCT_STATUS_LABEL}
            />
          </Field>
          <Field label="외부 판매처" hint="텀블벅·스마트스토어 등 병행 판매 링크">
            <Input
              value={form.externalUrl ?? ""}
              onChange={(e) => set("externalUrl", e.target.value || null)}
              placeholder="https://..."
            />
          </Field>
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
      </FormShell>
    </>
  );
}
