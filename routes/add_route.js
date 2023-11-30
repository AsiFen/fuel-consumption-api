export default function AddRoute(fuelConsumption) {
    return {

        addCar: async (req, res) => {
            try {
                const description = req.body.description;
                const regNumber = req.body.regNumber;

                console.log(description, regNumber);
                const result = await fuelConsumption.addVehicle({ description, regNumber });

                if (result.status === "success") {
                    req.flash('success', result.message);
                    console.log(result.message);
                    res.redirect('/add')
                    // res.render('add', { carId: result.id })
                } else {
                    req.flash('error', result.message);
                    res.redirect('/add')

                }
            } catch (error) {

            }
        }

    }
}