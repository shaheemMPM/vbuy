const HttpError = require('../../models/http-error');

const Shops = require('../../models/shops');

const getShopByCity = async (req, res, next) => {
    const cityName = req.params.cname;
  
    let shops;
  
    try {
      shops = await Shops.find({city : cityName});
    } catch (error) {
      return next(new HttpError('Something went wrong, could not find a shop with given place.', 500));
    }
  
    if (!shops) {
      return next(new HttpError('Could not find a shop for the provided place.', 404));
    }
  
    res.json({ shops });
  };

  exports.getShopByCity = getShopByCity;