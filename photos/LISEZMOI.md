# Photos de chantier (originaux)

Déposez ici les photos **réelles** des chantiers ARVÉO (JPEG, PNG, HEIC converti, WebP).
Nommez chaque fichier ainsi :

    commune__service__description-courte.jpg

Exemples :

    sete__refection-toiture__tuiles-canal-reposees-sur-ecran.jpg
    frontignan__zinguerie-gouttieres__gouttiere-zinc-neuve.jpg

- `commune` : le nom de la commune en minuscules sans accents (frontignan, sete, balaruc-les-bains…)
- `service` : le slug du service (refection-toiture, recherche-de-fuite, demoussage-toiture,
  zinguerie-gouttieres, charpente, remplacement-tuiles, faitage-rives, fenetre-de-toit,
  isolation-toiture, etancheite-toit-terrasse, bachage-urgence, depannage-toiture)
- `description-courte` : ce qu'on voit, en quelques mots séparés par des tirets

Puis lancez `npm run photos --prefix scripts` et `node scripts/build.mjs`.
Ce dossier n'est jamais mis en ligne (voir .vercelignore) : les originaux peuvent contenir la
position GPS du chantier. Seules les versions WebP nettoyées de img/chantiers/ sont publiées.
