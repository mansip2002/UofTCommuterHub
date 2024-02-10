# UofT Commuter Hub

## Test live on production

**Frontend**: https://uoft-commuter-hub.ambitioussmoke-155a24e2.eastus.azurecontainerapps.io \
**Backend**: https://maryam-capstone-backend.niceground-7634a6f1.eastus.azurecontainerapps.io

## How to run the app

Before you can run the app, you need to create a .env.pass file in the root project directory with the correct password. This will allow the env.enc file to be decrypted and used by the server. Get the password from a teammate. **Make sure that there are no extra spaces or linebreaks in the password file as this will break the decryption**.

Before you can run the app, you need to install necessary dependancies. In the project directory, you can run:

### `npm install`

This will install Python dependencies and Node dependencies. If for some reason the Python dependencies were not correctly installed, you can run `pip install -r ./api/requirements.txt` manually.

You only need to do the install when new dependencies are added or the first time you run the app. Next, to run the app:

### `npm run dev`

This will:

1. Decrypt the encrypted .env.enc environment file into .env using the password in .env.pass
2. Run the Python server
3. Run the React app

If this doesn't work for whatever reason, you can try running these parts separately:

1. Decrypt: `npm run decrypt` (only when new variables are added)
2. Python: `python ./api/app.py`
3. React: `npm start`

## How to update environment variables locally

1. Stop the app
2. Update the `.env` file
3. Run `npm run encrypt` in the root directory

This will only work if you've already run `npm install` in the root directory.
