# FashionStore: React E-Commerce demo

A small online-store front end built with React and Vite while training at DEPI. Visitors can create an account, browse products and brands, search, fill a cart, and go through a checkout that hands payment to a hosted card page.

**Live demo:** https://react-ecommerce-app-sigma.vercel.app/

> This is a practice project. Products, accounts and orders come from the public [Route e-commerce practice API](https://ecommerce.routemisr.com), shared with other learners, and no real orders are placed.

## Features

- Sign up and log in (JWT stored in `localStorage`), with form validation using Formik and Yup
- Protected routes: cart, orders, brands and checkout redirect to the login page when signed out, including right after logging out
- Product list with search from the navbar, and a product details page
- Shopping cart: add items, change quantities, remove items, with a live item count in the navbar
- Checkout form with validation; payment continues on a hosted card page, then returns to "My Orders"
- Orders page showing the signed-in user's real orders (status, items, address) with search, filter and sort
- Brands page that loads every page of brands, with letter filter, search and a details dialog
- Loading and error states with a Try again button on every screen that calls the API
- Routes load on demand (code splitting) and the layout is responsive

## Built with

React 19, Vite, React Router, Axios, Formik and Yup, Bootstrap 5, React Hot Toast and Swiper. State is shared through the React Context API.

## Project structure

```
src/
  components/   one folder per screen (component + CSS module)
  Context/      userContext (login state) and cartContext (cart API + badge count)
  utils/auth.js token, user id and error-message helpers used by every API call
```

## Run locally

```bash
git clone https://github.com/medokalel/react-ecommerce-app.git
cd react-ecommerce-app
npm install
npm run dev
```

Other scripts: `npm run build`, `npm run preview`, `npm run lint`.

No environment variables are needed: the API is public and has no key.

## Deploy

The repository includes a `vercel.json` rewrite so deep links such as `/cart` and the payment return page `/allorders` work on Vercel. On Netlify, `public/_redirects` does the same job.

## Things I would improve next

- Product pagination and category filters (the API supports both)
- Tests for the cart and checkout logic
- TypeScript, which I started using after this project

## Author

Mohamed Khalil · [GitHub](https://github.com/medokalel) · [LinkedIn](https://www.linkedin.com/in/mohamed-khalel1/)
