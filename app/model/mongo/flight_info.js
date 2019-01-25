'use strict'
module.exports = app => {
  const dayjs = require('dayjs')
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const terminalSchema = new Schema({
    id: {
      type: Number
    },
    name: {
      type: String
    },
    shortName: {
      type: String
    },
  })

  const airportInfoSchema = new Schema({
    cityTlc: {
      type: String
    },
    cityName: {
      type: String
    },
    airportTlc: {
      type: String
    },
    airportName: {
      type: String
    },
    terminal: terminalSchema
  })

  const stopInfoSchema = new Schema({
    dateRange: {
      startDate: {
        type: Date
      },
      endDate: {
        type: Date
      }
    },
    cityCode: String,
    cityName: String
  })

  const refundEndorseSchema = new Schema({
    rcKey: String,
    refundFeeFormulaId: String,
    minRefundFee: Number,
    minEndorseFee: Number,
    refundRuleFlag: String,
    refundNote: String,
    endorseRuleFlag: String,
    endorseNote: String,
    changeRuleFlag: String,
    changeRuleId: String,
    changeNote: String,
    remark: String,
    serviceLevel: Number,
    productInfoList: [String]
  })

  const cabinSchema = new Schema({
    salePrice: Number,
    price: Number,
    cabinClass: String,
    priceClass: String,
    rate: Number,
    seatCount: Number,
    specialClassName: String,
    refundEndorse: refundEndorseSchema
  })



  const flightInfoSchema = new Schema({
    airlineName: {
      type: String
    },
    airlineCode: {
      type: String
    },
    craftTypeName: {
      type: String
    },
    flightNumber: {
      type: String
    },
    departureAirportInfo: airportInfoSchema,
    arrivalAirportInfo: airportInfoSchema,
    departureDate: {
      type: Date
    },
    arrivalDate: {
      type: Date
    },
    stopInfo: [stopInfoSchema],
    cabins: [cabinSchema],
    getTime: Date
  })

  // 查询所有收录的航司
  flightInfoSchema.statics.getAllCompanies = async function() {

    const airlineCodeList = await this.distinct('airlineCode')

    const resPromise = airlineCodeList.map(async (element, index) => {
      return await this.findOne({
          'airlineCode':element
        },
        {
          'airlineName': 1,
          'airlineCode': 1,
          '_id': 0
        })

    })

    const res = await Promise.all(resPromise)

    return res
  }

// Defines a pre hook for the document.
  flightInfoSchema.pre('save', function(next) {
    next()
  })

  return mongoose.model('flight_info', flightInfoSchema)
}


