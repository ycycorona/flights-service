'use strict';
const Base = require('./base_controller');
const dayjs = require('dayjs')
class FlightsInfoController extends Base {
  // 查询同一天票价，随日期变化的趋势
  async oneDayPriceAmongTime() {
    const { ctx } = this;
    const rule = {
      departureAirportTlc: { type: 'string', required: true },
      arrivalAirportTlc: { type: 'string', required: true},
      fromDate: {type: 'date', required: true},
      airlineCodeList: {type: 'array', required: true},
      watchDate: {
        type: 'array',
        itemType: 'date',
        min: 2,
        max: 2
      }
    }

    ctx.validate(rule, ctx.request.body)
    const reqBody = ctx.request.body

    const dTimeStart = dayjs(reqBody.fromDate).startOf('day').toDate()
    const dTimeEnd = dayjs(reqBody.fromDate).endOf('day').toDate()
    const getTimeStart = dayjs(reqBody.watchDate[0]).startOf('day').toDate()
    const getTimeEnd = dayjs(reqBody.watchDate[1]).endOf('day').toDate()
    const findParams = {
      'departureDate': {'$gte': dTimeStart, '$lte': dTimeEnd},
      'airlineCode': {'$in': reqBody.airlineCodeList},
      'departureAirportInfo.airportTlc': reqBody.departureAirportTlc,
      'arrivalAirportInfo.airportTlc': reqBody.arrivalAirportTlc,
      'getTime': {'$gte': getTimeStart, '$lte': getTimeEnd}
    }
    const flightInfoService = ctx.service.flightsInfoService

    const res = await flightInfoService.getOneDayPriceAmongTime(findParams)
    const res_arranged = flightInfoService.arrayOneDayPriceGetLowPrice(res)
    console.log(res.length)
    ctx.body = res_arranged
  }

  async findByQuery() {
    const { ctx } = this
    const dTimeStart = dayjs('2019-01-20').startOf('day').toDate()
    const dTimeEnd = dayjs('2019-01-20').endOf('day').toDate()
    const getTimeStart = dayjs('2019-01-18').startOf('day').toDate()
    const getTimeEnd = dayjs('2019-01-18').endOf('day').toDate()

    const res = await this.ctx.model.Mongo.FlightInfo.find(
      {
        'departureDate': {'$gte': dTimeStart, '$lte': dTimeEnd},
        'airlineCode': {'$in': ['QW']},
        'departureAirportInfo.airportTlc': 'TAO',
        'arrivalAirportInfo.airportTlc': 'CTU',
        'getTime': {'$gte': getTimeStart, '$lte': getTimeEnd},
        'sharedFlightNumber': {'$not': {'$in': ['']}}
      },
      {
        'airlineName': 1,
        'airlineCode': 1,
        'craftTypeName': 1,
        'flightNumber': 1,
        'sharedFlightNumber': 1,
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
      }
    )

    ctx.body = res
  }

  // 根据用户名获取用户信息
  async getUserInfoByUserName() {
/*    const { ctx } = this;
    const userName = ctx.params.userName;
    const rule = {
      userName: { type: 'string' },
    };
    ctx.validate(rule, ctx.params);
    const userInfo = await ctx.service.userService.getUserInfoByUserName(userName);
    ctx.body = userInfo;*/
  }

}

module.exports = FlightsInfoController;
