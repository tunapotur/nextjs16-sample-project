"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { useState, useEffect } from "react";

type AboutData = {
  hero_title: string;
  hero_subtitle?: string | null;
  hero_caption?: string | null;
  hero_paragraph1?: string | null;
  hero_paragraph2?: string | null;
  hero_paragraph3?: string | null;
  hero_cta_label?: string | null;
  hero_cta_url?: string | null;
};

const AboutPage = () => {
  const [locale, setLocale] = useState<"tr" | "en">("en");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<AboutData>({
    hero_title: "",
    hero_subtitle: "",
    hero_caption: "",
    hero_paragraph1: "",
    hero_paragraph2: "",
    hero_paragraph3: "",
    hero_cta_label: "",
    hero_cta_url: "",
  });

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/about?locale=${locale}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d) {
          setData({
            hero_title: "",
            hero_subtitle: "",
            hero_caption: "",
            hero_paragraph1: "",
            hero_paragraph2: "",
            hero_paragraph3: "",
            hero_cta_label: "",
            hero_cta_url: "",
          });
        } else {
          setData({
            hero_title: d.hero_title || "",
            hero_subtitle: d.hero_subtitle || "",
            hero_caption: d.hero_caption || "",
            hero_paragraph1: d.hero_paragraph1 || "",
            hero_paragraph2: d.hero_paragraph2 || "",
            hero_paragraph3: d.hero_paragraph3 || "",
            hero_cta_label: d.hero_cta_label || "",
            hero_cta_url: d.hero_cta_url || "",
          });
        }
      })
      .finally(() => setLoading(false));
  }, [locale]);

  async function save() {
    setSaving(true);
    await fetch("/api/admin/about", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ locale, ...data }),
    });
    setSaving(false);
    alert("saved");
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Hero / About Content</h1>

      <div className="flex gap-4 mb-4">
        <Button
          className={locale === "tr" ? "underline font-semibold" : ""}
          onClick={() => setLocale("tr")}
        >
          TR
        </Button>

        <Button
          className={locale === "en" ? "underline font-semibold" : ""}
          onClick={() => setLocale("en")}
        >
          EN
        </Button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Hero Title</label>
            <input
              className="border w-full p-2 rounded"
              value={data.hero_title}
              onChange={(e) =>
                setData((prev) => ({ ...prev, hero_title: e.target.value }))
              }
              placeholder="Hi! I’m Görkem 👋"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Hero Subtitle
            </label>
            <input
              className="border w-full p-2 rounded"
              value={data.hero_subtitle ?? ""}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  hero_subtitle: e.target.value,
                }))
              }
              placeholder="Full Stack Developer | Content Creator | Web Pentester"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Hero Caption (image alt text altında)
            </label>
            <input
              className="border w-full p-2 rounded"
              value={data.hero_caption ?? ""}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  hero_caption: e.target.value,
                }))
              }
              placeholder="Kısa bir cümle"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Paragraph 1
            </label>
            <textarea
              className="border w-full p-2 rounded h-20"
              value={data.hero_paragraph1 ?? ""}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  hero_paragraph1: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Paragraph 2
            </label>
            <textarea
              className="border w-full p-2 rounded h-20"
              value={data.hero_paragraph2 ?? ""}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  hero_paragraph2: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Paragraph 3
            </label>
            <textarea
              className="border w-full p-2 rounded h-20"
              value={data.hero_paragraph3 ?? ""}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  hero_paragraph3: e.target.value,
                }))
              }
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                CTA Label
              </label>
              <input
                className="border w-full p-2 rounded"
                value={data.hero_cta_label ?? ""}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    hero_cta_label: e.target.value,
                  }))
                }
                placeholder="Let's work together"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                CTA URL (opsiyonel)
              </label>
              <input
                className="border w-full p-2 rounded"
                value={data.hero_cta_url ?? ""}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    hero_cta_url: e.target.value,
                  }))
                }
                placeholder="/contact"
              />
            </div>
          </div>
          <button
            className="bg-black text-white px-4 py-2 rounded mt-4"
            onClick={save}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AboutPage;
