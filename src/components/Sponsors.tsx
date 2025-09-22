import React from 'react';
import { palette } from "@/lib/palette";
import { useTranslation } from "@/utils/useTranslation";

interface Sponsor {
  id: number;
  name: string;
  website: string;
}

interface SponsorCardProps {
  sponsor: Sponsor;
  size: 'large' | 'medium' | 'small' | 'extra-small';
}

interface SponsorTierProps {
  title: string;
  sponsors: Sponsor[];
  size: 'large' | 'medium' | 'small' | 'extra-small';
  titleColor: string;
}

const SponsorsComponent: React.FC = () => {
  // Mock sponsor data - you can replace this with real data
  const sponsors = {
    all: [
      { id: 1, name: "Major Tech Corp", website: "https://example.com" },
      { id: 2, name: "Innovation Partners", website: "https://example.com" },
      { id: 3, name: "Digital Solutions Inc", website: "https://example.com" },
      { id: 4, name: "Future Systems", website: "https://example.com" },
      { id: 5, name: "Global Enterprises", website: "https://example.com" },
      { id: 6, name: "Tech Pioneers", website: "https://example.com" },
      { id: 7, name: "Smart Industries", website: "https://example.com" },
      { id: 8, name: "Next Gen Labs", website: "https://example.com" },
      { id: 9, name: "Cloud Dynamics", website: "https://example.com" },
      { id: 10, name: "Data Insights Co", website: "https://example.com" },
      { id: 11, name: "AI Innovations", website: "https://example.com" },
      { id: 12, name: "Cyber Security Plus", website: "https://example.com" }
    ]
  };

  const { t } = useTranslation();

  const SponsorCard: React.FC<SponsorCardProps> = ({ sponsor, size }) => (
    <a
      href={sponsor.website}
      target="_blank"
      rel="noopener noreferrer"
      className="group block transition-all duration-300 hover:scale-105"
    >
      <div
        className="rounded-2xl p-6 transition-all duration-300 group-hover:shadow-lg border backdrop-blur-sm"
        style={{
          backgroundColor: palette.cardBg,
          borderColor: palette.cardBorder,
          boxShadow: palette.cardShadow
        }}
      >
        <div
          className="flex items-center justify-center rounded-xl mb-4 transition-colors duration-300"
          style={{
            backgroundColor: palette.hobbyBg,
            height: size === 'large' ? '120px' : size === 'medium' ? '100px' : size === 'small' ? '80px' : '60px'
          }}
        >
          {/* Placeholder for sponsor logo */}
          <div
            className="text-center opacity-60 transition-opacity duration-300 group-hover:opacity-80"
            style={{ color: palette.hobbyText }}
          >
            <div className="text-2xl mb-2">🏢</div>
            <div className="text-xs font-medium">Logo</div>
          </div>
        </div>
        <h3
          className="text-center font-semibold text-sm transition-colors duration-300"
          style={{ color: palette.text }}
        >
          {sponsor.name}
        </h3>
      </div>
    </a>
  );

  const SponsorTier: React.FC<SponsorTierProps> = ({ title, sponsors, size, titleColor }) => (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2
          className="text-3xl font-bold mb-2 transition-colors duration-300"
          style={{ color: titleColor }}
        >
          {title}
        </h2>
        <div
          className="w-24 h-1 mx-auto rounded-full"
          style={{ backgroundColor: titleColor }}
        />
      </div>
      <div className="grid gap-6 justify-items-center grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 max-w-7xl mx-auto">
        {sponsors.map((sponsor) => (
          <SponsorCard key={sponsor.id} sponsor={sponsor} size="medium" />
        ))}
      </div>
    </div>
  );

  return (
    <section
      className="py-20 px-4"
      style={{ backgroundColor: palette.background }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Main Title */}
        <div className="text-center mb-16">
          <h1
            className="text-5xl font-bold mb-4 transition-colors duration-300"
            style={{ color: palette.primary }}
          >
            {t('ourSponsors')}
          </h1>
          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: palette.textSecondary }}
          >
            {t('sponsorDesc')}
          </p>
        </div>

        {/* All Sponsors in One Grid */}
        <SponsorTier
          title={t('eventSponsors')}
          sponsors={sponsors.all}
          size="medium"
          titleColor={palette.primary}
        />
      </div>
    </section>
  );
};

export default SponsorsComponent;