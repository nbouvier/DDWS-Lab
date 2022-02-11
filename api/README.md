# Authentication
## Login
**Type:** POST\
**Access point:** /api/auth/login\
**Params:** email, password\
**Succeed value:** { result: true, message: \<message\> }\
**Failed value:** { error: \<error\> }
## Register
**Type:** POST\
**Access point:** /api/auth/register\
**Params:** first_name, last_name, email, password\
**Returned value:** { result: true, message: \<message\> }\
**Failed value:** { error: \<error\> }
## Logout
**Type:** POST\
**Access point:** /api/auth/logout
# User
## Get logged user
**Type:** POST\
**Access point:** /api/user/get\
**Returned value:** { result: { user: \<user\> }, message: \<message\> }\
**Failed value:** { error: \<error\> }
## Get user by id
**Type:** POST\
**Access point:** /api/user/one\
**Params:** id\
**Returned value:** { result: { user: \<user\> }, message: \<message\> }\
**Failed value:** { error: \<error\> }
## Get all users
**Type:** POST\
**Access point:** /api/user/all\
**Returned value:** { result: { users: \<user\>[] }, message: \<message\> }\
**Failed value:** { error: \<error\> }
### Get user by house id
**Type:** POST\
**Access point:** /api/user/from-house\
**Params:** id\
**Returned value:** { result: { user: \<user\> }, message: \<message\> }\
**Failed value:** { error: \<error\> }
## Update user’s profile
**Type:** POST
**Access point:** /api/user/update-profile\
**Params:** name, forename, address, additional_address, city, zip_code\
**Returned value:** { result: { user: \<user\> }, message: \<message\> }\
**Failed value:** { error: \<error\> }
## Update user’s security informations
**Type:** POST\
**Access point:** /api/user/update-security\
**Params:** email\
**Returned value:** { result: { user: \<user\> }, message: \<message\> }\
**Failed value:** { error: \<error\> }
## Block user from selling to the market
**Type:** POST\
**Access point:** /api/user/block\
**Params:** user_id, time, time_unit\
**Returned value:** { result: true, message: \<message\> }\
**Failed value:** { error: \<error\> }
## Delete user
**Type:** POST\
**Access point:** /api/user/delete\
**Params:** user_id\
**Returned value:** { result: true, message: \<message\> }\
**Failed value:** { error: \<error\> }
# House
## Get house by id
**Type:** POST\
**Access point:** /api/house/one\
**Params:** id\
**Returned value:** { result: { house: \<house\> }, message: \<message\> }\
**Failed value:** { error: \<error\> }
## Get house’s production
**Type:** POST\
**Access point:** /api/house/production\
**Params:** id [, from]\
**Returned value:** { result: { production: [\<timestamp\>, \<production\>][] }, message: \<message\> }\
**Failed value:** { error: \<error\> }
## Get house’s consumption
**Type:** POST\
**Access point:** /api/house/consumption\
**Params:** id [, from]\
**Returned value:** { result:  { consumption: [\<timestamp\>, \<consumption\>][] }, message: \<message\> }\
**Failed value:** { error: \<error\> }
## Update house’s excessive production
**Type:** POST\
**Access point:** /api/house/update-excessive-production\
**Params:** id, to_buffer_percentage\
**Returned value:** { result: { house: \<house\> }, message: \<message\> }\
**Failed value:** { error: \<error\> }
## Update house’s under production
**Type:** POST\
**Access point:** /api/house/update-under-production\
**Params:** id, from_buffer_percentage\
**Returned value:** { result: { house: \<house\> }, message: \<message\> }\
**Failed value:** { error: \<error\> }
# CoalPowerPlant
## Get coal power plant by id
**Type:** POST\
**Access point:** /api/coal-power-plant/one\
**Params:** id\
**Returned value:** { result: { coal_power_plant: \<coalPowerPlant\> }, message: \<message\> }\
**Failed value:** { error: \<error\> }
## Get coal power plant’s production
**Type:** POST\
**Access point:** /api/coal-power-plant/production\
**Params:** id [, from]\
**Returned value:** { result: { production: [\<timestamp\>, \<production\>][] }, message: \<message\> }\
**Failed value:** { error: \<error\> }
## Update coal power plant’s production
**Type:** POST\
**Access point:** /api/coal-power-plant/update-production\
**Params:** id, buffer_percentage\
**Returned value:** { result: { coal_power_plant: \<coalPowerPlant\> }, message: \<message\> }\
**Failed value:** { error: \<error\> }
## Stop coal power plant
**Type:** POST\
**Access point:** /api/coal-power-plant/stop\
**Params:** id\
**Returned value:** { result: { running: false }, message: \<message\> }\
**Failed value:** { error: \<error\> }
## Start coal power plant
**Type:** POST\
**Access point:** /api/coal-power-plant/start\
**Params:** id\
**Returned value:** { result: { running: true }, message: \<message\> }\
**Failed value:** { error: \<error\> }
# Market
## Set electricity price
**Type:** POST\
**Access point:** /api/market/set-price\
**Params:** price\
**Returned value:** { result: { price: \<price\> }, message: \<message\> }\
**Failed value:** { error: \<error\> }
## Get electricity price
**Type:** POST\
**Access point:** /api/market/price\
**Params:** [from]\
**Returned value:** { result: { price: [\<timestamp\>, \<price\>][] }, message: \<message\> }\
**Failed value:** { error: \<error\> }\
## Get modeled electricity price
**Type:** POST\
**Access point:** /api/market/modeled-price\
**Params:** [from]\
**Returned value:** { result: { modeled_price: [\<timestamp\>, \<modeled_price\>][] }, message: \<message\> }\
**Failed value:** { error: \<error\> }
## Get orders
**Type:** POST\
**Access point:** /api/market/orders\
**Returned value:** { result: { orders: \<orders\>[] }, message: \<message\> }\
**Failed value:** { error: \<error\> }\
## Sell electricity to the market
**Type:** POST\
**Access point:** /api/market/sell\
**Params:** house_id, amount\
**Returned value:** { result: { amount: \<amount\> }, message: \<message\> }\
**Failed value:** { error: \<error\> }
## Buy electricity from the market
**Type:** POST\
**Access point:** /api/market/buy\
**Params:** house_id, amount\
**Returned value:** { result: { amount: \<amount\> }, message: \<message\> \
**Failed value:** { error: \<error\> }
# Weather
## Get wind speed
**Type:** POST\
**Access point:** /api/weather/wind\
**Params:** [from]\
**Returned value:** { result: { wind: [\<timestamp\>, \<speed\>][] }, message: \<message\> }\
**Failed value:** { error: \<error\> }
