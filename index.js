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

// render the list of vehicles
app.get('/vehicles', async (req, res) => {
    try {
        // Fetch all vehicles and their details from the database
        const vehiclesData = await fuelConsumptionAPI.vehicles();

        // Render the vehicle data
        res.render('index', { vehicles: vehiclesData });
    } catch (error) {
        res.status(500).send('Error fetching vehicle data.');
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
