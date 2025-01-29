
import React from "react"
import { MediaCenter } from "@/components/shared/Hero/MediaCenter"
import HeroWrapper from "@/components/shared/Hero/HeroWrapper"
import StatsWrapper from "@/components/Stats/StatsWrapper"
import ProgramsWrapper from "@/components/shared/program/ProgramsWrapper"
import SafeguardsBannerWrapper from "@/components/shared/banners/SafeguardsBannerWrapper"

export default function Page() {
  return (
    <main className="relative">
      <HeroWrapper />
      <section>
        <StatsWrapper />
      </section>
      <section>
        <ProgramsWrapper />
      </section>
      <section>
        <MediaCenter />
      </section>
      <SafeguardsBannerWrapper />
    </main>
  )
}