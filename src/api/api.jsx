const BASE_URL = import.meta.env.VITE_API_URL+'/api' ?? "http://localhost:8000/api";

async function request(method, path, body = undefined, withAuth = true) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (withAuth) {
    const token = localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}/${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error?.error ?? error?.detail ?? "Erreur serveur");
  }

  // 204 No Content
  if (res.status === 204) return null;

  return res.json();
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────

export const authApi = {
  /**
   * Inscription d'un nouveau client.
   * Crée automatiquement un panier vide côté backend.
   * @param {{ nom, email, mot_de_passe, adresse_livraison?, telephone? }} data
   */
  register: (data) => request("POST", "auth/register/", data, false),

  /**
   * Connexion client ou admin.
   * Retourne { token, user_id, role }
   * @param {{ email, mot_de_passe }} data
   */
  login: (data) => request("POST", "auth/login/", data, false),
};

// ─── CATÉGORIES ───────────────────────────────────────────────────────────────

export const categorieApi = {
  /** Liste toutes les catégories (public). */
  lister: () => request("GET", "categories/", undefined, false),

  /** Détail d'une catégorie (public). */
  detail: (id) => request("GET", `categories/${id}/`, undefined, false),

  /** Créer une catégorie (admin). */
  creer: (data) => request("POST", "categories/", data),

  /** Modifier une catégorie (admin). */
  modifier: (id, data) => request("PUT", `categories/${id}/`, data),

  /** Supprimer une catégorie (admin). */
  supprimer: (id) => request("DELETE", `categories/${id}/`),
};

// ─── PRODUITS ─────────────────────────────────────────────────────────────────

export const produitApi = {
  /** Liste tous les produits (public). */
  lister: () => request("GET", "produits/", undefined, false),

  /** Détail d'un produit (public). */
  detail: (id) => request("GET", `produits/${id}/`, undefined, false),

  /** Créer un produit (admin). */
  creer: (data) => request("POST", "produits/", data),

  /** Modifier un produit (admin). */
  modifier: (id, data) => request("PUT", `produits/${id}/`, data),

  /** Supprimer un produit (admin). */
  supprimer: (id) => request("DELETE", `produits/${id}/`),
};

// ─── PANIER ───────────────────────────────────────────────────────────────────

export const panierApi = {
  /** Afficher le panier du client connecté. */
  afficher: () => request("GET", "panier/"),

  /**
   * Ajouter un produit au panier.
   * @param {string} produit_id
   * @param {number} quantite
   */
  ajouter: (produit_id, quantite = 1) =>
    request("POST", "panier/ajouter/", { produit_id, quantite }),

  /**
   * Supprimer une ligne du panier.
   * @param {string} ligne_id
   */
  supprimerLigne: (ligne_id) =>
    request("DELETE", `panier/supprimer/${ligne_id}/`),

  /** Vider entièrement le panier. */
  vider: () => request("POST", "panier/vider/"),
};

// ─── COMMANDES ────────────────────────────────────────────────────────────────

export const commandeApi = {
  /**
   * Lister les commandes.
   * Client → ses propres commandes. Admin → toutes les commandes.
   */
  lister: () => request("GET", "commandes/"),

  /** Détail d'une commande. */
  detail: (id) => request("GET", `commandes/${id}/`),

  /**
   * Passer une commande à partir du panier courant.
   * Vide le panier et décrémente les stocks automatiquement.
   * @param {string} adresse_livraison
   */
  passer: (adresse_livraison) =>
    request("POST", "commandes/", { adresse_livraison }),

  /**
   * Modifier le statut d'une commande (admin).
   * Statuts possibles : "en_attente" | "confirmee" | "en_livraison" | "livree" | "annulee"
   */
  modifierStatut: (id, statut) =>
    request("PUT", `commandes/${id}/`, { statut }),

  /** Annuler une commande (client, seulement si en_attente ou confirmee). */
  annuler: (id) => request("POST", `commandes/${id}/annuler/`),
};

// ─── PAIEMENTS ────────────────────────────────────────────────────────────────

export const paiementApi = {
  /**
   * Effectuer un paiement pour une commande (client).
   * Modes possibles : "mobile_money" | "carte" | "especes"
   * @param {string} commande_id
   * @param {string} mode_paiement
   */
  effectuer: (commande_id, mode_paiement) =>
    request("POST", "paiements/", { commande_id, mode_paiement }),

  /** Valider un paiement (admin). */
  valider: (id) => request("POST", `paiements/${id}/valider/`),
};

// ─── LIVRAISON ────────────────────────────────────────────────────────────────

export const livraisonApi = {
  /** Afficher la livraison liée à une commande. */
  detail: (commande_id) => request("GET", `livraisons/${commande_id}/`),

  /**
   * Mettre à jour numéro de colis / date de livraison (admin).
   * @param {string} commande_id
   * @param {{ numero_colis?, date_livraison?, adresse_livraison? }} data
   */
  mettreAJour: (commande_id, data) =>
    request("PUT", `livraisons/${commande_id}/`, data),
};