# Snow Development Group

Partner-facing website foundation for Snow Development Group, a faith-driven multifamily
development startup in Brevard County, Florida.

## Preview locally

Open `index.html` directly in a browser or serve the folder with any static file server.
There is no build step and there are no package dependencies.

## GitHub Pages

The site is ready to publish from the repository root. In GitHub, choose **Settings → Pages**,
select **Deploy from a branch**, and use the repository's primary branch with the root folder.

## Before publication

- Review and, if needed, replace the current illustrative concept renderings after founder review.
- Add verified contact details or connect the inquiry form to an approved endpoint.
- Update all early-stage project language only when facts are formally confirmed.

## Concept imagery map

The page includes five named replacement slots using `data-concept-slot` attributes:

1. `01-community-exterior` — hero exterior and streetscape using `snow-concept-01-exterior-hero.png`.
2. `02-residence-interior` — residence story using `snow-concept-03-residence-interior.png`.
3. `03-community-overview` — development overview using `snow-concept-05-community-overview.png`.
4. `04-pool-amenity` — shared amenity story using `snow-concept-02-pool-amenity.png`.
5. `05-wellness-trail` — stewardship and wellness story using `snow-concept-04-wellness-trail.png`.

The four middle views form a desktop sticky-scroll sequence and repeat as a conventional mobile
image-and-text stack. When replacing one of these renderings, update both matching image references;
the adjacent HTML comments identify each pair. The source files and full prompt manifest remain in
`assets/concepts/`. Custom imagery should retain the visible conceptual-image disclosure until the
project design is established.
