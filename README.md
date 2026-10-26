# CPTS_428-Group-Project
Group Project for CPTS 428 Fall 2026.

# Agent Trap
Ingrid Llorente
Jackson Pickett
JD Faber

## Harness Commands
- From `backend/`:
    - run `npm install` for dependencies
    - run `npm start` to start the server
    - run `npm run db:init` to create the database tables
    - run `npm run db:seed` to fill the initial database tables
    - run `npm run db:reset -- --force` to reset/clean the database tables and rebuild them
    - run `npm install @google/genai` for the API keys
    - run `npm run db:seed` to seed the database tables with fake data
    - run `npm run harness -- --model gemini-3.5-flash-lite --trials 10` to run the harness 10 times with each payload using Gemini 3.5 Flash Lite
 
- For Testing Purposes
  - run `npm run harness -- --mock --trials 3` to test the harness without real API calls
  - run `npm run harness -- --condition [] --trials 10` with [] replaced with the specific payload to run
 
Results are written to harness/results in both a csv and json file.
