const Config = require('../../models/config')


function configFn(name) {

  return Config.find().lean().then(obj => {
    const filterObj = obj.filter(objs => {
      return objs.name === name
    })
    return filterObj
  }).catch(err => console.log(err))

}


module.exports = configFn