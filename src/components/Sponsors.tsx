import React from 'react';
import { palette } from "@/lib/palette";
import { useTranslation } from "@/utils/useTranslation";

interface Sponsor {
  id: number;
  name: string;
  website: string;
  logo: string;
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
  const sponsors = {
    all: [
      { 
        id: 1, 
        name: "The Grand Resort and Residences", 
        website: "https://grandresortandresidencesbz.com/",
        logo: "grand_resort.png"
      },
      { 
        id: 2, 
        name: "Oceana Belize", 
        website: "https://belize.oceana.org/",
        logo: "oceana.png"
      },
      { 
        id: 3, 
        name: "Marie Sharp's", 
        website: "https://www.mariesharps.bz/",
        logo: "marie_sharp.jpeg"
      },
      { 
        id: 4, 
        name: "Travellers Liquors Belize", 
        website: "https://www.onebarrelrum.com/home",
        logo: "travellers.png"
      }
    ]
  };

  const { t } = useTranslation();

  const SponsorCard: React.FC<SponsorCardProps> = ({ sponsor, size }) => {
    // Define consistent card dimensions
    const cardDimensions = {
      large: { width: '220px', height: '260px', logoHeight: '150px' },
      medium: { width: '180px', height: '220px', logoHeight: '120px' },
      small: { width: '150px', height: '180px', logoHeight: '100px' },
      'extra-small': { width: '120px', height: '150px', logoHeight: '80px' },
    }[size];

    return (
      <a
        href={sponsor.website}
        target="_blank"
        rel="noopener noreferrer"
        className="group block transition-all duration-300 hover:scale-105"
        style={{ width: cardDimensions.width }}
      >
        <div
          className="rounded-2xl p-4 flex flex-col items-center justify-between border backdrop-blur-sm transition-all duration-300 group-hover:shadow-lg"
          style={{
            height: cardDimensions.height,
            backgroundColor: palette.cardBg,
            borderColor: palette.cardBorder,
            boxShadow: palette.cardShadow,
          }}
        >
          <div
            className="flex items-center justify-center w-full rounded-xl overflow-hidden mb-3 transition-all duration-300"
            style={{
              backgroundColor: palette.hobbyBg,
              height: cardDimensions.logoHeight,
            }}
          >
            <img
              src={sponsor.logo}
              alt={sponsor.name}
              className="object-contain h-full w-auto opacity-80 group-hover:opacity-100 transition-opacity duration-300"
            />
          </div>
          <h3
            className="text-center font-semibold text-sm transition-colors duration-300 line-clamp-2 leading-tight"
            style={{ color: palette.text, minHeight: '2.5em' }}
          >
            {sponsor.name}
          </h3>
        </div>
      </a>
    );
  };

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
      <div className="grid gap-8 justify-items-center grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 max-w-7xl mx-auto">
        {sponsors.map((sponsor) => (
          <SponsorCard key={sponsor.id} sponsor={sponsor} size={size} />
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
