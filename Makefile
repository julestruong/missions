
voila : 
	docker build -t "julio/missions:v2" .
	kubectl delete deployment julio-missions
	kubectl create -f kubernetes/deployment.yaml