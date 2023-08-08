This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Switch to '/backend'
```
cd backend
```

Create a python virtual environment
```
python3 -m venv myenv
```

Activate the virtual environment
```
source myenv/bin/activate
```

Install the requirements from requirements.txt
```
pip install -r requirements.txt
```

Open a new tab. Navigate to the '/frontend' directory and install the dependencies from package.json
```
npm install
```
## MongoDB Connection
In MongoDB Compass,
1. Create a new database named 'market'
2. Create a new collection named 'users'

<p align="center">
  <img src="https://github.com/pmorales01/market-plus/assets/103544215/0efba6f7-b1a8-4bbc-b009-08f19a1f1919"/>
</p>

4. Create a new collection named 'sellers'
5. Create a new collection named 'products'
6. Edit the connection string to ```mongodb://localhost:27017``` to use the database locally.

<p align="center">
  <img src="https://github.com/pmorales01/market-plus/assets/103544215/3426d26f-6f5b-4dd5-bb2f-0aa366c20eae"/>
</p>

7. Open a new tab. Run ```mongod``` to run the primary MongoDB daemon process.
   
## Secret Key
To use JWT, a secret key is needed to encode access tokens. 
1. Switch to the '/backend' directory.
2. Create a file named '.env' in the root of the '/backend' folder.
3. Declare a variable SECRET_KEY and assign it a string value (this is the secret key)

```SECRET_KEY='MY_SECRET_KEY'```
   
## Running
Open a new tab. Switch to '/frontend' and run the development server:
```
npm run dev
```

Switch to '/Backend'. If not activated, activate the virtual environment. Run the server.
```
uvicorn main:app --host 0.0.0.0 --port 8000
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
