var p1 = new Promise(function (resolve, reject) {
  setTimeout(() => {
    resolve(123);
  }, 1000)
}).then(function (data) {
  console.log(data)
})
