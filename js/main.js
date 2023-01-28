const cart = document.querySelector(".cart");
const btnSave = document.querySelector(".add_new");
const table1 = document.getElementById("table1");
const table2 = document.getElementById("table2");
const priceTotal = document.querySelector(".price_result");
const list = document.querySelector(".list");

if (!localStorage.getItem("goods")) {
  localStorage.setItem("goods", JSON.stringify([]));
}

const myModal = new bootstrap.Modal(document.getElementById("exampleModal"), {
  keyboard: false,
});

//описание поиского запроса
const options = {
  valueNames: ["name", "price"],
};

let userList = {};

//событие кнопки модального окна

btnSave.addEventListener("click", (e) => {
  let name = document.getElementById("good_name").value;
  let price = document.getElementById("good_price").value;
  let count = document.getElementById("good_count").value;

  //добавление объекта в localstorage
  if (name && price && count) {
    document.getElementById("good_name").value = "";
    document.getElementById("good_price").value = "";
    document.getElementById("good_count").value = 1;

    let goods = JSON.parse(localStorage.getItem("goods"));
    goods.push(["good_" + goods.length, name, price, count, 0, 0, 0]);
    localStorage.setItem("goods", JSON.stringify(goods));

    updateGoods();
    myModal.hide();
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
    });
  }
});

updateGoods();

//функция обновления товаров
function updateGoods() {
  let resultPrice = 0;
  let tbody = document.querySelector(".list");
  tbody.innerHTML = "";
  cart.innerHTML = "";

  let goods = JSON.parse(localStorage.getItem("goods"));
  if (goods.length) {
    table1.hidden = false;
    table2.hidden = false;

    //добавление html кода товаров
    for (let i = 0; i < goods.length; i++) {
      tbody.insertAdjacentHTML(
        "beforeend",
        `
      <tr class="align-middle">
        <td>${i + 1}</td>
        <td class="name">${goods[i][1]}</td>
        <td class="price">${goods[i][2]}</td>
        <td>${goods[i][3]}</td>
        <td><button class="good_delete btn-danger" data-delete="${
          goods[i][0]
        }">&#10006;</button></td>
        <td><button class="good_delete btn-primary" data-goods="${
          goods[i][0]
        }">&#10149;</button></td>
      </tr>
      `
      );
      if (goods[i][4] > 0) {
        goods[i][6] =
          goods[i][4] * goods[i][2] -
          goods[i][4] * goods[i][2] * goods[i][5] * 0.01;
        resultPrice += goods[i][6];
        cart.insertAdjacentHTML(
          "beforeend",
          `
        <tr class="align-middle">
          <td>${i + 1}</td>
          <td class="price_name">${goods[i][1]}</td>
          <td class="price_one">${goods[i][2]}</td>
          <td class="price_count">${goods[i][4]}</td>
          <td class="price_discount"><input data-goodid="${
            goods[i][0]
          }" type="text" value="${goods[i][5]}" min="0" max="100"></td>
          <td>${goods[i][6]}</td>
          <td><button class="good_delete btn-danger" data-delete="${
            goods[i][0]
          }">&#10006;</button></td>
        </tr>
        `
        );
      }
    }
    //поиск
    userList = new List("goods", options);
  } else {
    table1.hidden = true;
    table2.hidden = true;
  }
  priceTotal.innerHTML = resultPrice + " &#8381";
}
//кнопка удаление
list.addEventListener("click", (e) => {
  //если клик не по этому эл
  if (!e.target.dataset.delete) {
    return;
  } 
  //иначе диалоговое окно 
  else {
    Swal.fire({
      title: "Внимание!",
      text: "Вы действительно хотите удалить товар?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Да",
      cancelButtonText: "Отмена",
    }).then((result)=> {
        if(result.isConfirmed) {
            let goods = JSON.parse(localStorage.getItem('goods'))
            for(let i=0; i<goods.length;i++) {
                if(goods[i][0] == e.target.dataset.delete) {
                    goods.splice(i,1)
                    localStorage.setItem('goods', JSON.stringify(goods))
                    updateGoods()
                }
            }
            Swal.fire('Удалено!',
            'Выбраный товар был успешно удален.',
            'success')
        }
    })
  }
});


list.addEventListener("click", (e) => {
  //если клик не по этому эл
  if (!e.target.dataset.goods) {
    return;
  } 
  let goods = JSON.parse(localStorage.getItem('goods'))
  for(let i=0; i<goods.length; i++) {
    if(goods[i][3]> 0 && goods[i][0]== e.target.dataset.goods) {
      goods[i].splice(3,1, goods[i][3]-1)
      goods[i].splice(4,1, goods[i][4]+1)
      localStorage.setItem('goods', JSON.stringify(goods))
      updateGoods()
    }
  }
})

cart.addEventListener("click", (e) => {
  //если клик не по этому эл
  if (!e.target.dataset.delete) {
    return;
  } 
  let goods = JSON.parse(localStorage.getItem('goods'))
  for(let i=0; i<goods.length; i++) {
    if(goods[i][4]> 0 && goods[i][0]== e.target.dataset.delete) {
      goods[i].splice(3,1, goods[i][3]+1)
      goods[i].splice(4,1, goods[i][4]-1)
      localStorage.setItem('goods', JSON.stringify(goods))
      updateGoods()
    }
  }
})

table1.onclick = function (e) {
  if (e.target.tagName != 'TH') return;
  let th = e.target;
  sortTable(th.cellIndex, th.dataset.type, 'table1');
};
/* Сортировка таблицы справа */
table2.onclick = function (e) {
  if (e.target.tagName != 'TH') return;
  let th = e.target;
  sortTable(th.cellIndex, th.dataset.type, 'table2');
};


table1.onclick = function (e) {
  if (e.target.tagName != 'TH') return;
  let th = e.target;
  sortTable(th.cellIndex, th.dataset.type, 'table1');
};
/* Сортировка таблицы справа */
table2.onclick = function (e) {
  if (e.target.tagName != 'TH') return;
  let th = e.target;
  sortTable(th.cellIndex, th.dataset.type, 'table2');
};

function sortTable(colNum, type, id) {
  let elem = document.getElementById(id)
  let tbody = elem.querySelector('tbody');
  let rowsArray = Array.from(tbody.rows);
  let compare;
  switch (type) {
    case 'number':
      compare = function (rowA, rowB) {
        return rowA.cells[colNum].innerHTML - rowB.cells[colNum].innerHTML;
      };
      break;
    case 'string':
      compare = function (rowA, rowB) {
        return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? 1 : -1;
      };
      break;
  }
  rowsArray.sort(compare);
  tbody.append(...rowsArray);
}
