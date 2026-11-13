# Star Pages Publishing

Catalogue prices: ₹99 for each paperback and ₹99 for each eBook. Checkout lets customers select the edition; Netlify validates the edition and price server-side.

## Deploy
1. Upload the contents of this folder to a GitHub repository.
2. Import the repository in Netlify; publish directory `.` and build command blank.
3. Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` as Netlify environment variables.
4. Test in Razorpay test mode before using live credentials.

## Before public launch
This starter creates Razorpay orders and verifies payment signatures, but does not persist orders, send receipts, deliver eBooks, manage shipping, or automate paperback fulfilment. Add secure order storage and fulfilment workflows first. Add actual cover images and confirm descriptions, shipping charges, delivery, refund, privacy and terms policies. Never put the Razorpay secret in frontend files.
