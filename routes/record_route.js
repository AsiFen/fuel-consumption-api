
export default function RecordRoute(fuel_consumption) {
    return {

        recordCar: async (req, res) => {
            const liters = req.body.lit;
            const amount = req.body.amount;
            const distance = req.body.distance;
            let filled_up = req.body.filled_up;
            if (req.body.filled_up == 'on') {
                filled_up = true;
            } else {
                filled_up = false;
            }
            console.log(distance);
            const result = await fuel_consumption.refuel(req.params.id, liters, amount, distance, filled_up);
            // console.log(result);
            if (result.status === 'success') {
                req.flash('success', result.message);
                // console.log(result.message);

                // res.render('record', { id: result.id });
                res.redirect('/record/' + req.params.id)
            } else {
                req.flash('error', result.message);
            }
        }
    }
}