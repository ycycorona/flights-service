const Service = require('egg').Service;
const dayjs = require('dayjs')
class flightsInfoService extends Service {

  get flightsInfoModel() {
    return this.ctx.model.Mongo.FlightInfo
  }

  async getOneDayPriceAmongTime(findParams) {
    const selectListServiceRes = {
      flag: false,
      error: '',
      errorMsg: '',
      data: {},
    }

    const res = await this.flightsInfoModel.find(findParams,
      {
        'airlineName': 1,
        'airlineCode': 1,
        'craftTypeName': 1,
        'flightNumber': 1,
        'departureAirportInfo.airportTlc': 1,
        'departureAirportInfo.airportName': 1,
        'arrivalAirportInfo.airportTlc': 1,
        'arrivalAirportInfo.airportName': 1,
        'departureDate': 1,
        'arrivalDate': 1,
        'cabins.salePrice': 1,
        'cabins.price': 1,
        'cabins.cabinClass': 1,
        'cabins.priceClass': 1,
        'cabins.rate': 1,
        'cabins.seatCount': 1,
        'getTime': 1,
        //'cabins.refundEndorse': 0
      }).sort({'airlineCode': 1, 'getTime': 1})

    return res
  }

  // 获取每个仓位的最低价格
  arrayOneDayPriceGetLowPrice(list=[]) {
    const arranged = {}
    let currentAirlineCode = ''
    let currentCabinClass = ''
    list.forEach((item) => {
      currentAirlineCode = item.airlineCode

      if (!arranged[currentAirlineCode]) {
        arranged[currentAirlineCode] = {
          cabins: {},
          departureDate: dayjs(item.departureDate).format('YYYY-MM-DD HH:mm:ss'),
          arrivalDate: dayjs(item.arrivalDate).format('YYYY-MM-DD HH:mm:ss')
        }
      }
      const pushMark = {}
      item.cabins.forEach((cabin) => {
        currentCabinClass = cabin.cabinClass

        if (!arranged[currentAirlineCode]['cabins'][currentCabinClass]) {
          arranged[currentAirlineCode]['cabins'][currentCabinClass] = []
        }

        if (!pushMark[currentCabinClass]) {
          arranged[currentAirlineCode]['cabins'][currentCabinClass].push({
            getTime: dayjs(item.getTime).format('YYYY-MM-DD HH:mm:ss'),
            salePrice: cabin.salePrice
          })
          pushMark[currentCabinClass] = true
        } else {
          const arrayLastindex = arranged[currentAirlineCode]['cabins'][currentCabinClass].length - 1
          if (arranged[currentAirlineCode]['cabins'][currentCabinClass][arrayLastindex].salePrice > cabin.salePrice) {
            arranged[currentAirlineCode]['cabins'][currentCabinClass][arrayLastindex].salePrice = cabin.salePrice
          }
        }
      })
    })
    return arranged
  }

  async find(uid) {

  }

}

module.exports = flightsInfoService;
