import type { Metadata } from "next";
import { HomeExperience } from "../../components/HomeExperience";
import { PageRenderer } from "../../components/PageRenderer";
import {
  getAllStaticPaths,
  getPage,
  normalizePath,
} from "../../content/site-data";
import type { DonationModeId } from "../../content/donation";

type RouteProps = {
  params: Promise<{ slug: string[] }>;
  searchParams?: Promise<{ mode?: string | string[] }>;
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
  if (path === "/cn/") {
    return {
      title: "LOVE 21 Foundation",
      description:
        "Love 21 通过运动、营养及全面支援计划，支持香港唐氏综合症、自闭症及神经多样性社群。",
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
            "zh-Hans": page.locale === "cn" ? page.path : page.alternatePath,
          },
        }
      : undefined,
  };
}

export default async function CatchAllPage({ params, searchParams }: RouteProps) {
  const { slug } = await params;
  const path = normalizePath(`/${slug.join("/")}/`);
  if (path === "/zh/") return <HomeExperience locale="zh" />;
  if (path === "/cn/") return <HomeExperience locale="cn" />;
  const requestedMode = (await searchParams)?.mode;
  const donationMode: DonationModeId | undefined =
    requestedMode === "money" || requestedMode === "events" || requestedMode === "items"
      ? requestedMode
      : undefined;
  return <PageRenderer donationMode={donationMode} path={path} />;
}
