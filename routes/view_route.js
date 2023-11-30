export default function ViewRoute(fuelConsumption) {
    return {
        show: async (req, res) => {
            try {
                // Fetch all vehicles and their details from the database
                const vehiclesData = await fuelConsumption.vehicles();
                // Render the vehicle data
                res.render('index', { vehicles: vehiclesData });
            } catch (error) {
                res.status(500).send('Error fetching vehicle data.');
            }
        }
    }
}