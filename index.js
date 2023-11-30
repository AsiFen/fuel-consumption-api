//import express  framework
import express from 'express';
//import the handlebars engine 
import exphbs from 'express-handlebars';
//import body-parsers to handle the reading of template objects?
import bodyParser from 'body-parser';
//import express flash and session to use inconjuction for displaying error & reset messages
import flash from 'express-flash';
import session from 'express-session';

import FuelConsumption from './fuel-consumption.js';
import FuelConsumptionAPI from './fuel-consumption-api.js';

import db from './db/connect.js';

const fuelConsumption = FuelConsumption(db);
const fuelConsumptionAPI = FuelConsumptionAPI(fuelConsumption)

const app = express();

//configuring the handlebars module 
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
// initialise session middleware - flash-express depends on it
app.use(session({
    secret: "<JesusLovesYou>",
    resave: false,
    saveUninitialized: true
}));
// initialise the flash middleware
app.use(flash());
// his ensures form variables can be read from the req.body variable
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
//built-in static middleware from ExpressJS to use static resources such as my CSS
app.use(express.static('public'))
app.use(express.json());

// Define a route to display all vehicles with their details
app.get('/vehicles', async (req, res) => {
    try {
      // Get all vehicles
      const allVehicles = await fuelAPI.vehicles();
  
      // Prepare the data to display on the screen
      const vehiclesData = await Promise.all(
        allVehicles.map(async (vehicle) => {
          const { id, description } = vehicle;
  
          // Get total distance traveled
          const totalDistance = await calculateTotalDistance(id);
  
          // Get total fuel spent
          const totalFuelSpent = await calculateTotalFuelSpent(id);
  
          // Get fuel consumption
          const fuelConsumption = await calculateFuelConsumption(id);
  
          return {
            id,
            description,
            totalDistance,
            totalFuelSpent,
            fuelConsumption,
          };
        })
      );
  
      // Render the vehicles data on a screen
      res.json(vehiclesData); // You can render this data on a webpage or in any desired format
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  



app.get('/api/vehicles', fuelConsumptionAPI.vehicles);
app.get('/api/vehicle', fuelConsumptionAPI.vehicle);
app.post('/api/vehicle', fuelConsumptionAPI.addVehicle);
app.post('/api/refuel', fuelConsumptionAPI.refuel);

//process the enviroment the port is running on
let PORT = process.env.PORT || 4545;
//listen on the port - opens the port on the terminal.
app.listen(PORT, () => {
    console.log('App started...', PORT);
})
