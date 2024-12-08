backendrun:
	cd HotelManagMentbackend &&	go run main.go conf/conf_development.yml 

frontendrun:
	cd hotelmanagmentfrontend && npm run dev
.PHONY: backendrun, frontendrun 
