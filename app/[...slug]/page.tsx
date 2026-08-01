import type { Metadata } from "next";
import { HomeExperience } from "../../components/HomeExperience";
import { PageRenderer } from "../../components/PageRenderer";
import {
  getAllStaticPaths,
  getPage,
  normalizePath,
} from "../../content/site-data";

type RouteProps = {
  params: Promise<{ slug: string[] }>;
};

export function generateStaticParams() {
  return getAllStaticPaths();
}

export const revalidate = 60;

export async function generateMetadata({
  params,
}: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  const path = normalizePath(`/${slug.join("/")}/`);
  if (path === "/zh/") {
    return {
      title: "LOVE 21 Foundation",
      description:
        "Love 21透過運動、營養及全面支援計劃，支持香港唐氏綜合症、自閉症及神經多樣性社群。",
    };
  }
  const page = getPage(path);
  return {
    title: page?.title || "LOVE 21 Foundation",
    description:
      page?.description ||
      page?.paragraphs?.[0] ||
      "LOVE 21 Foundation public website development copy.",
    alternates: page
      ? {
          languages: {
            en: page.locale === "en" ? page.path : page.alternatePath,
            "zh-HK": page.locale === "zh" ? page.path : page.alternatePath,
          },
        }
      : undefined,
  };
}

export default async function CatchAllPage({ params }: RouteProps) {
  const { slug } = await params;
  const path = normalizePath(`/${slug.join("/")}/`);
  if (path === "/zh/") return <HomeExperience locale="zh" />;
  return <PageRenderer path={path} />;
}
