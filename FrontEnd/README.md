# Front End

## Running the Front End
From the `FrontEnd` directory/folder, start an HTTP server.  

**Using Python:**
```
python3 -m http.server 8765  # run from FrontEnd
```
**Using JavaScript:**
```
npm install --global http-server # run once to install http-server
http-server . # run from FrontEnd
http-server . -c-1 # adding -c-1 disables caching
```