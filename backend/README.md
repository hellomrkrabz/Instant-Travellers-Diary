# Instant-Travellers-Diary
SE project semester 5

## How to run the backend
### Steps 3 and 5 are done **ONLY ONCE**

1. Open powershell and get to the *Instant-Travellers-Diary/backend* folder
2. Type the command `Set-ExecutionPolicy Unrestricted -Scope Process`
3. Create virtual environment `python -m venv .venv`
4. Enable virtual environment `.\.venv\Scripts\Activate.ps1`
5. Download dependencies `pip install -r requirements.txt`
6. Run the site with
`flask --app flaskr --debug run`
or
`npm run start-backend`
