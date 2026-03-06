import type { Metadata } from "next";
import Link from "next/link";
import { getPageByPath } from "@/lib/content";
import { PageContent } from "@/components/PageContent";
import { SITE_URL, PHONE_LINK } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const page = getPageByPath("about-us");
  return {
    title: page?.title ?? "About Us",
    description: page?.description,
    alternates: { canonical: `${SITE_URL}/about-us` },
  };
}

export default function AboutUsPage() {
  const page = getPageByPath("about-us");

  return (
    <PageContent
      page={page ?? { path: "about-us", slug: "about-us", title: "About RL Peek Painting", description: "" }}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      faqSchema={false}
    >
      <div className="mt-8 space-y-6 text-zinc-700">
        <p>
          At RL Peek Painting, we take pride in being a trusted local painting company known for quality
          craftsmanship, reliable service, and long-lasting results. Since 1987, we have proudly served homeowners
          and businesses throughout Summit and Wasatch County, delivering professional interior and exterior
          painting, staining, and wood refinishing services with meticulous attention to detail.
        </p>
        <p>
          Whether you're refreshing the interior of your home, improving curb appeal with a new exterior coat, or
          bringing new life to cabinetry and woodwork, our goal is always the same: provide a smooth process and
          a finished product that looks exceptional and stands the test of time.
        </p>
        <p>
          We use only high-quality paints, stains, and materials, paired with proven preparation methods and
          careful application. Our work is designed not only to enhance the appearance of your space, but also
          to provide the durability and protection your surfaces need for years to come.
        </p>
        <p>
          In 2026, RL Peek Painting proudly became a second-generation family-owned business as the company was
          passed down within the Peek family. With deep roots in the community, we remain committed to continuing
          the legacy of dependable service, honest communication, and outstanding customer care that has defined
          our reputation for decades.
        </p>
        <p>
          If you're looking for a trusted painting contractor, we're here to help with interior painting,
          exterior painting, staining, drywall repair, cabinet refinishing, and specialty finishes—always
          tailored to your vision and your home.
        </p>
        <h2 className="mt-10 text-xl font-semibold text-zinc-900">Why Choose RL Peek Painting?</h2>
        <p>
          When you hire our team, you get more than a paint crew—you get professionals who care about doing the
          job right. From helping with color selection to detailed prep work and clean finishing lines, we focus
          on the details that create a truly polished result. Most importantly, we treat every home with respect
          and every customer like a neighbor.
        </p>
        <p className="mt-8">
          <Link href="/contact-us" className="font-medium text-sky-600 hover:underline">
            Contact Us
          </Link>{" "}
          · <a href={PHONE_LINK} className="font-medium text-sky-600 hover:underline">Call 435-649-0158</a>
        </p>
      </div>
    </PageContent>
  );
}
