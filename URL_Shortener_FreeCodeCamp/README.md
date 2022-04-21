# [URL Shortener Microservice](https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/url-shortener-microservice)

This project was a real challenge! This was my first back-end microservice that interacts with a MongoDB database.

## How this URL "shortener" works

The form makes a `POST` request to the `/api/shorturl` endpoint.

For a standard user:
1. Submit your URL.
2. You'll receive a JSON object confirming that your URL was stored.
3. Remember your `short_url` number.
4. Access your shortened URL: inform `short_url` number at `/api/shorturl/SHORT_URL`.

## Database

MongoDB Atlas free tier was used for this project.

## Additional implementations
I've included some error handling that FreeCodeCamp does not require:

- If the user types a invalid number in SHORT_URL parameter, he receives an error response: `{error: 'Invalid URL or URL not provided'}`;
- If the user types a number that is not stored in database, he receives an error response: `{ error: "Short URL not found"}`.
