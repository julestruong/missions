# bap-mission

# Ref doc 
https://cloud.google.com/appengine/docs/flexible/nodejs/using-cloud-sql-postgres

# Pour tester en local

Pour lancer le serveur : npm start
Lancer le proxy : ./cloud_sql_proxy -instances=mission-bap:europe-west1:mission-bap-pg=tcp:5432 -credential_file=./mission-bap-517a3afbc3b6.json
Tester : curl -X POST \
  http://localhost:8080/slack/missions 

Pour tester le formattage de message sur slack : https://api.slack.com/docs/messages/builder