import type { Metadata } from "next";
import Image from "next/image";
import { getPageByPath } from "@/lib/content";
import { PageContent } from "@/components/PageContent";
import { SITE_URL, s3Image } from "@/lib/site";

const TEAM = [
  { slug: "jonas-peek", name: "Jonas Peek", title: "Owner and Operator", email: "jonas@rlpeekpainting.com" },
  { slug: "bob-peek", name: "Bob Peek", title: "Founder", email: "bob@rlpeekpainting.com" },
  { slug: "kim-hurley", name: "Kim Hurley", title: "Production Manager", email: "kim@rlpeekpainting.com" },
  { slug: "morgan-white", name: "Morgan White", title: "Office Manager", email: "info@rlpeekpainting.com" },
  { slug: "brandon-paxton", name: "Brandon Paxton", title: "Sale and Marketing Manager", email: "brandon@rlpeekpainting.com" },
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const page = getPageByPath("meet-the-team");
  return {
    title: page?.title ?? "Meet The Team",
    description: page?.description ?? "Meet the RL Peek Painting team: experienced painters and staff serving Summit and Wasatch County since 1987.",
    alternates: { canonical: `${SITE_URL}/meet-the-team` },
  };
}

export default function MeetTheTeamPage() {
  const page = getPageByPath("meet-the-team");

  return (
    <PageContent
      page={page ?? { path: "meet-the-team", slug: "meet-the-team", title: "Meet The Team", description: "" }}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Meet The Team" }]}
    >
      <p className="mt-6 text-zinc-600">
        Our team brings decades of experience and a commitment to quality.
      </p>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {TEAM.map(({ slug, name, title, email }) => (
          <div key={slug} className="flex flex-col items-center text-center">
            <div className="relative h-40 w-40 overflow-hidden rounded-full bg-zinc-100">
              <Image
                src={s3Image(`images/team/${slug}.jpg`)}
                alt={name}
                fill
                className="object-cover"
                sizes="160px"
              />
            </div>
            <p className="mt-4 font-semibold text-zinc-900">{name}</p>
            <p className="mt-1 text-sm text-zinc-600">{title}</p>
            {email && (
              <a href={`mailto:${email}`} className="mt-2 text-sm text-zinc-600 hover:text-zinc-900 hover:underline">
                {email}
              </a>
            )}
          </div>
        ))}
      </div>
    </PageContent>
  );
}
