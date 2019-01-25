'use strict'
module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const flightRouteSchema = new Schema({
    departureAirportInfo: {
      airportTlc: {type: String},
      cityName: {type: String},
      cityTlc: {type: String},
      airportName: {type: String}
    },
    arrivalAirportInfo: {
      airportTlc: {type: String},
      cityName: {type: String},
      cityTlc: {type: String},
      airportName: {type: String}
    }
  })

  // 查询所有收录的航线
  flightRouteSchema.statics.getRoutes = async function() {

    const res = await this.find({},
      {
        '_id': 0,
        '__v': 0
      }).sort({'departureAirportInfo.airportTlc':1})

    return res
  }

// Defines a pre hook for the document.
  flightRouteSchema.pre('save', function(next) {
    next()
  })

  return mongoose.model('flight_routes', flightRouteSchema)
}

