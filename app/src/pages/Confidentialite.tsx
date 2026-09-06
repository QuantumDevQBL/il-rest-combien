import { LegalLayout } from '../components/LegalLayout'

function TODO({ children }: { children: string }) {
  return (
    <span className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-sm text-amber-800">
      [{children}]
    </span>
  )
}

export default function Confidentialite() {
  return (
    <LegalLayout title="Politique de confidentialité" updatedAt="6 septembre 2026">
      <section>
        <h2 className="text-lg font-bold text-slate-900">1. Qui traite vos données</h2>
        <p>
          Quentin Balohé-Lacourrège, exerçant sous le nom commercial QuantumDev (entrepreneur
          individuel, Tours, France), est responsable du traitement des données décrites
          ci-dessous pour ce site et l'application mobile « Il reste combien ? ». Pour toute
          question, contactez <TODO>email de contact à compléter</TODO>.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900">
          2. Vos données financières restent sur votre appareil
        </h2>
        <p>
          Le chiffre d'affaires, les charges fixes, les objectifs et l'historique mensuel que vous
          saisissez dans l'application sont stockés <strong>uniquement sur votre téléphone</strong>{' '}
          (stockage local). Ils ne sont jamais transmis à nos serveurs ni à un tiers : nous n'y
          avons techniquement pas accès.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900">3. Données d'usage anonymes (PostHog)</h2>
        <p>
          Pour comprendre l'usage de l'application et l'améliorer, nous collectons, via PostHog
          (sous-traitant analytics), des événements d'usage anonymes : ouverture de l'app,
          simulation effectuée, écran consulté, affichage de l'offre Pilotage, etc. Ces événements
          ne contiennent <strong>aucun montant</strong>, aucune donnée financière saisie, et aucune
          information permettant de vous identifier directement — uniquement le nom de
          l'événement, la plateforme (iOS/Android) et la version de l'application.
        </p>
        <p>
          Cette collecte n'est active que si l'application est configurée avec une clé PostHog ;
          sans clé, aucun événement n'est envoyé.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900">
          4. Abonnements (RevenueCat, App Store, Google Play)
        </h2>
        <p>
          Si vous souscrivez à l'offre Pilotage, l'achat est traité par Apple (App Store) ou
          Google (Google Play) selon votre plateforme, et le statut de votre abonnement est géré
          via RevenueCat (sous-traitant). RevenueCat reçoit un identifiant anonyme d'abonné et les
          informations nécessaires à la validation de l'achat (reçu, statut, plateforme). Nous
          n'avons pas accès à vos coordonnées bancaires : elles sont gérées exclusivement par
          Apple ou Google.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900">5. Finalités et base légale</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Fourniture du service (calcul, suivi, abonnement) : exécution du contrat</li>
          <li>Amélioration de l'application (analytics) : intérêt légitime</li>
          <li>Facturation des abonnements : obligation légale / exécution du contrat</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900">6. Durée de conservation</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Données financières locales : conservées sur votre appareil jusqu'à suppression de
            l'application ou de vos données par vos soins.
          </li>
          <li>Événements d'usage PostHog : conservés 24 mois maximum, puis supprimés.</li>
          <li>
            Données d'abonnement RevenueCat : conservées pendant la durée de l'abonnement et la
            durée légale de conservation des données de facturation.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900">7. Vos droits</h2>
        <p>
          Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement,
          de limitation, d'opposition et de portabilité de vos données. Pour l'exercer, contactez{' '}
          <TODO>email de contact à compléter</TODO>. Vous pouvez également introduire une
          réclamation auprès de la CNIL (
          <a href="https://www.cnil.fr" className="font-semibold text-emerald-700 hover:text-emerald-800">
            cnil.fr
          </a>
          ).
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900">8. Sécurité</h2>
        <p>
          Vos données financières ne quittant pas votre appareil, leur sécurité dépend
          principalement de la sécurité de votre téléphone. Les échanges avec nos sous-traitants
          (PostHog, RevenueCat) sont chiffrés (HTTPS/TLS).
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900">9. Sous-traitants</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>PostHog</strong> — analytics produit : événements d'usage anonymes.</li>
          <li><strong>RevenueCat</strong> — gestion des abonnements : identifiant anonyme, statut d'abonnement.</li>
          <li>
            <strong>Apple (App Store) / Google (Google Play)</strong> — distribution, paiement :
            selon leurs propres politiques de confidentialité.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900">10. Modifications</h2>
        <p>
          Cette politique peut être mise à jour ; la date de dernière modification est indiquée en
          haut de page. En cas de changement substantiel, nous vous en informerons via
          l'application.
        </p>
      </section>
    </LegalLayout>
  )
}
