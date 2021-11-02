var save = document.getElementsByClassName("save");
var favorite = document.getElementsByClassName("fas fa-heart");
// var trash = document.getElementsByClassName("fa-trash");

const deleteSaved = document.querySelectorAll(".deleteSaved")
const savedProduce = document.querySelector(".savedProduce").querySelectorAll(".produceName")
console.log(savedProduce)


Array.from(save).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.querySelector('.produceName').innerText
        const season = this.parentNode.childNodes[3].innerText

        fetch('save', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'name': name,
            'season': season
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

Array.from(favorite).forEach(function (element) {
  element.addEventListener("click", function () {
    const like = parseFloat(
      this.parentNode.parentNode.childNodes[5].innerText
    );
    console.log(like)
    fetch("like", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        like: like
      }),
    })
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((data) => {
        console.log(data);
        window.location.reload(true);
      });
  });
});

// Array.from(trash).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const name = this.parentNode.parentNode.childNodes[1].innerText
//         const msg = this.parentNode.parentNode.childNodes[3].innerText
//         fetch('messages', {
//           method: 'delete',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             'name': name,
//             'msg': msg
//           })
//         }).then(function (response) {
//           window.location.reload()
//         })
//       });
// });

deleteSaved.forEach((element, index) => {
  element.addEventListener('click', function(){

    fetch('deleteSavedProduce', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        produceName : savedProduce[index].innerText
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
})
