/**
 * @file Privacy Policy Page
 * @description Standard privacy policy content as supplied — several
 *   sub-sections (Contact forms, Analytics, Your contact information, and
 *   the four under "Additional information") have no body copy yet; they're
 *   rendered as headings only, ready to be filled in.
 */

import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "The Corniche Hotel's privacy policy.",
  alternates: { canonical: "/privacy" },
};

interface Section {
  heading: string;
  level?: "h2" | "h3";
  paragraphs?: string[];
}

const sections: Section[] = [
  {
    heading: "Who we are",
    paragraphs: ["Our website address is: https://www.thecornichehotel.com."],
  },
  {
    heading: "What personal data we collect and why we collect it",
  },
  {
    heading: "Comments",
    level: "h3",
    paragraphs: [
      "When visitors leave comments on the site we collect the data shown in the comments form, and also the visitor’s IP address and browser user agent string to help spam detection.",
      "An anonymized string created from your email address (also called a hash) may be provided to the Gravatar service to see if you are using it. The Gravatar service privacy policy is available here: https://automattic.com/privacy/. After approval of your comment, your profile picture is visible to the public in the context of your comment.",
    ],
  },
  {
    heading: "Media",
    level: "h3",
    paragraphs: [
      "If you upload images to the website, you should avoid uploading images with embedded location data (EXIF GPS) included. Visitors to the website can download and extract any location data from images on the website.",
    ],
  },
  {
    heading: "Contact forms",
    level: "h3",
  },
  {
    heading: "Cookies",
    paragraphs: [
      "If you leave a comment on our site you may opt-in to saving your name, email address and website in cookies. These are for your convenience so that you do not have to fill in your details again when you leave another comment. These cookies will last for one year.",
      "If you visit our login page, we will set a temporary cookie to determine if your browser accepts cookies. This cookie contains no personal data and is discarded when you close your browser.",
      "When you log in, we will also set up several cookies to save your login information and your screen display choices. Login cookies last for two days, and screen options cookies last for a year. If you select \"Remember Me\", your login will persist for two weeks. If you log out of your account, the login cookies will be removed.",
      "If you edit or publish an article, an additional cookie will be saved in your browser. This cookie includes no personal data and simply indicates the post ID of the article you just edited. It expires after 1 day.",
    ],
  },
  {
    heading: "Embedded content from other websites",
    paragraphs: [
      "Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website.",
      "These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content, including tracking your interaction with the embedded content if you have an account and are logged in to that website.",
    ],
  },
  {
    heading: "Analytics",
  },
  {
    heading: "Who we share your data with",
    paragraphs: ["If you request a password reset, your IP address will be included in the reset email."],
  },
  {
    heading: "How long we retain your data",
    paragraphs: [
      "If you leave a comment, the comment and its metadata are retained indefinitely. This is so we can recognize and approve any follow-up comments automatically instead of holding them in a moderation queue.",
      "For users that register on our website (if any), we also store the personal information they provide in their user profile. All users can see, edit, or delete their personal information at any time (except they cannot change their username). Website administrators can also see and edit that information.",
    ],
  },
  {
    heading: "What rights you have over your data",
    paragraphs: [
      "If you have an account on this site, or have left comments, you can request to receive an exported file of the personal data we hold about you, including any data you have provided to us. You can also request that we erase any personal data we hold about you. This does not include any data we are obliged to keep for administrative, legal, or security purposes.",
    ],
  },
  {
    heading: "Where we send your data",
    paragraphs: ["Visitor comments may be checked through an automated spam detection service."],
  },
  {
    heading: "Your contact information",
  },
  {
    heading: "Additional information",
  },
  { heading: "How we protect your data", level: "h3" },
  { heading: "What data breach procedures we have in place", level: "h3" },
  { heading: "What third parties we receive data from", level: "h3" },
  { heading: "What automated decision making and/or profiling we do with user data", level: "h3" },
  { heading: "Industry regulatory disclosure requirements", level: "h3" },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />

      <main className="relative w-full bg-beige pt-24 md:pt-28 pb-16 md:pb-20 flex flex-col items-center">
        {/* Banner */}
        <div className="w-full mb-10 flex flex-col items-center justify-center">
          <div className="w-screen h-[1px] bg-dark/15" />
          <div className="py-8">
            <h1 className="font-[family-name:var(--font-body)] text-3xl md:text-4xl text-dark tracking-[0.25em] uppercase font-light text-center">
              Privacy Policy
            </h1>
          </div>
          <div className="w-screen h-[1px] bg-dark/15" />
        </div>

        <div className="container-luxury max-w-3xl">
          <div className="space-y-8">
            {sections.map((section) =>
              section.level === "h3" ? (
                <div key={section.heading}>
                  <h3 className="text-base font-medium text-dark mb-2">{section.heading}</h3>
                  {section.paragraphs?.map((p, i) => (
                    <p key={i} className="text-sm text-dark-soft/80 font-light leading-relaxed mb-3 last:mb-0">
                      {p}
                    </p>
                  ))}
                </div>
              ) : (
                <div key={section.heading} className="border-t border-border pt-8 first:border-t-0 first:pt-0">
                  <h2 className="heading-3 text-dark mb-3">{section.heading}</h2>
                  {section.paragraphs?.map((p, i) => (
                    <p key={i} className="text-sm text-dark-soft/80 font-light leading-relaxed mb-3 last:mb-0">
                      {p}
                    </p>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
