This is the website for GHAFRA Nord, built with [Next.js](https://nextjs.org).

## Formspree Setup

The site has two live forms:

- Contact Us
- Membership Registration

Each form can use its own Formspree form ID.

1. Create or log into your Formspree account.
2. Create one Formspree form for contact submissions.
3. Create one Formspree form for membership submissions.
4. Copy each form ID from the Formspree endpoint.

Example:

```text
https://formspree.io/f/xyzabcde
```

The form ID is `xyzabcde`.

Create a `.env.local` file in the project root and add:

```bash
NEXT_PUBLIC_FORMSPREE_CONTACT_FORM_ID=your-contact-form-id
NEXT_PUBLIC_FORMSPREE_MEMBERSHIP_FORM_ID=your-membership-form-id
```

Optional:

- If you want both forms to go to the same Formspree inbox, you can instead set `NEXT_PUBLIC_FORMSPREE_ID` and leave the two specific variables unset.

The current form components prefer the specific IDs first:

- [src/components/contact/ContactForm.tsx](src/components/contact/ContactForm.tsx)
- [src/components/get-involved/MembershipForm.tsx](src/components/get-involved/MembershipForm.tsx)

An example env file is included in [.env.example](.env.example).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
