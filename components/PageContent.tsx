import Link from "next/link";
import { Box, Container, Group, Text, Title } from "@mantine/core";
import type { PageMeta } from "@/lib/content";
import { getServiceAreas, getServiceDisplayTitle } from "@/lib/content";
import { SITE_URL, s3Image } from "@/lib/site";
import { ServicePageImage } from "./ServicePageImage";

function resolveImageSrc(src: string): string {
  return src.startsWith("http") ? src : s3Image(src);
}

type BreadcrumbItem = { label: string; href?: string };

/** Match [label](url) for inline links */
const MARKDOWN_LINK = /\[([^\]]+)\]\(([^)]+)\)/g;

/** Render a paragraph string; [label](url) is rendered as a Link. */
function ParagraphWithLinks({ content }: { content: string }) {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  MARKDOWN_LINK.lastIndex = 0;
  while ((m = MARKDOWN_LINK.exec(content)) !== null) {
    if (m.index > lastIndex) {
      parts.push(<span key={key++}>{content.slice(lastIndex, m.index)}</span>);
    }
    parts.push(
      <Link key={key++} href={m[2]} className="text-sky-600 hover:underline">
        {m[1]}
      </Link>
    );
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < content.length) {
    parts.push(<span key={key++}>{content.slice(lastIndex)}</span>);
  }
  return <>{parts.length ? parts : content}</>;
}

/** List delimiter: newline followed by 2+ spaces. Splitting on this first preserves bullets when cleanServiceText collapses other whitespace. */
const LIST_DELIMITER = /\n  +/;

/** Split text into sentences, then group into paragraphs of 2–3 sentences for readable blocks instead of one sentence per paragraph. */
function textToParagraphs(text: string): string[] {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (sentences.length <= 1) return sentences;
  const paragraphs: string[] = [];
  const maxSentencesPerParagraph = 3;
  for (let i = 0; i < sentences.length; i += maxSentencesPerParagraph) {
    const chunk = sentences.slice(i, i + maxSentencesPerParagraph).join(" ");
    if (chunk) paragraphs.push(chunk);
  }
  return paragraphs;
}

/** Detect callout lines (Local tip:, Local insight:) for service variant. */
const CALLOUT_PREFIXES = /^(Local tip:|Local insight:)\s*/i;

function isCallout(paragraph: string): boolean {
  return CALLOUT_PREFIXES.test(paragraph.trim());
}

/** Render FAQ answer text with paragraphs and list items (\n  -separated). Supports [label](url) in text. Callout blocks (Local tip:/Local insight:) get styled as callouts. */
function SectionBody({
  text,
  cleanForServices = false,
  variant = "default",
}: {
  text: string;
  cleanForServices?: boolean;
  variant?: "default" | "service";
}) {
  let parts: string[];
  if (cleanForServices) {
    const rawParts = text.split(LIST_DELIMITER).map((s) => s.trim()).filter(Boolean);
    if (rawParts.length > 1) {
      parts = rawParts.map((segment) => cleanServiceText(segment));
    } else {
      const cleaned = cleanServiceText(text);
      parts = cleaned.split(LIST_DELIMITER).map((s) => s.trim()).filter(Boolean);
      if (parts.length <= 1) parts = [cleaned];
    }
  } else {
    const raw = text;
    parts = raw.split(LIST_DELIMITER).map((s) => s.trim()).filter(Boolean);
    if (parts.length <= 1) parts = [raw];
  }

  const isService = variant === "service";
  const proseClass = isService ? "prose prose-zinc prose-lg max-w-none" : "prose prose-zinc max-w-none";
  if (parts.length <= 1) {
    const content = parts[0] ?? "";
    return (
      <Box className={proseClass}>
        {textToParagraphs(content).map((paragraph, i) =>
          isService && isCallout(paragraph) ? (
            <Box
              key={i}
              component="aside"
              mt="md"
              mb="md"
              p="md"
              className="rounded-lg border-l-4 border-sky-500 bg-sky-50/80"
            >
              <Text component="p" size="md" c="dark" m={0}>
                <ParagraphWithLinks content={paragraph.trim()} />
              </Text>
            </Box>
          ) : (
            <Text key={i} component="p" size="md" c="dark" mt="xs">
              <ParagraphWithLinks content={paragraph} />
            </Text>
          )
        )}
      </Box>
    );
  }
  const [lead, ...items] = parts;
  const renderParagraph = (paragraph: string, key: number) =>
    isService && isCallout(paragraph) ? (
      <Box
        key={key}
        component="aside"
        mt="md"
        mb="md"
        p="md"
        className="rounded-lg border-l-4 border-sky-500 bg-sky-50/80"
      >
        <Text component="p" size="md" c="dark" m={0}>
          <ParagraphWithLinks content={paragraph.trim()} />
        </Text>
      </Box>
    ) : (
      <Text key={key} component="p" size="md" c="dark" mt="xs">
        <ParagraphWithLinks content={paragraph} />
      </Text>
    );
  return (
    <Box className={proseClass}>
      {lead && textToParagraphs(lead).map((p, i) => renderParagraph(p, i))}
      {items.length > 0 && (
        <Box component="ul" mt="md" pl="lg" className={isService ? "space-y-2 list-disc list-outside" : undefined} style={!isService ? { listStyleType: "disc" } : undefined}>
          {items.map((item, i) => (
            <Box key={i} component="li" mb={isService ? "sm" : "xs"} className={isService ? "pl-1" : undefined}>
              <Text component="span" size="md" c="dark">
                <ParagraphWithLinks content={item} />
              </Text>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <Group gap="xs" mb="md" wrap="wrap">
        {items.map((item, i) => (
          <Box key={i} component="span" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {i > 0 && <Text span size="sm" c="dimmed" aria-hidden>/</Text>}
            {item.href ? (
              <Link href={item.href} className="no-underline hover:underline">
                <Text span size="sm" c="dimmed" className="hover:text-dark">
                  {item.label}
                </Text>
              </Link>
            ) : (
              <Text span size="sm" c="dark" fw={500}>{item.label}</Text>
            )}
          </Box>
        ))}
      </Group>
    </nav>
  );
}

/** Title-case a path segment for stripping (e.g. "exterior-services" -> "Exterior Services") */
function pathSegmentToTitle(segment: string): string {
  return segment.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

/** Strip scraped JSON-LD, duplicate title prefix, and trailing boilerplate from body */
export function cleanBody(
  body: string | undefined,
  options?: {
    title?: string;
    section?: "latest-projects" | "home-painting-tips" | "service-areas" | "services";
    path?: string;
  }
): string {
  if (!body) return "";
  let text = body.replace(/\s+/g, " ").trim();
  // Remove leading JSON-LD block that was scraped as visible content
  if (text.startsWith('{"@context"')) {
    const end = text.indexOf("}]}");
    if (end !== -1) text = text.slice(end + 3).trim();
  }
  // For service pages: strip "Home Services [path segments] " (e.g. "Home Services Exterior Services Exterior Painting ")
  if (options?.section === "services" && options?.path) {
    const segments = options.path.replace(/^services\//, "").split("/").filter(Boolean);
    const segmentTitles = segments.map(pathSegmentToTitle);
    const pathPrefix = "Home Services " + segmentTitles.join(" ") + " ";
    if (text.startsWith(pathPrefix)) text = text.slice(pathPrefix.length);
    // Single-segment pages often have scraped "Home Services X X " (duplicate)
    else if (segments.length === 1) {
      const dupPrefix = "Home Services " + segmentTitles[0] + " " + segmentTitles[0] + " ";
      if (text.startsWith(dupPrefix)) text = text.slice(dupPrefix.length);
    }
  }
  // For service pages: also strip "Home Services [display title] " (handles "Lime & Mineral Washing" vs path "Lime And Mineral Washing")
  if (options?.section === "services" && options?.title) {
    const withTitle = "Home Services " + options.title + " ";
    if (text.startsWith(withTitle + options.title + " ")) text = text.slice(withTitle.length + options.title.length + 2);
    else if (text.startsWith(withTitle)) text = text.slice(withTitle.length);
    // Strip "Interior & Exterior [Title] " or "Exterior & Interior [Title] " (common scraped subheading)
    const titleWithAnd = options.title.replace(/\s*&\s*/g, " And ");
    for (const prefix of [
      "Interior & Exterior " + options.title + " ",
      "Interior & Exterior " + titleWithAnd + " ",
      "Exterior & Interior " + options.title + " ",
      "Exterior & Interior " + titleWithAnd + " ",
    ]) {
      if (text.startsWith(prefix)) {
        text = text.slice(prefix.length);
        break;
      }
    }
  }
  // Remove duplicate "Home [Section] [Title] [Title] " prefix when we have the page title
  if (options?.title && options?.section) {
    const sectionLabel =
      options.section === "latest-projects"
        ? "Latest Projects"
        : options.section === "home-painting-tips"
          ? "Home Tips"
          : options.section === "service-areas"
            ? "Service Areas"
            : "Services";
    const prefix = `Home ${sectionLabel} ${options.title} ${options.title} `;
    if (text.startsWith(prefix)) text = text.slice(prefix.length);
    else {
      const altPrefix = `Home ${sectionLabel} ${options.title} `;
      if (text.startsWith(altPrefix)) text = text.slice(altPrefix.length);
    }
  }
  // For services: strip a leading scraped subheading line (5+ title-case words, no commas — e.g. "Professional Interior Painting Services for Your Park City Home ")
  if (options?.section === "services") {
    text = text.replace(/^[A-Z][^,.?!]+(?: [A-Z][^,.?!]+){4,}\s+/, "").trim();
  }
  // Remove trailing boilerplate (Service provided, Location, Project Image Gallery, CTA)
  text = text
    .replace(/\s*Service provided:\s*[^.]+\.\s*/gi, " ")
    .replace(/\s*Location:\s*[^.]+\.?\s*/gi, " ")
    .replace(/\s*Project Image Gallery\s*With Our RL Peek Painting Company!\s*/gi, " ")
    .replace(/\s*Contact Us\s*Call Us Today\s*$/i, "")
    .trim();
  return text.replace(/\s+/g, " ").trim();
}

/** "Read More About X" / "See This Project" -> service or projects path for link substitution */
const READ_MORE_SERVICE_SLUGS: Record<string, string> = {
  "Interior Painting": "/services/interior-services/painting",
  "Interior Staining": "/services/interior-services/staining",
  "Drywall Repair": "/services/interior-services/drywall-repair",
  "Cabinetry & Wood Refinishing": "/services/interior-services/cabinetry-wood-refinishing",
  "Exterior Painting": "/services/exterior-services/painting",
  "Exterior Staining": "/services/exterior-services/staining",
};

/** Clean FAQ/body text: remove [...] placeholders and turn "Read More About X" / "See This Project" into markdown links. */
export function cleanServiceText(raw: string): string {
  let t = raw
    .replace(/\s*\[…\]\s*/g, " ")
    .replace(/\s*\[\.\.\.\]\s*/g, " ")
    .replace(/\s*\[\.\.\.\s*\]\s*/g, " ")
    .replace(/\s*\[\s*\.\.\.\s*\]\s*/g, " ")
    .replace(/\s*Read More Reviews\s*/gi, " [Read more reviews](/reviews). ")
    .replace(/\s*Contact Us\s*\n?\s*Call Us Today\s*$/gi, "")
    .replace(/\t/g, " ")
    .replace(/\n\s*\n\s*\n+/g, "\n\n")
    .trim();
  // Replace "See This Project" with link to latest projects
  t = t.replace(/\s*See This Project\s*/gi, " [See this project](/latest-projects). ");
  // Replace "Read More About X" with link to service
  for (const [label, href] of Object.entries(READ_MORE_SERVICE_SLUGS)) {
    const re = new RegExp(`\\s*Read More About\\s+${label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*`, "gi");
    t = t.replace(re, ` [Read more about ${label}](${href}) `);
  }
  return t.replace(/\s+/g, " ").trim();
}

/** FAQ entries we treat as CTA blocks instead of content sections (keep in schema). "Explore Our Service Areas" is rendered as a linked list, not CTA. */
const CTA_FAQ_PATTERNS = [
  /^what our clients are saying$/i,
  /^if you are looking for .+ then please call/i,
];

/** FAQ we render as linked tip cards instead of raw answer text. */
const RECENT_TIPS_FAQ_PATTERN = /^Recent (Interior|Exterior|Painting) Tips & Tricks$/i;

function isCtaFaq(question: string): boolean {
  return CTA_FAQ_PATTERNS.some((p) => p.test(question.trim()));
}

function isRecentTipsFaq(question: string): boolean {
  return RECENT_TIPS_FAQ_PATTERN.test(question.trim());
}

const EXPLORE_SERVICE_AREAS_FAQ = /^explore our service areas$/i;

function isExploreServiceAreasFaq(question: string): boolean {
  return EXPLORE_SERVICE_AREAS_FAQ.test(question.trim());
}

/** Display label for service area link (e.g. slug "charleston-ut-painting" -> "Charleston, UT"). */
function serviceAreaDisplayLabel(slug: string): string {
  const name = slug.replace(/-ut-painting$/, "").replace(/-/g, " ");
  return name.replace(/\b\w/g, (c) => c.toUpperCase()) + ", UT";
}

function tipDisplayTitle(title: string): string {
  return title.split("|")[0].trim();
}

const FREQUENTLY_ASKED_QUESTIONS_FAQ = /^frequently asked questions$/i;

function isFrequentlyAskedQuestionsFaq(question: string): boolean {
  return FREQUENTLY_ASKED_QUESTIONS_FAQ.test(question.trim());
}

/** Parse raw FAQ answer into sub-Q&A pairs when it contains "Q?\n\n  A. ... Q?\n\n  A." structure. Returns null if not detected. */
function parseNestedFaq(raw: string): { q: string; a: string }[] | null {
  const blocks = raw.split(/\?\s*\n\s*\n\s*(?=\s*[A-Z])/);
  if (blocks.length < 2) return null;
  const pairs: { q: string; a: string }[] = [];
  let currentQ = blocks[0].trim();
  if (!currentQ) return null;
  currentQ += "?";
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];
    const subParts = block.split(/\n\s{2,}(?=[A-Z][^\n]*\?)/);
    for (let j = 0; j < subParts.length; j++) {
      const segment = subParts[j].trim();
      if (!segment) continue;
      if (j === 0) {
        if (i === 1) pairs.push({ q: currentQ, a: segment });
        continue;
      }
      const qEnd = segment.indexOf("?\n");
      if (qEnd >= 0) {
        currentQ = segment.slice(0, qEnd).trim() + "?";
        const a = segment.slice(qEnd + 2).trim();
        if (currentQ && a) pairs.push({ q: currentQ, a });
      } else {
        pairs.push({ q: currentQ, a: segment });
      }
    }
  }
  return pairs.length >= 1 ? pairs : null;
}

export function PageContent({
  page,
  breadcrumbs,
  children,
  faqSchema = false,
  variant = "default",
  recentTips,
}: {
  page: PageMeta;
  breadcrumbs: BreadcrumbItem[];
  children?: React.ReactNode;
  faqSchema?: boolean;
  /** "service" = intro + sections from FAQ + optional featured image */
  variant?: "default" | "service";
  /** When set, "Recent ... Tips & Tricks" FAQ is rendered as linked tip cards instead of raw text */
  recentTips?: PageMeta[];
}) {
  const section:
    | "latest-projects"
    | "home-painting-tips"
    | "service-areas"
    | "services"
    | undefined = page.path.startsWith("latest-projects/")
    ? "latest-projects"
    : page.path.startsWith("home-painting-tips/")
      ? "home-painting-tips"
      : page.path.startsWith("service-areas/")
        ? "service-areas"
        : page.path.startsWith("services/")
          ? "services"
          : undefined;
  const titleForBody = page.title.replace(/\s+by RL Peek Painting$/i, "").trim();
  const shortTitle = section === "services" ? getServiceDisplayTitle(page) : titleForBody;
  const bodyOptions = section ? { title: shortTitle, section, path: section === "services" ? page.path : undefined } : undefined;
  const body = cleanBody(page.body, bodyOptions);
  const introRaw = page.intro ?? (page.faq?.length && page.body ? (() => {
    const firstQ = page.faq[0].question.trim();
    const idx = page.body.indexOf(firstQ);
    return idx > 0 ? page.body.slice(0, idx).trim() : "";
  })() : "");
  const intro = introRaw ? cleanBody(introRaw, bodyOptions) : "";
  const breadcrumbListJson =
    breadcrumbs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: breadcrumbs.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.label,
            ...(item.href && { item: item.href === "/" ? SITE_URL : `${SITE_URL}${item.href}` }),
          })),
        }
      : null;

  const isServiceVariant = variant === "service" && page.path.startsWith("services/");
  const contentSections =
    isServiceVariant && page.faq
      ? page.faq.filter(
          (f) => !isCtaFaq(f.question) && !(page.faqItems?.length && isFrequentlyAskedQuestionsFaq(f.question))
        )
      : [];
  const faqItems = page.faqItems ?? [];
  const featuredImage = page.images?.[0];
  const headingTitle = isServiceVariant ? getServiceDisplayTitle(page) : page.title;

  return (
    <Box component="article" py="xl">
      <Container size="md">
        {breadcrumbListJson && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbListJson) }}
          />
        )}
        <Breadcrumbs items={breadcrumbs} />
        <Title
          order={1}
          size={isServiceVariant ? "h1" : "h2"}
          fw={700}
          c="dark"
          className={isServiceVariant ? "text-3xl sm:text-4xl" : undefined}
        >
          {headingTitle}
        </Title>
        {page.description && (
          <Text size="lg" c="dimmed" mt="sm">
            {page.description}
          </Text>
        )}
        {isServiceVariant && (
          <>
            {intro && (
              <Box mt="xl" className="prose prose-zinc prose-lg max-w-none">
                {textToParagraphs(isServiceVariant ? cleanServiceText(intro) : intro).map((paragraph, i) => (
                  <Text key={i} component="p" size="md" c="dark" mt="xs">
                    <ParagraphWithLinks content={paragraph} />
                  </Text>
                ))}
              </Box>
            )}
            {featuredImage && (
              <Box mt="xl" className="relative aspect-[4/3] w-full max-w-2xl overflow-hidden rounded-lg bg-zinc-100">
                <ServicePageImage
                  src={resolveImageSrc(featuredImage.src)}
                  alt={featuredImage.alt || page.title}
                  className="h-full w-full object-cover"
                  sizes="(max-width: 768px) 100vw, 672px"
                />
              </Box>
            )}
            {(contentSections.length > 0 || faqItems.length > 0) && (
              <Box mt="xl">
                {contentSections.map((faq, i) => {
                  const nestedFaq = !faqItems.length && isFrequentlyAskedQuestionsFaq(faq.question) ? parseNestedFaq(faq.answer) : null;
                  return (
                    <Box key={i} component="section" mt={i === 0 ? 0 : "xl"}>
                      <Title order={2} size="h2" fw={700} c="dark" mb="sm" className="text-2xl sm:text-3xl">
                        {faq.question}
                      </Title>
                      {isRecentTipsFaq(faq.question) && recentTips && recentTips.length > 0 ? (
                        <Box component="ul" mt="sm" pl={0} style={{ listStyle: "none" }}>
                          {recentTips.map((tip) => (
                            <Box key={tip.path} component="li" mb="md">
                              <Link
                                href={`/home-painting-tips/${tip.slug}`}
                                className="no-underline group block"
                              >
                                <Text component="span" size="md" fw={600} c="dark" className="group-hover:text-sky-600">
                                  {tipDisplayTitle(tip.title)}
                                </Text>
                                {tip.description && (
                                  <Text component="p" size="sm" c="dimmed" mt={4} mb={0}>
                                    {tip.description.slice(0, 200)}
                                    {tip.description.length > 200 ? "…" : ""}
                                  </Text>
                                )}
                              </Link>
                            </Box>
                          ))}
                        </Box>
                      ) : isExploreServiceAreasFaq(faq.question) ? (
                        <Box mt="sm">
                          <Box component="ul" className="space-y-2 list-disc list-outside pl-6">
                            {getServiceAreas().map((area) => (
                              <Box key={area.slug} component="li" className="pl-1">
                                {serviceAreaDisplayLabel(area.slug)}
                              </Box>
                            ))}
                          </Box>
                          <Text component="p" size="sm" c="dimmed" mt="md">
                            <Link href="/service-areas" className="text-sky-600 hover:underline">
                              View all service areas →
                            </Link>
                          </Text>
                        </Box>
                      ) : nestedFaq ? (
                        <Box mt="sm" component="div">
                          {nestedFaq.map((item, idx) => (
                            <Box key={idx} component="section" mt={idx === 0 ? 0 : "lg"}>
                              <Title order={3} size="h3" fw={600} c="dark" mb="xs" className="text-xl">
                                {item.q}
                              </Title>
                              <SectionBody text={item.a} cleanForServices={isServiceVariant} variant={isServiceVariant ? "service" : "default"} />
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <SectionBody text={faq.answer} cleanForServices={isServiceVariant} variant={isServiceVariant ? "service" : "default"} />
                      )}
                    </Box>
                  );
                })}
                {faqItems.length > 0 && (
                  <Box component="section" mt="xl">
                    <Title order={2} size="h2" fw={700} c="dark" mb="sm" className="text-2xl sm:text-3xl">
                      Frequently Asked Questions
                    </Title>
                    <Box mt="sm" component="div">
                      {faqItems.map((item, idx) => (
                        <Box key={idx} component="section" mt={idx === 0 ? 0 : "lg"}>
                          <Title order={3} size="h3" fw={600} c="dark" mb="xs" className="text-xl">
                            {item.question}
                          </Title>
                          <SectionBody text={item.answer} cleanForServices={isServiceVariant} variant={isServiceVariant ? "service" : "default"} />
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            )}
            {children}
          </>
        )}
        {!isServiceVariant && (
          <>
            {children}
            {!children && body && (
              <Box mt="xl" className="prose prose-zinc max-w-none">
                {textToParagraphs(body).map((paragraph, i) => (
                  <Text key={i} component="p" size="md" c="dark" mt="xs">
                    {paragraph}
                  </Text>
                ))}
              </Box>
            )}
          </>
        )}
        {faqSchema && (page.faqItems?.length ?? page.faq?.length ?? 0) > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: (page.faqItems ?? page.faq ?? []).map(({ question, answer }) => ({
                  "@type": "Question",
                  name: question,
                  acceptedAnswer: { "@type": "Answer", text: answer },
                })),
              }),
            }}
          />
        )}
      </Container>
    </Box>
  );
}
