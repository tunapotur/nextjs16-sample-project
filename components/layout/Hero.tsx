import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

export interface HeroContent {
  hero_title: string;
  hero_subtitle?: string;
  hero_caption?: string;
  hero_paragraph1?: string;
  hero_paragraph2?: string;
  hero_paragraph3?: string;
  hero_cta_label?: string;
  hero_cta_url?: string;
}

interface HeroProps {
  content: HeroContent;
}

const Hero = ({ content }: HeroProps) => {
  return (
    <div className="flex border max-w-7xl mx-auto mt-8 bg-mycolor1/80 rounded-4xl text-mycolor2 py-16">
      <div className="mx-auto px-10 py-4 flex flex-col lg:flex-row gap-10">
        <div className="flex-1">
          <div className="rounded-2xl overflow-hidden bg-mycolor2/10 border border-mycolor2/10">
            <Image
              src="/bg.jpg"
              alt="Workspace"
              width={900}
              height={900}
              className="w-full h-145 object-cover"
            />
            <p className="text-center px-4 py-3 text-xs text-mycolor2/60 border-t border-mycolor2/10">
              {content.hero_caption || "Lorem ipsum dolor sit amet."}
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center space-y-6">
          <Image
            src="/meow.jpg"
            alt="Workspace"
            width={80}
            height={80}
            className="rounded-full border border-mycolor2/10"
          />
          <h1 className="text-5xl font-semibold">{content.hero_title}</h1>

          <h2 className="text-xl font-medium text-mycolor2/80">
            {content.hero_subtitle}
          </h2>
          <div className="space-y-4 text-lg text-mycolor2/30 leading-relaxed">
            {content.hero_paragraph1 && <p>{content.hero_paragraph1}</p>}
            {content.hero_paragraph2 && <p>{content.hero_paragraph2}</p>}
            {content.hero_paragraph3 && <p>{content.hero_paragraph3}</p>}
          </div>

          <div>
            {content.hero_cta_label && (
              <Link href={content.hero_cta_url || "/"}>
                <Button variant={"secondary"} size={"lg"}>
                  {content.hero_cta_label}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
