# breezevents (Events Platform Frontend)

## Hosted Version
If you would like to try out the hosted version, click [here](https://breezevents.netlify.app/)!

### Log in Details
If you would like to use the site's host features, log in with the following details:
- Email: testadmin@gmail.com || Password: ABC123
If you would like to use the site's attendee features, log in with the following details:
- Email: testuser@gmail.com || Password: ABC123
* Please note, these accounts have been created through the Supabase dashboard and are not legitimate email addresses.

## Project Summary
breezevents is an event ticketing platform using the below API.  

Events can be filtered by sub-topic (e.g. 'AI', 'Startup', 'Networking'), as well as by whether the event is online or free to attend. Events can then be sorted by price, event date or the date the event was added to the site.

Tickets booked (and confirmed by a Stripe webhook) are added to a user's profile.

Only an admin is able to upload events, which they can save as a draft or publish immediately; and later amend if necessary.  

Utilising React's component-based architecture and efficient rendering, this project illustrates CRUD functionality from a frontend perspective, alongside user authentication (Supabase), payment processing (Stripe) and calendar (Google Calendar) integrations.

Additionally, this project incorporates the handling of state, context, routing and error handling.

## The API
Find my API repo [here](https://github.com/scottgirling/breezevents-backend) or the hosted API [here](https://events-platform-be-1fmx.onrender.com/api).

Cross Origin Resource Sharing (CORS) has been enabled to allow requests to be made to the server from a different domain.

## If you wish to run the project locally

### Cloning the repository:

1) Copy the repository's URL and open the command line.
2) Change the current working directory to the desired location for the cloned repository.
3) Clone the repository by running the 'git clone' command, pasting the previously copied URL and press Enter.
4) Open to repository in a text editor.

### Installing dependencies:

1) Navigate to your project directory in the terminal.
2) Run the command 'npm install' which will read the 'package.json' file and download the listed dependencies.

### Viewing the project locally:

1) Run the script 'npm run dev'. This will start the development server enabling features like live-reloading.
2) In the terminal you should see something like - Local: http://localhost:5173/. Click on this link to view the project locally.

#### Minimum versions to ensure functionality:

- Node.js: v22.9.0