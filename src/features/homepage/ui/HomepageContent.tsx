import Link from "next/link";
import type {
  BilingualText,
  HomepageSampleData,
  LearningWorldCardData,
  MissionPreviewData,
} from "../data";
import { comingSoonLabel } from "../data";

function BilingualLabel({ text }: { readonly text: BilingualText }) {
  return (
    <>
      <span lang="en">{text.english}</span>
      <span aria-hidden="true" className="chispitas-label-divider"> · </span>
      <span lang="es">{text.spanish}</span>
    </>
  );
}

function ComingSoon() {
  return (
    <span className="chispitas-coming-soon">
      <span lang="en">{comingSoonLabel.english}</span>
      <span aria-hidden="true"> · </span>
      <span lang="es">{comingSoonLabel.spanish}</span>
    </span>
  );
}

function AvatarPreview() {
  return (
    <div
      aria-label="A smiling explorer avatar in a colourful magical landscape"
      className="chispitas-hero-scene"
      role="img"
    >
      <span aria-hidden="true" className="chispitas-sparkle chispitas-sparkle-one">✦</span>
      <span aria-hidden="true" className="chispitas-sparkle chispitas-sparkle-two">✧</span>
      <span aria-hidden="true" className="chispitas-sun">☀</span>
      <span aria-hidden="true" className="chispitas-cloud chispitas-cloud-one" />
      <span aria-hidden="true" className="chispitas-cloud chispitas-cloud-two" />
      <span aria-hidden="true" className="chispitas-hill chispitas-hill-back" />
      <span aria-hidden="true" className="chispitas-hill chispitas-hill-front" />
      <span aria-hidden="true" className="chispitas-avatar">
        <span className="chispitas-hair" />
        <span className="chispitas-face">☺</span>
        <span className="chispitas-shirt" />
      </span>
      <span aria-hidden="true" className="chispitas-scene-caption">
        <span lang="en">Your adventure starts here!</span>
        <span lang="es">¡Tu aventura empieza aquí!</span>
      </span>
    </div>
  );
}

function WelcomeHero({ data }: { readonly data: HomepageSampleData }) {
  return (
    <section aria-labelledby="welcome-title" className="chispitas-welcome">
      <div className="chispitas-welcome-copy">
        <p className="chispitas-eyebrow">
          <span lang="en">A little wonder is waiting</span>
          <span aria-hidden="true"> · </span>
          <span lang="es">Una sorpresa te espera</span>
        </p>
        <h1 id="welcome-title">
          <span lang="en">{data.welcome.title.english}</span>
          <span lang="es">{data.welcome.title.spanish}</span>
        </h1>
        <p className="chispitas-welcome-subtitle">
          <span lang="en">{data.welcome.subtitle.english}</span>
          <span lang="es">{data.welcome.subtitle.spanish}</span>
        </p>
        <p
          aria-label={`Sample star balance: ${data.sampleStarBalance} stars`}
          className="chispitas-sample-stars"
        >
          <span aria-hidden="true">⭐</span>
          <span lang="en">{data.sampleStarBalance} Stars</span>
          <span aria-hidden="true" className="chispitas-star-divider">/</span>
          <span lang="es">{data.sampleStarBalance} estrellas</span>
        </p>
      </div>
      <AvatarPreview />
    </section>
  );
}

function LearningWorldCard({ data }: { readonly data: LearningWorldCardData }) {
  return (
    <article className="chispitas-world-card" data-world={data.id}>
      <div aria-hidden="true" className="chispitas-world-art">
        <span>{data.icon}</span>
        <i>✦</i>
        <b>✧</b>
      </div>
      <div className="chispitas-world-copy">
        <h3><BilingualLabel text={data.title} /></h3>
        <p className="chispitas-world-description" lang="en">{data.description}</p>
        {data.destination.status === "available" ? (
          <Link className="chispitas-world-action" href={data.destination.href} prefetch={false}>
            <BilingualLabel text={data.action} /> <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <div className="chispitas-world-unavailable">
            <span className="chispitas-unavailable-action">
              <BilingualLabel text={data.action} />
            </span>
            <ComingSoon />
          </div>
        )}
      </div>
    </article>
  );
}

function MissionCard({ data }: { readonly data: MissionPreviewData }) {
  const progressLabel = `${data.title.english}: ${data.progress.current} of ${data.progress.total}`;
  return (
    <article className="chispitas-mission-card">
      <div aria-hidden="true" className="chispitas-mission-icon">{data.icon}</div>
      <div className="chispitas-mission-content">
        <p className="chispitas-mission-category"><BilingualLabel text={data.category} /></p>
        <h3><BilingualLabel text={data.title} /></h3>
        <p className="chispitas-mission-reward">
          <span lang="en">Reward</span><span aria-hidden="true"> · </span><span lang="es">Premio</span>
          <strong>+{data.reward} <span aria-hidden="true">⭐</span></strong>
        </p>
        <progress
          aria-label={progressLabel}
          aria-valuetext={`${data.progress.current} of ${data.progress.total}`}
          className="chispitas-mission-progress"
          max={data.progress.total}
          value={data.progress.current}
        />
        <p className="chispitas-progress-text">
          <span lang="en">Progress</span><span aria-hidden="true"> · </span><span lang="es">Progreso</span>
          <strong>{data.progress.current} / {data.progress.total}</strong>
        </p>
        <ComingSoon />
      </div>
    </article>
  );
}

export function HomepageContent({ data }: { readonly data: HomepageSampleData }) {
  const progressPercentage = (data.starProgress.current / data.starProgress.target) * 100;
  return (
    <div className="chispitas-homepage">
      <WelcomeHero data={data} />

      <section aria-labelledby="worlds-title" className="chispitas-section">
        <div className="chispitas-section-heading">
          <p className="chispitas-eyebrow">
            <span lang="en">Choose your path</span><span aria-hidden="true"> · </span><span lang="es">Elige tu camino</span>
          </p>
          <h2 id="worlds-title"><span lang="en">Explore the Worlds</span><span aria-hidden="true"> · </span><span lang="es">Explora los mundos</span></h2>
        </div>
        <div className="chispitas-world-grid">
          {data.worlds.map((world) => <LearningWorldCard data={world} key={world.id} />)}
        </div>
      </section>

      <section aria-labelledby="missions-title" className="chispitas-section">
        <div className="chispitas-section-heading-with-note">
          <div className="chispitas-section-heading">
            <p className="chispitas-eyebrow">
              <span lang="en">Little steps, big discoveries</span><span aria-hidden="true"> · </span><span lang="es">Pequeños pasos, grandes descubrimientos</span>
            </p>
            <h2 id="missions-title"><span lang="en">Today’s Missions</span><span aria-hidden="true"> · </span><span lang="es">Misiones de hoy</span></h2>
          </div>
          <span className="chispitas-sample-note">SAMPLE · EJEMPLO</span>
        </div>
        <div className="chispitas-mission-grid">
          {data.missions.map((mission) => <MissionCard data={mission} key={mission.id} />)}
        </div>
      </section>

      <div className="chispitas-lower-grid">
        <section aria-labelledby="star-title" className="chispitas-panel">
          <div className="chispitas-section-heading">
            <p className="chispitas-eyebrow"><span lang="en">Keep sparkling</span><span aria-hidden="true"> · </span><span lang="es">Sigue brillando</span></p>
            <h2 id="star-title"><span lang="en">My Star Collection</span><span aria-hidden="true"> · </span><span lang="es">Mi colección de estrellas</span></h2>
          </div>
          <div className="chispitas-star-balance">
            <span aria-hidden="true" className="chispitas-big-star">⭐</span>
            <div>
              <strong>{data.starProgress.current} / {data.starProgress.target} <span lang="en">Stars</span></strong>
            </div>
          </div>
          <div
            aria-label={`Star collection: ${data.starProgress.current} of ${data.starProgress.target} stars`}
            aria-valuemax={data.starProgress.target}
            aria-valuemin={0}
            aria-valuenow={data.starProgress.current}
            className="chispitas-star-progress"
            role="progressbar"
          >
            <span style={{ width: `${progressPercentage}%` }} />
          </div>
          <p className="chispitas-remaining-text">
            <span lang="en">{data.starProgress.remaining} more stars to unlock a surprise!</span>
            <span lang="es">¡{data.starProgress.remaining} estrellas más para desbloquear una sorpresa!</span>
          </p>
          <p className="chispitas-sample-footnote">SAMPLE DISPLAY · VISTA DE EJEMPLO</p>
        </section>

        <section aria-labelledby="collection-title" className="chispitas-panel">
          <div className="chispitas-section-heading">
            <p className="chispitas-eyebrow"><span lang="en">Your treasures</span><span aria-hidden="true"> · </span><span lang="es">Tus tesoros</span></p>
            <h2 id="collection-title"><span lang="en">My Collection</span><span aria-hidden="true"> · </span><span lang="es">Mi colección</span></h2>
          </div>
          <div className="chispitas-collection-grid">
            {data.collection.map((item) => (
              <div className="chispitas-collection-item" key={item.id}>
                <span aria-hidden="true">{item.icon}</span>
                <strong lang="en">{item.label.english}</strong>
                <small lang="es">{item.label.spanish}</small>
              </div>
            ))}
          </div>
          <p className="chispitas-sample-footnote">SAMPLE PREVIEW · VISTA DE EJEMPLO</p>
        </section>
      </div>
    </div>
  );
}
