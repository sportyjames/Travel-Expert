const axios = require('axios')

var imgApi;
var picture_1;
var picture_2;
var picture_3;
var picture_4;
var collection = [];

//this is when user skip the searchbar so the default city will be houston
module.exports.index = async (req,res) => {
    if(collection.length == 0){
        let city = 'Houston';
        imgApi = await axios.get(`https://api.unsplash.com/search/photos?query=${city}&client_id=TFhu6RR7b5Ts2qtiboVZfSWWNjHsWx0gm12zaQZMr6I`);
        picture_1 = imgApi['data']['results'][0]['urls'].raw;
        picture_2 = imgApi['data']['results'][1]['urls'].raw;
        picture_3 = imgApi['data']['results'][2]['urls'].raw;
        picture_4 = imgApi['data']['results'][3]['urls'].raw;
        collection = [city, picture_1, picture_2, picture_3, picture_4];
    }
    res.render('city/picture', {collection})
}

module.exports.fetchPicture = async (req,res) => {
    var city = req.body.cityName;
    imgApi = await axios.get(`https://api.unsplash.com/search/photos?query=${city}&client_id=TFhu6RR7b5Ts2qtiboVZfSWWNjHsWx0gm12zaQZMr6I`);
    picture_1 = imgApi['data']['results'][0]['urls'].raw;
    picture_2 = imgApi['data']['results'][1]['urls'].raw;
    picture_3 = imgApi['data']['results'][2]['urls'].raw;
    picture_4 = imgApi['data']['results'][3]['urls'].raw;
    collection = [city, picture_1, picture_2, picture_3, picture_4];
    res.render('city/picture', { collection })
}