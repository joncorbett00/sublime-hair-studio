/**
 * The foundation's own words, in the site's other languages.
 *
 * Content reaches a section already translated — markdown and records go
 * through the site's locales/ files. Two kinds of words don't:
 *
 *   - params, which are frontmatter. An author gives a param one value per
 *     language as a map — `ctaMobileLabel: { en: Book an appointment, fr:
 *     Prendre rendez-vous }` — and `localizeParams` (the props handler in
 *     main.js) picks the page's language before the component sees it.
 *   - the defaults in each meta.js, and the few words the components write
 *     themselves (button names for screen readers, "today", "No."). Those are
 *     English, and the tables below give them in French.
 *
 * A site in English alone (Bijou) never reaches either table.
 */
import { useWebsite } from '@uniweb/kit'

/** Param defaults per section type, for a param the author left unset. */
const DEFAULTS = {
  fr: {
    Header: { ctaLabel: 'Réserver', skipLabel: 'Aller au contenu' },
    Footer: { hoursLabel: 'Heures', badgeCloseLabel: 'Masquer' },
    Article: { updatedLabel: 'Dernière mise à jour' },
    Brands: { moreLabel: 'En savoir plus' },
    Crew: {
      meetLabel: 'Rencontrer',
      bookLabel: 'Réserver avec',
      favouriteLabel: 'Le meilleur côté du métier',
      worstLabel: 'La pire coupe de sa vie',
      workLabel: 'Son travail',
    },
    Gallery: {
      showAllLabel: 'Voir toutes les réalisations',
      badgeLabel: 'Look',
      allLabel: 'Tout',
      wallLabel: 'Toutes les réalisations · {count} photos',
      emptyText: 'Aucune photo dans cette catégorie pour l’instant.',
      closeLabel: 'Fermer',
    },
    Hero: { captionLabel: 'Look 01' },
    Itinerary: { cardLabel: 'Déroulement' },
    ServiceMenu: {
      highlightLabel: 'Signature',
      featuredLabel: 'Signature',
      bookLabel: 'Réserver',
      enquireLabel: 'Se renseigner',
      allLabel: 'Tout',
      emptyText: 'Rien dans cette catégorie pour l’instant.',
      closeLabel: 'Fermer',
    },
    SplitContent: { captionLabel: 'Fig.' },
    Timeline: { captionLabel: 'Fig.' },
    VideoShelf: { badgeLabel: 'Extrait', closeLabel: 'Fermer' },
    Visit: {
      mapTitle: 'Carte pour se rendre au studio',
      whereLabel: 'Où',
      whenLabel: 'Quand',
      contactLabel: 'Nous joindre',
      directionsLabel: 'Itinéraire',
      todayLabel: 'Aujourd’hui',
    },
  },
}

/** Words the components write themselves, by their English. */
const WORDS = {
  fr: {
    'Main': 'Principal',
    'Toggle menu': 'Ouvrir ou fermer le menu',
    'home': 'accueil',
    'Language': 'Langue',
    'No.': 'N°',
    'Close': 'Fermer',
    'Close review': 'Fermer l’avis',
    'Close the gallery': 'Fermer la galerie',
    'Filter photos by category': 'Filtrer les photos par catégorie',
    'Filter services by category': 'Filtrer les services par catégorie',
    'Previous photo': 'Photo précédente',
    'Next photo': 'Photo suivante',
    'Previous photos': 'Photos précédentes',
    'Next photos': 'Photos suivantes',
    'Previous video': 'Vidéo précédente',
    'Next video': 'Vidéo suivante',
    'Previous videos': 'Vidéos précédentes',
    'Next videos': 'Vidéos suivantes',
    'Open photo:': 'Ouvrir la photo :',
    'Play video:': 'Lire la vidéo :',
    'Photos of': 'Photos de',
    'Read more about': 'En savoir plus sur',
    'Read the full review from': 'Lire l’avis complet de',
    'out of 5 stars': 'sur 5 étoiles',
    'Recent work': 'Réalisations récentes',
    'Videos': 'Vidéos',
  },
}

/** Whether an hours line says the day is closed — "Closed", "Fermé". */
export const isClosed = (text = '') => /closed|fermé/i.test(String(text))

/** The language the page is shown in — "en", "fr". */
export function langOf(website) {
  return website?.getActiveLocale?.() || website?.getDefaultLocale?.() || 'en'
}

/** The locale for Intl formatting: dates, prices, weekdays. */
export function intlLocale(website) {
  return `${langOf(website)}-CA`
}

/** One of the component's own words, in the page's language. */
export function say(website, english) {
  return WORDS[langOf(website)]?.[english] ?? english
}

/** A map of language codes ({ en, fr }) rather than a value. */
function isLanguageMap(value, codes) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const keys = Object.keys(value)
  return keys.length > 0 && keys.every((k) => codes.has(k))
}

/**
 * The props handler: each param in the page's language. A param written as a
 * language map takes the page's language, else the site's default one. In a
 * language other than English, a param the author didn't write takes the
 * French default above in place of meta.js's English one.
 */
export function localizeParams(content, params, block) {
  const website = block?.website
  if (!website) return null
  const lang = langOf(website)
  const fallback = website.getDefaultLocale?.() || 'en'
  const codes = new Set([...(website.getLocales?.() || []).map((l) => l.code), lang, fallback])
  const authored = block.properties || {}
  const defaults = DEFAULTS[lang]?.[block.type] || {}

  let changed = false
  const out = { ...params }
  for (const [key, value] of Object.entries(params)) {
    if (isLanguageMap(value, codes)) {
      out[key] = value[lang] ?? value[fallback] ?? ''
      changed = true
    } else if (!(key in authored) && key in defaults) {
      out[key] = defaults[key]
      changed = true
    }
  }
  return changed ? { content, params: out } : null
}

/** `say`, bound to the page being shown — for components with no block in hand. */
export function useSay() {
  const { website } = useWebsite()
  return (english) => say(website, english)
}
