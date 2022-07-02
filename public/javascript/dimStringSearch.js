const dimStringSearch = (obj, keyWord) => {
  const compare = obj.slice(0, keyWord.length).trim().toLowerCase() === keyWord.trim().toLowerCase().slice(0, keyWord.length)
  if (!compare) {
    return false
  } else {
    return true
  }
}

module.exports = dimStringSearch