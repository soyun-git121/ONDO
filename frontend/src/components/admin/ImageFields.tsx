import { useRef, useState } from "react";
import { uploadImage } from "../../api/admin";
import type { AdminImageItem } from "../../types/admin";
import { Field, Input } from "./Form";

/**
 * 이미지 입력. 파일을 올리면 /api/admin/uploads가 저장 경로를 돌려주고,
 * 폼에는 그 경로(문자열)가 담긴다 — 외부 URL을 직접 붙여넣는 것도 허용한다.
 */

function useUpload(onError: (message: string) => void) {
  const [busy, setBusy] = useState(false);

  const upload = async (file: File): Promise<string | null> => {
    setBusy(true);
    try {
      const res = await uploadImage(file);
      return res.url;
    } catch (e) {
      onError(e instanceof Error ? e.message : "업로드에 실패했습니다.");
      return null;
    } finally {
      setBusy(false);
    }
  };

  return { busy, upload };
}

function Preview({ url }: { url: string }) {
  const [failed, setFailed] = useState(false);
  if (!url || failed) return null;
  return (
    <img
      src={url}
      alt=""
      onError={() => setFailed(true)}
      className="h-20 w-20 shrink-0 rounded-sm border border-border-base object-cover"
    />
  );
}

/** 단일 이미지 필드 (썸네일·프로필·커버). */
export function ImageField({
  label,
  value,
  onChange,
  hint,
  onError,
}: {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
  hint?: string;
  onError: (message: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { busy, upload } = useUpload(onError);

  return (
    <Field label={label} hint={hint}>
      <div className="flex items-start gap-3">
        <Preview url={value ?? ""} />
        <div className="flex-1 space-y-2">
          <Input
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value || null)}
            placeholder="/uploads/... 또는 https://..."
          />
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = ""; // 같은 파일 재선택 허용
                if (!file) return;
                const url = await upload(file);
                if (url) onChange(url);
              }}
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="rounded-sm border border-border-base px-3 py-1 text-xs disabled:text-text-muted"
            >
              {busy ? "업로드 중…" : "파일 선택"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange(null)}
                className="rounded-sm border border-border-base px-3 py-1 text-xs"
              >
                비우기
              </button>
            )}
          </div>
        </div>
      </div>
    </Field>
  );
}

/**
 * 갤러리 편집기. sortOrder는 배열 순서에서 파생시킨다 —
 * 사용자가 숫자를 직접 관리하게 두면 중복·구멍이 생긴다.
 */
export function GalleryField({
  label,
  images,
  onChange,
  onError,
}: {
  label: string;
  images: AdminImageItem[];
  onChange: (images: AdminImageItem[]) => void;
  onError: (message: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { busy, upload } = useUpload(onError);

  const reindex = (list: AdminImageItem[]) =>
    list.map((img, i) => ({ ...img, sortOrder: i }));

  const move = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(reindex(next));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium">{label}</span>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={async (e) => {
              const files = Array.from(e.target.files ?? []);
              e.target.value = "";
              const uploaded: AdminImageItem[] = [];
              for (const file of files) {
                const url = await upload(file);
                if (url) uploaded.push({ imageUrl: url, caption: null, sortOrder: 0 });
              }
              if (uploaded.length) onChange(reindex([...images, ...uploaded]));
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="rounded-sm border border-border-base px-3 py-1 text-xs disabled:text-text-muted"
          >
            {busy ? "업로드 중…" : "이미지 추가"}
          </button>
          <button
            type="button"
            onClick={() =>
              onChange(reindex([...images, { imageUrl: "", caption: null, sortOrder: 0 }]))
            }
            className="rounded-sm border border-border-base px-3 py-1 text-xs"
          >
            URL로 추가
          </button>
        </div>
      </div>

      {images.length === 0 ? (
        <p className="rounded-sm border border-dashed border-border-base px-3 py-6 text-center text-xs text-text-muted">
          등록된 이미지가 없습니다.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {images.map((img, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-sm border border-border-base p-2"
            >
              <Preview url={img.imageUrl} />
              <div className="flex-1 space-y-2">
                <Input
                  value={img.imageUrl}
                  onChange={(e) => {
                    const next = [...images];
                    next[i] = { ...img, imageUrl: e.target.value };
                    onChange(next);
                  }}
                  placeholder="이미지 경로"
                />
                <Input
                  value={img.caption ?? ""}
                  onChange={(e) => {
                    const next = [...images];
                    next[i] = { ...img, caption: e.target.value || null };
                    onChange(next);
                  }}
                  placeholder="설명 (선택)"
                />
              </div>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => move(i, i - 1)}
                  disabled={i === 0}
                  aria-label="위로 이동"
                  className="rounded-sm border border-border-base px-2 py-1 text-xs disabled:text-text-muted"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, i + 1)}
                  disabled={i === images.length - 1}
                  aria-label="아래로 이동"
                  className="rounded-sm border border-border-base px-2 py-1 text-xs disabled:text-text-muted"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => onChange(reindex(images.filter((_, idx) => idx !== i)))}
                  aria-label="이미지 삭제"
                  className="rounded-sm border border-border-base px-2 py-1 text-xs text-error"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
