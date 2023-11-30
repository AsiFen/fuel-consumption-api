//import express  framework
import express from 'express';
//import the handlebars engine 
import exphbs from 'express-handlebars';
//import body-parsers to handle the reading of template objects?
import bodyParser from 'body-parser';
//import express flash and session to use inconjuction for displaying error & reset messages
import flash from 'express-flash';
import session from 'express-session';

import ViewRoute from './routes/view_route.js';
import AddRoute from './routes/add_route.js';
import FuelConsumption from './fuel-consumption.js';
import FuelConsumptionAPI from './fuel-consumption-api.js';

import db from './db/connect.js';
import RecordRoute from './routes/record_route.js';

const fuelConsumption = FuelConsumption(db);
const fuelConsumptionAPI = FuelConsumptionAPI(fuelConsumption)
const view_route = ViewRoute(fuelConsumption);
const add_route = AddRoute(fuelConsumption);
const record_route = RecordRoute(fuelConsumption);

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
app.get('/', view_route.show);
app.get('/add', async (req, res) => { res.render('add') })
app.post('/add', add_route.addCar)
app.post('/record/:id', record_route.recordCar)
app.get('/record/:id', async (req, res) => {
    let id = req.params.id;
    res.render('record', {id})
})

app.get('/api/vehicles', fuelConsumptionAPI.vehicles);
app.get('/api/vehicle', fuelConsumptionAPI.vehicle);
app.post('/api/vehicle', fuelConsumptionAPI.addVehicle);
app.post('/api/refuel', fuelConsumptionAPI.refuel);

//process the enviroment the port is running on
let PORT = process.env.PORT || 3000;
//listen on the port - opens the port on the terminal.
app.listen(PORT, () => {
    console.log('App started...', PORT);
})
