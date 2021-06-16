const form = document.querySelector('#searchForm');
form.addEventListener('submit',function(e)
{
    e.preventDefault();
    //take textfield input to generate dynamic api request url
    const origin = form.elements.origin.value;
    const destination = form.elements.destination.value;
    const outboundDate = form.elements.outboundDate.value;

    const options = {
        method: 'GET',
        url: `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browseroutes/v1.0/US/USD/en-US/${origin}/${destination}/${outboundDate}`,
        headers: {
          'x-rapidapi-key': '845445dd1fmsh56505f2abf8dd6dp141c92jsn0a2601023261',
          'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com'
        }
    };


    axios.request(options).then(function (response) {

        //airports dictionary which contains ID and airport_name pair
        let airports = {};

        //Carriers dictionary which contains carrierID and airline_name pair
        let carriers = {};


        //checks if we have a quote or there were no flights
        if("Quotes" in response.data)
        {
            //remove all child element of container before each search 
            container.innerHTML = "";

            //Add the airport to the dictionary.
            for(let place of response.data["Places"])
            {
                airports[place["PlaceId"]] = place["Name"];
            }
  
            //Add carriers to the dictionary 
            for(let airline of response.data["Carriers"])
            {
                carriers[airline["CarrierId"]] = airline["Name"];
            }

            
            for(let Quotes of response.data["Quotes"])
            {
                //extract values from JSON
                let ori = Quotes["OutboundLeg"]["OriginId"];
                let dest = Quotes["OutboundLeg"]["DestinationId"];
                let carrier = carriers[Quotes["OutboundLeg"]["CarrierIds"][0]];
                let date = Quotes["OutboundLeg"]["DepartureDate"].substring(0,10);
                let direct = Quotes["Direct"];

                //create dom elements to display flight info to user and create form for data submission
                const container = document.querySelector('#container');
                const form = document.createElement('form');
                form.setAttribute("method", "post");
                form.setAttribute("action", "/flightroutes");


                const airline = document.createElement('div');
                airline.className = "airline mt-2";
                airline.innerHTML = `Journey:  ${airports[ori]}  --> ${airports[dest]} by ${carrier}`;
                const ticketPrice = document.createElement('div');
                ticketPrice.className = "ticketPrice";
                ticketPrice.innerHTML = `Price: ${Quotes["MinPrice"]} USD `;
                const departureDate = document.createElement('div');
                departureDate.className = "departureDate";
                departureDate.innerHTML = `Depart at: ${date}`;
                const flightRouteType = document.createElement('div');
                flightRouteType.className = "flightRouteType";
                flightRouteType.innerHTML = `Direct flight: ${direct}`;
                const space = document.createElement('div');
                space.innerHTML = `*************************`;
                const button = document.createElement('button');
                button.className = "btn btn-outline-primary";
                button.innerHTML = 'Book Now';

                //hidden form input, used for sending flight info to server using form 
                const priceHidden = document.createElement('input');
                priceHidden.type = "hidden";
                priceHidden.name = "flightroute[price]";
                priceHidden.value = Quotes["MinPrice"];

                const originHidden = document.createElement('input');
                originHidden.type = "hidden";
                originHidden.name = "flightroute[origin]";
                originHidden.value = airports[ori];

                const destinationHidden = document.createElement('input');
                destinationHidden.type = "hidden";
                destinationHidden.name = "flightroute[destination]";
                destinationHidden.value = airports[dest];

                const dateHidden = document.createElement('input');
                dateHidden.type = "hidden";
                dateHidden.name = "flightroute[date]";
                dateHidden.value = date;

                const airlineHidden = document.createElement('input');
                airlineHidden.type = "hidden";
                airlineHidden.name = "flightroute[airline]";
                airlineHidden.value = carrier;

                const directHidden = document.createElement('input');
                directHidden.type = "hidden";
                directHidden.name = "flightroute[direct]";
                directHidden.value = direct;

                //append visible element
                form.appendChild(airline);
                form.appendChild(ticketPrice);
                form.appendChild(departureDate);
                form.appendChild(flightRouteType);
                form.appendChild(space);
                form.appendChild(button);

                //try to use a card to style the new elements but does not work 
                // form.appendChild(card);
                // card.appendChild(card_body);
                // card_body.appendChild(airline);
                // card_body.appendChild(ticketPrice);
                // card_body.appendChild(departureDate);
                // card_body.appendChild(flightRouteType);
                // card.appendChild(space);
                // card.appendChild(button);
                
                //append hidden input element
                form.appendChild(priceHidden);
                form.appendChild(originHidden);
                form.appendChild(destinationHidden);
                form.appendChild(dateHidden);
                form.appendChild(airlineHidden);
                form.appendChild(directHidden);

                container.appendChild(form);

                
            }
                               

        }

    }).catch(function (error) {
        console.error(error);
    });

})