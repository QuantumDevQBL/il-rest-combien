import { LegalLayout } from '../components/LegalLayout'

function TODO({ children }: { children: string }) {
  return (
    <span className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-sm text-amber-800">
      [{children}]
    </span>
  )
}

export default function MentionsLegales() {
  return (
    <LegalLayout title="Mentions légales" updatedAt="6 septembre 2026">
      <section>
        <h2 className="text-lg font-bold text-slate-900">Éditeur</h2>
        <p>
          Ce site et l'application mobile « Il reste combien ? » sont édités par Quentin
          Balohé-Lacourrège, exerçant sous le nom commercial QuantumDev, entrepreneur individuel
          (micro-entreprise).
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>SIRET : 853 750 198 00022</li>
          <li>Adresse : 97 rue Deslandes, 37000 Tours, France</li>
          <li>
            Email de contact :{' '}
            <a href="mailto:contact@quantumdev.fr" className="font-semibold text-emerald-700 hover:text-emerald-800">
              contact@quantumdev.fr
            </a>
          </li>
          <li>Régime : franchise en base de TVA, article 293 B du Code général des impôts — TVA non applicable</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900">Directeur de la publication</h2>
        <p>Quentin Balohé-Lacourrège.</p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900">Hébergement du site</h2>
        <p>
          <TODO>nom et adresse de l'hébergeur à compléter</TODO>
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900">Distribution de l'application</h2>
        <p>
          L'application mobile « Il reste combien ? » est distribuée via l'App Store (Apple Inc.)
          et Google Play (Google LLC). Son fonctionnement ne nécessite pas de serveur applicatif :
          les données que vous saisissez restent stockées sur votre appareil (voir notre{' '}
          <a href="/confidentialite" className="font-semibold text-emerald-700 hover:text-emerald-800">
            politique de confidentialité
          </a>
          ).
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900">Propriété intellectuelle</h2>
        <p>
          Le contenu de ce site et de l'application (textes, visuels, code) est la propriété de
          QuantumDev, sauf mention contraire. Toute reproduction sans autorisation préalable est
          interdite.
        </p>
      </section>
    </LegalLayout>
  )
}
